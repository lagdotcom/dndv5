import BonusCollector from "../collectors/BonusCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import { ArmorClass } from "../flavours";
import ACMethod from "../types/ACMethod";
import Combatant from "../types/Combatant";
import { BeforeAttackDetail } from "./BeforeAttackEvent";

export interface GetACDetail {
  who: Combatant;
  method: ACMethod;
  bonus: BonusCollector<ArmorClass>;
  interrupt: InterruptionCollector;
  pre?: BeforeAttackDetail;
}

export default class GetACEvent extends CustomEvent<GetACDetail> {
  constructor(detail: GetACDetail) {
    super("GetAC", { detail });
  }
}
