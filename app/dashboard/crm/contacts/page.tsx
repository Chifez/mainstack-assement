import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacts',
  description:
    'Manage your contacts and customer information. Organize and track customer relationships.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Contacts</h1>
      <p className="text-gray-600 font-degular">
        Manage your contacts and customer information
      </p>
    </div>
  );
}

