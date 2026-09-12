import React, { useCallback } from 'react';
import { MapPin, Calendar, Edit2 } from 'lucide-react';
import { useDateContext } from '../DateContext';
import './RentalDatePill.css';

interface RentalDatePillProps {
  locationName?: string;
  className?: string;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const RentalDatePill: React.FC<RentalDatePillProps> = ({
  locationName = 'Hyderabad',
  className = ''
}) => {
  const { startDate, endDate, setIsDatePromptOpen } = useDateContext();

  const formatDateWithSuffix = useCallback((dateString: string) => {
    if (!dateString) return 'Select Date';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return 'Select Date';
    const date = new Date(y, m - 1, d);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || Math.floor((day % 100) / 10) === 1) ? 0 : day % 10];
    const month = MONTHS_SHORT[date.getMonth()] || date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  }, []);

  const formatWeekday = useCallback((dateString: string) => {
    if (!dateString) return '-';
    const [y, m, d] = dateString.split('-').map(Number);
    if (!y || !m || !d) return '-';
    const date = new Date(y, m - 1, d);
    return DAYS_SHORT[date.getDay()] || '-';
  }, []);

  return (
    <div className={`rental-date-pill-wrapper ${className}`}>
      {/* Global Utility Bar (Desktop) */}
      <div className="utility-bar desktop-utility-bar">
        <div className="utility-location">
          <MapPin size={18} className="utility-icon" />
          <span>{locationName}</span>
        </div>
        
        <div className="utility-dates">
          <div className="utility-date">
            <Calendar size={18} className="utility-icon" />
            <span>Pickup: {startDate ? formatDateWithSuffix(startDate) : 'Select Date'}</span>
          </div>
          <div className="utility-date-divider"></div>
          <div className="utility-date">
            <Calendar size={18} className="utility-icon" />
            <span>Return: {endDate ? formatDateWithSuffix(endDate) : 'Select Date'}</span>
          </div>
          
          <button 
            type="button"
            className="utility-edit-btn" 
            onClick={() => setIsDatePromptOpen(true)}
            aria-label="Edit rental dates"
          >
            <Edit2 size={15} /> Edit
          </button>
        </div>
      </div>

      {/* Global Utility Bar (Mobile) - Compact Pill */}
      <div className="mobile-utility-bar">
        <div className="mobile-pill-section">
          <Calendar size={18} className="pill-icon" />
          <div className="pill-date-info">
            <span className="pill-date-main">{startDate ? formatDateWithSuffix(startDate) : 'Select date'}</span>
            <span className="pill-date-sub">{startDate ? formatWeekday(startDate) : '-'}</span>
          </div>
        </div>
        
        <div className="pill-divider"></div>
        
        <div className="mobile-pill-section">
          <Calendar size={18} className="pill-icon" />
          <div className="pill-date-info">
            <span className="pill-date-main">{endDate ? formatDateWithSuffix(endDate) : 'Select date'}</span>
            <span className="pill-date-sub">{endDate ? formatWeekday(endDate) : '-'}</span>
          </div>
        </div>
        
        <div className="pill-divider"></div>
        
        <button 
          type="button"
          className="mobile-pill-edit" 
          onClick={() => setIsDatePromptOpen(true)}
          aria-label="Edit rental dates"
        >
          <Edit2 size={13} /> Edit
        </button>
      </div>
    </div>
  );
};

export default RentalDatePill;
