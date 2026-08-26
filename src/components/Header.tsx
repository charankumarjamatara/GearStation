import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['rent-gear', 'categories', 'how-it-works', 'about', 'contact'];
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    // If it's a hash route for category catalog, let it behave normally (or handle manually)
    if (targetId.startsWith('category/')) {
      setIsMobileMenuOpen(false);
      return; // fallback to default hash routing
    }
    
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element not found, we might be on catalog page, so we go home first
      window.location.hash = '';
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-logo" onClick={() => window.location.hash = ''} style={{cursor: 'pointer'}}>
          <img src={`${import.meta.env.BASE_URL}new_logo.jpg`} alt="Gear Station Logo" className="full-logo" />
          <div className="logo-text-container">
            <span className="logo-title">Gear Station.co</span>
            <span className="logo-subtitle">by Backpackers.destinations</span>
          </div>
        </div>

        <nav className={`header-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#rent-gear" className={`nav-link ${activeSection === 'rent-gear' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'rent-gear')}>RENT GEAR</a>
            </li>
            <li className="nav-item dropdown">
              <a href="#categories" className={`nav-link ${activeSection === 'categories' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'categories')}>CATEGORIES <span className="chevron">▼</span></a>
              <ul className="dropdown-menu">
                <li><a href="#category/photography" onClick={(e) => handleLinkClick(e, 'category/photography')}>Photography</a></li>
                <li><a href="#category/outdoor" onClick={(e) => handleLinkClick(e, 'category/outdoor')}>Outdoor Gears</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#how-it-works" className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'how-it-works')}>HOW IT WORKS</a>
            </li>
            <li className="nav-item">
              <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'about')}>ABOUT US</a>
            </li>
            <li className="nav-item">
              <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, 'contact')}>CONTACT</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
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
