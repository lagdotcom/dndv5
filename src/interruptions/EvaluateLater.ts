import Engine from "../Engine";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Source from "../types/Source";

export default class EvaluateLater implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public apply: (g: Engine) => Promise<void>,
    public priority = 5,
  ) {}
}
