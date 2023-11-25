import Engine from "../../Engine";
import { isEquipmentAttuned } from "../../utils/items";
import AbstractWondrous from "../AbstractWondrous";

export default class BootsOfTheWinterlands extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Boots of the Winterlands");
    this.attunement = true;
    this.rarity = "Uncommon";

    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (isEquipmentAttuned(this, who) && damageType === "cold")
          response.add("resist", this);
      },
    );

    // TODO [TERRAIN] You ignore difficult terrain created by ice or snow.

    // TODO You can tolerate temperatures as low as -50 degrees Fahrenheit without any additional protection. If you wear heavy clothes, you can tolerate temperatures as low as -100 degrees Fahrenheit.
  }
}
