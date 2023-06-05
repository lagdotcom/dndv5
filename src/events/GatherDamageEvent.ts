import BonusCollector from "../collectors/BonusCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import MultiplierCollector from "../collectors/MultiplierCollector";
import DamageMap from "../DamageMap";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { AttackEventDetail } from "./AttackEvent";

export interface GatherDamageDetail {
  attacker: Combatant;
  target: Combatant;
  ability?: AbilityName;
  weapon?: WeaponItem;
  ammo?: AmmoItem;
  spell?: Spell;
  method?: SpellcastingMethod;
  map: DamageMap;
  bonus: BonusCollector;
  critical: boolean;
  attack?: AttackEventDetail;
  interrupt: InterruptionCollector;
  multiplier: MultiplierCollector;
}

export default class GatherDamageEvent extends CustomEvent<GatherDamageDetail> {
  constructor(detail: GatherDamageDetail) {
    super("GatherDamage", { detail });
  }
}
