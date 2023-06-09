import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import AbilityName from "../types/AbilityName";
import { CheckTag } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import SkillName from "../types/SkillName";

export interface BeforeCheckDetail {
  who: Combatant;
  dc: number;
  target?: Combatant;
  ability: AbilityName;
  skill: SkillName;
  diceType: DiceTypeCollector;
  bonus: BonusCollector;
  successResponse: SuccessResponseCollector;
  tags: Set<CheckTag>;
}

export default class BeforeCheckEvent extends CustomEvent<BeforeCheckDetail> {
  constructor(detail: BeforeCheckDetail) {
    super("BeforeCheck", { detail });
  }
}
