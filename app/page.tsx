import { Header } from '@/components/navbar';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { WalletInfo } from '@/components/dashboard/wallet-info';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { FilterModal } from '@/components/dashboard/filter-modal';
import { FloatingToolbar } from '@/components/dashboard/floating-toolbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mt-5 mx-auto py-6 px-30">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-24">
          <div className="lg:col-span-4">
            <BalanceCard />
          </div>
          <div className="lg:col-span-2">
            <WalletInfo />
          </div>
        </div>
        <div className="mt-18">
          <TransactionList />
        </div>
        <FilterModal />
        <FloatingToolbar />
      </main>
    </div>
  );
}
