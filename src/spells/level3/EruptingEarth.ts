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
  description: `Choose a point you can see on the ground within range. A fountain of churned earth and stone erupts in a 20-foot cube centered on that point. Each creature in that area must make a Dexterity saving throw. A creature takes 3d12 bludgeoning damage on a failed save, or half as much damage on a successful one. Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d12 for each slot level above 3rd.`,

  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getAffectedArea: (g, caster, { point }) =>
    point && [getEruptingEarthArea(point)],
  getDamage: (g, caster, method, { slot }) => [
    _dd(slot ?? 3, 12, "bludgeoning"),
  ],
  getTargets: () => [],

  async apply(g, attacker, method, { point, slot }) {
    const damage = await g.rollDamage(slot, {
      source: EruptingEarth,
      size: 12,
      spell: EruptingEarth,
      method,
      damageType: "bludgeoning",
      attacker,
    });

    const shape = getEruptingEarthArea(point);
    for (const target of g.getInside(shape)) {
      const save = await g.save({
        source: EruptingEarth,
        type: method.getSaveType(attacker, EruptingEarth, slot),
        attacker,
        ability: "dex",
        spell: EruptingEarth,
        method,
        who: target,
      });

      await g.damage(
        EruptingEarth,
        "bludgeoning",
        { attacker, spell: EruptingEarth, method, target },
        [["bludgeoning", damage]],
        save.damageResponse,
      );
    }

    // TODO [TERRAIN] Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand.
    const area = new ActiveEffectArea(
      "Erupting Earth",
      shape,
      arSet("difficult terrain"),
      "brown",
    );
    g.addEffectArea(area);
  },
});
export default EruptingEarth;
