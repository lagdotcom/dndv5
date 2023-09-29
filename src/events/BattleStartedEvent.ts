import InterruptionCollector from "../collectors/InterruptionCollector";

export interface BattleStartedDetail {
  interrupt: InterruptionCollector;
}

export default class BattleStartedEvent extends CustomEvent<BattleStartedDetail> {
  constructor(detail: BattleStartedDetail) {
    super("BattleStarted", { detail });
  }
}
