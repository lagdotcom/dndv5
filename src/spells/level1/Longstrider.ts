import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";
import { targetsMany } from "../helpers";

const LongstriderEffect = new Effect(
  "Longstrider",
  "turnStart",
  (g) => {
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(LongstriderEffect)) bonus.add(10, LongstriderEffect);
    });
  },
  { tags: ["magic"] },
);

const Longstrider = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Longstrider",
  level: 1,
  school: "Transmutation",
  v: true,
  s: true,
  m: "a pinch of dirt",
  lists: ["Artificer", "Bard", "Druid", "Ranger", "Wizard"],
  description: `You touch a creature. The target's speed increases by 10 feet until the spell ends.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.`,

  ...targetsMany(1, 1, 5, []),
  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, slot ?? 1, caster.reach, []),
  }),

  async apply(sh, { targets }) {
    for (const target of targets)
      await target.addEffect(
        LongstriderEffect,
        { duration: hours(1) },
        sh.caster,
      );
  },
});
export default Longstrider;
