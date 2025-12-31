import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revenue',
  description:
    'Track your revenue and financial performance. View detailed revenue analytics and transaction summaries.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Revenue</h1>
      <p className="text-gray-600 font-degular">
        Track your revenue and financial performance
      </p>
    </div>
  );
}

