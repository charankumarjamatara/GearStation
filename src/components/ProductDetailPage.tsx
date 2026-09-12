import React, { useMemo, useState } from 'react';
import { ShoppingBag, ShoppingCart, Check, ArrowRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useDateContext } from '../DateContext';
import { useCartContext } from '../CartContext';
import { 
  getProductBySlugOrId, 
  getRelatedAddOns, 
  getRelatedAddOnsCategory, 
  getProductBrand, 
  type ProductItem 
} from '../data/products';
import RentalDatePill from './RentalDatePill';
import './ProductDetailPage.css';

interface ProductDetailPageProps {
  productId: string;
  onBack?: () => void;
  onSelectProduct?: (productId: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onSelectProduct
}) => {
  const { startDate, endDate, totalDays } = useDateContext();
  const { addToCart } = useCartContext();
  const [isAdded, setIsAdded] = useState(false);
  const [addedAddOnId, setAddedAddOnId] = useState<string | null>(null);

  const product = useMemo(() => {
    return getProductBySlugOrId(productId);
  }, [productId]);

  const relatedAddOns = useMemo(() => {
    if (!product) return [];
    return getRelatedAddOns(product, 5);
  }, [product]);

  const addOnCategory = useMemo(() => {
    if (!product) return { key: 'action-camera-add-ons', label: 'ACTION CAMERA ADD ONS' };
    return getRelatedAddOnsCategory(product);
  }, [product]);

  const brandLabel = useMemo(() => {
    if (!product) return '';
    return getProductBrand(product);
  }, [product]);

  const parsePrice = (priceStr: string) => {
    const numeric = priceStr.replace(/[^0-9]/g, '');
    return parseInt(numeric, 10) || 0;
  };

  const basePrice = product ? parsePrice(product.price) : 0;
  const extraPrice = product?.extraDayPrice ? parsePrice(product.extraDayPrice) : basePrice;
  const daysCount = totalDays > 0 ? totalDays : 1;
  const totalPrice = basePrice + (daysCount > 1 ? extraPrice * (daysCount - 1) : 0);

  const handleAddToCart = (itemToAdd: ProductItem = product!) => {
    if (!itemToAdd) return;
    const itemBase = parsePrice(itemToAdd.price);
    const itemExtra = itemToAdd.extraDayPrice ? parsePrice(itemToAdd.extraDayPrice) : itemBase;
    const itemTotal = itemBase + (daysCount > 1 ? itemExtra * (daysCount - 1) : 0);

    addToCart({
      productId: itemToAdd.id,
      name: itemToAdd.name,
      price: itemToAdd.price,
      imageUrl: itemToAdd.imageUrl,
      startDate: startDate || '',
      endDate: endDate || '',
      totalDays: daysCount,
      totalPrice: itemTotal
    });

    if (itemToAdd.id === product?.id) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      setAddedAddOnId(itemToAdd.id);
      setTimeout(() => setAddedAddOnId(null), 1800);
    }
  };

  const handleNavigateProduct = (targetProduct: ProductItem) => {
    const targetSlugOrId = targetProduct.slug || targetProduct.id;
    if (onSelectProduct) {
      onSelectProduct(targetSlugOrId);
    } else {
      window.location.hash = `product/${targetSlugOrId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewAllAddOns = (categoryKey: string) => {
    window.location.hash = `category/${categoryKey}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!product) {
    return (
      <div className="product-detail-page not-found-page">
        <div className="container">
          <div className="not-found-card">
            <h2>Product Not Found</h2>
            <p>The equipment you are looking for might have been moved or is currently unavailable.</p>
            <button className="btn btn-primary" onClick={onBack || (() => { window.location.hash = ''; })}>
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container pdp-container">
        
        {/* Persistent Rental Date Pill (Top of PDP) */}
        <RentalDatePill locationName="Hyderabad" className="pdp-date-pill" />

        {/* Main Two-Column Product Section */}
        <div className="product-main-grid">
          
          {/* Left Column: Single Clean Product Image */}
          <div className="product-image-column">
            <div className="product-image-container">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="main-product-image"
              />
            </div>
          </div>

          {/* Right Column: Product Information & Booking */}
          <div className="product-info-column">
            {brandLabel && (
              <span className="detail-brand-label">{brandLabel}</span>
            )}
            
            <h1 className="detail-product-name">{product.name}</h1>
            
            <p className="detail-product-description">
              {product.description}
            </p>

            {/* Rental Price Section */}
            <div className="detail-price-box">
              <span className="price-term-label">
                Rent for {daysCount} day{daysCount > 1 ? 's' : ''}
              </span>
              <div className="price-amount-row">
                <span className="price-currency">₹</span>
                <span className="price-number">{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="price-tax-note">Price incl. of all taxes</span>
            </div>

            {/* Add to Cart Primary Button */}
            <button 
              className={`detail-add-to-cart-btn ${isAdded ? 'added' : ''}`}
              onClick={() => handleAddToCart(product)}
              aria-label={`Add ${product.name} to Cart`}
            >
              {isAdded ? (
                <>
                  <Check size={20} className="btn-icon" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={20} className="btn-icon" />
                  Add to Cart
                </>
              )}
            </button>

            {/* Trust Badges Row */}
            <div className="detail-trust-badges-row">
              <div className="trust-badge-item">
                <Truck size={18} className="trust-icon" />
                <span className="trust-text">Free Delivery in Hyderabad</span>
              </div>
              <div className="trust-badge-item">
                <ShieldCheck size={18} className="trust-icon" />
                <span className="trust-text">Damage Protection Included</span>
              </div>
              <div className="trust-badge-item">
                <RotateCcw size={18} className="trust-icon" />
                <span className="trust-text">Flexible Cancellation</span>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED ADD-ONS Section */}
        {relatedAddOns.length > 0 && (
          <section className="related-addons-section">
            <div className="addons-header">
              <h2 className="addons-title">RELATED ADD-ONS</h2>
              <a 
                href={`#category/${addOnCategory.key}`} 
                className="addons-view-all"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewAllAddOns(addOnCategory.key);
                }}
              >
                View All <ArrowRight size={16} />
              </a>
            </div>

            <div className="addons-grid">
              {relatedAddOns.map((addon) => {
                const isItemAdded = addedAddOnId === addon.id;
                return (
                  <div 
                    key={addon.id} 
                    className="addon-card"
                    onClick={() => handleNavigateProduct(addon)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="addon-image-box">
                      <img src={addon.imageUrl} alt={addon.name} className="addon-img" />
                    </div>

                    <div className="addon-details">
                      <h4 className="addon-name">{addon.name}</h4>
                      <p className="addon-price">
                        <strong>{addon.price}</strong> <span className="price-suffix">/ day</span>
                      </p>
                      
                      <button 
                        className={`addon-add-btn ${isItemAdded ? 'added' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(addon);
                        }}
                        aria-label={`Add ${addon.name} to Cart`}
                      >
                        {isItemAdded ? (
                          <>
                            <Check size={14} className="addon-btn-icon" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} className="addon-btn-icon" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
