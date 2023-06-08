import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";

export interface TurnStartedDetail {
  who: Combatant;
  interrupt: InterruptionCollector;
}

export default class TurnStartedEvent extends CustomEvent<TurnStartedDetail> {
  constructor(detail: TurnStartedDetail) {
    super("TurnStarted", { detail });
  }
}
