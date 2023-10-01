import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";

export interface TurnSkippedDetail {
  who: Combatant;
  interrupt: InterruptionCollector;
}

export default class TurnSkippedEvent extends CustomEvent<TurnSkippedDetail> {
  constructor(detail: TurnSkippedDetail) {
    super("TurnSkipped", { detail });
  }
}
