import Combatant from "./Combatant";
import DamageType from "./DamageType";

export type AttackRoll = { type: "attack"; who: Combatant; target: Combatant };
export type DamageRoll = {
  type: "damage";
  attacker: Combatant;
  target: Combatant;
  size: number;
  damage: DamageType;
};
export type InitiativeRoll = { type: "initiative"; who: Combatant };

type RollType = AttackRoll | DamageRoll | InitiativeRoll;
export default RollType;
