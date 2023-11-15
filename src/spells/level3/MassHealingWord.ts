import { HasTargets } from "../../configs";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { ctSet } from "../../types/CreatureType";
import { poWithin } from "../../utils/ai";
import { combinationsMulti } from "../../utils/combinatorics";
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

  generateHealingConfigs(slot, allTargets, g, caster) {
    return combinationsMulti(
      allTargets.filter((co) => co.side === caster.side),
      1,
      6,
    ).map((targets) => ({
      config: { targets },
      positioning: new Set(targets.map((target) => poWithin(60, target))),
    }));
  },

  getConfig: (g) => ({
    targets: new MultiTargetResolver(g, 1, 6, 60, []),
  }),
  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: (slot ?? 3) - 2, size: 4 } },
    {
      type: "flat",
      amount: method.ability ? caster[method.ability].modifier : 0,
    },
  ],
  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  check(g, { targets }, ec) {
    if (targets) {
      for (const target of targets)
        if (cannotHeal.has(target.type))
          ec.add(
            `Cannot heal ${target.name}, they are a ${target.type}`,
            MassHealingWord,
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
      })) + (method.ability ? actor[method.ability].modifier : 0);

    for (const target of targets) {
      if (cannotHeal.has(target.type)) continue;

      await g.applyHeal(target, amount, actor);
    }
  },
});
export default MassHealingWord;
