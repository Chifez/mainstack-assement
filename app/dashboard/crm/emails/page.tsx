import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Email Campaigns',
  description:
    'Manage your email campaigns and templates. Create and send email communications to your contacts.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmailsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-degular">Email Campaigns</h1>
      <p className="text-gray-600 font-degular">
        Manage your email campaigns and templates
      </p>
    </div>
  );
}

