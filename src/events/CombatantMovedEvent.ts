import EventBase from "./EventBase";
import EventData from "./EventData";

export default class CombatantMovedEvent extends EventBase<"combatantMoved"> {
  constructor(detail: EventData["combatantMoved"]) {
    super("combatantMoved", detail);
  }
}
