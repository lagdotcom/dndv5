import ErrorCollector from "../collectors/ErrorCollector";
import { Description } from "../flavours";
import ActionTime from "./ActionTime";
import { PositionConstraint } from "./AIRule";
import Amount from "./Amount";
import Combatant from "./Combatant";
import DamageAmount from "./DamageAmount";
import { SpecifiedEffectShape } from "./EffectArea";
import Empty from "./Empty";
import Icon from "./Icon";
import ImplementationStatus from "./ImplementationStatus";
import Resolver from "./Resolver";
import Resource from "./Resource";
import Source from "./Source";

export type ActionConfig<T> = { [K in keyof T]: Resolver<T[K]> };
export type GetActionConfig<T> = (config: Partial<T>) => ActionConfig<T>;

export interface ConfigWithPositioning<T> {
  config: T;
  positioning: Set<PositionConstraint>;
}

export const ActionTags = [
  "attack",
  "costs attack",
  "escape move prevention",
  "harmful",
  "spell",
  "vocal",
] as const;
export type ActionTag = (typeof ActionTags)[number];

export default interface Action<T extends object = Empty> extends Source {
  status: ImplementationStatus;
  actor: Combatant;
  subIcon?: Icon;
  tags: Set<ActionTag>;

  apply(config: T): Promise<void>;
  check(config: Partial<T>, collector: ErrorCollector): ErrorCollector;
  getAffected(config: T): Combatant[];
  getAffectedArea(config: Partial<T>): SpecifiedEffectShape[] | undefined;
  getConfig: GetActionConfig<T>;
  getDamage(config: Partial<T>): DamageAmount[] | undefined;
  getDescription(config: Partial<T>): Description | undefined;
  getHeal(config: Partial<T>): Amount[] | undefined;
  getResources(config: Partial<T>): Map<Resource, number>;
  getTargets(config: Partial<T>): Combatant[] | undefined;
  getTime(config: Partial<T>): ActionTime | undefined;

  generateAttackConfigs(targets: Combatant[]): ConfigWithPositioning<T>[];
  generateHealingConfigs(targets: Combatant[]): ConfigWithPositioning<T>[];
}
