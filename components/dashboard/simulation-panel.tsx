'use client';

import { useSimulationStore } from '@/store/simulation-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info } from 'lucide-react';

export function SimulationPanel() {
  const {
    simulateNetworkFailure,
    simulateInsufficientFunds,
    simulateDuplicateTransaction,
    simulateReversal,
    setSimulateNetworkFailure,
    setSimulateInsufficientFunds,
    setSimulateDuplicateTransaction,
    setSimulateReversal,
  } = useSimulationStore();

  const activeCount = [
    simulateNetworkFailure,
    simulateInsufficientFunds,
    simulateDuplicateTransaction,
    simulateReversal,
  ].filter(Boolean).length;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full shadow-lg"
            size="sm"
          >
            {activeCount > 0 && (
              <Badge className="mr-2 bg-red-500">{activeCount}</Badge>
            )}
            Simulation
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Failure Simulations</h3>
              <p className="text-sm text-gray-600 mb-4">
                Toggle these to test how the system handles different failure
                scenarios
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="network-failure"
                    className="text-sm font-medium"
                  >
                    Network Failure
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <p className="text-sm">
                        Creates the transaction but forces it to fail during
                        processing. The failed transaction will appear in the
                        transaction list.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <input
                  id="network-failure"
                  type="checkbox"
                  checked={simulateNetworkFailure}
                  onChange={(e) => setSimulateNetworkFailure(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="insufficient-funds"
                    className="text-sm font-medium"
                  >
                    Insufficient Funds
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <p className="text-sm">
                        Forces balance validation to fail even if sufficient
                        funds exist. Shows proper error messages.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <input
                  id="insufficient-funds"
                  type="checkbox"
                  checked={simulateInsufficientFunds}
                  onChange={(e) =>
                    setSimulateInsufficientFunds(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="duplicate-transaction"
                    className="text-sm font-medium"
                  >
                    Duplicate Transaction
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <p className="text-sm">
                        Uses an existing idempotency key to trigger duplicate
                        detection. Returns existing transaction instead of
                        creating duplicate.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <input
                  id="duplicate-transaction"
                  type="checkbox"
                  checked={simulateDuplicateTransaction}
                  onChange={(e) =>
                    setSimulateDuplicateTransaction(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="reversal-simulation"
                    className="text-sm font-medium"
                  >
                    Reversal Simulation
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <p className="text-sm">
                        Creates a transaction, processes it, then automatically
                        creates a reversal after completion.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <input
                  id="reversal-simulation"
                  type="checkbox"
                  checked={simulateReversal}
                  onChange={(e) => setSimulateReversal(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

