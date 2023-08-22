import DndRule from "./DndRule";
import Engine from "./Engine";
import { EffectTag } from "./types/EffectTag";
import EffectType, { EffectDurationTimer } from "./types/EffectType";

export default class Effect<T = object> implements EffectType<T> {
  rule?: DndRule;
  example?: T;
  tags: Set<EffectTag>;

  constructor(
    public name: string,
    public durationTimer: EffectDurationTimer,
    setup?: (g: Engine) => void,
    public quiet = false,
    tags: EffectTag[] = [],
  ) {
    this.tags = new Set(tags);
    if (setup) this.rule = new DndRule(name, setup);
  }
}
