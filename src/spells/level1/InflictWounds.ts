import iconUrl from "@img/spl/inflict-wounds.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { scalingSpell } from "../common";
import {
  aiTargetsByTouch,
  doesScalingDamage,
  isSpellAttack,
  targetsByTouch,
} from "../helpers";

const InflictWounds = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Inflict Wounds",
  icon: makeIcon(iconUrl, DamageColours.necrotic),
  level: 1,
  school: "Necromancy",
  v: true,
  s: true,
  lists: ["Cleric"],
  description: `Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.`,

  ...targetsByTouch([]),
  ...isSpellAttack("melee"),
  ...doesScalingDamage(1, 2, 10, "necrotic"),
  generateAttackConfigs: aiTargetsByTouch,

  async apply(sh) {
    const { attack, critical, hit, target } = await sh.attack({
      target: sh.config.target,
      type: "melee",
    });
    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        target,
        tags: ["melee"],
      });
      await sh.damage({
        attack,
        critical,
        damageInitialiser,
        damageType: "necrotic",
        target,
      });
    }
  },
});
export default InflictWounds;
