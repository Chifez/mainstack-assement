import { create } from 'zustand';

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type TransactionType =
  | 'all'
  | 'store_transactions'
  | 'get_tipped'
  | 'withdrawals'
  | 'chargebacks'
  | 'cashbacks'
  | 'refer_earn';

export type TransactionStatus = 'all' | 'successful' | 'pending' | 'failed';

interface FilterState {
  isFilterOpen: boolean;
  dateRange: DateRange;
  transactionType: TransactionType[];
  transactionStatus: TransactionStatus[];
  setIsFilterOpen: (isOpen: boolean) => void;
  setDateRange: (range: DateRange) => void;
  setTransactionType: (types: TransactionType[]) => void;
  setTransactionStatus: (statuses: TransactionStatus[]) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  isFilterOpen: false,
  dateRange: { from: undefined, to: undefined },
  transactionType: ['all'],
  transactionStatus: ['all'],
  setIsFilterOpen: () => {},
  setDateRange: () => {},
  setTransactionType: () => {},
  setTransactionStatus: () => {},
  resetFilters: () => {},
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setDateRange: (range) => set({ dateRange: range }),
  setTransactionType: (types) => set({ transactionType: types }),
  setTransactionStatus: (statuses) => set({ transactionStatus: statuses }),
  resetFilters: () => set(initialState),
}));
