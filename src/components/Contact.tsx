import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { sendContactNotification } from '../services/emailService';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await sendContactNotification({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      // Clear form and display brief feedback
      setFormData({ name: '', email: '', message: '' });
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3500);
    } catch (err) {
      console.error('Contact submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title"><span className="text-red">CONTACT</span></h2>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-subtitle">GET IN TOUCH</p>
            <h2 className="contact-title">
              READY FOR YOUR<br />
              <span className="text-primary">NEXT ADVENTURE?</span>
            </h2>
            <p className="contact-desc">
              Questions about gear, availability or your<br />
              route? Our Hyderabad team is here to help.
            </p>
          </div>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-num">01</span>
              <div>
                <p className="contact-label">CALL US</p>
                <p className="contact-value">+91 73079 81667</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-num">02</span>
              <div>
                <p className="contact-label">EMAIL US</p>
                <p className="contact-value">hello@gearstation.co</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-num">03</span>
              <div>
                <p className="contact-label">VISIT US</p>
                <p className="contact-value">Gear Station, Hyderabad</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your name" 
                  className="form-input" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email address" 
                  className="form-input" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <textarea 
                name="message"
                placeholder="How can we help?" 
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button 
                type="submit" 
                className="btn btn-primary submit-btn" 
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSent ? (
                  <>MESSAGE SENT <Check size={16} /></>
                ) : isSubmitting ? (
                  'SENDING...'
                ) : (
                  <>SEND MESSAGE <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
