import iconUrl from "@img/spl/spike-growth.svg";

import ActiveEffectArea from "../../ActiveEffectArea";
import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import EvaluateLater from "../../interruptions/EvaluateLater";
import PointResolver from "../../resolvers/PointResolver";
import { arSet, SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { resolveArea } from "../../utils/areas";
import { minutes } from "../../utils/time";
import { getSquares } from "../../utils/units";
import { simpleSpell } from "../common";

const getSpikeGrowthArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 20,
});

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

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [getSpikeGrowthArea(point)],
  getTargets: () => [],
  getAffected: (g, caster, { point }) => g.getInside(getSpikeGrowthArea(point)),

  async apply(g, attacker, method, { point }) {
    /* TODO [SIGHT] The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it. */

    const area = new ActiveEffectArea(
      "Spike Growth",
      getSpikeGrowthArea(point),
      arSet("difficult terrain", "plants"),
      "green",
    );
    g.addEffectArea(area);
    const spiky = resolveArea(area.shape);

    const unsubscribe = g.events.on(
      "CombatantMoved",
      ({ detail: { who, position, interrupt } }) => {
        const squares = getSquares(who, position);
        if (spiky.overlaps(squares))
          interrupt.add(
            new EvaluateLater(who, SpikeGrowth, async () => {
              const amount = await g.rollDamage(2, {
                source: SpikeGrowth,
                attacker,
                target: who,
                size: 4,
                damageType: "piercing",
                spell: SpikeGrowth,
                method,
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
