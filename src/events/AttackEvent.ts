import EventBase from "./EventBase";
import EventData from "./EventData";

export default class AttackEvent extends EventBase<"attack"> {
  constructor(detail: EventData["attack"]) {
    super("attack", detail);
  }
}
