import Ability from "./Ability";
import Combatant from "./Combatant";
import DamageType from "./DamageType";
import { WeaponItem } from "./Item";

export type AttackRoll = {
  type: "attack";
  who: Combatant;
  target: Combatant;
  weapon?: WeaponItem;
  ability: Ability;
};
export type DamageRoll = {
  type: "damage";
  attacker: Combatant;
  target: Combatant;
  size: number;
  damageType: DamageType;
  weapon?: WeaponItem;
  ability: Ability;
};
export type InitiativeRoll = { type: "initiative"; who: Combatant };

type RollType = AttackRoll | DamageRoll | InitiativeRoll;
export default RollType;
