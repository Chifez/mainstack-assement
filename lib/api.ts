export async function fetchUser() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

export async function fetchWallet() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wallet`);
  if (!response.ok) {
    throw new Error('Failed to fetch wallet data');
  }
  return response.json();
}

export async function fetchTransactions() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();

    console.log('data', data);
    // Ensure each transaction has at least an empty metadata object
    return data.map((transaction: any) => ({
      ...transaction,
      metadata: transaction.metadata || {},
      // Ensure required fields have default values
      status: transaction.status || 'pending',
      type: transaction.type || 'unknown',
      date: transaction.date || new Date().toISOString(),
      amount: transaction.amount || 0,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
