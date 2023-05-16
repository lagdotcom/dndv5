import EventBase from "./EventBase";
import EventData from "./EventData";

export default class GetActionsEvent extends EventBase<"getActions"> {
  constructor(detail: EventData["getActions"]) {
    super("getActions", detail);
  }
}
