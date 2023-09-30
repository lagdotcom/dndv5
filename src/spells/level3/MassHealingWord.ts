import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { ctSet } from "../../types/CreatureType";
import { scalingSpell } from "../common";

const cannotHeal = ctSet("undead", "construct");

const MassHealingWord = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Mass Healing Word",
  level: 3,
  school: "Evocation",
  time: "bonus action",
  v: true,
  lists: ["Bard", "Cleric"],
  description: `As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd.`,

  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, 1, 6, 60, true),
  }),
  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: (slot ?? 3) - 2, size: 4 } },
    { type: "flat", amount: caster[method.ability].modifier },
  ],
  getTargets: (g, caster, { targets }) => targets,

  check(g, { targets }, ec) {
    if (targets) {
      for (const target of targets)
        if (cannotHeal.has(target.type))
          ec.add(
            `Cannot heal ${target.name}, they are a ${target.type}`,
            MassHealingWord
          );
    }

    return ec;
  },

  async apply(g, actor, method, { slot, targets }) {
    const amount =
      (await g.rollHeal(slot - 2, {
        source: MassHealingWord,
        actor,
        size: 4,
      })) + actor[method.ability].modifier;

    for (const target of targets) {
      if (cannotHeal.has(target.type)) continue;

      await g.applyHeal(target, amount, actor);
    }
  },
});
export default MassHealingWord;
