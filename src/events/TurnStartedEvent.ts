import Combatant from "../types/Combatant";

export interface TurnStartedDetail {
  who: Combatant;
}

export default class TurnStartedEvent extends CustomEvent<TurnStartedDetail> {
  constructor(detail: TurnStartedDetail) {
    super("TurnStarted", { detail });
  }
}
