import Header from '@/components/navbar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container lg:mt-5 lg:mx-auto py-6 px-4 lg:px-30">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}


