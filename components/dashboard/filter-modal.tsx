'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';
import {
  DateRange,
  TransactionStatus,
  TransactionType,
  useFilterStore,
} from '@/store/filter-store';

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

  // UI state for dropdowns
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Current month and year for calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (!isFilterOpen) return null;

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

  const formatDateDisplay = (date?: Date) => {
    return date ? format(date, 'dd MMM yyyy') : '';
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
      return `${selectedTypes.join(', ')}, Ca...`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 filter-modal">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Filter</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setIsFilterOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex space-x-2 mb-6">
            <Button
              variant="outline"
              className={`px-4 py-2 text-sm rounded-full ${
                !localDateRange.from ? 'bg-gray-100' : 'bg-white'
              }`}
              onClick={() =>
                setLocalDateRange({ from: undefined, to: undefined })
              }
            >
              Today
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 text-sm rounded-full"
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
              className="px-4 py-2 text-sm rounded-full"
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
              className="px-4 py-2 text-sm rounded-full"
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-sm ${
                  isCalendarOpen ? 'border border-black' : ''
                }`}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <span>
                  {localDateRange.from
                    ? format(localDateRange.from, 'dd MMM yyyy')
                    : 'Select date'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-sm">
                <span>
                  {localDateRange.to
                    ? format(localDateRange.to, 'dd MMM yyyy')
                    : 'Select date'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {isCalendarOpen && (
              <div className="mt-2 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <button className="p-1">
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </button>
                  <h3 className="text-sm font-medium">July, 2023</h3>
                  <button className="p-1">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  <div className="text-xs text-center text-gray-500">Mon</div>
                  <div className="text-xs text-center text-gray-500">Tue</div>
                  <div className="text-xs text-center text-gray-500">Wed</div>
                  <div className="text-xs text-center text-gray-500">Thu</div>
                  <div className="text-xs text-center text-gray-500">Fri</div>
                  <div className="text-xs text-center text-gray-500">Sat</div>
                  <div className="text-xs text-center text-gray-500">Sun</div>

                  {/* Calendar days - this is just a static representation */}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button
                      key={i}
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                        i + 1 === 17 ? 'bg-black text-white' : ''
                      }`}
                      onClick={() => {
                        const date = new Date(2023, 6, i + 1);
                        setLocalDateRange({ ...localDateRange, from: date });
                        setIsCalendarOpen(false);
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <div className="relative">
              <button
                className={`w-full flex items-center justify-between px-4 py-3 ${
                  isTypeDropdownOpen
                    ? 'border border-black rounded-lg'
                    : 'bg-gray-100 rounded-lg'
                }`}
                onClick={() => {
                  setIsTypeDropdownOpen(!isTypeDropdownOpen);
                  setIsStatusDropdownOpen(false);
                  setIsCalendarOpen(false);
                }}
              >
                <span className="text-sm">{getTypeDisplayText()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border shadow-sm z-10">
                  <div className="p-2">
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
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Status</label>
            <div className="relative">
              <button
                className={`w-full flex items-center justify-between px-4 py-3 ${
                  isStatusDropdownOpen
                    ? 'border border-black rounded-lg'
                    : 'bg-gray-100 rounded-lg'
                }`}
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsTypeDropdownOpen(false);
                  setIsCalendarOpen(false);
                }}
              >
                <span className="text-sm">{getStatusDisplayText()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border shadow-sm z-10">
                  <div className="p-2">
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
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-full"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            onClick={handleApply}
            className="bg-black text-white hover:bg-black/90 px-6 py-2 rounded-full"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
