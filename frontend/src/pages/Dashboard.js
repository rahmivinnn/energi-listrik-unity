import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { FaGamepad, FaTrophy, FaChartLine, FaLightbulb, FaPlay, FaStar } from 'react-icons/fa';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled(motion.section)`
  text-align: center;
  margin-bottom: 60px;
`;

const WelcomeTitle = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  color: #4ade80;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(74, 222, 128, 0.3);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: #4ade80;
  margin-bottom: 20px;
`;

const StatNumber = styled.h3`
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 10px;
`;

const StatLabel = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: #4ade80;
  margin-bottom: 30px;
  text-align: center;
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

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.3);
    color: #4ade80;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { games, fetchGames } = useGame();

  useEffect(() => {
    fetchGames();
  }, []);

  const recentGames = games.slice(0, 6);

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WelcomeTitle>
            Welcome back, {user?.username}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Ready to continue your energy conservation journey?
          </WelcomeSubtitle>
        </WelcomeSection>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <StatIcon>
              <FaGamepad />
            </StatIcon>
            <StatNumber>{user?.gamesPlayed || 0}</StatNumber>
            <StatLabel>Games Played</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatIcon>
              <FaTrophy />
            </StatIcon>
            <StatNumber>{user?.totalScore || 0}</StatNumber>
            <StatLabel>Total Score</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatIcon>
              <FaChartLine />
            </StatIcon>
            <StatNumber>{user?.level || 1}</StatNumber>
            <StatLabel>Level</StatLabel>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StatIcon>
              <FaLightbulb />
            </StatIcon>
            <StatNumber>{user?.experience || 0}</StatNumber>
            <StatLabel>Experience Points</StatLabel>
          </StatCard>
        </StatsGrid>

        <Section>
          <SectionTitle>Recent Games</SectionTitle>
          <GamesGrid>
            {recentGames.map((game, index) => (
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
                <PlayButton to={`/play/${game._id}`}>
                  <FaPlay />
                  Play Now
                </PlayButton>
              </GameCard>
            ))}
          </GamesGrid>
        </Section>

        <QuickActions>
          <ActionButton to="/games">
            <FaGamepad />
            Browse All Games
          </ActionButton>
          <ActionButton to="/leaderboard">
            <FaTrophy />
            View Leaderboard
          </ActionButton>
          <ActionButton to="/profile">
            <FaStar />
            View Profile
          </ActionButton>
        </QuickActions>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;