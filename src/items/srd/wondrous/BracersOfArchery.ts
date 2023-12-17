import Engine from "../../../Engine";
import { isEquipmentAttuned } from "../../../utils/items";
import AbstractWondrous from "../../AbstractWondrous";

export default class BracersOfArchery extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Bracers of Archery");
    this.attunement = true;
    this.rarity = "Uncommon";

    // While wearing these bracers, you have proficiency with the longbow and shortbow
    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who)) {
        who.weaponProficiencies.add("longbow");
        who.weaponProficiencies.add("shortbow");
      }
    });

    // ... you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.
    g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
      if (isEquipmentAttuned(this, attacker) && weapon?.ammunitionTag === "bow")
        bonus.add(2, this);
    });
  }
}
