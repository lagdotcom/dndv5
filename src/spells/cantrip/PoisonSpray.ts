import { HasTarget } from "../../configs";
import { canSee } from "../../filters";
import { poSet, poWithin } from "../../utils/ai";
import { simpleSpell } from "../common";
import { doesCantripDamage, requiresSave, targetsOne } from "../helpers";

const PoisonSpray = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Poison Spray",
  level: 0,
  school: "Conjuration",
  v: true,
  s: true,
  lists: ["Artificer", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description: `You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.

  This spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).`,

  ...targetsOne(10, [canSee]),
  ...requiresSave("con"),
  ...doesCantripDamage(6, "acid"),

  generateAttackConfigs: (g, caster, method, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(10, target)),
    })),

  async apply(sh, { target }) {
    const { damageResponse } = await sh.save({
      who: target,
      ability: "con",
      save: "zero",
      tags: ["magic", "poison"],
    });
    const damageInitialiser = await sh.rollDamage({ target });
    await sh.damage({
      target,
      damageType: "poison",
      damageInitialiser,
      damageResponse,
    });
  },
});
export default PoisonSpray;
