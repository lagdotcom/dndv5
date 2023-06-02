import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

// TODO this is technically wrong, the effect should run out "at the start of your next turn."
const RayOfFrostEffect = new Effect("Ray of Frost", "turnEnd", (g) => {
  g.events.on("getSpeed", ({ detail: { who, bonus } }) => {
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
    const { attack, critical, hit } = await g.attack({
      who: attacker,
      type: "ranged",
      target,
      ability: method.ability,
      spell: RayOfFrost,
      method,
    });

    if (hit) {
      const amount = await g.rollDamage(
        getCantripDice(attacker),
        {
          size: 8,
          damageType: "cold",
          attacker,
          target,
          spell: RayOfFrost,
          method,
        },
        critical
      );

      await g.damage(
        RayOfFrost,
        "cold",
        { attack, attacker, target, critical, spell: RayOfFrost, method },
        [["cold", amount]]
      );

      target.addEffect(RayOfFrostEffect, 1);
    }
  },
});
export default RayOfFrost;
