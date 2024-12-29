import { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Backend API'yi kullanacak yer
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Token'ları saklamak için
import LoadingIndicator from './LoadingIndicator'; // Yükleme göstergesi

function Form({ method }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const name = method === 'login' ? 'Login' : 'Register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post(
        method === 'register' ? 'api/user/register/' : 'api/token/',
        method === 'register'
          ? {
              username: email,
              first_name: firstName,
              last_name: lastName,
              email,
              password,
            }
          : {
              username: email, // Backend username bekliyorsa burayı düzelt
              password: password,
            }
      );

      if (method === 'register') {
        navigate('/login'); // Kayıt sonrası login sayfasına yönlendir
      } else {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate('/upload'); // Login sonrası upload sayfasına yönlendir
      }
    } catch (error) {
      // Hata nesnesini güvenli şekilde kontrol et
      if (error.response) {
        console.log('Error response:', error.response);
        if (error.response.data) {
          console.log('Error data:', error.response.data);
          setError(
            error.response.data.username ||
              error.response.data.password ||
              'Login failed. Please check your credentials.'
          );
        } else {
          setError('Unexpected error occurred.');
        }
      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, #000, #4B0082)', // Background gradient
        minHeight: '100vh', // Full-screen height
        alignItems: 'center', // Center vertically
      }}
    >
      <Grid
        item
        xs={12}
        sm={7}
        md={5}
        sx={{
          padding: 3,
          background: 'transparent', // Removed surrounding box
          borderRadius: '0', // Removed border radius
          color: '#fff', // Set text color to white
          marginBottom: '150px', // Adjusted margin for better form positioning
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>
            {name}!
          </Typography>
          <Typography variant="h6" gutterBottom>
            {method === 'login' ? (
              <>
                Don't have an account yet?{' '}
                <Link
                  href="/signup"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: '#355C7D',
                  }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  href="/login"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: '#355C7D',
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {method === 'register' && (
            <>
              {/* First Name Input */}
              <TextField
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error && 'First name is required'}
                sx={{ color: '#fff', borderColor: '#fff' }}
              />

              {/* Last Name Input */}
              <TextField
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error && 'Last name is required'}
              />
            </>
          )}

          {/* Email Input */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error && 'Email is required'}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error && 'Password is required'}
          />

          {error && (
            <Typography
              color="error"
              sx={{ textAlign: 'center', marginTop: 1 }}
            >
              {error}
            </Typography>
          )}

          {loading && <LoadingIndicator />}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: '#355C7D' }}
            disabled={loading}
          >
            {name}
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}

export default Form;
