import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="section about-section">
      <div className="container">
        <h2 className="section-title">ABOUT US</h2>
        <div className="about-grid">
          <div className="about-content">
            <p className="about-subtitle">01 / OUR STORY</p>
            <h2 className="about-title">
              TWO BRANDS.<br />
              <span className="text-primary">ONE WAY TO<br />ROAM.</span>
            </h2>
            <p className="about-lead">
              From planning the trip to packing the gear, the journey is connected.
            </p>
            
            <p className="about-desc font-bold">
              Gear Station is the equipment-rental wing of Backpackers Destinations.
            </p>
            <p className="about-desc">
              Backpackers Destinations creates trips, stories and miles worth remembering. 
              Gear Station makes sure you have the cameras, bikes, accessories and riding 
              gear to capture every part of them.
            </p>
          </div>
          
          <div className="about-images">
            <a 
              href="https://www.instagram.com/gearstation.co/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="image-wrapper travel-img-wrapper"
            >
              <img src={`${import.meta.env.BASE_URL}gearstation_profile.png`} alt="Gear Station" className="about-img" />
              <div className="img-caption">
                <span className="caption-title">THE GEAR SIDE</span>
                <span className="caption-subtitle">Gear Station</span>
              </div>
            </a>
            
            <a 
              href="https://www.instagram.com/backpackers.destinations/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="image-wrapper gear-img-wrapper"
            >
              <img src={`${import.meta.env.BASE_URL}backpackers_insta.jpg`} alt="Backpacker Destinations" className="about-img" />
              <div className="img-caption">
                <span className="caption-title">THE TRAVEL SIDE</span>
                <span className="caption-subtitle">Backpackers Destinations</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
