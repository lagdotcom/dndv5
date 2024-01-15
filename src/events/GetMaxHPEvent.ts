import BonusCollector from "../collectors/BonusCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import { HitPoints } from "../flavours";
import Combatant from "../types/Combatant";

export interface GetMaxHPDetail {
  who: Combatant;
  bonus: BonusCollector<HitPoints>;
  multiplier: MultiplierCollector;
}

export default class GetMaxHPEvent extends CustomEvent<GetMaxHPDetail> {
  constructor(detail: GetMaxHPDetail) {
    super("GetMaxHP", { detail });
  }
}
