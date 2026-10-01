import React, { useMemo, useState, useRef } from 'react';
import { X, Trash2, Calendar, ShoppingBag, ArrowLeft, Plus } from 'lucide-react';
import { useCartContext } from '../CartContext';
import { useDateContext } from '../DateContext';
import { getProductBySlugOrId, getRelatedAddOns, type ProductItem } from '../data/products';
import { sendOrderNotification } from '../services/emailService';
import successIllustration from '../assets/order_successful.png';
import './CartModal.css';

const CartModal: React.FC = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, addToCart, clearCart, cartTotal } = useCartContext();
  const { startDate, endDate, totalDays } = useDateContext();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Customer Checkout Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const lastSubmittedOrderSignature = useRef<string>('');

  // Mouse drag-to-scroll support for horizontal carousel on desktop
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMoved.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Helper to parse price strings
  const parsePrice = (priceStr: string) => {
    const numeric = (priceStr || '').replace(/[^0-9]/g, '');
    return parseInt(numeric, 10) || 0;
  };

  // Helper to derive effective rental dates & duration
  const getEffectiveDates = () => {
    const effectiveStartDate = startDate || (cartItems.length > 0 ? cartItems[0].startDate : '');
    const effectiveEndDate = endDate || (cartItems.length > 0 ? cartItems[0].endDate : '');
    const effectiveTotalDays = totalDays > 0 ? totalDays : (cartItems.length > 0 ? cartItems[0].totalDays : 1);
    return { effectiveStartDate, effectiveEndDate, effectiveTotalDays };
  };

  // Calculate pricing for an add-on based on active rental duration
  const calculateAddonPrice = (addon: ProductItem) => {
    const { effectiveTotalDays } = getEffectiveDates();
    const baseP = parsePrice(addon.price);
    const extraP = addon.extraDayPrice ? parsePrice(addon.extraDayPrice) : baseP;
    return baseP + (effectiveTotalDays > 1 ? extraP * (effectiveTotalDays - 1) : 0);
  };

  // Dynamically compute deduplicated related add-ons for all items currently in cart
  const relatedAddOns = useMemo(() => {
    if (cartItems.length === 0) return [];

    const cartProductIds = new Set(cartItems.map(item => item.productId.toLowerCase()));
    const cartProductSlugs = new Set(
      cartItems
        .map(item => getProductBySlugOrId(item.productId)?.slug?.toLowerCase())
        .filter(Boolean) as string[]
    );

    const candidates: ProductItem[] = [];
    const seenIds = new Set<string>();

    for (const item of cartItems) {
      const product = getProductBySlugOrId(item.productId);
      if (product) {
        const addOns = getRelatedAddOns(product, 20);
        for (const addOn of addOns) {
          const lowerId = addOn.id.toLowerCase();
          const lowerSlug = (addOn.slug || '').toLowerCase();

          // Exclude if already picked or already in cart
          if (
            !seenIds.has(lowerId) &&
            !cartProductIds.has(lowerId) &&
            !cartProductIds.has(lowerSlug) &&
            !cartProductSlugs.has(lowerSlug)
          ) {
            seenIds.add(lowerId);
            candidates.push(addOn);
          }
        }
      }
    }

    return candidates;
  }, [cartItems]);

  const handleAddAddOn = (addon: ProductItem, e?: React.MouseEvent) => {
    if (e && hasMoved.current) {
      // Prevent accidental add during drag scroll
      return;
    }
    const { effectiveStartDate, effectiveEndDate, effectiveTotalDays } = getEffectiveDates();
    const totalPrice = calculateAddonPrice(addon);

    addToCart({
      productId: addon.id,
      name: addon.name,
      price: addon.price,
      imageUrl: addon.imageUrl,
      startDate: effectiveStartDate,
      endDate: effectiveEndDate,
      totalDays: effectiveTotalDays,
      totalPrice: totalPrice
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isCartOpen) return null;

  const handleClose = () => {
    const wasSuccess = isSuccess;
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckout(false);
      setIsSuccess(false);
      if (wasSuccess) {
        clearCart();
        setFormData({ fullName: '', email: '', phone: '' });
      }
    }, 300);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingOrder) return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || cartItems.length === 0) {
      return;
    }

    // Prevent duplicate email dispatch
    const orderSig = `${formData.email}_${formData.phone}_${cartItems.map(i => i.id).join('_')}_${cartTotal}`;
    if (lastSubmittedOrderSignature.current === orderSig) {
      setIsSuccess(true);
      return;
    }
    lastSubmittedOrderSignature.current = orderSig;

    // Snapshot exact cart state & customer info
    const itemsSnapshot = [...cartItems];
    const customerSnapshot = { ...formData };
    const totalSnapshot = cartTotal;

    // 1. Show UI confirmation immediately to user
    setIsSuccess(true);

    // 2. Dispatch Order Notification email in background
    try {
      setIsSubmittingOrder(true);
      await sendOrderNotification({
        customer: customerSnapshot,
        items: itemsSnapshot,
        total: totalSnapshot
      });
    } catch (err) {
      console.error('Order notification error:', err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={handleClose}>
      <div className="cart-modal-container" onClick={e => e.stopPropagation()}>
        <div className="cart-modal-header">
          {isCheckout && !isSuccess ? (
            <button className="back-btn-cart" onClick={() => setIsCheckout(false)}>
              <ArrowLeft size={20} /> Back
            </button>
          ) : (
            <h2>{isSuccess ? 'Booking Confirmed' : `Your Bag (${cartItems.length})`}</h2>
          )}
          
          {isCheckout && !isSuccess && <h2>Checkout</h2>}
          
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-modal-content">
          {isSuccess ? (
            <div className="cart-success-state">
              <img src={successIllustration} alt="Booking Confirmed" className="cart-success-illustration" />
              <h3>Request Received!</h3>
              <p>Your booking request has been received successfully.<br />Our team will contact you shortly to confirm the details.</p>
              <button className="btn btn-primary" onClick={handleClose} style={{marginTop: '20px'}}>
                Continue Browsing
              </button>
            </div>
          ) : isCheckout ? (
            <form id="checkout-form" className="checkout-form" onSubmit={handleConfirmBooking}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="+91 98765 43210" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="checkout-summary">
                <h4>Order Summary</h4>
                <div className="summary-row">
                  <span>Total Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="summary-row total">
                  <span>Amount to Pay</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </form>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={48} className="empty-icon" />
              <h3>Your bag is empty</h3>
              <p>Looks like you haven't added any gear yet.</p>
              <button className="btn btn-primary" onClick={handleClose}>
                Start Browsing
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <div className="cart-item-dates">
                        <Calendar size={14} />
                        <span>{item.startDate} to {item.endDate} ({item.totalDays} day{item.totalDays > 1 ? 's' : ''})</span>
                      </div>
                      <div className="cart-item-price">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button 
                      className="remove-item-btn" 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Related Add-ons Section - Single Horizontal Carousel */}
              {relatedAddOns.length > 0 && (
                <div className="cart-related-addons">
                  <div className="cart-related-header">
                    <h3 className="cart-related-title">Related Add-ons</h3>
                  </div>
                  <div 
                    className="cart-related-carousel"
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                  >
                    {relatedAddOns.map((addon) => {
                      const addonPrice = calculateAddonPrice(addon);
                      return (
                        <div key={addon.id} className="cart-addon-card">
                          <div className="addon-img-wrapper">
                            <img src={addon.imageUrl} alt={addon.name} className="cart-addon-img" draggable={false} />
                          </div>
                          <div className="cart-addon-info">
                            <h5 className="cart-addon-name" title={addon.name}>{addon.name}</h5>
                            <span className="cart-addon-price">₹{addonPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <button 
                            type="button"
                            className="cart-addon-add-btn" 
                            onClick={(e) => handleAddAddOn(addon, e)}
                            aria-label={`Add ${addon.name} to bag`}
                          >
                            <Plus size={14} /> ADD
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!isSuccess && cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-total">
              <span>Total Estimated Cost</span>
              <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
            </div>
            {isCheckout ? (
              <button form="checkout-form" type="submit" className="btn btn-primary checkout-btn" disabled={isSubmittingOrder}>
                {isSubmittingOrder ? 'CONFIRMING...' : 'CONFIRM BOOKING'}
              </button>
            ) : (
              <button className="btn btn-primary checkout-btn" onClick={() => setIsCheckout(true)}>
                PROCEED TO BOOK
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
