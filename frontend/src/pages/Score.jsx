import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CardContent, Card } from '@mui/material';
import { useLocation } from 'react-router-dom'; // useLocation hook'u import ediliyor
import api from '../api'; // API bağlantınızın doğru olduğundan emin olun

function Score() {
  const { state } = useLocation(); // location state'den gelen bilgileri alıyoruz
  const [lastVideo, setLastVideo] = useState(null);
  const { score } = state;

  useEffect(() => {
    // Fetch the last video and score
    getLastVideo();
  }, []);
  if (!state) {
    return <Typography variant="h6">No data available.</Typography>;
  }
  // Fetch the last video from API
  const getLastVideo = () => {
    api
      .get('/api/notes/')
      .then((res) => {
        const videoNotes = res.data.filter((note) => note.video); // Get only notes with videos
        if (videoNotes.length > 0) {
          setLastVideo(videoNotes[videoNotes.length - 1]); // Get the last video note
        }
      })
      .catch((err) => alert('Video yüklenirken bir hata oluştu:', err));
  };

  return (
    <Box sx={{ padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Video Confidence Score
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 3 }}>
        Score: {score}%
      </Typography>

      {lastVideo ? (
        <Card
          sx={{
            padding: 2,
            boxShadow: 3,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {lastVideo.title}
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              {lastVideo.content}
            </Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="body2" gutterBottom>
                Video:
              </Typography>
              <video controls style={{ width: '100%', borderRadius: '8px' }}>
                <source src={lastVideo.video} type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray' }}>
          Henüz bir video yüklenmedi.
        </Typography>
      )}
    </Box>
  );
}

export default Score;
