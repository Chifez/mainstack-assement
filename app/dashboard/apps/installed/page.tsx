import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Installed Apps',
  description:
    'Manage your installed applications. View and configure apps integrated with your financial ledger system.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function InstalledAppsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Installed Apps</h1>
      <p className="text-gray-600 font-degular">
        Manage your installed applications
      </p>
    </div>
  );
}

