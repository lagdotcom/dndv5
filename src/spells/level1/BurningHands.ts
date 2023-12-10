import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { atSet } from "../../types/AttackTag";
import { SpecifiedCone } from "../../types/EffectArea";
import Point from "../../types/Point";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getBurningHandsArea = (centre: Point, target: Point): SpecifiedCone => ({
  type: "cone",
  radius: 15,
  centre,
  target,
});

const BurningHands = scalingSpell<HasPoint>({
  status: "incomplete",
  name: "Burning Hands",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],
  description: `As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.

  The fire ignites any flammable objects in the area that aren't being worn or carried.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,
  isHarmful: true,

  getConfig: (g) => ({
    point: new PointResolver(g, 15),
  }),

  // TODO generateAttackConfigs,

  getAffectedArea: (g, caster, { point }) =>
    point && [getBurningHandsArea(caster.position, point)],
  getAffected: (g, caster, { point }) =>
    g.getInside(getBurningHandsArea(caster.position, point), [caster]),
  getTargets: () => [],
  getDamage: (g, caster, method, { slot }) => [_dd((slot ?? 1) + 2, 6, "fire")],

  async apply(g, caster, method, { point, slot }) {
    const damage = await g.rollDamage(slot + 2, {
      attacker: caster,
      damageType: "fire",
      spell: BurningHands,
      method,
      size: 6,
      source: BurningHands,
      tags: atSet("magical", "spell"),
    });

    for (const target of this.getAffected(g, caster, { point, slot })) {
      const { damageResponse } = await g.save({
        source: BurningHands,
        type: method.getSaveType(caster, BurningHands, slot),
        attacker: caster,
        who: target,
        ability: "dex",
        spell: BurningHands,
        method,
        tags: ["magic"],
      });

      await g.damage(
        BurningHands,
        "fire",
        { attacker: caster, spell: BurningHands, method, target },
        [["fire", damage]],
        damageResponse,
      );
    }

    // TODO The fire ignites any flammable objects in the area that aren't being worn or carried.
  },
});
export default BurningHands;
