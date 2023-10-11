import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import Engine from "../../Engine";
import TargetResolver from "../../resolvers/TargetResolver";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import iconUrl from "./icons/ice-knife.svg";

const getArea = (g: Engine, target: Combatant): SpecifiedWithin => ({
  type: "within",
  target,
  position: g.getState(target).position,
  radius: 5,
});

const IceKnife = scalingSpell<HasTarget>({
  status: "implemented",
  name: "Ice Knife",
  icon: makeIcon(iconUrl, DamageColours.cold),
  level: 1,
  school: "Conjuration",
  s: true,
  m: "a drop of water or piece of ice",
  lists: ["Druid", "Sorcerer", "Wizard"],
  description: `You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.`,

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),

  getAffectedArea: (g, caster, { target }) => target && [getArea(g, target)],

  getDamage: (g, caster, method, { slot }) => [
    _dd(1, 10, "piercing"),
    _dd(1 + (slot ?? 1), 6, "cold"),
  ],
  getTargets: (g, caster, { target }) => g.getInside(getArea(g, target)),

  async apply(g, attacker, method, { slot, target }) {
    const { attack, hit, critical } = await g.attack({
      who: attacker,
      tags: atSet("ranged", "spell", "magical"),
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
    const dc = method.getSaveDC(attacker, IceKnife, slot);

    for (const victim of g.getInside(getArea(g, target))) {
      const save = await g.savingThrow(
        dc,
        {
          attacker,
          ability: "dex",
          spell: IceKnife,
          method,
          who: victim,
          tags: svSet(),
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
