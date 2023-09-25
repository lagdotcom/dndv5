import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import TargetResolver from "../../resolvers/TargetResolver";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import SpellAttack from "../SpellAttack";

const GuidingBoltEffect = new Effect("Guiding Bolt", "turnEnd", (g) => {
  g.events.on("BeforeAttack", ({ detail: { target, diceType, interrupt } }) => {
    if (target.hasEffect(GuidingBoltEffect)) {
      diceType.add("advantage", GuidingBoltEffect);
      interrupt.add(
        new EvaluateLater(target, GuidingBoltEffect, async () => {
          await target.removeEffect(GuidingBoltEffect);
        }),
      );
    }
  });
});

const GuidingBolt = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Guiding Bolt",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Cleric"],

  getConfig: (g) => ({ target: new TargetResolver(g, 120) }),
  getDamage: (_, caster, method, { slot }) => [
    _dd((slot ?? 1) + 3, 6, "radiant"),
  ],
  getTargets: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { slot, target }) {
    const rsa = new SpellAttack(g, attacker, GuidingBolt, method, "ranged", {
      slot,
      target,
    });

    if ((await rsa.attack(target)).hit) {
      const damage = await rsa.getDamage(target);
      await rsa.damage(target, damage);

      await target.addEffect(GuidingBoltEffect, { duration: 2 });
    }
  },
});
export default GuidingBolt;
