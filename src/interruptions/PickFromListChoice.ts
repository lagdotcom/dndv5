import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Source from "../types/Source";

export default class PickFromListChoice<T = unknown> implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: string,
    public items: Map<string, T>,
    public chosen: (choice: T) => Promise<void>
  ) {}
}
