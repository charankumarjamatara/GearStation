import React, { useEffect, useRef } from 'react';
import { Calendar, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';
import { useDateContext } from '../DateContext';
import './DateSelectionBanner.css';

const DateSelectionBanner: React.FC = () => {
  const { 
    startDate, endDate, setStartDate, setEndDate, 
    isDatePromptOpen, setIsDatePromptOpen
  } = useDateContext();
  const bannerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
        setIsDatePromptOpen(false);
      }
    };
    if (isDatePromptOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDatePromptOpen, setIsDatePromptOpen]);

  const hasDates = startDate && endDate;

  return (
    <>
      {/* Floating Pill Button to open date selector (only visible if dates are not selected) */}
      {!isDatePromptOpen && !hasDates && (
        <button 
          className="date-pill-btn"
          onClick={() => setIsDatePromptOpen(true)}
        >
          <Calendar size={18} />
          <span>
            Select rental dates to view prices
          </span>
        </button>
      )}

      {/* Date Selection Modal / Banner */}
      {isDatePromptOpen && (
        <div className="date-banner-overlay">
          <div className="date-banner-container" ref={bannerRef}>
            <div className="date-banner-header">
              <h3>Select Rental Dates</h3>
              <button className="close-btn" onClick={() => setIsDatePromptOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="date-inputs-wrapper">
              <div className="date-input-group">
                <label>Pickup Date</label>
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
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
                  showPopperArrow={false}
                />
              </div>
              <div className="date-input-group">
                <label>Return Date</label>
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
                  showPopperArrow={false}
                />
              </div>
            </div>
            <button 
              className="btn btn-primary date-apply-btn"
              disabled={!startDate || !endDate}
              onClick={() => setIsDatePromptOpen(false)}
            >
              Apply Dates
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DateSelectionBanner;
