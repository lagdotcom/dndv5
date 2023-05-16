import EventData from "./EventData";
import EventType from "./EventType";

export default class EventBase<T extends EventType> extends CustomEvent<
  EventData[T]
> {
  constructor(name: T, detail: EventData[T]) {
    super(name, { detail });
  }
}
