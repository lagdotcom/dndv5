import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";

export interface TurnEndedDetail {
  who: Combatant;
  interrupt: InterruptionCollector;
}

export default class TurnEndedEvent extends CustomEvent<TurnEndedDetail> {
  constructor(detail: TurnEndedDetail) {
    super("TurnEnded", { detail });
  }
}
