import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity',
  description:
    'View your recent activities and transactions. Monitor all financial operations and system events.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Activity</h1>
      <p className="text-gray-600 font-degular">
        Your recent activities and transactions
      </p>
    </div>
  );
}

