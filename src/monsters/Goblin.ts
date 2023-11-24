import tokenUrl from "@img/tok/goblin.png";

import DisengageAction from "../actions/DisengageAction";
import Engine from "../Engine";
import SimpleFeature from "../features/SimpleFeature";
import { Arrow } from "../items/ammunition";
import { LeatherArmor, Shield } from "../items/armor";
import { Scimitar, Shortbow } from "../items/weapons";
import Monster from "../Monster";
import { getExecutionMode } from "../utils/env";

const NimbleEscape = new SimpleFeature(
  "Nimble Escape",
  `The goblin can take the Disengage or Hide action as a bonus action on each of its turns.`,
  (g, me) => {
    if (getExecutionMode() !== "test")
      console.warn(`[Feature Not Complete] Nimble Escape (on ${me.name})`);

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

export default class Goblin extends Monster {
  constructor(g: Engine, wieldingBow = false) {
    super(g, "goblin", 0.25, "humanoid", "small", tokenUrl, 7);
    this.movement.set("speed", 30);
    this.skills.set("Stealth", 2);
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

      this.inventory.add(scimitar);
      this.weaponProficiencies.add("scimitar");

      this.inventory.add(shield);
      this.armorProficiencies.add("shield");
    } else {
      this.don(scimitar, true);
      this.don(shield, true);

      this.inventory.add(bow);
      this.weaponProficiencies.add("shortbow");
    }

    this.inventory.add(new Arrow(g, 10));
  }
}