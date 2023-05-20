import EventType, { EventTypes } from "./EventType";

type EventListener<T extends EventType> = (e: EventTypes[T]) => void;

export default class Dispatcher {
  constructor(public debug = false, private target = new EventTarget()) {}

  fire<T>(event: CustomEvent<T>): boolean {
    if (this.debug) console.log("fire:", event);
    return this.target.dispatchEvent(event);
  }

  on<T extends EventType>(
    type: T,
    callback: EventListener<T> | null,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    return this.target.addEventListener(
      type,
      callback as EventListenerOrEventListenerObject | null,
      options
    );
  }

  off<T extends EventType>(
    type: T,
    callback: EventListener<T> | null,
    options?: boolean | EventListenerOptions | undefined
  ): void {
    return this.target.removeEventListener(
      type,
      callback as EventListenerOrEventListenerObject | null,
      options
    );
  }
}
