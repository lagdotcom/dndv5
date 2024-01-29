import { poSet } from "../../utils/ai";
import { simpleSpell } from "../common";
import { affectsStaticArea, doesCantripDamage, requiresSave } from "../helpers";

const Thunderclap = simpleSpell({
  status: "implemented",
  name: "Thunderclap",
  level: 0,
  school: "Evocation",
  s: true,
  lists: ["Artificer", "Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description: `You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must make a Constitution saving throw or take 1d6 thunder damage.

The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,

  ...requiresSave("con"),
  ...doesCantripDamage(6, "thunder"),
  ...affectsStaticArea((who) => ({ type: "within", who, radius: 5 })),

  generateAttackConfigs: () => [{ config: {}, positioning: poSet() }],

  async apply(sh) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { outcome, damageResponse } = await sh.save({
        who: target,
        ability: "con",
        save: "zero",
      });

      if (outcome === "fail")
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "thunder",
          target,
        });
    }
  },
});
export default Thunderclap;
