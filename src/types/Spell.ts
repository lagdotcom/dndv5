import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { ActionConfig } from "./Action";
import ActionTime from "./ActionTime";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
import Source from "./Source";
import SpellcastingMethod from "./SpellcastingMethod";

export const SpellSchools = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
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

export default interface Spell<T extends object = object> extends Source {
  level: number;
  scaling: boolean;
  school: SpellSchool;
  concentration: boolean;
  time: ActionTime;
  v: boolean;
  s: boolean;
  m?: string; // TODO real costs
  lists: SpellList[];

  apply(
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
    config: T
  ): Promise<void>;
  check(
    g: Engine,
    config: Partial<T>,
    collector?: ErrorCollector
  ): ErrorCollector;
  getAffectedArea(config: Partial<T>): SpecifiedEffectShape | undefined;
  getConfig(g: Engine, method: SpellcastingMethod): ActionConfig<T>;
  getDamage(
    g: Engine,
    caster: Combatant,
    config: Partial<T>
  ): DamageAmount[] | undefined;
  getLevel(config: T): number;
}
