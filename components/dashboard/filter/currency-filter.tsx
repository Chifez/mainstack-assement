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

interface CurrencyFilterProps {
  selectedCurrency: string | 'all';
  onCurrencyChange: (currency: string | 'all') => void;
}

const CURRENCIES = [
  { id: 'currency-all', label: 'All Currencies', value: 'all' },
  { id: 'currency-usd', label: 'USD', value: 'USD' },
  { id: 'currency-eur', label: 'EUR', value: 'EUR' },
  { id: 'currency-ngn', label: 'NGN', value: 'NGN' },
  { id: 'currency-gbp', label: 'GBP', value: 'GBP' },
];

export function CurrencyFilter({
  selectedCurrency,
  onCurrencyChange,
}: CurrencyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    if (selectedCurrency === 'all') {
      return 'All Currencies';
    }

    const currency = CURRENCIES.find((c) => c.value === selectedCurrency);
    return currency?.label || 'All Currencies';
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Currency</label>
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
        <CollapsibleContent className="transition-all z-50 absolute w-full lg:bottom-full border rounded-lg p-2 bg-background">
          <div className="space-y-1">
            {CURRENCIES.map(({ id, label, value }) => (
              <div key={id} className="flex items-center space-x-2 p-2">
                <Checkbox
                  id={id}
                  checked={selectedCurrency === value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onCurrencyChange(value);
                    }
                  }}
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
