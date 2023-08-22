import { HasTarget } from "../../configs";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import ConditionName from "../../types/ConditionName";
import EffectType from "../../types/EffectType";
import { intersects } from "../../utils/set";
import { simpleSpell } from "../common";

const validConditions = new Set<ConditionName>([
  "Blinded",
  "Deafened",
  "Paralyzed",
  "Poisoned",
]);

type HasEffect = { effect: EffectType };

const LesserRestoration = simpleSpell<HasEffect & HasTarget>({
  status: "implemented",
  name: "Lesser Restoration",
  level: 2,
  school: "Abjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],

  getConfig: (g, caster, method, { target }) => {
    const effectTypes: EffectType<unknown>[] = [];
    if (target)
      for (const [type, config] of target.effects) {
        if (
          type.tags.has("disease") ||
          (config.conditions && intersects(config.conditions, validConditions))
        )
          effectTypes.push(type);
      }

    return {
      target: new TargetResolver(g, caster.reach, true),
      effect: new ChoiceResolver(
        g,
        effectTypes.map((value) => ({
          label: value.name,
          value,
        })),
      ),
    };
  },
  getTargets: (g, caster, { target }) => [target],

  check(g, { effect, target }, ec) {
    if (target && effect && !target.hasEffect(effect))
      ec.add("target does not have chosen effect", LesserRestoration);

    return ec;
  },

  async apply(g, caster, method, { target, effect }) {
    target.removeEffect(effect);
  },
});
export default LesserRestoration;
