import iconUrl from "@img/spl/fireball.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { SpecifiedSphere } from "../../types/EffectArea";
import Point from "../../types/Point";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getFireballArea = (centre: Point): SpecifiedSphere => ({
  type: "sphere",
  centre,
  radius: 20,
});

const Fireball = scalingSpell<HasPoint>({
  status: "implemented",
  name: "Fireball",
  icon: makeIcon(iconUrl, DamageColours.fire),
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a tiny ball of bat guano and sulfur",
  lists: ["Sorcerer", "Wizard"],
  isHarmful: true,
  description: `A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.

  The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,

  // TODO: generateAttackConfigs

  getConfig: (g) => ({ point: new PointResolver(g, 150) }),
  getAffectedArea: (g, caster, { point }) => point && [getFireballArea(point)],
  getDamage: (g, caster, method, { slot }) => [_dd(5 + (slot ?? 3), 6, "fire")],
  getTargets: () => [],
  getAffected: (g, caster, { point }) => g.getInside(getFireballArea(point)),

  async apply(sh) {
    // TODO [FLAMMABLE] The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.

    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { damageResponse } = await sh.save({
        ability: "dex",
        who: target,
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "fire",
        target,
      });
    }
  },
});
export default Fireball;
