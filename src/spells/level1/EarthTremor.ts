import { Prone } from "../../effects";
import Engine from "../../Engine";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const getArea = (g: Engine, caster: Combatant): SpecifiedWithin => ({
  type: "within",
  radius: 10,
  target: caster,
  position: g.getState(caster).position,
});

const EarthTremor = scalingSpell({
  name: "Earth Tremor",
  level: 1,
  school: "Evocation",
  v: true,
  s: true,
  lists: ["Bard", "Druid", "Sorcerer", "Wizard"],

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
    const dc = getSaveDC(attacker, method.ability);

    const area = getArea(g, attacker);
    for (const target of g.getInside(area, [attacker])) {
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
  },
});
export default EarthTremor;
