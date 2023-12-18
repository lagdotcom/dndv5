import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Priority from "../types/Priority";
import Source from "../types/Source";

export default class EvaluateLater implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public priority: Priority,
    public apply: () => Promise<unknown>,
  ) {}
}
