import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { scalingSpell } from "../common";

const MassHealingWord = scalingSpell<HasTargets>({
  status: "incomplete",
  name: "Mass Healing Word",
  level: 3,
  school: "Evocation",
  time: "bonus action",
  v: true,
  lists: ["Bard", "Cleric"],

  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, 1, 6, 60, true),
  }),
  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: (slot ?? 3) - 2, size: 4 } },
    { type: "flat", amount: caster[method.ability].modifier },
  ],
  getTargets: (g, caster, { targets }) => targets,

  // TODO This spell has no effect on undead or constructs.

  async apply(g, actor, method, { slot, targets }) {
    const amount =
      (await g.rollHeal(slot - 2, {
        source: MassHealingWord,
        actor,
        size: 4,
      })) + actor[method.ability].modifier;

    for (const target of targets) await g.applyHeal(target, amount, actor);
  },
});
export default MassHealingWord;
