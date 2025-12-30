'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
        {/* Floating Shapes with Animations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large Circle - Animated */}
          <div
            className="absolute top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: '4s' }}
          />

          {/* Medium Circle - Animated */}
          <div
            className="absolute bottom-32 right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />

          {/* Small Circles */}
          <div
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '2s' }}
          />

          {/* Geometric Shapes - Rotating */}
          <div
            className="absolute top-1/2 left-1/4 w-40 h-40 border border-white/10 rotate-45 rounded-lg animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute bottom-1/3 right-1/3 w-28 h-28 border border-white/10 rotate-12 rounded-full animate-pulse"
            style={{ animationDuration: '7s', animationDelay: '1.5s' }}
          />

          {/* Additional floating elements */}
          <div
            className="absolute top-1/4 left-1/2 w-20 h-20 bg-white/3 rounded-full blur-md animate-pulse"
            style={{ animationDuration: '4s', animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-1/2 right-1/4 w-16 h-16 bg-white/3 rounded-full blur-md animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '2s' }}
          />

          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col justify-between h-full p-12">
          {/* Top Navigation */}
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image
                src="/mainstack-logo.svg"
                alt="Mainstack Logo"
                width={36}
                height={36}
                className="brightness-0 invert drop-shadow-lg"
                priority
              />
            </Link>
            <Link
              href="/about"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium font-degular"
            >
              Learn More
            </Link>
          </div>

          {/* Center - Logo and Branding */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="flex items-end gap-1 mb-4 transform transition-transform hover:scale-105">
              <h1 className="text-4xl font-bold text-white mb-2 font-degular tracking-tight">
                Mainstack
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-md font-degular leading-relaxed">
              A fintech ledger system for tracking money internally
            </p>
          </div>

          {/* Bottom - Copyright */}
          <div className="text-center">
            <p className="text-white/50 text-xs font-degular">
              All rights reserved Mainstack 2025
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Logo Bar */}
      <div className="lg:hidden bg-black py-6 px-4 flex items-center justify-center">
        <Image
          src="/mainstack-logo.svg"
          alt="Mainstack Logo"
          width={150}
          height={45}
          className="brightness-0 invert"
          priority
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold mb-4 font-degular">
              Financial Ledger System
            </h2>
            <p className="text-lg text-gray-600 mb-8 font-degular">
              A comprehensive fintech ledger system designed to model how real
              financial platforms track money internally. Built for correctness,
              auditability, and resilience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Immutable Transaction Ledger
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                All transactions are recorded immutably, ensuring complete
                traceability and audit compliance.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Multi-Currency Support
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Support for multiple currencies with proper decimal handling and
                currency-specific formatting.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Real-Time Balance Calculations
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Balances are derived from transaction history, ensuring accuracy
                and preventing discrepancies.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Audit Logging
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Comprehensive audit trails for all system actions, providing
                complete transparency and compliance.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Transaction Lifecycle Management
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Full support for transaction states: pending, processing,
                successful, failed, and reversals.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Idempotent Operations
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Built-in idempotency keys prevent duplicate transactions and
                ensure system reliability.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              asChild
              className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-6 text-base font-degular"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-8 py-6 text-base font-degular"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
