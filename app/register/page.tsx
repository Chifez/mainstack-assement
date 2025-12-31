import { RegisterForm } from '@/components/auth/register-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description:
    'Create a new account to start managing your financial transactions with our enterprise-grade ledger system. Get started with multi-currency wallet support.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Register - Financial Ledger System',
    description:
      'Create a new account to start managing your financial transactions',
    url: 'https://mainstack-assement.vercel.app/register',
  },
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Get Started" subtitle="Let's handle your finances">
      <RegisterForm />
    </AuthLayout>
  );
}
