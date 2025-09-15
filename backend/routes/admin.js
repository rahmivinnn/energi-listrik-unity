import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Game from '../models/Game.js';
import Score from '../models/Score.js';
import Achievement from '../models/Achievement.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic statistics
    const [
      totalUsers,
      totalGames,
      totalScores,
      totalAchievements,
      recentUsers,
      recentScores,
      gameStats,
      userStats
    ] = await Promise.all([
      User.countDocuments(),
      Game.countDocuments(),
      Score.countDocuments(),
      Achievement.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('username email level createdAt'),
      Score.find().populate('user', 'username').populate('game', 'name').sort({ createdAt: -1 }).limit(10),
      Game.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalPlays: { $sum: '$playCount' }
          }
        }
      ]),
      User.aggregate([
        {
          $group: {
            _id: null,
            averageLevel: { $avg: '$level' },
            averageScore: { $avg: '$totalScore' },
            totalExperience: { $sum: '$experience' }
          }
        }
      ])
    ]);

    // Get daily statistics for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Score.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          scores: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          scores: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalGames,
          totalScores,
          totalAchievements,
          averageLevel: userStats[0]?.averageLevel || 0,
          averageScore: userStats[0]?.averageScore || 0,
          totalExperience: userStats[0]?.totalExperience || 0
        },
        recentActivity: {
          users: recentUsers,
          scores: recentScores
        },
        gameStats,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      isActive
    } = req.query;

    // Build filter
    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/users/:id', [
  body('isActive').optional().isBoolean(),
  body('isAdmin').optional().isBoolean(),
  body('level').optional().isInt({ min: 1 }),
  body('experience').optional().isInt({ min: 0 })
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

    const { isActive, isAdmin, level, experience } = req.body;
    const updateData = {};

    if (isActive !== undefined) updateData.isActive = isActive;
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (level !== undefined) updateData.level = level;
    if (experience !== undefined) updateData.experience = experience;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Also delete user's scores
    await Score.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/games
// @desc    Create new game
// @access  Private (Admin only)
router.post('/games', [
  body('name').notEmpty().withMessage('Game name is required'),
  body('description').notEmpty().withMessage('Game description is required'),
  body('type').isIn(['puzzle', 'quiz', 'simulation', 'adventure', 'experiment']).withMessage('Invalid game type'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('level').isInt({ min: 1 }).withMessage('Level must be a positive integer'),
  body('maxScore').isInt({ min: 0 }).withMessage('Max score must be non-negative'),
  body('instructions').notEmpty().withMessage('Instructions are required')
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

    const gameData = {
      ...req.body,
      createdBy: req.user._id
    };

    const game = await Game.create(gameData);

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: {
        game
      }
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/games/:id
// @desc    Update game
// @access  Private (Admin only)
router.put('/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      message: 'Game updated successfully',
      data: {
        game
      }
    });
  } catch (error) {
    console.error('Update game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/games/:id
// @desc    Delete game
// @access  Private (Admin only)
router.delete('/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Also delete game's scores
    await Score.deleteMany({ game: req.params.id });

    res.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Delete game error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/scores
// @desc    Get all scores with pagination
// @access  Private (Admin only)
router.get('/scores', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      gameId, 
      userId, 
      sortBy = 'createdAt', 
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (gameId) {
      filter.game = gameId;
    }
    
    if (userId) {
      filter.user = userId;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scores = await Score.find(filter)
      .populate('user', 'username email')
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
    console.error('Get scores error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;