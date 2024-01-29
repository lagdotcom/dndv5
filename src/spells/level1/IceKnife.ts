import iconUrl from "@img/spl/ice-knife.svg";

import { DamageColours, makeIcon } from "../../colours";
import { HasTarget } from "../../configs";
import { notSelf } from "../../filters";
import { SpellSlot } from "../../flavours";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import { poSet, poWithin } from "../../utils/ai";
import { _dd } from "../../utils/dice";
import { scalingSpell } from "../common";
import { targetsOne } from "../helpers";

const getIceKnifeArea = (who: Combatant): SpecifiedWithin => ({
  type: "within",
  who,
  radius: 5,
});

const piercingRoll = _dd(1, 10, "piercing");
const getColdRoll = (slot: SpellSlot) => _dd(1 + slot, 6, "cold");

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

  ...targetsOne(60, [notSelf]),

  generateAttackConfigs: (slot, targets) =>
    targets.map((target) => ({
      config: { target },
      positioning: poSet(poWithin(60, target)),
    })),

  getAffectedArea: (g, caster, { target }) =>
    target && [getIceKnifeArea(target)],

  getDamage: (g, caster, method, { slot }) => [
    piercingRoll,
    getColdRoll(slot ?? 1),
  ],
  getAffected: (g, caster, { target }) => g.getInside(getIceKnifeArea(target)),

  async apply(sh, { slot }) {
    const { attack, hit, critical, target } = await sh.attack({
      target: sh.config.target,
      type: "ranged",
    });

    if (hit) {
      const damageInitialiser = await sh.rollDamage({
        critical,
        damage: [piercingRoll],
        target,
        tags: ["ranged"],
      });

      await sh.damage({
        attack,
        critical,
        damageInitialiser,
        damageType: piercingRoll.damageType,
        target,
      });
    }

    const coldDamage = getColdRoll(slot);
    const damageInitialiser = await sh.rollDamage({ damage: [coldDamage] });
    for (const who of sh.affected) {
      const { damageResponse } = await sh.save({
        ability: "dex",
        who,
        save: "zero",
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: coldDamage.damageType,
        target: who,
      });
    }
  },
});
export default IceKnife;
