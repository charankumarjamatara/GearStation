import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

type CalendarMode = 'pickup' | 'return' | null;

interface DateContextType {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  isDatePromptOpen: boolean;
  setIsDatePromptOpen: (isOpen: boolean) => void;
  mobileCalendarMode: CalendarMode;
  setMobileCalendarMode: (mode: CalendarMode) => void;
  totalDays: number;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePromptOpen, setIsDatePromptOpen] = useState(false);
  const [mobileCalendarMode, setMobileCalendarMode] = useState<CalendarMode>(null);

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const [sy, sm, sd] = startDate.split('-').map(Number);
    const [ey, em, ed] = endDate.split('-').map(Number);
    if (!sy || !sm || !sd || !ey || !em || !ed) return 0;
    const start = new Date(sy, sm - 1, sd);
    const end = new Date(ey, em - 1, ed);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays - 1); // exclude return day from chargeable count
  }, [startDate, endDate]);

  const value = useMemo(() => ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    isDatePromptOpen,
    setIsDatePromptOpen,
    mobileCalendarMode,
    setMobileCalendarMode,
    totalDays
  }), [startDate, endDate, isDatePromptOpen, mobileCalendarMode, totalDays]);

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within a DateProvider');
  }
  return context;
};

