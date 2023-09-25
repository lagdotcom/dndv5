import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import AbilityName from "../../types/AbilityName";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

const mental: AbilityName[] = ["int", "wis", "cha"];

const IntellectFortressEffect = new Effect(
  "Intellect Fortress",
  "turnStart",
  (g) => {
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (who.hasEffect(IntellectFortressEffect) && damageType === "psychic")
          response.add("resist", IntellectFortressEffect);
      },
    );

    g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      if (who.hasEffect(IntellectFortressEffect) && mental.includes(ability))
        diceType.add("advantage", IntellectFortressEffect);
    });
  },
);

const IntellectFortress = scalingSpell<HasTargets>({
  status: "incomplete",
  name: "Intellect Fortress",
  level: 3,
  school: "Abjuration",
  concentration: true,
  v: true,
  lists: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"],

  // TODO  The creatures must be within 30 feet of each other when you target them.
  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 3) - 2, 30, true),
  }),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { targets }) {
    const duration = hours(1);

    for (const target of targets)
      await target.addEffect(IntellectFortressEffect, { duration });

    caster.concentrateOn({
      spell: IntellectFortress,
      duration,
      async onSpellEnd() {
        for (const target of targets)
          await target.removeEffect(IntellectFortressEffect);
      },
    });
  },
});
export default IntellectFortress;
