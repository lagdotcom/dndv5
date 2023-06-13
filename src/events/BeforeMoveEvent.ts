import ErrorCollector from "../collectors/ErrorCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import MovementType from "../types/MovementType";
import Point from "../types/Point";

export interface BeforeMoveDetail {
  who: Combatant;
  from: Point;
  direction: MoveDirection;
  to: Point;
  type: MovementType;
  error: ErrorCollector;
  interrupt: InterruptionCollector;
}

export default class BeforeMoveEvent extends CustomEvent<BeforeMoveDetail> {
  constructor(detail: BeforeMoveDetail) {
    super("BeforeMove", { detail });
  }
}
