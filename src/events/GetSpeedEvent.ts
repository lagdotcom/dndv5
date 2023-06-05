import BonusCollector from "../collectors/BonusCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import Combatant from "../types/Combatant";

export interface GetSpeedDetail {
  who: Combatant;
  bonus: BonusCollector;
  multiplier: MultiplierCollector;
}

export default class GetSpeedEvent extends CustomEvent<GetSpeedDetail> {
  constructor(detail: GetSpeedDetail) {
    super("GetSpeed", { detail });
  }
}
