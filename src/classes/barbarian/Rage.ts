import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { LongRestResource } from "../../resources";
import Combatant from "../../types/Combatant";
import { minutes } from "../../utils/time";

function getRageCount(level: number) {
  if (level < 3) return 2;
  if (level < 6) return 3;
  if (level < 12) return 4;
  if (level < 17) return 5;
  if (level < 20) return 6;
  return Infinity;
}

function getRageBonus(level: number) {
  if (level < 9) return 2;
  if (level < 16) return 3;
  return 4;
}

export const RageResource = new LongRestResource("Rage", 2);

class EndRageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "End Rage", {}, "bonus action");
  }

  check(config: never, ec = new ErrorCollector()) {
    if (!this.actor.hasEffect(RageEffect)) ec.add("Not raging", this);

    return ec;
  }

  async apply() {
    super.apply({});
    this.actor.removeEffect(RageEffect);
  }
}

export const RageEffect = new Effect("Rage", "turnStart", (g) => {
  // TODO advantage on Strength checks

  g.events.on("beforeSave", ({ detail: { who, ability, diceType } }) => {
    if (who.hasEffect(RageEffect) && ability === "str")
      diceType.add("advantage", RageEffect);
  });

  g.events.on(
    "gatherDamage",
    ({ detail: { attacker, attack, weapon, bonus } }) => {
      if (
        attacker.hasEffect(RageEffect) &&
        attack?.pre.type === "melee" &&
        weapon
      )
        bonus.add(
          getRageBonus(attacker.classLevels.get("Barbarian") ?? 0),
          RageEffect
        );
    }
  );

  g.events.on(
    "getDamageResponse",
    ({ detail: { who, damageType, response } }) => {
      if (
        who.hasEffect(RageEffect) &&
        ["bludgeoning", "piercing", "slashing"].includes(damageType)
      )
        response.add("resist", RageEffect);
    }
  );

  // TODO It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then.

  g.events.on("getActions", ({ detail: { who, actions } }) => {
    if (who.hasEffect(RageEffect)) actions.push(new EndRageAction(g, who));
  });
});

class RageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Rage", {}, "bonus action");
  }

  check(config: never, ec = new ErrorCollector()) {
    if (!this.actor.hasResource(RageResource)) ec.add("No rages left", this);

    return super.check(config, ec);
  }

  async apply() {
    super.apply({});
    this.actor.spendResource(RageResource);
    this.actor.addEffect(RageEffect, minutes(1));
    // TODO lose concentration
  }
}

const Rage = new SimpleFeature(
  "Rage",
  `In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.

While raging, you gain the following benefits if you aren't wearing heavy armor:

- You have advantage on Strength checks and Strength saving throws.
- When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.
- You have resistance to bludgeoning, piercing, and slashing damage.

If you are able to cast spells, you can't cast them or concentrate on them while raging.

Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.

Once you have raged the maximum number of times for your barbarian level, you must finish a long rest before you can rage again. You may rage 2 times at 1st level, 3 at 3rd, 4 at 6th, 5 at 12th, and 6 at 17th.`,
  (g, me) => {
    me.initResource(
      RageResource,
      getRageCount(me.classLevels.get("Barbarian") ?? 0)
    );

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me && !me.hasEffect(RageEffect))
        actions.push(new RageAction(g, who));
    });
  }
);
export default Rage;
