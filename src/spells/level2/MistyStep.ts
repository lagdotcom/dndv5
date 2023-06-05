import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

const MistyStep = simpleSpell<HasPoint>({
  name: "Misty Step",
  level: 2,
  school: "Conjuration",
  time: "bonus action",
  v: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 30) }),

  async apply(g, caster, method, config) {
    // TODO Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.
  },
});
export default MistyStep;