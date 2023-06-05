import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export interface BeforeAttackDetail {
  who: Combatant;
  target: Combatant;
  ability: AbilityName;
  type: "melee" | "ranged";
  weapon?: WeaponItem;
  ammo?: AmmoItem;
  spell?: Spell;
  method?: SpellcastingMethod;
  diceType: DiceTypeCollector;
  bonus: BonusCollector;
}

export default class BeforeAttackEvent extends CustomEvent<BeforeAttackDetail> {
  constructor(detail: BeforeAttackDetail) {
    super("BeforeAttack", { detail });
  }
}
