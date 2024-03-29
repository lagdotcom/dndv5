import Engine from "../../../Engine";
import { isEquipmentAttuned } from "../../../utils/items";
import WondrousItemBase from "../../WondrousItemBase";

export default class CloakOfProtection extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "Cloak of Protection");
    this.attunement = true;
    this.rarity = "Uncommon";

    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (isEquipmentAttuned(this, who))
        for (const method of methods) {
          method.ac++;
          method.uses.add(this);
        }
    });

    g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
      if (isEquipmentAttuned(this, who)) bonus.add(1, this);
    });
  }
}
