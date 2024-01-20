import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { isAlly } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { sieve } from "../../utils/array";
import { hours } from "../../utils/time";
import { simpleSpell } from "../common";

const BarkskinEffect = new Effect(
  "Barkskin",
  "turnEnd",
  (g) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who.hasEffect(BarkskinEffect))
        methods.push({ name: "Barkskin", uses: new Set(), ac: 16 });
    });
  },
  { tags: ["magic"] },
);

const Barkskin = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Barkskin",
  level: 2,
  school: "Transmutation",
  concentration: true,
  v: true,
  s: true,
  m: "a handful of oak bark",
  lists: ["Druid", "Ranger"],
  description: `You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.`,

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, [isAlly]),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply({ caster }, { target }) {
    const duration = hours(1);
    if (await target.addEffect(BarkskinEffect, { duration }, caster))
      caster.concentrateOn({
        spell: Barkskin,
        duration,
        onSpellEnd: () => target.removeEffect(BarkskinEffect),
      });
  },
});
export default Barkskin;
