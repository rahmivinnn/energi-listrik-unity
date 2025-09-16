import express from 'express';
import Game from '../models/Game.js';
import Score from '../models/Score.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/games
// @desc    Get all games
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      type, 
      difficulty, 
      level, 
      isUnlocked, 
      page = 1, 
      limit = 10,
      sortBy = 'level',
      sortOrder = 'asc'
    } = req.query;

    // Build filter
    const filter = { isActive: true };
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    
    if (level) {
      filter.level = parseInt(level);
    }

    // If user is authenticated, check unlocked status
    if (req.user && isUnlocked !== undefined) {
      filter.isUnlocked = isUnlocked === 'true';
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const games = await Game.find(filter)
      .populate('createdBy', 'username')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-gameData');

    const total = await Game.countDocuments(filter);

    res.json({
      success: true,
      data: {
        games,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/games/:id
// @desc    Get single game
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('requirements.previousGames', 'name type level');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Get user's best score for this game if authenticated
    let userBestScore = null;
    if (req.user) {
      userBestScore = await Score.findOne({
        user: req.user._id,
        game: game._id
      }).sort({ score: -1 });
    }

    res.json({
      success: true,
      data: {
        game,
        userBestScore
      }
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/games/:id/leaderboard
// @desc    Get game leaderboard
// @access  Public
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const gameId = req.params.id;

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const leaderboard = await Score.find({ game: gameId })
      .populate('user', 'username avatar level')
      .sort({ score: -1, timeSpent: 1 })
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
        leaderboard
      }
    });
  } catch (error) {
    console.error('Game leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/games/types/stats
// @desc    Get game type statistics
// @access  Public
router.get('/types/stats', async (req, res) => {
  try {
    const stats = await Game.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalLevels: { $sum: '$level' },
          difficulties: { $addToSet: '$difficulty' },
          averageLevel: { $avg: '$level' }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          totalLevels: 1,
          difficulties: 1,
          averageLevel: { $round: ['$averageLevel', 2] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Game types stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/games/:id/unlock
// @desc    Unlock a game
// @access  Private
router.post('/:id/unlock', protect, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Check if user meets requirements
    const user = await User.findById(req.user._id);
    
    if (user.level < game.requirements.minLevel) {
      return res.status(400).json({
        success: false,
        message: `You need to be level ${game.requirements.minLevel} to unlock this game`
      });
    }

    // Check if previous games are completed
    if (game.requirements.previousGames.length > 0) {
      const completedPreviousGames = await Score.find({
        user: req.user._id,
        game: { $in: game.requirements.previousGames },
        completed: true
      });

      if (completedPreviousGames.length < game.requirements.previousGames.length) {
        return res.status(400).json({
          success: false,
          message: 'You need to complete previous games first'
        });
      }
    }

    // Unlock the game
    game.isUnlocked = true;
    await game.save();

    res.json({
      success: true,
      message: 'Game unlocked successfully',
      data: {
        game
      }
    });
  } catch (error) {
    console.error('Unlock game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;