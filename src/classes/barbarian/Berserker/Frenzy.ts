import frenzyUrl from "@img/act/frenzy.svg";

import AbstractAction from "../../../actions/AbstractAction";
import { doStandardAttack } from "../../../actions/WeaponAttack";
import { makeIcon } from "../../../colours";
import { HasTarget } from "../../../configs";
import Effect from "../../../Effect";
import Engine from "../../../Engine";
import SimpleFeature from "../../../features/SimpleFeature";
import { notSelf } from "../../../filters";
import EvaluateLater from "../../../interruptions/EvaluateLater";
import YesNoChoice from "../../../interruptions/YesNoChoice";
import TargetResolver from "../../../resolvers/TargetResolver";
import AbilityName from "../../../types/AbilityName";
import Combatant from "../../../types/Combatant";
import { WeaponItem } from "../../../types/Item";
import { getWeaponAbility } from "../../../utils/items";
import { minutes } from "../../../utils/time";
import { RageAction, RageEffect } from "../Rage";

const FrenzyIcon = makeIcon(frenzyUrl);

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
      { target: new TargetResolver(g, actor.reach + weapon.reach, [notSelf]) },
      { icon: weapon.icon, damage: [weapon.damage], time: "bonus action" },
    );

    this.ability = getWeaponAbility(actor, weapon);
    this.subIcon = FrenzyIcon;
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
  { icon: FrenzyIcon },
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
export default Frenzy;
