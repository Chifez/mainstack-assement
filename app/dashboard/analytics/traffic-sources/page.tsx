import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Traffic Sources',
  description:
    'Analyze where your visitors come from. Track traffic sources and user acquisition channels.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrafficSourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Traffic Sources</h1>
      <p className="text-gray-600 font-degular">
        Analyze where your visitors come from
      </p>
    </div>
  );
}

