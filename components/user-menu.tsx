import {
  Bug,
  Grid,
  LogOut,
  RefreshCw,
  Settings,
  ShoppingBag,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ReactNode } from 'react';

export const UserMenu = ({
  user,
  isMobile,
  children,
}: {
  user: any;
  isMobile: boolean;
  children: ReactNode;
}) => {
  const menuItems = [
    { icon: <Settings className="h-4 w-4" />, label: 'Settings', href: '#' },
    {
      icon: <ShoppingBag className="h-4 w-4" />,
      label: 'Purchase History',
      href: '#',
    },
    { icon: <Users className="h-4 w-4" />, label: 'Refer and Earn', href: '#' },
    { icon: <Grid className="h-4 w-4" />, label: 'Integrations', href: '#' },
    {
      icon: <Bug className="h-4 w-4" />,
      label: 'Report Bug',
      href: '#',
    },
    {
      icon: <RefreshCw className="h-4 w-4" />,
      label: 'Switch Account',
      href: '#',
    },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent sideOffset={20} alignOffset={0} className="w-64 p-0 mr-4">
        {!isMobile && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-b to-[#131316] from-[#5C6670] text-white font-semibold">
                  {user
                    ? user?.first_name?.charAt(0) + user?.last_name?.charAt(0)
                    : 'MS'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {user ? user?.first_name + user?.last_name : 'Main stack'}
                </div>
                <div className="text-sm text-gray-500">
                  {user ? user?.email : 'mainstack@example.com'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="py-2">
          {menuItems.map((item: any, index: any) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
              <span className="text-gray-500">
                <LogOut className="h-4 w-4" />
              </span>
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
