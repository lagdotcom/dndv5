import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import MovementType from "../types/MovementType";
import Point from "../types/Point";

export interface CombatantMovedDetail {
  who: Combatant;
  old: Point;
  direction: MoveDirection;
  position: Point;
  type: MovementType;
  interrupt: InterruptionCollector;
}

export default class CombatantMovedEvent extends CustomEvent<CombatantMovedDetail> {
  constructor(detail: CombatantMovedDetail) {
    super("CombatantMoved", { detail });
  }
}
