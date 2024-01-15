import Engine from "../Engine";
import MultiListChoiceEvent from "../events/MultiListChoiceEvent";
import { Description } from "../flavours";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Priority from "../types/Priority";
import Source from "../types/Source";
import { PickChoice } from "./PickFromListChoice";

export default class MultiListChoice<T = unknown> implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: Description,
    public priority: Priority,
    public items: PickChoice<T>[],
    public minimum: number,
    public maximum: number = items.length,
    public chosen: (choice: T[]) => Promise<unknown>,
  ) {}

  async apply(g: Engine) {
    const choice = await new Promise<T[]>((resolve) =>
      g.fire(new MultiListChoiceEvent<T>({ interruption: this, resolve })),
    );
    return this.chosen(choice);
  }
}
