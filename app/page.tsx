'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LandingNavbar } from '@/components/landing/landing-navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-degular leading-tight">
                Financial Ledger System
                <br />
                <span className="text-gray-600">Built for Scale</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-degular leading-relaxed">
                Track, manage, and audit transactions with enterprise-grade
                reliability. Built for correctness, auditability, and
                resilience.
              </p>
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
                  onClick={() => {
                    const element = document.getElementById('features');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <button>Learn More</button>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gray-100 rounded-lg p-8 shadow-lg">
                <div className="aspect-video bg-white rounded border-2 border-gray-200 flex items-center justify-center">
                  <p className="text-gray-400 font-degular">
                    Dashboard Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-degular">
              Everything you need to manage finances
            </h2>
            <p className="text-xl text-gray-600 font-degular">
              Powerful features designed for financial operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Immutable Transaction Ledger */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm font-degular">
                  Transaction List Screenshot
                </p>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Immutable Transaction Ledger
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                All transactions are recorded immutably, ensuring complete
                traceability and audit compliance.
              </p>
            </div>

            {/* Feature 2: Multi-Currency Support */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm font-degular">
                  Currency Selector Screenshot
                </p>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Multi-Currency Support
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Support for multiple currencies with proper decimal handling and
                currency-specific formatting.
              </p>
            </div>

            {/* Feature 3: Real-Time Balance Calculations */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm font-degular">
                  Balance Chart Screenshot
                </p>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Real-Time Balance Calculations
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Balances are derived from transaction history, ensuring accuracy
                and preventing discrepancies.
              </p>
            </div>

            {/* Feature 4: Audit Logging */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm font-degular">
                  Audit Log Screenshot
                </p>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Audit Logging
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Comprehensive audit trails for all system actions, providing
                complete transparency and compliance.
              </p>
            </div>

            {/* Feature 5: Transaction Lifecycle Management */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm font-degular">
                  Transaction Flow Screenshot
                </p>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Transaction Lifecycle Management
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Full support for transaction states: pending, processing,
                successful, failed, and reversals.
              </p>
            </div>

            {/* Feature 6: Idempotent Operations */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                <p className="text-gray-400 text-sm font-degular">
                  Transaction Creation Screenshot
                </p>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Idempotent Operations
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Built-in idempotency keys prevent duplicate transactions and
                ensure system reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-degular">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 font-degular">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-4">
                <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <p className="text-gray-400 text-sm font-degular">
                    Registration Screenshot
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Create Account
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Sign up with your email to get started. No credit card required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-4">
                <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <p className="text-gray-400 text-sm font-degular">
                    Wallet Setup Screenshot
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Set Up Wallet
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Your wallet is automatically created. Start with manual credits
                or connect payment methods.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-4">
                <div className="aspect-video bg-gray-100 rounded mb-4 flex items-center justify-center">
                  <p className="text-gray-400 text-sm font-degular">
                    Dashboard Screenshot
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 font-degular">
                Start Tracking
              </h3>
              <p className="text-gray-600 text-sm font-degular">
                Begin tracking transactions, view balances, and manage your
                financial operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-end gap-1 mb-2">
                <Image
                  src="/mainstack-logo.svg"
                  alt="Mainstack Logo"
                  width={40}
                  height={40}
                  className="brightness-0 invert mb-0.5"
                />
                <h1 className="text-4xl font-bold text-white font-degular tracking-tight">
                  mainstack
                </h1>
              </div>
              <p className="text-gray-400 text-sm font-degular">
                Financial ledger system built for scale and reliability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-degular">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-degular">
                <li>
                  <button
                    onClick={() => {
                      const element = document.getElementById('features');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.getElementById('how-it-works');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-degular">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-degular">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-degular">Account</h4>
              <ul className="space-y-2 text-sm text-gray-400 font-degular">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm font-degular">
              All rights reserved Mainstack 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
