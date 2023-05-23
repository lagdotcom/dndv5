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
import DiceType from "../types/DiceType";
import EffectArea from "../types/EffectArea";
import { AmmoItem, WeaponItem } from "../types/Item";
import Point from "../types/Point";
import RollType from "../types/RollType";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

type EventData = {
  areaPlaced: { area: EffectArea };
  areaRemoved: { area: EffectArea };
  attack: {
    pre: EventData["beforeAttack"];
    roll: EventData["diceRolled"];
    total: number;
    outcome: "critical" | "hit" | "miss";
  };
  beforeAttack: {
    attacker: Combatant;
    target: Combatant;
    ability: Ability;
    weapon?: WeaponItem;
    ammo?: AmmoItem;
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
    otherValue?: number;
  };
  gatherDamage: {
    attacker: Combatant;
    target: Combatant;
    ability: Ability;
    weapon?: WeaponItem;
    map: DamageMap;
    bonus: BonusCollector;
    critical: boolean;
  };
  getACMethods: { who: Combatant; methods: ACMethod[] };
  getActions: { who: Combatant; target?: Combatant; actions: Action[] };
  getDamageResponse: {
    who: Combatant;
    damageType: DamageType;
    response: DamageResponseCollector;
  };
  spellCast: {
    who: Combatant;
    spell: Spell;
    method: SpellcastingMethod;
    level: number;
  };
  turnStarted: { who: Combatant };
};
export default EventData;
