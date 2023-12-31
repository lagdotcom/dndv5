import iconUrl from "@img/spl/ray-of-frost.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { notSelf } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const RayOfFrostIcon = makeIcon(iconUrl, DamageColours.cold);

// TODO this is technically wrong, the effect should run out "at the start of your next turn."
const RayOfFrostEffect = new Effect(
  "Ray of Frost",
  "turnStart",
  (g) => {
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(RayOfFrostEffect)) bonus.add(-10, RayOfFrostEffect);
    });
  },
  { icon: RayOfFrostIcon, tags: ["magic"] },
);

const RayOfFrost = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Ray of Frost",
  icon: RayOfFrostIcon,
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
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 8, "cold")],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(sh) {
    const { attack, critical, hit, target } = await sh.attack({
      target: sh.config.target,
      type: "ranged",
    });
    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        target,
        tags: ["ranged"],
      });
      await sh.damage({
        attack,
        critical,
        target,
        damageInitialiser,
        damageType: "cold",
      });
      await target.addEffect(RayOfFrostEffect, { duration: 2 }, sh.caster);
    }
  },
});
export default RayOfFrost;
