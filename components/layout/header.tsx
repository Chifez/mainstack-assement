'use client';

import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { fetchUser } from '@/lib/api';
import { User } from '@/lib/types';

export function Header() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  return (
    <header className="sticky top-2 z-50  border-b bg-white w-[98%] mx-auto rounded-full shadow">
      <div className="flex justify-between h-16 items-center px-4 md:px-6">
        <div className="w-full flex items-center gap-2 font-bold text-xl ">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.77 21.59H14.71V28.53H7.77V21.59Z" fill="black" />
            <path d="M7.77 7.77H14.71V14.71H7.77V7.77Z" fill="black" />
            <path d="M21.59 7.77H28.53V14.71H21.59V7.77Z" fill="black" />
            <path d="M21.59 21.59H28.53V28.53H21.59V21.59Z" fill="black" />
          </svg>
        </div>
        <nav className="mx-auto flex items-center gap-8 flex-1 ">
          <Link
            href="#"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-4 py-2',
              'text-gray-500'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8333 6.5498L9.41667 2.13314C8.89903 1.61551 8.19444 1.3335 7.45833 1.3335H3.5C2.67157 1.3335 2 2.00507 2 2.8335V12.8335C2 13.6619 2.67157 14.3335 3.5 14.3335H12.5C13.3284 14.3335 14 13.6619 14 12.8335V8.50814C14 7.77203 13.7179 7.06744 13.2003 6.5498H13.8333Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Home
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-4 py-2',
              'text-gray-500'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2.66675V13.3334H14V2.66675H2Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 6.66675H14"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66667 6.66675V13.3334"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Analytics
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-black/80 bg-black text-white px-4 py-2 rounded-full'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.16667 3.33325V12.6666M8.16667 3.33325L4.83333 6.66659M8.16667 3.33325L11.5 6.66659"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Revenue
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-4 py-2',
              'text-gray-500'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6667 14V12.6667C12.6667 11.9594 12.3857 11.2811 11.8856 10.781C11.3855 10.281 10.7072 10 10 10H6C5.29275 10 4.61448 10.281 4.11438 10.781C3.61428 11.2811 3.33333 11.9594 3.33333 12.6667V14M11.3333 4.66667C11.3333 6.13943 10.1394 7.33333 8.66667 7.33333C7.19391 7.33333 6 6.13943 6 4.66667C6 3.19391 7.19391 2 8.66667 2C10.1394 2 11.3333 3.19391 11.3333 4.66667Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            CRM
          </Link>
          <Link
            href="#"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white hover:bg-black rounded-full px-4 py-2',
              'text-gray-500'
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2.66675H3.33333C2.96667 2.66675 2.66667 2.96675 2.66667 3.33341V6.00008C2.66667 6.36675 2.96667 6.66675 3.33333 6.66675H6C6.36667 6.66675 6.66667 6.36675 6.66667 6.00008V3.33341C6.66667 2.96675 6.36667 2.66675 6 2.66675Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 9.3335H3.33333C2.96667 9.3335 2.66667 9.6335 2.66667 10.0002V12.6668C2.66667 13.0335 2.96667 13.3335 3.33333 13.3335H6C6.36667 13.3335 6.66667 13.0335 6.66667 12.6668V10.0002C6.66667 9.6335 6.36667 9.3335 6 9.3335Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6667 2.66675H10C9.63333 2.66675 9.33333 2.96675 9.33333 3.33341V6.00008C9.33333 6.36675 9.63333 6.66675 10 6.66675H12.6667C13.0333 6.66675 13.3333 6.36675 13.3333 6.00008V3.33341C13.3333 2.96675 13.0333 2.66675 12.6667 2.66675Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.6667 9.3335H10C9.63333 9.3335 9.33333 9.6335 9.33333 10.0002V12.6668C9.33333 13.0335 9.63333 13.3335 10 13.3335H12.6667C13.0333 13.3335 13.3333 13.0335 13.3333 12.6668V10.0002C13.3333 9.6335 13.0333 9.3335 12.6667 9.3335Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Apps
          </Link>
        </nav>
        <div className="mr-auto flex items-center justify-end gap-4  w-full">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarFallback className="bg-gray-100 text-gray-800 text-xs">
                  {user?.first_name?.charAt(0)}
                  {user?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
