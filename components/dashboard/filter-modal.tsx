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
    resetFilters,
  } = useFilterStore();

  const [localDateRange, setLocalDateRange] = useState<DateRange>(dateRange);
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

  // UI state for dropdowns
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const getTypeDisplayText = () => {
    if (
      localTransactionType.includes('all') &&
      localTransactionType.length === 1
    ) {
      return 'Store Transactions';
    }

    const typeNames = {
      all: 'Store Transactions',
      get_tipped: 'Get Tipped',
      withdrawals: 'Withdrawals',
      chargebacks: 'Chargebacks',
      cashbacks: 'Cashbacks',
      refer_earn: 'Refer & Earn',
    };

    const selectedTypes = localTransactionType.map(
      (type) => typeNames[type as keyof typeof typeNames]
    );

    if (selectedTypes.length > 1) {
      return `${selectedTypes.join(', ').substring(0, 20)}...`;
    }

    return selectedTypes[0] || 'Store Transactions';
  };

  const getStatusDisplayText = () => {
    if (
      localTransactionStatus.includes('all') &&
      localTransactionStatus.length === 1
    ) {
      return 'Successful, Pending, Failed';
    }

    const statusNames = {
      successful: 'Successful',
      pending: 'Pending',
      failed: 'Failed',
    };

    return localTransactionStatus
      .map((status) => statusNames[status as keyof typeof statusNames])
      .join(', ');
  };

  return (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent className="sm:max-w-sm m-2 rounded-2xl p-4">
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
            <Button
              variant="outline"
              size="sm"
              className={cn('rounded-full', !localDateRange.from && 'bg-muted')}
              onClick={() =>
                setLocalDateRange({ from: undefined, to: undefined })
              }
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 7);
                setLocalDateRange({ from: lastWeek, to: today });
              }}
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);
                setLocalDateRange({ from: lastMonth, to: today });
              }}
            >
              This month
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                const today = new Date();
                const lastThreeMonths = new Date(today);
                lastThreeMonths.setMonth(today.getMonth() - 3);
                setLocalDateRange({ from: lastThreeMonths, to: today });
              }}
            >
              Last 3 months
            </Button>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal bg-muted/50',
                      !localDateRange.from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localDateRange.from ? (
                      format(localDateRange.from, 'dd MMM yyyy')
                    ) : (
                      <span>From date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={localDateRange}
                    onSelect={(range) =>
                      setLocalDateRange({
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
                  !localDateRange.to && 'text-muted-foreground'
                )}
                onClick={() => setIsCalendarOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localDateRange.to ? (
                  format(localDateRange.to, 'dd MMM yyyy')
                ) : (
                  <span>To date</span>
                )}
              </Button>
            </div>
          </div>

          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <Collapsible
              open={isTypeDropdownOpen}
              onOpenChange={setIsTypeDropdownOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-muted/50"
                >
                  <span className="text-sm font-normal">
                    {getTypeDisplayText()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 border rounded-lg p-2 bg-background">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="type-store"
                      checked={localTransactionType.includes('all')}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange('all', checked as boolean)
                      }
                    />
                    <label htmlFor="type-store" className="text-sm">
                      Store Transactions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="type-tipped"
                      checked={localTransactionType.includes('get_tipped')}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange(
                          'get_tipped',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="type-tipped" className="text-sm">
                      Get Tipped
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="type-withdrawals"
                      checked={localTransactionType.includes('withdrawals')}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange(
                          'withdrawals',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="type-withdrawals" className="text-sm">
                      Withdrawals
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="type-chargebacks"
                      checked={localTransactionType.includes('chargebacks')}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange(
                          'chargebacks',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="type-chargebacks" className="text-sm">
                      Chargebacks
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="type-cashbacks"
                      checked={localTransactionType.includes('cashbacks')}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange(
                          'cashbacks',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="type-cashbacks" className="text-sm">
                      Cashbacks
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="type-refer"
                      checked={localTransactionType.includes('refer_earn')}
                      onCheckedChange={(checked) =>
                        handleTransactionTypeChange(
                          'refer_earn',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="type-refer" className="text-sm">
                      Refer & Earn
                    </label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Transaction Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Status</label>
            <Collapsible
              open={isStatusDropdownOpen}
              onOpenChange={setIsStatusDropdownOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-muted/50"
                >
                  <span className="text-sm font-normal">
                    {getStatusDisplayText()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 border rounded-lg p-2 bg-background">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="status-successful"
                      checked={localTransactionStatus.includes('successful')}
                      onCheckedChange={(checked) =>
                        handleTransactionStatusChange(
                          'successful',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="status-successful" className="text-sm">
                      Successful
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="status-pending"
                      checked={localTransactionStatus.includes('pending')}
                      onCheckedChange={(checked) =>
                        handleTransactionStatusChange(
                          'pending',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="status-pending" className="text-sm">
                      Pending
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-2">
                    <Checkbox
                      id="status-failed"
                      checked={localTransactionStatus.includes('failed')}
                      onCheckedChange={(checked) =>
                        handleTransactionStatusChange(
                          'failed',
                          checked as boolean
                        )
                      }
                    />
                    <label htmlFor="status-failed" className="text-sm">
                      Failed
                    </label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <SheetFooter className="flex flex-row justify-between sm:justify-between ">
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
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
