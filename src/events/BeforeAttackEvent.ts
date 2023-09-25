import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import AbilityName from "../types/AbilityName";
import AttackTag from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface BeforeAttackDetail {
  who: Combatant;
  target: Combatant;
  ability: AbilityName;
  weapon?: WeaponItem;
  ammo?: AmmoItem;
  spell?: Spell;
  method?: SpellcastingMethod;
  tags: Set<AttackTag>;
  diceType: DiceTypeCollector;
  bonus: BonusCollector;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class BeforeAttackEvent extends CustomEvent<BeforeAttackDetail> {
  constructor(detail: BeforeAttackDetail) {
    super("BeforeAttack", { detail });
  }
}
