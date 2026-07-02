import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Velora</span>
        </Link>

        {/* Hamburger Menu Icon */}
        <div 
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/shop" className="navbar-link" onClick={() => setIsOpen(false)}>
              Shop
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <Link to="/cart" className="navbar-btn navbar-btn-secondary">
            Cart
          </Link>
          <Link to="/signin" className="navbar-btn navbar-btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
