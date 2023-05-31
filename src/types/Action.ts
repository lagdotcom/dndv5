import ErrorCollector from "../collectors/ErrorCollector";
import ActionTime from "./ActionTime";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
import Source from "./Source";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Resolver<T> = {
  type: string;
  check(
    value: unknown,
    action: Action,
    collector?: ErrorCollector
  ): ErrorCollector;
};

export type ActionConfig<T> = { [K in keyof T]: Resolver<T[K]> };

export default interface Action<T extends object = object> extends Source {
  actor: Combatant;
  time?: ActionTime;

  apply(config: T): Promise<void>;
  check(config: Partial<T>, collector?: ErrorCollector): ErrorCollector;
  getAffectedArea(config: Partial<T>): SpecifiedEffectShape[] | undefined;
  getConfig(config: Partial<T>): ActionConfig<T>;
  getDamage(config: Partial<T>): DamageAmount[] | undefined;
}
