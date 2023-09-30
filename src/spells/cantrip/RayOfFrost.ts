import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
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
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),
  getDamage: (_, caster) => [_dd(getCantripDice(caster), 8, "cold")],
  getTargets: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { target }) {
    const rsa = new SpellAttack(g, attacker, RayOfFrost, method, "ranged", {
      target,
    });

    if ((await rsa.attack(target)).hit) {
      const damage = await rsa.getDamage(target);
      await rsa.damage(target, damage);

      await target.addEffect(RayOfFrostEffect, { duration: 2 }, attacker);
    }
  },
});
export default RayOfFrost;
