import { BalanceCard } from '@/components/dashboard/balance-card';
import { WalletInfo } from '@/components/dashboard/wallet-info';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { FilterModal } from '@/components/dashboard/filter-modal';
import { FloatingToolbar } from '@/components/dashboard/floating-toolbar';
import { SimulationPanel } from '@/components/dashboard/simulation-panel';

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-24">
        <div className="lg:col-span-4">
          <BalanceCard />
        </div>
        <div className="w-full lg:col-span-2">
          <WalletInfo />
        </div>
      </div>
      <div className="mt-18">
        <TransactionList />
      </div>
      <FilterModal />
      <FloatingToolbar />
      <SimulationPanel />
    </>
  );
}
