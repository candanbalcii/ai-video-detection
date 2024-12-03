import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { loginSchema } from '../schemas/loginSchema';

const Login = () => {
  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    console.log('Logging in with values:', values);

    // Simulating a login process (no backend interaction)
    setTimeout(() => {
      if (
        values.email === 'test@example.com' &&
        values.password === 'password123'
      ) {
        console.log('Login successful!');
      } else {
        setErrors({ email: 'Invalid email or password.' });
        console.error('Login failed: Invalid credentials.');
      }
      setSubmitting(false);
    }, 1000); // Simulate network delay
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, #000, #4B0082)', // Arka plan degrade
        minHeight: '100vh', // Tam ekran yüksekliği
        alignItems: 'center', // Dikeyde ortalama
      }}
    >
      {/* Form bölümü */}
      <Grid
        item
        xs={12}
        sm={7}
        md={5}
        sx={{
          padding: 3,
          background: 'transparent', // Çevreleyen kutuyu kaldırdık
          borderRadius: '0', // Köşe yuvarlama kaldırıldı
          color: '#fff', // Yazı rengini beyaz yaptık
          marginBottom: '150px', // Formu yukarıya çekmek için margin ekledik
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="h6" gutterBottom>
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
          </Typography>
        </Box>

        <Formik
          initialValues={{ email: '', password: '', keepLoggedIn: false }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              {/* Email Input */}
              <FormInput
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              {/* Password Input */}
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={values.password}
                required
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="keepLoggedIn"
                      checked={values.keepLoggedIn}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Keep me logged in"
                />
                <Link href="#" variant="body2" sx={{ color: '#355C7D' }}>
                  Forgot password?
                </Link>
              </Box>
              <SubmitButton text="Login" disabled={isSubmitting} />
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default Login;
