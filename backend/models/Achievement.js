import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required']
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required']
  },
  category: {
    type: String,
    enum: ['score', 'time', 'completion', 'streak', 'special'],
    required: [true, 'Achievement category is required']
  },
  criteria: {
    type: {
      type: String,
      enum: ['score', 'time', 'completion', 'streak', 'games_played', 'perfect_scores'],
      required: [true, 'Criteria type is required']
    },
    value: {
      type: Number,
      required: [true, 'Criteria value is required'],
      min: 0
    },
    gameType: {
      type: String,
      enum: ['puzzle', 'quiz', 'simulation', 'adventure', 'experiment', 'all'],
      default: 'all'
    }
  },
  reward: {
    energyPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    badge: {
      type: String,
      default: null
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ isActive: 1, isHidden: 1 });
achievementSchema.index({ sortOrder: 1 });

export default mongoose.model('Achievement', achievementSchema);