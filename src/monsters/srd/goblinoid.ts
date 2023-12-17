import goblinUrl from "@img/tok/goblin.png";

import DisengageAction from "../../actions/DisengageAction";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { Arrow } from "../../items/ammunition";
import { LeatherArmor, Shield } from "../../items/armor";
import { Scimitar, Shortbow } from "../../items/weapons";
import Monster from "../../Monster";
import SizeCategory from "../../types/SizeCategory";
import { featureNotComplete } from "../../utils/env";

const NimbleEscape = new SimpleFeature(
  "Nimble Escape",
  `The goblin can take the Disengage or Hide action as a bonus action on each of its turns.`,
  (g, me) => {
    featureNotComplete(NimbleEscape, me);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) {
        // TODO [SIGHT] HideAction
        const cunning = [new DisengageAction(g, who)];
        for (const action of cunning) {
          action.name += " (Nimble Escape)";
          action.time = "bonus action";
        }

        actions.push(...cunning);
      }
    });
  },
);

export class Goblin extends Monster {
  constructor(g: Engine, wieldingBow = false) {
    super(g, "goblin", 0.25, "humanoid", SizeCategory.Small, goblinUrl, 7);
    this.movement.set("speed", 30);
    this.addProficiency("Stealth", "expertise");
    this.senses.set("darkvision", 60);
    this.languages.add("Common");
    this.languages.add("Goblin");

    this.addFeature(NimbleEscape);

    this.don(new LeatherArmor(g), true);

    const shield = new Shield(g);
    const scimitar = new Scimitar(g);
    const bow = new Shortbow(g);

    if (wieldingBow) {
      this.don(bow, true);

      this.addToInventory(scimitar);
      this.weaponProficiencies.add("scimitar");

      this.addToInventory(shield);
      this.armorProficiencies.add("shield");
    } else {
      this.don(scimitar, true);
      this.don(shield, true);

      this.addToInventory(bow);
      this.weaponProficiencies.add("shortbow");
    }

    this.addToInventory(new Arrow(g), 10);
  }
}
