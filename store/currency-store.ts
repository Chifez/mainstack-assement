import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  selectedCurrency: string;
  setCurrency: (currency: string) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      selectedCurrency: 'USD',
      setCurrency: (currency: string) => set({ selectedCurrency: currency }),
    }),
    {
      name: 'currency-storage',
    }
  )
);

