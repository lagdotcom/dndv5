import { HasTarget } from "../../configs";
import { canSee, notOfCreatureType } from "../../filters";
import { DiceCount } from "../../flavours";
import { cannotHealConventionally, scalingSpell } from "../common";
import { aiTargetsOne, targetsOne } from "../helpers";

const HealingWord = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Healing Word",
  level: 1,
  school: "Evocation",
  time: "bonus action",
  v: true,
  lists: ["Bard", "Cleric", "Druid"],
  description: `A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.`,

  ...targetsOne(60, [canSee, notOfCreatureType("undead", "construct")]),
  generateHealingConfigs: aiTargetsOne(60),

  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: (slot as DiceCount) ?? 1, size: 4 } },
    {
      type: "flat",
      amount: method.ability ? caster[method.ability].modifier : 0,
    },
  ],

  check(g, { target }, ec) {
    if (target && cannotHealConventionally.has(target.type))
      ec.add(`Cannot heal a ${target.type}`, HealingWord);
    return ec;
  },

  async apply(sh, { target }) {
    if (cannotHealConventionally.has(target.type)) return;

    const amount = await sh.rollHeal({ target });
    await sh.heal({ amount, target });
  },
});
export default HealingWord;
