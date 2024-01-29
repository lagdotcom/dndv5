import { HasPoint } from "../../configs";
import { scalingSpell } from "../common";
import { affectsCone, doesScalingDamage } from "../helpers";

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

  ...affectsCone(15),
  ...doesScalingDamage(1, 2, 6, "fire"),

  // TODO generateAttackConfigs,

  async apply(sh) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { damageResponse } = await sh.save({
        who: target,
        ability: "dex",
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "fire",
        target,
      });
    }

    // TODO The fire ignites any flammable objects in the area that aren't being worn or carried.
  },
});
export default BurningHands;
