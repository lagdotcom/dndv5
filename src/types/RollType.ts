import Effect from "../Effect";
import AbilityName from "./AbilityName";
import AttackTag from "./AttackTag";
import { CheckTag } from "./CheckTag";
import Combatant from "./Combatant";
import DamageType from "./DamageType";
import { EffectConfig } from "./EffectType";
import { AmmoItem, WeaponItem } from "./Item";
import SaveTag from "./SaveTag";
import SkillName from "./SkillName";
import Source from "./Source";
import Spell from "./Spell";
import SpellcastingMethod from "./SpellcastingMethod";

export interface AbilityCheck {
  type: "check";
  who: Combatant;
  attacker?: Combatant;
  ability: AbilityName;
  skill?: SkillName;
  tags: Set<CheckTag>;
}
export interface AttackRoll {
  type: "attack";
  who: Combatant;
  target: Combatant;
  weapon?: WeaponItem;
  ammo?: AmmoItem;
  ability?: AbilityName;
  spell?: Spell;
  method?: SpellcastingMethod;
  tags: Set<AttackTag>;
}
export interface BlessRoll {
  type: "bane" | "bless";
  who: Combatant;
}
export interface DamageRoll {
  type: "damage";
  source: Source;
  attacker?: Combatant;
  target?: Combatant;
  size: number;
  damageType?: DamageType;
  weapon?: WeaponItem;
  ability?: AbilityName;
  spell?: Spell;
  method?: SpellcastingMethod;
  tags: Set<AttackTag>;
}
export interface HealRoll {
  type: "heal";
  source: Source;
  actor: Combatant;
  target?: Combatant;
  size: number;
  spell?: Spell;
  method?: SpellcastingMethod;
}
export interface InitiativeRoll {
  type: "initiative";
  who: Combatant;
}
export interface LuckRoll {
  type: "luck";
  who: Combatant;
}
export interface OtherRoll {
  type: "other";
  source: Source;
  who: Combatant;
  size: number;
}
export interface SavingThrow<T = unknown> {
  type: "save";
  who: Combatant;
  attacker?: Combatant;
  ability?: AbilityName;
  spell?: Spell;
  method?: SpellcastingMethod;
  effect?: Effect<T>;
  config?: EffectConfig<T>;
  tags: Set<SaveTag>;
}

type RollType =
  | AbilityCheck
  | AttackRoll
  | BlessRoll
  | DamageRoll
  | HealRoll
  | InitiativeRoll
  | LuckRoll
  | OtherRoll
  | SavingThrow;
export default RollType;
