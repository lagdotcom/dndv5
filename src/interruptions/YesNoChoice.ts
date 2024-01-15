import Engine from "../Engine";
import YesNoChoiceEvent from "../events/YesNoChoiceEvent";
import { Description } from "../flavours";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Priority from "../types/Priority";
import Source from "../types/Source";

export default class YesNoChoice implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: Description,
    public priority: Priority,
    public yes?: () => Promise<unknown>,
    public no?: () => Promise<unknown>,
    public isStillValid?: () => boolean,
  ) {}

  async apply(g: Engine) {
    const choice = await new Promise<boolean>((resolve) =>
      g.fire(new YesNoChoiceEvent({ interruption: this, resolve })),
    );
    if (choice) await this.yes?.();
    else await this.no?.();
    return choice;
  }
}
