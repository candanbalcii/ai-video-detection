import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email'; // E-posta ikonu

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSuccess, setIsSuccess] = useState(false); // Başarı durumu
  const [isError, setIsError] = useState(false); // Hata durumu
  const [isLoading, setIsLoading] = useState(false); // Yükleniyor durumu
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer kullanıcı giriş yaptıysa, formu kullanıcı bilgileriyle doldur
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
      });
    } else {
      // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Eğer mesaj alanı boşsa, hata durumu göster
    if (!formData.message) {
      setIsError(true);
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      // Burada bir API çağrısı yaparak e-posta gönderebilirsiniz
      setTimeout(() => {
        setIsSuccess(true);
        setIsError(false);
        setIsLoading(false);
        setFormData({
          ...formData,
          message: '', // Mesajı sıfırlayalım
        });
      }, 2000); // 2 saniye sonra başarılı mesajı simüle ediyoruz
    } catch (error) {
      setIsError(true);
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          padding: 3,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#4B0082' }}
        >
          Contact Us
        </Typography>

        {/* Success Alert */}
        {isSuccess && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            Your message has been sent successfully!
          </Alert>
        )}

        {/* Error Alert */}
        {isError && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            Please write a message before sending.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Name (readonly, already filled from user data) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled
              />
            </Grid>

            {/* Email (readonly, already filled from user data) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                disabled
              />
            </Grid>

            {/* Message */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Message"
                variant="outlined"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Message'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Divider sx={{ marginY: 3 }} />

        {/* E-posta adresi ve Mail butonu */}
        <Paper
          sx={{
            padding: 3,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <IconButton
            href="mailto:detectaiteam@outlook.com"
            target="_blank"
            sx={{ marginRight: 2 }}
          >
            <EmailIcon fontSize="large" color="primary" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            You can also reach us at:
            <a
              href="mailto:detectaiteam@outlook.com"
              style={{ color: '#4B0082', textDecoration: 'none' }}
            >
              detectaiteam@outlook.com
            </a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ContactUs;
