import React from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';

const Home = () => {
  return (
    <Box
      style={{
        background: 'linear-gradient(90deg, #000, #4B0082)', // Navbar ile aynı degrade
        minHeight: '100vh', // Tam ekran yüksekliği
        color: '#fff', // Beyaz yazı
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container
        disableGutters // Varsayılan iç boşlukları sıfırla
        maxWidth={true} // Konteyneri tam genişlik yap
        style={{ padding: '0' }} // Ekstra iç boşlukları kaldır
      >
        <Grid container spacing={0} alignItems="center">
          {/* Yazı sol tarafta */}
          <Grid
            item
            xs={12}
            md={6}
            style={{
              textAlign: 'left', // Yazıyı sola yasla
              paddingLeft: '150px', // Sola boşluk bırak
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at
              ipsum vitae lacus lobortis lacinia. Donec tristique arcu massa, at
              pharetra tortor feugiat non.
            </Typography>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#4B0082',
                color: '#FFF',
                padding: '10px 20px',
              }}
            >
              Learn More
            </Button>
          </Grid>
          {/*Resim sağ tarafta*/}
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
              src="/images/robott.png"
              alt="AI Illustration Right"
              style={{
                width: '100%',
                maxWidth: '900px', // Resmin genişliğini sınırladık
                borderRadius: '30px',
                margin: '0', // İç ve dış boşlukları sıfırla
              }}
            />
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center', // Yatayda ortalamak
                alignItems: 'flex-start', // Dikeyde yukarıya hizalamak
                height: '100vh', // Container'in tam ekran olmasını sağlamak için
              }}
            >
              <Box
                component="img"
                src="/images/balon.png"
                alt="AI Illustration Right"
                style={{
                  width: '50%',
                  maxWidth: '200px',
                  borderRadius: '70px',
                  margin: '0',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
