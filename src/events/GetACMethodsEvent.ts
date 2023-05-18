import EventBase from "./EventBase";
import EventData from "./EventData";

export default class GetACMethodsEvent extends EventBase<"getACMethods"> {
  constructor(detail: EventData["getACMethods"]) {
    super("getACMethods", detail);
  }
}
