import { HasTargets } from "../../configs";
import Effect from "../../Effect";
import { EngineSaveConfig } from "../../Engine";
import { canSee, ofCreatureType, withinRangeOfEachOther } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import Combatant from "../../types/Combatant";
import { coSet } from "../../types/ConditionName";
import { efSet } from "../../types/EffectTag";
import { EffectConfig } from "../../types/EffectType";
import SpellcastingMethod from "../../types/SpellcastingMethod";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";

interface Config {
  affected: Set<Combatant>;
  caster: Combatant;
  method: SpellcastingMethod;
}

const getHoldPersonSave = (
  who: Combatant,
  config: EffectConfig<Config>,
): EngineSaveConfig<Config> => ({
  source: HoldPersonEffect,
  type: config.method.getSaveType(config.caster, HoldPerson),
  who,
  attacker: config.caster,
  ability: "wis",
  spell: HoldPerson,
  effect: HoldPersonEffect,
  config,
  tags: ["magic"],
});

const HoldPersonEffect = new Effect<Config>(
  "Hold Person",
  "turnStart",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(HoldPersonEffect))
        conditions.add("Paralyzed", HoldPersonEffect);
    });

    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(HoldPersonEffect);
      if (config) {
        interrupt.add(
          new EvaluateLater(who, HoldPersonEffect, async () => {
            const { outcome } = await g.save(getHoldPersonSave(who, config));

            if (outcome === "success") {
              await who.removeEffect(HoldPersonEffect);

              config.affected.delete(who);
              if (config.affected.size < 1)
                await config.caster.endConcentration();
            }
          }),
        );
      }
    });
  },
  { tags: efSet("magic") },
);

const HoldPerson = scalingSpell<HasTargets>({
  status: "implemented",
  name: "Hold Person",
  level: 2,
  school: "Enchantment",
  concentration: true,
  v: true,
  s: true,
  m: "a small, straight piece of iron",
  lists: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description: `Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.

  At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.`,

  getConfig: (g, actor, method, { slot }) => ({
    targets: new MultiTargetResolver(
      g,
      1,
      (slot ?? 2) - 1,
      60,
      [canSee, ofCreatureType("humanoid")],
      [withinRangeOfEachOther(30)],
    ),
  }),
  getTargets: (g, caster, { targets }) => targets ?? [],
  getAffected: (g, caster, { targets }) => targets,

  async apply(g, caster, method, { targets }) {
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

      const { outcome } = await g.save(getHoldPersonSave(target, config));

      if (
        outcome === "fail" &&
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
