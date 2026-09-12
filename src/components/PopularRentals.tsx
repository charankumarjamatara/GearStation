import React from 'react';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../data/products';
import './PopularRentals.css';

interface PopularRentalsProps {
  onSelectProduct?: (productIdOrSlug: string) => void;
}

const PopularRentals: React.FC<PopularRentalsProps> = ({ onSelectProduct }) => {
  const baseProducts = [
    ALL_PRODUCTS['gp-2'],     // dji Action 5
    ALL_PRODUCTS['gp-1'],     // DJI action 4
    ALL_PRODUCTS['dji-1'],    // DJI Pocket 3
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
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  extraDayPrice={product.extraDayPrice}
                  imageUrl={product.imageUrl}
                  onSelectProduct={onSelectProduct}
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
