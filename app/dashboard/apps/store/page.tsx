import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Store',
  description:
    'Browse available applications and integrations. Discover tools to enhance your financial ledger system.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppStorePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">App Store</h1>
      <p className="text-gray-600 font-degular">
        Browse available applications and integrations
      </p>
    </div>
  );
}

