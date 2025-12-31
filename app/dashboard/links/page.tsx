import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Links',
  description:
    'Manage your payment links and integrations. Create and configure payment links for your transactions.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LinksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Links</h1>
      <p className="text-gray-600 font-degular">
        Manage your payment links and integrations
      </p>
    </div>
  );
}

