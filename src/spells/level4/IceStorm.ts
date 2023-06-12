import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { SpecifiedCylinder } from "../../types/EffectArea";
import Point from "../../types/Point";
import { dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getArea = (centre: Point): SpecifiedCylinder => ({
  type: "cylinder",
  centre,
  radius: 20,
  height: 40,
});

const IceStorm = scalingSpell<HasPoint>({
  name: "Ice Storm",
  level: 4,
  school: "Evocation",
  v: true,
  s: true,
  m: "a pinch of dust and a few drops of water",
  lists: ["Druid", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 300) }),
  getAffectedArea: (g, caster, { point }) => point && [getArea(point)],
  getTargets: (g, caster, { point }) => g.getInside(getArea(point)),
  getDamage: (g, caster, { slot }) => [
    dd((slot ?? 4) - 2, 8, "bludgeoning"),
    dd(4, 6, "cold"),
  ],

  async apply(g, caster, method, config) {
    /* TODO [TERRAIN] A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.

Hailstones turn the storm's area of effect into difficult terrain until the end of your next turn.

At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th. */
  },
});
export default IceStorm;
