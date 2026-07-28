import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-subtitle">YOUR NEXT ADVENTURE AWAITS</p>
          <h1 className="hero-title">
            BACKPACK. RIDE.<br />
            <span className="text-primary">TRAVEL. REPEAT.</span>
          </h1>
          <p className="hero-desc">
            Rent premium cameras, action cams,<br />
            bikes & riding gear for your next journey.
          </p>

          <div className="search-bar">
            <div className="search-field">
              <label>PICKUP DATE</label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input type="text" value="26 Jul 2026" readOnly />
              </div>
            </div>
            
            <div className="search-field">
              <label>RETURN DATE</label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input type="text" value="30 Jul 2026" readOnly />
              </div>
            </div>

            <div className="search-field location-field">
              <label>PICKUP LOCATION</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <select defaultValue="hyderabad">
                  <option value="hyderabad">Gear Station, Hyderabad</option>
                  <option value="bangalore">Gear Station, Bangalore</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary search-btn">
              CHECK AVAILABILITY <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
