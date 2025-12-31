import { LoginForm } from '@/components/auth/login-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Sign in to your financial ledger account to manage transactions, view balances, and track your financial activity.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Login - Financial Ledger System',
    description: 'Sign in to your financial ledger account',
    url: 'https://mainstack-assement.vercel.app/login',
  },
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Let's handle your finances">
      <LoginForm />
    </AuthLayout>
  );
}
