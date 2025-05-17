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
  Bug,
} from 'lucide-react';
import { homeItems, analyticsItems, crmItems, appsItems } from '@/lib/data';
import { NavDropdown } from './nav-dropdown';
import { useEffect, useState } from 'react';
import Desktop from './desktop-navbar';
import Mobile from './mobile-navbar';

function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 769);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
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
        {isMobile ? (
          <Mobile user={user} isMobile={isMobile} />
        ) : (
          <Desktop isLoading={isLoading} user={user} />
        )}
      </div>
    </header>
  );
}

export default Header;
