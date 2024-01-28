import { DisengageEffect } from "../actions/DisengageAction";
import OpportunityAttack from "../actions/OpportunityAttack";
import Effect from "../Effect";
import Engine from "../Engine";
import SimpleFeature from "../features/SimpleFeature";
import EvaluateLater from "../interruptions/EvaluateLater";
import PickFromListChoice, {
  makeChoice,
} from "../interruptions/PickFromListChoice";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import Priority from "../types/Priority";
import { checkConfig } from "../utils/config";
import { distance } from "../utils/units";

const SentinelEffect = new Effect("Sentinel", "turnEnd", (g) => {
  g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
    if (who.hasEffect(SentinelEffect)) multiplier.add("zero", SentinelEffect);
  });
});

class SentinelRetaliation extends OpportunityAttack {
  constructor(g: Engine, actor: Combatant, weapon: WeaponItem) {
    super(g, actor, weapon);
    this.attackTags = [];
  }
}

const Sentinel = new SimpleFeature(
  "Sentinel",
  `You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits:
- When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.
- Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.
- When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.`,
  (g, me) => {
    // When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.
    g.events.on("AfterAttack", ({ detail: { attack, interrupt, hit } }) => {
      const { who, tags, target } = attack.roll.type;
      if (who === me && tags.has("opportunity") && hit)
        interrupt.add(
          new EvaluateLater(me, Sentinel, Priority.Normal, () =>
            target.addEffect(SentinelEffect, { duration: 1 }),
          ),
        );
    });

    // Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action instanceof OpportunityAttack && action.actor === me)
        error.ignore(DisengageEffect);
    });

    // When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.
    g.events.on("AfterAttack", ({ detail: { attack, interrupt } }) => {
      const { who: attacker, target } = attack.roll.type;
      const inRange = distance(attacker, me) <= 5;
      const notAgainstMe = target !== me;
      const notSentinel = !target.features.has(Sentinel.name);

      if (inRange && notAgainstMe && notSentinel) {
        const config = { target: attacker };
        const choices = me.weapons
          .filter((weapon) => weapon.rangeCategory === "melee")
          .map((weapon) => new SentinelRetaliation(g, me, weapon))
          .map((action) =>
            makeChoice(
              action,
              `attack with ${action.weaponName}`,
              !checkConfig(g, action, config),
            ),
          );
        interrupt.add(
          new PickFromListChoice(
            me,
            Sentinel,
            "Sentinel",
            `${attacker.name} made an attack against ${target.name}. Use ${me.name}'s reaction to retaliate?`,
            Priority.Normal,
            choices,
            (action) => action.apply(config),
            true,
          ),
        );
      }
    });
  },
);
export default Sentinel;
