import Combatant from "../types/Combatant";
import EffectType, { EffectConfig } from "../types/EffectType";

export interface EffectAddedDetail<T = unknown> {
  who: Combatant;
  effect: EffectType<T>;
  config: EffectConfig<T>;
}

export default class EffectAddedEvent<T = object> extends CustomEvent<
  EffectAddedDetail<T>
> {
  constructor(detail: EffectAddedDetail<T>) {
    super("EffectAdded", { detail });
  }
}
