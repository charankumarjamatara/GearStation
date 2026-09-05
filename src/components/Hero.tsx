import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';
import { useDateContext } from '../DateContext';
import './Hero.css';

// Import the new images
import djiAction4Img from '../assets/photography category/dji action cameras/DJI Osmo Action 4.png';
import insta360X3Img from '../assets/photography category/insta 360/I 360 X3 Action cam.webp';

const Hero: React.FC = () => {
  const { startDate, endDate, setIsDatePromptOpen } = useDateContext();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    `${import.meta.env.BASE_URL}new_prod_3.png`,
    djiAction4Img,
    insta360X3Img
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-main-layout">
          <div className="hero-left">
            <p className="hero-subtitle">YOUR NEXT ADVENTURE AWAITS</p>
            <h1 className="hero-title">
              BACKPACK. RIDE.<br />
              <span className="text-primary">TRAVEL. REPEAT.</span>
            </h1>
            <p className="hero-desc">
              Rent premium cameras, action cams,<br />
              bikes & riding gear for your next journey.
            </p>
          </div>
          
          <div className="hero-right">
            <div className="hero-visual-wrapper">
              <div className="hero-visual">
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
              <div className="hero-camera-shadow"></div>
            </div>
          </div>
        </div>

          <div className="search-bar">
            <div className="search-field">
              <label>PICKUP DATE</label>
              <div className="input-wrapper">
                <div 
                  className="date-input-hero pseudo-input" 
                  onClick={() => setIsDatePromptOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', cursor: 'pointer', padding: '12px 16px', color: startDate ? '#1e293b' : '#94a3b8', boxSizing: 'border-box' }}
                >
                  {formatDate(startDate)}
                </div>
                <Calendar size={18} className="input-icon" style={{position: 'absolute', right: '16px', pointerEvents: 'none'}} />
              </div>
            </div>
            
            <div className="search-field">
              <label>RETURN DATE</label>
              <div className="input-wrapper">
                <div 
                  className="date-input-hero pseudo-input" 
                  onClick={() => setIsDatePromptOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', cursor: 'pointer', padding: '12px 16px', color: endDate ? '#1e293b' : '#94a3b8', boxSizing: 'border-box' }}
                >
                  {formatDate(endDate)}
                </div>
                <Calendar size={18} className="input-icon" style={{position: 'absolute', right: '16px', pointerEvents: 'none'}} />
              </div>
            </div>

            <div className="search-field location-field">
              <label>PICKUP LOCATION</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <input type="text" value="Gear Station, Hyderabad" readOnly style={{ cursor: 'default' }} />
              </div>
            </div>

          </div>
      </div>
    </section>
  );
};

export default Hero;
