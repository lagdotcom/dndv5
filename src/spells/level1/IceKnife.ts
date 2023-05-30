import { HasTarget } from "../../configs";
import TargetResolver from "../../resolvers/TargetResolver";
import { dd } from "../../utils/dice";
import { getSaveDC } from "../../utils/dnd";
import { scalingSpell } from "../common";

const IceKnife = scalingSpell<HasTarget>({
  name: "Ice Knife",
  level: 1,
  school: "Conjuration",
  s: true,
  m: "a drop of water or piece of ice",
  lists: ["Druid", "Sorcerer", "Wizard"],

  getConfig: (g) => ({ target: new TargetResolver(g, 60) }),

  getAffectedArea: (g, { target }) =>
    target && [
      {
        type: "within",
        target,
        position: g.getState(target).position,
        radius: 5,
      },
    ],

  getDamage: (g, caster, { slot }) => [
    dd(1, 10, "piercing"),
    dd(1 + (slot ?? 1), 6, "cold"),
  ],

  async apply(g, attacker, method, { slot, target }) {
    const { attack, hit, critical } = await g.attack({
      attacker,
      target,
      ability: method.ability,
      spell: IceKnife,
      method,
    });

    if (hit) {
      const damage = await g.rollDamage(
        1,
        {
          size: 10,
          attacker,
          target,
          spell: IceKnife,
          method,
          damageType: "piercing",
        },
        critical
      );

      await g.damage(
        IceKnife,
        "piercing",
        { attack, attacker, target, spell: IceKnife, method, critical },
        [["piercing", damage]]
      );
    }

    const damage = await g.rollDamage(1 + slot, {
      size: 6,
      attacker,
      spell: IceKnife,
      method,
      damageType: "cold",
    });
    const dc = getSaveDC(attacker, method.ability);

    for (const victim of g.getInside({
      type: "within",
      target,
      position: g.getState(target).position,
      radius: 5,
    })) {
      const save = await g.savingThrow(dc, {
        attacker,
        ability: "dex",
        spell: IceKnife,
        method,
        who: victim,
      });
      if (!save)
        await g.damage(
          IceKnife,
          "cold",
          { attacker, target: victim, spell: IceKnife, method },
          [["cold", damage]]
        );
    }
  },
});
export default IceKnife;
