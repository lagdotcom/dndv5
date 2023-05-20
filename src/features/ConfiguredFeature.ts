import Engine from "../Engine";
import Combatant from "../types/Combatant";
import Feature from "../types/Feature";

export default class ConfiguredFeature<T = undefined> implements Feature<T> {
  constructor(
    public name: string,
    private apply: (g: Engine, me: Combatant, config: T) => void
  ) {}

  setup(g: Engine, who: Combatant): void {
    const config = who.getConfig<T>(this.name);
    if (typeof config === "undefined") {
      console.warn(`${who.name} has no config for ${this.name}`);
      return;
    }

    this.apply(g, who, config as T);
  }
}
