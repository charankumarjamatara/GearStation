import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Users, Star, Headset, Target } from 'lucide-react';
import './Stats.css';

const AnimatedCounter: React.FC<{ end: number, suffix?: string, duration?: number }> = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Stats: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <LayoutGrid className="stat-icon" size={28} />
            </div>
            <div className="stat-text">
              <h3 className="stat-value"><AnimatedCounter end={50} suffix="+" /></h3>
              <p className="stat-label">GEAR ITEMS</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Users className="stat-icon" size={28} />
            </div>
            <div className="stat-text">
              <h3 className="stat-value"><AnimatedCounter end={100} suffix="+" /></h3>
              <p className="stat-label">HAPPY CUSTOMERS</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Star className="stat-icon" size={28} />
            </div>
            <div className="stat-text">
              <h3 className="stat-value"><AnimatedCounter end={99} suffix="%" /></h3>
              <p className="stat-label">POSITIVE REVIEWS</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Headset className="stat-icon" size={28} />
            </div>
            <div className="stat-text">
              <h3 className="stat-value"><AnimatedCounter end={24} suffix="/7" /></h3>
              <p className="stat-label">SUPPORT</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Target className="stat-icon" size={28} />
            </div>
            <div className="stat-text">
              <h3 className="stat-value"><AnimatedCounter end={1000} suffix="+" /></h3>
              <p className="stat-label">ADVENTURERS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
