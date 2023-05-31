import BaseEffect from "../../BaseEffect";
import { HasTargets } from "../../configs";
import { EventListener } from "../../events/Dispatcher";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import Combatant from "../../types/Combatant";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const BlessEffect = new BaseEffect("Bless", "turnEnd");

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
    const blessCallback =
      (me: Combatant): EventListener<"beforeAttack" | "beforeSave"> =>
      ({ detail: { who, bonus } }) => {
        if (who === me && me.hasEffect(BlessEffect)) {
          const dr = g.dice.roll({ type: "bless", who }, "normal");
          bonus.add(dr.value, BlessEffect);
        }
      };

    const cleanup = targets.flatMap((target) => {
      target.addEffect(BlessEffect, minutes(1));

      return [
        g.events.on("beforeAttack", blessCallback(target)),
        g.events.on("beforeSave", blessCallback(target)),
      ];
    });

    caster.concentrateOn({
      spell: Bless,
      duration: minutes(1),
      onSpellEnd: async () => {
        for (const target of targets) target.removeEffect(BlessEffect);
        for (const cb of cleanup) cb();
      },
    });
  },
});
export default Bless;
