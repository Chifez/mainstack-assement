import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leads',
  description:
    'Track and manage potential customers. Monitor lead generation and conversion metrics.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Leads</h1>
      <p className="text-gray-600 font-degular">
        Track and manage potential customers
      </p>
    </div>
  );
}

