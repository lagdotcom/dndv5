import iconUrl from "@img/spl/lightning-bolt.svg";

import { aimLine } from "../../aim";
import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import PointResolver from "../../resolvers/PointResolver";
import Combatant from "../../types/Combatant";
import Point from "../../types/Point";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getLightningBoltArea = (actor: Combatant, point: Point) =>
  aimLine(actor.position, actor.sizeInUnits, point, 100, 5);

const LightningBolt = scalingSpell<HasPoint>({
  status: "implemented",
  name: "Lightning Bolt",
  icon: makeIcon(iconUrl, DamageColours.lightning),
  level: 3,
  school: "Evocation",
  v: true,
  s: true,
  m: "a bit of fur and a rod of amber, crystal, or glass",
  lists: ["Sorcerer", "Wizard"],
  isHarmful: true,
  description: `A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.

  The lightning ignites flammable objects in the area that aren't being worn or carried.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,

  // TODO: generateAttackConfigs

  getConfig: (g) => ({ point: new PointResolver(g, 100) }),
  getDamage: (g, caster, method, { slot }) => [
    _dd((slot ?? 3) + 5, 6, "lightning"),
  ],
  getAffectedArea: (g, caster, { point }) =>
    point && [getLightningBoltArea(caster, point)],
  getTargets: (g, caster, { point }) =>
    g.getInside(getLightningBoltArea(caster, point)),

  async apply(g, attacker, method, { slot, point }) {
    const damage = await g.rollDamage(5 + slot, {
      source: LightningBolt,
      size: 6,
      spell: LightningBolt,
      method,
      damageType: "lightning",
      attacker,
    });

    // TODO [FLAMMABLE] The lightning ignites flammable objects in the area that aren't being worn or carried.

    for (const target of g.getInside(getLightningBoltArea(attacker, point))) {
      const save = await g.save({
        source: LightningBolt,
        type: method.getSaveType(attacker, LightningBolt, slot),
        attacker,
        ability: "dex",
        spell: LightningBolt,
        method,
        who: target,
      });

      await g.damage(
        LightningBolt,
        "lightning",
        { attacker, spell: LightningBolt, method, target },
        [["lightning", damage]],
        save.damageResponse,
      );
    }
  },
});
export default LightningBolt;
