import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiTwitter
} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Content */}
        <div className="footer-content">
          
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <h3 className="footer-logo">Velora</h3>
            <p className="footer-description">
              Discover premium fashion and accessories for every lifestyle. Quality, comfort, and style in every collection.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="#" className="social-link" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/signin">Sign In</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-section-title">Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Return Policy</Link></li>
              <li><Link to="#">Shipping Info</Link></li>
              <li><Link to="#">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FiMail className="contact-icon" />
                <span>support@velora.com</span>
              </div>
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <span>New York, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 Velora Store. All rights reserved. | Modern shopping experience for everyone.
          </p>
          <div className="footer-legal">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms & Conditions</Link>
            <Link to="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
