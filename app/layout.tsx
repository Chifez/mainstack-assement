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
  title: 'Mainstack - Admin Dashboard',
  description: 'Mainstack Frontend Assessment',
  openGraph: {
    title: 'Mainstack - Admin Dashboard',
    description: 'Mainstack Admin Financial Dashboard Frontend Assessment',
    type: 'website',
    locale: 'en-US',
    url: 'https://mainstack-assesment.vercel.app',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 620,
        alt: 'Mainstack - Admin Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mainstack - Admin Dashboard',
    description: 'Mainstack Admin Financial Dashboard Frontend Assessment',
    images: ['/twitter-image.png'],
  },
  metadataBase: new URL('https://mainstack-assesment.vercel.app'),
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
