import { HasCaster, HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

const ChillTouchEffect = new Effect<HasCaster>(
  "Chill Touch",
  "turnStart",
  (g) => {
    // [I]t can't regain hit points until the start of your next turn. Until then, the hand clings to the target.
    g.events.on("GatherHeal", ({ detail: { target, multiplier } }) => {
      if (target.hasEffect(ChillTouchEffect))
        multiplier.add("zero", ChillTouchEffect);
    });

    // If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.
    g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      const config = who.getEffectConfig(ChillTouchEffect);
      if (who.type === "undead" && config && target === config.caster)
        diceType.add("disadvantage", ChillTouchEffect);
    });
  },
  { tags: ["magic"] },
);

const ChillTouch = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Chill Touch",
  level: 0,
  school: "Necromancy",
  v: true,
  s: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target.

  If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.
  
  This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
  isHarmful: true,

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(120, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 120, []) }),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 8, "necrotic")],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => [target],

  async apply(g, caster, method, { target }) {
    const rsa = new SpellAttack(g, caster, ChillTouch, method, "ranged", {
      target,
    });

    const { hit, victim } = await rsa.attack(target);
    if (hit) {
      const damage = await rsa.getDamage(victim);
      await rsa.damage(victim, damage);
      await target.addEffect(
        ChillTouchEffect,
        { duration: 2, caster, method },
        caster,
      );
    }
  },
});
export default ChillTouch;
