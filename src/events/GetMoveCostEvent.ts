import MultiplierCollector from "../collectors/MultiplierCollector";
import Combatant from "../types/Combatant";
import MoveDirection from "../types/MoveDirection";
import MovementType from "../types/MovementType";
import Point from "../types/Point";

export interface GetMoveCostDetail {
  who: Combatant;
  from: Point;
  direction: MoveDirection;
  to: Point;
  type: MovementType;
  multiplier: MultiplierCollector;
}

export default class GetMoveCostEvent extends CustomEvent<GetMoveCostDetail> {
  constructor(detail: GetMoveCostDetail) {
    super("GetMoveCost", { detail });
  }
}
