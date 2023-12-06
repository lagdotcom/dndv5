import Engine from "../Engine";
import ListChoiceEvent from "../events/ListChoiceEvent";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Source from "../types/Source";

export type PickChoice<T> = {
  label: string;
  value: T;
  disabled?: boolean;
};

export default class PickFromListChoice<T = unknown> implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: string,
    public items: PickChoice<T>[],
    public chosen: (choice: T) => Promise<void>,
    public allowNone = false,
    public priority: number = 10,
    public isStillValid?: () => boolean,
  ) {}

  async apply(g: Engine) {
    const choice = await new Promise<T | undefined>((resolve) =>
      g.fire(new ListChoiceEvent<T>({ interruption: this, resolve })),
    );
    if (choice) return this.chosen?.(choice);
  }
}
