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
    const dr = g.dice.roll({ type: "bless", who }, "normal");
    bonus.add(dr.value, BlessEffect);
  }
}

const BlessEffect = new Effect("Bless", "turnEnd", (g) => {
  g.events.on("beforeAttack", ({ detail: { bonus, who } }) =>
    applyBless(g, who, bonus)
  );
  g.events.on("beforeSave", ({ detail: { bonus, who } }) =>
    applyBless(g, who, bonus)
  );
});

const Bless = scalingSpell<HasTargets>({
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

  async apply(g, caster, method, { targets }) {
    for (const target of targets) target.addEffect(BlessEffect, minutes(1));

    caster.concentrateOn({
      spell: Bless,
      duration: minutes(1),
      onSpellEnd: async () => {
        for (const target of targets) target.removeEffect(BlessEffect);
      },
    });
  },
});
export default Bless;
