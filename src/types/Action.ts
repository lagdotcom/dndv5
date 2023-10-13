import ErrorCollector from "../collectors/ErrorCollector";
import ActionTime from "./ActionTime";
import Amount from "./Amount";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
import Icon from "./Icon";
import ImplementationStatus from "./ImplementationStatus";
import Resolver from "./Resolver";
import Resource from "./Resource";
import Source from "./Source";

export type ActionConfig<T> = { [K in keyof T]: Resolver<T[K]> };

export default interface Action<T extends object = object> extends Source {
  status: ImplementationStatus;
  actor: Combatant;
  subIcon?: Icon;
  isAttack?: boolean;
  isSpell?: boolean;
  vocal?: boolean;

  apply(config: T): Promise<void>;
  check(config: Partial<T>, collector: ErrorCollector): ErrorCollector;
  getAffectedArea(config: Partial<T>): SpecifiedEffectShape[] | undefined;
  getConfig(config: Partial<T>): ActionConfig<T>;
  getDamage(config: Partial<T>): DamageAmount[] | undefined;
  getDescription(config: Partial<T>): string | undefined;
  getHeal(config: Partial<T>): Amount[] | undefined;
  getResources(config: Partial<T>): Map<Resource, number>;
  getTargets(config: T): Combatant[] | undefined;
  getTime(config: Partial<T>): ActionTime | undefined;

  generateHealingConfigs(targets: Combatant[]): T[];
}
