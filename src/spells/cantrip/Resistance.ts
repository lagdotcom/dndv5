import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { isAlly } from "../../filters";
import YesNoChoice from "../../interruptions/YesNoChoice";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import Priority from "../../types/Priority";
import { sieve } from "../../utils/array";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

interface Config {
  caster: Combatant;
  affecting: Set<Combatant>;
}

const ResistanceEffect = new Effect<Config>(
  "Resistance",
  "turnStart",
  (g) => {
    g.events.on("BeforeSave", ({ detail: { who, interrupt, bonus } }) => {
      const config = who.getEffectConfig(ResistanceEffect);
      if (config)
        interrupt.add(
          new YesNoChoice(
            who,
            ResistanceEffect,
            "Resistance",
            `${who.name} is making a saving throw. Use Resistance to gain a d4?`,
            Priority.Normal,
            async () => {
              const value = await g.roll({
                type: "other",
                source: ResistanceEffect,
                size: 4,
                who,
              });
              bonus.add(value.values.final, ResistanceEffect);
              await who.removeEffect(ResistanceEffect);

              config.affecting.delete(who);
              if (!config.affecting.size)
                await config.caster.endConcentration(Resistance);
            },
          ),
        );
    });
  },
  { tags: ["magic"] },
);

const Resistance = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Resistance",
  level: 0,
  school: "Abjuration",
  concentration: true,
  v: true,
  s: true,
  m: "a miniature cloak",
  lists: ["Artificer", "Cleric", "Druid"],
  description: `You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.`,

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, [isAlly]),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply({ affected, caster }) {
    const affecting = new Set<Combatant>();

    for (const target of affected)
      if (
        await target.addEffect(
          ResistanceEffect,
          { duration: Infinity, caster, affecting },
          caster,
        )
      )
        affecting.add(target);

    if (affecting.size)
      caster.concentrateOn({
        duration: minutes(1),
        spell: Resistance,
        async onSpellEnd() {
          for (const who of affecting) await who.removeEffect(ResistanceEffect);
        },
      });
  },
});
export default Resistance;
