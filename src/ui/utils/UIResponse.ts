import Combatant from "../../types/Combatant";
import Interruption from "../../types/Interruption";
import Source from "../../types/Source";

const UISource = { name: "UI" };

export default class UIResponse implements Interruption {
  priority: number;
  source: Source;

  constructor(
    public who: Combatant,
    public apply: () => Promise<void>,
  ) {
    this.source = UISource;
    this.priority = 0;
  }
}
