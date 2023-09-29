import ActiveEffectArea from "../../ActiveEffectArea";
import { HasPoint } from "../../configs";
import Engine from "../../Engine";
import PointResolver from "../../resolvers/PointResolver";
import { arSet, SpecifiedCube } from "../../types/EffectArea";
import Point from "../../types/Point";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const getArea = (g: Engine, centre: Point): SpecifiedCube => ({
  type: "cube",
  length: 20,
  centre,
});

const EruptingEarth = scalingSpell<HasPoint>({
  name: "Erupting Earth",
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a piece of obsidian",
  lists: ["Druid", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 120) }),
  getAffectedArea: (g, caster, { point }) => point && [getArea(g, point)],
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
    const dc = getSaveDC(attacker, method.ability);

    const shape = getArea(g, point);
    for (const target of g.getInside(shape)) {
      const save = await g.savingThrow(dc, {
        attacker,
        ability: "dex",
        spell: EruptingEarth,
        method,
        who: target,
        tags: svSet(),
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
    );
    g.addEffectArea(area);
  },
});
export default EruptingEarth;
