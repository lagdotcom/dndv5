import Combatant from "../types/Combatant";

export interface TurnEndedDetail {
  who: Combatant;
}

export default class TurnEndedEvent extends CustomEvent<TurnEndedDetail> {
  constructor(detail: TurnEndedDetail) {
    super("TurnEnded", { detail });
  }
}
