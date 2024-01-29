import { HasPoint } from "../../configs";
import { scalingSpell } from "../common";
import { affectsCone, doesScalingDamage, requiresSave } from "../helpers";

const ConeOfCold = scalingSpell<HasPoint>({
  status: "implemented",
  name: "Cone of Cold",
  level: 5,
  school: "Evocation",
  v: true,
  s: true,
  m: "a small crystal or glass cone",
  lists: ["Sorcerer", "Wizard"],
  description: `A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.

  A creature killed by this spell becomes a frozen statue until it thaws.

  At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.`,

  ...affectsCone(60),
  ...requiresSave("con"),
  ...doesScalingDamage(5, 3, 8, "cold"),

  // TODO: generateAttackConfigs

  async apply(sh) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { damageResponse } = await sh.save({
        ability: "con",
        who: target,
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "cold",
        target,
      });

      // TODO A creature killed by this spell becomes a frozen statue until it thaws.
    }
  },
});
export default ConeOfCold;
