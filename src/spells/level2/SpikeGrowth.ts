import ActiveEffectArea from "../../ActiveEffectArea";
import { HasPoint } from "../../configs";
import EvaluateLater from "../../interruptions/EvaluateLater";
import PointResolver from "../../resolvers/PointResolver";
import { resolveArea } from "../../utils/areas";
import { minutes } from "../../utils/time";
import { getSquares } from "../../utils/units";
import { simpleSpell } from "../common";

const SpikeGrowth = simpleSpell<HasPoint>({
  status: "incomplete",
  name: "Spike Growth",
  level: 2,
  school: "Transmutation",
  v: true,
  s: true,
  m: "seven sharp thorns or seven small twigs, each sharpened to a point",
  concentration: true,
  lists: ["Druid", "Ranger"],

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),

  getAffectedArea: (g, caster, { point }) =>
    point && [{ type: "sphere", centre: point, radius: 20 }],

  async apply(g, attacker, method, { point }) {
    /* TODO [SIGHT] The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it. */

    const area = new ActiveEffectArea(
      "Spike Growth",
      { type: "sphere", centre: point, radius: 20 },
      new Set(["difficult terrain", "plants"])
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
                [["piercing", amount]]
              );
            })
          );
      }
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
