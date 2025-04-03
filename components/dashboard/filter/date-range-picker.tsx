'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CustomDatePicker } from '@/components/custom-date-picker';
import { cn } from '@/lib/utils';
import { type DateRange } from '@/store/filter-store';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');

  const handleDateSelect = (date: Date) => {
    if (activeInput === 'from') {
      onDateRangeChange({ ...dateRange, from: date });
    } else {
      onDateRangeChange({ ...dateRange, to: date });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date Range</label>
      <div className="grid grid-cols-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal bg-muted/50',
                !dateRange.from && 'text-muted-foreground'
              )}
              onClick={() => setActiveInput('from')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                format(dateRange.from, 'dd MMM yyyy')
              ) : (
                <span>From date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <CustomDatePicker
              selectedDate={dateRange.from}
              onDateChange={handleDateSelect}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal bg-muted/50',
                !dateRange.to && 'text-muted-foreground'
              )}
              onClick={() => setActiveInput('to')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? (
                format(dateRange.to, 'dd MMM yyyy')
              ) : (
                <span>To date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="end">
            <CustomDatePicker
              selectedDate={dateRange.to}
              fromDate={dateRange.from}
              onDateChange={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
