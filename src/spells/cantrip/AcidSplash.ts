import iconUrl from "@img/spl/acid-splash.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTargets } from "../../configs";
import { canSee, withinRangeOfEachOther } from "../../filters";
import { poWithin } from "../../utils/ai";
import { combinationsMulti } from "../../utils/combinatorics";
import { simpleSpell } from "../common";
import { doesCantripDamage, requiresSave, targetsMany } from "../helpers";

const AcidSplash = simpleSpell<HasTargets>({
  status: "implemented",
  name: "Acid Splash",
  icon: makeIcon(iconUrl, DamageColours.acid),
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Sorcerer", "Wizard"],
  description: `You hurl a bubble of acid. Choose one creature you can see within range, or choose two creatures you can see within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.

  This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,

  generateAttackConfigs: ({ caster, allTargets }) =>
    combinationsMulti(
      allTargets.filter((co) => co.side !== caster.side),
      1,
      2,
    ).map((targets) => ({
      config: { targets },
      positioning: new Set(targets.map((target) => poWithin(60, target))),
    })),
  ...doesCantripDamage(5, "acid"),
  ...requiresSave("dex"),
  ...targetsMany(1, 2, 60, [canSee], [withinRangeOfEachOther(5)]),

  async apply(sh, { targets }) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of targets) {
      const { damageResponse } = await sh.save({
        who: target,
        ability: "dex",
        save: "zero",
      });
      await sh.damage({
        target,
        damageType: "acid",
        damageInitialiser,
        damageResponse,
      });
    }
  },
});
export default AcidSplash;
