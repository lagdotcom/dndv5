import iconUrl from "@img/spl/lightning-bolt.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasPoint } from "../../configs";
import { scalingSpell } from "../common";
import { affectsLine, doesScalingDamage, requiresSave } from "../helpers";

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
  description: `A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.

  The lightning ignites flammable objects in the area that aren't being worn or carried.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,

  // TODO: generateAttackConfigs

  ...affectsLine(100, 5),
  ...requiresSave("dex"),
  ...doesScalingDamage(3, 5, 6, "lightning"),

  async apply(sh) {
    // TODO [FLAMMABLE] The lightning ignites flammable objects in the area that aren't being worn or carried.

    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { damageResponse } = await sh.save({
        ability: "dex",
        who: target,
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "lightning",
        target,
      });
    }
  },
});
export default LightningBolt;
