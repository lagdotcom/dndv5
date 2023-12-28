import frenzyUrl from "@img/act/frenzy.svg";

import WeaponAttack from "../../../actions/WeaponAttack";
import { makeIcon } from "../../../colours";
import Effect from "../../../Effect";
import Engine from "../../../Engine";
import SimpleFeature from "../../../features/SimpleFeature";
import EvaluateLater from "../../../interruptions/EvaluateLater";
import YesNoChoice from "../../../interruptions/YesNoChoice";
import ActionTime from "../../../types/ActionTime";
import Combatant from "../../../types/Combatant";
import { WeaponItem } from "../../../types/Item";
import Priority from "../../../types/Priority";
import { minutes } from "../../../utils/time";
import { RageAction, RageEffect } from "../Rage";

const FrenzyIcon = makeIcon(frenzyUrl);

class FrenzyAttack extends WeaponAttack {
  constructor(
    g: Engine,
    actor: Combatant,
    public weapon: WeaponItem,
  ) {
    super(g, "Frenzy", actor, "melee", weapon);

    this.subIcon = FrenzyIcon;
    this.tags.delete("costs attack");
  }

  getTime(): ActionTime {
    return "bonus action";
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
          new EvaluateLater(who, FrenzyEffect, Priority.Normal, async () => {
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
            Priority.Normal,
            () => me.addEffect(FrenzyEffect, { duration: minutes(1) }),
          ),
        );
    });
  },
);
export default Frenzy;
