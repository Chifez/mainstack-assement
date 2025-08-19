// export async function fetchUser() {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch user data');
//   }
//   return response.json();
// }

import { TraceState } from 'next/dist/trace';
import { transactions, user, wallet } from './data';
import { delay } from './helpers';
import { Transaction } from './types';

// export async function fetchWallet() {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wallet`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch wallet data');
//   }
//   return response.json();
// }

// export async function fetchTransactions() {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`
//     );
//     if (!response.ok) {
//       throw new Error('Failed to fetch transactions');
//     }

//     const data = await response.json();

//     console.log('data', data);
//     // Ensure each transaction has at least an empty metadata object
//     return data.map((transaction: any) => ({
//       ...transaction,
//       metadata: transaction.metadata || {},
//       // Ensure required fields have default values
//       status: transaction.status || 'pending',
//       type: transaction.type || 'unknown',
//       date: transaction.date || new Date().toISOString(),
//       amount: transaction.amount || 0,
//     }));
//   } catch (error) {
//     console.error('Error fetching transactions:', error);
//     return [];
//   }
// }

export async function fetchUser() {
  await delay(Math.floor(Math.random() * 500) + 300);
  try {
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchWallet() {
  await delay(Math.floor(Math.random() * 500) + 300);
  try {
    return JSON.parse(JSON.stringify(wallet));
  } catch (error) {
    console.log('error', error);
  }
}

export async function fetchTransactions() {
  await delay(Math.floor(Math.random() * 500) + 300);
  try {
    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.log('error', error);
  }
}

interface WithdrawalRequest {
  amount: number;
  vatAmount: number;
  totalAmount: number;
}

export async function handleWithdrawal({
  amount,
  vatAmount,
  totalAmount,
}: WithdrawalRequest) {
  await delay(Math.floor(Math.random() * 500) + 300); // Simulate API delay

  try {
    // Validate withdrawal amount
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than 0');
    }

    if (totalAmount > wallet.balance) {
      throw new Error('Insufficient balance for withdrawal');
    }

    // Create new withdrawal transaction
    const newTransaction: Transaction = {
      type: 'withdrawal',
      amount: amount,
      status: 'pending',
      date: new Date().toISOString(),
      metadata: {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        type: 'withdrawal',
      },
      payment_reference: `REF${Date.now()}`,
    };

    // Update wallet balance and pending payout
    wallet.balance = wallet.balance - totalAmount;
    wallet.pending_payout = wallet.pending_payout + totalAmount;
    wallet.ledger_balance = wallet.ledger_balance - totalAmount;

    // Add new transaction to transactions array
    transactions.unshift(newTransaction as any); // Add to beginning of array

    // Return the updated data
    return {
      transaction: newTransaction,
      newBalance: wallet.balance,
      newPendingPayout: wallet.pending_payout,
      newLedgerBalance: wallet.ledger_balance,
      success: true,
    };
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    throw error;
  }
}

// Optional: Add a function to get withdrawal history
export async function getWithdrawalHistory() {
  await delay(Math.floor(Math.random() * 500) + 300);
  try {
    return transactions.filter((t) => t.type === 'withdrawal');
  } catch (error) {
    console.error('Error fetching withdrawal history:', error);
    return [];
  }
}
