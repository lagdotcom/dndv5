import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import { canSee, withinRangeOfEachOther } from "../../filters";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { abSet } from "../../types/AbilityName";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

const mental = abSet("int", "wis", "cha");

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
      if (
        who.hasEffect(IntellectFortressEffect) &&
        ability &&
        mental.has(ability)
      )
        diceType.add("advantage", IntellectFortressEffect);
    });
  },
);

const IntellectFortress = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Intellect Fortress",
  level: 3,
  school: "Abjuration",
  concentration: true,
  v: true,
  lists: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"],
  description: `For the duration, you or one willing creature you can see within range has resistance to psychic damage, as well as advantage on Intelligence, Wisdom, and Charisma saving throws.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd. The creatures must be within 30 feet of each other when you target them.`,

  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(
      g,
      1,
      (slot ?? 3) - 2,
      30,
      [canSee],
      [withinRangeOfEachOther(30)],
    ),
  }),
  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { targets }) {
    const duration = hours(1);

    for (const target of targets)
      await target.addEffect(IntellectFortressEffect, { duration }, caster);

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
