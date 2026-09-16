import React, { useState } from 'react';
import { Heart, Plus, ShoppingBag, Check } from 'lucide-react';
import { useDateContext } from '../DateContext';
import { useCartContext } from '../CartContext';
import { getProductBySlugOrId } from '../data/products';
import { saveCategoryScrollPosition } from '../utils/scrollRestoration';
import './ProductCard.css';

interface ProductCardProps {
  id?: string;
  slug?: string;
  name: string;
  price: string;
  imageUrl?: string;
  buttonText?: string;
  showHeart?: boolean;
  extraDayPrice?: string;
  onSelectProduct?: (productIdOrSlug: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id,
  slug,
  name, 
  price, 
  imageUrl, 
  buttonText = "Add To Bag",
  showHeart = false,
  extraDayPrice,
  onSelectProduct
}) => {
  const { startDate, endDate, totalDays, setIsDatePromptOpen } = useDateContext();
  const { addToCart } = useCartContext();
  const [isAdded, setIsAdded] = useState(false);
  const hasDates = startDate && endDate;

  const parsePrice = (priceStr: string) => {
    const numeric = priceStr.replace(/[^0-9]/g, '');
    return parseInt(numeric, 10);
  };

  const baseP = parsePrice(price);
  const extraP = extraDayPrice ? parsePrice(extraDayPrice) : baseP;
  const totalPrice = baseP + (totalDays > 1 ? extraP * (totalDays - 1) : 0);

  const targetIdentifier = slug || id || getProductBySlugOrId(name)?.slug || getProductBySlugOrId(name)?.id || name.toLowerCase().replace(/\s+/g, '-');

  const handleCardClick = () => {
    const currentHash = window.location.hash;
    if (currentHash.startsWith('#category/')) {
      const cat = currentHash.replace('#category/', '');
      saveCategoryScrollPosition(cat, window.scrollY);
    }
    if (onSelectProduct) {
      onSelectProduct(targetIdentifier);
    } else {
      window.location.hash = `product/${targetIdentifier}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasDates) {
      setIsDatePromptOpen(true);
    } else {
      addToCart({
        productId: id || targetIdentifier,
        name,
        price,
        imageUrl: imageUrl || '',
        startDate,
        endDate,
        totalDays,
        totalPrice
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-container">
        {showHeart && (
          <button className="heart-btn" aria-label="Add to wishlist" onClick={(e) => e.stopPropagation()}>
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
        
        <div className="product-price-container">
          {!hasDates ? (
            <div className="date-prompt-price">
              <span className="date-prompt-text">Select Dates to view price</span>
              <p className="product-price-blurred">
                From <strong>{price}</strong>
              </p>
            </div>
          ) : (
            <div className="product-price-active">
              <span className="price-tag">₹{totalPrice.toLocaleString('en-IN')}</span>
              <span className="price-duration">for {totalDays} day{totalDays > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="product-action-container">
          {!hasDates ? (
            <button 
              className="btn rent-prompt-btn"
              onClick={handleActionClick}
              aria-label="Select dates to add"
            >
              <Plus size={20} />
            </button>
          ) : (
            <button 
              className={`btn btn-primary add-to-cart-btn ${isAdded ? 'added' : ''}`} 
              onClick={handleActionClick}
              aria-label={isAdded ? "Added To Bag" : "Add To Bag"}
            >
              {isAdded ? (
                <>
                  <Check size={16} /> Added To Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> {buttonText}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
