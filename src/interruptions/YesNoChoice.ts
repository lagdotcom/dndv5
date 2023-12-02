import Engine from "../Engine";
import YesNoChoiceEvent from "../events/YesNoChoiceEvent";
import Combatant from "../types/Combatant";
import Interruption from "../types/Interruption";
import Source from "../types/Source";

export default class YesNoChoice implements Interruption {
  constructor(
    public who: Combatant,
    public source: Source,
    public title: string,
    public text: string,
    public yes?: () => Promise<void>,
    public no?: () => Promise<void>,
    public priority: number = 10,
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
