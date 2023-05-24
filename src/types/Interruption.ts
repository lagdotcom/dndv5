import Combatant from "./Combatant";
import Source from "./Source";

export default interface Interruption {
  who: Combatant;
  source: Source;
}
