import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import './PopularRentals.css';

const PopularRentals: React.FC = () => {
  const products = [
    {
      name: 'DJI Action 3 Pro',
      price: '₹1,200',
      rating: 4.9,
      reviews: 120,
      imageUrl: '/dji_action_3_pro.png'
    },
    {
      name: 'DJI Action 4',
      price: '₹900',
      rating: 4.9,
      reviews: 96,
      imageUrl: '/dji_action_4.png'
    },
    {
      name: 'GoPro Hero 12',
      price: '₹1,100',
      rating: 4.7,
      reviews: 76,
      imageUrl: '/gopro_hero_12.png'
    },
    {
      name: 'Canon R6 Mark II',
      price: '₹2,500',
      rating: 4.9,
      reviews: 84,
      imageUrl: '/canon_r6_mark_ii.png'
    }
  ];

  return (
    <section id="rent-gear" className="section popular-rentals">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">POPULAR RENTALS</h2>
          <a href="#" className="view-all-link">
            VIEW ALL RENTALS <ArrowRight size={16} />
          </a>
        </div>
        
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
              rating={product.rating}
              reviews={product.reviews}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRentals;
