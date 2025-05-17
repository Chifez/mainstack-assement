import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

export function NotificationPopover({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={20} alignOffset={0} className="w-64 p-0">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No new notifications</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
