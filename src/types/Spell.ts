import Engine from "../Engine";
import { ActionConfig } from "./Action";
import { ActionTime } from "./ActionTime";
import Combatant from "./Combatant";
import SpellcastingMethod from "./SpellcastingMethod";

export const SpellSchools = ["Conjuration", "Evocation"] as const;
export type SpellSchool = (typeof SpellSchools)[number];

interface Spell<T extends object = object> {
  config: ActionConfig<T>;
  level: number;
  name: string;
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
}
export default Spell;
