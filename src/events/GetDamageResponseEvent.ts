import EventBase from "./EventBase";
import EventData from "./EventData";

export default class GetDamageResponseEvent extends EventBase<"getDamageResponse"> {
  constructor(detail: EventData["getDamageResponse"]) {
    super("getDamageResponse", detail);
  }
}
