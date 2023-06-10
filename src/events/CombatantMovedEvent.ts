import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import Point from "../types/Point";

export interface CombatantMovedDetail {
  who: Combatant;
  old: Point;
  position: Point;
  interrupt: InterruptionCollector;
}

export default class CombatantMovedEvent extends CustomEvent<CombatantMovedDetail> {
  constructor(detail: CombatantMovedDetail) {
    super("CombatantMoved", { detail });
  }
}
