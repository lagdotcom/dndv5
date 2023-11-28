import iconUrl from "@img/spl/bless.svg";

import BonusCollector from "../../collectors/BonusCollector";
import { makeIcon } from "../../colours";
import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import Engine from "../../Engine";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import Combatant from "../../types/Combatant";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const BlessIcon = makeIcon(iconUrl);

function applyBless(g: Engine, who: Combatant, bonus: BonusCollector) {
  if (who.hasEffect(BlessEffect)) {
    const { values } = g.dice.roll({ type: "bless", who });
    bonus.add(values.final, BlessEffect);
  }
}

const BlessEffect = new Effect(
  "Bless",
  "turnEnd",
  (g) => {
    g.events.on("BeforeAttack", ({ detail: { bonus, who } }) =>
      applyBless(g, who, bonus),
    );
    g.events.on("BeforeSave", ({ detail: { bonus, who } }) =>
      applyBless(g, who, bonus),
    );
  },
  { icon: BlessIcon, tags: ["magic"] },
);

const Bless = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Bless",
  icon: BlessIcon,
  level: 1,
  school: "Enchantment",
  concentration: true,
  v: true,
  s: true,
  m: "a sprinkling of holy water",
  lists: ["Cleric", "Paladin"],
  description: `You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.`,

  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 1) + 2, 30, []),
  }),
  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { targets }) {
    const duration = minutes(1);
    for (const target of targets)
      await target.addEffect(BlessEffect, { duration }, caster);

    await caster.concentrateOn({
      spell: Bless,
      duration,
      onSpellEnd: async () => {
        for (const target of targets) await target.removeEffect(BlessEffect);
      },
    });
  },
});
export default Bless;
