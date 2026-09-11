import React, { useEffect, useRef } from 'react';
import { Calendar, X, Info, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';
import { useDateContext } from '../DateContext';
import './DateSelectionBanner.css';

const DateSelectionBanner: React.FC = () => {
  const { 
    startDate, endDate, setStartDate, setEndDate, 
    isDatePromptOpen, setIsDatePromptOpen, totalDays,
    mobileCalendarMode, setMobileCalendarMode
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Select Date';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatWeekday = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', { weekday: 'long' });
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // STATE 3: Both dates are selected
    if (startDate && endDate) {
      // The user clicked a new date when a full range was already selected.
      // Completely reset the old range and start a new one.
      const newPickupDate = start || end;
      if (newPickupDate) {
        const offset = newPickupDate.getTimezoneOffset() * 60000;
        const startStr = new Date(newPickupDate.getTime() - offset).toISOString().split('T')[0];
        setStartDate(startStr);
        setEndDate(''); // Discard old return date
        setMobileCalendarMode('return'); // Enter RETURN selection mode
      }
      return;
    }

    // STATE 2: Pickup selected, Return is null
    if (startDate && !endDate) {
      if (end) {
        // User clicked a potentially valid return date
        const normalizedStart = normalizeDate(start!);
        const normalizedEnd = normalizeDate(end);
        const minReturn = new Date(normalizedStart);
        minReturn.setDate(minReturn.getDate() + 2);

        if (normalizedEnd >= minReturn) {
          const offset = end.getTimezoneOffset() * 60000;
          setEndDate(new Date(end.getTime() - offset).toISOString().split('T')[0]);
          setMobileCalendarMode(null); // Range complete, close mobile calendar
        }
      } else if (start) {
        // User clicked a date before the pickup date, resetting the pickup
        const offset = start.getTimezoneOffset() * 60000;
        const startStr = new Date(start.getTime() - offset).toISOString().split('T')[0];
        setStartDate(startStr);
        setMobileCalendarMode('return'); // Still in RETURN selection mode
      }
      return;
    }

    // STATE 1: No dates
    if (!startDate && !endDate) {
      if (start) {
        const offset = start.getTimezoneOffset() * 60000;
        const startStr = new Date(start.getTime() - offset).toISOString().split('T')[0];
        setStartDate(startStr);
        setMobileCalendarMode('return'); // Enter RETURN selection mode
      }
      return;
    }
  };


  const renderCustomHeader = ({
    monthDate,
    decreaseMonth,
    increaseMonth,
  }: any) => {
    return (
      <div className="custom-calendar-header mobile-centered-header">
        <button
          aria-label="Previous Month"
          className="calendar-nav-btn prev"
          onClick={decreaseMonth}
        >
          <ChevronLeft size={16} />
        </button>
        
        <span className="calendar-month-name">
          {monthDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          aria-label="Next Month"
          className="calendar-nav-btn next"
          onClick={increaseMonth}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const getDayClassName = (date: Date) => {
    // Safely parse "YYYY-MM-DD" string into local midnight time
    const parseLocal = (dateStr: string | null) => {
      if (!dateStr) return null;
      const [y, m, d] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, d).getTime();
    };

    const dTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const startTime = parseLocal(startDate);
    const endTime = parseLocal(endDate);
    
    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    if (dTime < todayTime) return 'custom-day-disabled';
    
    if (startTime && dTime === startTime) return 'custom-day-selected custom-day-start';
    if (endTime && dTime === endTime) return 'custom-day-selected custom-day-end';
    
    if (startTime && endTime && dTime > startTime && dTime < endTime) return 'custom-day-in-range';

    // If in return mode on mobile, disable everything before pickup + 2
    if (mobileCalendarMode === 'return' && startTime) {
      const minReturn = startTime + 2 * 24 * 60 * 60 * 1000;
      if (dTime < minReturn) return 'custom-day-disabled';
    }

    // Block the day immediately after pickup — minimum rental is 2 days (pickup + 2)
    if (startTime && !endTime) {
      const dayAfterPickup = startTime + 24 * 60 * 60 * 1000; // pickup + 1 day
      if (dTime === dayAfterPickup) return 'custom-day-disabled';
    }
    if (startTime && endTime) {
      const dayAfterPickup = startTime + 24 * 60 * 60 * 1000;
      if (dTime === dayAfterPickup) return 'custom-day-disabled';
    }
    
    return 'custom-day-normal';
  };

  return (
    <>

      {/* Date Selection Modal / Banner */}
      {isDatePromptOpen && (
        <div className="modal-overlay">
          <div className="modal-container" ref={bannerRef}>
            <div className="modal-header">
              <div className="header-left">
                <div className="header-icon">
                  <Calendar size={24} />
                </div>
                <div className="header-titles">
                  <h3>Select your Dates</h3>
                  <p>Choose your pickup and return dates</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsDatePromptOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-left">
                
                <div className="date-cards-row">
                  <div className="date-card-group" onClick={() => setMobileCalendarMode('pickup')} style={{cursor: 'pointer'}}>
                    <label>PICKUP DATE <span className="req">*</span></label>
                    <div className={`date-field ${mobileCalendarMode === 'pickup' ? 'active' : ''}`}>
                      <div className="field-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="field-details">
                        <span className="field-date">{startDate ? formatDate(startDate) : 'Select date'}</span>
                        <span className="field-weekday">{formatWeekday(startDate)}</span>
                      </div>
                      <ChevronRight size={16} className="field-chevron" />
                    </div>
                  </div>
                  
                  <div className="date-card-group" onClick={() => setMobileCalendarMode('return')} style={{cursor: 'pointer'}}>
                    <label>RETURN DATE <span className="req">*</span></label>
                    <div className={`date-field ${mobileCalendarMode === 'return' ? 'active' : ''}`}>
                      <div className="field-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="field-details">
                        <span className="field-date">{endDate ? formatDate(endDate) : 'Select date'}</span>
                        <span className="field-weekday">{formatWeekday(endDate)}</span>
                      </div>
                      <ChevronRight size={16} className="field-chevron" />
                    </div>
                  </div>
                </div>
                
                <div className="delivery-info-card">
                  <Info size={18} className="delivery-icon" />
                  <div className="delivery-text">
                    <p><strong>Same-day delivery</strong> between <strong>5PM and 11PM</strong></p>
                    <p>For future dates, you can select a specific time slot available at checkout. We pickup between <strong>9AM to 1PM</strong>.</p>
                  </div>
                </div>
                
                <div className="rental-period-section">
                  <label>Your Rental Period</label>
                  <div className="rental-summary-card">
                    <div className="days-col">
                      <span className="days-num">{String(totalDays || 0).padStart(2, '0')}</span>
                      <span className="days-label">DAYS</span>
                    </div>
                    <div className="divider"></div>
                    <div className="period-col">
                      <span className="period-label">CHARGEABLE PERIOD</span>
                      <div className="period-dates">
                        <Calendar size={14} className="period-icon" />
                        {startDate ? formatDateShort(startDate) : '-'} – {endDate ? formatDateShort(endDate) : '-'}
                      </div>
                    </div>
                  </div>
                </div>
                

                
                <button 
                  className="continue-btn"
                  disabled={!startDate || !endDate}
                  onClick={() => setIsDatePromptOpen(false)}
                >
                  CONTINUE
                  <ArrowRight size={20} className="continue-icon" />
                </button>
              </div>
              
              {/* Desktop Calendar - Hidden on mobile via CSS */}
              <div className="modal-right desktop-only-calendar">
                <div className="calendar-wrapper">
                  <DatePicker
                    selected={startDate ? new Date(startDate) : null}
                    onChange={handleDateChange}
                    startDate={startDate ? new Date(startDate) : null}
                    endDate={endDate ? new Date(endDate) : null}
                    minDate={new Date(new Date().setHours(0,0,0,0))}
                    selectsRange
                    inline
                    monthsShown={1}
                    renderCustomHeader={renderCustomHeader}
                    dayClassName={getDayClassName}
                  />
                </div>
                
                <div className="calendar-legend">
                  <div className="legend-item">
                    <div className="legend-dot dot-pickup"></div>
                    <span>Pickup Date</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot dot-period"></div>
                    <span>In Between Dates</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot dot-return"></div>
                    <span>Return Date</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot dot-unavailable"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      )}

      {/* Centered Mobile Calendar Overlay */}
      {mobileCalendarMode && (
        <div className="mobile-calendar-fullscreen-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setMobileCalendarMode(null);
        }}>
          <div className="mobile-calendar-centered-card">
            <div className="mobile-calendar-top-header">
              <div className="top-header-left">
                <div className="header-icon">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3>{mobileCalendarMode === 'pickup' ? 'Select Pickup Date' : 'Select Return Date'}</h3>
                  <p className="subtitle">{mobileCalendarMode === 'pickup' ? 'Choose your pickup date' : 'Choose your return date'}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setMobileCalendarMode(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="mobile-calendar-body">
              <DatePicker
                selected={startDate ? new Date(startDate) : null}
                onChange={handleDateChange}
                startDate={startDate ? new Date(startDate) : null}
                endDate={endDate ? new Date(endDate) : null}
                minDate={new Date(new Date().setHours(0,0,0,0))}
                selectsRange
                inline
                monthsShown={1}
                renderCustomHeader={renderCustomHeader}
                dayClassName={getDayClassName}
              />
              
              {mobileCalendarMode === 'return' && (
                <div className="mobile-return-rule-box">
                  <Info size={18} className="return-rule-icon" />
                  <div className="return-rule-text">
                    <strong>Minimum 2 days required</strong>
                    <p>Your return date must be at least 2 days after the pickup date.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateSelectionBanner;
