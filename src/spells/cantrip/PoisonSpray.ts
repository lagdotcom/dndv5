import { HasTarget } from "../../configs";
import { canSee } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { atSet } from "../../types/AttackTag";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const PoisonSpray = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Poison Spray",
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Druid", "Sorcerer", "Warlock", "Wizard"],
  isHarmful: true,
  description: `You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.

  This spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).`,

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(10, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 10, [canSee]) }),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 6, "acid")],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { target }) {
    const { damageResponse } = await g.save({
      source: PoisonSpray,
      type: method.getSaveType(attacker, PoisonSpray),
      who: target,
      attacker,
      ability: "con",
      spell: PoisonSpray,
      method,
      save: "zero",
      tags: ["magic", "poison"],
    });

    const damage = await g.rollDamage(getCantripDice(attacker), {
      attacker,
      damageType: "poison",
      spell: PoisonSpray,
      method,
      size: 12,
      source: PoisonSpray,
      target,
      tags: atSet("magical", "spell"),
    });

    await g.damage(
      PoisonSpray,
      "poison",
      { attacker, target, spell: PoisonSpray, method },
      [["poison", damage]],
      damageResponse,
    );
  },
});
export default PoisonSpray;
