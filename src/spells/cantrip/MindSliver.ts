import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import TargetResolver from "../../resolvers/TargetResolver";
import { _dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { getCantripDice, simpleSpell } from "../common";

const MindSliverEffect = new Effect("Mind Sliver", "turnStart", (g) => {
  g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
    if (who.hasEffect(MindSliverEffect)) {
      who.removeEffect(MindSliverEffect);

      const { value } = g.dice.roll({ type: "bane", who });
      bonus.add(-value, MindSliver);
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
        tags: new Set(),
      },
      { fail: "normal", save: "zero" }
    );
    await g.damage(
      MindSliver,
      "psychic",
      { attacker, target, spell: MindSliver, method },
      [["psychic", damage]],
      save.damageResponse
    );

    if (save.outcome === "fail") {
      let endCounter = 2;
      const removeTurnTracker = g.events.on(
        "TurnEnded",
        ({ detail: { who } }) => {
          if (who === attacker && endCounter-- <= 0) {
            removeTurnTracker();
            target.removeEffect(MindSliverEffect);
          }
        }
      );
      target.addEffect(MindSliverEffect, { duration: 2 });
    }
  },
});
export default MindSliver;
