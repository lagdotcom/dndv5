import { poSet, poWithin } from "../../utils/ai";
import { combinationsMulti } from "../../utils/combinatorics";
import { simpleSpell } from "../common";
import { damagingCantrip, requiresSave, simpleArea } from "../helpers";

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
  ...damagingCantrip(6, "thunder"),
  ...simpleArea((who) => ({ type: "within", who, radius: 5 })),

  // TODO this is kinda cheating; relies on AI code to get rid of all the invalid positioning sets
  generateAttackConfigs: (g, caster, method, targets) =>
    combinationsMulti(targets, 0, targets.length).map((targets) => ({
      config: {},
      positioning: poSet(...targets.map((target) => poWithin(5, target))),
    })),

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
