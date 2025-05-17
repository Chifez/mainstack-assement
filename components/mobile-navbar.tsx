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
import { LogOut, Menu } from 'lucide-react';
import { homeItems, analyticsItems, crmItems, appsItems } from '@/lib/data';
import { NavDropdown } from './nav-dropdown';
import { UserMenu } from './user-menu';
import { NotificationPopover } from './notification-popover';
const Mobile = ({ user, menuItems, isMobile }: any) => {
  return (
    <div className="mr-auto flex items-center justify-end gap-6 w-full">
      <NotificationPopover>
        <button className="rounded-full p-2 hover:bg-gray-100 group">
          <Image
            src="/notifications.svg"
            alt="Notifications"
            width={20}
            height={20}
          />
        </button>
      </NotificationPopover>
      <div className="flex items-center justify-start w-fit gap-3 bg-[#EFF1F6] rounded-full p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Menu />
          </PopoverTrigger>
          <PopoverContent sideOffset={20} alignOffset={0} className="w-64 p-0">
            <div className="py-2">
              <NavDropdown
                label="Home"
                icon="/home.svg"
                activeIcon="/home-white.svg"
                isActive={false}
                items={homeItems}
                isMobile={isMobile}
              />

              <NavDropdown
                label="Analytics"
                icon="/analytics.svg"
                activeIcon="/analytics-white.svg"
                isActive={false}
                items={analyticsItems}
                isMobile={isMobile}
              />

              <Link
                href="#"
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors'
                )}
              >
                <Image
                  src="/revenue.svg"
                  alt="Revenue Icon"
                  width={12}
                  height={12}
                />
                <span className="text-sm">Revenue</span>
              </Link>

              <NavDropdown
                label="CRM"
                icon="/crm.svg"
                activeIcon="/crm-white.svg"
                isActive={false}
                items={crmItems}
                isMobile={isMobile}
              />

              <NavDropdown
                label="Apps"
                icon="/widgets.svg"
                activeIcon="/widgets-white.svg"
                isActive={false}
                items={appsItems}
                isMobile={isMobile}
              />

              <div className="border-t border-gray-100 mt-2 pt-2 cursor-pointer">
                <div className="flex items-center justify-center w-fit gap-3 rounded-full p-1">
                  <UserMenu user={user} isMobile={true}>
                    <div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-b to-[#131316] from-[#5C6670] text-white font-semibold">
                            {user
                              ? user?.first_name?.charAt(0) +
                                user?.last_name?.charAt(0)
                              : 'MS'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user
                              ? user?.first_name + user?.last_name
                              : 'Main stack'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user ? user?.email : 'mainstack@example.com'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </UserMenu>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
export default Mobile;
