import DifficultTerrainCollector from "../collectors/DifficultTerrainCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import PointSet from "../PointSet";
import Combatant from "../types/Combatant";
import MoveHandler from "../types/MoveHandler";
import MovementType from "../types/MovementType";
import Point from "../types/Point";

export interface GetMoveCostDetail {
  who: Combatant;
  from: Point;
  to: Point;
  squares: PointSet;
  handler: MoveHandler;
  type: MovementType;
  multiplier: MultiplierCollector;
  difficult: DifficultTerrainCollector;
}

export default class GetMoveCostEvent extends CustomEvent<GetMoveCostDetail> {
  constructor(detail: GetMoveCostDetail) {
    super("GetMoveCost", { detail });
  }
}
