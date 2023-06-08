import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

// TODO this is technically wrong, the effect should run out "at the start of your next turn."
const RayOfFrostEffect = new Effect("Ray of Frost", "turnEnd", (g) => {
  g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
    if (who.hasEffect(RayOfFrostEffect)) bonus.add(-10, RayOfFrostEffect);
  });
});

const RayOfFrost = simpleSpell<HasTarget>({
  implemented: true,
  name: "Ray of Frost",
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),
  getDamage: (_, caster) => [dd(getCantripDice(caster), 8, "cold")],

  async apply(g, attacker, method, { target }) {
    const rsa = new SpellAttack(g, attacker, RayOfFrost, method, "ranged", {
      target,
    });

    if ((await rsa.attack(target)).hit) {
      const damage = await rsa.getDamage(target);
      await rsa.damage(target, damage);

      target.addEffect(RayOfFrostEffect, { duration: 1 });
    }
  },
});
export default RayOfFrost;
