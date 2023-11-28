import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { isAlly } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { MundaneDamageTypes } from "../../types/DamageType";
import { sieve } from "../../utils/array";
import { hours } from "../../utils/time";
import { simpleSpell } from "../common";

const StoneskinEffect = new Effect(
  "Stoneskin",
  "turnStart",
  (g) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response, attack } }) => {
        if (
          who.hasEffect(StoneskinEffect) &&
          !attack?.pre.tags.has("magical") &&
          MundaneDamageTypes.includes(damageType)
        )
          response.add("resist", StoneskinEffect);
      },
    );
  },
  { tags: ["magic"] },
);

const Stoneskin = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Stoneskin",
  level: 4,
  school: "Abjuration",
  concentration: true,
  v: true,
  s: true,
  m: "diamond dust worth 100gp, which the spell consumes",
  lists: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"],
  description: `This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage.`,

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, [isAlly]),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    const duration = hours(1);
    await target.addEffect(StoneskinEffect, { duration }, caster);

    await caster.concentrateOn({
      spell: Stoneskin,
      duration,
      async onSpellEnd() {
        await target.removeEffect(StoneskinEffect);
      },
    });
  },
});
export default Stoneskin;
