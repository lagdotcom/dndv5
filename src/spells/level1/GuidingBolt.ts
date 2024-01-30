import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { notSelf } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import Priority from "../../types/Priority";
import { scalingSpell } from "../common";
import {
  aiTargetsOne,
  doesScalingDamage,
  isSpellAttack,
  targetsOne,
} from "../helpers";

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
            new EvaluateLater(target, GuidingBoltEffect, Priority.Normal, () =>
              target.removeEffect(GuidingBoltEffect),
            ),
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
  description: `A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,

  ...targetsOne(120, [notSelf]),
  ...isSpellAttack("ranged"),
  ...doesScalingDamage(1, 3, 6, "radiant"),
  generateAttackConfigs: aiTargetsOne(120),

  async apply(sh) {
    const { attack, critical, hit, target } = await sh.attack({
      target: sh.config.target,
      type: "ranged",
    });
    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        target,
        tags: ["ranged"],
      });
      await sh.damage({
        attack,
        critical,
        damageInitialiser,
        damageType: "radiant",
        target,
      });
      await target.addEffect(GuidingBoltEffect, { duration: 2 }, sh.caster);
    }
  },
});
export default GuidingBolt;
