import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import api from '../api';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

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

  const getProfilePicture = () => {
    const storedProfilePic = localStorage.getItem('profile_picture');
    return storedProfilePic ? storedProfilePic : '/default_profile.jpg';
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
  };

  const filteredNotes = notes.filter((note) => {
    if (selectedTab === 0) {
      return note.content && note.content.trim().length > 0;
    }
    if (selectedTab === 1) {
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
        background: 'linear-gradient(90deg, #000, #4B0082)',
        minHeight: '100vh',
        alignItems: 'center',
        padding: 0, // Remove padding from the container for full-width image
      }}
    >
      {/* Banner Image Section */}
      <Box
        component="img"
        src="/images/dashboard.jpg"
        alt="AI Illustration Right"
        sx={{
          width: '100%', // Make the image take full width of the screen
          height: 'auto', // Maintain aspect ratio
          maxHeight: '400px', // Set max height for banner
          objectFit: 'cover', // Ensure image covers the container without distortion
          borderRadius: 0, // No border radius to make it fit neatly
          marginBottom: 0, // Space between banner and content
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 8,
          marginBottom: 4,
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 2,
          width: '80%',
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
            width: '100%',
            borderBottom: '1px solid #ddd',
          }}
        >
          <Tab label="Articles" />
          <Tab label="Videos" />
        </Tabs>
      </Box>

      <Grid
        container
        spacing={2}
        direction="row"
        sx={{
          justifyContent: 'center',
          maxWidth: '1000px',
          padding: 4,
        }}
      >
        {filteredNotes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card
              sx={{
                padding: 2,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                background:
                  'linear-gradient(135deg, rgb(249, 249, 249), rgb(84, 31, 120))',
                borderRadius: 15,
                position: 'relative',
                transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                '&:hover': {
                  transform: 'rotate(-2deg) scale(1.05)',
                  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)',
                },
                marginBottom: 2,
                maxWidth: '350px',
                margin: 'auto',
                maxHeight: '500px',
                border: '2px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <CardContent
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 10,
                  padding: 2,
                }}
              >
                {note.author_full_name && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 1,
                    }}
                  >
                    <Avatar
                      alt={note.author_full_name}
                      src={getProfilePicture()}
                      sx={{ width: 40, height: 40, marginRight: 1 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {note.author_full_name}
                    </Typography>
                  </Box>
                )}

                {note.created_at && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 35,
                      fontSize: '0.75rem',
                    }}
                  >
                    {timeAgo(note.created_at)}
                  </Typography>
                )}

                {selectedTab === 1 && note.video && (
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Video:
                    </Typography>
                    <Card
                      sx={{
                        padding: 1,
                        boxShadow: 2,
                        marginBottom: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <video
                        controls
                        style={{
                          width: '100%',
                          maxWidth: '240px',
                          height: 'auto',
                          borderRadius: '8px',
                        }}
                      >
                        <source src={note.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <Divider sx={{ marginTop: 1 }} />
                    </Card>
                    {note.score && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          fontWeight: 'bold',
                          marginTop: 1,
                        }}
                      >
                        Video Skoru: {note.score}
                      </Typography>
                    )}
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
