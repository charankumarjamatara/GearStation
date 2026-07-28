import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import './ProductCard.css';

interface ProductCardProps {
  name: string;
  price: string;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  buttonText?: string;
  showHeart?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  price, 
  rating, 
  reviews, 
  imageUrl, 
  buttonText = "ADD TO CART",
  showHeart = false 
}) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        {showHeart && (
          <button className="heart-btn" aria-label="Add to wishlist">
            <Heart size={16} />
          </button>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-text">Camera Image</span>
          </div>
        )}
      </div>
      <div className="product-info">
        <h4 className="product-name">{name}</h4>
        <p className="product-price">
          From <strong>{price}</strong> / day
        </p>
        
        {rating !== undefined && reviews !== undefined && (
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviews})</span>
          </div>
        )}
        
        <button className="btn btn-primary add-to-cart-btn">
          {buttonText} {buttonText === "ADD TO CART" && <ShoppingCart size={16} />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
