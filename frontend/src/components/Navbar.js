import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.scss';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          The Black Box
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/blog" className="nav-link">
            Blog
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