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
    public no?: () => Promise<void>
  ) {}
}
