import { useFilterStore } from '@/store/filter-store';
import { differenceInDays, isThisMonth } from 'date-fns';
import { formatDate } from '@/lib/utils';
import { Transaction } from '@/lib/types';

const useTransaction = ({ transactions }: { transactions: Transaction[] }) => {
  const {
    isFilterOpen,
    dateRange,
    transactionType,
    transactionStatus,
    setDateRange,
    setTransactionType,
    setTransactionStatus,
    setIsFilterOpen,
  } = useFilterStore();

  const activeFiltersCount = [
    dateRange.from || dateRange.to ? 1 : 0,
    transactionType.length > 0 && !transactionType.includes('all') ? 1 : 0,
    transactionStatus.length > 0 && !transactionStatus.includes('all') ? 1 : 0,
  ].reduce((acc, curr) => acc + curr, 0);

  const getFilterText = () => {
    if (!dateRange.from && !dateRange.to) {
      return 'Your transactions for All time';
    }

    if (dateRange.from && dateRange.to) {
      const days = differenceInDays(dateRange.to, dateRange.from);

      if (days === 7) {
        return 'Your transactions for the last 7 days';
      }

      if (days === 30) {
        return 'Your transactions for the last 30 days';
      }

      if (isThisMonth(dateRange.from) && isThisMonth(dateRange.to)) {
        return 'Your transactions for This month';
      }
      return `Your transactions from ${formatDate(
        dateRange.from.toString()
      )} to ${formatDate(dateRange.to.toString())}`;
    }
    if (dateRange.from) {
      return `Your transactions from ${formatDate(dateRange.from.toString())}`;
    }

    if (dateRange.to) {
      return `Your transactions until ${formatDate(dateRange.to.toString())}`;
    }

    return 'Your transactions for All time';
  };

  const filteredTransactions = transactions?.filter((transaction) => {
    // Date range filter
    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < dateRange.from || transactionDate > dateRange.to) {
        return false;
      }
    }

    // Transaction type filter
    if (transactionType.length > 0 && !transactionType.includes('all')) {
      if (!transactionType.includes(transaction?.type as any)) {
        return false;
      }
    }

    // Transaction status filter
    if (transactionStatus.length > 0 && !transactionStatus.includes('all')) {
      if (!transactionStatus.includes(transaction.status)) {
        return false;
      }
    }

    return true;
  });

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTransactionType(['all']);
    setTransactionStatus(['all']);
  };

  const handleExportList = () => {
    if (!filteredTransactions) return;

    // Create CSV content
    const headers = ['Date', 'Description', 'Name', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map((transaction) =>
        [
          formatDate(transaction.date),
          `"${(transaction.type === 'withdrawal'
            ? 'Cash Withdrawal'
            : transaction.metadata?.product_name || 'Unnamed Transaction'
          ).replace(/"/g, '""')}"`,
          `"${(transaction.type === 'withdrawal'
            ? transaction.status
            : transaction.metadata?.name || 'No name provided'
          ).replace(/"/g, '""')}"`,
          `USD ${transaction.amount}`,
          transaction.status,
        ].join(',')
      ),
    ].join('\n');

    // Add footer note
    const footerNote = '\n\nThank you for checking this out!';
    const finalContent = csvContent + footerNote;

    // Create and download the file
    const blob = new Blob([finalContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions-report.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    activeFiltersCount,
    getFilterText,
    filteredTransactions,
    handleClearFilters,
    handleExportList,
    isFilterOpen,
    setIsFilterOpen,
  };
};

export default useTransaction;
