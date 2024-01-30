import iconUrl from "@img/spl/fire-bolt.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { notSelf } from "../../filters";
import { simpleSpell } from "../common";
import {
  aiTargetsOne,
  doesCantripDamage,
  isSpellAttack,
  targetsOne,
} from "../helpers";

const FireBolt = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Fire Bolt",
  icon: makeIcon(iconUrl, DamageColours.fire),
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.

  This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).`,

  ...targetsOne(60, [notSelf]),
  ...isSpellAttack("ranged"),
  ...doesCantripDamage(10, "fire"),
  generateAttackConfigs: aiTargetsOne(60),

  async apply(sh) {
    const { critical, hit, attack, target } = await sh.attack({
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
        damageInitialiser,
        damageType: "fire",
        target,
      });
    }
  },
});
export default FireBolt;
