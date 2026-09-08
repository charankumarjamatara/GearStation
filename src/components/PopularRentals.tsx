import React from 'react';
import ProductCard from './ProductCard';
import './PopularRentals.css';


import { ALL_PRODUCTS } from './CategoryCatalog';

const PopularRentals: React.FC = () => {
  const baseProducts = [
    ALL_PRODUCTS['gp-2'],     // dji Action 5
    ALL_PRODUCTS['gp-1'],     // DJI action 4
    ALL_PRODUCTS['gp-19'],    // dji Action 5 vlogging combo
    ALL_PRODUCTS['i360-1'],   // Insta 360 X4 Action Camera
    ALL_PRODUCTS['rg-1'],     // Men Riding jacket - level 2
    ALL_PRODUCTS['rg-5'],     // Axor Riding helmet
    ALL_PRODUCTS['tg-2']      // 50L Backpack
  ].filter(Boolean);

  // Duplicate for infinite scrolling effect
  const products = [...baseProducts, ...baseProducts];

  return (
    <section id="rent-gear" className="section popular-rentals">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">POPULAR <span className="text-red">RENTALS</span></h2>
        </div>
        
        <div className="carousel-wrapper">
          <div className="products-carousel-track">
            {products.map((product, index) => (
              <div className="carousel-item" key={index}>
                <ProductCard
                  name={product.name}
                  price={product.price}
                  extraDayPrice={product.extraDayPrice}
                  imageUrl={product.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularRentals;
