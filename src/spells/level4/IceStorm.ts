import { HasPoint } from "../../configs";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import { affectsByPoint, requiresSave } from "../helpers";

const IceStorm = scalingSpell<HasPoint>({
  name: "Ice Storm",
  level: 4,
  school: "Evocation",
  v: true,
  s: true,
  m: "a pinch of dust and a few drops of water",
  lists: ["Druid", "Sorcerer", "Wizard"],
  isHarmful: true,
  description: `A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.

  Hailstones turn the storm's area of effect into difficult terrain until the end of your next turn.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.`,

  ...affectsByPoint(300, (centre) => ({
    type: "cylinder",
    centre,
    radius: 20,
    height: 40,
  })),
  ...requiresSave("dex"),

  // TODO: generateAttackConfigs

  getDamage: (g, caster, method, { slot }) => [
    _dd((slot ?? 4) - 2, 8, "bludgeoning"),
    _dd(4, 6, "cold"),
  ],

  async apply() {
    // TODO [TERRAIN]
  },
});
export default IceStorm;
