import Engine from "../Engine";
import { AbstractWondrous } from "./wondrous";

export class WandOfWeb extends AbstractWondrous {
  constructor(g: Engine, public charges = 7) {
    super(g, "Wand of Web", 1);
    this.attunement = true;
    this.rarity = "Uncommon";

    // TODO While holding it, you can use an action to expend 1 of its charges to cast the web spell (save DC 15) from it.
  }
}
