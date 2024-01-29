import iconUrl from "@img/spl/armor-of-agathys.svg";

import { DamageColours, makeIcon } from "../../colours";
import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import Priority from "../../types/Priority";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";
import { affectsSelf } from "../helpers";

const ArmorOfAgathysIcon = makeIcon(iconUrl, DamageColours.cold);

const ArmorOfAgathysEffect = new Effect<{ count: number }>(
  "Armor of Agathys",
  "turnStart",
  (g) => {
    g.events.on(
      "Attack",
      ({
        detail: {
          roll: {
            type: { target, tags, who },
          },
          interrupt,
        },
      }) => {
        const config = target.getEffectConfig(ArmorOfAgathysEffect);

        if (
          config &&
          target.temporaryHPSource === ArmorOfAgathysEffect &&
          tags.has("melee")
        )
          interrupt.add(
            new EvaluateLater(
              who,
              ArmorOfAgathysEffect,
              Priority.Normal,
              async () =>
                g.damage(
                  ArmorOfAgathysEffect,
                  "cold",
                  { attacker: target, target: who },
                  [["cold", config.count]],
                ),
            ),
          );
      },
    );

    g.events.on(
      "CombatantDamaged",
      ({ detail: { who, temporaryHPSource, interrupt } }) => {
        if (temporaryHPSource === ArmorOfAgathysEffect && who.temporaryHP <= 0)
          interrupt.add(
            new EvaluateLater(who, ArmorOfAgathysEffect, Priority.Normal, () =>
              who.removeEffect(ArmorOfAgathysEffect),
            ),
          );
      },
    );
  },
  { icon: ArmorOfAgathysIcon, tags: ["magic"] },
);

/* A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.

At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st. */
const ArmorOfAgathys = scalingSpell({
  status: "implemented",
  name: "Armor of Agathys",
  icon: ArmorOfAgathysIcon,
  level: 1,
  school: "Abjuration",
  v: true,
  s: true,
  m: "a cup of water",
  lists: ["Warlock"],
  description: `A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st.`,

  ...affectsSelf,

  async apply({ g, caster }, { slot }) {
    const count = slot * 5;
    if (await g.giveTemporaryHP(caster, count, ArmorOfAgathysEffect)) {
      const duration = hours(1);
      await caster.addEffect(ArmorOfAgathysEffect, { count, duration }, caster);
    }
  },
});
export default ArmorOfAgathys;
