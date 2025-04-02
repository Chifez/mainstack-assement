'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date Range</label>
      <div className="grid grid-cols-2 gap-2">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal bg-muted/50',
                !dateRange.from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                format(dateRange.from, 'dd MMM yyyy')
              ) : (
                <span>From date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full flex justify-center p-0"
            align="start"
          >
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) =>
                onDateRangeChange({
                  from: range?.from,
                  to: range?.to,
                })
              }
              initialFocus
              numberOfMonths={1}
              className="w-full"
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal bg-muted/50',
            !dateRange.to && 'text-muted-foreground'
          )}
          onClick={() => setIsCalendarOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.to ? (
            format(dateRange.to, 'dd MMM yyyy')
          ) : (
            <span>To date</span>
          )}
        </Button>
      </div>
    </div>
  );
}
