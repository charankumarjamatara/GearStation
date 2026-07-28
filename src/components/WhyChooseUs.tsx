import React from 'react';
import { Settings, CalendarDays, CheckCircle, ShieldCheck } from 'lucide-react';
import './WhyChooseUs.css';

const WhyChooseUs: React.FC = () => {
  return (
    <section className="why-choose-us section">
      <div className="container">
        <h2 className="visually-hidden">WHY CHOOSE GEAR STATION</h2>
        
        <div className="features-strip">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <Settings className="feature-icon" size={24} />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">Premium Gear</h4>
              <p className="feature-desc">Well maintained<br />high quality gear.</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <CalendarDays className="feature-icon" size={24} />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">Flexible Rentals</h4>
              <p className="feature-desc">Daily, weekly &<br />custom rentals.</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <CheckCircle className="feature-icon" size={24} />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">Easy Booking</h4>
              <p className="feature-desc">Quick online booking<br />in few clicks.</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <ShieldCheck className="feature-icon" size={24} />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">Trusted by<br />Adventurers</h4>
              <p className="feature-desc">Rated by thousands<br />of happy customers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
