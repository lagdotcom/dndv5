import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

const SpikeGrowth = simpleSpell<HasPoint>({
  name: "Spike Growth",
  level: 2,
  school: "Transmutation",
  v: true,
  s: true,
  m: "seven sharp thorns or seven small twigs, each sharpened to a point",
  concentration: true,
  lists: ["Druid", "Ranger"],

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),

  getAffectedArea: (g, { point }) =>
    point && [{ type: "sphere", centre: point, radius: 20 }],

  async apply(g, caster, method, config) {
    /* TODO The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.

The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it. */
  },
});
export default SpikeGrowth;
