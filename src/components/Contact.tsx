import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">CONTACT</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-subtitle">GET IN TOUCH</p>
            <h2 className="contact-title">
              READY FOR YOUR<br />
              <span className="text-primary">NEXT ADVENTURE?</span>
            </h2>
            <p className="contact-desc">
              Questions about gear, availability or your<br />
              route? Our Hyderabad team is here to help.
            </p>
          </div>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-num">01</span>
              <div>
                <p className="contact-label">CALL US</p>
                <p className="contact-value">+91 73079 81667</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-num">02</span>
              <div>
                <p className="contact-label">EMAIL US</p>
                <p className="contact-value">hello@gearstation.co</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-num">03</span>
              <div>
                <p className="contact-label">VISIT US</p>
                <p className="contact-value">Gear Station, Hyderabad</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            <form className="contact-form">
              <div className="form-row">
                <input type="text" placeholder="Your name" className="form-input" />
                <input type="email" placeholder="Email address" className="form-input" />
              </div>
              <textarea placeholder="How can we help?" className="form-input form-textarea"></textarea>
              <button type="submit" className="btn btn-primary submit-btn">
                SEND MESSAGE <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
