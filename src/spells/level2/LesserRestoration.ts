import { HasTarget } from "../../configs";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import TargetResolver from "../../resolvers/TargetResolver";
import ConditionName from "../../types/ConditionName";
import { simpleSpell } from "../common";

const validConditions: ConditionName[] = [
  "Blinded",
  "Deafened",
  "Paralyzed",
  "Poisoned",
];

type HasCondition = { condition: ConditionName };

const LesserRestoration = simpleSpell<HasCondition & HasTarget>({
  name: "Lesser Restoration",
  level: 2,
  school: "Abjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],

  getConfig: (g, caster, method, { target }) => {
    const conditions = target ? target.conditions : new Set(validConditions);

    return {
      target: new TargetResolver(g, caster.reach, true),
      condition: new ChoiceResolver(
        g,
        validConditions.map((value) => ({
          label: value,
          value,
          disabled: !conditions.has(value),
        }))
      ),
    };
  },

  check(g, { condition, target }, ec) {
    if (target && condition && !target.conditions.has(condition))
      ec.add("target does not have condition", LesserRestoration);

    return ec;
  },

  async apply(g, caster, method, { target, condition }) {
    // TODO how do I do this lol
  },
});
export default LesserRestoration;
