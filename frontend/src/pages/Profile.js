import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 100px 20px 40px;
`;

const ProfileContent = styled.div`
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

const Profile = () => {
  return (
    <ProfileContainer>
      <ProfileContent>
        <Title>Profile</Title>
        <p style={{ color: '#ffffff', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem' }}>
          This page will show user profile information and settings.
        </p>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;