import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { Description, SpellSlot } from "../flavours";
import SpellHelper from "../spells/SpellHelper";
import { ActionConfig, ConfigWithPositioning } from "./Action";
import ActionTime from "./ActionTime";
import Amount from "./Amount";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
import Empty from "./Empty";
import Icon from "./Icon";
import ImplementationStatus from "./ImplementationStatus";
import Source from "./Source";
import SpellcastingMethod from "./SpellcastingMethod";

export const SpellSchools = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
] as const;
export type SpellSchool = (typeof SpellSchools)[number];

export const SpellLists = [
  "Artificer",
  "Bard",
  "Cleric",
  "Druid",
  "Paladin",
  "Ranger",
  "Sorcerer",
  "Warlock",
  "Wizard",
] as const;
export type SpellList = (typeof SpellLists)[number];

export default interface Spell<T extends object = Empty> extends Source {
  status: ImplementationStatus;
  level: SpellSlot;
  ritual: boolean;
  scaling: boolean;
  school: SpellSchool;
  concentration: boolean;
  time: ActionTime;
  v: boolean;
  s: boolean;
  m?: string; // TODO [MATERIALCOST]
  lists: SpellList[];
  icon?: Icon;
  description?: Description;
  isHarmful: boolean;

  apply(sh: SpellHelper<T>, config: T): Promise<void>;
  check(
    g: Engine,
    config: Partial<T>,
    collector: ErrorCollector,
  ): ErrorCollector;
  getAffectedArea(
    g: Engine,
    caster: Combatant,
    config: Partial<T>,
  ): SpecifiedEffectShape[] | undefined;
  getConfig(
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
    config: Partial<T>,
  ): ActionConfig<T>;
  getDamage(
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
    config: Partial<T>,
  ): DamageAmount[] | undefined;
  getHeal(
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
    config: Partial<T>,
  ): Amount[] | undefined;
  getLevel(config: T): SpellSlot;
  getTargets(g: Engine, caster: Combatant, config: Partial<T>): Combatant[];
  getAffected(g: Engine, caster: Combatant, config: T): Combatant[];

  generateAttackConfigs(config: {
    g: Engine;
    caster: Combatant;
    method: SpellcastingMethod;
    allTargets: Combatant[];
  }): ConfigWithPositioning<T>[];
  generateHealingConfigs(config: {
    g: Engine;
    caster: Combatant;
    method: SpellcastingMethod;
    allTargets: Combatant[];
  }): ConfigWithPositioning<T>[];
}
