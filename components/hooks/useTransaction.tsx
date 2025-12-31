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

  const { transactionCategory, currency } = useFilterStore();

  const activeFiltersCount = [
    dateRange.from || dateRange.to ? 1 : 0,
    transactionType.length > 0 && !transactionType.includes('all') ? 1 : 0,
    transactionCategory.length > 0 && !transactionCategory.includes('all')
      ? 1
      : 0,
    transactionStatus.length > 0 && !transactionStatus.includes('all') ? 1 : 0,
    currency && currency !== 'all' ? 1 : 0,
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

  // Transactions are already filtered by the API, but we can do client-side filtering if needed
  const filteredTransactions = transactions?.filter((transaction) => {
    // Use created_at if date is not available (backward compatibility)
    const transactionDate = new Date(
      transaction.date || transaction.created_at
    );

    // Date range filter (client-side fallback)
    if (dateRange.from && dateRange.to) {
      if (transactionDate < dateRange.from || transactionDate > dateRange.to) {
        return false;
      }
    }

    // Transaction type filter
    if (transactionType.length > 0 && !transactionType.includes('all')) {
      if (!transactionType.includes(transaction.type as any)) {
        return false;
      }
    }

    // Transaction category filter
    if (
      transactionCategory.length > 0 &&
      !transactionCategory.includes('all')
    ) {
      if (
        !transactionCategory.includes(transaction.transaction_category as any)
      ) {
        return false;
      }
    }

    // Transaction status filter
    if (transactionStatus.length > 0 && !transactionStatus.includes('all')) {
      if (!transactionStatus.includes(transaction.status as any)) {
        return false;
      }
    }

    // Currency filter
    if (currency && currency !== 'all') {
      if (transaction.currency !== currency) {
        return false;
      }
    }

    return true;
  });

  const { setTransactionCategory, setCurrency } = useFilterStore();

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTransactionType(['all']);
    setTransactionCategory(['all']);
    setTransactionStatus(['all']);
    setCurrency('all');
  };

  const handleExportList = () => {
    if (!filteredTransactions) return;

    // Create CSV content
    const headers = [
      'Transaction ID',
      'Date',
      'Type',
      'Category',
      'Amount',
      'Currency',
      'Status',
      'Description',
      'Reference',
    ];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map((transaction) =>
        [
          transaction.transaction_id,
          formatDate(transaction.date || transaction.created_at),
          transaction.type,
          transaction.transaction_category,
          transaction.amount,
          transaction.currency,
          transaction.status,
          `"${(
            transaction.metadata?.description ||
            transaction.metadata?.product_name ||
            'Unnamed Transaction'
          ).replace(/"/g, '""')}"`,
          transaction.payment_reference || transaction.transaction_id,
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
