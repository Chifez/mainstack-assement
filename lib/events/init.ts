/**
 * Initialize event system
 * This module should be imported early in the application lifecycle
 * to ensure event listeners are registered before transactions are processed
 */

import { initializeTransactionEventListeners } from './transaction-events';

let initialized = false;

/**
 * Initialize all event listeners
 * Safe to call multiple times (idempotent)
 */
export function initializeEvents(): void {
  if (initialized) {
    return;
  }

  initializeTransactionEventListeners();
  initialized = true;
}

// Auto-initialize when module is imported
initializeEvents();

