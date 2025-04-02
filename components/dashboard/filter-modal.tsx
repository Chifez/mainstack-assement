'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, X, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import {
  type DateRange,
  type TransactionStatus,
  type TransactionType,
  useFilterStore,
} from '@/store/filter-store';
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Sheet,
  SheetClose,
} from '../ui/sheet';
import { QuickFilterButton } from './filter/quick-filter-button';
import { DateRangePicker } from './filter/date-range-picker';
import { TransactionTypeFilter } from './filter/transaction-type-filter';
import { TransactionStatusFilter } from './filter/transaction-status-filter';

export function FilterModal() {
  const {
    isFilterOpen,
    dateRange,
    transactionType,
    transactionStatus,
    setIsFilterOpen,
    setDateRange,
    setTransactionType,
    setTransactionStatus,
  } = useFilterStore();

  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [localTransactionType, setLocalTransactionType] =
    useState<TransactionType[]>(transactionType);
  const [localTransactionStatus, setLocalTransactionStatus] =
    useState<TransactionStatus[]>(transactionStatus);

  // Reset local state when store changes
  useEffect(() => {
    setLocalDateRange(dateRange);
    setLocalTransactionType(transactionType);
    setLocalTransactionStatus(transactionStatus);
  }, [dateRange, transactionType, transactionStatus]);

  const handleApply = () => {
    setDateRange(localDateRange);
    setTransactionType(localTransactionType);
    setTransactionStatus(localTransactionStatus);
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setLocalDateRange({ from: undefined, to: undefined });
    setLocalTransactionType(['all']);
    setLocalTransactionStatus(['all']);
    // Reset the store filters
    setDateRange({ from: undefined, to: undefined });
    setTransactionType(['all']);
    setTransactionStatus(['all']);
  };

  const handleTransactionTypeChange = (
    type: TransactionType,
    checked: boolean
  ) => {
    if (type === 'all' && checked) {
      setLocalTransactionType(['all']);
    } else {
      const newTypes = checked
        ? [...localTransactionType.filter((t) => t !== 'all'), type]
        : localTransactionType.filter((t) => t !== type);

      setLocalTransactionType(newTypes.length ? newTypes : ['all']);
    }
  };

  const handleTransactionStatusChange = (
    status: TransactionStatus,
    checked: boolean
  ) => {
    if (status === 'all' && checked) {
      setLocalTransactionStatus(['all']);
    } else {
      const newStatuses = checked
        ? [...localTransactionStatus.filter((s) => s !== 'all'), status]
        : localTransactionStatus.filter((s) => s !== status);

      setLocalTransactionStatus(newStatuses.length ? newStatuses : ['all']);
    }
  };

  const hasActiveFilters =
    localDateRange.from ||
    localDateRange.to ||
    (localTransactionType.length > 0 &&
      !localTransactionType.includes('all')) ||
    (localTransactionStatus.length > 0 &&
      !localTransactionStatus.includes('all'));

  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent className="sm:max-w-sm h-[97.5%] rounded-2xl m-2 p-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Filter</SheetTitle>
            <SheetClose>
              <XIcon className="size-4" />
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Quick date filters */}
          <div className="flex gap-1">
            <QuickFilterButton
              label="Today"
              onClick={() =>
                setLocalDateRange({ from: undefined, to: undefined })
              }
              isActive={!localDateRange.from}
            />
            <QuickFilterButton
              label="Last 7 days"
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 7);
                setLocalDateRange({ from: lastWeek, to: today });
              }}
            />
            <QuickFilterButton
              label="This month"
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);
                setLocalDateRange({ from: lastMonth, to: today });
              }}
            />
            <QuickFilterButton
              label="Last 3 months"
              onClick={() => {
                const today = new Date();
                const lastThreeMonths = new Date(today);
                lastThreeMonths.setMonth(today.getMonth() - 3);
                setLocalDateRange({ from: lastThreeMonths, to: today });
              }}
            />
          </div>

          <DateRangePicker
            dateRange={localDateRange}
            onDateRangeChange={setLocalDateRange}
          />

          <TransactionTypeFilter
            selectedTypes={localTransactionType}
            onTypeChange={handleTransactionTypeChange}
          />

          <TransactionStatusFilter
            selectedStatuses={localTransactionStatus}
            onStatusChange={handleTransactionStatusChange}
          />
        </div>

        <SheetFooter className="flex flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            className="rounded-full flex-1"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            className="rounded-full bg-black text-white hover:bg-black/90 flex-1"
            disabled={!hasActiveFilters}
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
