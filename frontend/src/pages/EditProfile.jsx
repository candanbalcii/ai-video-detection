import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography } from '@mui/material';
import api from '../api';

function EditProfile() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_picture: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user data from API or local storage
  useEffect(() => {
    api
      .get('/api/profile/')
      .then((res) => {
        setFormData(res.data);
        if (res.data.profile_picture) {
          setImagePreview(res.data.profile_picture); // Assuming profile_picture is a URL
        }
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_picture: file });

    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    api
      .put('/api/profile/update/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        console.log('Profile updated:', res.data);

        // Profil fotoğrafı URL'sini doğru bir şekilde güncelle
        if (res.data.profile_picture) {
          const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${
            res.data.profile_picture
          }?t=${new Date().getTime()}`;
          localStorage.setItem('profile_picture', imageUrl); // URL'yi localStorage'e kaydedin

          setImagePreview(imageUrl); // Image preview güncelleniyor
          const backendUrl = process.env.REACT_APP_BACKEND_URL;

          console.log(backendUrl);
          console.log(imageUrl);
          console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL); // URL'yi kontrol et
        }

        // Başka bir şey yapmanız gerekirse, mesela başarı mesajı
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        alert('An error occurred while updating the profile.');
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Profil Bilgilerinizi Düzenleyin
      </Typography>
      <TextField
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" component="label">
        Profil Fotoğrafı Yükle
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {imagePreview && (
        <Avatar
          src={imagePreview}
          alt="Profile Preview"
          sx={{
            width: 100,
            height: 100,
            marginTop: 2,
            marginBottom: 2,
            borderRadius: '50%',
          }}
        />
      )}

      <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
        Profil Güncelle
      </Button>
    </Box>
  );
}

export default EditProfile;
