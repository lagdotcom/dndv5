import MultiplierCollector from "../collectors/MultiplierCollector";
import Combatant from "../types/Combatant";
import Point from "../types/Point";

export interface GetMoveCostDetail {
  who: Combatant;
  from: Point;
  to: Point;
  multiplier: MultiplierCollector;
}

export default class GetMoveCostEvent extends CustomEvent<GetMoveCostDetail> {
  constructor(detail: GetMoveCostDetail) {
    super("GetMoveCost", { detail });
  }
}
