import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaGamepad, FaTrophy, FaCog } from 'react-icons/fa';

const Nav = styled.nav`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(74, 222, 128, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 20px;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #4ade80;
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 900;
  transition: all 0.3s ease;

  &:hover {
    color: #22c55e;
    transform: scale(1.05);
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: calc(100vh - 70px);
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 50px;
    transition: left 0.3s ease;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#4ade80' : '#ffffff'};
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 15px 20px;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.1);
    color: #4ade80;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 12px;
  padding: 10px 0;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.1);
    color: #4ade80;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <FaGamepad style={{ marginRight: '10px' }} />
          Energy Quest
        </Logo>

        <NavMenu isOpen={isMenuOpen}>
          <NavItem>
            <NavLink to="/" active={isActive('/')}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/games" active={isActive('/games')}>
              Games
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/leaderboard" active={isActive('/leaderboard')}>
              <FaTrophy />
              Leaderboard
            </NavLink>
          </NavItem>
          
          {user ? (
            <>
              <NavItem>
                <NavLink to="/dashboard" active={isActive('/dashboard')}>
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <UserMenu>
                  <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                    <FaUser />
                    {user.username}
                  </UserButton>
                  <Dropdown isOpen={isUserMenuOpen}>
                    <DropdownItem to="/profile">
                      <FaCog />
                      Profile
                    </DropdownItem>
                    <DropdownItem as="button" onClick={handleLogout}>
                      <FaSignOutAlt />
                      Logout
                    </DropdownItem>
                  </Dropdown>
                </UserMenu>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink to="/login" active={isActive('/login')}>
                  Login
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/register" active={isActive('/register')}>
                  Register
                </NavLink>
              </NavItem>
            </>
          )}
        </NavMenu>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;