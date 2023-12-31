import Effect from "../../Effect";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const BlurEffect = new Effect(
  "Blur",
  "turnStart",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
      // TODO [SIGHT] An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.
      if (who.hasEffect(BlurEffect)) diceType.add("disadvantage", BlurEffect);
    });
  },
  { tags: ["magic"] },
);

const Blur = simpleSpell({
  status: "incomplete",
  name: "Blur",
  level: 2,
  school: "Illusion",
  concentration: true,
  v: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.`,

  getConfig: () => ({}),
  getTargets: () => [],
  getAffected: (g, caster) => [caster],

  async apply({ caster }) {
    const duration = minutes(1);
    await caster.addEffect(BlurEffect, { duration }, caster);

    await caster.concentrateOn({
      spell: Blur,
      duration,
      async onSpellEnd() {
        await caster.removeEffect(BlurEffect);
      },
    });
  },
});
export default Blur;
