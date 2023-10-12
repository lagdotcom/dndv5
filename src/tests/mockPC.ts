import AbilityScore from "../AbilityScore";
import Engine from "../Engine";
import PC from "../PC";
import ActionTime from "../types/ActionTime";
import CombatantScore from "../types/CombatantScore";
import EffectType from "../types/EffectType";

export default function mockPC(g: Engine) {
  const effects = new Map<EffectType<unknown>, unknown>();
  const resources = new Map<string, number>();
  const time = new Set<ActionTime>();

  return {
    g,

    str: new AbilityScore(10) as CombatantScore,
    dex: new AbilityScore(10) as CombatantScore,
    con: new AbilityScore(10) as CombatantScore,
    int: new AbilityScore(10) as CombatantScore,
    wis: new AbilityScore(10) as CombatantScore,
    cha: new AbilityScore(10) as CombatantScore,

    effects,
    conditions: new Set(),

    async addEffect(e, c) {
      effects.set(e, c);
      return true;
    },
    hasEffect(e) {
      return effects.has(e);
    },
    async removeEffect(e) {
      effects.delete(e);
      return true;
    },
    async tickEffects(t) {
      for (const [e, c] of this.effects) {
        if (e.durationTimer === t && --c.duration <= 0)
          await this.removeEffect(e);
      }
    },

    spendResource(r, amount = 1) {
      const old = resources.get(r.name) ?? 0;
      resources.set(r.name, old - amount);
    },

    useTime(t) {
      time.delete(t);
    },

    endConcentration() {},
  } as PC;
}
