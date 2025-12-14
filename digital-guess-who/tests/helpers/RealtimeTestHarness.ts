// digital-guess-who/tests/helpers/RealtimeTestHarness.ts

type RealtimeCallback = (payload: any) => void;

interface Subscription {
  event: string;
  schema?: string;
  table?: string;
  filter?: string;
  callback: RealtimeCallback;
}

export class RealtimeTestHarness {
  private subscribers: Subscription[] = [];

  // Method to register a subscription (mocks .on())
  subscribe(type: string, filter: any, callback: RealtimeCallback) {
    this.subscribers.push({
      event: filter.event,
      schema: filter.schema,
      table: filter.table,
      filter: filter.filter,
      callback
    });
  }

  // Simulate an incoming Realtime event (e.g., UPDATE on game_sessions)
  simulateUpdate(table: string, newRecord: any, oldRecord: any = {}) {
    this.subscribers.forEach(sub => {
      if (sub.event === 'UPDATE' && sub.table === table) {
        // Trigger the callback with the payload structure expected by Supabase
        sub.callback({
            new: newRecord,
            old: oldRecord,
            eventType: 'UPDATE',
            schema: 'public',
            table: table,
            commit_timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  clear() {
      this.subscribers = [];
  }
}
