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
