import EventData from "./EventData";

type Detail = EventData["combatantMoved"];
export default class CombatantMovedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("combatantMoved", { detail });
  }
}
