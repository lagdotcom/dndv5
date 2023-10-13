import ErrorCollector from "../collectors/ErrorCollector";
import InterruptionCollector from "../collectors/InterruptionCollector";
import SuccessResponseCollector from "../collectors/SuccessResponseCollector";
import { Scales } from "../configs";
import Engine from "../Engine";
import SpellCastEvent from "../events/SpellCastEvent";
import Action from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Icon from "../types/Icon";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class CastSpell<T extends object> implements Action<T> {
  name: string;
  time: ActionTime;
  icon?: Icon;
  subIcon?: Icon;
  isSpell: true;
  vocal?: boolean;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public method: SpellcastingMethod,
    public spell: Spell<T>,
  ) {
    this.name = `${spell.name} (${method.name})`;
    this.isSpell = true;
    this.time = spell.time;
    this.icon = spell.icon;
    this.subIcon = method.icon;
    this.vocal = spell.v;
  }

  get status() {
    return this.spell.status;
  }

  generateHealingConfigs(targets: Combatant[]) {
    return this.spell.generateHealingConfigs(
      this.g,
      this.actor,
      this.method,
      targets,
    );
  }

  getConfig(config: Partial<T>) {
    return this.spell.getConfig(this.g, this.actor, this.method, config);
  }

  getAffectedArea(config: Partial<T>) {
    return this.spell.getAffectedArea(this.g, this.actor, config);
  }

  getDamage(config: Partial<T>) {
    return this.spell.getDamage(this.g, this.actor, this.method, config);
  }

  getDescription() {
    return this.spell.description;
  }

  getHeal(config: Partial<T>) {
    return this.spell.getHeal(this.g, this.actor, this.method, config);
  }

  getResources(config: Partial<T>) {
    const level = this.spell.scaling
      ? (config as unknown as Scales).slot ?? this.spell.level
      : this.spell.level;
    const resource = this.method.getResourceForSpell(
      this.spell,
      level,
      this.actor,
    );

    return new Map(resource ? [[resource, 1]] : undefined);
  }

  getTargets(config: T) {
    return this.spell.getTargets(this.g, this.actor, config);
  }

  getTime() {
    return this.time;
  }

  check(config: Partial<T>, ec: ErrorCollector): ErrorCollector {
    if (!this.actor.hasTime(this.spell.time))
      ec.add(`No ${this.spell.time} left`, this);

    for (const [resource, amount] of this.getResources(config))
      if (!this.actor.hasResource(resource, amount))
        ec.add(`Not enough ${resource.name} left`, this.method);

    return this.spell.check(this.g, config, ec);
  }

  async apply(config: T) {
    const { actor, g, method, spell } = this;
    actor.useTime(spell.time);

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
        success: new SuccessResponseCollector(),
      }),
    );
    // TODO [MESSAGES] report this somehow
    if (sc.detail.success.result === "fail") return;

    // TODO should this be done here?
    // TODO also could have the ability to concentrate on multiple spells
    if (spell.concentration) await actor.endConcentration();

    // TODO use sc.detail.targets ?
    return spell.apply(g, actor, method, config);
  }
}
