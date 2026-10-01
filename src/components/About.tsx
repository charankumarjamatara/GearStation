import React, { useEffect, useRef } from 'react';
import './About.css';

import primaryImg from '../assets/new_logo.jpeg';
import secondaryImg from '../assets/logo_gearstation.jpg';
import adventureRiderVideo from '../assets/cute-elements1.mp4';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const riderVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = riderVideoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    let isMounted = true;
    let restartTimer: any = null;
    let isPlaying = false;
    let isInViewport = false;

    const playCycle = () => {
      if (!isMounted || !video) return;
      video.currentTime = 0;
      video.style.opacity = '1';

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
          })
          .catch(() => {
            isPlaying = false;
          });
      }
    };

    const handleEnded = () => {
      if (!isMounted || !video) return;
      isPlaying = false;
      video.style.opacity = '0';

      // Settle pause of 3.5s before next walking cycle
      restartTimer = setTimeout(() => {
        if (isMounted && isInViewport) {
          playCycle();
        }
      }, 3500);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInViewport = true;
            if (!isPlaying) {
              playCycle();
            }
          } else {
            isInViewport = false;
            if (restartTimer) {
              clearTimeout(restartTimer);
              restartTimer = null;
            }
            if (video && !video.paused) {
              video.pause();
              isPlaying = false;
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.25
      }
    );

    observer.observe(section);
    video.addEventListener('ended', handleEnded);

    return () => {
      isMounted = false;
      observer.disconnect();
      video.removeEventListener('ended', handleEnded);
      if (restartTimer) clearTimeout(restartTimer);
      if (video) video.pause();
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section about-section">
      <div className="container about-container">
        <div className="about-grid">
          
          <div className="about-content">
            <div className="about-label">
              <span className="label-number">01</span>
              <span className="label-text">/ OUR STORY</span>
              <div className="story-walk-track" aria-hidden="true" role="presentation">
                {/* 1. Static Ground Red Line */}
                <div className="story-walk-line"></div>
                {/* 2. Natural Walking Character Animation */}
                <div className="story-walker">
                  <video
                    ref={riderVideoRef}
                    className="story-rider-video"
                    src={adventureRiderVideo}
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
              </div>
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
              <img src={primaryImg} alt="Backpackers Destinations" className="about-img primary-img" />
              <div className="image-overlay-badge">BPD</div>
            </a>
            
            <a 
              href="https://www.instagram.com/gearstation.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="secondary-image-wrapper"
            >
              <img src={secondaryImg} alt="Gear Station" className="about-img secondary-img" />
              <div className="image-overlay-badge">GEAR</div>
            </a>
            
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
