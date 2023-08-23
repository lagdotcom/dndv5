import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { scalingSpell } from "../common";

const HealingWord = scalingSpell<HasTarget>({
  status: "incomplete",
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

  // TODO This spell has no effect on undead or constructs.

  async apply(g, actor, method, { slot, target }) {
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
