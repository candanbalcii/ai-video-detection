import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  AppBar,
  Toolbar,
} from '@mui/material';
import api from '../api';
import { formatDistanceToNow } from 'date-fns'; // formatDistanceToNow fonksiyonu
import { enUS } from 'date-fns/locale'; // İngilizce dil desteği

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // 0: Articles, 1: Videos
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get('/api/notes/all/')
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  // Profile fotoğrafı localStorage'dan alınır, varsa
  const getProfilePicture = () => {
    const storedProfilePic = localStorage.getItem('profile_picture');
    return storedProfilePic ? storedProfilePic : '/default_profile.jpg';
  };

  // Tarih bilgisini formatla
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS }); // İngilizce format
  };

  // Filter notes based on the selected tab (articles or videos)
  const filteredNotes = notes.filter((note) => {
    if (selectedTab === 0) {
      // Articles
      return note.content && note.content.trim().length > 0;
    }
    if (selectedTab === 1) {
      // Videos
      return note.video && note.video.trim().length > 0;
    }
    return false;
  });

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, #000, #4B0082)', // Geçişli arka plan
        minHeight: '100vh', // Tam ekran yüksekliği
        alignItems: 'center', // Dikeyde ortala
        padding: 4,
      }}
    >
      {/* Tabs for switching between Articles and Videos */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 8,
          marginBottom: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 2,
          width: '80%', // Make the tab container not full-width
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          sx={{
            width: '100%', // Tam genişlik
            borderBottom: '1px solid #ddd', // Tab altı çizgisi
          }}
        >
          <Tab label="Articles" />
          <Tab label="Videos" />
        </Tabs>
      </Box>

      {/* Container to display filtered notes (Articles or Videos) */}
      <Grid
        container
        spacing={4} // Daha fazla boşluk
        direction="column" // Kartları dikey sıralamak için
        sx={{
          justifyContent: 'center',
          maxWidth: '1200px', // İçeriği sınırlandır
          backgroundColor: 'white', // Beyaz container
          borderRadius: 2,
          padding: 4,
        }}
      >
        {filteredNotes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card
              sx={{
                padding: 2,
                boxShadow: 3,
                backgroundColor: '#ffffff',
                borderRadius: 5, // Daha yuvarlak köşeler
                position: 'relative',
                transition: 'transform 0.3s ease-in-out', // Hover efekt ekleyelim
                '&:hover': {
                  transform: 'scale(1.05)', // Hoverda büyüme efekti
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)', // Hoverda gölge
                },
                marginBottom: 2, // Kartlar arasına daha fazla boşluk
              }}
            >
              <CardContent>
                {/* Kullanıcı bilgilerini görüntüle */}
                {note.author_full_name && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <Avatar
                      alt={note.author_full_name}
                      src={getProfilePicture()}
                      sx={{ width: 50, height: 50, marginRight: 2 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {note.author_full_name}
                    </Typography>
                  </Box>
                )}

                {/* Tarihi sağ üst köşeye yerleştirme */}
                {note.created_at && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontSize: '0.75rem',
                    }}
                  >
                    {timeAgo(note.created_at)}
                  </Typography>
                )}

                {/* Makale varsa, göster */}
                {selectedTab === 0 && note.content && (
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      {note.content}
                    </Typography>
                  </Box>
                )}

                {/* Video kısmı */}
                {selectedTab === 1 && note.video && (
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Video:
                    </Typography>
                    <Card sx={{ padding: 2, boxShadow: 2, marginBottom: 2 }}>
                      <video
                        controls
                        style={{ width: '100%', borderRadius: '8px' }}
                      >
                        <source src={note.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <Divider sx={{ marginTop: 2 }} /> {/* Çizgi ekle */}
                    </Card>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default Dashboard;
