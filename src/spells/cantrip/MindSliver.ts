import { HasTarget } from "../../configs";
import Effect from "../../Effect";
import { canSee, notSelf } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import Priority from "../../types/Priority";
import { simpleSpell } from "../common";
import {
  aiTargetsOne,
  doesCantripDamage,
  requiresSave,
  targetsOne,
} from "../helpers";

const MindSliverEffect = new Effect(
  "Mind Sliver",
  "turnStart",
  (g) => {
    g.events.on("BeforeSave", ({ detail: { who, bonus, interrupt } }) => {
      if (who.hasEffect(MindSliverEffect)) {
        const { values } = g.dice.roll({ type: "bane", who });
        bonus.add(-values.final, MindSliver);

        interrupt.add(
          new EvaluateLater(who, MindSliverEffect, Priority.Normal, () =>
            who.removeEffect(MindSliverEffect),
          ),
        );
      }
    });
  },
  { tags: ["magic"] },
);

const MindSliver = simpleSpell<HasTarget>({
  status: "implemented",
  name: "Mind Sliver",
  level: 0,
  school: "Enchantment",
  v: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],
  description: `You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.

  This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,

  ...targetsOne(60, [canSee, notSelf]),
  ...requiresSave("int"),
  ...doesCantripDamage(6, "psychic"),
  generateAttackConfigs: aiTargetsOne(60),

  async apply(sh, { target }) {
    const { damageResponse, outcome } = await sh.save({
      who: target,
      ability: "int",
      save: "zero",
    });
    const damageInitialiser = await sh.rollDamage({ target });
    await sh.damage({
      damageInitialiser,
      damageType: "psychic",
      damageResponse,
      target,
    });

    if (outcome === "fail") {
      let endCounter = 2;
      const removeTurnTracker = sh.g.events.on(
        "TurnEnded",
        ({ detail: { who, interrupt } }) => {
          if (who === sh.caster && endCounter-- <= 0) {
            removeTurnTracker();
            interrupt.add(
              new EvaluateLater(who, MindSliver, Priority.Normal, () =>
                target.removeEffect(MindSliverEffect),
              ),
            );
          }
        },
      );
      await target.addEffect(MindSliverEffect, { duration: 2 }, sh.caster);
    }
  },
});
export default MindSliver;
