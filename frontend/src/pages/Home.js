import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Home.scss';

function Home() {
  const [greeting, setGreeting] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current hour
    const currentHour = new Date().getHours();
    
    // Set the greeting based on the time of day
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good morning!');
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good afternoon!');
    } else {
      setGreeting('Good evening!');
    }
  }, []);

  const handleQuickChat = (e) => {
    e.preventDefault();
    if (quickMessage.trim()) {
      // Save the message to sessionStorage to retrieve it on the chat page
      sessionStorage.setItem('quickMessage', quickMessage);
      // Navigate to the chat page
      navigate('/chat');
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <p className="hero-greeting">{greeting}</p>
        <h1 className="hero-title">Welcome to Tbb's Personal Space</h1>
        <p className="hero-subtitle">-I hope this frontend works.</p>
        
        <form onSubmit={handleQuickChat} className="quick-chat-form">
          <input
            type="text"
            placeholder="Ask me more about Tbb..."
            value={quickMessage}
            onChange={(e) => setQuickMessage(e.target.value)}
            className="quick-chat-input"
          />
          <button type="submit" className="quick-chat-button">
            <span className="quick-chat-button-icon">⟶</span>
          </button>
        </form>
        <div className="hero-buttons">
          <Link to="/about" className="btn btn-outline">Learn More about Tbb</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">What This Space Does</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3 className="feature-title">Interactive Chat</h3>
            <p className="feature-description">Engage with the AI-powered chatbot for immediate assistance and information.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Knowledge Base</h3>
            <p className="feature-description">A simple blog to and hope Tbb remembers to update it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Project Showcases</h3>
            <p className="feature-description">Explore Tbb's portfolio of projects.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 