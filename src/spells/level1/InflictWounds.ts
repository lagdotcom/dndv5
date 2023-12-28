import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import SpellAttack from "../SpellAttack";

const InflictWounds = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Inflict Wounds",
  level: 1,
  school: "Necromancy",
  v: true,
  s: true,
  lists: ["Cleric"],
  description: `Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.`,

  getConfig: (g, actor) => ({ target: new TargetResolver(g, actor.reach, []) }),

  generateAttackConfigs: (slot, targets, g, caster) =>
    targets.map((target) => ({
      config: { slot, target },
      positioning: poSet(poWithin(caster.reach, target)),
    })),

  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  isHarmful: true,
  getDamage: (g, caster, method, { slot }) => [
    _dd(2 + (slot ?? 1), 10, "necrotic"),
  ],

  async apply(g, caster, method, { slot, target }) {
    const msa = new SpellAttack(g, caster, InflictWounds, method, "melee", {
      slot,
      target,
    });

    const { hit, victim } = await msa.attack(target);
    if (hit) {
      const damage = await msa.getDamage(victim);
      await msa.damage(victim, damage);
    }
  },
});
export default InflictWounds;
