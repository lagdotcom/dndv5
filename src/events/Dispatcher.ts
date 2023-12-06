import EventType, { EventTypes } from "./EventType";

export type Listener<T extends EventType> = (e: EventTypes[T]) => void;

export type Unsubscribe = () => void;

type Tap = (cleanup: Unsubscribe) => void;

export default class Dispatcher {
  taps: Set<Tap>;

  constructor(
    public debug = false,
    private target = new EventTarget(),
  ) {
    this.taps = new Set();
  }

  tap(listener: Tap): Unsubscribe {
    this.taps.add(listener);
    return () => this.taps.delete(listener);
  }

  fire<T>(event: CustomEvent<T>) {
    if (this.debug) console.log("fire:", event);
    return this.target.dispatchEvent(event);
  }

  on<T extends EventType>(
    type: T,
    callback: Listener<T> | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): Unsubscribe {
    this.target.addEventListener(
      type,
      callback as EventListenerOrEventListenerObject | null,
      options,
    );

    const cleanup = () => this.off(type, callback);
    for (const tap of this.taps) tap(cleanup);
    return cleanup;
  }

  off<T extends EventType>(
    type: T,
    callback: Listener<T> | null,
    options?: boolean | EventListenerOptions | undefined,
  ) {
    return this.target.removeEventListener(
      type,
      callback as EventListenerOrEventListenerObject | null,
      options,
    );
  }
}
