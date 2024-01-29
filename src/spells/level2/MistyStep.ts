import { HasPoint } from "../../configs";
import { getTeleportation } from "../../movement";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";
import { affectsSelf } from "../helpers";

const MistyStep = simpleSpell<HasPoint>({
  status: "implemented",
  name: "Misty Step",
  level: 2,
  school: "Conjuration",
  time: "bonus action",
  v: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.`,

  ...affectsSelf,
  getConfig: (g) => ({ point: new PointResolver(g, 30) }),

  async apply({ g, caster }, { point }) {
    await g.move(caster, point, getTeleportation(30, "Misty Step"));
  },
});
export default MistyStep;
