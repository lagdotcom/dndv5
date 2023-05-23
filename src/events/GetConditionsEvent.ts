import EventBase from "./EventBase";
import EventData from "./EventData";

export default class GetConditionsEvent extends EventBase<"getConditions"> {
  constructor(detail: EventData["getConditions"]) {
    super("getConditions", detail);
  }
}
