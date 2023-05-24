import EventData from "./EventData";

type Detail = EventData["combatantDamaged"];
export default class CombatantDamagedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("combatantDamaged", { detail });
  }
}
