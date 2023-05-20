import BonusCollector from "../collectors/BonusCollector";
import DamageResponseCollector from "../collectors/DamageResponseCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import DamageMap from "../DamageMap";
import Ability from "../types/Ability";
import ACMethod from "../types/ACMethod";
import Action from "../types/Action";
import Combatant from "../types/Combatant";
import DamageBreakdown from "../types/DamageBreakdown";
import DamageType from "../types/DamageType";
import { DiceType } from "../types/DiceType";
import { WeaponItem } from "../types/Item";
import Point from "../types/Point";
import RollType from "../types/RollType";

type EventData = {
  beforeAttack: {
    attacker: Combatant;
    target: Combatant;
    ability: Ability;
    weapon?: WeaponItem;
    diceType: DiceTypeCollector;
    bonus: BonusCollector;
  };
  combatantDamaged: {
    who: Combatant;
    attacker: Combatant;
    total: number;
    breakdown: Map<DamageType, DamageBreakdown>;
  };
  combatantDied: { who: Combatant; attacker: Combatant };
  combatantMoved: { who: Combatant; old: Point; position: Point };
  combatantPlaced: { who: Combatant; position: Point };
  diceRolled: {
    type: RollType;
    diceType: DiceType;
    size: number;
    value: number;
  };
  gatherDamage: {
    attacker: Combatant;
    target: Combatant;
    ability: Ability;
    weapon?: WeaponItem;
    map: DamageMap;
    bonus: BonusCollector;
  };
  getACMethods: { who: Combatant; methods: ACMethod[] };
  getActions: { who: Combatant; target: Combatant; actions: Action[] };
  getDamageResponse: {
    who: Combatant;
    damageType: DamageType;
    response: DamageResponseCollector;
  };
  turnStarted: { who: Combatant };
};
export default EventData;
