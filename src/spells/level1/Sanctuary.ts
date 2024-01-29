import { HasCaster, HasTarget } from "../../configs";
import DefaultingMap from "../../DefaultingMap";
import Effect from "../../Effect";
import { CombatantID } from "../../flavours";
import EvaluateLater from "../../interruptions/EvaluateLater";
import MessageBuilder from "../../MessageBuilder";
import Combatant from "../../types/Combatant";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { simpleSpell } from "../common";
import { targetsOne } from "../helpers";

const sanctuaryEffects = new DefaultingMap<CombatantID, Set<CombatantID>>(
  () => new Set(),
);
const SanctuaryEffect = new Effect<HasCaster>(
  "Sanctuary",
  "turnStart",
  (g) => {
    g.events.on("BattleStarted", () => {
      sanctuaryEffects.clear();
    });

    /* TODO [CANCELATTACK] Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball. */

    g.events.on("TurnStarted", ({ detail: { who } }) =>
      sanctuaryEffects.get(who.id).clear(),
    );

    g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
      if (!action.tags.has("harmful")) return;

      const effects = sanctuaryEffects.get(action.actor.id);
      const targets =
        action
          .getTargets(config)
          ?.filter((who) => who.hasEffect(SanctuaryEffect)) ?? [];
      for (const target of targets) {
        if (effects.has(target.id)) error.add("in Sanctuary", SanctuaryEffect);
      }
    });

    g.events.on("BeforeAttack", ({ detail: { target, interrupt, who } }) => {
      const config = target.getEffectConfig(SanctuaryEffect);

      if (config)
        interrupt.add(
          new EvaluateLater(
            who,
            SanctuaryEffect,
            Priority.ChangesOutcome,
            async () => {
              const { outcome } = await g.save({
                source: SanctuaryEffect,
                type: config.method.getSaveType(config.caster, Sanctuary),
                who,
                ability: "wis",
                tags: ["charm", "magic"],
              });

              if (outcome === "fail") {
                g.text(
                  new MessageBuilder()
                    .co(who)
                    .text(" fails to break ")
                    .co(target)
                    .nosp()
                    .text("'s Sanctuary."),
                );

                sanctuaryEffects.get(who.id).add(target.id);

                // TODO [ROLLBACKATTACK] ...the creature must choose a new target or lose the attack or spell.
              }
            },
          ),
        );
    });

    // If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.
    const getRemover = (who: Combatant) =>
      new EvaluateLater(who, SanctuaryEffect, Priority.Normal, () =>
        who.removeEffect(SanctuaryEffect),
      );
    g.events.on("Attack", ({ detail: { roll, interrupt } }) => {
      if (roll.type.who.hasEffect(SanctuaryEffect))
        interrupt.add(getRemover(roll.type.who));
    });
    g.events.on("SpellCast", ({ detail: { who, affected, interrupt } }) => {
      if (who.hasEffect(SanctuaryEffect))
        for (const target of affected) {
          if (target.side !== who.side) {
            interrupt.add(getRemover(target));
            return;
          }
        }
    });
    g.events.on("CombatantDamaged", ({ detail: { attacker, interrupt } }) => {
      if (attacker?.hasEffect(SanctuaryEffect))
        interrupt.add(getRemover(attacker));
    });
  },
  { tags: ["magic"] },
);

const Sanctuary = simpleSpell<HasTarget>({
  status: "incomplete",
  name: "Sanctuary",
  level: 1,
  school: "Abjuration",
  time: "bonus action",
  v: true,
  s: true,
  m: "a small silver mirror",
  lists: ["Artificer", "Cleric"],
  description: `You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball.

  If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.`,

  ...targetsOne(30, []),

  async apply({ caster, method }, { target }) {
    await target.addEffect(
      SanctuaryEffect,
      { caster, method, duration: minutes(1) },
      caster,
    );
  },
});
export default Sanctuary;
