import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const getThunderclapArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  who,
  radius: 5,
});

const Thunderclap = simpleSpell({
  status: "implemented",
  name: "Thunderclap",
  level: 0,
  school: "Evocation",
  s: true,
  lists: ["Artificer", "Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description: `You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must make a Constitution saving throw or take 1d6 thunder damage.

The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
  isHarmful: true,

  // TODO generateAttackConfigs

  getConfig: () => ({}),
  getDamage: (g, caster) => [_dd(getCantripDice(caster), 6, "thunder")],
  getTargets: () => [],
  getAffectedArea: (g, caster) => [getThunderclapArea(caster)],
  getAffected: (g, caster) => g.getInside(getThunderclapArea(caster), [caster]),

  async apply(g, attacker, method) {
    const affected = g.getInside(getThunderclapArea(attacker), [attacker]);
    const amount = await g.rollDamage(getCantripDice(attacker), {
      size: 6,
      damageType: "thunder",
      attacker,
      source: Thunderclap,
      spell: Thunderclap,
      method,
    });

    for (const target of affected) {
      const { outcome, damageResponse } = await g.save({
        source: Thunderclap,
        type: method.getSaveType(attacker, Thunderclap),
        attacker,
        who: target,
        ability: "con",
        spell: Thunderclap,
        method,
        save: "zero",
      });

      if (outcome === "fail")
        await g.damage(
          Thunderclap,
          "thunder",
          { attacker, target, spell: Thunderclap, method },
          [["thunder", amount]],
          damageResponse,
        );
    }
  },
});
export default Thunderclap;
