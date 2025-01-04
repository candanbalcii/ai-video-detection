import React, { useEffect, useState } from 'react';
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
import { useUser } from './UserContext';
import { ACCESS_TOKEN } from '../constants';

const Navbar = () => {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
    handleCloseMenu();
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
      setIsFetching(true);
      fetch('http://localhost:8000/api/profile/', {
        method: 'GET',
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser({
            email: data.email,
            profile_image:
              data.profile_picture || 'https://via.placeholder.com/40',
          });
          setIsFetching(false);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setIsFetching(false);
        });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [setIsLoggedIn, setUser]);

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

        {isLoggedIn && user && !isFetching ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ margin: '10px', padding: '10px', cursor: 'pointer' }}
              alt="User Avatar"
              src={user.profile_image}
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
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
