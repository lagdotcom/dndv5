import ConditionName from "./ConditionName";
import { EffectTag } from "./EffectTag";
import Empty from "./Empty";
import Icon from "./Icon";
import Source from "./Source";

export type EffectDurationTimer = "turnStart" | "turnEnd";

export type EffectConfig<T = Empty> = T & {
  conditions?: Set<ConditionName>;
  duration: number;
};

export default interface EffectType<T = Empty> extends Source {
  durationTimer: EffectDurationTimer;
  quiet: boolean;
  example?: T;
  tags: Set<EffectTag>;
  icon?: Icon;
}
