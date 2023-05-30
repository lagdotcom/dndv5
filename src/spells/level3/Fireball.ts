import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const Fireball = scalingSpell<HasPoint>({
  name: "Fireball",
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a tiny ball of bat guano and sulfur",
  lists: ["Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),

  getAffectedArea: (g, { point }) =>
    point && [{ type: "sphere", centre: point, radius: 20 }],

  getDamage: (g, caster, { slot }) => [dd(5 + (slot ?? 3), 6, "fire")],

  async apply(g, attacker, method, { point, slot }) {
    const damage = await g.rollDamage(5 + slot, {
      size: 6,
      spell: Fireball,
      method,
      damageType: "fire",
      attacker,
    });
    const dc = getSaveDC(attacker, method.ability);

    for (const target of g.getInside({
      type: "sphere",
      centre: point,
      radius: 20,
    })) {
      const save = await g.savingThrow(dc, {
        attacker,
        ability: "dex",
        spell: Fireball,
        method,
        who: target,
      });

      const mul = save ? 0.5 : 1;
      await g.damage(
        Fireball,
        "fire",
        { attacker, spell: Fireball, method, target },
        [["fire", damage]],
        mul
      );
    }
  },
});
export default Fireball;
