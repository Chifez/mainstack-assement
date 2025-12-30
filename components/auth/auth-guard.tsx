'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AnimatedLogo } from '@/components/ui/animated-logo';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked) {
      checkAuth().finally(() => setHasChecked(true));
    }
  }, [checkAuth, hasChecked]);

  useEffect(() => {
    if (hasChecked && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasChecked, isLoading, isAuthenticated, router]);

  if (!hasChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AnimatedLogo size={60} className="mx-auto text-gray-900" />
          <p className="mt-4 text-gray-600 font-degular">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

