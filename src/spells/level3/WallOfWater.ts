import { HasPoint } from "../../configs";
import { PickChoice } from "../../interruptions/PickFromListChoice";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

type Shape = "line" | "ring";

const shapeChoices: PickChoice<Shape>[] = [
  { label: "line", value: "line" },
  { label: "ring", value: "ring" },
];

const WallOfWater = simpleSpell<HasPoint & { shape: Shape }>({
  name: "Wall of Water",
  level: 3,
  school: "Evocation",
  concentration: true,
  v: true,
  s: true,
  m: "a drop of water",
  lists: ["Druid", "Sorcerer", "Wizard"],
  description: `You create a wall of water on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 1 foot thick, or you can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall vanishes when the spell ends. The wall's space is difficult terrain.

  Any ranged weapon attack that enters the wall's space has disadvantage on the attack roll, and fire damage is halved if the fire effect passes through the wall to reach its target. Spells that deal cold damage that pass through the wall cause the area of the wall they pass through to freeze solid (at least a 5-foot-square section is frozen). Each 5-foot-square frozen section has AC 5 and 15 hit points. Reducing a frozen section to 0 hit points destroys it. When a section is destroyed, the wall's water doesn't fill it.`,

  getConfig: (g) => ({
    point: new PointResolver(g, 60),
    shape: new ChoiceResolver(g, shapeChoices),
  }),
  getTargets: () => [],
  getAffected: () => [],

  async apply(g, caster, method, { point, shape }) {
    // TODO [TERRAIN] [PROJECTILE]
  },
});
export default WallOfWater;
