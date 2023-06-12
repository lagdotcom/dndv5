import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { scalingSpell } from "../common";

const MagicMissile = scalingSpell<HasTargets>({
  name: "Magic Missile",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],

  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 1) + 2, 120),
  }),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, caster, method, config) {
    // TODO You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.
  },
});
export default MagicMissile;
