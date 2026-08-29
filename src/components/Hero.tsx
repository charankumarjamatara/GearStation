import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';
import { useDateContext } from '../DateContext';
import './Hero.css';

const Hero: React.FC = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useDateContext();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <p className="hero-subtitle">YOUR NEXT ADVENTURE AWAITS</p>
          <h1 className="hero-title">
            BACKPACK. RIDE.<br />
            <span className="text-primary">TRAVEL. REPEAT.</span>
          </h1>
          <p className="hero-desc">
            Rent premium cameras, action cams,<br />
            bikes & riding gear for your next journey.
          </p>

          <div className="search-bar">
            <div className="search-field">
              <label>PICKUP DATE</label>
              <div className="input-wrapper">
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      // Format to local date string to avoid timezone offset issues
                      const offset = date.getTimezoneOffset() * 60000;
                      const localDate = new Date(date.getTime() - offset);
                      setStartDate(localDate.toISOString().split('T')[0]);
                    } else {
                      setStartDate('');
                    }
                  }}
                  minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select Date"
                  className="date-input-hero"
                  showPopperArrow={false}
                />
                <Calendar size={18} className="input-icon" style={{position: 'absolute', right: '16px', pointerEvents: 'none'}} />
              </div>
            </div>
            
            <div className="search-field">
              <label>RETURN DATE</label>
              <div className="input-wrapper">
                <DatePicker
                  selected={endDate ? new Date(endDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const offset = date.getTimezoneOffset() * 60000;
                      const localDate = new Date(date.getTime() - offset);
                      setEndDate(localDate.toISOString().split('T')[0]);
                    } else {
                      setEndDate('');
                    }
                  }}
                  minDate={startDate ? new Date(startDate) : new Date()}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select Date"
                  className="date-input-hero"
                  showPopperArrow={false}
                />
                <Calendar size={18} className="input-icon" style={{position: 'absolute', right: '16px', pointerEvents: 'none'}} />
              </div>
            </div>

            <div className="search-field location-field">
              <label>PICKUP LOCATION</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <input type="text" value="Gear Station, Hyderabad" readOnly style={{ cursor: 'default' }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
