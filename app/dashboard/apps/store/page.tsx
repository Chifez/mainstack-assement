import Header from '@/components/navbar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function AppStorePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container lg:mt-5 lg:mx-auto py-6 px-4 lg:px-30">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-degular">App Store</h1>
            <p className="text-gray-600 font-degular">
              Browse available applications and integrations
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

