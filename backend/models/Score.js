import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'Game is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: 0
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // in seconds
    required: [true, 'Time spent is required'],
    min: 0
  },
  energyPointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    required: [true, 'Level is required'],
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  perfectScore: {
    type: Boolean,
    default: false
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  deviceInfo: {
    userAgent: String,
    platform: String,
    screenResolution: String
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
scoreSchema.index({ user: 1, game: 1 });
scoreSchema.index({ game: 1, score: -1 });
scoreSchema.index({ user: 1, createdAt: -1 });
scoreSchema.index({ completed: 1, perfectScore: 1 });

// Calculate percentage before saving
scoreSchema.pre('save', function(next) {
  if (this.maxScore > 0) {
    this.percentage = Math.round((this.score / this.maxScore) * 100);
    this.perfectScore = this.percentage === 100;
  }
  next();
});

export default mongoose.model('Score', scoreSchema);