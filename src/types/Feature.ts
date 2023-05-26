import Engine from "../Engine";
import Combatant from "./Combatant";
import Source from "./Source";

export default interface Feature<T = unknown> extends Source {
  text: string;

  setup(g: Engine, who: Combatant, config: T): void;
}
