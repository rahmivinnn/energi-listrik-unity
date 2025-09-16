import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const GameDetailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const GameDetailContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  color: #4ade80;
  margin-bottom: 20px;
`;

const GameDetail = () => {
  const { id } = useParams();

  return (
    <GameDetailContainer>
      <GameDetailContent>
        <Title>Game Detail</Title>
        <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem' }}>
          Game ID: {id}
        </p>
        <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif' }}>
          This page will show detailed information about the selected game.
        </p>
      </GameDetailContent>
    </GameDetailContainer>
  );
};

export default GameDetail;