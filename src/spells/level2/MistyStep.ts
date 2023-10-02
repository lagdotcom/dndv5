import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { simpleSpell } from "../common";

const MistyStep = simpleSpell<HasPoint>({
  status: "implemented",
  name: "Misty Step",
  level: 2,
  school: "Conjuration",
  time: "bonus action",
  v: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.`,

  getConfig: (g) => ({ point: new PointResolver(g, 30) }),
  getTargets: (g, caster) => [caster],

  async apply(g, caster, method, { point }) {
    await g.move(caster, point, {
      name: "Misty Step",
      cannotApproach: new Set(),
      maximum: 30,
      provokesOpportunityAttacks: false,
      mustUseAll: false,
      onMove: () => true,
    });
  },
});
export default MistyStep;
