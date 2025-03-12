import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Card,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import '../styles/pages/Home.scss';

function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { text: message, sender: 'user' }]);
      setMessage('');
      // Here you would typically make an API call to your chatbot backend
    }
  };

  return (
    <Container maxWidth="md">
      <Card className="home__chat-container">
        <Typography variant="h4" gutterBottom className="home__title">
          Welcome to My Personal Website
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
          Feel free to ask me anything!
        </Typography>
        
        <Box className="home__message-area">
          {chatHistory.map((msg, index) => (
            <Box
              key={index}
              className={`home__message home__message--${msg.sender}`}
            >
              <Paper
                className={`home__message-bubble home__message-bubble--${msg.sender}`}
              >
                <Typography>{msg.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        <Box className="home__input-container">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

export default Home; 