/**
 * Event Emitter for transaction lifecycle events
 * Provides a simple event-driven architecture for decoupled event handling
 */

export type EventHandler<T = any> = (payload: T) => void | Promise<void>;

export interface EventMap {
  'transaction.created': {
    transaction: any;
    user_id: string;
  };
  'transaction.updated': {
    transaction: any;
    previous_status?: string;
    user_id: string;
  };
  'transaction.reversed': {
    transaction: any;
    reversal: any;
    user_id: string;
  };
  'transaction.failed': {
    transaction: any;
    error?: string;
    user_id: string;
  };
}

export class EventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Register an event handler
   */
  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  /**
   * Remove an event handler
   */
  off<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ): void {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit an event to all registered handlers
   * Handlers are executed asynchronously and errors are caught
   */
  async emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K]
  ): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers || handlers.length === 0) {
      return;
    }

    // Execute all handlers in parallel
    const promises = handlers.map(async (handler) => {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
        // Don't throw - allow other handlers to execute
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Remove all handlers for an event
   */
  removeAllListeners<K extends keyof EventMap>(event?: K): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof EventMap>(event: K): number {
    return this.handlers.get(event)?.length || 0;
  }
}

// Singleton instance
export const eventEmitter = new EventEmitter();

