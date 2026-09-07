import React from 'react';
import ProductCard from './ProductCard';
import './PopularRentals.css';
import djiAction5Img from '../assets/photography category/dji action cameras/dji Action 5.jpg';
import djiAction4Img from '../assets/photography category/dji action cameras/dji Action 4.jpg';
import djiAction5VloggingImg from '../assets/photography category/dji action cameras/dji Action 5 vlogging.png';
import insta360X4Img from '../assets/photography category/insta 360/Insta 360 X4 Action Camera.jpg';

import menRidingJacketImg from '../assets/outdoor category/Riding gear/Men Riding jacket - level 2.jpeg';
import axorHelmetImg from '../assets/outdoor category/Riding gear/axor riding helmet.jpg';
import backpack50LImg from '../assets/outdoor category/trekking gear/50L Backpack.png';

const PopularRentals: React.FC = () => {
  const baseProducts = [
    {
      name: 'dji Action 5',
      price: '₹1699',
      rating: 4.5,
      reviews: 120,
      imageUrl: djiAction5Img
    },
    {
      name: 'DJI action 4',
      price: '₹1249',
      rating: 4.5,
      reviews: 96,
      imageUrl: djiAction4Img
    },
    {
      name: 'dji Action 5 vlogging combo',
      price: '₹2499',
      rating: 4.5,
      reviews: 76,
      imageUrl: djiAction5VloggingImg
    },
    {
      name: 'Insta 360 X4 Action Camera',
      price: '₹1599',
      rating: 4.5,
      reviews: 84,
      imageUrl: insta360X4Img
    },

    {
      name: 'Men Riding jacket - level 2',
      price: '₹799',
      rating: 4.5,
      reviews: 145,
      imageUrl: menRidingJacketImg
    },
    {
      name: 'Axor Riding helmet',
      price: '₹699',
      rating: 4.5,
      reviews: 89,
      imageUrl: axorHelmetImg
    },
    {
      name: '50L Backpack',
      price: '₹299',
      rating: 4.5,
      reviews: 204,
      imageUrl: backpack50LImg
    }
  ];

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
