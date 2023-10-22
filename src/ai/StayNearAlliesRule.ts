import EvaluationCollector from "../collectors/EvaluationCollector";
import Engine from "../Engine";
import AIRule from "../types/AIRule";
import Combatant from "../types/Combatant";
import Point from "../types/Point";
import { getDistanceBetween } from "../utils/units";
import { StayNearAllies } from "./coefficients";

export default class StayNearAlliesRule implements AIRule {
  constructor(public range: number) {}

  evaluatePosition(
    g: Engine,
    me: Combatant,
    score: EvaluationCollector,
    position: Point,
  ) {
    const near = Array.from(g.combatants).filter(
      (them) =>
        them !== me &&
        them.side === me.side &&
        getDistanceBetween(
          position,
          me.sizeInUnits,
          them.position,
          them.sizeInUnits,
        ) <= this.range,
    );

    score.addEval(me, near.length, StayNearAllies);
  }
}
