import SaveTag from "../events/SaveTag";
import Ability from "./Ability";
import Combatant from "./Combatant";
import DamageType from "./DamageType";
import { WeaponItem } from "./Item";
import SkillName from "./SkillName";
import Spell from "./Spell";
import SpellcastingMethod from "./SpellcastingMethod";

export type AbilityCheck = {
  type: "check";
  who: Combatant;
  ability: Ability;
  skill: SkillName;
};
export type AttackRoll = {
  type: "attack";
  who: Combatant;
  target: Combatant;
  weapon?: WeaponItem;
  ability: Ability;
  spell?: Spell;
  method?: SpellcastingMethod;
};
export type BlessRoll = { type: "bane" | "bless"; who: Combatant };
export type DamageRoll = {
  type: "damage";
  attacker: Combatant;
  target?: Combatant;
  size: number;
  damageType?: DamageType;
  weapon?: WeaponItem;
  ability?: Ability;
  spell?: Spell;
  method?: SpellcastingMethod;
};
export type InitiativeRoll = { type: "initiative"; who: Combatant };
export type LuckRoll = { type: "luck"; who: Combatant };
export type SavingThrow = {
  type: "save";
  who: Combatant;
  attacker: Combatant;
  ability: Ability;
  spell?: Spell;
  method?: SpellcastingMethod;
  tags: Set<SaveTag>;
};

type RollType =
  | AbilityCheck
  | AttackRoll
  | BlessRoll
  | DamageRoll
  | InitiativeRoll
  | LuckRoll
  | SavingThrow;
export default RollType;
