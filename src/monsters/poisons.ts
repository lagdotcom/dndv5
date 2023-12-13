import Effect from "../Effect";
import EvaluateLater from "../interruptions/EvaluateLater";
import AbilityName from "../types/AbilityName";
import SaveType from "../types/SaveType";

export interface CanRecover {
  type: SaveType;
  ability: AbilityName;
}

// Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.
export const ParalyzingPoisonEffect = new Effect<CanRecover>(
  "Paralyzing Poison",
  "turnEnd",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(ParalyzingPoisonEffect)) {
        conditions.add("Poisoned", ParalyzingPoisonEffect);
        conditions.add("Paralyzed", ParalyzingPoisonEffect);
      }
    });

    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(ParalyzingPoisonEffect);
      if (config)
        interrupt.add(
          new EvaluateLater(who, ParalyzingPoisonEffect, async () => {
            const { outcome } = await g.save({
              source: ParalyzingPoisonEffect,
              type: config.type,
              ability: config.ability,
              who,
              effect: ParalyzingPoisonEffect,
              config,
              tags: ["poison"],
            });

            if (outcome === "success")
              await who.removeEffect(ParalyzingPoisonEffect);
          }),
        );
    });
  },
  { tags: ["poison"] },
);
