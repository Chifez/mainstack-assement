'use client';

import { useQuery } from '@tanstack/react-query';
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
import { fetchUser } from '@/lib/api';
import { User } from '@/lib/types';
import {
  Settings,
  ShoppingBag,
  Users,
  Grid,
  AlertCircle,
  RefreshCw,
  LogOut,
} from 'lucide-react';

export function Header() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

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
      icon: <AlertCircle className="h-4 w-4" />,
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
    <header className="sticky top-2 z-50 border-b bg-white w-[98%] mx-auto rounded-full shadow">
      <div className="flex justify-between h-16 items-center px-4 md:px-6">
        <div className="w-full flex items-center gap-2 font-bold text-xl">
          <Image
            src="/mainstack-logo.svg"
            alt="Mainstack Logo"
            width={36}
            height={36}
            priority
          />
        </div>
        <nav className="mx-auto flex items-center gap-6 flex-1">
          <Link
            href="#"
            className={cn(
              'flex items-center justify-center gap-1.5 w-fit text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
              'text-gray-500'
            )}
          >
            <Image
              src="/home.svg"
              alt="Home Icon"
              width={16}
              height={16}
              className="hover:fill-white"
            />
            Home
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center justify-center gap-1.5 w-fit text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
              'text-gray-500'
            )}
          >
            <Image
              src="/analytics.svg"
              alt="Analytics Icon"
              width={16}
              height={16}
            />
            Analytics
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center justify-center gap-1.5 w-fit text-sm font-medium transition-colors hover:text-black/80 bg-black text-white px-6 py-2 rounded-full'
            )}
          >
            <Image
              src="/revenue.svg"
              alt="Revenue Icon"
              width={16}
              height={16}
            />
            Revenue
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center justify-center gap-1.5 w-fit text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
              'text-gray-500'
            )}
          >
            <Image src="/crm.svg" alt="CRM Icon" width={16} height={16} />
            CRM
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center justify-center gap-1.5 w-fit text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
              'text-gray-500'
            )}
          >
            <Image src="/widgets.svg" alt="Apps Icon" width={16} height={16} />
            Apps
          </Link>
        </nav>
        <div className="mr-auto flex items-center justify-end gap-4 w-full">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Image
              src="/notifications.svg"
              alt="Notifications"
              width={16}
              height={16}
            />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Image src="/chat.svg" alt="Chat" width={20} height={20} />
          </button>

          {/* User Menu Popover */}
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <div className="flex items-center justify-center w-fit gap-3 bg-[#EFF1F6] rounded-full p-1">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-3 focus:outline-none">
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarFallback className="bg-gradient-to-b to-[#131316] from-[#5C6670] text-white font-semibold text-xs">
                        {user
                          ? user?.first_name?.charAt(0) +
                            user?.last_name?.charAt(0)
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
                </PopoverTrigger>
                <PopoverContent
                  sideOffset={20}
                  alignOffset={0}
                  className="w-64 p-0 mr-4"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-b to-[#131316] from-[#5C6670] text-white font-semibold">
                          {user?.first_name?.charAt(0)}
                          {user?.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user?.first_name} {user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
