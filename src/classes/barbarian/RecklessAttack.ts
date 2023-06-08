import Effect from "../../Effect";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import { TurnResource } from "../../resources";
import AbilityName from "../../types/AbilityName";
import AttackTag from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { hasAll } from "../../utils/set";

const RecklessAttackResource = new TurnResource("Reckless Attack", 1);

function canBeReckless(
  who: Combatant,
  tags: Set<AttackTag>,
  ability: AbilityName
) {
  return (
    who.hasEffect(RecklessAttackEffect) &&
    hasAll(tags, ["melee", "weapon"]) &&
    ability === "str"
  );
}

const RecklessAttackEffect = new Effect("Reckless Attack", "turnStart", (g) => {
  g.events.on(
    "BeforeAttack",
    ({ detail: { who, target, diceType, ability, tags } }) => {
      if (canBeReckless(who, tags, ability))
        diceType.add("advantage", RecklessAttackEffect);

      if (target.hasEffect(RecklessAttackEffect))
        diceType.add("advantage", RecklessAttackEffect);
    }
  );
});

export const RecklessAttack = new SimpleFeature(
  "Reckless Attack",
  `Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.`,
  (g, me) => {
    me.initResource(RecklessAttackResource);

    g.events.on(
      "BeforeAttack",
      ({ detail: { who, interrupt, tags, ability, diceType } }) => {
        if (who === me && me.hasResource(RecklessAttackResource)) {
          me.spendResource(RecklessAttackResource);
          interrupt.add(
            new YesNoChoice(
              me,
              RecklessAttack,
              "Reckless Attack",
              `Get advantage on all melee weapon attack rolls using Strength this turn at the cost of all incoming attacks having advantage?`,
              async () => {
                me.addEffect(RecklessAttackEffect, { duration: 1 });

                // need this because the Effect handler happens first
                if (canBeReckless(who, tags, ability))
                  diceType.add("advantage", RecklessAttackEffect);
              }
            )
          );
        }
      }
    );
  }
);
