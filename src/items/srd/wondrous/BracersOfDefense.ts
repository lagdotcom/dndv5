import Engine from "../../../Engine";
import { isEquipmentAttuned } from "../../../utils/items";
import WondrousItemBase from "../../WondrousItemBase";

export default class BracersOfDefense extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "Bracers of Defense");
    this.attunement = true;
    this.rarity = "Rare";

    // While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield.
    g.events.on("GetAC", ({ detail }) => {
      if (
        isEquipmentAttuned(this, detail.who) &&
        !detail.who.armor &&
        !detail.who.shield
      )
        detail.bonus.add(2, this);
    });
  }
}
