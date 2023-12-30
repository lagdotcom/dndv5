import EvaluationCollector from "../collectors/EvaluationCollector";
import Engine from "../Engine";
import Action from "./Action";
import Combatant from "./Combatant";
import Empty from "./Empty";
import Point from "./Point";

export interface PositionConstraint {
  type: "within";
  range: number;
  of: Combatant;
}

export interface ActionEvaluation<T extends object = Empty> {
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
