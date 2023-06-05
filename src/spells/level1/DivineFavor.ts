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
  implemented: true,
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
    caster.addEffect(DivineFavorEffect, minutes(1));

    caster.concentrateOn({
      spell: DivineFavor,
      duration: minutes(1),
      async onSpellEnd() {
        caster.removeEffect(DivineFavorEffect);
      },
    });
  },
});
export default DivineFavor;
