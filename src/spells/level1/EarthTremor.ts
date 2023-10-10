import ActiveEffectArea from "../../ActiveEffectArea";
import { Prone } from "../../effects";
import Engine from "../../Engine";
import Combatant from "../../types/Combatant";
import { arSet, SpecifiedWithin } from "../../types/EffectArea";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import iconUrl from "./icons/earth-tremor.svg";

const getArea = (g: Engine, caster: Combatant): SpecifiedWithin => ({
  type: "within",
  radius: 10,
  target: caster,
  position: g.getState(caster).position,
});

const EarthTremor = scalingSpell({
  status: "incomplete",
  name: "Earth Tremor",
  icon: { url: iconUrl },
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Bard", "Druid", "Sorcerer", "Wizard"],
  description: `You cause a tremor in the ground within range. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,

  getConfig: () => ({}),
  getAffectedArea: (g, caster) => [getArea(g, caster)],
  getDamage: (g, caster, method, { slot }) => [
    _dd(slot ?? 1, 6, "bludgeoning"),
  ],
  getTargets: () => [],

  async apply(g, attacker, method, { slot }) {
    const damage = await g.rollDamage(slot, {
      source: EarthTremor,
      size: 6,
      spell: EarthTremor,
      method,
      damageType: "bludgeoning",
      attacker,
    });
    const dc = method.getSaveDC(attacker, EarthTremor, slot);

    const shape = getArea(g, attacker);
    for (const target of g.getInside(shape, [attacker])) {
      const save = await g.savingThrow(
        dc,
        {
          attacker,
          ability: "dex",
          spell: EarthTremor,
          method,
          who: target,
          tags: svSet(),
        },
        { fail: "normal", save: "zero" },
      );

      if (save.damageResponse !== "zero") {
        await g.damage(
          EarthTremor,
          "bludgeoning",
          { attacker, spell: EarthTremor, method, target },
          [["bludgeoning", damage]],
          save.damageResponse,
        );
        await target.addEffect(Prone, { duration: Infinity }, attacker);
      }
    }

    // TODO [TERRAIN] If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand.
    const area = new ActiveEffectArea(
      "Earth Tremor",
      shape,
      arSet("difficult terrain"),
      "brown",
    );
    g.addEffectArea(area);
  },
});
export default EarthTremor;
