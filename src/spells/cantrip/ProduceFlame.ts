import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

// TODO this isn't just a normal attack spell, though it can be used as one

const ProduceFlame = simpleSpell<HasTarget>({
  status: "incomplete",
  name: "Produce Flame",
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Druid"],
  description: `A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.

  You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.
  
  This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
  isHarmful: true,

  getConfig: (g) => ({ target: new TargetResolver(g, 30, []) }),

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(30, target)),
    })),

  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 8, "fire")],

  async apply(g, caster, method, { target }) {
    // TODO
    const rsa = new SpellAttack(g, caster, ProduceFlame, method, "ranged", {
      target,
    });

    const { hit, victim } = await rsa.attack(target);
    if (hit) {
      const damage = await rsa.getDamage(victim);
      await rsa.damage(victim, damage);
    }
  },
});
export default ProduceFlame;
