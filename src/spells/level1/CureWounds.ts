import { HasTarget } from "../../configs";
import { notOfCreatureType } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { ctSet } from "../../types/CreatureType";
import { sieve } from "../../utils/array";
import { scalingSpell } from "../common";

const cannotHeal = ctSet("undead", "construct");

const CureWounds = scalingSpell<HasTarget>({
  status: "incomplete",
  name: "Cure Wounds",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],
  description: `A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.`,

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, [
      notOfCreatureType("undead", "construct"),
    ]),
  }),
  getHeal: (g, caster, method, { slot }) => {
    const modifier = method.ability ? caster[method.ability].modifier : 0;
    const count = slot ?? 1;

    return [
      { type: "dice", amount: { count, size: 8 } },
      { type: "flat", amount: modifier },
    ];
  },
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(sh, { target }) {
    if (cannotHeal.has(target.type)) return;

    const amount = await sh.rollHeal({ target });
    await sh.heal({ amount, target });
  },
});
export default CureWounds;
