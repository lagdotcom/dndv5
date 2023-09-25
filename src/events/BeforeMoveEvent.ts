import ErrorCollector from "../collectors/ErrorCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import MoveHandler from "../types/MoveHandler";
import MovementType from "../types/MovementType";
import Point from "../types/Point";

export interface BeforeMoveDetail {
  who: Combatant;
  from: Point;
  direction: MoveDirection;
  to: Point;
  handler: MoveHandler;
  type: MovementType;
  error: ErrorCollector;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class BeforeMoveEvent extends CustomEvent<BeforeMoveDetail> {
  constructor(detail: BeforeMoveDetail) {
    super("BeforeMove", { detail });
  }
}
