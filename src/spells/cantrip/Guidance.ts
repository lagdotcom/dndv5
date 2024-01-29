import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { isAlly } from "../../filters";
import YesNoChoice from "../../interruptions/YesNoChoice";
import Combatant from "../../types/Combatant";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import { touchTarget } from "../helpers";

interface Config {
  caster: Combatant;
  affecting: Set<Combatant>;
}

const GuidanceEffect = new Effect<Config>(
  "Guidance",
  "turnStart",
  (g) => {
    // TODO It can roll the die before or after making the ability check.
    g.events.on("BeforeCheck", ({ detail: { who, interrupt, bonus } }) => {
      const config = who.getEffectConfig(GuidanceEffect);
      if (config)
        interrupt.add(
          new YesNoChoice(
            who,
            GuidanceEffect,
            "Guidance",
            `${who.name} is making an ability check. Use Guidance to gain a d4?`,
            Priority.Normal,
            async () => {
              const value = await g.roll({
                type: "other",
                source: GuidanceEffect,
                size: 4,
                who,
              });
              bonus.add(value.values.final, GuidanceEffect);
              await who.removeEffect(GuidanceEffect);

              config.affecting.delete(who);
              if (!config.affecting.size)
                await config.caster.endConcentration(Guidance);
            },
          ),
        );
    });
  },
  { tags: ["magic"] },
);

const Guidance = simpleSpell<HasTarget>({
  status: "incomplete",
  name: "Guidance",
  level: 0,
  school: "Divination",
  concentration: true,
  v: true,
  s: true,
  lists: ["Artificer", "Cleric", "Druid"],
  description: `You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.`,

  ...touchTarget([isAlly]),

  async apply({ affected, caster }) {
    const affecting = new Set<Combatant>();

    for (const target of affected)
      if (
        await target.addEffect(
          GuidanceEffect,
          { duration: Infinity, caster, affecting },
          caster,
        )
      )
        affecting.add(target);

    if (affecting.size)
      caster.concentrateOn({
        duration: minutes(1),
        spell: Guidance,
        async onSpellEnd() {
          for (const who of affecting) await who.removeEffect(GuidanceEffect);
        },
      });
  },
});
export default Guidance;
