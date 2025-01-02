import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserProfile = (token) => {
    fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        setIsLoggedIn(false);
      });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
    handleCloseMenu();
  };

  return (
    <AppBar
      position="static"
      sx={{ background: 'linear-gradient(90deg, #000, #4B0082)' }}
    >
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between', width: '95%' }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          DETECTAI
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ margin: '0 20px' }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{ margin: '0 20px' }}
          >
            About Us
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/contact"
            sx={{
              margin: '0 20px',
              padding: '8px 16px',
              border: '2px solid white',
              borderRadius: '5px',
              textTransform: 'none',
            }}
          >
            Contact Us
          </Button>
        </Box>

        {!isLoggedIn ? (
          <></>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ margin: '10px', padding: '10px', cursor: 'pointer' }}
              alt="User Avatar"
              src={user?.profile_image || 'https://via.placeholder.com/40'}
              onClick={handleMenuClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleCloseMenu}
              >
                My Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
