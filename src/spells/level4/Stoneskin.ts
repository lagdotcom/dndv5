import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { isAlly } from "../../filters";
import { MundaneDamageTypes } from "../../types/DamageType";
import { hours } from "../../utils/time";
import { isA } from "../../utils/types";
import { simpleSpell } from "../common";
import { targetsByTouch } from "../helpers";

const StoneskinEffect = new Effect(
  "Stoneskin",
  "turnStart",
  (g) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response, attack } }) => {
        if (
          who.hasEffect(StoneskinEffect) &&
          !attack?.roll.type.tags.has("magical") &&
          isA(damageType, MundaneDamageTypes)
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

  ...targetsByTouch([isAlly]),

  async apply({ caster }, { target }) {
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
