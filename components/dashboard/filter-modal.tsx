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
  type TransactionCategory,
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
    transactionCategory,
    transactionStatus,
    currency,
    setIsFilterOpen,
    setDateRange,
    setTransactionType,
    setTransactionCategory,
    setTransactionStatus,
    setCurrency,
  } = useFilterStore();

  const [localDateRange, setLocalDateRange] = useState(dateRange);
  const [localTransactionType, setLocalTransactionType] =
    useState<TransactionType[]>(transactionType);
  const [localTransactionCategory, setLocalTransactionCategory] =
    useState<TransactionCategory[]>(transactionCategory);
  const [localTransactionStatus, setLocalTransactionStatus] =
    useState<TransactionStatus[]>(transactionStatus);
  const [localCurrency, setLocalCurrency] = useState(currency);

  // Reset local state when store changes
  useEffect(() => {
    setLocalDateRange(dateRange);
    setLocalTransactionType(transactionType);
    setLocalTransactionCategory(transactionCategory);
    setLocalTransactionStatus(transactionStatus);
    setLocalCurrency(currency);
  }, [dateRange, transactionType, transactionCategory, transactionStatus, currency]);

  const handleApply = () => {
    setDateRange(localDateRange);
    setTransactionType(localTransactionType);
    setTransactionCategory(localTransactionCategory);
    setTransactionStatus(localTransactionStatus);
    setCurrency(localCurrency);
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setLocalDateRange({ from: undefined, to: undefined });
    setLocalTransactionType(['all']);
    setLocalTransactionCategory(['all']);
    setLocalTransactionStatus(['all']);
    setLocalCurrency('all');
    // Reset the store filters
    setDateRange({ from: undefined, to: undefined });
    setTransactionType(['all']);
    setTransactionCategory(['all']);
    setTransactionStatus(['all']);
    setCurrency('all');
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

  const handleTransactionCategoryChange = (
    category: TransactionCategory,
    checked: boolean
  ) => {
    if (category === 'all' && checked) {
      setLocalTransactionCategory(['all']);
    } else {
      const newCategories = checked
        ? [...localTransactionCategory.filter((c) => c !== 'all'), category]
        : localTransactionCategory.filter((c) => c !== category);

      setLocalTransactionCategory(newCategories.length ? newCategories : ['all']);
    }
  };

  const hasActiveFilters =
    localDateRange.from ||
    localDateRange.to ||
    (localTransactionType.length > 0 &&
      !localTransactionType.includes('all')) ||
    (localTransactionCategory.length > 0 &&
      !localTransactionCategory.includes('all')) ||
    (localTransactionStatus.length > 0 &&
      !localTransactionStatus.includes('all')) ||
    (localCurrency && localCurrency !== 'all');

  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent className="max-w-[80vw] sm:max-w-sm h-[97.5%] rounded-2xl m-2 p-4">
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
          <div className="flex flex-wrap md:flex-nowrap gap-2 lg:gap-1">
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

          {/* Currency Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <select
              value={localCurrency}
              onChange={(e) => setLocalCurrency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Currencies</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          {/* Transaction Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Category</label>
            <div className="space-y-2">
              {[
                'all',
                'deposit',
                'withdrawal',
                'manual_credit',
                'manual_debit',
                'fee',
                'refund',
              ].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={localTransactionCategory.includes(
                      category as TransactionCategory
                    )}
                    onCheckedChange={(checked) =>
                      handleTransactionCategoryChange(
                        category as TransactionCategory,
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {category.replace('_', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
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
