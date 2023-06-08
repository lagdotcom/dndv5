import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const DivineFavorEffect = new Effect("Divine Favor", "turnEnd", (g) => {
  g.events.on(
    "GatherDamage",
    ({ detail: { attacker, critical, map, weapon, interrupt } }) => {
      if (attacker.hasEffect(DivineFavorEffect) && weapon)
        interrupt.add(
          new EvaluateLater(attacker, DivineFavorEffect, async () => {
            map.add(
              "radiant",
              await g.rollDamage(
                1,
                { size: 4, attacker, damageType: "radiant" },
                critical
              )
            );
          })
        );
    }
  );
});

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

  getConfig: () => ({}),

  async apply(g, caster) {
    const duration = minutes(1);
    caster.addEffect(DivineFavorEffect, { duration });

    await caster.concentrateOn({
      spell: DivineFavor,
      duration,
      async onSpellEnd() {
        caster.removeEffect(DivineFavorEffect);
      },
    });
  },
});
export default DivineFavor;
