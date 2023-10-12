import AbstractAction from "../../actions/AbstractAction";
import ErrorCollector from "../../collectors/ErrorCollector";
import { makeIcon } from "../../colours";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { LongRestResource } from "../../resources";
import Combatant from "../../types/Combatant";
import { MundaneDamageTypes } from "../../types/DamageType";
import { hasAll } from "../../utils/set";
import { minutes } from "../../utils/time";
import endRageIconUrl from "./icons/end-rage.svg";
import rageIconUrl from "./icons/rage.svg";

const RageIcon = makeIcon(rageIconUrl);
const EndRageIcon = makeIcon(endRageIconUrl);

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

export class EndRageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "End Rage",
      "implemented",
      {},
      { icon: EndRageIcon, time: "bonus action" },
    );
  }

  check(config: never, ec: ErrorCollector) {
    if (!this.actor.hasEffect(RageEffect)) ec.add("Not raging", this);

    return ec;
  }

  async apply() {
    await super.apply({});
    await this.actor.removeEffect(RageEffect);
  }
}

function isRaging(who: Combatant) {
  return who.hasEffect(RageEffect) && who.armor?.category !== "heavy";
}

const DidAttackTag = new Effect("(Attacked)", "turnStart", undefined, {
  quiet: true,
});
const TookDamageTag = new Effect("(Damaged)", "turnEnd", undefined, {
  quiet: true,
});

export const RageEffect = new Effect(
  "Rage",
  "turnStart",
  (g) => {
    // You have advantage on Strength checks and Strength saving throws.
    g.events.on("BeforeCheck", ({ detail: { who, ability, diceType } }) => {
      if (isRaging(who) && ability === "str")
        diceType.add("advantage", RageEffect);
    });
    g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      if (isRaging(who) && ability === "str")
        diceType.add("advantage", RageEffect);
    });

    // When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, ability, bonus } }) => {
        if (
          isRaging(attacker) &&
          hasAll(attack?.pre.tags, ["melee", "weapon"]) &&
          ability === "str"
        )
          bonus.add(
            getRageBonus(attacker.classLevels.get("Barbarian") ?? 0),
            RageEffect,
          );
      },
    );

    // You have resistance to bludgeoning, piercing, and slashing damage.
    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (isRaging(who) && MundaneDamageTypes.includes(damageType))
          response.add("resist", RageEffect);
      },
    );

    // If you are able to cast spells, you can't cast them or concentrate on them while raging.
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.actor.hasEffect(RageEffect) && action.isSpell)
        error.add("cannot cast spells", RageEffect);
    });

    // It ends early if you are knocked unconscious
    g.events.on("EffectAdded", ({ detail: { who, interrupt } }) => {
      if (isRaging(who) && who.conditions.has("Unconscious"))
        interrupt.add(
          new EvaluateLater(who, RageEffect, async () => {
            await who.removeEffect(RageEffect);
          }),
        );
    });

    // ...or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then.
    g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
      if (isRaging(pre.who) && pre.who.side !== pre.target.side)
        interrupt.add(
          new EvaluateLater(pre.who, RageEffect, async () => {
            await pre.who.addEffect(DidAttackTag, { duration: Infinity });
          }),
        );
    });
    g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
      if (isRaging(who))
        interrupt.add(
          new EvaluateLater(who, RageEffect, async () => {
            await who.addEffect(TookDamageTag, { duration: Infinity });
          }),
        );
    });
    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      if (who.hasEffect(RageEffect)) {
        if (!who.hasEffect(DidAttackTag) && !who.hasEffect(TookDamageTag))
          interrupt.add(
            new EvaluateLater(who, RageEffect, async () => {
              await who.removeEffect(RageEffect);
            }),
          );
        else
          interrupt.add(
            new EvaluateLater(who, RageEffect, async () => {
              await who.removeEffect(DidAttackTag);
              await who.removeEffect(TookDamageTag);
            }),
          );
      }
    });

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.hasEffect(RageEffect)) actions.push(new EndRageAction(g, who));
    });
  },
  { icon: RageIcon },
);

export class RageAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Rage",
      "incomplete",
      {},
      {
        icon: RageIcon,
        time: "bonus action",
        resources: [[RageResource, 1]],
        description: `On your turn, you can enter a rage as a bonus action.

While raging, you gain the following benefits if you aren't wearing heavy armor:

- You have advantage on Strength checks and Strength saving throws.
- When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.
- You have resistance to bludgeoning, piercing, and slashing damage.

If you are able to cast spells, you can't cast them or concentrate on them while raging.

Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.`,
      },
    );
  }

  async apply() {
    await super.apply({});
    if (await this.actor.addEffect(RageEffect, { duration: minutes(1) }))
      await this.actor.endConcentration();
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
      getRageCount(me.classLevels.get("Barbarian") ?? 0),
    );

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me && !me.hasEffect(RageEffect))
        actions.push(new RageAction(g, who));
    });
  },
);
export default Rage;
