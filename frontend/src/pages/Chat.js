import React, { useState, useEffect, useRef } from 'react';
import '../styles/pages/Chat.scss';

function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    // Check if a quick message exists in sessionStorage
    const quickMessage = sessionStorage.getItem('quickMessage');
    if (quickMessage) {
      // Add the message to chat history
      setChatHistory([{ text: quickMessage, sender: 'user' }]);
      
      // Send to API instead of simulating
      sendToGeminiAPI(quickMessage);
      
      // Clear the quick message from sessionStorage
      sessionStorage.removeItem('quickMessage');
    }
  }, []);

  // Scroll to bottom whenever chat history changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set the height to the scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight <= 120) { // Max height is 120px
        textareaRef.current.style.height = scrollHeight + 'px';
      } else {
        textareaRef.current.style.height = '120px';
      }
    }
  }, [message]);

  const sendToGeminiAPI = async (text) => {
    setIsLoading(true);
    try {
      // Add loading message
      setChatHistory(prevHistory => [
        ...prevHistory,
        { text: '...', sender: 'bot', isLoading: true }
      ]);

      // Simulate API call (this would be your real API call)
      setTimeout(() => {
        // Replace loading message with simulated response
        setChatHistory(prevHistory => {
          const newHistory = [...prevHistory];
          // Find and replace the loading message
          const loadingIndex = newHistory.findIndex(msg => msg.isLoading);
          if (loadingIndex !== -1) {
            newHistory.splice(loadingIndex, 1, {
              text: `Here's a simulated response to: "${text}"`,
              sender: 'bot'
            });
          }
          return newHistory;
        });
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Replace loading with error message
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const loadingIndex = newHistory.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newHistory.splice(loadingIndex, 1, {
            text: "Sorry, there was an error processing your request. Please try again later.",
            sender: 'bot',
            isError: true
          });
        }
        return newHistory;
      });
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      // Add user message to chat history
      const updatedHistory = [...chatHistory, { text: message, sender: 'user' }];
      setChatHistory(updatedHistory);
      
      // Call Gemini API
      sendToGeminiAPI(message);
      
      // Clear input
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '46px';
      }
    }
  };

  const handleKeyPress = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };

  // Define the send icon SVG
  const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">Chat with Tbb Space</h1>
        <p className="chat-subtitle">Feel free to ask me anything!</p>
      </div>
      
      <div className="message-area" ref={messageAreaRef}>
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`message message-${msg.sender} ${msg.isLoading ? 'loading' : ''} ${msg.isError ? 'error' : ''}`}
          >
            <div className={`message-bubble message-bubble-${msg.sender}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="floating-input-container">
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Type your message... (Shift+Enter for new line)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          rows="1"
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default Chat; 