import Header from '@/components/navbar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function TrafficSourcesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container lg:mt-5 lg:mx-auto py-6 px-4 lg:px-30">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold font-degular">Traffic Sources</h1>
            <p className="text-gray-600 font-degular">
              Analyze where your visitors come from
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

