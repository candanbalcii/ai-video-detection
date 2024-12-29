import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import api from '../api';

function CommentPage() {
  const [comment, setComment] = useState('');
  const history = useHistory();

  const handleSaveComment = async () => {
    // Skor ve yorum ile notu kaydediyoruz
    const formData = new FormData();
    formData.append('comment', comment);

    try {
      const response = await api.post('/api/notes/comment/', formData);

      if (response.status === 200) {
        alert('Your comment has been added!');
        history.push('/'); // Ana sayfaya yönlendir
      } else {
        alert('Failed to save comment.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', padding: 4 }}>
      <Typography variant="h5" sx={{ color: '#4B0082', marginBottom: 3 }}>
        Add Your Comment
      </Typography>
      <TextField
        label="Your Comment"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#4B0082',
          '&:hover': { backgroundColor: '#6A0DAD' },
        }}
        onClick={handleSaveComment}
      >
        Save Comment
      </Button>
    </Box>
  );
}

export default CommentPage;
