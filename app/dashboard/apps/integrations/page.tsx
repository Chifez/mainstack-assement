import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integrations',
  description:
    'Connect with other services and platforms. Integrate your financial ledger system with external tools and services.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Integrations</h1>
      <p className="text-gray-600 font-degular">
        Connect with other services and platforms
      </p>
    </div>
  );
}
