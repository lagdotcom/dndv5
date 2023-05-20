import Engine from "../Engine";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import Spell from "../types/Spell";
import SpellcastingMethod from "../types/SpellcastingMethod";

export default class CastSpell<T extends object> implements Action<T> {
  config: ActionConfig<T>;
  name: string;

  constructor(
    public who: Combatant,
    public method: SpellcastingMethod,
    public spell: Spell<T>
  ) {
    this.name = `${spell.name} (${method.name})`;
    this.config = spell.config;
  }

  apply(g: Engine, config: T): Promise<void> {
    // TODO spend resources?

    return this.spell.apply(g, this.who, this.method, config);
  }
}
