import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <Container sx={{ textAlign: 'center', marginTop: 4 }}>
      <Typography variant="h3" gutterBottom>
        500 - Internal Server Error
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Oops! Something went wrong on our end. Please try again later.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go to Home
      </Button>
    </Container>
  );
};

export default Error500;