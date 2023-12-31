import iconUrl from "@img/spl/sacred-flame.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { canSee, notSelf } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const SacredFlame = simpleSpell<HasTarget>({
  status: "incomplete",
  name: "Sacred Flame",
  icon: makeIcon(iconUrl, DamageColours.fire),
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Cleric"],
  isHarmful: true,
  description: `Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(60, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf, canSee]) }),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 8, "radiant")],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(sh, { target }) {
    const damageInitialiser = await sh.rollDamage({ target });

    // TODO The target gains no benefit from cover for this saving throw.
    const { damageResponse } = await sh.save({
      who: target,
      ability: "dex",
      save: "zero",
    });
    await sh.damage({
      damageInitialiser,
      damageResponse,
      damageType: "radiant",
      target,
    });
  },
});
export default SacredFlame;
