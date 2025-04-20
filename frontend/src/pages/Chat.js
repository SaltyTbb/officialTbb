import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/pages/Chat.scss';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // State to track messages with typewriter effect
  const [typingMessages, setTypingMessages] = useState({});
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messageAreaRef = useRef(null);

  // Get configuration from environment variables
  // Look for env variables in window._env_ first (for Docker/production)
  // Fall back to process.env (for local development)
  const getEnvVar = (name, defaultValue) => {
    if (window._env_ && window._env_[name]) {
      return window._env_[name];
    }
    return process.env[name] || defaultValue;
  };

  // API endpoint URL from environment variables
  const API_BASE_URL = getEnvVar('REACT_APP_API_BASE_URL', 'http://localhost:8000');

  // Use the simplified endpoint that will be proxied by nginx in production
  const API_URL = `${window.location.origin}/chat`;

  // For development, use the direct backend URL when not running through the proxy
  const DEV_API_URL = `${API_BASE_URL}/api/v1/chat`;

  // Determine which URL to use based on environment
  const CHAT_API_URL = process.env.NODE_ENV === 'production' ? API_URL : DEV_API_URL;

  console.log('Chat API URL:', CHAT_API_URL); // Add logging to help debug

  // Timeout duration in milliseconds from environment variables
  const TIMEOUT_DURATION = parseInt(getEnvVar('REACT_APP_API_TIMEOUT', '10000'));

  // Typewriter effect function
  const startTypewriterEffect = useCallback((messageId, fullText) => {
    let i = 0;
    const typingSpeed = 5; // milliseconds per character - reduced from 20 to 5 for faster typing
    
    // Start with empty displayed text
    setTypingMessages(prev => ({...prev, [messageId]: ''}));
    
    const typeNextChar = () => {
      if (i < fullText.length) {
        // Determine how many characters to type at once based on text length
        // For longer texts, type multiple characters at once
        let charsToAdd = 1;
        if (fullText.length > 500) {
          charsToAdd = 5; // Type 5 chars at once for very long texts
        } else if (fullText.length > 200) {
          charsToAdd = 3; // Type 3 chars at once for medium-length texts
        }
        
        // Make sure we don't go beyond the text length
        const nextIndex = Math.min(i + charsToAdd, fullText.length);
        
        setTypingMessages(prev => ({
          ...prev, 
          [messageId]: fullText.substring(0, nextIndex)
        }));
        
        i = nextIndex;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        // Typing complete - update the actual message text and remove from typing state
        setChatHistory(prevHistory => {
          return prevHistory.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                text: fullText
              };
            }
            return msg;
          });
        });
        
        setTypingMessages(prev => {
          const newState = {...prev};
          delete newState[messageId]; // Remove from typing state
          return newState;
        });
      }
    };
    
    typeNextChar();
  }, [setChatHistory, setTypingMessages]);

  // Define sendToGeminiAPI with useCallback to avoid dependency cycle
  const sendToGeminiAPI = useCallback(async (text) => {
    setIsLoading(true);
    try {
      // Add loading message with loading indicator
      setChatHistory(prevHistory => [
        ...prevHistory,
        { text: 'Loading...', sender: 'bot', isLoading: true }
      ]);

      // Create a source for cancellation
      const source = axios.CancelToken.source();
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        source.cancel('Request timed out after 10 seconds');
      }, TIMEOUT_DURATION);

      // Make the actual API call to the backend with timeout - use the CHAT_API_URL
      const response = await axios.post(CHAT_API_URL, {
        message: text
      }, {
        cancelToken: source.token,
        timeout: TIMEOUT_DURATION
      });

      // Clear timeout since request completed
      clearTimeout(timeoutId);

      // Handle response based on the backend API structure
      let responseText = '';
      if (response.data && response.data.data) {
        responseText = response.data.data;
      } else if (response.data && response.data.message) {
        responseText = response.data.message;
      } else {
        responseText = "Received response in unexpected format.";
      }

      // Create a new message ID for typewriter effect
      const messageId = `msg-${Date.now()}`;

      // Replace loading message with an empty message to start the typewriter effect
      // Store the real response in a separate property to avoid showing it prematurely
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        // Find and replace the loading message
        const loadingIndex = newHistory.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newHistory.splice(loadingIndex, 1, {
            id: messageId,
            text: "", // Start with empty text
            fullText: responseText, // Store the full text separately
            sender: 'bot',
            hasTypewriter: true,
            isMarkdown: true
          });
        }
        return newHistory;
      });

      // Start typewriter effect after a short delay
      setTimeout(() => {
        startTypewriterEffect(messageId, responseText);
      }, 50);

      setIsLoading(false);

    } catch (error) {
      console.error('Error calling Chatbot API:', error);
      
      // Check if it's a timeout error
      let errorMessage = "Sorry, there was an error processing your request. Please try again later.";
      if (error.message && error.message.includes('timeout')) {
        errorMessage = "Request timed out. The server is taking too long to respond.";
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      // Replace loading with error message
      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const loadingIndex = newHistory.findIndex(msg => msg.isLoading);
        if (loadingIndex !== -1) {
          newHistory.splice(loadingIndex, 1, {
            text: errorMessage,
            sender: 'bot',
            isError: true
          });
        }
        return newHistory;
      });
      setIsLoading(false);
    }
  }, [CHAT_API_URL, TIMEOUT_DURATION, startTypewriterEffect]);

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
  }, [sendToGeminiAPI]);

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

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );

  // Custom components for markdown rendering
  const markdownComponents = {
    // Customize link rendering
    a: ({ node, children, ...props }) => (
      <a {...props} target="_blank" rel="noopener noreferrer" className="markdown-link">
        {children || 'Link'}
      </a>
    ),
    // Customize code blocks
    code: ({ node, inline, ...props }) => (
      inline 
        ? <code className="markdown-inline-code" {...props} />
        : <div className="markdown-code-block">
            <code {...props} />
          </div>
    ),
    // Customize headings
    h1: ({ node, children, ...props }) => <h3 className="markdown-heading" {...props}>{children || 'Heading'}</h3>,
    h2: ({ node, children, ...props }) => <h4 className="markdown-heading" {...props}>{children || 'Heading'}</h4>,
    h3: ({ node, children, ...props }) => <h5 className="markdown-heading" {...props}>{children || 'Heading'}</h5>,
    // Customize lists
    ul: ({ node, ...props }) => <ul className="markdown-list" {...props} />,
    ol: ({ node, ...props }) => <ol className="markdown-list" {...props} />,
    // Customize table
    table: ({ node, ...props }) => <table className="markdown-table" {...props} />,
    // Customize blockquote
    blockquote: ({ node, ...props }) => <blockquote className="markdown-blockquote" {...props} />
  };

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
              {msg.isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="loading-text">Thinking...</span>
                </>
              ) : msg.hasTypewriter && typingMessages[msg.id] !== undefined ? (
                <div className="typewriter-text">
                  {msg.isMarkdown ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      components={markdownComponents}
                    >
                      {typingMessages[msg.id]}
                    </ReactMarkdown>
                  ) : (
                    typingMessages[msg.id]
                  )}
                </div>
              ) : (
                <>
                  {msg.isMarkdown ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {msg.text || (msg.fullText && msg.hasTypewriter ? "" : msg.fullText)}
                    </ReactMarkdown>
                  ) : (
                    msg.text || (msg.fullText && msg.hasTypewriter ? "" : msg.fullText)
                  )}
                </>
              )}
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