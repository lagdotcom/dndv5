import Engine from "../../../Engine";
import MagicMissile from "../../../spells/level1/MagicMissile";
import { isEquipmentAttuned } from "../../../utils/items";
import WondrousItemBase from "../../WondrousItemBase";

export default class BroochOfShielding extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "Brooch of Shielding");
    this.attunement = true;
    this.rarity = "Uncommon";

    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, source, damageType, response } }) => {
        if (isEquipmentAttuned(this, who)) {
          if (source === MagicMissile) response.add("immune", this);
          else if (damageType === "force") response.add("resist", this);
        }
      },
    );
  }
}
