import Engine from "../../Engine";
import { ChainShirtArmor } from "../armor";

export class ElvenChain extends ChainShirtArmor {
  constructor(g: Engine) {
    super(g);
    this.rarity = "Rare";

    // You gain a +1 bonus to AC while you wear this armor.
    this.ac++;

    // You are considered proficient with this armor even if you lack proficiency with medium armor.
    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (who.armor === this) who.armorProficiencies.add(this.category);
    });
  }
}
