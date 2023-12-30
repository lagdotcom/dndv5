import iconUrl from "@img/spl/shocking-grasp.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

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
  isHarmful: true,

  getConfig: (g, caster) => ({
    target: new TargetResolver(g, caster.reach, []),
  }),
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  getDamage: (g, caster) => [_dd(getCantripDice(caster), 8, "lightning")],

  async apply(g, caster, method, { target }) {
    const msa = new SpellAttack(g, caster, ShockingGrasp, method, "melee", {
      target,
    });

    const { hit, victim } = await msa.attack(
      target,
      target.armor?.metal ? "advantage" : undefined,
    );
    if (hit) {
      const damage = await msa.getDamage(victim);
      await msa.damage(victim, damage);
      await victim.addEffect(ShockingGraspEffect, { duration: 1 }, caster);
    }
  },
});
export default ShockingGrasp;
