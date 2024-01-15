import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import { Description } from "../flavours";
import Action, {
  ActionConfig,
  ActionTag,
  ConfigWithPositioning,
} from "../types/Action";
import ActionTime from "../types/ActionTime";
import Amount from "../types/Amount";
import Combatant from "../types/Combatant";
import DamageAmount from "../types/DamageAmount";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Empty from "../types/Empty";
import Icon from "../types/Icon";
import ImplementationStatus from "../types/ImplementationStatus";
import Resource from "../types/Resource";
import { MapInitialiser } from "../utils/map";
import { SetInitialiser } from "../utils/set";

export interface AbstractActionOptions {
  area?: SpecifiedEffectShape[];
  damage?: DamageAmount[];
  description?: Description;
  heal?: Amount[];
  icon?: Icon;
  resources?: MapInitialiser<Resource, number>;
  subIcon?: Icon;
  tags?: SetInitialiser<ActionTag>;
  time?: ActionTime;
}

export default abstract class AbstractAction<T extends object = Empty>
  implements Action<T>
{
  icon?: Icon;
  subIcon?: Icon;
  area?: SpecifiedEffectShape[];
  damage?: DamageAmount[];
  description?: Description;
  heal?: Amount[];
  resources: Map<Resource, number>;
  tags: Set<ActionTag>;
  time?: ActionTime;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public name: string,
    public status: ImplementationStatus,
    public config: ActionConfig<T>,
    {
      area,
      damage,
      description,
      heal,
      icon,
      resources,
      subIcon,
      tags,
      time,
    }: AbstractActionOptions = {},
  ) {
    this.area = area;
    this.damage = damage;
    this.description = description;
    this.heal = heal;
    this.resources = new Map(resources);
    this.time = time;
    this.icon = icon;
    this.subIcon = subIcon;
    this.tags = new Set(tags);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateAttackConfigs(targets: Combatant[]): ConfigWithPositioning<T>[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateHealingConfigs(targets: Combatant[]): ConfigWithPositioning<T>[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAffectedArea(config: Partial<T>) {
    return this.area;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract getAffected(config: T): Combatant[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getConfig(config: Partial<T>) {
    return this.config;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDamage(config: Partial<T>) {
    return this.damage;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDescription(config: Partial<T>) {
    return this.description;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHeal(config: Partial<T>) {
    return this.heal;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getResources(config: Partial<T>) {
    return this.resources;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract getTargets(config: Partial<T>): Combatant[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTime(config: Partial<T>) {
    return this.time;
  }

  check(config: Partial<T>, ec: ErrorCollector) {
    const time = this.getTime(config);
    if (time && !this.actor.hasTime(time)) ec.add(`No ${time} left`, this);

    for (const [resource, cost] of this.getResources(config))
      if (!this.actor.hasResource(resource, cost))
        ec.add(`Not enough ${resource.name} left`, this);

    return ec;
  }

  async applyCosts(config: T) {
    const time = this.getTime(config);
    if (time) this.actor.useTime(time);

    for (const [resource, cost] of this.getResources(config))
      this.actor.spendResource(resource, cost);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async apply(config: T) {
    await this.applyCosts(config);
  }
}
