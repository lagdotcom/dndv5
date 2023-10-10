import { HasPoint } from "../../configs";
import { PickChoice } from "../../interruptions/PickFromListChoice";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import PointResolver from "../../resolvers/PointResolver";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import iconUrl from "./icons/fire-wall.svg";

type Shape = "line" | "ring";

const shapeChoices: PickChoice<Shape>[] = [
  { label: "line", value: "line" },
  { label: "ring", value: "ring" },
];

const WallOfFire = scalingSpell<HasPoint & { shape: Shape }>({
  name: "Wall of Fire",
  level: 4,
  icon: { url: iconUrl },
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "a small piece of phosphorus",
  lists: ["Druid", "Sorcerer", "Wizard"],
  description: `You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.

  When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.

  One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.`,

  // TODO choose dimensions of line wall
  getConfig: (g) => ({
    point: new PointResolver(g, 120),
    shape: new ChoiceResolver(g, shapeChoices),
  }),
  getTargets: () => [],
  getDamage: (g, caster, method, { slot }) => [_dd((slot ?? 4) + 1, 8, "fire")],

  async apply(g, caster, method, { point, shape }) {
    // TODO [SIGHT]
  },
});
export default WallOfFire;
