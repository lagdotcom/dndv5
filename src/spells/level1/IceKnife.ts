import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import TargetResolver from "../../resolvers/TargetResolver";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const getArea = (g: Engine, target: Combatant): SpecifiedWithin => ({
  type: "within",
  target,
  position: g.getState(target).position,
  radius: 5,
});

const IceKnife = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Ice Knife",
  level: 1,
  school: "Conjuration",
  s: true,
  m: "a drop of water or piece of ice",
  lists: ["Druid", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),

  getAffectedArea: (g, caster, { target }) => target && [getArea(g, target)],

  getDamage: (g, caster, { slot }) => [
    _dd(1, 10, "piercing"),
    _dd(1 + (slot ?? 1), 6, "cold"),
  ],
  getTargets: (g, caster, { target }) => g.getInside(getArea(g, target)),

  async apply(g, attacker, method, { slot, target }) {
    const { attack, hit, critical } = await g.attack({
      who: attacker,
      tags: new Set(["ranged", "spell", "magical"]),
      target,
      ability: method.ability,
      spell: IceKnife,
      method,
    });

    if (hit) {
      const damage = await g.rollDamage(
        1,
        {
          source: IceKnife,
          size: 10,
          attacker,
          target,
          spell: IceKnife,
          method,
          damageType: "piercing",
        },
        critical,
      );

      await g.damage(
        IceKnife,
        "piercing",
        { attack, attacker, target, spell: IceKnife, method, critical },
        [["piercing", damage]],
      );
    }

    const damage = await g.rollDamage(1 + slot, {
      source: IceKnife,
      size: 6,
      attacker,
      spell: IceKnife,
      method,
      damageType: "cold",
    });
    const dc = getSaveDC(attacker, method.ability);

    for (const victim of g.getInside(getArea(g, target))) {
      const save = await g.savingThrow(
        dc,
        {
          attacker,
          ability: "dex",
          spell: IceKnife,
          method,
          who: victim,
          tags: new Set(),
        },
        { fail: "normal", save: "zero" },
      );
      await g.damage(
        IceKnife,
        "cold",
        { attacker, target: victim, spell: IceKnife, method },
        [["cold", damage]],
        save.damageResponse,
      );
    }
  },
});
export default IceKnife;
