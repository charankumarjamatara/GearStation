import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className={`section how-it-works-dark ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      <div className="container">
        <h2 className="section-title text-white">HOW IT WORKS</h2>
        
        <div className="hiw-dark-grid">
          <div className="hiw-steps-col">
            <div className="steps-timeline">
              <div className="step-item">
                <div className="step-number">01</div>
                <h4 className="step-title">Choose Dates</h4>
                <p className="step-desc">Select your pickup and return dates.</p>
              </div>
              <div className="step-item">
                <div className="step-number">02</div>
                <h4 className="step-title">Pick Your Gear</h4>
                <p className="step-desc">Browse available gear for your dates.</p>
              </div>
              <div className="step-item">
                <div className="step-number">03</div>
                <h4 className="step-title">Book Online</h4>
                <p className="step-desc">Pay online or reserve & pay at store.</p>
              </div>
              <div className="step-item">
                <div className="step-number">04</div>
                <h4 className="step-title">Pick Up & Explore</h4>
                <p className="step-desc">Collect your gear and start exploring.</p>
              </div>
            </div>
          </div>
          
          <div className="hiw-banner-col">
            <div className="hiw-banner">
              <div className="banner-content">
                <p className="banner-subtitle">BUILT FOR YOUR ADVENTURES</p>
                <h3 className="banner-title">From Ladakh<br />to Kerala,</h3>
                <p className="banner-desc">we have the gear<br />you need.</p>
                <button className="btn btn-primary banner-btn">
                  EXPLORE TRIPS <ArrowRight size={16} />
                </button>
              </div>
              <div className="banner-images single-image">
                <img src={`${import.meta.env.BASE_URL}ladakh_biker.jpg`} alt="Ladakh adventure" className="banner-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
