import BaseEffect from "../../BaseEffect";
import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { getCantripDice, simpleSpell } from "../common";

const MindSliverEffect = new BaseEffect("Mind Sliver", "turnStart");

const MindSliver = simpleSpell<HasTarget>({
  name: "Mind Sliver",
  level: 0,
  school: "Enchantment",
  v: true,
  lists: ["Sorcerer", "Warlock", "Wizard"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),
  getDamage: (_, caster) => [dd(getCantripDice(caster), 6, "psychic")],

  async apply(g, attacker, method, { target }) {
    const save = await g.savingThrow(getSaveDC(attacker, method.ability), {
      who: target,
      attacker,
      ability: "int",
      spell: MindSliver,
      method,
    });

    const damage = await g.rollDamage(getCantripDice(attacker), {
      attacker,
      target,
      spell: MindSliver,
      method,
      size: 6,
      damageType: "psychic",
    });

    if (!save) {
      await g.damage(
        MindSliver,
        "psychic",
        { attacker, target, spell: MindSliver, method },
        [["psychic", damage]]
      );

      let endCounter = 2;
      const kill1 = g.events.on("turnEnded", ({ detail: { who } }) => {
        if (who === attacker && endCounter-- <= 0) {
          kill1();
          kill2();
        }
      });
      const kill2 = g.events.on("beforeSave", ({ detail: { who, bonus } }) => {
        if (who === target) {
          kill1();
          kill2();
          target.removeEffect(MindSliverEffect);

          const { value } = g.dice.roll({ type: "bane", who }, "normal");
          bonus.add(-value, MindSliver);
        }
      });
      target.addEffect(MindSliverEffect, 2);
    }
  },
});
export default MindSliver;
