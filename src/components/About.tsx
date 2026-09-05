import React from 'react';
import './About.css';

import primaryImg from '../assets/logo_bpd.png';
import secondaryImg from '../assets/logo_gearstation.jpg';

const About: React.FC = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container about-container">
        <div className="about-grid">
          
          <div className="about-content">
            <div className="about-label">
              <span className="label-number">01</span>
              <span className="label-text">/ OUR STORY</span>
              <div className="label-line"></div>
            </div>
            
            <h2 className="about-title">
              TWO BRANDS.<br />
              <span className="text-primary">ONE WAY TO ROAM.</span>
            </h2>
            
            <p className="about-lead">
              From planning the trip to packing the gear, the journey is connected.
            </p>
            
            <div className="about-divider"></div>
            
            <p className="about-desc font-bold">
              Gear Station is the equipment-rental wing of Backpackers Destinations.
            </p>
            
            <p className="about-desc">
              Backpackers Destinations creates trips, stories and miles worth remembering. 
              Gear Station makes sure you have the cameras, bikes, accessories and riding 
              gear to capture every part of them.
            </p>
            
            <div className="brand-relationship">
              <span className="brand-name">BACKPACKERS<br/>DESTINATIONS</span>
              <span className="brand-x">×</span>
              <span className="brand-name">GEAR STATION</span>
            </div>
          </div>
          
          <div className="about-visuals">
            <div className="visuals-bg-text">01</div>
            
            <div className="editorial-text">
              <span>SAME<br/>PASSION.<br/>DIFFERENT<br/>JOURNEYS.</span>
              <div className="editorial-line"></div>
            </div>
            
            <a 
              href="https://www.instagram.com/backpackers.destinations/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="primary-image-wrapper"
            >
              <img src={primaryImg} alt="Backpackers Destinations Instagram" className="primary-img" />
            </a>
            
            <a 
              href="https://www.instagram.com/gearstation.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="secondary-image-wrapper"
            >
              <img src={secondaryImg} alt="Gear Station Instagram" className="secondary-img" />
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
