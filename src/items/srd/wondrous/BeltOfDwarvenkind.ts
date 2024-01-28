import Engine from "../../../Engine";
import { Darkvision60 } from "../../../features/common";
import { DwarvenResilience } from "../../../races/Dwarf";
import { isEquipmentAttuned } from "../../../utils/items";
import WondrousItemBase from "../../WondrousItemBase";

export default class BeltOfDwarvenkind extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "belt of dwarvenkind");
    this.attunement = true;
    this.rarity = "Rare";

    /* While wearing this belt, you gain the following benefits:
- Your Constitution score increases by 2, to a maximum of 20.
- You have advantage on Charisma (Persuasion) checks made to interact with dwarves.
- In addition, while attuned to the belt, you have a 50 percent chance each day at dawn of growing a full beard if you're capable of growing one, or a visibly thicker beard if you already have one.

If you aren't a dwarf, you gain the following additional benefits while wearing the belt:
- You have advantage on saving throws against poison, and you have resistance against poison damage.
- You have darkvision out to a range of 60 feet.
- You can speak, read, and write Dwarvish. */

    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who)) {
        // Your Constitution score increases by 2, to a maximum of 20.
        who.con.score += 2;

        if (!who.tags.has("dwarf")) {
          // You have advantage on saving throws against poison, and you have resistance against poison damage.
          who.addFeature(DwarvenResilience);
          // You have darkvision out to a range of 60 feet.
          who.addFeature(Darkvision60);
          // You can speak, read, and write Dwarvish.
          who.languages.add("Dwarvish");
        }
      }
    });

    // You have advantage on Charisma (Persuasion) checks made to interact with dwarves.
    g.events.on(
      "BeforeCheck",
      ({ detail: { skill, ability, who, diceType, target } }) => {
        if (
          isEquipmentAttuned(this, who) &&
          skill === "Persuasion" &&
          ability === "cha" &&
          target?.tags.has("dwarf")
        )
          diceType.add("advantage", this);
      },
    );

    // alas, the beard goes unimplemented
  }
}
