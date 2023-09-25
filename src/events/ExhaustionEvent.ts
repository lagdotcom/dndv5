import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";

export interface ExhaustionDetail {
  who: Combatant;
  old: number;
  delta: number;
  value: number;
  interrupt: InterruptionCollector;
}

export default class ExhaustionEvent extends CustomEvent<ExhaustionDetail> {
  constructor(detail: ExhaustionDetail) {
    super("Exhaustion", { detail });
  }
}
