import React, { useEffect, useRef } from 'react';
import './About.css';

import primaryImg from '../assets/logo_bpd.png';
import secondaryImg from '../assets/logo_gearstation.jpg';
import adventureRiderVideo from '../assets/cute-elements1.mp4';

const About: React.FC = () => {
  const riderVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = riderVideoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.loop = false; // Master controller manages smooth exit fade and clean restart

    let isMounted = true;
    let restartTimer: any = null;
    let rafId: number | null = null;

    const checkFade = () => {
      if (!isMounted || !video) return;

      const t = video.currentTime;
      const duration = video.duration || 10.01;

      // Natural video playback:
      // 0.0s -> 0.3s: Subtle soft fade-in on entry
      // 0.3s -> (duration - 0.45s): 100% full opacity during walk, photo stop, and resume walk
      // (duration - 0.45s) -> duration: Smooth gradual exit fade-out to 0 opacity while walking out
      if (t < 0.3) {
        video.style.opacity = `${Math.min(1, t / 0.3)}`;
      } else if (t > duration - 0.45) {
        const fadeRemaining = Math.max(0, (duration - t) / 0.45);
        video.style.opacity = `${fadeRemaining}`;
      } else {
        video.style.opacity = '1';
      }

      if (t >= duration - 0.05 || video.ended) {
        handleCycleComplete();
        return;
      }

      rafId = requestAnimationFrame(checkFade);
    };

    const handleCycleComplete = () => {
      if (!isMounted || !video) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;

      // Fully invisible before reset
      video.style.opacity = '0';
      video.pause();
      video.currentTime = 0;

      // Clean invisible pause before the next cycle begins
      restartTimer = setTimeout(() => {
        if (isMounted) {
          startCycle();
        }
      }, 300);
    };

    const startCycle = () => {
      if (!isMounted || !video) return;
      video.currentTime = 0;
      video.style.opacity = '0';
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isMounted) {
              if (rafId) cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(checkFade);
            }
          })
          .catch(() => {
            if (isMounted) {
              restartTimer = setTimeout(startCycle, 800);
            }
          });
      }
    };

    startCycle();

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (restartTimer) clearTimeout(restartTimer);
      if (video) {
        video.pause();
      }
    };
  }, []);

  return (
    <section id="about" className="section about-section">
      <div className="container about-container">
        <div className="about-grid">
          
          <div className="about-content">
            <div className="about-label">
              <span className="label-number">01</span>
              <span className="label-text">/ OUR STORY</span>
              <div className="story-walk-track" aria-hidden="true" role="presentation">
                {/* 1. Static Red Line */}
                <div className="story-walk-line"></div>
                {/* 2. Natural Character Animation Layer */}
                <div className="story-walker">
                  <video
                    ref={riderVideoRef}
                    className="story-rider-video"
                    src={adventureRiderVideo}
                    autoPlay
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
