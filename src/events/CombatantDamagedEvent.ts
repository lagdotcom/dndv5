import EventBase from "./EventBase";
import EventData from "./EventData";

export default class CombatantDamagedEvent extends EventBase<"combatantDamaged"> {
  constructor(detail: EventData["combatantDamaged"]) {
    super("combatantDamaged", detail);
  }
}
