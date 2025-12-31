import { create } from 'zustand';

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type TransactionType = 'all' | 'credit' | 'debit' | 'reversal';

export type TransactionCategory =
  | 'all'
  | 'deposit'
  | 'withdrawal'
  | 'manual_credit'
  | 'manual_debit'
  | 'fee'
  | 'refund';

export type TransactionStatus =
  | 'all'
  | 'pending'
  | 'processing'
  | 'successful'
  | 'failed'
  | 'reversed';

interface FilterState {
  isFilterOpen: boolean;
  dateRange: DateRange;
  transactionType: TransactionType[];
  transactionCategory: TransactionCategory[];
  transactionStatus: TransactionStatus[];
  currency: string | 'all';
  setIsFilterOpen: (isOpen: boolean) => void;
  setDateRange: (range: DateRange) => void;
  setTransactionType: (types: TransactionType[]) => void;
  setTransactionCategory: (categories: TransactionCategory[]) => void;
  setTransactionStatus: (statuses: TransactionStatus[]) => void;
  setCurrency: (currency: string | 'all') => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  isFilterOpen: false,
  dateRange: { from: undefined, to: undefined },
  transactionType: ['all'],
  transactionCategory: ['all'],
  transactionStatus: ['all'],
  currency: 'all',
  setIsFilterOpen: () => {},
  setDateRange: () => {},
  setTransactionType: () => {},
  setTransactionCategory: () => {},
  setTransactionStatus: () => {},
  setCurrency: () => {},
  resetFilters: () => {},
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setDateRange: (range) => set({ dateRange: range }),
  setTransactionType: (types) => set({ transactionType: types }),
  setTransactionCategory: (categories) =>
    set({ transactionCategory: categories }),
  setTransactionStatus: (statuses) => set({ transactionStatus: statuses }),
  setCurrency: (currency) => set({ currency }),
  resetFilters: () => set(initialState),
}));
