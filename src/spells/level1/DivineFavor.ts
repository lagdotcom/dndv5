import BaseEffect from "../../BaseEffect";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const DivineFavorEffect = new BaseEffect("Divine Favor", "turnEnd");

const DivineFavor = simpleSpell({
  name: "Divine Favor",
  level: 1,
  school: "Evocation",
  concentration: true,
  time: "bonus action",
  v: true,
  s: true,
  lists: ["Paladin"],

  getConfig: () => ({}),

  async apply(g, caster, method) {
    caster.addEffect(DivineFavorEffect, minutes(1));

    const cleanup = g.events.on(
      "gatherDamage",
      ({ detail: { attacker, map, weapon } }) => {
        if (attacker === caster && weapon) {
          const dr = g.dice.roll(
            {
              type: "damage",
              attacker,
              size: 4,
              spell: DivineFavor,
              method,
              damageType: "radiant",
            },
            "normal"
          );
          map.add("radiant", dr.value);
        }
      }
    );

    caster.concentrateOn({
      spell: DivineFavor,
      duration: minutes(1),
      async onSpellEnd() {
        caster.removeEffect(DivineFavorEffect);
        cleanup();
      },
    });
  },
});
export default DivineFavor;
