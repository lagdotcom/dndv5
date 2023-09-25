import InterruptionCollector from "../collectors/InterruptionCollector";
import Combatant from "../types/Combatant";
import EffectType, { EffectConfig } from "../types/EffectType";

export interface EffectRemovedDetail<T = unknown> {
  who: Combatant;
  effect: EffectType<T>;
  config: EffectConfig<T>;
  interrupt: InterruptionCollector;
}

export default class EffectRemovedEvent<T = object> extends CustomEvent<
  EffectRemovedDetail<T>
> {
  constructor(detail: EffectRemovedDetail<T>) {
    super("EffectRemoved", { detail });
  }
}
