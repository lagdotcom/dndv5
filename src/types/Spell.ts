import Engine from "../Engine";
import ErrorCollector from "../collectors/ErrorCollector";
import { ActionConfig } from "./Action";
import ActionTime from "./ActionTime";
import Combatant from "./Combatant";
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

export default interface Spell<T extends object = object> extends Source {
  level: number;
  school: SpellSchool;
  concentration: boolean;
  time: ActionTime;
  v: boolean;
  s: boolean;
  m?: string; // TODO real costs

  apply(
    g: Engine,
    caster: Combatant,
    method: SpellcastingMethod,
    config: T
  ): Promise<void>;
  check(config: Partial<T>, collector?: ErrorCollector): ErrorCollector;
  getAffectedArea(config: Partial<T>): SpecifiedEffectShape | undefined;
  getConfig(g: Engine, method: SpellcastingMethod): ActionConfig<T>;
  getLevel(config: T): number;
}
