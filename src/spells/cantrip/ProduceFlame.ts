import { HasTarget } from "../../configs";
import { simpleSpell } from "../common";
import {
  aiTargetsOne,
  doesCantripDamage,
  isSpellAttack,
  targetsOne,
} from "../helpers";

// TODO this isn't just a normal attack spell, though it can be used as one

const ProduceFlame = simpleSpell<HasTarget>({
  status: "incomplete",
  name: "Produce Flame",
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Druid"],
  description: `A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.

  You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.
  
  This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,

  ...targetsOne(30, []),
  ...isSpellAttack("ranged"),
  ...doesCantripDamage(8, "fire"),
  generateAttackConfigs: aiTargetsOne(30),

  async apply(sh) {
    // TODO

    const { attack, critical, hit, target } = await sh.attack({
      target: sh.config.target,
      type: "ranged",
    });
    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        target,
        tags: ["ranged"],
      });
      await sh.damage({
        attack,
        critical,
        target,
        damageInitialiser,
        damageType: "fire",
      });
    }
  },
});
export default ProduceFlame;
