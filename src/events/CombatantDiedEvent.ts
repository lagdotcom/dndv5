import EventBase from "./EventBase";
import EventData from "./EventData";

export default class CombatantDiedEvent extends EventBase<"combatantDied"> {
  constructor(detail: EventData["combatantDied"]) {
    super("combatantDied", detail);
  }
}
