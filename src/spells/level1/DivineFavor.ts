import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { atSet } from "../../types/AttackTag";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const DivineFavorEffect = new Effect(
  "Divine Favor",
  "turnEnd",
  (g) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, critical, map, weapon, interrupt } }) => {
        if (attacker?.hasEffect(DivineFavorEffect) && weapon)
          interrupt.add(
            new EvaluateLater(attacker, DivineFavorEffect, async () => {
              map.add(
                "radiant",
                await g.rollDamage(
                  1,
                  {
                    source: DivineFavor,
                    size: 4,
                    attacker,
                    damageType: "radiant",
                    tags: atSet("magical"),
                  },
                  critical,
                ),
              );
            }),
          );
      },
    );
  },
  { tags: ["magic"] },
);

const DivineFavor = simpleSpell({
  status: "implemented",
  name: "Divine Favor",
  level: 1,
  school: "Evocation",
  concentration: true,
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Paladin"],
  description: `Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.`,

  getConfig: () => ({}),
  getTargets: () => [],
  getAffected: (g, caster) => [caster],

  async apply(g, caster) {
    const duration = minutes(1);
    await caster.addEffect(DivineFavorEffect, { duration }, caster);

    await caster.concentrateOn({
      spell: DivineFavor,
      duration,
      async onSpellEnd() {
        await caster.removeEffect(DivineFavorEffect);
      },
    });
  },
});
export default DivineFavor;
