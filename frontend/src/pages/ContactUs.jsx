import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    if (!name || !email || !message) {
      alert('Please fill in all fields');
    } else {
      try {
        const response = await fetch('http://localhost:8000/contact-email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
          alert('Your message has been sent!');
          setForm({ name: '', email: '', message: '' });
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to send message');
        }
      } catch (error) {
        alert('Error sending message');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#9b59b6' }}>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns, feel free to reach out to us at{' '}
          <strong>teamdetectai@gmail.com</strong> or use the form below to send
          us a message.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            required
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ContactUs;
