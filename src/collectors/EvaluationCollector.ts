import AICoefficient from "../types/AICoefficient";
import Combatant from "../types/Combatant";
import BonusCollector from "./BonusCollector";

export default class EvaluationCollector extends BonusCollector {
  addEval(c: Combatant, value: number, co: AICoefficient) {
    this.add(value * c.getCoefficient(co), co);
  }

  copy() {
    return new EvaluationCollector(
      this.entries,
      this.ignoredSources,
      this.ignoredValues,
    );
  }
}
