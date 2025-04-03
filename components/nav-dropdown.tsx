'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NavDropdownProps } from '@/lib/types';

export function NavDropdown({
  label,
  icon,
  activeIcon,
  isActive,
  items,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger asChild>
        <Link
          href="#"
          className={cn(
            'flex items-center justify-center gap-1.5 text-base font-semibold transition-colors rounded-full px-6 py-2',
            'text-gray-500 ',
            isOpen
              ? 'bg-black text-white hover:text-white hover:bg-black'
              : 'hover:text-black hover:bg-[#EFF1F6]'
          )}
          onClick={() => setIsOpen(isOpen)}
        >
          <Image
            src={isOpen ? activeIcon : icon}
            alt={`${label} Icon`}
            width={16}
            height={16}
          />
          {label}
          {/* {isOpen && (
            <span className="flex items-center gap-2 font-light text-sm">
              |
              <span className="flex items-center mr-2">
                {label}
                <ChevronUp
                  className={cn(
                    'h-4 w-4 ml-1 transition-transform',
                    isOpen && 'transform rotate-180'
                  )}
                />
              </span>
            </span>
          )} */}
        </Link>
      </PopoverTrigger>

      <PopoverContent
        className="w-fit px-2"
        align="start"
        sideOffset={25}
        alignOffset={0}
      >
        <div className="py-1 space-y-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'flex items-center justify-between w-full py-3 px-2 transition-all group hover:shadow-sm hover:border rounded-xl'
              )}
              // onMouseEnter={() => setHoveredItem(item.label)}
              // onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center gap-2 hover:gap-1">
                <div className="flex-shrink-0 mr-1 w-8 h-8 flex items-center justify-center rounded-md bg-white shadow">
                  <Image
                    src={item.icon || '/placeholder.svg'}
                    alt=""
                    width={20}
                    height={20}
                  />
                </div>
                <div className="">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-gray-500">
                    {item.description}
                  </div>
                </div>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 text-gray-400 transition-all duration-200 ease-in-out group-hover:opacity-100 group-hover:translate-x-0 opacity-0 -translate-x-2'
                )}
              />
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
