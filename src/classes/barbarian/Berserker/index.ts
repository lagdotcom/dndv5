import AbstractAction from "../../../actions/AbstractAction";
import { doStandardAttack } from "../../../actions/WeaponAttack";
import { getItemIcon } from "../../../colours";
import { HasTarget } from "../../../configs";
import Effect from "../../../Effect";
import Engine from "../../../Engine";
import { notImplementedFeature } from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import EvaluateLater from "../../../interruptions/EvaluateLater";
import YesNoChoice from "../../../interruptions/YesNoChoice";
import TargetResolver from "../../../resolvers/TargetResolver";
import AbilityName from "../../../types/AbilityName";
import Combatant from "../../../types/Combatant";
import { WeaponItem } from "../../../types/Item";
import PCSubclass from "../../../types/PCSubclass";
import { getWeaponAbility } from "../../../utils/items";
import { minutes } from "../../../utils/time";
import { RageAction, RageEffect } from "../Rage";
import frenzyUrl from "./icons/frenzy.svg";

class FrenzyAttack extends AbstractAction<HasTarget> {
  ability: AbilityName;

  constructor(
    g: Engine,
    actor: Combatant,
    public weapon: WeaponItem,
  ) {
    super(
      g,
      actor,
      `${weapon.name} (Frenzy)`,
      "implemented",
      { target: new TargetResolver(g, actor.reach + weapon.reach) },
      { damage: [weapon.damage], time: "bonus action" },
    );

    this.ability = getWeaponAbility(actor, weapon);
    this.icon = getItemIcon(weapon);
    this.subIcon = { url: frenzyUrl };
  }

  async apply({ target }: HasTarget) {
    await super.apply({ target });
    await doStandardAttack(this.g, {
      ability: this.ability,
      attacker: this.actor,
      source: this,
      target,
      weapon: this.weapon,
    });
  }
}

const FrenzyEffect = new Effect(
  "Frenzy",
  "turnEnd",
  (g) => {
    g.events.on("GetActions", ({ detail: { who, target, actions } }) => {
      if (who.hasEffect(FrenzyEffect) && who !== target) {
        for (const weapon of who.weapons) {
          if (weapon.rangeCategory === "melee")
            actions.push(new FrenzyAttack(g, who, weapon));
        }
      }
    });

    g.events.on("EffectRemoved", ({ detail: { who, effect, interrupt } }) => {
      if (effect === RageEffect && who.hasEffect(FrenzyEffect)) {
        interrupt.add(
          new EvaluateLater(who, FrenzyEffect, async () => {
            await who.removeEffect(FrenzyEffect);
            await who.changeExhaustion(1);
          }),
        );
      }
    });
  },
  { image: frenzyUrl },
);

const Frenzy = new SimpleFeature(
  "Frenzy",
  `Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.`,
  (g, me) => {
    g.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
      if (action instanceof RageAction && action.actor === me)
        interrupt.add(
          new YesNoChoice(
            me,
            Frenzy,
            "Frenzy",
            `Should ${me.name} enter a Frenzy?`,
            async () => {
              await me.addEffect(FrenzyEffect, { duration: minutes(1) });
            },
          ),
        );
    });
  },
);

const MindlessRage = new SimpleFeature(
  "Mindless Rage",
  `Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.`,
  (g, me) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who === me && me.hasEffect(RageEffect)) {
        conditions.ignoreValue("Charmed");
        conditions.ignoreValue("Frightened");
      }
    });

    g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
      if (
        who.hasEffect(RageEffect) &&
        (config.conditions?.has("Charmed") ||
          config.conditions?.has("Frightened"))
      )
        success.add("fail", MindlessRage);
    });
  },
);

// TODO [FRIGHTENED]
const IntimidatingPresence = notImplementedFeature(
  "Intimidating Presence",
  `Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.

If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.`,
);

// TODO
const Retaliation = notImplementedFeature(
  "Retaliation",
  `Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.`,
);

const Berserker: PCSubclass = {
  className: "Barbarian",
  name: "Path of the Berserker",
  features: new Map([
    [3, [Frenzy]],
    [6, [MindlessRage]],
    [10, [IntimidatingPresence]],
    [14, [Retaliation]],
  ]),
};
export default Berserker;
