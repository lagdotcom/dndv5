import iconUrl from "@img/spl/charm-monster.svg";

import { makeIcon } from "../../colours";
import { HasTargets } from "../../configs";
import { Charmed, CharmedConfig } from "../../effects";
import { canSee, withinRangeOfEachOther } from "../../filters";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { coSet } from "../../types/ConditionName";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";

const CharmMonster = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Charm Monster",
  level: 4,
  icon: makeIcon(iconUrl),
  school: "Enchantment",
  v: true,
  s: true,
  lists: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
  isHarmful: true,
  description: `You attempt to charm a creature you can see within range. It must make a Wisdom saving throw, and it does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature is friendly to you. When the spell ends, the creature knows it was charmed by you.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them.`,

  getConfig: (g, actor, method, { slot }) => ({
    targets: new MultiTargetResolver(
      g,
      1,
      (slot ?? 4) - 3,
      30,
      [canSee],
      [withinRangeOfEachOther(30)],
    ),
  }),
  getTargets: (g, actor, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { slot, targets }) {
    for (const target of targets) {
      const config: CharmedConfig = {
        conditions: coSet("Charmed"),
        duration: hours(1),
        by: caster,
      };

      const { outcome } = await g.save({
        source: CharmMonster,
        type: method.getSaveType(caster, CharmMonster, slot),
        who: target,
        ability: "wis",
        attacker: caster,
        effect: Charmed,
        config,
        tags: ["charm", "magic"],
      });

      if (outcome === "fail") await target.addEffect(Charmed, config, caster);
    }
  },
});
export default CharmMonster;
