import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [showFeatures, setShowFeatures] = useState(false);

  // Scroll event listener to trigger feature section visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show features section when scroll reaches the bottom of the welcome section
      if (scrollPosition > window.innerHeight / 2) {
        setShowFeatures(true);
      } else {
        setShowFeatures(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      style={{
        background: 'linear-gradient(90deg, #000, #4B0082)', // Navbar ile aynı degrade
        minHeight: '100vh', // Tam ekran yüksekliği
        color: '#fff', // Beyaz yazı
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingBottom: '50px', // Alt boşluk ekleyelim
      }}
    >
      <Container disableGutters maxWidth={true} style={{ padding: '0' }}>
        <Grid container spacing={0} alignItems="center">
          {/* Home sayfası kısmı */}
          <Grid
            item
            xs={12}
            md={6}
            style={{
              textAlign: 'left',
              paddingLeft: '150px',
              paddingBottom: '80px',
            }}
          >
            <Typography
              variant="h2"
              style={{
                fontWeight: 'bold',
                letterSpacing: '3px',
              }}
            >
              WELCOME TO DETECTAI
            </Typography>
            <Typography
              variant="body1"
              style={{
                margin: '50px 0',
                maxWidth: '600px',
                lineHeight: '1.6',
              }}
            >
              DetectAI is a reliable platform designed to detect AI-generated
              fake videos. It aims to help individuals and media professionals
              quickly identify misleading content, promoting trust in online
              information and raising awareness about digital security.
            </Typography>
            <Box style={{ display: 'flex', gap: '15px' }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#4B0082',
                  color: '#FFF',
                  padding: '10px 20px',
                  marginBottom: '20px',
                  width: '150px',
                  height: '50px',
                }}
                component={Link}
                to="/signup"
              >
                Signup
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                style={{
                  color: '#4B0082',
                  borderColor: '#4B0082',
                  width: '150px',
                  height: '50px',
                }}
                component={Link}
                to="/login"
              >
                Login
              </Button>
            </Box>
          </Grid>

          {/* Resim sağ tarafta */}
          <Grid
            item
            xs={12}
            md={6}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Box
              component="img"
              src="/images/DETECTAI.gif"
              alt="AI Illustration Right"
              style={{
                width: '170%',
                maxWidth: '3200px',
                borderRadius: '30px',
                margin: '0',
                transition: 'opacity 1s ease-in-out',
                backgroundAttachment: 'fixed', // Fix the background image while scrolling
              }}
            />
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box
          style={{
            background: 'linear-gradient(90deg, #000, #4B0082)', // Welcome kısmıyla aynı arka plan rengi
            padding: '60px 0',
            width: '100%',
            opacity: showFeatures ? 1 : 0, // Opacity ile yumuşak geçiş
            transform: showFeatures ? 'translateY(0)' : 'translateY(50px)', // Yumuşak kaydırma efekti
            transition: 'opacity 1s ease, transform 1s ease', // Yumuşak geçiş animasyonu

            backgroundSize: 'cover', // Ensure the background fills the section
            backgroundPosition: 'center', // Center the GIF for better display
            height: '600px', // Height to give enough space for the content
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#fff',
            }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    Real-Time Detection
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginTop: '10px' }}
                  >
                    DetectAI uses advanced AI algorithms to identify fake videos
                    instantly in real-time, ensuring quick and accurate
                    detection.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    User-Friendly Interface
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginTop: '10px' }}
                  >
                    Our platform is designed with simplicity and usability in
                    mind, providing a seamless experience for everyone.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    Secure Platform
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginTop: '10px' }}
                  >
                    We prioritize your security with end-to-end encryption and a
                    safe environment to interact with our services.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
