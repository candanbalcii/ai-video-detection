import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [video, setVideo] = useState(null);
  const [score, setScore] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (!file.type.startsWith('video/')) {
        alert('Yüklenen dosya bir video değil!');
        return;
      }

      const validExtensions = ['mp4', 'avi', 'mov', 'mkv'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        alert(
          `Desteklenmeyen dosya formatı! Yalnızca ${validExtensions.join(
            ', '
          )} formatlarına izin veriliyor.`
        );
        return;
      }

      setVideo(file);
      alert(`Video "${file.name}" başarıyla seçildi!`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/*',
  });

  const createNote = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (video) {
      formData.append('video', video);
    }

    setLoading(true); // Set loading to true when submitting

    api
      .post('/api/notes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status === 201) {
          const videoScore = res.data.score;
          setScore(videoScore);
          setVideoUrl(res.data.video_url);
          alert('Note created!');
          navigate('/score', {
            state: { videoUrl: res.data.video_url, score: videoScore },
          });
        } else {
          alert('Failed to make note.');
        }
      })
      .catch((err) => alert(err))
      .finally(() => setLoading(false)); // Set loading to false when done
  };

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
            Detect AI Generated Videos
          </Typography>
          <Typography variant="body1" sx={{ color: '#555' }}>
            Upload your video and get a score
          </Typography>
        </Box>
        <form onSubmit={createNote}>
          <Paper
            {...getRootProps()}
            sx={{
              padding: 2,
              border: '2px dashed #4B0082',
              textAlign: 'center',
              backgroundColor: isDragActive ? '#f5f5f5' : '#fff',
              marginBottom: 2,
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography variant="body2" sx={{ color: '#4B0082' }}>
                Drop the file here...
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: '#555' }}>
                Drag & drop a video file here, or click to select one.
              </Typography>
            )}
          </Paper>
          {video && (
            <Typography variant="body2" sx={{ marginBottom: 2, color: '#555' }}>
              Selected File: {video.name}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#4B0082',
              '&:hover': { backgroundColor: '#6A0DAD' },
            }}
          >
            Submit
          </Button>
        </form>

        {/* Show the loading spinner while the video is being processed */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <CircularProgress sx={{ color: '#4B0082' }} />
          </Box>
        )}

        {score && (
          <Typography variant="h6" sx={{ marginTop: 3, color: '#4B0082' }}>
            Score: {score}%
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default Home;
