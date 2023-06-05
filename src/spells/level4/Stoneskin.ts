import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { MundaneDamageTypes } from "../../types/DamageType";
import { hours } from "../../utils/time";
import { simpleSpell } from "../common";

const StoneskinEffect = new Effect("Stoneskin", "turnStart", (g) => {
  g.events.on(
    "GetDamageResponse",
    ({ detail: { who, damageType, response } }) => {
      // TODO nonmagical
      if (
        who.hasEffect(StoneskinEffect) &&
        MundaneDamageTypes.includes(damageType)
      )
        response.add("resist", StoneskinEffect);
    }
  );
});

const Stoneskin = simpleSpell<HasTarget>({
  name: "Stoneskin",
  level: 4,
  school: "Abjuration",
  concentration: true,
  v: true,
  s: true,
  m: "diamond dust worth 100gp, which the spell consumes",
  lists: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"],

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, true),
  }),

  async apply(g, caster, method, { target }) {
    target.addEffect(StoneskinEffect, hours(1));

    caster.concentrateOn({
      spell: Stoneskin,
      duration: hours(1),
      async onSpellEnd() {
        target.removeEffect(StoneskinEffect);
      },
    });
  },
});
export default Stoneskin;