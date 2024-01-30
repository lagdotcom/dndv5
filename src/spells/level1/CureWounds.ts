import { HasTarget } from "../../configs";
import { notOfCreatureType } from "../../filters";
import { DiceCount } from "../../flavours";
import { cannotHealConventionally, scalingSpell } from "../common";
import { aiTargetsByTouch, targetsByTouch } from "../helpers";

const CureWounds = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Cure Wounds",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],
  description: `A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.`,

  ...targetsByTouch([notOfCreatureType("undead", "construct")]),
  generateHealingConfigs: aiTargetsByTouch,

  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: (slot as DiceCount) ?? 1, size: 8 } },
    {
      type: "flat",
      amount: method.ability ? caster[method.ability].modifier : 0,
    },
  ],

  async apply(sh, { target }) {
    if (cannotHealConventionally.has(target.type)) return;

    const amount = await sh.rollHeal({ target });
    await sh.heal({ amount, target });
  },
});
export default CureWounds;
