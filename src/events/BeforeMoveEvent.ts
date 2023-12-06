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
  to: Point;
  cost: number;
  direction?: MoveDirection;
  handler: MoveHandler;
  type: MovementType;
  error: ErrorCollector;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
  simulation?: boolean;
}

export default class BeforeMoveEvent extends CustomEvent<BeforeMoveDetail> {
  constructor(detail: BeforeMoveDetail) {
    super("BeforeMove", { detail });
  }
}
