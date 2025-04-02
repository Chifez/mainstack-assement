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
import { type TransactionStatus } from '@/store/filter-store';

interface TransactionStatusFilterProps {
  selectedStatuses: TransactionStatus[];
  onStatusChange: (status: TransactionStatus, checked: boolean) => void;
}

export function TransactionStatusFilter({
  selectedStatuses,
  onStatusChange,
}: TransactionStatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    if (selectedStatuses.includes('all') && selectedStatuses.length === 1) {
      return 'Successful, Pending, Failed';
    }

    const statusNames = {
      successful: 'Successful',
      pending: 'Pending',
      failed: 'Failed',
    };

    return selectedStatuses
      .map((status) => statusNames[status as keyof typeof statusNames])
      .join(', ');
  };

  return (
    <div className="relative space-y-2">
      <label className="text-sm font-medium">Transaction Status</label>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-muted/50"
          >
            <span className="text-sm font-normal">{getDisplayText()}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="transition-all absolute w-full mt-1 border rounded-lg p-2 bg-background">
          <div className="space-y-1">
            {[
              {
                id: 'status-successful',
                label: 'Successful',
                value: 'successful',
              },
              { id: 'status-pending', label: 'Pending', value: 'pending' },
              { id: 'status-failed', label: 'Failed', value: 'failed' },
            ].map(({ id, label, value }) => (
              <div key={id} className="flex items-center space-x-2 p-2">
                <Checkbox
                  id={id}
                  checked={selectedStatuses.includes(
                    value as TransactionStatus
                  )}
                  onCheckedChange={(checked) =>
                    onStatusChange(
                      value as TransactionStatus,
                      checked as boolean
                    )
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
