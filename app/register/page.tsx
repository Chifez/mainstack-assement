import { RegisterForm } from '@/components/auth/register-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function RegisterPage() {
  return (
    <AuthLayout title="Get Started" subtitle="Let's handle your finances">
      <RegisterForm />
    </AuthLayout>
  );
}
