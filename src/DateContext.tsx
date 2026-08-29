import { createContext, useContext, useState, type ReactNode } from 'react';

interface DateContextType {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  isDatePromptOpen: boolean;
  setIsDatePromptOpen: (isOpen: boolean) => void;
  totalDays: number;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePromptOpen, setIsDatePromptOpen] = useState(false);

  let totalDays = 0;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
       const diffTime = end.getTime() - start.getTime();
       totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
  } else if (startDate && !endDate) {
    totalDays = 1;
  }

  return (
    <DateContext.Provider value={{ startDate, endDate, setStartDate, setEndDate, isDatePromptOpen, setIsDatePromptOpen, totalDays }}>
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
