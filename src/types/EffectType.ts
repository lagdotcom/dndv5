import Source from "./Source";

export type EffectDurationTimer = "turnStart" | "turnEnd";

export type EffectConfig<T = object> = T & { duration: number };

export default interface EffectType<T = object> extends Source {
  durationTimer: EffectDurationTimer;
  quiet: boolean;
  example?: T;
}
