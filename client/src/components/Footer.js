import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="luxury-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section brand-section">
            <h3 className="footer-brand">Luxury Rooms & Suites</h3>
            <p className="footer-tagline">
              Discover exceptional accommodations crafted for the discerning traveler
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <span className="social-icon">📘</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Browse Properties</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div className="footer-section">
            <h4 className="footer-title">Property Owners</h4>
            <ul className="footer-links">
              <li><Link to="/owner-dashboard">Owner Dashboard</Link></li>
              <li><a href="#list-property">List Your Property</a></li>
              <li><a href="#owner-resources">Owner Resources</a></li>
              <li><a href="#analytics">Analytics</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#safety">Safety Guidelines</a></li>
              <li><a href="#cancellation">Cancellation Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-section">
            <h4 className="footer-title">Contact</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+254 73 123-4567</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>juliuskedienye61@gmail.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <h4 className="newsletter-title">Stay Updated</h4>
          <p className="newsletter-text">
            Subscribe to receive exclusive offers and the latest luxury accommodation updates
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} Luxury Rooms & Suites. All rights reserved.</p>
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;