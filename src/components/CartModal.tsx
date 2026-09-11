import React, { useState } from 'react';
import { X, Trash2, Calendar, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCartContext } from '../CartContext';
import './CartModal.css';

const CartModal: React.FC = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, cartTotal } = useCartContext();
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCartOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckout(false);
      setIsSuccess(false);
    }, 300);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
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
              <CheckCircle size={64} className="success-icon" color="#10b981" />
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
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" required />
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
          )}
        </div>

        {!isSuccess && cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-total">
              <span>Total Estimated Cost</span>
              <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
            </div>
            {isCheckout ? (
              <button form="checkout-form" type="submit" className="btn btn-primary checkout-btn">
                CONFIRM BOOKING
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
