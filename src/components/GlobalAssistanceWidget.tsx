import React, { useState, useEffect, useRef } from 'react';
import { Phone, Check } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { 
  CONTACT_PHONE_DISPLAY, 
  CONTACT_PHONE_TEL, 
  WHATSAPP_URL 
} from '../utils/constants';
import { isMobileDevice, copyToClipboard } from '../utils/device';
import './GlobalAssistanceWidget.css';

export const GlobalAssistanceWidget: React.FC = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());

    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handlePhoneClick = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const mobileMode = isMobile || isMobileDevice();
    if (mobileMode) {
      // On mobile devices: initiate native phone call
      window.location.href = `tel:${CONTACT_PHONE_TEL}`;
    } else {
      // On desktop / laptop: copy phone number to clipboard and show toast
      e.preventDefault();
      await copyToClipboard(CONTACT_PHONE_DISPLAY);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
      setToastVisible(true);
      toastTimeoutRef.current = window.setTimeout(() => {
        setToastVisible(false);
      }, 2800);
    }
  };

  return (
    <div className="global-assistance-widget" role="complementary" aria-label="Customer Assistance">
      {/* Toast Notification (Desktop copy confirmation) */}
      <div 
        className={`assistance-toast ${toastVisible ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span className="toast-icon">
          <Check size={13} strokeWidth={2.5} />
        </span>
        <span className="toast-text">Phone number copied</span>
      </div>

      <div className="assistance-buttons-group">
        {/* TOP: WhatsApp Button (Gear Station Red) */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="assistance-btn assistance-whatsapp-btn"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="assistance-icon whatsapp-icon" size={23} />
          <span className="assistance-tooltip">Chat on WhatsApp</span>
        </a>

        {/* BOTTOM: Phone Button (Dark Charcoal) */}
        <button
          type="button"
          onClick={handlePhoneClick}
          className="assistance-btn assistance-phone-btn"
          aria-label={isMobile ? "Call Gear Station.co" : "Copy phone number"}
        >
          <Phone className="assistance-icon phone-icon" size={22} strokeWidth={2} />
          <span className="assistance-tooltip">
            {isMobile ? "Call us" : "Call us"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default GlobalAssistanceWidget;
