import Engine from "../../Engine";
import { isEquipmentAttuned } from "../../utils/items";
import AbstractWondrous from "../AbstractWondrous";

export default class BracersOfTheArbalest extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Bracers of the Arbalest");
    this.attunement = true;
    this.rarity = "Uncommon";

    // While wearing these bracers, you have proficiency with all crossbows
    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who)) {
        who.weaponProficiencies.add("hand crossbow");
        who.weaponProficiencies.add("light crossbow");
        who.weaponProficiencies.add("heavy crossbow");
      }
    });

    // ... you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.
    g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
      if (
        isEquipmentAttuned(this, attacker) &&
        weapon?.ammunitionTag === "crossbow"
      )
        bonus.add(2, this);
    });
  }
}
