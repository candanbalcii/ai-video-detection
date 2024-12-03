import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      style={{ background: 'linear-gradient(90deg, #000, #4B0082)' }}
    >
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* DETECTAI metni sola sabit */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          DETECTAI
        </Typography>

        {/* Butonlar ortalanmış ve aralarındaki mesafe sabit */}
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
        >
          <Button
            color="inherit"
            component={Link}
            to="/"
            style={{ margin: '0 40px' }} // Butonlar arasına 15px mesafe ekledik
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            style={{ margin: '0 40px' }} // Butonlar arasına 15px mesafe ekledik
          >
            Login
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/signup"
            style={{ margin: '0 40px' }} // Butonlar arasına 15px mesafe ekledik
          >
            Signup
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
