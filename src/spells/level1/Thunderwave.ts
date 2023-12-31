import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

// TODO the spell says cube, but this makes no sense...
const getThunderwaveArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  who,
  radius: 5,
});

const Thunderwave = scalingSpell({
  status: "implemented",
  name: "Thunderwave",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Bard", "Druid", "Sorcerer", "Wizard"],
  description: `A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed.

  In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.`,

  getConfig: () => ({}),

  getTargets: () => [],
  getAffectedArea: (g, caster) => [getThunderwaveArea(caster)],
  getAffected: (g, caster) => g.getInside(getThunderwaveArea(caster), [caster]),

  isHarmful: true,
  getDamage: (g, caster, method, { slot }) => [
    _dd(1 + (slot ?? 1), 8, "thunder"),
  ],

  async apply(sh) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const { outcome, damageResponse } = await sh.save({
        who: target,
        ability: "con",
        tags: ["forced movement", "magic"],
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "thunder",
        target,
      });

      if (outcome === "fail")
        await sh.g.forcePush(target, sh.caster, 10, Thunderwave);
    }
  },
});
export default Thunderwave;
