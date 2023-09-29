import Engine from "../Engine";
import Combatant from "./Combatant";
import Source from "./Source";

export default interface Interruption {
  who: Combatant;
  source: Source;
  apply(g: Engine): Promise<unknown>;
}
