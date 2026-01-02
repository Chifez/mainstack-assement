// Network failure simulation is now handled by forcing transaction to fail during processing
// This function is kept for backward compatibility but is no longer used
export async function simulateNetworkFailure(): Promise<never> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay
  throw new Error('Network request failed. Please retry.');
}

export function shouldForceInsufficientFunds(simulate: boolean): boolean {
  return simulate;
}

export function shouldUseDuplicateIdempotencyKey(
  simulate: boolean
): string | null {
  if (simulate) {
    return 'DUPLICATE_SIMULATION_KEY';
  }
  return null;
}

