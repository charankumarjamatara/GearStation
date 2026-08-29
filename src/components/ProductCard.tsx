import React from 'react';
import { Star, Heart, Plus, ShoppingBag } from 'lucide-react';
import { useDateContext } from '../DateContext';
import { useCartContext } from '../CartContext';
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
  buttonText = "ADD TO BAG",
  showHeart = false 
}) => {
  const { startDate, endDate, totalDays, setIsDatePromptOpen } = useDateContext();
  const { addToCart } = useCartContext();
  const hasDates = startDate && endDate;

  const parsePrice = (priceStr: string) => {
    const numeric = priceStr.replace(/[^0-9]/g, '');
    return parseInt(numeric, 10);
  };

  const handleActionClick = () => {
    if (!hasDates) {
      setIsDatePromptOpen(true);
    } else {
      const totalPrice = parsePrice(price) * totalDays;
      addToCart({
        productId: name.replace(/\s+/g, '-').toLowerCase(),
        name,
        price,
        imageUrl: imageUrl || '',
        startDate,
        endDate,
        totalDays,
        totalPrice
      });
    }
  };

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
        {!hasDates ? (
          <div className="date-prompt-price" style={{ marginBottom: '10px' }}>
            <span className="date-prompt-text" style={{ fontSize: '12px', color: '#047857', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Select Dates to view price</span>
            <p className="product-price" style={{ filter: 'blur(4px)', opacity: 0.6, userSelect: 'none', margin: 0 }}>
              From <strong>{price}</strong>
            </p>
          </div>
        ) : (
          <p className="product-price">
            Total <strong>₹{(parsePrice(price) * totalDays).toLocaleString('en-IN')}</strong> <span style={{ fontSize: '12px', color: '#64748b' }}>for {totalDays} day{totalDays > 1 ? 's' : ''}</span>
          </p>
        )}
        
        {rating !== undefined && reviews !== undefined && (
          <div className="product-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviews})</span>
          </div>
        )}
        
        {!hasDates ? (
          <button 
            className="btn rent-prompt-btn"
            style={{ background: 'transparent', border: '1px solid #0f172a', color: '#0f172a', borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginTop: '10px' }}
            onClick={handleActionClick}
          >
            <Plus size={20} />
          </button>
        ) : (
          <button className="btn btn-primary add-to-cart-btn" onClick={handleActionClick}>
            <ShoppingBag size={16} style={{marginRight: '8px'}} /> {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
