import type React from 'react';
import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
});

const degular = localFont({
  variable: '--font-degular',
  src: '../public/font/DegularVariable.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Financial Ledger System - Enterprise Transaction Management',
    template: '%s | Financial Ledger System',
  },
  description:
    'Enterprise-grade financial ledger and wallet management system. Track, manage, and audit transactions with multi-currency support, real-time balance calculations, and comprehensive audit trails.',
  keywords: [
    'financial ledger',
    'transaction management',
    'wallet system',
    'multi-currency',
    'audit trail',
    'financial dashboard',
    'transaction tracking',
    'balance management',
  ],
  authors: [{ name: 'Mainstack' }],
  creator: 'Mainstack',
  publisher: 'Mainstack',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mainstack-assement.vercel.app',
    siteName: 'Financial Ledger System',
    title: 'Financial Ledger System - Enterprise Transaction Management',
    description:
      'Track, manage, and audit transactions with enterprise-grade reliability. Built for correctness, auditability, and resilience.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 620,
        alt: 'Financial Ledger System Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Ledger System - Enterprise Transaction Management',
    description:
      'Track, manage, and audit transactions with enterprise-grade reliability.',
    images: ['/twitter-image.png'],
  },
  metadataBase: new URL('https://mainstack-assement.vercel.app'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${degular.variable} ${inter.variable} ${dmSans.variable} font-degular antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
