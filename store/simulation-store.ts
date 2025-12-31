import { create } from 'zustand';

interface SimulationState {
  simulateNetworkFailure: boolean;
  simulateInsufficientFunds: boolean;
  simulateDuplicateTransaction: boolean;
  setSimulateNetworkFailure: (value: boolean) => void;
  setSimulateInsufficientFunds: (value: boolean) => void;
  setSimulateDuplicateTransaction: (value: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  simulateNetworkFailure: false,
  simulateInsufficientFunds: false,
  simulateDuplicateTransaction: false,
  setSimulateNetworkFailure: (value) => set({ simulateNetworkFailure: value }),
  setSimulateInsufficientFunds: (value) =>
    set({ simulateInsufficientFunds: value }),
  setSimulateDuplicateTransaction: (value) =>
    set({ simulateDuplicateTransaction: value }),
}));
