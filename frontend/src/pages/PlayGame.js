import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const PlayGameContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const PlayGameContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  color: #4ade80;
  margin-bottom: 20px;
`;

const PlayGame = () => {
  const { id } = useParams();

  return (
    <PlayGameContainer>
      <PlayGameContent>
        <Title>Play Game</Title>
        <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem' }}>
          Game ID: {id}
        </p>
        <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif' }}>
          This page will contain the actual game interface.
        </p>
      </PlayGameContent>
    </PlayGameContainer>
  );
};

export default PlayGame;