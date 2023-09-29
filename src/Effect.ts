import DndRule from "./DndRule";
import Engine from "./Engine";
import { EffectTag } from "./types/EffectTag";
import EffectType, { EffectDurationTimer } from "./types/EffectType";

interface EffectConfig {
  durationTimer?: EffectDurationTimer;
  quiet?: boolean;
  image?: string;
  tags?: EffectTag[];
}

export default class Effect<T = object> implements EffectType<T> {
  rule?: DndRule;
  example?: T;
  tags: Set<EffectTag>;
  quiet: boolean;
  image?: string;

  constructor(
    public name: string,
    public durationTimer: EffectDurationTimer,
    setup?: (g: Engine) => void,
    { quiet = false, image, tags = [] }: EffectConfig = {},
  ) {
    this.quiet = quiet;
    this.image = image;
    this.tags = new Set(tags);

    if (setup) this.rule = new DndRule(name, setup);
  }
}
