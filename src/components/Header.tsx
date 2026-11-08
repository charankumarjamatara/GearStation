import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartContext } from '../CartContext';
import HeaderSearch from './HeaderSearch';
const logoImg = '/gearstation_new_logo.png';
import { scrollToSection, getStickyHeaderHeight } from '../utils/navigation';
import './Header.css';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { cartItems, setIsCartOpen } = useCartContext();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['rent-gear', 'categories', 'how-it-works', 'about', 'contact'];
      let current = '';
      const headerHeight = getStickyHeaderHeight();
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerHeight + 80 && rect.bottom >= headerHeight + 40) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMobileMenuOpen(false);

    if (targetId.startsWith('category/')) {
      e.preventDefault();
      const catKey = targetId.replace('category/', '');
      window.history.pushState(null, '', `/categories/${catKey}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    e.preventDefault();

    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState(null, '', `/#${targetId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        scrollToSection(targetId, true);
      }, 100);
      return;
    }
    
    requestAnimationFrame(() => {
      const scrolled = scrollToSection(targetId, true);
      if (!scrolled) {
        window.history.pushState(null, '', `/#${targetId}`);
        setTimeout(() => {
          scrollToSection(targetId, true);
        }, 100);
      } else {
        window.history.pushState(null, '', `#${targetId}`);
      }
    });
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (window.location.pathname !== '/' && window.location.pathname !== '') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (window.location.hash) {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        {/* Mobile Hamburger on Left */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo & Brand Name */}
        <div className="header-logo">
          <img 
            src={logoImg} 
            alt="Gear Station" 
            className="full-logo" 
            onClick={handleLogoClick}
          />
          <div className="logo-text-container">
            <span className="logo-title" onClick={handleLogoClick}>Gear Station</span>
            <a 
              href="https://backpackersdestinations.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="logo-subtitle"
              onClick={(e) => e.stopPropagation()}
              aria-label="Backpackers Destinations Website"
            >
              BY BACKPACKERS DESTINATIONS
            </a>
          </div>
        </div>

        {/* Desktop Nav */}
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

        {/* Actions on Right */}
        <div className="header-actions">
          <HeaderSearch />
          <button className="icon-btn cart-btn" aria-label="Shopping cart" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} />
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
