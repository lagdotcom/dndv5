import { Heal, makeIcon } from "../../colours";
import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import { hours } from "../../utils/time";
import { scalingSpell } from "../common";
import iconUrl from "./icons/aid.svg";

const AidIcon = makeIcon(iconUrl, Heal);

const AidEffect = new Effect<{ amount: number }>(
  "Aid",
  "turnStart",
  (g) => {
    g.events.on("GetMaxHP", ({ detail: { who, bonus } }) => {
      const config = who.getEffectConfig(AidEffect);
      if (config) bonus.add(config.amount, AidEffect);
    });
  },
  { icon: AidIcon },
);

const Aid = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Aid",
  icon: AidIcon,
  level: 2,
  school: "Abjuration",
  v: true,
  s: true,
  m: "a tiny strip of white cloth",
  lists: ["Artificer", "Cleric", "Paladin"],
  description: `Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.

  At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd.`,

  getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 3, 30, true) }),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, actor, method, { slot, targets }) {
    const amount = (slot - 1) * 5;
    const duration = hours(8);

    for (const target of targets) {
      if (await target.addEffect(AidEffect, { duration, amount }))
        await g.heal(Aid, amount, { actor, target, spell: Aid });
    }
  },
});
export default Aid;
