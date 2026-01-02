import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  currency?: string;
}

export function WithdrawModal({
  isOpen,
  onClose,
  availableBalance,
  currency = 'USD',
}: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  const vatRate = 0.05; // 5% VAT
  const vatAmount = Number(amount) * vatRate;
  const totalAmount = Number(amount) + vatAmount;

  // Calculate max amount considering VAT
  const maxAmount = availableBalance / (1 + vatRate);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (numValue > maxAmount) {
      return;
    }
    setAmount(value);
  };

  const handleWithdraw = async () => {
    try {
      setIsProcessing(true);

      const transaction = await createTransaction({
        type: 'debit',
        transaction_category: 'withdrawal',
        amount: totalAmount,
        currency,
        metadata: {
          withdrawal_amount: Number(amount),
          vat_amount: vatAmount,
          total_amount: totalAmount,
        },
      });

      await queryClient.invalidateQueries({ queryKey: ['wallet'] });
      await queryClient.invalidateQueries({ queryKey: ['balance'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });

      // Only show success toast if it's not a duplicate
      // Duplicate transactions already show a warning toast in createTransaction
      if (!transaction.isDuplicate) {
        toast.success('Withdrawal successful', {
          description: 'Your withdrawal request has been processed.',
        });
      }
      setAmount('');
      onClose();
    } catch (error: any) {
      toast.error('Withdrawal failed', {
        description:
          error.message || 'An error occurred while processing your withdrawal',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-500">Available Balance</label>
            <div className="text-2xl font-bold">
              {formatCurrency(availableBalance, currency)}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm text-gray-500">
              Amount to Withdraw
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              max={maxAmount}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-gray-500">
              Maximum withdrawal: {formatCurrency(maxAmount, currency)}{' '}
              (including VAT)
            </p>
          </div>

          <div className="space-y-2 " aria-readonly aria-disabled>
            <label className="text-sm text-gray-500">VAT (5%)</label>
            <Input
              value={formatCurrency(vatAmount, currency)}
              readOnly
              className="bg-gray-50 cursor-default"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-500">Total Amount</label>
            <div className="text-lg font-semibold">
              {formatCurrency(totalAmount, currency)}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={
              isProcessing ||
              !amount ||
              Number(amount) <= 0 ||
              totalAmount > availableBalance
            }
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Withdraw'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
