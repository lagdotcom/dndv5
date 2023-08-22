import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const getArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 20,
});

const Fireball = scalingSpell<HasPoint>({
  status: "implemented",
  name: "Fireball",
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a tiny ball of bat guano and sulfur",
  lists: ["Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),
  getAffectedArea: (g, caster, { point }) => point && [getArea(point)],
  getDamage: (g, caster, { slot }) => [_dd(5 + (slot ?? 3), 6, "fire")],
  getTargets: (g, caster, { point }) => g.getInside(getArea(point)),

  async apply(g, attacker, method, { point, slot }) {
    const damage = await g.rollDamage(5 + slot, {
      source: Fireball,
      size: 6,
      spell: Fireball,
      method,
      damageType: "fire",
      attacker,
    });
    const dc = getSaveDC(attacker, method.ability);

    // TODO [FLAMMABLE] The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.

    for (const target of g.getInside(getArea(point))) {
      const save = await g.savingThrow(dc, {
        attacker,
        ability: "dex",
        spell: Fireball,
        method,
        who: target,
        tags: new Set(),
      });

      await g.damage(
        Fireball,
        "fire",
        { attacker, spell: Fireball, method, target },
        [["fire", damage]],
        save.damageResponse,
      );
    }
  },
});
export default Fireball;
