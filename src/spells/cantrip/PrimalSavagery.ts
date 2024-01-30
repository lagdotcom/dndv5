import { HasTarget } from "../../configs";
import { notSelf } from "../../filters";
import { simpleSpell } from "../common";
import {
  aiTargetsOne,
  doesCantripDamage,
  isSpellAttack,
  targetsOne,
} from "../helpers";

const PrimalSavagery = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Primal Savagery",
  level: 0,
  school: "Transmutation",
  s: true,
  lists: ["Druid"],
  description: `You channel primal magic to cause your teeth or fingernails to sharpen, ready to deliver a corrosive attack. Make a melee spell attack against one creature within 5 feet of you. On a hit, the target takes 1d10 acid damage. After you make the attack, your teeth or fingernails return to normal.

  The spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).`,

  ...targetsOne(5, [notSelf]),
  ...isSpellAttack("melee"),
  ...doesCantripDamage(10, "acid"),
  generateAttackConfigs: aiTargetsOne(5),

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
        damageType: "acid",
        target,
      });
    }
  },
});
export default PrimalSavagery;
