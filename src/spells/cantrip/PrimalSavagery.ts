import { HasTarget } from "../../configs";
import { notSelf } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

const PrimalSavagery = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Primal Savagery",
  level: 0,
  school: "Transmutation",
  s: true,
  lists: ["Druid"],
  isHarmful: true,
  description: `You channel primal magic to cause your teeth or fingernails to sharpen, ready to deliver a corrosive attack. Make a melee spell attack against one creature within 5 feet of you. On a hit, the target takes 1d10 acid damage. After you make the attack, your teeth or fingernails return to normal.

  The spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).`,

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(5, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 5, [notSelf]) }),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 10, "acid")],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { target }) {
    const rsa = new SpellAttack(g, attacker, PrimalSavagery, method, "melee", {
      target,
    });

    const { hit, victim } = await rsa.attack(target);
    if (hit) {
      const damage = await rsa.getDamage(victim);
      await rsa.damage(victim, damage);
    }
  },
});
export default PrimalSavagery;
