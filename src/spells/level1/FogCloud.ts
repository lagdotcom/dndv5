import ActiveEffectArea from "../../ActiveEffectArea";
import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { arSet } from "../../types/EffectArea";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

const FogCloud = scalingSpell<HasPoint>({
  status: "incomplete",
  name: "Fog Cloud",
  level: 1,
  school: "Conjuration",
  concentration: true,
  v: true,
  s: true,
  lists: ["Druid", "Ranger", "Sorcerer", "Wizard"],
  description: `You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.`,

  getAffectedArea: (g, caster, { point, slot }) =>
    point && [{ type: "sphere", radius: 20 * (slot ?? 1), centre: point }],
  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getTargets: () => [],
  getAffected: () => [],

  async apply({ g, affectedArea, caster }) {
    /* TODO [DISPERSAL] You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.

    At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st. */
    const areas = new Set<ActiveEffectArea>();
    for (const shape of affectedArea) {
      const area = new ActiveEffectArea(
        "Fog Cloud",
        shape,
        arSet("heavily obscured"),
        "grey",
      );
      areas.add(area);
      g.addEffectArea(area);
    }

    await caster.concentrateOn({
      spell: FogCloud,
      duration: hours(1),
      onSpellEnd: async () => {
        for (const area of areas) g.removeEffectArea(area);
      },
    });
  },
});
export default FogCloud;
