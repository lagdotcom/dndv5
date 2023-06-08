import ErrorCollector from "../collectors/ErrorCollector";
import ActionTime from "./ActionTime";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
import ImplementationStatus from "./ImplementationStatus";
import Resolver from "./Resolver";
import Source from "./Source";

export type ActionConfig<T> = { [K in keyof T]: Resolver<T[K]> };

export type ActionIcon = { url: string; colour?: string };

export default interface Action<T extends object = object> extends Source {
  status: ImplementationStatus;
  actor: Combatant;
  icon?: ActionIcon;
  subIcon?: ActionIcon;
  time?: ActionTime;

  apply(config: T): Promise<void>;
  check(config: Partial<T>, collector: ErrorCollector): ErrorCollector;
  getAffectedArea(config: Partial<T>): SpecifiedEffectShape[] | undefined;
  getConfig(config: Partial<T>): ActionConfig<T>;
  getDamage(config: Partial<T>): DamageAmount[] | undefined;
}
