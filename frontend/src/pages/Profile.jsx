import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import api from '../api'; // API bağlantınızın doğru olduğundan emin olun

function Profile() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Get user profile details
    api
      .get('http://localhost:8000/api/profile/')
      .then((res) => {
        setUser(res.data);

        // Store the profile picture in localStorage
        if (res.data.profile_picture) {
          const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.profile_picture}`;
          localStorage.setItem('profile_picture', imageUrl); // Store it in localStorage
        }
      })
      .catch((err) => console.error('Error fetching profile:', err));

    // Fetch notes
    getNotes();
  }, []);

  // Fetch notes from API
  const getNotes = () => {
    api
      .get('/api/notes/')
      .then((res) => setNotes(res.data))
      .catch((err) => alert(err));
  };

  // Delete a note
  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert('Note deleted successfully!');
        else alert('An error occurred while deleting the note.');
        getNotes();
      })
      .catch((err) => alert(err));
  };

  // Retrieve profile picture from localStorage, if available
  const getProfilePicture = () => {
    const storedProfilePic = localStorage.getItem('profile_picture');
    return storedProfilePic ? storedProfilePic : '/default_profile.jpg';
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#F4F6F8' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: 'center', color: '#4B0082' }}
      >
        Profil Bilgileri
      </Typography>
      {user ? (
        <Paper
          sx={{
            padding: 3,
            backgroundColor: '#fff',
            boxShadow: 3,
            marginBottom: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 3,
            }}
          >
            <Avatar
              sx={{ width: 100, height: 100, marginRight: 2 }}
              src={getProfilePicture()}
              alt="Profile Picture"
            />
          </Box>
          <Typography variant="h6">Kullanıcı Adı: {user.username}</Typography>
          <Typography variant="body1">Adı: {user.first_name}</Typography>
          <Typography variant="body1">Soyadı: {user.last_name}</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            href="/edit-profile"
          >
            Profil Düzenle
          </Button>
        </Paper>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray' }}>
          Profil bilgileri yükleniyor...
        </Typography>
      )}

      {/* Display User Notes */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: 'center', color: '#4B0082', marginBottom: 3 }}
      >
        Notlarınız
      </Typography>
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card
                sx={{
                  padding: 2,
                  boxShadow: 3,
                  backgroundColor: '#ffffff',
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    {note.content}
                  </Typography>
                  {note.video && (
                    <Box sx={{ marginBottom: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Video:
                      </Typography>
                      <video
                        controls
                        style={{ width: '100%', borderRadius: '8px' }}
                      >
                        <source src={note.video} type="video/mp4" />
                        Tarayıcınız video etiketini desteklemiyor.
                      </video>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteNote(note.id)}
                    sx={{
                      marginTop: 2,
                      backgroundColor: '#B22222',
                      '&:hover': { backgroundColor: '#8B0000' },
                    }}
                    fullWidth
                  >
                    Delete{' '}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', color: 'gray' }}
          >
            Henüz notunuz yok.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default Profile;
