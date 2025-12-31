import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Performance Analytics',
  description:
    'View your analytics data and performance metrics. Analyze transaction trends and financial performance.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Performance Analytics</h1>
      <p className="text-gray-600 font-degular">
        View your analytics data and performance metrics
      </p>
    </div>
  );
}

