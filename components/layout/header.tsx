'use client';

import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { fetchUser } from '@/lib/api';
import { User } from '@/lib/types';

export function Header() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

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
              'flex items-center justify-center gap-1.5 w-fit  text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
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
              'flex items-center justify-center gap-1.5 w-fit  text-sm font-medium transition-colors hover:text-black/80 bg-black text-white px-6 py-2 rounded-full'
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
              'flex items-center justify-center gap-1.5 w-fit  text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
              'text-gray-500'
            )}
          >
            <Image src="/crm.svg" alt="CRM Icon" width={16} height={16} />
            CRM
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center justify-center gap-1.5 w-fit  text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-6 py-2',
              'text-gray-500'
            )}
          >
            <Image src="/widgets.svg" alt="Apps Icon" width={16} height={16} />
            Apps
          </Link>
        </nav>
        <div className="mr-auto flex items-center justify-end gap-4 w-full">
          <button className="rounded-full p-2 hover:bg-gray-100">
            {/* <Bell className="h-5 w-5 text-gray-500" /> */}
            <Image
              src="/notifications.svg"
              alt="Apps Icon"
              width={16}
              height={16}
            />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            {/* <MessageSquare className="h-5 w-5 text-gray-500" /> */}
            <Image src="/chat.svg" alt="Apps Icon" width={20} height={20} />
          </button>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <div className="flex items-center justify-center w-fit gap-3 bg-[#EFF1F6] rounded-full p-1">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarFallback className="bg-gradient-to-b to-[#131316] from-[#5C6670] text-white font-semibold text-xs">
                    {user?.first_name?.charAt(0)}
                    {user?.last_name?.charAt(0)}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
