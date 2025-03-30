import { Header } from '@/components/layout/header';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { WalletInfo } from '@/components/dashboard/wallet-info';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { FilterModal } from '@/components/dashboard/filter-modal';
import { FloatingToolbar } from '@/components/dashboard/floating-toolbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BalanceCard />
          </div>
          <div>
            <WalletInfo />
          </div>
        </div>
        <div className="mt-12">
          <TransactionList />
        </div>
        <FilterModal />
        <FloatingToolbar />
      </main>
    </div>
  );
}
