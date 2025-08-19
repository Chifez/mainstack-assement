'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Transaction } from '@/lib/types';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  isMobile = false,
}: TransactionDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type?.includes('withdrawal')) {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Image
            src="/call_made.svg"
            height={16}
            width={16}
            alt="withdrawal"
            priority
          />
        </div>
      );
    }
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <Image
          src="/call_received.svg"
          height={16}
          width={16}
          alt="deposit"
          priority
        />
      </div>
    );
  };

  const copyReference = async () => {
    if (transaction.payment_reference) {
      await navigator.clipboard.writeText(transaction.payment_reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportTransaction = () => {
    const data = {
      Date: formatDate(transaction.date),
      Type: transaction.type === 'withdrawal' ? 'Cash Withdrawal' : 'Deposit',
      Amount: `USD ${transaction.amount}`,
      Status: transaction.status,
      Reference: transaction.payment_reference || 'N/A',
      Name: transaction.metadata?.name || 'N/A',
      Email: transaction.metadata?.email || 'N/A',
      Country: transaction.metadata?.country || 'N/A',
      Product: transaction.metadata?.product_name || 'N/A',
      Quantity: transaction.metadata?.quantity || 'N/A',
    };

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-${
      transaction.payment_reference || 'detail'
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <>
      <div className="space-y-4">
        {/* Header with icon and amount */}
        <div className="flex items-center gap-4">
          {getTransactionIcon(transaction.type)}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {transaction.type === 'withdrawal'
                ? 'Cash Withdrawal'
                : transaction.metadata?.product_name || 'Transaction'}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              USD {transaction.amount}
            </p>
            <Badge className={getStatusColor(transaction.status)}>
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Transaction details */}
        <div className="space-y-4">
          {transaction.metadata?.name && (
            <div className="flex gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-sm text-gray-900">
                  {transaction.metadata.name}
                </p>
              </div>
              {transaction.metadata?.email && (
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {transaction.metadata.email}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="text-sm text-gray-900 capitalize">
                {transaction.type}
              </p>
            </div>

            {transaction.payment_reference && (
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-500">
                  Payment Reference
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-900 font-mono">
                    {transaction.payment_reference}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyReference}
                    className="h-6 w-6 p-0"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          {transaction.metadata?.quantity && (
            <div className="flex gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-500">
                  Quantity
                </label>
                <p className="text-sm text-gray-900">
                  {transaction.metadata.quantity}
                </p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          )}

          {transaction.metadata?.country && (
            <div className="flex gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-500">
                  Country
                </label>
                <p className="text-sm text-gray-900">
                  {transaction.metadata.country}
                </p>
              </div>
              {transaction.metadata?.product_name && (
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-500">
                    Product
                  </label>
                  <p className="text-sm text-gray-900">
                    {transaction.metadata.product_name}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={exportTransaction}
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" />
            Export Details
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-fit py-4">
          <DrawerHeader>
            <DrawerTitle>Transaction Details</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
