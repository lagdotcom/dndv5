import BonusCollector from "../../collectors/BonusCollector";
import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import Engine from "../../Engine";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import Combatant from "../../types/Combatant";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

function applyBless(g: Engine, who: Combatant, bonus: BonusCollector) {
  if (who.hasEffect(BlessEffect)) {
    const dr = g.dice.roll({ type: "bless", who });
    bonus.add(dr.value, BlessEffect);
  }
}

const BlessEffect = new Effect("Bless", "turnEnd", (g) => {
  g.events.on("BeforeAttack", ({ detail: { bonus, who } }) =>
    applyBless(g, who, bonus),
  );
  g.events.on("BeforeSave", ({ detail: { bonus, who } }) =>
    applyBless(g, who, bonus),
  );
});

const Bless = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Bless",
  level: 1,
  school: "Enchantment",
  concentration: true,
  v: true,
  s: true,
  m: "a sprinkling of holy water",
  lists: ["Cleric", "Paladin"],

  getConfig: (g, caster, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 1) + 2, 30, true),
  }),
  getTargets: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { targets }) {
    const duration = minutes(1);
    for (const target of targets)
      await target.addEffect(BlessEffect, { duration });

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
