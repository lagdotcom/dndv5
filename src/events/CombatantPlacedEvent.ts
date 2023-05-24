import EventData from "./EventData";

type Detail = EventData["combatantPlaced"];
export default class CombatantPlacedEvent extends CustomEvent<Detail> {
  constructor(detail: Detail) {
    super("combatantPlaced", { detail });
  }
}
