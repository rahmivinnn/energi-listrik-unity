import React from 'react';
import styled from 'styled-components';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const AdminContent = styled.div`
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

const Admin = () => {
  return (
    <AdminContainer>
      <AdminContent>
        <Title>Admin Dashboard</Title>
        <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem' }}>
          This page will contain admin controls and statistics.
        </p>
      </AdminContent>
    </AdminContainer>
  );
};

export default Admin;