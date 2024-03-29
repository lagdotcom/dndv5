import iconUrl from "@img/spl/fire-shield.svg";

import { AbstractSelfAction } from "../../actions/AbstractAction";
import { DamageColours, makeIcon } from "../../colours";
import Effect from "../../Effect";
import Engine from "../../Engine";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { makeStringChoice } from "../../interruptions/PickFromListChoice";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import DamageType from "../../types/DamageType";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { distance } from "../../utils/units";
import { simpleSpell } from "../common";
import { affectsSelf } from "../helpers";

type FireShieldType = "warm" | "chill";

const fireShieldTypeChoices = [
  makeStringChoice<FireShieldType>("warm"),
  makeStringChoice<FireShieldType>("chill"),
];

interface Config {
  type: FireShieldType;
}

class DismissFireShield extends AbstractSelfAction {
  constructor(
    g: Engine,
    actor: Combatant,
    private effect: Effect,
  ) {
    super(
      g,
      actor,
      `Dismiss ${effect.name}`,
      "implemented",
      {},
      {
        icon: makeIcon(iconUrl, "silver"),
        time: "action",
        description: `You can dismiss the fire shield early as an action.`,
      },
    );
  }

  async applyEffect() {
    await this.actor.removeEffect(this.effect);
  }
}

const makeFireShieldEffect = (
  type: FireShieldType,
  resist: DamageType,
  retaliate: DamageType,
) => {
  const source = new Effect(
    `Fire Shield (${type})`,
    "turnStart",
    (g) => {
      // TODO [LIGHT] Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet.

      // You can end the spell early by using an action to dismiss it.
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who.hasEffect(source))
          actions.push(new DismissFireShield(g, who, source));
      });

      // The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          const config = who.getEffectConfig(source);
          if (config && damageType === resist) response.add("resist", source);
        },
      );

      // In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield.
      g.events.on("AfterAttack", ({ detail: { attack, interrupt, hit } }) => {
        const { tags, target, who } = attack.roll.type;
        const config = target.hasEffect(source);
        const inRange = distance(who, target) <= 5;
        const isMelee = tags.has("melee");

        if (config && inRange && isMelee && hit)
          interrupt.add(
            new EvaluateLater(target, source, Priority.Late, async () => {
              const rollDamage = await g.rollDamage(2, {
                attacker: target,
                damageType: retaliate,
                size: 8,
                source,
                spell: FireShield,
                tags: atSet("magical"),
              });
              await g.damage(
                source,
                retaliate,
                { attacker: target, spell: FireShield, target: who },
                [[retaliate, rollDamage]],
              );
            }),
          );
      });
    },
    { tags: ["magic"], icon: makeIcon(iconUrl, DamageColours[retaliate]) },
  );
  return source;
};
const WarmFireShieldEffect = makeFireShieldEffect("warm", "cold", "fire");
const ChillFireShieldEffect = makeFireShieldEffect("chill", "fire", "cold");

const FireShield = simpleSpell<Config>({
  status: "incomplete",
  name: "Fire Shield",
  level: 4,
  school: "Evocation",
  v: true,
  s: true,
  m: "a bit of phosphorus or a firefly",
  lists: ["Wizard"],
  description: `Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it.

The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.

In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield.`,
  icon: makeIcon(iconUrl),

  ...affectsSelf,
  getConfig: (g) => ({
    type: new ChoiceResolver(g, "Type", fireShieldTypeChoices),
  }),

  async apply({ caster }, { type }) {
    await caster.addEffect(
      type === "chill" ? ChillFireShieldEffect : WarmFireShieldEffect,
      { duration: minutes(10) },
    );
  },
});
export default FireShield;
