import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    name: "Rohit Sharma",
    trip: "Ladakh Trip",
    initials: "RS",
    quote: "Amazing experience! The gear was in perfect condition and made our trip unforgettable."
  },
  {
    name: "Priya Singh",
    trip: "Spiti Valley Expedition",
    initials: "PS",
    quote: "Highly recommend Gear Station. They provided excellent quality tents and sleeping bags for our entire group."
  },
  {
    name: "Karan Patel",
    trip: "Goa Coastal Ride",
    initials: "KP",
    quote: "Rented an Insta360 and a GoPro. The booking process was seamless and the cameras were spotless."
  },
  {
    name: "Sneha Reddy",
    trip: "Western Ghats Trek",
    initials: "SR",
    quote: "Top notch service and extremely helpful staff. They made sure we had the right equipment for the terrain."
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="section testimonials">
      <div className="container">
        <div className="section-header center-title-header">
          <div className="title-wrapper">
            <h2 className="section-title">WHAT ADVENTURERS SAY</h2>
          </div>
        </div>
        
        <div className="testimonial-slider-container">
          <button className="slider-btn prev-btn" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="testimonial-viewport">
            <div 
              className="testimonial-track" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((t, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-content-wrapper">
                    <div className="testimonial-author">
                      <div className="author-image-placeholder">
                        <span className="avatar-text">{t.initials}</span>
                      </div>
                    </div>
                    <div className="testimonial-text-content">
                      <div className="quote-icon-wrapper">
                        <span className="quote-mark left-quote">"</span>
                      </div>
                      <p className="testimonial-quote">
                        {t.quote}
                        <span className="quote-mark right-quote">"</span>
                      </p>
                      <div className="author-info">
                        <h4 className="author-name">{t.name}</h4>
                        <p className="author-trip">{t.trip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="slider-btn next-btn" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="slider-dots">
          {testimonials.map((_, idx) => (
            <button 
              key={idx} 
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
