import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import Combatant from "../types/Combatant";
import EffectType, { EffectConfig } from "../types/EffectType";
import Empty from "../types/Empty";

export interface BeforeEffectDetail<T = unknown> {
  who: Combatant;
  attacker?: Combatant;
  effect: EffectType<T>;
  config: EffectConfig<T>;
  interrupt: InterruptionCollector;
  success: SuccessResponseCollector;
}

export default class BeforeEffectEvent<T = Empty> extends CustomEvent<
  BeforeEffectDetail<T>
> {
  constructor(detail: BeforeEffectDetail<T>) {
    super("BeforeEffect", { detail });
  }
}
