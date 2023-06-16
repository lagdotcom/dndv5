import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import SaveDamageResponseCollector from "../collectors/SaveDamageResponseCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import SaveTag from "../types/SaveTag";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface BeforeSaveDetail {
  attacker: Combatant;
  who: Combatant;
  dc: number;
  ability: AbilityName;
  diceType: DiceTypeCollector;
  bonus: BonusCollector;
  successResponse: SuccessResponseCollector;
  saveDamageResponse: SaveDamageResponseCollector;
  failDamageResponse: SaveDamageResponseCollector;
  spell?: Spell;
  method?: SpellcastingMethod;
  tags: Set<SaveTag>;
}

export default class BeforeSaveEvent extends CustomEvent<BeforeSaveDetail> {
  constructor(detail: BeforeSaveDetail) {
    super("BeforeSave", { detail });
  }
}
