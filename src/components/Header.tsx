import React from 'react';
import { User, ShoppingCart } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-logo">
          <img src="/logo.jpg" alt="Gear Station Logo" className="full-logo" />
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#rent-gear" className="nav-link active">RENT GEAR <span className="chevron">▼</span></a>
            </li>
            <li className="nav-item">
              <a href="#categories" className="nav-link">CATEGORIES <span className="chevron">▼</span></a>
            </li>
            <li className="nav-item">
              <a href="#how-it-works" className="nav-link">HOW IT WORKS</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link">ABOUT US</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className="nav-link">CONTACT</a>
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
          <button className="btn btn-primary">CHECK AVAILABILITY</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
