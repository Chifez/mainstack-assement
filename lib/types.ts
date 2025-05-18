export interface User {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Wallet {
  balance: number;
  total_payout: number;
  total_revenue: number;
  pending_payout: number;
  ledger_balance: number;
}

export interface Transaction {
  amount: number;
  metadata: {
    name: string;
    type: string;
    email: string;
    quantity?: number;
    country?: string;
    product_name?: string;
  };
  payment_reference?: string;
  status: 'successful' | 'pending' | 'failed';
  type: string;
  date: string;
}

export interface NavItem {
  icon: string;
  label: string;
  description: string;
  href: string;
}

export interface NavDropdownProps {
  label: string;
  icon: string;
  activeIcon: string;
  isActive: boolean;
  items: NavItem[];
  isMobile?: boolean;
}

export interface DailyTotal {
  date: string;
  formattedDate: string;
  total: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  total: number;
  date: string;
}

export interface ChartData {
  path: string;
  fillPath: string;
  points: ChartPoint[];
  firstDate: string;
  lastDate: string;
}

export interface BalanceChartProps {
  transactions: Transaction[];
}
