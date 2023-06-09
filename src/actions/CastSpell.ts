import ErrorCollector from "../collectors/ErrorCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
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

  getResources(config: Partial<T>) {
    const level = this.spell.scaling
      ? (config as unknown as Scales).slot ?? this.spell.level
      : this.spell.level;
    const resource = this.method.getResourceForSpell(
      this.spell,
      level,
      this.actor
    );

    return new Map(resource ? [[resource, 1]] : undefined);
  }

  getTime() {
    return this.time;
  }

  check(config: Partial<T>, ec: ErrorCollector): ErrorCollector {
    if (!this.actor.time.has(this.spell.time))
      ec.add(`No ${this.spell.time} left`, this);

    for (const [resource, amount] of this.getResources(config))
      if (!this.actor.hasResource(resource, amount))
        ec.add(`Not enough ${resource.name} left`, this.method);

    return this.spell.check(this.g, config, ec);
  }

  async apply(config: T) {
    const { actor, g, method, spell } = this;
    actor.time.delete(spell.time);

    for (const [resource, amount] of this.getResources(config))
      actor.spendResource(resource, amount);

    const sc = await g.resolve(
      new SpellCastEvent({
        who: actor,
        spell,
        method,
        level: spell.getLevel(config),
        targets: new Set(spell.getTargets(g, actor, config)),
        interrupt: new InterruptionCollector(),
      })
    );
    // TODO [MESSAGES] report this somehow
    if (sc.defaultPrevented) return;

    // TODO use sc.detail.targets ?
    return spell.apply(g, actor, method, config);
  }
}
