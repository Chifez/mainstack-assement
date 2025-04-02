'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { type TransactionType } from '@/store/filter-store';

interface TransactionTypeFilterProps {
  selectedTypes: TransactionType[];
  onTypeChange: (type: TransactionType, checked: boolean) => void;
}

export function TransactionTypeFilter({
  selectedTypes,
  onTypeChange,
}: TransactionTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    if (selectedTypes.includes('all') && selectedTypes.length === 1) {
      return 'Store Transactions';
    }

    const typeNames = {
      all: 'Store Transactions',
      get_tipped: 'Get Tipped',
      withdrawals: 'Withdrawals',
      chargebacks: 'Chargebacks',
      cashbacks: 'Cashbacks',
      refer_earn: 'Refer & Earn',
    };

    const selectedTypeNames = selectedTypes.map(
      (type) => typeNames[type as keyof typeof typeNames]
    );

    if (selectedTypeNames.length > 1) {
      return `${selectedTypeNames.join(', ').substring(0, 20)}...`;
    }

    return selectedTypeNames[0] || 'Store Transactions';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Transaction Type</label>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="relative w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-muted/50"
          >
            <span className="text-sm font-normal">{getDisplayText()}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all z-50 absolute w-full mt-1 border rounded-lg p-2 bg-background">
          <div className="space-y-1">
            {[
              { id: 'type-store', label: 'Store Transactions', value: 'all' },
              { id: 'type-tipped', label: 'Get Tipped', value: 'get_tipped' },
              {
                id: 'type-withdrawals',
                label: 'Withdrawals',
                value: 'withdrawals',
              },
              {
                id: 'type-chargebacks',
                label: 'Chargebacks',
                value: 'chargebacks',
              },
              { id: 'type-cashbacks', label: 'Cashbacks', value: 'cashbacks' },
              { id: 'type-refer', label: 'Refer & Earn', value: 'refer_earn' },
            ].map(({ id, label, value }) => (
              <div key={id} className="flex items-center space-x-2 p-2">
                <Checkbox
                  id={id}
                  checked={selectedTypes.includes(value as TransactionType)}
                  onCheckedChange={(checked) =>
                    onTypeChange(value as TransactionType, checked as boolean)
                  }
                />
                <label htmlFor={id} className="text-sm">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
