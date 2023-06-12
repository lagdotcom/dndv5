import Engine from "../Engine";
import MultiListChoiceEvent from "../events/MultiListChoiceEvent";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Source from "../types/Source";
import { PickChoice } from "./PickFromListChoice";

export default class MultiListChoice<T = unknown> implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: string,
    public items: PickChoice<T>[],
    public minimum: number,
    public maximum: number = items.length,
    public chosen: (choice: T[]) => Promise<void>
  ) {}

  async apply(g: Engine) {
    const choice = await new Promise<T[]>((resolve) =>
      g.fire(new MultiListChoiceEvent<T>({ interruption: this, resolve }))
    );
    return this.chosen(choice);
  }
}
