import iconUrl from "@img/spl/ray-of-frost.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { notSelf } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

// TODO this is technically wrong, the effect should run out "at the start of your next turn."
const RayOfFrostEffect = new Effect("Ray of Frost", "turnStart", (g) => {
  g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
    if (who.hasEffect(RayOfFrostEffect)) bonus.add(-10, RayOfFrostEffect);
  });
});

const RayOfFrost = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Ray of Frost",
  icon: makeIcon(iconUrl, DamageColours.cold),
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  isHarmful: true,
  description: `A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(60, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf]) }),
  getDamage: (_, caster) => [_dd(getCantripDice(caster), 8, "cold")],
  getTargets: (g, caster, { target }) => (target ? [target] : []),

  async apply(g, attacker, method, { target }) {
    const rsa = new SpellAttack(g, attacker, RayOfFrost, method, "ranged", {
      target,
    });

    const { hit, attack } = await rsa.attack(target);
    if (hit) {
      const damage = await rsa.getDamage(attack.pre.target);
      await rsa.damage(attack.pre.target, damage);

      await attack.pre.target.addEffect(
        RayOfFrostEffect,
        { duration: 2 },
        attacker,
      );
    }
  },
});
export default RayOfFrost;
