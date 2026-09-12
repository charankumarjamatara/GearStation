import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Calendar, X, Clock, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';
import { useDateContext } from '../DateContext';
import './DateSelectionBanner.css';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DateSelectionBanner: React.FC = () => {
  const { 
    startDate, endDate, setStartDate, setEndDate, 
    isDatePromptOpen, setIsDatePromptOpen, totalDays
  } = useDateContext();

  const [isMounted, setIsMounted] = useState(isDatePromptOpen);
  const [isClosing, setIsClosing] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync mount state with context flag
  useEffect(() => {
    if (isDatePromptOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted && !isClosing) {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, 220);
    }
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isDatePromptOpen, isMounted, isClosing]);

  // Clean, single-execution background scroll lock
  useEffect(() => {
    if (isMounted && !isClosing) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMounted, isClosing]);

  const handleClose = useCallback(() => {
    setIsDatePromptOpen(false);
  }, [setIsDatePromptOpen]);

  const handleAnimationEnd = useCallback((e: React.AnimationEvent) => {
    if (isClosing && (e.target === bannerRef.current || e.target === mobileSheetRef.current || e.currentTarget === e.target)) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsMounted(false);
      setIsClosing(false);
    }
  }, [isClosing]);

  // Escape key handler
  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: true });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted, handleClose]);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return 'Select date';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return 'Select date';
    const monthName = MONTHS_SHORT[m - 1] || '';
    const dayStr = String(d).padStart(2, '0');
    return `${dayStr} ${monthName} ${y}`;
  }, []);

  const formatWeekday = useCallback((dateString: string) => {
    if (!dateString) return '-';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return '-';
    const date = new Date(y, m - 1, d);
    return DAYS_SHORT[date.getDay()] || '-';
  }, []);

  const formatWeekdayLong = useCallback((dateString: string) => {
    if (!dateString) return '-';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return '-';
    const date = new Date(y, m - 1, d);
    return DAYS_LONG[date.getDay()] || '-';
  }, []);

  const formatDateShort = useCallback((dateString: string) => {
    if (!dateString) return '';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return '';
    const monthName = MONTHS_SHORT[m - 1] || '';
    const dayStr = String(d).padStart(2, '0');
    return `${dayStr} ${monthName}`;
  }, []);

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const handleDateChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // STATE 3: Both dates are selected -> start new range with clicked date
    if (startDate && endDate) {
      const clickedDate = start || end;
      if (!clickedDate) return;
      
      const offset = clickedDate.getTimezoneOffset() * 60000;
      const clickedStr = new Date(clickedDate.getTime() - offset).toISOString().split('T')[0];
      setStartDate(clickedStr);
      setEndDate('');
      return;
    }

    // STATE 2: Pickup selected, Return is null
    if (startDate && !endDate) {
      if (end) {
        const normalizedStart = normalizeDate(start!);
        const normalizedEnd = normalizeDate(end);
        const minReturn = new Date(normalizedStart);
        minReturn.setDate(minReturn.getDate() + 2);

        if (normalizedEnd >= minReturn) {
          const offset = end.getTimezoneOffset() * 60000;
          setEndDate(new Date(end.getTime() - offset).toISOString().split('T')[0]);
        }
      } else if (start) {
        const offset = start.getTimezoneOffset() * 60000;
        const startStr = new Date(start.getTime() - offset).toISOString().split('T')[0];
        setStartDate(startStr);
      }
      return;
    }

    // STATE 1: No dates
    if (!startDate && !endDate) {
      if (start) {
        const offset = start.getTimezoneOffset() * 60000;
        const startStr = new Date(start.getTime() - offset).toISOString().split('T')[0];
        setStartDate(startStr);
      }
      return;
    }
  }, [startDate, endDate, setStartDate, setEndDate]);

  // Precalculated timestamps for ultra-fast day class evaluation
  const { startTime, endTime, dayAfterPickup, todayTime } = useMemo(() => {
    const today = new Date();
    const todayT = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    let startT: number | null = null;
    let endT: number | null = null;
    let dayAfterT: number | null = null;

    if (startDate) {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      if (sy && sm && sd) {
        startT = new Date(sy, sm - 1, sd).getTime();
        dayAfterT = startT + 86400000;
      }
    }
    if (endDate) {
      const [ey, em, ed] = endDate.split('-').map(Number);
      if (ey && em && ed) {
        endT = new Date(ey, em - 1, ed).getTime();
      }
    }

    return {
      startTime: startT,
      endTime: endT,
      dayAfterPickup: dayAfterT,
      todayTime: todayT
    };
  }, [startDate, endDate]);

  const renderCustomHeader = useCallback(({
    monthDate,
    decreaseMonth,
    increaseMonth,
  }: any) => {
    return (
      <div className="custom-calendar-header mobile-centered-header">
        <button
          type="button"
          aria-label="Previous Month"
          className="calendar-nav-btn prev"
          onClick={decreaseMonth}
        >
          <ChevronLeft size={18} />
        </button>
        
        <span className="calendar-month-name">
          {monthDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          type="button"
          aria-label="Next Month"
          className="calendar-nav-btn next"
          onClick={increaseMonth}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }, []);

  const getDayClassName = useCallback((date: Date) => {
    const dTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    if (dTime < todayTime) return 'custom-day-disabled';
    if (startTime && dTime === startTime) return 'custom-day-selected custom-day-start';
    if (endTime && dTime === endTime) return 'custom-day-selected custom-day-end';
    if (startTime && endTime && dTime > startTime && dTime < endTime) return 'custom-day-in-range';
    if (dayAfterPickup && dTime === dayAfterPickup) return 'custom-day-disabled';
    
    return 'custom-day-normal';
  }, [startTime, endTime, dayAfterPickup, todayTime]);

  // Stable Date references for DatePicker
  const minCalendarDate = useMemo(() => new Date(new Date().setHours(0, 0, 0, 0)), []);
  const selectedStartDate = useMemo(() => startDate ? new Date(startDate) : null, [startDate]);
  const selectedEndDate = useMemo(() => endDate ? new Date(endDate) : null, [endDate]);

  if (!isMounted) return null;

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'is-closing' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* DESKTOP MODAL (Screens > 768px) */}
      <div 
        className={`modal-container desktop-modal-view ${isClosing ? 'modal-closing' : ''}`} 
        ref={bannerRef}
        onAnimationEnd={handleAnimationEnd}
      >
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
          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-left">
            <div className="date-cards-row">
              <div className="date-card-group">
                <label>PICKUP DATE <span className="req">*</span></label>
                <div className="date-field">
                  <div className="field-icon">
                    <Calendar size={16} />
                  </div>
                  <div className="field-details">
                    <span className="field-date">{startDate ? formatDate(startDate) : 'Select date'}</span>
                    <span className="field-weekday">{formatWeekdayLong(startDate)}</span>
                  </div>
                  <ChevronRight size={16} className="field-chevron" />
                </div>
              </div>
              
              <div className="date-card-group">
                <label>RETURN DATE <span className="req">*</span></label>
                <div className="date-field">
                  <div className="field-icon">
                    <Calendar size={16} />
                  </div>
                  <div className="field-details">
                    <span className="field-date">{endDate ? formatDate(endDate) : 'Select date'}</span>
                    <span className="field-weekday">{formatWeekdayLong(endDate)}</span>
                  </div>
                  <ChevronRight size={16} className="field-chevron" />
                </div>
              </div>
            </div>
            
            <div className="delivery-info-card">
              <Clock size={18} className="delivery-icon" />
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
                    {startDate && endDate ? `${formatDateShort(startDate)} – ${formatDateShort(endDate)}` : 'Select dates'}
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="continue-btn"
              disabled={!startDate || !endDate}
              onClick={handleClose}
            >
              CONTINUE
              <ArrowRight size={20} className="continue-icon" />
            </button>
          </div>
          
          {/* Desktop Calendar */}
          <div className="modal-right desktop-only-calendar">
            <div className="calendar-wrapper">
              <DatePicker
                selected={selectedStartDate}
                onChange={handleDateChange}
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                minDate={minCalendarDate}
                selectsRange
                inline
                monthsShown={1}
                fixedHeight
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

      {/* DEDICATED MOBILE BOTTOM SHEET (Screens <= 768px) */}
      <div 
        className={`mobile-bottom-sheet ${isClosing ? 'sheet-closing' : ''}`} 
        ref={mobileSheetRef}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* Top Drag Handle */}
        <div className="sheet-drag-handle-bar">
          <div className="sheet-drag-handle"></div>
        </div>

        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-header-left">
            <div className="sheet-header-icon">
              <Calendar size={22} />
            </div>
            <div className="sheet-header-titles">
              <h3>Select your Dates</h3>
              <p>Choose your pickup and return dates</p>
            </div>
          </div>
          <button 
            className="sheet-close-btn" 
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Pickup & Return Fields */}
        <div className="sheet-date-cards-row">
          <div className="sheet-date-card-group">
            <label className="sheet-field-label">
              PICKUP DATE <span className="req">*</span>
            </label>
            <div className="sheet-date-box">
              <div className="sheet-field-icon-wrapper">
                <Calendar size={20} className="sheet-field-icon" />
              </div>
              <div className="sheet-field-details">
                <span className="sheet-field-date">
                  {startDate ? formatDate(startDate) : 'Select date'}
                </span>
                <span className="sheet-field-weekday">
                  {startDate ? formatWeekday(startDate) : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="sheet-date-card-group">
            <label className="sheet-field-label">
              RETURN DATE <span className="req">*</span>
            </label>
            <div className="sheet-date-box">
              <div className="sheet-field-icon-wrapper">
                <Calendar size={20} className="sheet-field-icon" />
              </div>
              <div className="sheet-field-details">
                <span className="sheet-field-date">
                  {endDate ? formatDate(endDate) : 'Select date'}
                </span>
                <span className="sheet-field-weekday">
                  {endDate ? formatWeekday(endDate) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Single-Month Calendar */}
        <div className="sheet-calendar-wrapper">
          <DatePicker
            selected={selectedStartDate}
            onChange={handleDateChange}
            startDate={selectedStartDate}
            endDate={selectedEndDate}
            minDate={minCalendarDate}
            selectsRange
            inline
            monthsShown={1}
            fixedHeight
            renderCustomHeader={renderCustomHeader}
            dayClassName={getDayClassName}
          />
        </div>

        {/* Delivery Info Card */}
        <div className="sheet-delivery-info-card">
          <div className="sheet-delivery-icon-wrapper">
            <Clock size={20} className="sheet-delivery-icon" />
          </div>
          <div className="sheet-delivery-text">
            <p className="delivery-p-title">
              Same-day delivery between 5PM and 11PM
            </p>
            <p className="delivery-p-sub">
              For future dates, you can select a specific time slot at checkout.
            </p>
          </div>
        </div>

        {/* Rental Summary Section (Always rendered for layout stability) */}
        <div className="sheet-rental-summary-card">
          <div className="sheet-days-col">
            <span className="sheet-days-num">{String(totalDays || 0).padStart(2, '0')}</span>
            <span className="sheet-days-label">DAYS</span>
          </div>
          <div className="sheet-summary-divider"></div>
          <div className="sheet-period-col">
            <span className="sheet-period-label">CHARGEABLE PERIOD</span>
            <div className="sheet-period-dates">
              <Calendar size={13} className="sheet-period-icon" />
              <span>{startDate && endDate ? `${formatDateShort(startDate)} – ${formatDateShort(endDate)}` : 'Select dates'}</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button 
          className="sheet-continue-btn"
          disabled={!startDate || !endDate}
          onClick={handleClose}
        >
          Continue
          <ArrowRight size={18} className="sheet-continue-icon" />
        </button>
      </div>
    </div>
  );
};

export default DateSelectionBanner;


