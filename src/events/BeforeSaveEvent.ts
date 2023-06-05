import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import SaveTag from "../types/SaveTag";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface BeforeSaveDetail {
  attacker: Combatant;
  who: Combatant;
  ability: AbilityName;
  diceType: DiceTypeCollector;
  bonus: BonusCollector;
  spell?: Spell;
  method?: SpellcastingMethod;
  tags: Set<SaveTag>;
}

export default class BeforeSaveEvent extends CustomEvent<BeforeSaveDetail> {
  constructor(detail: BeforeSaveDetail) {
    super("BeforeSave", { detail });
  }
}
