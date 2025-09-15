import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Game name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Game description is required']
  },
  type: {
    type: String,
    enum: ['puzzle', 'quiz', 'simulation', 'adventure', 'experiment'],
    required: [true, 'Game type is required']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'Difficulty level is required']
  },
  level: {
    type: Number,
    required: [true, 'Level number is required'],
    min: 1
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: 0
  },
  timeLimit: {
    type: Number, // in seconds
    default: null
  },
  instructions: {
    type: String,
    required: [true, 'Game instructions are required']
  },
  energyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  requirements: {
    minLevel: {
      type: Number,
      default: 1
    },
    previousGames: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }]
  },
  assets: {
    backgroundImage: String,
    icon: String,
    sounds: [String],
    animations: [String]
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
gameSchema.index({ type: 1, difficulty: 1, level: 1 });
gameSchema.index({ isActive: 1, isUnlocked: 1 });

export default mongoose.model('Game', gameSchema);