import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import { Exhaustion } from "../flavours";
import Combatant from "../types/Combatant";

export interface ExhaustionDetail {
  who: Combatant;
  old: Exhaustion;
  delta: Exhaustion;
  value: Exhaustion;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class ExhaustionEvent extends CustomEvent<ExhaustionDetail> {
  constructor(detail: ExhaustionDetail) {
    super("Exhaustion", { detail });
  }
}
