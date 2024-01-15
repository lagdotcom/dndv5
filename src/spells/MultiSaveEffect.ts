import { HasCaster } from "../configs";
import Effect from "../Effect";
import Engine, { EngineSaveConfig } from "../Engine";
import { Turns } from "../flavours";
import Combatant from "../types/Combatant";
import ConditionName from "../types/ConditionName";
import { EffectConfig } from "../types/EffectType";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";
import { SetInitialiser } from "../utils/set";

export default class MultiSaveEffect<
  TEffect extends HasCaster,
  TSpell extends object,
> {
  affected: Set<Combatant>;
  conditions: Set<ConditionName>;

  constructor(
    public g: Engine,
    public caster: Combatant,
    public spell: Spell<TSpell>,
    public spellConfig: TSpell,
    public method: SpellcastingMethod,
    public effect: Effect<TEffect>,
    public duration: Turns,
    conditions: SetInitialiser<ConditionName>,
    public getSave: (
      target: Combatant,
      config: EffectConfig<TEffect>,
    ) => EngineSaveConfig<TEffect>,
  ) {
    this.affected = new Set();
    this.conditions = new Set(conditions);
  }

  async apply(
    extraConfig: Omit<
      TEffect,
      "affected" | "caster" | "conditions" | "duration" | "spell" | "method"
    >,
  ) {
    const {
      g,
      affected,
      caster,
      method,
      duration,
      conditions,
      effect,
      spell,
      spellConfig,
      getSave,
    } = this;

    const targets = spell.getAffected(g, caster, spellConfig);

    for (const target of targets) {
      const config = {
        affected,
        caster,
        method,
        duration,
        conditions,
        ...extraConfig,
      } as unknown as EffectConfig<TEffect>;

      const { outcome } = await g.save(getSave(target, config));
      if (outcome === "fail" && (await target.addEffect(effect, config)))
        affected.add(target);
    }

    return affected.size > 0;
  }

  async concentrate(callback?: (affected: Set<Combatant>) => Promise<void>) {
    const { caster, spell, duration, effect, affected } = this;

    await caster.concentrateOn({
      spell,
      duration,
      async onSpellEnd() {
        for (const target of affected) await target.removeEffect(effect);
        if (callback) await callback(affected);
      },
    });
  }
}
