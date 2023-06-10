import ErrorCollector from "../collectors/ErrorCollector";
import { Scales } from "../configs";
import Engine from "../Engine";
import SpellCastEvent from "../events/SpellCastEvent";
import Action, { ActionIcon } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class CastSpell<T extends object> implements Action<T> {
  name: string;
  time: ActionTime;
  icon?: ActionIcon;
  subIcon?: ActionIcon;
  isSpell: true;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public method: SpellcastingMethod,
    public spell: Spell<T>
  ) {
    this.name = `${spell.name} (${method.name})`;
    this.isSpell = true;
    this.time = spell.time;
    this.icon = spell.icon;
    this.subIcon = method.icon;
  }

  get status() {
    return this.spell.status;
  }

  getConfig(config: Partial<T>) {
    return this.spell.getConfig(this.g, this.actor, this.method, config);
  }

  getAffectedArea(config: Partial<T>) {
    return this.spell.getAffectedArea(this.g, this.actor, config);
  }

  getDamage(config: Partial<T>) {
    return this.spell.getDamage(this.g, this.actor, config);
  }

  getResource(config: Partial<T>) {
    const level = this.spell.scaling
      ? (config as unknown as Scales).slot ?? this.spell.level
      : this.spell.level;

    return this.method.getResourceForSpell(this.spell, level, this.actor);
  }

  check(config: Partial<T>, ec: ErrorCollector): ErrorCollector {
    if (!this.actor.time.has(this.spell.time))
      ec.add(`No ${this.spell.time} left`, this);

    const resource = this.getResource(config);
    if (resource && !this.actor.hasResource(resource))
      ec.add(`No ${resource.name} left`, this.method);

    return this.spell.check(this.g, config, ec);
  }

  async apply(config: T) {
    this.actor.time.delete(this.spell.time);

    const resource = this.getResource(config);
    if (resource) this.actor.spendResource(resource, 1);

    const sc = this.g.fire(
      new SpellCastEvent({
        who: this.actor,
        spell: this.spell,
        method: this.method,
        level: this.spell.getLevel(config),
      })
    );
    // TODO [MESSAGES] report this somehow
    if (sc.defaultPrevented) return;

    return this.spell.apply(this.g, this.actor, this.method, config);
  }
}
