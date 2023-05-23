import ErrorCollector from "../collectors/ErrorCollector";
import Engine from "../Engine";
import SpellCastEvent from "../events/SpellCastEvent";
import Action, { ActionConfig } from "../types/Action";
import ActionTime from "../types/ActionTime";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class CastSpell<T extends object> implements Action<T> {
  config: ActionConfig<T>;
  name: string;
  time: ActionTime;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public method: SpellcastingMethod,
    public spell: Spell<T>
  ) {
    this.name = `${spell.name} (${method.name})`;
    this.config = spell.config;
    this.time = spell.time;
  }

  getAffectedArea(config: Partial<T>) {
    return this.spell.getAffectedArea(config);
  }

  check(config: Partial<T>, ec = new ErrorCollector()): ErrorCollector {
    if (!this.actor.time.has(this.spell.time))
      ec.add(`No ${this.spell.time} left`, this);

    // TODO check resources (slot/whatever the method says)

    return this.spell.check(config, ec);
  }

  async apply(config: T): Promise<void> {
    this.actor.time.delete(this.spell.time);
    // TODO spend resources

    const sc = await this.g.resolve(
      new SpellCastEvent({
        who: this.actor,
        spell: this.spell,
        method: this.method,
        level: this.spell.getLevel(config),
      })
    );
    // TODO report this somehow
    if (sc.defaultPrevented) return;

    return this.spell.apply(this.actor, this.method, config);
  }
}
