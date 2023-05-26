import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import SpellCastEvent from "../events/SpellCastEvent";
import Action from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class CastSpell<T extends object> implements Action<T> {
  name: string;
  time: ActionTime;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public method: SpellcastingMethod,
    public spell: Spell<T>
  ) {
    this.name = `${spell.name} (${method.name})`;
    this.time = spell.time;
  }

  get config() {
    return this.spell.getConfig(this.g, this.method);
  }

  getAffectedArea(config: Partial<T>) {
    return this.spell.getAffectedArea(config);
  }

  check(config: Partial<T>, ec = new ErrorCollector()): ErrorCollector {
    if (!this.actor.time.has(this.spell.time))
      ec.add(`No ${this.spell.time} left`, this);

    const resource = this.method.getResourceForSpell(this.spell);
    if (resource && !this.actor.hasResource(resource))
      ec.add(`No ${resource.name} left`, this.method);

    return this.spell.check(config, ec);
  }

  async apply(config: T) {
    this.actor.time.delete(this.spell.time);

    const resource = this.method.getResourceForSpell(this.spell);
    if (resource) this.actor.spendResource(resource, 1);

    const sc = this.g.fire(
      new SpellCastEvent({
        who: this.actor,
        spell: this.spell,
        method: this.method,
        level: this.spell.getLevel(config),
      })
    );
    // TODO report this somehow
    if (sc.defaultPrevented) return;

    return this.spell.apply(this.g, this.actor, this.method, config);
  }
}
