import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import AbilityName from "../types/AbilityName";
import { CheckTag } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import SkillName from "../types/SkillName";

export interface BeforeCheckDetail {
  who: Combatant;
  target?: Combatant;
  ability: AbilityName;
  skill: SkillName;
  diceType: DiceTypeCollector;
  bonus: BonusCollector;
  tags: Set<CheckTag>;
}

export default class BeforeCheckEvent extends CustomEvent<BeforeCheckDetail> {
  constructor(detail: BeforeCheckDetail) {
    super("BeforeCheck", { detail });
  }
}
