import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { scalingSpell } from "../common";

const ConeOfCold = scalingSpell<HasPoint>({
  name: "Cone of Cold",
  level: 5,
  school: "Evocation",
  v: true,
  s: true,
  m: "a small crystal or glass cone",
  lists: ["Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [
      {
        type: "cone",
        radius: 60,
        centre: g.getState(caster).position,
        target: point,
      },
    ],

  async apply(g, caster, method, { slot, point }) {
    /* TODO A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.

A creature killed by this spell becomes a frozen statue until it thaws.

At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th. */
  },
});
export default ConeOfCold;
