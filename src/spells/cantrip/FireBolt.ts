import iconUrl from "@img/spl/fire-bolt.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { notSelf } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

const FireBolt = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Fire Bolt",
  icon: makeIcon(iconUrl, DamageColours.fire),
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  isHarmful: true,
  description: `You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.

  This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).`,

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(60, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf]) }),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 10, "fire")],
  getTargets: (g, caster, { target }) => (target ? [target] : []),

  async apply(g, attacker, method, { target }) {
    const rsa = new SpellAttack(g, attacker, FireBolt, method, "ranged", {
      target,
    });

    const { hit, attack } = await rsa.attack(target);
    if (hit) {
      const damage = await rsa.getDamage(attack.pre.target);
      await rsa.damage(attack.pre.target, damage);
    }
  },
});
export default FireBolt;
