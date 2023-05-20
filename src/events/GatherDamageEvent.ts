import EventBase from "./EventBase";
import EventData from "./EventData";

export default class GatherDamageEvent extends EventBase<"gatherDamage"> {
  constructor(detail: EventData["gatherDamage"]) {
    super("gatherDamage", detail);
  }
}
