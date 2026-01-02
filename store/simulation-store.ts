import { create } from 'zustand';

interface SimulationState {
  simulateNetworkFailure: boolean;
  simulateInsufficientFunds: boolean;
  simulateDuplicateTransaction: boolean;
  simulateReversal: boolean;
  setSimulateNetworkFailure: (value: boolean) => void;
  setSimulateInsufficientFunds: (value: boolean) => void;
  setSimulateDuplicateTransaction: (value: boolean) => void;
  setSimulateReversal: (value: boolean) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  simulateNetworkFailure: false,
  simulateInsufficientFunds: false,
  simulateDuplicateTransaction: false,
  simulateReversal: false,
  setSimulateNetworkFailure: (value) => set({ simulateNetworkFailure: value }),
  setSimulateInsufficientFunds: (value) =>
    set({ simulateInsufficientFunds: value }),
  setSimulateDuplicateTransaction: (value) =>
    set({ simulateDuplicateTransaction: value }),
  setSimulateReversal: (value) => set({ simulateReversal: value }),
}));
