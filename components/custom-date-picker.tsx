'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isBefore,
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CustomDatePickerProps {
  selectedDate?: Date;
  fromDate?: Date; // Add fromDate prop for range constraints
  onDateChange: (date: Date) => void;
  onClose?: () => void;
}

export function CustomDatePicker({
  selectedDate,
  fromDate,
  onDateChange,
  onClose,
}: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [isOpen, setIsOpen] = useState(true);

  // Generate days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Handle month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    if (onClose) {
      onClose();
    }
  };

  // Calculate the starting position for the first day of the month
  // This ensures the calendar starts with Monday as the first day
  const getStartingDayOffset = () => {
    const dayOfWeek = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
    // Convert to our format where Monday is 0
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  };

  const startOffset = getStartingDayOffset();

  // Check if a date is disabled (before fromDate)
  const isDateDisabled = (date: Date) => {
    if (!fromDate) return false;
    return isBefore(date, fromDate);
  };

  return (
    <div className="w-[22rem] bg-white rounded-lg">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-sm font-medium">
          {format(currentMonth, 'MMMM, yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 w-full mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-xs text-center text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 w-full">
        {/* Empty cells for days before the start of the month */}
        {Array.from({ length: startOffset }).map((_, index) => (
          <div
            key={`empty-start-${index}`}
            className="h-8 flex items-center justify-center"
          />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((day) => {
          const isSelected = selectedDate
            ? isSameDay(day, selectedDate)
            : false;
          const isFromDate = fromDate ? isSameDay(day, fromDate) : false;
          const isTodayDate = isToday(day);
          const disabled = isDateDisabled(day);

          return (
            <button
              key={day.toString()}
              onClick={() => !disabled && handleDateSelect(day)}
              disabled={disabled}
              className={cn(
                'h-8 aspect-square rounded-full flex items-center justify-center text-sm transition-colors mx-auto',
                isSelected
                  ? 'bg-black text-white'
                  : isFromDate
                  ? 'bg-gray-100 border-2 border-black'
                  : isTodayDate
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100',
                disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
