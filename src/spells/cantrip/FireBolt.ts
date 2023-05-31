import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const FireBolt = simpleSpell<HasTarget>({
  name: "Fire Bolt",
  level: 0,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),
  getDamage: (_, caster) => [dd(getCantripDice(caster), 10, "fire")],

  async apply(g, attacker, method, { target }) {
    const { attack, critical, hit } = await g.attack({
      who: attacker,
      target,
      ability: method.ability,
      spell: FireBolt,
      method,
    });

    if (hit) {
      const amount = await g.rollDamage(
        getCantripDice(attacker),
        {
          size: 10,
          damageType: "fire",
          attacker,
          target,
          spell: FireBolt,
          method,
        },
        critical
      );

      await g.damage(
        FireBolt,
        "fire",
        { attack, attacker, target, critical, spell: FireBolt, method },
        [["fire", amount]]
      );
    }
  },
});
export default FireBolt;
