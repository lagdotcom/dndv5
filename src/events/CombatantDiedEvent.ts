import EventData from "./EventData";

type Detail = EventData["combatantDied"];
export default class CombatantDiedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("combatantDied", { detail });
  }
}
