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
import { TransactionFlow } from './transaction-flow';

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
  const [activeTab, setActiveTab] = useState<'details' | 'flow'>('details');

  if (!transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'reversed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type: string, category: string) => {
    if (type === 'debit' || category === 'withdrawal') {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Image
            src="/call_made.svg"
            height={16}
            width={16}
            alt="debit"
            priority
          />
        </div>
      );
    }
    if (type === 'reversal') {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Image
            src="/call_made.svg"
            height={16}
            width={16}
            alt="reversal"
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
          alt="credit"
          priority
        />
      </div>
    );
  };

  const copyReference = async () => {
    const ref = transaction.payment_reference || transaction.transaction_id;
    if (ref) {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportTransaction = () => {
    const data = {
      'Transaction ID': transaction.transaction_id,
      Date: formatDate(transaction.date || transaction.created_at),
      Type: transaction.type,
      Category: transaction.transaction_category,
      Amount: `${transaction.currency} ${transaction.amount}`,
      Status: transaction.status,
      Reference: transaction.payment_reference || transaction.transaction_id,
      Name: transaction.metadata?.name || 'N/A',
      Email: transaction.metadata?.email || 'N/A',
      Country: transaction.metadata?.country || 'N/A',
      Product: transaction.metadata?.product_name || 'N/A',
      Description: transaction.metadata?.description || 'N/A',
      Quantity: transaction.metadata?.quantity || 'N/A',
    };

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction-${transaction.transaction_id || 'detail'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const headerContent = (
    <div className="flex items-center gap-4 pb-4 border-b">
      {getTransactionIcon(transaction.type, transaction.transaction_category)}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">
          {transaction.transaction_category === 'withdrawal'
            ? 'Cash Withdrawal'
            : transaction.transaction_category === 'deposit'
            ? 'Deposit'
            : transaction.metadata?.product_name ||
              transaction.metadata?.description ||
              'Transaction'}
        </h3>
        <p className="text-2xl font-bold text-gray-900">
          {transaction.currency} {transaction.amount}
        </p>
        <Badge className={getStatusColor(transaction.status)}>
          {transaction.status.charAt(0).toUpperCase() +
            transaction.status.slice(1)}
        </Badge>
      </div>
    </div>
  );

  const scrollableContent = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      <div>
        <label className="text-sm font-medium text-gray-500">Type</label>
        <p className="text-sm text-gray-900 capitalize mt-1">
          {transaction.type}
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Category</label>
        <p className="text-sm text-gray-900 capitalize mt-1">
          {transaction.transaction_category.replace('_', ' ')}
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Currency</label>
        <p className="text-sm text-gray-900 mt-1">{transaction.currency}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">
          Transaction ID
        </label>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-gray-900 font-mono truncate">
            {transaction.transaction_id}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyReference}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      {transaction.payment_reference && (
        <div>
          <label className="text-sm font-medium text-gray-500">
            Payment Reference
          </label>
          <p className="text-sm text-gray-900 font-mono truncate mt-1">
            {transaction.payment_reference}
          </p>
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-gray-500">Date</label>
        <p className="text-sm text-gray-900 mt-1">
          {formatDate(transaction.date || transaction.created_at)}
        </p>
      </div>
      {transaction.metadata?.name && (
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-sm text-gray-900 mt-1">
            {transaction.metadata.name}
          </p>
        </div>
      )}
      {transaction.metadata?.email && (
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-sm text-gray-900 mt-1 truncate">
            {transaction.metadata.email}
          </p>
        </div>
      )}
      {transaction.metadata?.quantity && (
        <div>
          <label className="text-sm font-medium text-gray-500">Quantity</label>
          <p className="text-sm text-gray-900 mt-1">
            {transaction.metadata.quantity}
          </p>
        </div>
      )}
      {transaction.metadata?.country && (
        <div>
          <label className="text-sm font-medium text-gray-500">Country</label>
          <p className="text-sm text-gray-900 mt-1">
            {transaction.metadata.country}
          </p>
        </div>
      )}
      {transaction.metadata?.product_name && (
        <div>
          <label className="text-sm font-medium text-gray-500">Product</label>
          <p className="text-sm text-gray-900 mt-1">
            {transaction.metadata.product_name}
          </p>
        </div>
      )}
      {transaction.metadata?.description && (
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium text-gray-500">
            Description
          </label>
          <p className="text-sm text-gray-900 mt-1">
            {transaction.metadata.description}
          </p>
        </div>
      )}
    </div>
  );

  const actionButtons = (
    <div className="flex gap-3 border-t">
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
  );

  const content = (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      {headerContent}

      {/* Tab Switcher */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('flow')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'flow'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Flow
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === 'details' ? (
          scrollableContent
        ) : (
          <div className="py-4">
            <TransactionFlow transaction={transaction} />
          </div>
        )}
      </div>

      {/* Fixed Actions */}
      {actionButtons}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[85vh] flex flex-col">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle>Transaction Details</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 flex-1 flex flex-col min-h-0 overflow-hidden">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] lg:max-w-[600px] max-h-[70vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-0 overflow-hidden">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
}
