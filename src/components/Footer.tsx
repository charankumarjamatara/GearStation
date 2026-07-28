import React from 'react';
import { Camera, Globe, Video, MessageCircle, Send } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.jpg" alt="Gear Station Logo" className="full-logo-footer" />
            </div>
            <p className="footer-desc">
              We provide premium cameras, action cams, bikes & riding gear on rent for your next adventure.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Camera size={20} /></a>
              <a href="#" className="social-icon"><Globe size={20} /></a>
              <a href="#" className="social-icon"><Video size={20} /></a>
              <a href="#" className="social-icon"><MessageCircle size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">COMPANY</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">SUPPORT</h4>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">CONTACT</h4>
            <ul>
              <li>+91 73070 81067</li>
              <li>hello@gearstation.co</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h4 className="footer-title">NEWSLETTER</h4>
            <p className="newsletter-desc">
              Get updates on new gear, offers & travel stories.
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-primary newsletter-btn">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Gear Station.co, All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
