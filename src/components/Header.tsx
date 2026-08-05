import React, { useState } from 'react';
import { User, ShoppingCart, Menu, X } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-logo">
          <img src={`${import.meta.env.BASE_URL}new_logo.jpg`} alt="Gear Station Logo" className="full-logo" />
          <div className="logo-text-container">
            <span className="logo-title">Gear Station.co</span>
            <span className="logo-subtitle">by Backpackers.destinations</span>
          </div>
        </div>

        <nav className={`header-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#rent-gear" className="nav-link active" onClick={() => setIsMobileMenuOpen(false)}>RENT GEAR <span className="chevron">▼</span></a>
            </li>
            <li className="nav-item">
              <a href="#categories" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>CATEGORIES <span className="chevron">▼</span></a>
            </li>
            <li className="nav-item">
              <a href="#how-it-works" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>HOW IT WORKS</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>ABOUT US</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="User profile">
            <User size={20} />
          </button>
          <button className="icon-btn cart-btn" aria-label="Shopping cart">
            <ShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </button>
          <button className="btn btn-primary header-check-btn">CHECK AVAILABILITY</button>
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
