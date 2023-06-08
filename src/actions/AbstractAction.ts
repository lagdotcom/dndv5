import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import Action, { ActionIcon } from "../types/Action";
import { ActionConfig } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import DamageAmount from "../types/DamageAmount";
import { SpecifiedEffectShape } from "../types/EffectArea";
import Empty from "../types/Empty";

export default abstract class AbstractAction<T extends object = Empty>
  implements Action<T>
{
  icon?: ActionIcon;
  subIcon?: ActionIcon;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public name: string,
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

  check(config: Partial<T>, ec: ErrorCollector) {
    if (this.time && !this.actor.time.has(this.time))
      ec.add(`No ${this.time} left`, this);

    return ec;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async apply(config: T) {
    if (this.time) this.actor.time.delete(this.time);
  }
}
