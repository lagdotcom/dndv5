import { HasTarget } from "../../configs";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import { coSet } from "../../types/ConditionName";
import EffectType from "../../types/EffectType";
import { intersects } from "../../utils/set";
import { simpleSpell } from "../common";
import { targetsByTouch } from "../helpers";

const validConditions = coSet("Blinded", "Deafened", "Paralyzed", "Poisoned");

interface HasEffect {
  effect: EffectType;
}

const LesserRestoration = simpleSpell<HasEffect & HasTarget>({
  status: "implemented",
  name: "Lesser Restoration",
  level: 2,
  school: "Abjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],
  description: `You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.`,

  ...targetsByTouch([]),
  getConfig: (g, caster, method, { target }) => ({
    target: new TargetResolver(g, caster.reach, []),
    effect: new ChoiceResolver(
      g,
      target?.effects
        ? Array.from(target.effects)
            .filter(
              ([type, config]) =>
                type.tags.has("disease") ||
                (config.conditions &&
                  intersects(config.conditions, validConditions)),
            )
            .map(([value]) => ({ label: value.name, value }))
        : [],
    ),
  }),

  check(g, { effect, target }, ec) {
    if (target && effect && !target.hasEffect(effect))
      ec.add("target does not have chosen effect", LesserRestoration);

    return ec;
  },

  async apply(sh, { target, effect }) {
    await target.removeEffect(effect);
  },
});
export default LesserRestoration;
