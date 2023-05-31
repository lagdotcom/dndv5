import EventType, { EventTypes } from "./EventType";

export type EventListener<T extends EventType> = (e: EventTypes[T]) => void;

export type Unsubscribe = () => void;

export default class Dispatcher {
  constructor(public debug = false, private target = new EventTarget()) {}

  fire<T>(event: CustomEvent<T>) {
    if (this.debug) console.log("fire:", event);
    return this.target.dispatchEvent(event);
  }

  on<T extends EventType>(
    type: T,
    callback: EventListener<T> | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): Unsubscribe {
    this.target.addEventListener(
      type,
      callback as EventListenerOrEventListenerObject | null,
      options
    );

    return () => this.off(type, callback);
  }

  off<T extends EventType>(
    type: T,
    callback: EventListener<T> | null,
    options?: boolean | EventListenerOptions | undefined
  ) {
    return this.target.removeEventListener(
      type,
      callback as EventListenerOrEventListenerObject | null,
      options
    );
  }
}
