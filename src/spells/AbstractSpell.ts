import { ActionConfig } from "../types/Action";
import { ActionTime } from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Spell, { SpellSchool } from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default abstract class AbstractSpell<T extends object>
  implements Spell<T>
{
  v: boolean;
  s: boolean;
  m?: string;

  constructor(
    public name: string,
    public level: number,
    public school: SpellSchool,
    public time: ActionTime,
    public concentration: boolean,
    public config: ActionConfig<T>
  ) {
    this.v = false;
    this.s = false;
  }

  setVSM(v = false, s = false, m?: string) {
    this.v = v;
    this.s = s;
    this.m = m;
    return this;
  }

  abstract apply(
    caster: Combatant,
    method: SpellcastingMethod,
    config: T
  ): Promise<void>;
}
