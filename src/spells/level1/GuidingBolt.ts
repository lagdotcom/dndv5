import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { notSelf } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import SpellAttack from "../SpellAttack";

const GuidingBoltEffect = new Effect(
  "Guiding Bolt",
  "turnEnd",
  (g) => {
    g.events.on(
      "BeforeAttack",
      ({ detail: { target, diceType, interrupt } }) => {
        if (target.hasEffect(GuidingBoltEffect)) {
          diceType.add("advantage", GuidingBoltEffect);
          interrupt.add(
            new EvaluateLater(target, GuidingBoltEffect, async () => {
              await target.removeEffect(GuidingBoltEffect);
            }),
          );
        }
      },
    );
  },
  { tags: ["magic"] },
);

const GuidingBolt = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Guiding Bolt",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Cleric"],
  isHarmful: true,
  description: `A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,

  generateAttackConfigs: (slot, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(120, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 120, [notSelf]) }),
  getDamage: (g, caster, method, { slot }) => [
    _dd((slot ?? 1) + 3, 6, "radiant"),
  ],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { slot, target }) {
    const rsa = new SpellAttack(g, attacker, GuidingBolt, method, "ranged", {
      slot,
      target,
    });

    const { hit, attack } = await rsa.attack(target);
    if (hit) {
      const damage = await rsa.getDamage(attack.pre.target);
      await rsa.damage(attack.pre.target, damage);

      await attack.pre.target.addEffect(
        GuidingBoltEffect,
        { duration: 2 },
        attacker,
      );
    }
  },
});
export default GuidingBolt;
