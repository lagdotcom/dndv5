import Engine from "../Engine";
import ListChoiceEvent from "../events/ListChoiceEvent";
import { Description } from "../flavours";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Priority from "../types/Priority";
import Source from "../types/Source";

export interface PickChoice<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

export default class PickFromListChoice<T = unknown> implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: Description,
    public priority: Priority,
    public items: PickChoice<T>[],
    public chosen: (choice: T) => Promise<unknown>,
    public allowNone = false,
    public isStillValid?: () => boolean,
  ) {}

  async apply(g: Engine) {
    const choice = await new Promise<T | undefined>((resolve) =>
      g.fire(new ListChoiceEvent<T>({ interruption: this, resolve })),
    );
    if (choice) return this.chosen?.(choice);
  }
}
