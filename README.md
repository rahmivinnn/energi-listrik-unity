# Energy Quest - Full Stack Educational Game

A comprehensive full-stack web application designed to teach users about energy conservation through interactive games and challenges.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **User Authentication**: Secure login/register system with JWT tokens
- **Game Dashboard**: Interactive game selection and progress tracking
- **Real-time Updates**: WebSocket integration for live score updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Admin Panel**: Comprehensive admin dashboard for game management

### Backend (Node.js/Express)
- **RESTful API**: Well-structured API endpoints for all functionality
- **User Management**: Complete user registration, authentication, and profile management
- **Game System**: Dynamic game creation, scoring, and leaderboard system
- **Real-time Features**: WebSocket support for live updates
- **Database Integration**: MongoDB with Mongoose ODM
- **Security**: JWT authentication, rate limiting, input validation
- **File Upload**: Support for game assets and user avatars

### Database (MongoDB)
- **User Profiles**: Complete user data with achievements and statistics
- **Game Management**: Flexible game system with multiple types and difficulties
- **Score Tracking**: Comprehensive scoring system with leaderboards
- **Achievement System**: Gamification with unlockable achievements

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router DOM
- React Query (TanStack Query)
- Framer Motion
- Styled Components
- React Hook Form
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication
- Bcrypt
- Express Validator
- Multer (File Upload)

### DevOps
- Docker & Docker Compose
- Nginx (Reverse Proxy)
- MongoDB Atlas (Production)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- Docker & Docker Compose (optional)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-quest
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Manual Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   - Install MongoDB
   - Create a database named `energy_quest`
   - Update the connection string in backend/.env

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/energy_quest
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🎮 Game Types

1. **Puzzle Games**: Interactive puzzles teaching energy concepts
2. **Quiz Challenges**: Knowledge-based questions about energy conservation
3. **Simulation Games**: Real-world energy management scenarios
4. **Adventure Mode**: Story-driven energy conservation adventures
5. **Experiments**: Hands-on energy experiments and calculations

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Games
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get single game
- `POST /api/games/:id/unlock` - Unlock game

### Scores
- `POST /api/scores` - Submit score
- `GET /api/scores/my-scores` - Get user scores
- `GET /api/scores/game/:gameId` - Get game scores

### Users
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/stats/:userId` - Get user statistics

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/energy_quest
   export JWT_SECRET=your_production_jwt_secret
   ```

2. **Build and Deploy**
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # Start backend
   cd ../backend
   npm start
   ```

3. **Docker Deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment

The application is designed to be deployed on:
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, or any Node.js hosting
- **Database**: MongoDB Atlas

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Performance

- **Frontend**: Optimized with React.memo, lazy loading, and code splitting
- **Backend**: Implemented caching, rate limiting, and database indexing
- **Database**: Optimized queries with proper indexing
- **Real-time**: Efficient WebSocket connections with room management

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Security headers
- SQL injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multiplayer games
- [ ] Advanced analytics
- [ ] Social features
- [ ] More game types
- [ ] AI-powered recommendations
- [ ] Offline mode
- [ ] Progressive Web App (PWA)

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Energy Quest** - Making energy conservation fun and educational! 🌱⚡