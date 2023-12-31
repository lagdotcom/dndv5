import iconUrl from "@img/spl/earth-tremor.svg";

import ActiveEffectArea from "../../ActiveEffectArea";
import { DamageColours, makeIcon } from "../../colours";
import { Prone } from "../../effects";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedWithin } from "../../types/EffectArea";
import { poSet } from "../../utils/ai";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getEarthTremorArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  radius: 10,
  who,
});

const EarthTremor = scalingSpell({
  status: "incomplete",
  name: "Earth Tremor",
  icon: makeIcon(iconUrl, DamageColours.bludgeoning),
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Bard", "Druid", "Sorcerer", "Wizard"],
  isHarmful: true,
  description: `You cause a tremor in the ground within range. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,

  generateAttackConfigs: () => [{ config: {}, positioning: poSet() }],

  getConfig: () => ({}),
  getAffectedArea: (g, caster) => [getEarthTremorArea(caster)],
  getDamage: (g, caster, method, { slot }) => [
    _dd(slot ?? 1, 6, "bludgeoning"),
  ],
  getTargets: () => [],
  getAffected: (g, caster) => g.getInside(getEarthTremorArea(caster), [caster]),

  async apply(sh) {
    const damageInitialiser = await sh.rollDamage();
    for (const target of sh.affected) {
      const config = { duration: Infinity };
      const { damageResponse, outcome } = await sh.save({
        ability: "dex",
        who: target,
        save: "zero",
        effect: Prone,
        config,
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "bludgeoning",
        target,
      });
      if (outcome === "fail") await target.addEffect(Prone, config, sh.caster);
    }

    // TODO [TERRAIN] If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand.
    for (const shape of sh.affectedArea) {
      const area = new ActiveEffectArea(
        "Earth Tremor",
        shape,
        arSet("difficult terrain"),
        "brown",
      );
      sh.g.addEffectArea(area);
    }
  },
});
export default EarthTremor;
