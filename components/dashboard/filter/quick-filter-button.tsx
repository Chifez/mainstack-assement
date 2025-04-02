'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickFilterButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export function QuickFilterButton({
  label,
  onClick,
  isActive,
}: QuickFilterButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('rounded-full', isActive && 'bg-muted')}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
