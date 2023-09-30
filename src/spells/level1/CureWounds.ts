import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { ctSet } from "../../types/CreatureType";
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
    target: new TargetResolver(g, caster.reach, true),
  }),
  getHeal: (g, caster, method, { slot }) => {
    const modifier = caster[method.ability].modifier;
    const count = slot ?? 1;

    return [
      { type: "dice", amount: { count, size: 8 } },
      { type: "flat", amount: modifier },
    ];
  },
  getTargets: (g, caster, { target }) => [target],

  check(g, { target }, ec) {
    if (target && cannotHeal.has(target.type))
      ec.add(`Cannot heal a ${target.type}`, CureWounds);
    return ec;
  },

  async apply(g, actor, method, { slot, target }) {
    if (cannotHeal.has(target.type)) return;

    const modifier = actor[method.ability].modifier;
    const rolled = await g.rollHeal(slot, {
      source: CureWounds,
      actor,
      target,
      spell: CureWounds,
      method,
      size: 8,
    });

    await g.heal(CureWounds, rolled + modifier, {
      actor,
      spell: CureWounds,
      target,
    });
  },
});
export default CureWounds;
