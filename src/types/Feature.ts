import Engine from "../Engine";
import { Description } from "../flavours";
import Combatant from "./Combatant";
import Source from "./Source";

export default interface Feature<T = unknown> extends Source {
  text: Description;

  setup(g: Engine, who: Combatant, config: T): void;
}
