import Engine from "../Engine";
import Combatant from "./Combatant";
import Priority from "./Priority";
import Source from "./Source";

export default interface Interruption {
  who: Combatant;
  source: Source;
  apply(g: Engine): Promise<unknown>;
  priority: Priority;

  isStillValid?: () => boolean;
}
