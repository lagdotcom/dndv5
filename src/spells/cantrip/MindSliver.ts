import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import TargetResolver from "../../resolvers/TargetResolver";
import { svSet } from "../../types/SaveTag";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { getCantripDice, simpleSpell } from "../common";

const MindSliverEffect = new Effect("Mind Sliver", "turnStart", (g) => {
  g.events.on("BeforeSave", ({ detail: { who, bonus, interrupt } }) => {
    if (who.hasEffect(MindSliverEffect)) {
      const { value } = g.dice.roll({ type: "bane", who });
      bonus.add(-value, MindSliver);

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

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),
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

    const save = await g.savingThrow(
      getSaveDC(attacker, method.ability),
      {
        who: target,
        attacker,
        ability: "int",
        spell: MindSliver,
        method,
        tags: svSet(),
      },
      { fail: "normal", save: "zero" },
    );
    await g.damage(
      MindSliver,
      "psychic",
      { attacker, target, spell: MindSliver, method },
      [["psychic", damage]],
      save.damageResponse,
    );

    if (save.outcome === "fail") {
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
