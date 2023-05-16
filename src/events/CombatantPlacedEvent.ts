import EventBase from "./EventBase";
import EventData from "./EventData";

export default class CombatantPlacedEvent extends EventBase<"combatantPlaced"> {
  constructor(detail: EventData["combatantPlaced"]) {
    super("combatantPlaced", detail);
  }
}
