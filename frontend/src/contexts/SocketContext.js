import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Create context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setConnected(true);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Join game room
  const joinGame = (gameId) => {
    if (socket && connected) {
      socket.emit('join-game', gameId);
    }
  };

  // Leave game room
  const leaveGame = (gameId) => {
    if (socket && connected) {
      socket.emit('leave-game', gameId);
    }
  };

  // Emit score update
  const emitScoreUpdate = (gameId, scoreData) => {
    if (socket && connected) {
      socket.emit('score-update', {
        gameId,
        ...scoreData
      });
    }
  };

  // Emit game state update
  const emitGameStateUpdate = (gameId, stateData) => {
    if (socket && connected) {
      socket.emit('game-state-update', {
        gameId,
        ...stateData
      });
    }
  };

  // Listen to score updates
  const onScoreUpdate = (callback) => {
    if (socket) {
      socket.on('score-updated', callback);
      return () => socket.off('score-updated', callback);
    }
  };

  // Listen to game state changes
  const onGameStateChange = (callback) => {
    if (socket) {
      socket.on('game-state-changed', callback);
      return () => socket.off('game-state-changed', callback);
    }
  };

  // Listen to custom events
  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  };

  // Emit custom events
  const emit = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    connected,
    joinGame,
    leaveGame,
    emitScoreUpdate,
    emitGameStateUpdate,
    onScoreUpdate,
    onGameStateChange,
    on,
    emit
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};