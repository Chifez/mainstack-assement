import { NavItem } from './types';

export const homeItems: NavItem[] = [
  {
    icon: '/product_one.svg',
    label: 'Dashboard',
    description: 'Overview of your account',
    href: '#',
  },
  {
    icon: '/product_one.svg',
    label: 'Activity',
    description: 'Your recent activities',
    href: '#',
  },
  {
    icon: '/product_two.svg',
    label: 'Links',
    description: 'Manage your links',
    href: '#',
  },
];

export const analyticsItems: NavItem[] = [
  {
    icon: '/product_one.svg',
    label: 'Performance',
    description: 'View your analytics data',
    href: '#',
  },
  {
    icon: '/product_two.svg',
    label: 'Audience',
    description: 'Understand your audience',
    href: '#',
  },
  {
    icon: '/product_three.svg',
    label: 'Traffic Sources',
    description: 'Where your visitors come from',
    href: '#',
  },
];

export const crmItems: NavItem[] = [
  {
    icon: '/product_one.svg',
    label: 'Contacts',
    description: 'Manage your contacts',
    href: '#',
  },
  {
    icon: '/product_two.svg',
    label: 'Leads',
    description: 'Track potential customers',
    href: '#',
  },
  {
    icon: '/product_three.svg',
    label: 'Emails',
    description: 'Email campaigns and templates',
    href: '#',
  },
];

export const appsItems: NavItem[] = [
  {
    icon: '/product_four.svg',
    label: 'App Store',
    description: 'Browse available applications',
    href: '#',
  },
  {
    icon: '/product_one.svg',
    label: 'Installed Apps',
    description: 'Manage your installed apps',
    href: '#',
  },
  {
    icon: '/product_three.svg',
    label: 'Integrations',
    description: 'Connect with other services',
    href: '#',
  },
];

export const user = {
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane.doe@example.com',
};

export const wallet = {
  balance: 3550,
  total_payout: 1180,
  total_revenue: 5000,
  pending_payout: 270,
  ledger_balance: 3550,
};

export const transactions = [
  {
    amount: 500,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF001',
    status: 'successful',
    type: 'deposit',
    date: '2024-01-01T10:00:00Z',
  },
  {
    amount: 200,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF002',
    status: 'successful',
    type: 'withdrawal',
    date: '2024-01-10T15:30:00Z',
  },
  {
    amount: 800,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      product_name: 'Online Course',
      quantity: 1,
      country: 'USA',
    },
    payment_reference: 'REF003',
    status: 'successful',
    type: 'deposit',
    date: '2024-01-25T09:15:00Z',
  },
  {
    amount: 150,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF004',
    status: 'pending',
    type: 'withdrawal',
    date: '2024-02-01T08:45:00Z',
  },
  {
    amount: 400,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF005',
    status: 'successful',
    type: 'deposit',
    date: '2024-02-15T12:00:00Z',
  },
  {
    amount: 100,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF006',
    status: 'successful',
    type: 'withdrawal',
    date: '2024-03-01T15:30:00Z',
  },
  {
    amount: 300,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      product_name: 'E-book',
      quantity: 2,
      country: 'USA',
    },
    payment_reference: 'REF007',
    status: 'successful',
    type: 'deposit',
    date: '2024-03-20T11:20:00Z',
  },
  {
    amount: 250,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF008',
    status: 'failed',
    type: 'withdrawal',
    date: '2024-03-28T13:45:00Z',
  },
  {
    amount: 600,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF009',
    status: 'successful',
    type: 'deposit',
    date: '2024-04-10T17:10:00Z',
  },
  {
    amount: 250,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF010',
    status: 'successful',
    type: 'withdrawal',
    date: '2024-04-22T19:00:00Z',
  },
  {
    amount: 450,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF011',
    status: 'successful',
    type: 'deposit',
    date: '2024-05-10T09:30:00Z',
  },
  {
    amount: 300,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF012',
    status: 'successful',
    type: 'withdrawal',
    date: '2024-05-25T14:10:00Z',
  },
  {
    amount: 700,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF013',
    status: 'successful',
    type: 'deposit',
    date: '2024-06-05T10:00:00Z',
  },
  {
    amount: 120,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF014',
    status: 'pending',
    type: 'withdrawal',
    date: '2024-06-18T16:00:00Z',
  },
  {
    amount: 500,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      product_name: 'Membership',
      quantity: 1,
      country: 'USA',
    },
    payment_reference: 'REF015',
    status: 'successful',
    type: 'deposit',
    date: '2024-07-01T10:10:00Z',
  },
  {
    amount: 200,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF016',
    status: 'failed',
    type: 'withdrawal',
    date: '2024-07-15T12:20:00Z',
  },
  {
    amount: 350,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF017',
    status: 'successful',
    type: 'deposit',
    date: '2024-08-01T14:00:00Z',
  },
  {
    amount: 180,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF018',
    status: 'successful',
    type: 'withdrawal',
    date: '2024-08-18T09:45:00Z',
  },
  {
    amount: 600,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'deposit',
      country: 'USA',
    },
    payment_reference: 'REF019',
    status: 'successful',
    type: 'deposit',
    date: '2024-09-01T11:30:00Z',
  },
  {
    amount: 100,
    metadata: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      type: 'withdrawal',
      country: 'USA',
    },
    payment_reference: 'REF020',
    status: 'successful',
    type: 'withdrawal',
    date: '2024-09-15T13:00:00Z',
  },
];
