import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import EvaluateLater from "../../interruptions/EvaluateLater";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { svSet } from "../../types/SaveTag";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { getSaveDC } from "../../utils/dnd";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

const HoldPersonEffect = new Effect<{
  affected: Set<Combatant>;
  caster: Combatant;
  method: SpellcastingMethod;
}>("Hold Person", "turnStart", (g) => {
  g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
    if (who.hasEffect(HoldPersonEffect))
      conditions.add("Paralyzed", HoldPersonEffect);
  });

  g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
    const config = who.getEffectConfig(HoldPersonEffect);
    if (config) {
      const dc = getSaveDC(config.caster, config.method.ability);
      interrupt.add(
        new EvaluateLater(who, HoldPersonEffect, async () => {
          const save = await g.savingThrow(dc, {
            who,
            attacker: config.caster,
            ability: "wis",
            spell: HoldPerson,
            effect: HoldPersonEffect,
            config,
            tags: svSet(),
          });

          if (save.outcome === "success") {
            await who.removeEffect(HoldPersonEffect);
            config.affected.delete(who);
            // TODO [CONCENTRATION] stop concentrating if affected is empty
          }
        }),
      );
    }
  });
});

const HoldPerson = scalingSpell<HasTargets>({
  status: "incomplete",
  name: "Hold Person",
  level: 2,
  school: "Enchantment",
  concentration: true,
  v: true,
  s: true,
  m: "a small, straight piece of iron",
  lists: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],

  getConfig: (g, actor, method, { slot }) => ({
    targets: new MultiTargetResolver(g, 1, (slot ?? 2) - 1, 60),
  }),
  getTargets: (g, caster, { targets }) => targets,

  check(g, { targets }, ec) {
    // TODO When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.

    return ec;
  },

  async apply(g, caster, method, { targets }) {
    const dc = getSaveDC(caster, method.ability);
    const affected = new Set<Combatant>();
    const duration = minutes(1);
    const conditions = coSet("Paralyzed");

    for (const target of targets) {
      const config = {
        affected,
        caster,
        method,
        duration,
        conditions,
      };

      const save = await g.savingThrow(dc, {
        who: target,
        attacker: caster,
        ability: "wis",
        spell: HoldPerson,
        effect: HoldPersonEffect,
        config,
        tags: svSet(),
      });

      if (
        save.outcome === "fail" &&
        (await target.addEffect(HoldPersonEffect, config))
      )
        affected.add(target);
    }

    if (affected.size > 0)
      await caster.concentrateOn({
        spell: HoldPerson,
        duration,
        async onSpellEnd() {
          for (const target of affected)
            await target.removeEffect(HoldPersonEffect);
        },
      });
  },
});
export default HoldPerson;
