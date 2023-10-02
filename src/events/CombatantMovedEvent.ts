import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import MoveHandler from "../types/MoveHandler";
import MovementType from "../types/MovementType";
import Point from "../types/Point";

export interface CombatantMovedDetail {
  who: Combatant;
  old: Point;
  position: Point;
  handler: MoveHandler;
  type: MovementType;
  interrupt: InterruptionCollector;
}

export default class CombatantMovedEvent extends CustomEvent<CombatantMovedDetail> {
  constructor(detail: CombatantMovedDetail) {
    super("CombatantMoved", { detail });
  }
}
