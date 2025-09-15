// MongoDB initialization script
db = db.getSiblingDB('energy_quest');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 20
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        }
      }
    }
  }
});

db.createCollection('games', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'type', 'difficulty', 'level', 'maxScore'],
      properties: {
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        type: {
          bsonType: 'string',
          enum: ['puzzle', 'quiz', 'simulation', 'adventure', 'experiment']
        },
        difficulty: {
          bsonType: 'string',
          enum: ['easy', 'medium', 'hard']
        },
        level: { bsonType: 'int', minimum: 1 },
        maxScore: { bsonType: 'int', minimum: 0 }
      }
    }
  }
});

db.createCollection('scores', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user', 'game', 'score', 'maxScore', 'percentage'],
      properties: {
        user: { bsonType: 'objectId' },
        game: { bsonType: 'objectId' },
        score: { bsonType: 'int', minimum: 0 },
        maxScore: { bsonType: 'int', minimum: 0 },
        percentage: { bsonType: 'int', minimum: 0, maximum: 100 }
      }
    }
  }
});

db.createCollection('achievements', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'icon', 'category'],
      properties: {
        name: { bsonType: 'string' },
        description: { bsonType: 'string' },
        icon: { bsonType: 'string' },
        category: {
          bsonType: 'string',
          enum: ['score', 'time', 'completion', 'streak', 'special']
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ level: -1 });
db.users.createIndex({ totalScore: -1 });

db.games.createIndex({ type: 1, difficulty: 1, level: 1 });
db.games.createIndex({ isActive: 1, isUnlocked: 1 });

db.scores.createIndex({ user: 1, game: 1 });
db.scores.createIndex({ game: 1, score: -1 });
db.scores.createIndex({ user: 1, createdAt: -1 });
db.scores.createIndex({ completed: 1, perfectScore: 1 });

db.achievements.createIndex({ category: 1, rarity: 1 });
db.achievements.createIndex({ isActive: 1, isHidden: 1 });

print('Database initialization completed successfully!');