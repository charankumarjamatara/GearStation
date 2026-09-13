import React, { useMemo, useState } from 'react';
import { ShoppingBag, Check, ArrowRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
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
  const { startDate, endDate, totalDays, setIsDatePromptOpen } = useDateContext();
  const { addToCart } = useCartContext();
  const [isAdded, setIsAdded] = useState(false);
  const [addedAddOnId, setAddedAddOnId] = useState<string | null>(null);

  const hasDates = Boolean(startDate && endDate);

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
  const totalPrice = basePrice + (totalDays > 1 ? extraPrice * (totalDays - 1) : 0);

  const handleAddToCart = (itemToAdd: ProductItem = product!) => {
    if (!itemToAdd) return;

    if (!hasDates) {
      setIsDatePromptOpen(true);
      return;
    }

    const itemBase = parsePrice(itemToAdd.price);
    const itemExtra = itemToAdd.extraDayPrice ? parsePrice(itemToAdd.extraDayPrice) : itemBase;
    const itemTotal = itemBase + (totalDays > 1 ? itemExtra * (totalDays - 1) : 0);

    addToCart({
      productId: itemToAdd.id,
      name: itemToAdd.name,
      price: itemToAdd.price,
      imageUrl: itemToAdd.imageUrl,
      startDate: startDate || '',
      endDate: endDate || '',
      totalDays: totalDays,
      totalPrice: itemTotal
    });

    if (itemToAdd.id === product?.id) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    } else {
      setAddedAddOnId(itemToAdd.id);
      setTimeout(() => setAddedAddOnId(null), 1200);
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
      <div className="product-detail-page pdp-not-found-page">
        <div className="container pdp-container">
          <div className="pdp-not-found-card">
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
        <div className="pdp-main-grid">
          
          {/* Left Column: Large Product Image Panel */}
          <div className="pdp-image-column">
            <div className="pdp-image-panel">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="pdp-main-image"
              />
            </div>
          </div>

          {/* Right Column: Product Information & Booking */}
          <div className="pdp-info-column">
            {brandLabel && (
              <span className="pdp-brand-label">{brandLabel}</span>
            )}
            
            <h1 className="pdp-product-name">{product.name}</h1>
            
            <p className="pdp-product-description">
              {product.description}
            </p>

            {/* Rental Price Section */}
            <div className="pdp-price-box">
              <span className="pdp-price-term">
                {hasDates ? `Rent for ${totalDays} day${totalDays > 1 ? 's' : ''}` : 'Rent for -- days'}
              </span>
              <div className="pdp-price-amount-row">
                <span className="pdp-price-currency">₹</span>
                {hasDates ? (
                  <span className="pdp-price-number">{totalPrice.toLocaleString('en-IN')}</span>
                ) : (
                  <span className="pdp-price-number pdp-price-blurred" aria-hidden="true">
                    ••••
                  </span>
                )}
              </div>
              <span className="pdp-price-tax-note">Price incl. of all taxes</span>
            </div>

            {/* Add to Bag Primary Button */}
            <button 
              className={`pdp-add-to-cart-btn ${isAdded ? 'added' : ''}`}
              onClick={() => handleAddToCart(product)}
              aria-label={isAdded ? `Added ${product.name} To Bag` : `Add ${product.name} To Bag`}
            >
              {isAdded ? (
                <>
                  <Check size={20} className="pdp-btn-icon" />
                  Added To Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={20} className="pdp-btn-icon" />
                  Add To Bag
                </>
              )}
            </button>

            {/* Trust Badges Row */}
            <div className="pdp-trust-badges-row">
              <div className="pdp-trust-badge-item">
                <Truck size={18} className="pdp-trust-icon" />
                <span className="pdp-trust-text">Free Delivery in Hyderabad</span>
              </div>
              <div className="pdp-trust-badge-item">
                <ShieldCheck size={18} className="pdp-trust-icon" />
                <span className="pdp-trust-text">Damage Protection Included</span>
              </div>
              <div className="pdp-trust-badge-item">
                <RotateCcw size={18} className="pdp-trust-icon" />
                <span className="pdp-trust-text">Flexible Cancellation</span>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED ADD-ONS Section */}
        {relatedAddOns.length > 0 && (
          <section className="pdp-addons-section">
            <div className="pdp-addons-header">
              <h2 className="pdp-addons-title">RELATED ADD-ONS</h2>
              <a 
                href={`#category/${addOnCategory.key}`} 
                className="pdp-addons-view-all"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewAllAddOns(addOnCategory.key);
                }}
              >
                View All <ArrowRight size={16} />
              </a>
            </div>

            <div className="pdp-addons-grid">
              {relatedAddOns.map((addon) => {
                const isItemAdded = addedAddOnId === addon.id;
                return (
                  <div 
                    key={addon.id} 
                    className="pdp-addon-card"
                    onClick={() => handleNavigateProduct(addon)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="pdp-addon-image-box">
                      <img src={addon.imageUrl} alt={addon.name} className="pdp-addon-img" />
                    </div>

                    <div className="pdp-addon-details">
                      <h4 className="pdp-addon-name">{addon.name}</h4>
                      <p className="pdp-addon-price">
                        <strong>{addon.price}</strong> <span className="pdp-price-suffix">/ day</span>
                      </p>
                      
                      <button 
                        className={`pdp-addon-add-btn ${isItemAdded ? 'added' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(addon);
                        }}
                        aria-label={isItemAdded ? `Added ${addon.name} To Bag` : `Add ${addon.name} To Bag`}
                      >
                        {isItemAdded ? (
                          <>
                            <Check size={14} className="pdp-addon-btn-icon" />
                            Added To Bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} className="pdp-addon-btn-icon" />
                            Add To Bag
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
