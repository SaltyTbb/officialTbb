import React, { useState } from 'react';
import { Typography, Box, Alert } from '@mui/material';
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
    <div className="login-container">
      <section className="login-section">
        <Typography variant="h4" className="section-title">
          Admin Login
        </Typography>
        
        {error && (
          <Alert severity="error" className="login-error">
            {error}
          </Alert>
        )}

        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Enter your password"
              />
            </div>

            <Box className="login-submit">
              <button
                type="submit"
                className="login-button"
              >
                Login
              </button>
            </Box>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login; 