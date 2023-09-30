import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import PointResolver from "../../resolvers/PointResolver";
import Combatant from "../../types/Combatant";
import { SpecifiedCone } from "../../types/EffectArea";
import Point from "../../types/Point";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const getArea = (
  g: Engine,
  caster: Combatant,
  target: Point
): SpecifiedCone => ({
  type: "cone",
  radius: 60,
  centre: g.getState(caster).position,
  target,
});

const ConeOfCold = scalingSpell<HasPoint>({
  status: "implemented",
  name: "Cone of Cold",
  level: 5,
  school: "Evocation",
  v: true,
  s: true,
  m: "a small crystal or glass cone",
  lists: ["Sorcerer", "Wizard"],
  description: `A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.

  A creature killed by this spell becomes a frozen statue until it thaws.

  At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.`,

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getDamage: (g, caster, method, { slot }) => [_dd(3 + (slot ?? 5), 8, "cold")],
  getAffectedArea: (g, caster, { point }) =>
    point && [getArea(g, caster, point)],
  getTargets: (g, caster, { point }) => g.getInside(getArea(g, caster, point)),

  async apply(g, attacker, method, { slot, point }) {
    const damage = await g.rollDamage(3 + slot, {
      source: ConeOfCold,
      size: 8,
      spell: ConeOfCold,
      method,
      damageType: "cold",
      attacker,
    });
    const dc = getSaveDC(attacker, method.ability);

    for (const target of g.getInside(getArea(g, attacker, point))) {
      const save = await g.savingThrow(dc, {
        attacker,
        ability: "con",
        spell: ConeOfCold,
        method,
        who: target,
        tags: svSet(),
      });

      await g.damage(
        ConeOfCold,
        "cold",
        { attacker, spell: ConeOfCold, method, target },
        [["cold", damage]],
        save.damageResponse
      );

      // TODO A creature killed by this spell becomes a frozen statue until it thaws.
    }
  },
});
export default ConeOfCold;
