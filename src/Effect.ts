import DndRule from "./DndRule";
import Engine from "./Engine";
import { EffectTag } from "./types/EffectTag";
import EffectType, { EffectDurationTimer } from "./types/EffectType";
import Icon from "./types/Icon";
import { SetInitialiser } from "./utils/set";

interface EffectConfig {
  durationTimer?: EffectDurationTimer;
  quiet?: boolean;
  icon?: Icon;
  tags?: SetInitialiser<EffectTag>;
}

export default class Effect<T = object> implements EffectType<T> {
  rule?: DndRule;
  example?: T;
  tags: Set<EffectTag>;
  quiet: boolean;
  icon?: Icon;

  constructor(
    public name: string,
    public durationTimer: EffectDurationTimer,
    setup?: (g: Engine) => void,
    { quiet = false, icon, tags }: EffectConfig = {},
  ) {
    this.quiet = quiet;
    this.icon = icon;
    this.tags = new Set(tags);

    if (setup) this.rule = new DndRule(name, setup);
  }
}
