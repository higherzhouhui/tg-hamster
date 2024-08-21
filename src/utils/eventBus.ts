type EventHandler = (data: any) => void;

class EventBus {
  private static instance: EventBus;
  private events: { [key: string]: EventHandler[] };

  private constructor() {
    this.events = {};
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public addListener(eventType: string, handler: EventHandler): void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(handler);
  }

  public emit(eventType: string, data: any): void {
    const handlers = this.events[eventType];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

export default EventBus;