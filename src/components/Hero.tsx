import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';
import { useDateContext } from '../DateContext';
import './Hero.css';

const Hero: React.FC = () => {
  const { startDate, endDate, setIsDatePromptOpen } = useDateContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    `${import.meta.env.BASE_URL}new_prod_1.png`,
    `${import.meta.env.BASE_URL}new_prod_2.png`,
    `${import.meta.env.BASE_URL}new_prod_3.png`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleExploreGear = () => {
    const el = document.getElementById('categories') || document.getElementById('popular-rentals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-main-layout">
          <div className="hero-left">
            <p className="hero-subtitle">YOUR NEXT ADVENTURE AWAITS</p>
            
            {/* Desktop Headline (2 lines) */}
            <h1 className="hero-title hero-title-desktop">
              BACKPACK. RENT.<br />
              <span className="text-primary">TRAVEL. REPEAT.</span>
            </h1>

            {/* Mobile Headline (4 lines) */}
            <h1 className="hero-title hero-title-mobile">
              BACKPACK.<br />
              RENT.<br />
              <span className="text-primary">TRAVEL.<br />REPEAT.</span>
            </h1>

            <p className="hero-desc">
              Rent premium cameras,<br />
              action cams, bikes &<br />
              riding gear for your<br />
              next journey.
            </p>
          </div>
          
          <div className="hero-right">
            {/* Layered graphic shapes, radiant lines & halftone dots */}
            <div className="hero-graphic-bg" aria-hidden="true">
              <div className="hero-bg-pink"></div>
              <div className="hero-dots-cluster hero-dots-topright"></div>
              <div className="hero-dots-cluster hero-dots-bottomleft"></div>
              <div className="hero-bg-coral"></div>
              
              {/* Radiating accent marks for camera on mobile */}
              <div className="hero-radiant-accents">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="hero-visual-wrapper">
              <div className="hero-visual">
                {/* Unified Camera Carousel for Desktop & Mobile */}
                <div className="hero-camera-carousel">
                  {carouselImages.map((img, index) => {
                    let statusClass = 'next';
                    if (index === currentImageIndex) {
                      statusClass = 'active';
                    } else if (index === (currentImageIndex - 1 + carouselImages.length) % carouselImages.length) {
                      statusClass = 'prev';
                    }
                    
                    return (
                      <img 
                        key={index}
                        src={img} 
                        alt={`Action Camera ${index + 1}`} 
                        className={`hero-camera ${statusClass}`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="hero-camera-shadow"></div>
            </div>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className="search-bar booking-card">
          <div className="search-field" onClick={() => setIsDatePromptOpen(true)}>
            <label>RENT FROM</label>
            <div className="input-wrapper">
              <div 
                className="date-input-hero pseudo-input" 
                style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', cursor: 'pointer', color: startDate ? '#1e293b' : '#94a3b8' }}
              >
                {formatDate(startDate)}
              </div>
              <Calendar size={18} className="input-icon" />
            </div>
          </div>
          
          <div className="search-field" onClick={() => setIsDatePromptOpen(true)}>
            <label>TO</label>
            <div className="input-wrapper">
              <div 
                className="date-input-hero pseudo-input" 
                style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', cursor: 'pointer', color: endDate ? '#1e293b' : '#94a3b8' }}
              >
                {formatDate(endDate)}
              </div>
              <Calendar size={18} className="input-icon" />
            </div>
          </div>

          <div className="search-field location-field">
            <label>LOCATION</label>
            <div className="input-wrapper location-wrapper">
              <MapPin size={18} className="input-icon location-pin-icon" />
              <input type="text" value="Gear Station, Hyderabad" readOnly style={{ cursor: 'default' }} />
              <ChevronDown size={18} className="location-chevron-icon" />
            </div>
          </div>

          {/* Full-width CTA Button on Mobile */}
          <button 
            type="button" 
            className="hero-explore-cta-mobile" 
            onClick={handleExploreGear}
            aria-label="Explore Gear"
          >
            <span>Explore Gear</span>
            <div className="cta-icon-circle">
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
