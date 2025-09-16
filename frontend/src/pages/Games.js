import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { FaGamepad, FaPlay, FaLock, FaFilter, FaSearch } from 'react-icons/fa';

const GamesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const GamesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  color: #4ade80;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  margin: 0;
`;

const Filters = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  background: ${props => props.active ? '#4ade80' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#000' : '#ffffff'};
  border: none;
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4ade80;
    color: #000;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(74, 222, 128, 0.3);
  }
`;

const GameIcon = styled.div`
  font-size: 4rem;
  color: #4ade80;
  margin-bottom: 20px;
`;

const GameTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 15px;
`;

const GameDescription = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const GameMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  color: #ffffff;
`;

const Difficulty = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  background: ${props => {
    switch(props.level) {
      case 'easy': return '#4ade80';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: #000;
  font-weight: 600;
`;

const PlayButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  text-decoration: none;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
  }
`;

const LockedButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: #6b7280;
  border-radius: 8px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: not-allowed;
`;

const Games = () => {
  const { games, loading, fetchGames } = useGame();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchGames({ type: filter === 'all' ? '' : filter });
  }, [filter]);

  const gameTypes = [
    { value: 'all', label: 'All Games' },
    { value: 'puzzle', label: 'Puzzle' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'simulation', label: 'Simulation' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'experiment', label: 'Experiment' }
  ];

  if (loading) {
    return (
      <GamesContainer>
        <GamesContent>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif' }}>Loading games...</p>
          </div>
        </GamesContent>
      </GamesContainer>
    );
  }

  return (
    <GamesContainer>
      <GamesContent>
        <Header>
          <Title>Energy Quest Games</Title>
          <Subtitle>Choose your adventure and learn about energy conservation</Subtitle>
        </Header>

        <Filters>
          {gameTypes.map((type) => (
            <FilterButton
              key={type.value}
              active={filter === type.value}
              onClick={() => setFilter(type.value)}
            >
              {type.label}
            </FilterButton>
          ))}
        </Filters>

        <GamesGrid>
          {games.map((game, index) => (
            <GameCard
              key={game._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GameIcon>
                <FaGamepad />
              </GameIcon>
              <GameTitle>{game.name}</GameTitle>
              <GameDescription>{game.description}</GameDescription>
              <GameMeta>
                <span>Level {game.level}</span>
                <Difficulty level={game.difficulty}>
                  {game.difficulty.toUpperCase()}
                </Difficulty>
              </GameMeta>
              {game.isUnlocked ? (
                <PlayButton to={`/play/${game._id}`}>
                  <FaPlay />
                  Play Now
                </PlayButton>
              ) : (
                <LockedButton>
                  <FaLock />
                  Locked
                </LockedButton>
              )}
            </GameCard>
          ))}
        </GamesGrid>
      </GamesContent>
    </GamesContainer>
  );
};

export default Games;