import iconUrl from "@img/spl/ice-knife.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { notSelf } from "../../filters";
import TargetResolver from "../../resolvers/TargetResolver";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { poSet, poWithin } from "../../utils/ai";
import { sieve } from "../../utils/array";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";

const getIceKnifeArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  who,
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
  isHarmful: true,
  description: `You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.`,

  generateAttackConfigs: (slot, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(60, target)),
    })),

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf]) }),

  getAffectedArea: (g, caster, { target }) =>
    target && [getIceKnifeArea(target)],

  getDamage: (g, caster, method, { slot }) => [
    _dd(1, 10, "piercing"),
    _dd(1 + (slot ?? 1), 6, "cold"),
  ],
  getTargets: (g, caster, { target }) => sieve(target),
  getAffected: (g, caster, { target }) => g.getInside(getIceKnifeArea(target)),

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
          target: attack.pre.target,
          spell: IceKnife,
          method: attack.pre.method,
          damageType: "piercing",
        },
        critical,
      );

      await g.damage(
        IceKnife,
        "piercing",
        {
          attack,
          attacker,
          target: attack.pre.target,
          spell: IceKnife,
          method: attack.pre.method,
          critical,
        },
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
    for (const victim of g.getInside(getIceKnifeArea(target))) {
      const { damageResponse } = await g.save({
        source: IceKnife,
        type: method.getSaveType(attacker, IceKnife, slot),
        attacker,
        ability: "dex",
        spell: IceKnife,
        method,
        who: victim,
        fail: "normal",
        save: "zero",
        tags: ["magic"],
      });
      await g.damage(
        IceKnife,
        "cold",
        { attacker, target: victim, spell: IceKnife, method },
        [["cold", damage]],
        damageResponse,
      );
    }
  },
});
export default IceKnife;
