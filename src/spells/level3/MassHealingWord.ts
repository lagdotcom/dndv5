import { HasTargets } from "../../configs";
import { canSee, notOfCreatureType } from "../../filters";
import { poWithin } from "../../utils/ai";
import { combinationsMulti } from "../../utils/combinatorics";
import { cannotHealConventionally, scalingSpell } from "../common";
import { targetsMany } from "../helpers";

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

  ...targetsMany(1, 6, 60, [canSee, notOfCreatureType("undead", "construct")]),

  generateHealingConfigs: ({ allTargets, caster }) =>
    combinationsMulti(
      allTargets.filter((co) => co.side === caster.side),
      1,
      6,
    ).map((targets) => ({
      config: { targets },
      positioning: new Set(targets.map((target) => poWithin(60, target))),
    })),

  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: (slot ?? 3) - 2, size: 4 } },
    {
      type: "flat",
      amount: method.ability ? caster[method.ability].modifier : 0,
    },
  ],

  async apply(sh, { targets }) {
    const amount = await sh.rollHeal();
    for (const target of targets) {
      if (cannotHealConventionally.has(target.type)) continue;
      await sh.heal({ amount, target });
    }
  },
});
export default MassHealingWord;
