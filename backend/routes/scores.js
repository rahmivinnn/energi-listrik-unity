import express from 'express';
import { body, validationResult } from 'express-validator';
import Score from '../models/Score.js';
import Game from '../models/Game.js';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/scores
// @desc    Submit game score
// @access  Private
router.post('/', protect, [
  body('gameId')
    .isMongoId()
    .withMessage('Valid game ID is required'),
  body('score')
    .isNumeric()
    .withMessage('Score must be a number')
    .isFloat({ min: 0 })
    .withMessage('Score must be non-negative'),
  body('timeSpent')
    .isNumeric()
    .withMessage('Time spent must be a number')
    .isFloat({ min: 0 })
    .withMessage('Time spent must be non-negative'),
  body('level')
    .isInt({ min: 1 })
    .withMessage('Level must be a positive integer'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { gameId, score, timeSpent, level, difficulty, gameData } = req.body;

    // Get game details
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Check if game is unlocked
    if (!game.isUnlocked) {
      return res.status(400).json({
        success: false,
        message: 'Game is not unlocked'
      });
    }

    const maxScore = game.maxScore;
    const percentage = Math.round((score / maxScore) * 100);
    const completed = percentage >= 70; // 70% to complete
    const perfectScore = percentage === 100;

    // Calculate energy points earned
    let energyPointsEarned = 0;
    if (completed) {
      energyPointsEarned = Math.round((percentage / 100) * game.energyPoints);
    }

    // Create score record
    const scoreRecord = await Score.create({
      user: req.user._id,
      game: gameId,
      score,
      maxScore,
      percentage,
      timeSpent,
      energyPointsEarned,
      level,
      difficulty,
      completed,
      perfectScore,
      gameData: gameData || {},
      deviceInfo: {
        userAgent: req.get('User-Agent'),
        platform: req.get('Platform') || 'Unknown'
      }
    });

    // Update user statistics
    const user = await User.findById(req.user._id);
    user.totalScore += score;
    user.gamesPlayed += 1;
    user.experience += energyPointsEarned;
    
    // Check for level up
    const newLevel = Math.floor(user.experience / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }
    
    await user.save();

    // Check for achievements
    const achievements = await checkAchievements(user._id, scoreRecord);

    // Populate the score record
    await scoreRecord.populate('game', 'name type difficulty level');

    res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: {
        score: scoreRecord,
        achievements,
        userLevel: user.level,
        experience: user.experience,
        energyPointsEarned
      }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/scores/my-scores
// @desc    Get current user's scores
// @access  Private
router.get('/my-scores', protect, async (req, res) => {
  try {
    const { 
      gameId, 
      gameType, 
      difficulty, 
      completed, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    
    if (gameId) {
      filter.game = gameId;
    }
    
    if (gameType && gameType !== 'all') {
      filter['game.type'] = gameType;
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scores = await Score.find(filter)
      .populate('game', 'name type difficulty level')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Score.countDocuments(filter);

    res.json({
      success: true,
      data: {
        scores,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/scores/game/:gameId
// @desc    Get scores for a specific game
// @access  Public
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10, sortBy = 'score', sortOrder = 'desc' } = req.query;

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const scores = await Score.find({ game: gameId })
      .populate('user', 'username avatar level')
      .sort(sort)
      .limit(parseInt(limit))
      .select('score percentage timeSpent completed perfectScore createdAt user');

    res.json({
      success: true,
      data: {
        game: {
          _id: game._id,
          name: game.name,
          type: game.type,
          difficulty: game.difficulty,
          level: game.level
        },
        scores
      }
    });
  } catch (error) {
    console.error('Get game scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/scores/statistics
// @desc    Get score statistics
// @access  Public
router.get('/statistics', async (req, res) => {
  try {
    const { gameType, difficulty, timeRange = 'all' } = req.query;

    // Build date filter
    let dateFilter = {};
    if (timeRange !== 'all') {
      const now = new Date();
      switch (timeRange) {
        case 'day':
          dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
          break;
        case 'week':
          dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
          break;
        case 'month':
          dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
          break;
      }
    }

    // Build filter
    const filter = { ...dateFilter };
    
    if (gameType && gameType !== 'all') {
      filter['game.type'] = gameType;
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    const stats = await Score.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalScores: { $sum: 1 },
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          completedGames: { $sum: { $cond: ['$completed', 1, 0] } },
          perfectScores: { $sum: { $cond: ['$perfectScore', 1, 0] } },
          totalTimeSpent: { $sum: '$timeSpent' },
          totalEnergyPoints: { $sum: '$energyPointsEarned' }
        }
      },
      {
        $project: {
          _id: 0,
          totalScores: 1,
          totalScore: 1,
          averageScore: { $round: ['$averageScore', 2] },
          highestScore: 1,
          completedGames: 1,
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ['$completedGames', '$totalScores'] }, 100] },
              2
            ]
          },
          perfectScores: 1,
          perfectScoreRate: {
            $round: [
              { $multiply: [{ $divide: ['$perfectScores', '$totalScores'] }, 100] },
              2
            ]
          },
          totalTimeSpent: 1,
          totalEnergyPoints: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statistics: stats[0] || {
          totalScores: 0,
          totalScore: 0,
          averageScore: 0,
          highestScore: 0,
          completedGames: 0,
          completionRate: 0,
          perfectScores: 0,
          perfectScoreRate: 0,
          totalTimeSpent: 0,
          totalEnergyPoints: 0
        }
      }
    });
  } catch (error) {
    console.error('Get score statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to check achievements
async function checkAchievements(userId, scoreRecord) {
  const achievements = [];
  
  // Get user's current stats
  const userStats = await Score.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalScores: { $sum: 1 },
        totalScore: { $sum: '$score' },
        perfectScores: { $sum: { $cond: ['$perfectScore', 1, 0] } },
        completedGames: { $sum: { $cond: ['$completed', 1, 0] } }
      }
    }
  ]);

  const stats = userStats[0] || { totalScores: 0, totalScore: 0, perfectScores: 0, completedGames: 0 };

  // Check for various achievements
  const achievementCriteria = [
    { type: 'score', value: 1000, name: 'First Thousand' },
    { type: 'score', value: 10000, name: 'Score Master' },
    { type: 'perfect_scores', value: 1, name: 'Perfectionist' },
    { type: 'perfect_scores', value: 10, name: 'Perfect Ten' },
    { type: 'games_played', value: 10, name: 'Dedicated Player' },
    { type: 'games_played', value: 50, name: 'Game Enthusiast' },
    { type: 'completion', value: 5, name: 'Finisher' },
    { type: 'completion', value: 20, name: 'Completionist' }
  ];

  for (const criteria of achievementCriteria) {
    let achieved = false;
    
    switch (criteria.type) {
      case 'score':
        achieved = stats.totalScore >= criteria.value;
        break;
      case 'perfect_scores':
        achieved = stats.perfectScores >= criteria.value;
        break;
      case 'games_played':
        achieved = stats.totalScores >= criteria.value;
        break;
      case 'completion':
        achieved = stats.completedGames >= criteria.value;
        break;
    }

    if (achieved) {
      // Check if user already has this achievement
      const existingAchievement = await Achievement.findOne({ name: criteria.name });
      if (existingAchievement) {
        const user = await User.findById(userId);
        if (!user.achievements.includes(existingAchievement._id)) {
          user.achievements.push(existingAchievement._id);
          await user.save();
          achievements.push(existingAchievement);
        }
      }
    }
  }

  return achievements;
}

export default router;