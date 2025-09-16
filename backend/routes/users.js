import express from 'express';
import User from '../models/User.js';
import Score from '../models/Score.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'totalScore', limit = 10, gameType } = req.query;

    let matchStage = {};
    if (gameType && gameType !== 'all') {
      matchStage['game.type'] = gameType;
    }

    const leaderboard = await Score.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
          perfectScores: { $sum: { $cond: ['$perfectScore', 1, 0] } },
          lastPlayed: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            username: '$user.username',
            avatar: '$user.avatar',
            level: '$user.level'
          },
          totalScore: 1,
          gamesPlayed: 1,
          averageScore: { $round: ['$averageScore', 2] },
          perfectScores: 1,
          lastPlayed: 1
        }
      },
      { $sort: { [type]: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        leaderboard,
        type,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/stats/:userId
// @desc    Get user statistics
// @access  Public
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('username avatar level experience totalScore gamesPlayed');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = await Score.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
          perfectScores: { $sum: { $cond: ['$perfectScore', 1, 0] } },
          totalTimeSpent: { $sum: '$timeSpent' },
          energyPointsEarned: { $sum: '$energyPointsEarned' },
          gamesByType: {
            $push: {
              type: '$game.type',
              score: '$score',
              completed: '$completed'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalScore: 1,
          gamesPlayed: 1,
          averageScore: { $round: ['$averageScore', 2] },
          perfectScores: 1,
          perfectScoreRate: {
            $round: [
              { $multiply: [{ $divide: ['$perfectScores', '$gamesPlayed'] }, 100] },
              2
            ]
          },
          totalTimeSpent: 1,
          energyPointsEarned: 1,
          gamesByType: 1
        }
      }
    ]);

    const gameTypeStats = await Score.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$game.type',
          count: { $sum: 1 },
          totalScore: { $sum: '$score' },
          averageScore: { $avg: '$score' },
          perfectScores: { $sum: { $cond: ['$perfectScore', 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          totalScore: 1,
          averageScore: { $round: ['$averageScore', 2] },
          perfectScores: 1,
          perfectScoreRate: {
            $round: [
              { $multiply: [{ $divide: ['$perfectScores', '$count'] }, 100] },
              2
            ]
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        user,
        stats: stats[0] || {
          totalScore: 0,
          gamesPlayed: 0,
          averageScore: 0,
          perfectScores: 0,
          perfectScoreRate: 0,
          totalTimeSpent: 0,
          energyPointsEarned: 0
        },
        gameTypeStats
      }
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/my-stats
// @desc    Get current user statistics
// @access  Private
router.get('/my-stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Score.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalScore: { $sum: '$score' },
          gamesPlayed: { $sum: 1 },
          averageScore: { $avg: '$score' },
          perfectScores: { $sum: { $cond: ['$perfectScore', 1, 0] } },
          totalTimeSpent: { $sum: '$timeSpent' },
          energyPointsEarned: { $sum: '$energyPointsEarned' },
          recentScores: {
            $push: {
              game: '$game',
              score: '$score',
              percentage: '$percentage',
              completed: '$completed',
              createdAt: '$createdAt'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalScore: 1,
          gamesPlayed: 1,
          averageScore: { $round: ['$averageScore', 2] },
          perfectScores: 1,
          perfectScoreRate: {
            $round: [
              { $multiply: [{ $divide: ['$perfectScores', '$gamesPlayed'] }, 100] },
              2
            ]
          },
          totalTimeSpent: 1,
          energyPointsEarned: 1,
          recentScores: { $slice: ['$recentScores', 10] }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          totalScore: 0,
          gamesPlayed: 0,
          averageScore: 0,
          perfectScores: 0,
          perfectScoreRate: 0,
          totalTimeSpent: 0,
          energyPointsEarned: 0,
          recentScores: []
        }
      }
    });
  } catch (error) {
    console.error('My stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;