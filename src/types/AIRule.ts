import EvaluationCollector from "../collectors/EvaluationCollector";
import Engine from "../Engine";
import Action from "./Action";
import Combatant from "./Combatant";
import Point from "./Point";

export type PositionConstraint = {
  type: "within";
  range: number;
  of: Combatant;
};

export interface ActionEvaluation<T extends object = object> {
  action: Action<T>;
  config: T;
  score: EvaluationCollector;
  positioning: Set<PositionConstraint>;
}

export default interface AIRule {
  evaluateActions?: (
    g: Engine,
    me: Combatant,
    actions: Action[],
  ) => ActionEvaluation[];
  evaluatePosition?: (
    g: Engine,
    me: Combatant,
    score: EvaluationCollector,
    position: Point,
  ) => void;
}
