import EventBase from "./EventBase";
import EventData from "./EventData";

export default class AreaRemovedEvent extends EventBase<"areaRemoved"> {
  constructor(detail: EventData["areaRemoved"]) {
    super("areaRemoved", detail);
  }
}
