import React from 'react';
import { ArrowRight } from 'lucide-react';
import './LatestAdditions.css';

const LatestAdditions: React.FC = () => {
  const products = [
    { name: 'Canon R6 Mark II', imageUrl: `${import.meta.env.BASE_URL}canon_r6_mark_ii.png` },
    { name: 'Camera Backpack', imageUrl: `${import.meta.env.BASE_URL}camera_backpack.png` },
    { name: 'GoPro Hero 12', imageUrl: `${import.meta.env.BASE_URL}gopro_hero_12.png` },
    { name: 'Insta360 X4', imageUrl: `${import.meta.env.BASE_URL}insta360_x4.png` },
    { name: 'DJI Action 4', imageUrl: `${import.meta.env.BASE_URL}dji_action_4.png` },
    { name: 'Riding Jacket', imageUrl: `${import.meta.env.BASE_URL}riding_jacket.png` }
  ];

  return (
    <section className="section latest-additions">
      <div className="container">
      </div>
        
      <div className="semicircle-wrapper">
        <div className="ellipse-container">
          <div className="semicircle-arch"></div>
          
          <div className="circle-track">
            {products.map((product, index) => {
              const angle = index * 60; // 360 / 6 items
              return (
                <div 
                  key={index} 
                  className="floating-item" 
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div 
                    className="floating-item-inner"
                    style={{ '--init-angle': `${angle}deg` } as React.CSSProperties}
                  >
                    <img src={product.imageUrl} alt={product.name} className="floating-img" />
                    <div className="floating-tooltip">{product.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="center-btn-container">
          <button className="btn btn-primary rounded-btn">
            Click to view details
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestAdditions;
