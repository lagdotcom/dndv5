import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import Combatant from "../types/Combatant";

export interface ExhaustionDetail {
  who: Combatant;
  old: number;
  delta: number;
  value: number;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class ExhaustionEvent extends CustomEvent<ExhaustionDetail> {
  constructor(detail: ExhaustionDetail) {
    super("Exhaustion", { detail });
  }
}
