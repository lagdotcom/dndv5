import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { canSee, notSelf } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import TargetResolver from "../../resolvers/TargetResolver";
import { _dd } from "../../utils/dice";
import { getCantripDice, simpleSpell } from "../common";

const MindSliverEffect = new Effect("Mind Sliver", "turnStart", (g) => {
  g.events.on("BeforeSave", ({ detail: { who, bonus, interrupt } }) => {
    if (who.hasEffect(MindSliverEffect)) {
      const { values } = g.dice.roll({ type: "bane", who });
      bonus.add(-values.final, MindSliver);

      interrupt.add(
        new EvaluateLater(who, MindSliverEffect, async () => {
          who.removeEffect(MindSliverEffect);
        }),
      );
    }
  });
});

const MindSliver = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Mind Sliver",
  level: 0,
  school: "Enchantment",
  v: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.

  This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,

  getConfig: (g) => ({ target: new TargetResolver(g, 60, [canSee, notSelf]) }),
  getDamage: (_, caster) => [_dd(getCantripDice(caster), 6, "psychic")],
  getTargets: (g, caster, { target }) => [target],

  async apply(g, attacker, method, { target }) {
    const damage = await g.rollDamage(getCantripDice(attacker), {
      source: MindSliver,
      attacker,
      target,
      spell: MindSliver,
      method,
      size: 6,
      damageType: "psychic",
    });

    const { damageResponse, outcome } = await g.save({
      source: MindSliver,
      type: method.getSaveType(attacker, MindSliver),
      who: target,
      attacker,
      ability: "int",
      spell: MindSliver,
      method,
      fail: "normal",
      save: "zero",
    });
    await g.damage(
      MindSliver,
      "psychic",
      { attacker, target, spell: MindSliver, method },
      [["psychic", damage]],
      damageResponse,
    );

    if (outcome === "fail") {
      let endCounter = 2;
      const removeTurnTracker = g.events.on(
        "TurnEnded",
        ({ detail: { who, interrupt } }) => {
          if (who === attacker && endCounter-- <= 0) {
            removeTurnTracker();
            interrupt.add(
              new EvaluateLater(who, MindSliver, async () => {
                await target.removeEffect(MindSliverEffect);
              }),
            );
          }
        },
      );
      await target.addEffect(MindSliverEffect, { duration: 2 }, attacker);
    }
  },
});
export default MindSliver;
