'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { fetchUser } from '@/lib/api';

import {
  Settings,
  ShoppingBag,
  Users,
  Grid,
  AlertCircle,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/lib/types';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full h-8 w-8 border border-gray-200 bg-white"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-100 text-gray-800 text-xs">
            {user?.first_name?.charAt(0)}
            {user?.last_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg border border-gray-100 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-100 text-gray-800">
                  {user?.first_name?.charAt(0)}
                  {user?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-gray-500">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}

            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-gray-500">
                  <LogOut className="h-4 w-4" />
                </span>
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
