import OpportunityAttack from "../../../actions/OpportunityAttack";
import { HasTarget } from "../../../configs";
import Effect from "../../../Effect";
import { notImplementedFeature } from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import EvaluateLater from "../../../interruptions/EvaluateLater";
import PCSubclass from "../../../types/PCSubclass";
import Priority from "../../../types/Priority";
import { distance } from "../../../utils/units";
import { addSneakAttackMethod } from "../SneakAttack";

const FancyFootworkEffect = new Effect<HasTarget>(
  "Fancy Footwork",
  "turnStart",
  (g) => {
    g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
      const ffConfig = action.actor.getEffectConfig(FancyFootworkEffect);

      if (
        action instanceof OpportunityAttack &&
        ffConfig &&
        (config as HasTarget).target === ffConfig?.target
      )
        error.add("unable", FancyFootworkEffect);
    });
  },
);

const FancyFootwork = new SimpleFeature(
  "Fancy Footwork",
  `When you choose this archetype at 3rd level, you learn how to land a strike and then slip away without reprisal. During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.`,
  (g, me) => {
    g.events.on("AfterAttack", ({ detail: { attack, interrupt, target } }) => {
      if (attack.roll.type.who === me && attack.roll.type.tags.has("melee"))
        interrupt.add(
          new EvaluateLater(me, FancyFootwork, Priority.Normal, () =>
            target.addEffect(
              FancyFootworkEffect,
              { duration: 1, target: me },
              me,
            ),
          ),
        );
    });

    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      if (who === me)
        for (const other of g.combatants)
          if (other.getEffectConfig(FancyFootworkEffect)?.target === me)
            interrupt.add(
              new EvaluateLater(me, FancyFootwork, Priority.Normal, () =>
                other.removeEffect(FancyFootworkEffect),
              ),
            );
    });
  },
);

const RakishAudacity = new SimpleFeature(
  "Rakish Audacity",
  `Starting at 3rd level, your confidence propels you into battle. You can give yourself a bonus to your initiative rolls equal to your Charisma modifier.

You also gain an additional way to use your Sneak Attack; you don't need advantage on your attack roll to use Sneak Attack against a creature if you are within 5 feet of it, no other creatures are within 5 feet of you, and you don't have disadvantage on the attack roll. All the other rules for Sneak Attack still apply to you.`,
  (g, me) => {
    // TODO this should technically be optional
    g.events.on("GetInitiative", ({ detail: { who, bonus } }) => {
      if (who === me && me.cha.modifier > 0)
        bonus.add(me.cha.modifier, RakishAudacity);
    });

    addSneakAttackMethod(me, (g, target, attack) => {
      const inRange = distance(me, target) <= 5;
      const justUs =
        Array.from(g.combatants).filter((other) => distance(me, other) <= 5)
          .length === 2;
      const noDisadvantage = !attack.pre.diceType
        .getValues()
        .includes("disadvantage");

      return inRange && justUs && noDisadvantage;
    });
  },
);

// TODO
const Panache = notImplementedFeature(
  "Panache",
  `At 9th level, your charm becomes extraordinarily beguiling. As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. The creature must be able to hear you, and the two of you must share a language.

If you succeed on the check and the creature is hostile to you, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you. This effect lasts for 1 minute, until one of your companions attacks the target or affects it with a spell, or until you and the target are more than 60 feet apart.

If you succeed on the check and the creature isn't hostile to you, it is charmed by you for 1 minute. While charmed, it regards you as a friendly acquaintance. This effect ends immediately if you or your companions do anything harmful to it.`,
);

// TODO
const ElegantManeuver = notImplementedFeature(
  "Elegant Maneuver",
  `Starting at 13th level, you can use a bonus action on your turn to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn.`,
);

// TODO
const MasterDuelist = notImplementedFeature(
  "Master Duelist",
  `Beginning at 17th level, your mastery of the blade lets you turn failure into success in combat. If you miss with an attack roll, you can roll it again with advantage. Once you do so, you can't use this feature again until you finish a short or long rest.`,
);

const Swashbuckler: PCSubclass = {
  name: "Swashbuckler",
  className: "Rogue",
  features: new Map([
    [3, [FancyFootwork, RakishAudacity]],
    [9, [Panache]],
    [13, [ElegantManeuver]],
    [17, [MasterDuelist]],
  ]),
};
export default Swashbuckler;
