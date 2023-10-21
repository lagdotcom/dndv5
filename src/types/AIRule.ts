import BonusCollector from "../collectors/BonusCollector";
import Engine from "../Engine";
import Action from "./Action";
import Combatant from "./Combatant";

export type PositionConstraint = {
  type: "within";
  range: number;
  of: Combatant;
};

export interface AIEvaluation<T extends object = object> {
  action: Action<T>;
  config: T;
  score: BonusCollector;
  positioning: Set<PositionConstraint>;
}

export default interface AIRule {
  evaluate(g: Engine, me: Combatant, actions: Action[]): AIEvaluation[];
}
