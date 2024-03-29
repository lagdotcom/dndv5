import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import ProficiencyCollector from "../collectors/ProficiencyCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import { DifficultyClass } from "../flavours";
import AbilityName from "../types/AbilityName";
import { CheckTag } from "../types/CheckTag";
import Combatant from "../types/Combatant";
import SkillName from "../types/SkillName";
import ToolName from "../types/ToolName";

export interface BeforeCheckDetail {
  who: Combatant;
  dc: DifficultyClass;
  target?: Combatant;
  ability: AbilityName;
  skill?: SkillName;
  tool?: ToolName;
  diceType: DiceTypeCollector;
  proficiency: ProficiencyCollector;
  pb: BonusCollector;
  bonus: BonusCollector;
  successResponse: SuccessResponseCollector;
  tags: Set<CheckTag>;
  interrupt: InterruptionCollector;
}

export default class BeforeCheckEvent extends CustomEvent<BeforeCheckDetail> {
  constructor(detail: BeforeCheckDetail) {
    super("BeforeCheck", { detail });
  }
}
