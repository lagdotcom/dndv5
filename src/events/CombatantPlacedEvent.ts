import Combatant from "../types/Combatant";
import Point from "../types/Point";

export interface CombatantPlacedDetail {
  who: Combatant;
  position: Point;
}

export default class CombatantPlacedEvent extends CustomEvent<CombatantPlacedDetail> {
  constructor(detail: CombatantPlacedDetail) {
    super("CombatantPlaced", { detail });
  }
}
