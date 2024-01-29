import iconUrl from "@img/spl/spike-growth.svg";

import ActiveEffectArea from "../../ActiveEffectArea";
import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { atSet } from "../../types/AttackTag";
import { arSet } from "../../types/EffectArea";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { getSquares } from "../../utils/units";
import { simpleSpell } from "../common";
import { affectsByPoint } from "../helpers";

const SpikeGrowth = simpleSpell<HasPoint>({
  status: "incomplete",
  name: "Spike Growth",
  icon: makeIcon(iconUrl, DamageColours.piercing),
  level: 2,
  school: "Transmutation",
  v: true,
  s: true,
  m: "seven sharp thorns or seven small twigs, each sharpened to a point",
  concentration: true,
  lists: ["Druid", "Ranger"],
  isHarmful: true,
  description: `The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.

  The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.`,

  ...affectsByPoint(150, (centre) => ({ type: "sphere", centre, radius: 20 })),

  async apply({ g, caster: attacker, method, affectedArea }) {
    /* TODO [SIGHT] The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it. */

    const area = new ActiveEffectArea(
      "Spike Growth",
      affectedArea[0],
      arSet("difficult terrain", "plants"),
      "green",
      ({ detail: { where, difficult } }) => {
        if (area.points.has(where))
          difficult.add("magical plants", SpikeGrowth);
      },
    );
    g.addEffectArea(area);

    const unsubscribe = g.events.on(
      "CombatantMoved",
      ({ detail: { who, position, interrupt } }) => {
        const squares = getSquares(who, position);
        if (area.points.overlaps(squares))
          interrupt.add(
            new EvaluateLater(who, SpikeGrowth, Priority.Late, async () => {
              const amount = await g.rollDamage(2, {
                source: SpikeGrowth,
                attacker,
                target: who,
                size: 4,
                damageType: "piercing",
                spell: SpikeGrowth,
                method,
                tags: atSet("magical", "spell"),
              });
              await g.damage(
                SpikeGrowth,
                "piercing",
                { attacker, target: who, spell: SpikeGrowth, method },
                [["piercing", amount]],
              );
            }),
          );
      },
    );

    attacker.concentrateOn({
      spell: SpikeGrowth,
      duration: minutes(10),
      async onSpellEnd() {
        g.removeEffectArea(area);
        unsubscribe();
      },
    });
  },
});
export default SpikeGrowth;
