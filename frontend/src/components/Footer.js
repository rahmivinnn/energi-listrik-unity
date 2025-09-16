import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(74, 222, 128, 0.2);
  padding: 40px 20px 20px;
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FooterTitle = styled.h3`
  color: #4ade80;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const FooterText = styled.p`
  color: #ffffff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
`;

const FooterLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #4ade80;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  color: #ffffff;
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    color: #4ade80;
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
`;

const FooterBottomText = styled.p`
  color: #ffffff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Energy Quest</FooterTitle>
          <FooterText>
            An educational game designed to teach players about energy conservation, 
            sustainability, and environmental responsibility through interactive gameplay.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink href="/games">Games</FooterLink>
          <FooterLink href="/leaderboard">Leaderboard</FooterLink>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Game Types</FooterTitle>
          <FooterText>Puzzle Games</FooterText>
          <FooterText>Quiz Challenges</FooterText>
          <FooterText>Simulation Games</FooterText>
          <FooterText>Adventure Mode</FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Connect</FooterTitle>
          <SocialLinks>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </SocialLink>
          </SocialLinks>
          <FooterText>
            Follow us for updates and news about energy conservation!
          </FooterText>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <FooterBottomText>
          Made with <FaHeart style={{ color: '#ef4444' }} /> by the Energy Quest Team
        </FooterBottomText>
        <FooterBottomText>
          © 2024 Energy Quest. All rights reserved.
        </FooterBottomText>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;