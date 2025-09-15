import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  games: [],
  currentGame: null,
  gameStats: null,
  leaderboard: [],
  loading: false,
  error: null
};

// Action types
const GAME_ACTIONS = {
  FETCH_GAMES_START: 'FETCH_GAMES_START',
  FETCH_GAMES_SUCCESS: 'FETCH_GAMES_SUCCESS',
  FETCH_GAMES_FAILURE: 'FETCH_GAMES_FAILURE',
  FETCH_GAME_START: 'FETCH_GAME_START',
  FETCH_GAME_SUCCESS: 'FETCH_GAME_SUCCESS',
  FETCH_GAME_FAILURE: 'FETCH_GAME_FAILURE',
  FETCH_LEADERBOARD_START: 'FETCH_LEADERBOARD_START',
  FETCH_LEADERBOARD_SUCCESS: 'FETCH_LEADERBOARD_SUCCESS',
  FETCH_LEADERBOARD_FAILURE: 'FETCH_LEADERBOARD_FAILURE',
  FETCH_GAME_STATS_START: 'FETCH_GAME_STATS_START',
  FETCH_GAME_STATS_SUCCESS: 'FETCH_GAME_STATS_SUCCESS',
  FETCH_GAME_STATS_FAILURE: 'FETCH_GAME_STATS_FAILURE',
  SUBMIT_SCORE_START: 'SUBMIT_SCORE_START',
  SUBMIT_SCORE_SUCCESS: 'SUBMIT_SCORE_SUCCESS',
  SUBMIT_SCORE_FAILURE: 'SUBMIT_SCORE_FAILURE',
  UNLOCK_GAME_START: 'UNLOCK_GAME_START',
  UNLOCK_GAME_SUCCESS: 'UNLOCK_GAME_SUCCESS',
  UNLOCK_GAME_FAILURE: 'UNLOCK_GAME_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.FETCH_GAMES_START:
    case GAME_ACTIONS.FETCH_GAME_START:
    case GAME_ACTIONS.FETCH_LEADERBOARD_START:
    case GAME_ACTIONS.FETCH_GAME_STATS_START:
    case GAME_ACTIONS.SUBMIT_SCORE_START:
    case GAME_ACTIONS.UNLOCK_GAME_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case GAME_ACTIONS.FETCH_GAMES_SUCCESS:
      return {
        ...state,
        loading: false,
        games: action.payload,
        error: null
      };
    
    case GAME_ACTIONS.FETCH_GAME_SUCCESS:
      return {
        ...state,
        loading: false,
        currentGame: action.payload,
        error: null
      };
    
    case GAME_ACTIONS.FETCH_LEADERBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        leaderboard: action.payload,
        error: null
      };
    
    case GAME_ACTIONS.FETCH_GAME_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        gameStats: action.payload,
        error: null
      };
    
    case GAME_ACTIONS.SUBMIT_SCORE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };
    
    case GAME_ACTIONS.UNLOCK_GAME_SUCCESS:
      return {
        ...state,
        loading: false,
        games: state.games.map(game => 
          game._id === action.payload._id 
            ? { ...game, isUnlocked: true }
            : game
        ),
        error: null
      };
    
    case GAME_ACTIONS.FETCH_GAMES_FAILURE:
    case GAME_ACTIONS.FETCH_GAME_FAILURE:
    case GAME_ACTIONS.FETCH_LEADERBOARD_FAILURE:
    case GAME_ACTIONS.FETCH_GAME_STATS_FAILURE:
    case GAME_ACTIONS.SUBMIT_SCORE_FAILURE:
    case GAME_ACTIONS.UNLOCK_GAME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case GAME_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const GameContext = createContext();

// Game provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user } = useAuth();

  // Fetch all games
  const fetchGames = async (filters = {}) => {
    try {
      dispatch({ type: GAME_ACTIONS.FETCH_GAMES_START });
      const params = new URLSearchParams(filters);
      const response = await axios.get(`/api/games?${params}`);
      dispatch({
        type: GAME_ACTIONS.FETCH_GAMES_SUCCESS,
        payload: response.data.data.games
      });
    } catch (error) {
      dispatch({
        type: GAME_ACTIONS.FETCH_GAMES_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch games'
      });
    }
  };

  // Fetch single game
  const fetchGame = async (gameId) => {
    try {
      dispatch({ type: GAME_ACTIONS.FETCH_GAME_START });
      const response = await axios.get(`/api/games/${gameId}`);
      dispatch({
        type: GAME_ACTIONS.FETCH_GAME_SUCCESS,
        payload: response.data.data
      });
    } catch (error) {
      dispatch({
        type: GAME_ACTIONS.FETCH_GAME_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch game'
      });
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async (type = 'totalScore', limit = 10, gameType = 'all') => {
    try {
      dispatch({ type: GAME_ACTIONS.FETCH_LEADERBOARD_START });
      const response = await axios.get(`/api/users/leaderboard?type=${type}&limit=${limit}&gameType=${gameType}`);
      dispatch({
        type: GAME_ACTIONS.FETCH_LEADERBOARD_SUCCESS,
        payload: response.data.data.leaderboard
      });
    } catch (error) {
      dispatch({
        type: GAME_ACTIONS.FETCH_LEADERBOARD_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch leaderboard'
      });
    }
  };

  // Fetch game statistics
  const fetchGameStats = async () => {
    try {
      dispatch({ type: GAME_ACTIONS.FETCH_GAME_STATS_START });
      const response = await axios.get('/api/games/types/stats');
      dispatch({
        type: GAME_ACTIONS.FETCH_GAME_STATS_SUCCESS,
        payload: response.data.data.stats
      });
    } catch (error) {
      dispatch({
        type: GAME_ACTIONS.FETCH_GAME_STATS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch game stats'
      });
    }
  };

  // Submit score
  const submitScore = async (scoreData) => {
    try {
      dispatch({ type: GAME_ACTIONS.SUBMIT_SCORE_START });
      const response = await axios.post('/api/scores', scoreData);
      dispatch({
        type: GAME_ACTIONS.SUBMIT_SCORE_SUCCESS,
        payload: response.data.data
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit score';
      dispatch({
        type: GAME_ACTIONS.SUBMIT_SCORE_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Unlock game
  const unlockGame = async (gameId) => {
    try {
      dispatch({ type: GAME_ACTIONS.UNLOCK_GAME_START });
      const response = await axios.post(`/api/games/${gameId}/unlock`);
      dispatch({
        type: GAME_ACTIONS.UNLOCK_GAME_SUCCESS,
        payload: response.data.data.game
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to unlock game';
      dispatch({
        type: GAME_ACTIONS.UNLOCK_GAME_FAILURE,
        payload: message
      });
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: GAME_ACTIONS.CLEAR_ERROR });
  };

  // Load games on mount
  useEffect(() => {
    fetchGames();
    fetchGameStats();
  }, []);

  const value = {
    ...state,
    fetchGames,
    fetchGame,
    fetchLeaderboard,
    fetchGameStats,
    submitScore,
    unlockGame,
    clearError
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};