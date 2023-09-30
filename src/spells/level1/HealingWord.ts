import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { ctSet } from "../../types/CreatureType";
import { scalingSpell } from "../common";

const cannotHeal = ctSet("undead", "construct");

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

  getConfig: (g) => ({
    target: new TargetResolver(g, 60, true),
  }),
  getHeal: (g, caster, method, { slot }) => [
    { type: "dice", amount: { count: slot ?? 1, size: 4 } },
    { type: "flat", amount: caster[method.ability].modifier },
  ],
  getTargets: (g, caster, { target }) => [target],

  check(g, { target }, ec) {
    if (target && cannotHeal.has(target.type))
      ec.add(`Cannot heal a ${target.type}`, HealingWord);
    return ec;
  },

  async apply(g, actor, method, { slot, target }) {
    if (cannotHeal.has(target.type)) return;

    const modifier = actor[method.ability].modifier;
    const rolled = await g.rollHeal(slot, {
      source: HealingWord,
      actor,
      target,
      spell: HealingWord,
      method,
      size: 4,
    });

    await g.heal(HealingWord, rolled + modifier, {
      actor,
      spell: HealingWord,
      target,
    });
  },
});
export default HealingWord;
