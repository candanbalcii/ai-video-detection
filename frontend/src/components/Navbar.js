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
import { ACCESS_TOKEN } from '../constants';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem(ACCESS_TOKEN); // Tokeni temizle
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
    handleCloseMenu();
  };

  const fetchUserData = (token) => {
    fetch('http://localhost:8000/api/profile/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User data fetched:', data);
        setUser({
          email: data.email,
          profile_image:
            data.profile_picture || 'https://via.placeholder.com/40',
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setIsLoggedIn(false);
      });
  };

  // Sayfa yüklendiğinde token'i kontrol et
  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);

    if (storedToken) {
      setIsLoggedIn(true);
      fetchUserData(storedToken); // Token varsa kullanıcı verisini al
    } else {
      setIsLoggedIn(false);
      setUser(null); // Eğer token yoksa, kullanıcıyı çıkart
    }
  }, []); // Sayfa yüklendiğinde sadece bir kez çalışır

  // Kullanıcı login olduğunda avatar'ı güncellemek için
  useEffect(() => {
    if (isLoggedIn && user === null) {
      const storedToken = localStorage.getItem(ACCESS_TOKEN);
      if (storedToken) {
        fetchUserData(storedToken); // Login olduktan sonra avatar hemen görünsün
      }
    }
  }, [isLoggedIn, user]); // Kullanıcı login olursa, avatar'ı al

  // Yönlendirme sonrası avatar'ı göster
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate('/upload'); // Login olduktan sonra upload sayfasına yönlendir
    }
  }, [isLoggedIn, user, navigate]); // `isLoggedIn` veya `user` güncellenirse, yönlendir

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

        {isLoggedIn ? (
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
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
