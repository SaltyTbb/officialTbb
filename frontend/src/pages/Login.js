import React, { useState } from 'react';
import {
  Container,
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Login.scss';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Here you would typically make an API call to your backend
      // For now, we'll use dummy authentication
      if (username === 'admin' && password === 'password') {
        // Store the token in localStorage
        localStorage.setItem('authToken', 'dummy-token');
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card className="login__card">
        <Typography variant="h4" gutterBottom className="login__title">
          Admin Login
        </Typography>
        
        {error && (
          <Alert severity="error" className="login__error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="login__form">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Box className="login__submit">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Login
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
}

export default Login; 