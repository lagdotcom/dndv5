import BonusCollector from "../collectors/BonusCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import Combatant from "../types/Combatant";

export interface GetMaxHPDetail {
  who: Combatant;
  bonus: BonusCollector;
  multiplier: MultiplierCollector;
}

export default class GetMaxHPEvent extends CustomEvent<GetMaxHPDetail> {
  constructor(detail: GetMaxHPDetail) {
    super("GetMaxHP", { detail });
  }
}
