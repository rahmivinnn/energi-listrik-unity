import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { FaPlay, FaTrophy, FaGamepad, FaLightbulb, FaLeaf, FaRocket } from 'react-icons/fa';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Orbitron', sans-serif;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  text-decoration: none;
  border-radius: 12px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: transparent;
  color: #4ade80;
  text-decoration: none;
  border: 2px solid #4ade80;
  border-radius: 12px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    background: #4ade80;
    color: #000;
  }
`;

const StatsSection = styled.section`
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.02);
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsTitle = styled.h2`
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  color: #4ade80;
  margin-bottom: 60px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
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

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  color: #4ade80;
  margin-bottom: 60px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(74, 222, 128, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  color: #4ade80;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  color: #ffffff;
  line-height: 1.6;
  margin: 0;
`;

const Home = () => {
  const { user } = useAuth();
  const { gameStats } = useGame();

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Energy Quest
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learn about energy conservation through interactive games and challenges. 
            Save the world, one energy-efficient choice at a time!
          </HeroSubtitle>
          <CTAButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CTAButton to="/games">
              <FaPlay />
              Start Playing
            </CTAButton>
            <SecondaryButton to="/leaderboard">
              <FaTrophy />
              View Leaderboard
            </SecondaryButton>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsContainer>
          <StatsTitle>Game Statistics</StatsTitle>
          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <StatIcon>
                <FaGamepad />
              </StatIcon>
              <StatNumber>{gameStats?.length || 0}</StatNumber>
              <StatLabel>Game Types</StatLabel>
            </StatCard>
            <StatCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <StatIcon>
                <FaLightbulb />
              </StatIcon>
              <StatNumber>1000+</StatNumber>
              <StatLabel>Energy Tips</StatLabel>
            </StatCard>
            <StatCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatIcon>
                <FaLeaf />
              </StatIcon>
              <StatNumber>50+</StatNumber>
              <StatLabel>Levels</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </StatsSection>

      <FeaturesSection>
        <FeaturesContainer>
          <FeaturesTitle>Why Choose Energy Quest?</FeaturesTitle>
          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FeatureIcon>
                <FaGamepad />
              </FeatureIcon>
              <FeatureTitle>Interactive Learning</FeatureTitle>
              <FeatureDescription>
                Learn through engaging games, puzzles, and simulations that make 
                energy conservation fun and memorable.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <FeatureIcon>
                <FaLightbulb />
              </FeatureIcon>
              <FeatureTitle>Real-World Impact</FeatureTitle>
              <FeatureDescription>
                Apply what you learn to make real changes in your daily life 
                and contribute to a more sustainable future.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FeatureIcon>
                <FaRocket />
              </FeatureIcon>
              <FeatureTitle>Progressive Challenges</FeatureTitle>
              <FeatureDescription>
                Start with simple concepts and advance to complex energy 
                management scenarios as you level up.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
    </>
  );
};

export default Home;