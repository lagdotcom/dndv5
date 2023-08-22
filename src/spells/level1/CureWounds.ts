import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { scalingSpell } from "../common";

const CureWounds = scalingSpell<HasTarget>({
  status: "incomplete",
  name: "Cure Wounds",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],

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

  // TODO This spell has no effect on undead or constructs.

  async apply(g, actor, method, { slot, target }) {
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
