import React from 'react';
import { Box } from '@mui/material';

const CenteredContainer = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Sayfanın tamamını kaplar
        backgroundColor: '#f7f9fc', // Arka plan rengi
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 8,
          borderRadius: 5,
          boxShadow: 5,
          width: '100%', // Genişlik ayarı
          maxWidth: '800px', // Maksimum genişlik
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CenteredContainer;
