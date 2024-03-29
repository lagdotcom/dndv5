import iconUrl from "@img/spl/shocking-grasp.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { simpleSpell } from "../common";
import {
  aiTargetsByTouch,
  doesCantripDamage,
  isSpellAttack,
  targetsByTouch,
} from "../helpers";

const ShockingGraspIcon = makeIcon(iconUrl, DamageColours.lightning);

const ShockingGraspEffect = new Effect(
  "Shocking Grasp",
  "turnStart",
  (g) => {
    g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
      if (
        action.actor.hasEffect(ShockingGraspEffect) &&
        action.getTime(config) == "reaction"
      )
        error.add("can't take reactions", ShockingGraspEffect);
    });
  },
  { icon: ShockingGraspIcon, tags: ["magic"] },
);

const ShockingGrasp = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Shocking Grasp",
  icon: ShockingGraspIcon,
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can't take reactions until the start of its next turn.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,

  ...targetsByTouch([]),
  ...isSpellAttack("melee"),
  ...doesCantripDamage(8, "lightning"),
  generateAttackConfigs: aiTargetsByTouch,

  async apply(sh, { target: originalTarget }) {
    // TODO this obviously doesn't switch target well
    const { attack, critical, hit, target } = await sh.attack({
      target: originalTarget,
      diceType: originalTarget.armor?.metal ? "advantage" : undefined,
      type: "melee",
    });
    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        target,
        tags: ["melee"],
      });
      await sh.damage({
        attack,
        critical,
        damageInitialiser,
        damageType: "lightning",
        target,
      });
      await target.addEffect(ShockingGraspEffect, { duration: 1 }, sh.caster);
    }
  },
});
export default ShockingGrasp;
