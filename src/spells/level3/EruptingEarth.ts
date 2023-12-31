import iconUrl from "@img/spl/erupting-earth.svg";

import ActiveEffectArea from "../../ActiveEffectArea";
import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { arSet, SpecifiedCube } from "../../types/EffectArea";
import Point from "../../types/Point";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getEruptingEarthArea = (centre: Point): SpecifiedCube => ({
  type: "cube",
  length: 20,
  centre,
});

const EruptingEarth = scalingSpell<HasPoint>({
  status: "incomplete",
  name: "Erupting Earth",
  icon: makeIcon(iconUrl, DamageColours.bludgeoning),
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a piece of obsidian",
  lists: ["Druid", "Sorcerer", "Wizard"],
  isHarmful: true,
  description: `Choose a point you can see on the ground within range. A fountain of churned earth and stone erupts in a 20-foot cube centered on that point. Each creature in that area must make a Dexterity saving throw. A creature takes 3d12 bludgeoning damage on a failed save, or half as much damage on a successful one. Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d12 for each slot level above 3rd.`,

  // TODO: generateAttackConfigs

  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [getEruptingEarthArea(point)],
  getDamage: (g, caster, method, { slot }) => [
    _dd(slot ?? 3, 12, "bludgeoning"),
  ],
  getTargets: () => [],
  getAffected: (g, caster, { point }) =>
    g.getInside(getEruptingEarthArea(point)),

  async apply(sh, { point }) {
    const damageInitialiser = await sh.rollDamage();

    for (const target of sh.affected) {
      const { damageResponse } = await sh.save({
        ability: "dex",
        who: target,
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "bludgeoning",
        target,
      });
    }

    // TODO [TERRAIN] Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand.
    const area = new ActiveEffectArea(
      "Erupting Earth",
      getEruptingEarthArea(point),
      arSet("difficult terrain"),
      "brown",
      ({ detail: { where, difficult } }) => {
        if (area.points.has(where)) difficult.add("rubble", EruptingEarth);
      },
    );
    sh.g.addEffectArea(area);
  },
});
export default EruptingEarth;
