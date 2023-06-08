import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { ActionConfig } from "./Action";
import ActionTime from "./ActionTime";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
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

export default interface Spell<T extends object = object> extends Source {
  status: ImplementationStatus;
  level: number;
  ritual: boolean;
  scaling: boolean;
  school: SpellSchool;
  concentration: boolean;
  time: ActionTime;
  v: boolean;
  s: boolean;
  m?: string; // TODO [MATERIALCOST]
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
    collector: ErrorCollector
  ): ErrorCollector;
  getAffectedArea(
    g: Engine,
    caster: Combatant,
    config: Partial<T>
  ): SpecifiedEffectShape[] | undefined;
  getConfig(
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
    config: Partial<T>
  ): ActionConfig<T>;
  getDamage(
    g: Engine,
    caster: Combatant,
    config: Partial<T>
  ): DamageAmount[] | undefined;
  getLevel(config: T): number;
}
