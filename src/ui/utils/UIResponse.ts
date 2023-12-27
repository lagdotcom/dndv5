import Combatant from "../../types/Combatant";
import Interruption from "../../types/Interruption";
import Priority from "../../types/Priority";
import Source from "../../types/Source";

const UISource: Source = { name: "UI" };

export default class UIResponse implements Interruption {
  priority: number;
  source: Source;

  constructor(
    public who: Combatant,
    public apply: () => Promise<void>,
  ) {
    this.source = UISource;
    this.priority = Priority.UI;
  }
}
