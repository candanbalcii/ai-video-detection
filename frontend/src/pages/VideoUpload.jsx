import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import api from '../api';

function Home() {
  const [notes, setNotes] = useState([]);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get('/api/notes/')
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const createNote = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (video) {
      formData.append('video', video);
    }

    api
      .post('/api/notes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.status === 201) {
          alert('Note created!');
          getNotes();
        } else {
          alert('Failed to make note.');
        }
      })
      .catch((err) => alert(err));
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // MIME türünü kontrol et
      if (!file.type.startsWith('video/')) {
        alert('Yüklenen dosya bir video değil!');
        return;
      }

      // Uzantıyı kontrol et (isteğe bağlı)
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

      // Eğer tüm kontroller geçilirse, video dosyasını kaydet
      setVideo(file);
      alert(`Video "${file.name}" başarıyla seçildi!`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/*',
  });

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
            Upload your video and get a confidence score
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
            Submit Note
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}

export default Home;
