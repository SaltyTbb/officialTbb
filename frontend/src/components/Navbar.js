import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.scss';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Tbb Space
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          {/* <Link to="/blog" className="nav-link">
            Blog
          </Link> */}
          <Link to="/playground" className="nav-link">
            Playground
          </Link>

          <Link to="/chat" className="nav-link">
            Chat
          </Link>
          <Link to="/login" className="nav-link btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 