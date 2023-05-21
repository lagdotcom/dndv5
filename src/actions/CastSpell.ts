import Engine from "../Engine";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class CastSpell<T extends object> implements Action<T> {
  config: ActionConfig<T>;
  name: string;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public method: SpellcastingMethod,
    public spell: Spell<T>
  ) {
    this.name = `${spell.name} (${method.name})`;
    this.config = spell.config;
  }

  apply(config: T): Promise<void> {
    // TODO spend resources?

    return this.spell.apply(this.actor, this.method, config);
  }
}
