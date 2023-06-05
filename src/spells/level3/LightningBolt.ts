import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import { dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const LightningBolt = scalingSpell<HasPoint>({
  implemented: true,
  name: "Lightning Bolt",
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a bit of fur and a rod of amber, crystal, or glass",
  lists: ["Sorcerer", "Wizard"],

  getConfig: (g) => ({ point: new PointResolver(g, 100) }),
  getDamage: (g, caster, { slot }) => [dd((slot ?? 3) + 5, 6, "lightning")],
  getAffectedArea: (g, caster, { point }) =>
    point && [
      {
        type: "line",
        length: 100,
        width: 5,
        start: g.getState(caster).position,
        target: point,
      },
    ],

  async apply(g, attacker, method, { slot, point }) {
    const damage = await g.rollDamage(5 + slot, {
      size: 6,
      spell: LightningBolt,
      method,
      damageType: "lightning",
      attacker,
    });
    const dc = getSaveDC(attacker, method.ability);

    // TODO The lightning ignites flammable objects in the area that aren't being worn or carried.

    for (const target of g.getInside({
      type: "line",
      length: 100,
      width: 5,
      start: g.getState(attacker).position,
      target: point,
    })) {
      const save = await g.savingThrow(dc, {
        attacker,
        ability: "dex",
        spell: LightningBolt,
        method,
        who: target,
        tags: new Set(),
      });

      const mul = save ? 0.5 : 1;
      await g.damage(
        LightningBolt,
        "lightning",
        { attacker, spell: LightningBolt, method, target },
        [["lightning", damage]],
        mul
      );
    }
  },
});
export default LightningBolt;
