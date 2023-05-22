import EventBase from "./EventBase";
import EventData from "./EventData";

export default class AreaPlacedEvent extends EventBase<"areaPlaced"> {
  constructor(detail: EventData["areaPlaced"]) {
    super("areaPlaced", detail);
  }
}
