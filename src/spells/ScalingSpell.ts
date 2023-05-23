import ErrorCollector from "../collectors/ErrorCollector";
import { Scales } from "../configs";
import SlotResolver from "../resolvers/SlotResolver";
import { ActionConfig } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Spell, { SpellSchool } from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default abstract class ScalingSpell<T extends object>
  implements Spell<T & Scales>
{
  config: ActionConfig<T & Scales>;
  v: boolean;
  s: boolean;
  m?: string;

  constructor(
    public name: string,
    public level: number,
    public school: SpellSchool,
    public time: ActionTime,
    public concentration: boolean,
    config: ActionConfig<T>
  ) {
    this.v = false;
    this.s = false;
    this.config = { ...config, slot: new SlotResolver(this) };
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
    config: T & Scales
  ): Promise<void>;

  getAffectedArea(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _config: Partial<T & Scales>
  ): SpecifiedEffectShape | undefined {
    return undefined;
  }

  check(config: Partial<T>, ec = new ErrorCollector()) {
    return ec;
  }

  getLevel({ slot }: T & Scales): number {
    return slot;
  }
}
