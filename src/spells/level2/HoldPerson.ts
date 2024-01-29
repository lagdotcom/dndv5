import { HasCaster, HasTargets } from "../../configs";
import Effect from "../../Effect";
import { EngineSaveConfig } from "../../Engine";
import { canSee, ofCreatureType, withinRangeOfEachOther } from "../../filters";
import EvaluateLater from "../../interruptions/EvaluateLater";
import MultiTargetResolver from "../../resolvers/MultiTargetResolver";
import Combatant from "../../types/Combatant";
import { EffectConfig } from "../../types/EffectType";
import Priority from "../../types/Priority";
import { minutes } from "../../utils/time";
import { scalingSpell } from "../common";
import { requiresSave, targetsMany } from "../helpers";

type Config = HasCaster & { affected: Set<Combatant> };

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
  tags: ["magic", "impedes movement"],
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
          new EvaluateLater(
            who,
            HoldPersonEffect,
            Priority.Normal,
            async () => {
              const { outcome } = await g.save(getHoldPersonSave(who, config));

              if (outcome === "success")
                await who.removeEffect(HoldPersonEffect);
            },
          ),
        );
      }
    });

    g.events.on(
      "EffectRemoved",
      ({ detail: { effect, config, who, interrupt } }) => {
        if (effect === HoldPersonEffect) {
          const { affected, caster } = config as EffectConfig<Config>;
          affected.delete(who);
          if (affected.size < 1)
            interrupt.add(
              new EvaluateLater(caster, HoldPerson, Priority.Normal, () =>
                caster.endConcentration(HoldPerson),
              ),
            );
        }
      },
    );
  },
  { tags: ["magic"] },
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

  ...targetsMany(1, 1, 60, [canSee, ofCreatureType("humanoid")]),
  ...requiresSave("wis"),
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

  async apply(sh) {
    const mse = sh.getMultiSave({
      ability: "wis",
      effect: HoldPersonEffect,
      duration: minutes(1),
      tags: ["impedes movement"],
    });
    if (await mse.apply({})) await mse.concentrate();
  },
});
export default HoldPerson;
