import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHome, FaGamepad } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
`;

const NotFoundIcon = styled.div`
  font-size: 8rem;
  color: #4ade80;
  margin-bottom: 30px;
`;

const NotFoundTitle = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 4rem;
  color: #4ade80;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const NotFoundSubtitle = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 40px;
`;

const HomeButton = styled(Link)`
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundIcon>
          <FaGamepad />
        </NotFoundIcon>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>
          Oops! The page you're looking for doesn't exist.
        </NotFoundSubtitle>
        <HomeButton to="/">
          <FaHome />
          Go Home
        </HomeButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;