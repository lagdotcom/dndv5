import iconUrl from "@img/spl/shield.svg";

import CastSpell from "../../actions/CastSpell";
import InterruptionCollector from "../../collectors/InterruptionCollector";
import { makeIcon } from "../../colours";
import Effect from "../../Effect";
import PickFromListChoice from "../../interruptions/PickFromListChoice";
import Combatant from "../../types/Combatant";
import { simpleSpell } from "../common";
import MagicMissile from "./MagicMissile";

const ShieldIcon = makeIcon(iconUrl);

const ShieldEffect = new Effect(
  "Shield",
  "turnStart",
  (g) => {
    const check = (
      message: string,
      who: Combatant,
      interrupt: InterruptionCollector,
      after = async () => {},
    ) => {
      const shield = g
        .getActions(who)
        .filter((a) => a instanceof CastSpell && a.spell === Shield);
      if (!shield.length) return;

      interrupt.add(
        new PickFromListChoice(
          who,
          Shield,
          "Shield",
          `${message} Cast Shield as a reaction?`,
          shield.map((value) => ({ value, label: value.name })),
          async (action) => {
            await action.apply({});
            await after();
          },
          true,
        ),
      );
    };

    // ...which you take when you are hit by an attack...
    g.events.on("Attack", ({ detail }) => {
      const { target, who, bonus } = detail.pre;

      if (!target.hasEffect(ShieldEffect) && detail.outcome === "hit")
        check(
          `${who.name} hit ${target.name} with an attack.`,
          target,
          detail.interrupt,
          async () => {
            const ac = await g.getAC(target, detail.pre);
            const roll = detail.roll.value;
            detail.outcome = g.getAttackOutcome(ac, roll, roll + bonus.result);
            // TODO [MESSAGE]
          },
        );
    });
    // ...or targeted by the magic missile spell
    g.events.on(
      "SpellCast",
      ({ detail: { who, spell, targets, interrupt } }) => {
        if (spell !== MagicMissile) return;

        for (const target of targets) {
          if (!target.hasEffect(ShieldEffect))
            check(
              `${who.name} is casting Magic Missile on ${target.name}.`,
              target,
              interrupt,
            );
        }
      },
    );

    // ...you have a +5 bonus to AC...
    g.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(ShieldEffect)) bonus.add(5, ShieldEffect);
    });
    // ...and you take no damage from magic missile.
    g.events.on("GatherDamage", ({ detail: { target, spell, multiplier } }) => {
      if (target.hasEffect(ShieldEffect) && spell === MagicMissile)
        multiplier.add("zero", ShieldEffect);
    });
  },
  { icon: ShieldIcon },
);

const Shield = simpleSpell({
  status: "implemented",
  name: "Shield",
  icon: ShieldIcon,
  level: 1,
  school: "Abjuration",
  time: "reaction",
  v: true,
  s: true,
  lists: ["Sorcerer", "Wizard"],
  description: `An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.`,

  getConfig: () => ({}),
  getTargets: (g, caster) => [caster],

  async apply(g, caster) {
    await caster.addEffect(ShieldEffect, { duration: 1 });
  },
});
export default Shield;
