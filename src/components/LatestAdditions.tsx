import React from 'react';
import './LatestAdditions.css';

interface LatestAdditionsProps {
  onSelectCategory?: (categoryKey: string) => void;
}

const LatestAdditions: React.FC<LatestAdditionsProps> = ({ onSelectCategory }) => {
  const baseProducts = [
    { name: 'Insta360', categoryKey: 'cameras', imageUrl: `${import.meta.env.BASE_URL}new_prod_1.png` },
    { name: 'DJI Action', categoryKey: 'cameras', imageUrl: `${import.meta.env.BASE_URL}new_prod_2.png` },
    { name: 'Action Cam', categoryKey: 'cameras', imageUrl: `${import.meta.env.BASE_URL}new_prod_3.png` },
    { name: 'Riding Jacket', categoryKey: 'riding-jackets', imageUrl: `${import.meta.env.BASE_URL}new_prod_4.png` },
    { name: 'Camera Backpack', categoryKey: 'backpacks', imageUrl: `${import.meta.env.BASE_URL}new_prod_5.png` }
  ];
  const products = [...baseProducts, ...baseProducts];

  const handleClick = (e: React.MouseEvent, categoryKey: string) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    } else {
      window.location.hash = `category/${categoryKey}`;
    }
  };

  return (
    <section className="section latest-additions">
      <div className="container">
      </div>
        
      <div className="semicircle-wrapper">
        <div className="ellipse-container">
          <div className="semicircle-arch"></div>
          <div className="circle-track">
            {products.map((product, index) => {
              const angle = index * 36; // 360 / 10 items
              return (
                <div 
                  key={index} 
                  className="floating-item" 
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <a 
                    href={`#category/${product.categoryKey}`}
                    onClick={(e) => handleClick(e, product.categoryKey)}
                    className="floating-item-inner"
                    style={{ '--init-angle': `${angle}deg` } as React.CSSProperties}
                  >
                    <div className="bobbing-container">
                      <img src={product.imageUrl} alt={product.name} className="floating-img" />
                    </div>
                    <div className="floating-shadow"></div>
                    <div className="floating-tooltip">{product.name}</div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <div className="center-text-container">
          <p className="instruction-text">click on item to view details</p>
        </div>
      </div>
    </section>
  );
};

export default LatestAdditions;
