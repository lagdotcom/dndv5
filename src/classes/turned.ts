import DashAction from "../actions/DashAction";
import DodgeAction from "../actions/DodgeAction";
import Effect from "../Effect";
import EvaluateLater from "../interruptions/EvaluateLater";
import Combatant from "../types/Combatant";
import { compareDistances } from "../utils/units";

export interface TurnedConfig {
  turner: Combatant;
}

export const TurnedEffect = new Effect<TurnedConfig>(
  "Turned",
  "turnEnd",
  (g) => {
    // [...] it is turned for 1 minute or until it takes any damage.
    g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
      if (who.hasEffect(TurnedEffect))
        interrupt.add(
          new EvaluateLater(who, TurnedEffect, async () => {
            await who.removeEffect(TurnedEffect);
          }),
        );
    });

    // A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you.
    // TODO force spending movement
    g.events.on(
      "BeforeMove",
      ({ detail: { who, handler, from, to, error } }) => {
        const config = who.getEffectConfig(TurnedEffect);
        if (config && !handler.forced) {
          const { oldDistance, newDistance } = compareDistances(
            config.turner,
            config.turner.position,
            who,
            from,
            to,
          );

          if (newDistance > oldDistance) return;

          if (newDistance <= 30)
            error.add(
              `cannot willingly move within 30' of ${config.turner.name}`,
              TurnedEffect,
            );
          else
            error.add(
              `must move away from ${config.turner.name}`,
              TurnedEffect,
            );
        }
      },
    );

    // It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.
    g.events.on("CheckAction", ({ detail }) => {
      if (!detail.action.actor.hasEffect(TurnedEffect)) return;

      if (detail.action.getTime(detail.config) === "reaction")
        detail.error.add("cannot take reactions", TurnedEffect);
      else {
        if (detail.action.tags.has("escape move prevention")) return;
        if (detail.action instanceof DashAction) return;

        // TODO should only allow this if there is nowhere to move
        if (detail.action instanceof DodgeAction) return;

        detail.error.add(
          "must Dash or escape an effect that prevents movement",
          TurnedEffect,
        );
      }
    });
  },
);
