import Engine from "../Engine";
import { Description } from "../flavours";
import Combatant from "../types/Combatant";
import Feature from "../types/Feature";

export default class SimpleFeature implements Feature<undefined> {
  constructor(
    public name: string,
    public text: Description,
    public setup: (g: Engine, me: Combatant) => void,
  ) {}
}
