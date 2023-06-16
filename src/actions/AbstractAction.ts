import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action, { ActionIcon } from "../types/Action";
import { ActionConfig } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import DamageAmount from "../types/DamageAmount";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Empty from "../types/Empty";
import ImplementationStatus from "../types/ImplementationStatus";

export default abstract class AbstractAction<T extends object = Empty>
  implements Action<T>
{
  icon?: ActionIcon;
  subIcon?: ActionIcon;
  isAttack?: boolean;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public name: string,
    public status: ImplementationStatus,
    public config: ActionConfig<T>,
    public time?: ActionTime,
    public area?: SpecifiedEffectShape[],
    public damage?: DamageAmount[]
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAffectedArea(config: Partial<T>) {
    return this.area;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getConfig(config: Partial<T>) {
    return this.config;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDamage(config: Partial<T>) {
    return this.damage;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTime(config: Partial<T>) {
    return this.time;
  }

  check(config: Partial<T>, ec: ErrorCollector) {
    const time = this.getTime(config);
    if (time && !this.actor.time.has(time)) ec.add(`No ${time} left`, this);

    return ec;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async apply(config: T) {
    const time = this.getTime(config);
    if (time) this.actor.time.delete(time);
  }
}
