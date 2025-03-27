import React, { useState, useEffect } from 'react';
import '../styles/pages/Chat.scss';

function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Check if a quick message exists in sessionStorage
    const quickMessage = sessionStorage.getItem('quickMessage');
    if (quickMessage) {
      // Add the message to chat history
      setChatHistory([{ text: quickMessage, sender: 'user' }]);
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        setChatHistory(prevHistory => [
          ...prevHistory,
          { text: 'Thanks for your message! This is a simulated response.', sender: 'bot' }
        ]);
      }, 1000);
      
      // Clear the quick message from sessionStorage
      sessionStorage.removeItem('quickMessage');
    }
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message to chat history
      const updatedHistory = [...chatHistory, { text: message, sender: 'user' }];
      setChatHistory(updatedHistory);
      setMessage('');
      
      // Simulate bot response after a short delay
      setTimeout(() => {
        setChatHistory(prevHistory => [
          ...prevHistory,
          { text: 'Thanks for your message! This is a simulated response.', sender: 'bot' }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="container">
      <div className="chat-container">
        <h1 className="chat-title">Chat with Tbb Space</h1>
        <p className="chat-subtitle">Feel free to ask me anything!</p>
        
        <div className="message-area">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`message message-${msg.sender}`}
            >
              <div className={`message-bubble message-bubble-${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="btn btn-primary send-button"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat; 