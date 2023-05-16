import EventBase from "./EventBase";
import EventData from "./EventData";

export default class TurnStartedEvent extends EventBase<"turnStarted"> {
  constructor(detail: EventData["turnStarted"]) {
    super("turnStarted", detail);
  }
}
