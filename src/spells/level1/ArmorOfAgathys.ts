import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

const ArmorOfAgathysEffect = new Effect<{ count: number }>(
  "Armor of Agathys",
  "turnStart",
  (g) => {
    g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
      const config = pre.target.getEffectConfig(ArmorOfAgathysEffect);

      if (
        config &&
        pre.target.temporaryHPSource === ArmorOfAgathysEffect &&
        pre.tags.has("melee")
      )
        interrupt.add(
          new EvaluateLater(pre.who, ArmorOfAgathysEffect, async () => {
            await g.damage(
              ArmorOfAgathysEffect,
              "cold",
              { attacker: pre.target, target: pre.who },
              [["cold", config.count]]
            );
          })
        );
    });

    g.events.on(
      "CombatantDamaged",
      ({ detail: { who, temporaryHPSource, interrupt } }) => {
        if (temporaryHPSource === ArmorOfAgathysEffect && who.temporaryHP <= 0)
          interrupt.add(
            new EvaluateLater(who, ArmorOfAgathysEffect, async () => {
              await who.removeEffect(ArmorOfAgathysEffect);
            })
          );
      }
    );
  }
);

/* A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st. */
const ArmorOfAgathys = scalingSpell({
  status: "implemented",
  name: "Armor of Agathys",
  level: 1,
  school: "Abjuration",
  v: true,
  s: true,
  m: "a cup of water",
  lists: ["Warlock"],
  description: `A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st.`,

  getConfig: () => ({}),
  getTargets: (g, caster) => [caster],

  async apply(g, caster, method, { slot }) {
    const count = slot * 5;
    if (await g.giveTemporaryHP(caster, count, ArmorOfAgathysEffect)) {
      const duration = hours(1);
      await caster.addEffect(ArmorOfAgathysEffect, { count, duration }, caster);
    }
  },
});
export default ArmorOfAgathys;
