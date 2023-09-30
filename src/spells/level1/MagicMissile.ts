import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import DamageAmount from "../../types/DamageAmount";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getDamage = (slot: number): DamageAmount[] => [
  _dd(slot + 2, 4, "force"),
  { type: "flat", amount: slot + 2, damageType: "force" },
];

const MagicMissile = scalingSpell<HasTargets>({
  name: "Magic Missile",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],
  description: `You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.`,

  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 1) + 2, 120),
  }),
  getDamage: (g, caster, method, { slot }) => getDamage(slot ?? 1),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { slot, targets }) {
    // TODO [MULTIASSIGN]
  },
});
export default MagicMissile;
