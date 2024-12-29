import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: 'white',
        padding: 3,
        marginTop: 'auto', // Sayfanın en altına sabitlemek için
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="inherit">
        &copy; {new Date().getFullYear()} DETECTAI. All rights reserved.
      </Typography>
      <Box sx={{ marginTop: 2 }}>
        <Link href="/terms" color="inherit" sx={{ margin: 1 }}>
          Terms of Service
        </Link>
        <Link href="/privacy" color="inherit" sx={{ margin: 1 }}>
          Privacy Policy
        </Link>
        <Link href="/contact-us" color="inherit" sx={{ margin: 1 }}>
          Contact Us
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
