import ErrorCollector from "../collectors/ErrorCollector";
import Combatant from "../types/Combatant";

export interface CheckVisionDetail {
  who: Combatant;
  target: Combatant;
  error: ErrorCollector;
}

export default class CheckVisionEvent extends CustomEvent<CheckVisionDetail> {
  constructor(detail: CheckVisionDetail) {
    super("CheckVision", { detail });
  }
}
