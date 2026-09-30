import React from 'react';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';
import { CONTACT_PHONE_DISPLAY, WHATSAPP_URL, CONTACT_EMAIL } from '../utils/constants';
import './Footer.css';

const Footer: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '';
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="Gear Station Logo" className="full-logo-footer" />
            </div>
            <p className="footer-desc">
              We provide premium cameras, action cams, bikes & riding gear on rent for your next adventure.
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/gearstation.co/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><FaInstagram size={20} /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><FaFacebook size={20} /></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube"><FaYoutube size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">COMPANY</h4>
            <ul>
              <li><a href="#rent-gear" onClick={(e) => handleNavClick(e, 'rent-gear')}>RENT GEAR</a></li>
              <li><a href="#categories" onClick={(e) => handleNavClick(e, 'categories')}>CATEGORIES</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>HOW IT WORKS</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>ABOUT US</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>CONTACT</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">SUPPORT</h4>
            <ul>
              <li><a href="#terms" onClick={(e) => e.preventDefault()}>Terms & Conditions</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-links footer-contact-col">
            <h4 className="footer-title">CONTACT</h4>
            <ul>
              <li>
                <a 
                  href={WHATSAPP_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-contact-link"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="footer-contact-link">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>Hyderabad, India</li>
            </ul>
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
