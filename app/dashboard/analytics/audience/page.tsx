import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audience Analytics',
  description:
    'Understand your audience demographics and behavior. Analyze user engagement and transaction patterns.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AudiencePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Audience Analytics</h1>
      <p className="text-gray-600 font-degular">
        Understand your audience demographics and behavior
      </p>
    </div>
  );
}
