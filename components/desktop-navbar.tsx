import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { homeItems, analyticsItems, crmItems, appsItems } from '@/lib/data';
import { NavDropdown } from './nav-dropdown';
import { UserMenu } from './user-menu';
import { NotificationPopover } from './notification-popover';
import { ChatPopover } from './chat-popover';

const Desktop = ({ user, menuItems, isLoading }: any) => {
  return (
    <>
      <nav className="mx-auto flex items-center gap-4 flex-1">
        <NavDropdown
          label="Home"
          icon="/home.svg"
          activeIcon="/home-white.svg"
          isActive={false}
          items={homeItems}
        />

        <NavDropdown
          label="Analytics"
          icon="/analytics.svg"
          activeIcon="/analytics-white.svg"
          isActive={false}
          items={analyticsItems}
        />

        <Link
          href="/dashboard/revenue"
          className={cn(
            'flex items-center justify-center gap-1.5 w-fit text-base font-semibold transition-colors bg-black text-white px-6 py-2 rounded-full'
          )}
        >
          <Image
            src="/revenue-white.svg"
            alt="Revenue Icon"
            width={16}
            height={16}
          />
          Revenue
        </Link>

        <NavDropdown
          label="CRM"
          icon="/crm.svg"
          activeIcon="/crm-white.svg"
          isActive={false}
          items={crmItems}
        />

        <NavDropdown
          label="Apps"
          icon="/widgets.svg"
          activeIcon="/widgets-white.svg"
          isActive={false}
          items={appsItems}
        />
      </nav>
      <div className="mr-auto flex items-center justify-end gap-6 w-full">
        <NotificationPopover>
          <button className="rounded-full px-2.5 py-2 hover:bg-gray-100 group">
            <Image
              src="/notifications.svg"
              alt="Notifications"
              width={16}
              height={16}
            />
          </button>
        </NotificationPopover>
        <ChatPopover>
          <button className="rounded-full p-2 hover:bg-gray-100 group">
            <Image src="/chat.svg" alt="Chat" width={20} height={20} />
          </button>
        </ChatPopover>

        {/* User Menu Popover */}
        {isLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <div className="flex items-center justify-center w-fit gap-3 bg-[#EFF1F6] rounded-full p-1">
            <UserMenu user={user} isMobile={false}>
              <button className="flex items-center gap-3 focus:outline-none">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarFallback className="bg-gradient-to-b to-[#131316] from-[#5C6670] text-white font-semibold text-xs">
                    {user
                      ? user?.first_name?.charAt(0) + user?.last_name?.charAt(0)
                      : 'MS'}
                  </AvatarFallback>
                </Avatar>
                <Image
                  src="/menu.svg"
                  height={20}
                  width={20}
                  priority
                  alt="menu"
                  className="pr-1"
                />
              </button>
            </UserMenu>
          </div>
        )}
      </div>
    </>
  );
};
export default Desktop;
