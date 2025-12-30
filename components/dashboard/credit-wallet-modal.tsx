'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createManualTransaction } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreditWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CURRENCIES = ['USD', 'EUR', 'NGN', 'GBP'];

export function CreditWalletModal({ isOpen, onClose }: CreditWalletModalProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleCredit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);

    try {
      await createManualTransaction({
        type: 'credit',
        transaction_category: 'manual_credit',
        amount: parseFloat(amount),
        currency,
        metadata: {
          description: description || 'Manual credit',
          source: 'admin',
        },
      });

      await queryClient.invalidateQueries({ queryKey: ['wallet'] });
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });

      toast.success('Wallet credited successfully');
      setAmount('');
      setDescription('');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to credit wallet');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Credit Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm text-gray-500">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm text-gray-500">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isProcessing}
            >
              {CURRENCIES.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm text-gray-500">
              Description (Optional)
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Add a note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleCredit}
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Credit Wallet'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
