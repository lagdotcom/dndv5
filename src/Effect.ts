import DndRule from "./DndRule";
import Engine from "./Engine";
import EffectType, { EffectDurationTimer } from "./types/EffectType";

export default class Effect<T = object> implements EffectType<T> {
  rule?: DndRule;
  example?: T;

  constructor(
    public name: string,
    public durationTimer: EffectDurationTimer,
    setup?: (g: Engine) => void,
    public quiet = false,
  ) {
    if (setup) this.rule = new DndRule(name, setup);
  }
}
