import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import Combatant from "../../types/Combatant";
import { SpecifiedCone } from "../../types/EffectArea";
import Point from "../../types/Point";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getConeOfColdArea = (
  caster: Combatant,
  target: Point,
): SpecifiedCone => ({
  type: "cone",
  radius: 60,
  centre: caster.position,
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
  isHarmful: true,
  description: `A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.

  A creature killed by this spell becomes a frozen statue until it thaws.

  At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.`,

  // TODO: generateAttackConfigs

  getConfig: (g) => ({ point: new PointResolver(g, 60) }),
  getDamage: (g, caster, method, { slot }) => [_dd(3 + (slot ?? 5), 8, "cold")],
  getAffectedArea: (g, caster, { point }) =>
    point && [getConeOfColdArea(caster, point)],
  getTargets: () => [],
  getAffected: (g, caster, { point }) =>
    g.getInside(getConeOfColdArea(caster, point)),

  async apply(sh) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { damageResponse } = await sh.save({
        ability: "con",
        who: target,
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "cold",
        target,
      });

      // TODO A creature killed by this spell becomes a frozen statue until it thaws.
    }
  },
});
export default ConeOfCold;
