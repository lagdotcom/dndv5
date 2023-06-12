import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";
import SpellAttack from "../SpellAttack";

const FireBolt = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Fire Bolt",
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),
  getDamage: (g, caster) => [dd(getCantripDice(caster), 10, "fire")],
  getTargets: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { target }) {
    const rsa = new SpellAttack(g, attacker, FireBolt, method, "ranged", {
      target,
    });

    if ((await rsa.attack(target)).hit) {
      const damage = await rsa.getDamage(target);
      await rsa.damage(target, damage);
    }
  },
});
export default FireBolt;
