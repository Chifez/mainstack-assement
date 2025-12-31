'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState, useEffect } from 'react';

export function LandingNavbar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 769);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isMobile) {
    return (
      <header className="sticky top-2 z-50 border-b bg-white w-[90%] mx-auto rounded-full shadow">
        <div className="flex justify-between h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image
              src="/mainstack-logo.svg"
              alt="Mainstack Logo"
              width={36}
              height={36}
              priority
            />
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full p-2 hover:bg-gray-100">
                <Menu className="h-6 w-6" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              sideOffset={20}
              alignOffset={0}
              className="w-64 p-0"
            >
              <div className="py-2">
                <button
                  onClick={() => scrollToSection('features')}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                >
                  How It Works
                </button>
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link href="/register" className="block px-4 py-2.5">
                    <Button className="w-full bg-black text-white hover:bg-black/90 rounded-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-2 z-50 border-b bg-white w-[80%] mx-auto rounded-full shadow">
      <div className="flex justify-between h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image
            src="/mainstack-logo.svg"
            alt="Mainstack Logo"
            width={36}
            height={36}
            priority
          />
        </Link>
        <nav className="mx-auto flex items-center gap-6 flex-1 justify-center">
          <button
            onClick={() => scrollToSection('features')}
            className="text-base font-semibold hover:text-gray-700 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-base font-semibold hover:text-gray-700 transition-colors"
          >
            How It Works
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-base font-semibold hover:text-gray-700 transition-colors"
          >
            Login
          </Link>
          <Button
            asChild
            className="bg-black text-white hover:bg-black/90 rounded-full px-6"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

