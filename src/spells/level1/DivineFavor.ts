import Effect from "../../Effect";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";

const DivineFavorEffect = new Effect("Divine Favor", "turnEnd", (g) => {
  g.events.on("gatherDamage", ({ detail: { attacker, map, weapon } }) => {
    if (attacker.hasEffect(DivineFavorEffect) && weapon) {
      const dr = g.dice.roll(
        {
          type: "damage",
          attacker,
          size: 4,
          spell: DivineFavor,
          damageType: "radiant",
        },
        "normal"
      );
      map.add("radiant", dr.value);
    }
  });
});

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
