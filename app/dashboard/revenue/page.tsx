import Header from '@/components/navbar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function RevenuePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container lg:mt-5 lg:mx-auto py-6 px-4 lg:px-30">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-degular">Revenue</h1>
            <p className="text-gray-600 font-degular">
              Track your revenue and financial performance
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

