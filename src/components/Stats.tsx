import React from 'react';
import './Stats.css';

const Stats: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-text">
              <span className="stat-value">150+</span>
              <p className="stat-label">GEAR ITEMS</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-text">
              <span className="stat-value">24/7</span>
              <p className="stat-label">SUPPORT</p>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-text">
              <span className="stat-value">1000+</span>
              <p className="stat-label">ADVENTURERS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
