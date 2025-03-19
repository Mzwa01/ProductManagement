import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import agent from '../api/agent';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await agent.authApi.login(email, password);
     
      setToken(response.data.token);
      navigate('/');
    } catch (err) {
      console.log(err); 
      setError('Invalid email or password');
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card sx={{ maxWidth: 400, margin: '0 auto' }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
            Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;