import SphereEffectArea from "../../areas/SphereEffectArea";
import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

const FogCloud = scalingSpell<HasPoint>({
  name: "Fog Cloud",
  level: 1,
  school: "Conjuration",
  concentration: true,
  v: true,
  s: true,
  lists: ["Druid", "Ranger", "Sorcerer", "Wizard"],

  getAffectedArea(g, { point, slot }) {
    if (!point) return;
    return { type: "sphere", radius: 20 * (slot ?? 1), centre: point };
  },

  getConfig(g) {
    return { point: new PointResolver(g, 120) };
  },

  async apply(g, caster, _method, { point, slot }) {
    /* TODO You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.

    At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st. */

    const radius = 20 * slot;
    const area = new SphereEffectArea("Fog Cloud", point, radius, [
      "heavily obscured",
    ]);
    await g.addEffectArea(area);

    caster.concentrateOn({
      spell: FogCloud,
      duration: hours(1),
      onSpellEnd: async () => g.removeEffectArea(area),
    });
  },
});
export default FogCloud;
