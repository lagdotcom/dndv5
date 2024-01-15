import BonusCollector from "../collectors/BonusCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import { Feet } from "../flavours";
import Combatant from "../types/Combatant";

export interface GetSpeedDetail {
  who: Combatant;
  bonus: BonusCollector<Feet>;
  multiplier: MultiplierCollector;
}

export default class GetSpeedEvent extends CustomEvent<GetSpeedDetail> {
  constructor(detail: GetSpeedDetail) {
    super("GetSpeed", { detail });
  }
}
