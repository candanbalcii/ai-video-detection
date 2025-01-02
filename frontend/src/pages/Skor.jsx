// Score.jsx
import React from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';

function Score({ videoUrl, score }) {
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #000, #4B0082)',
        minHeight: '100vh',
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        sx={{
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: '#4B0082', fontWeight: 'bold' }}
          >
            AI Video Analysis Result
          </Typography>
          <Typography variant="body1" sx={{ color: '#555' }}>
            Here is the result of your uploaded video.
          </Typography>
        </Box>

        <Paper sx={{ padding: 2, textAlign: 'center', marginBottom: 2 }}>
          <video
            controls
            width="100%"
            src={videoUrl}
            style={{ borderRadius: '10px', marginBottom: '15px' }}
          ></video>
        </Paper>

        <Typography variant="h6" sx={{ color: '#4B0082' }}>
          Score: {score}%
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Score;
