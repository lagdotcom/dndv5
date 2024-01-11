import goblinUrl from "@img/tok/goblin.png";

import DisengageAction from "../../actions/DisengageAction";
import MonsterTemplate from "../../data/MonsterTemplate";
import SimpleFeature from "../../features/SimpleFeature";
import ChoiceResolver from "../../resolvers/ChoiceResolver";
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

export interface GoblinConfig {
  weapon: "scimitar" | "shortbow";
}
export const Goblin: MonsterTemplate<GoblinConfig> = {
  name: "goblin",
  cr: 0.25,
  type: "humanoid",
  size: SizeCategory.Small,
  tokenUrl: goblinUrl,
  hpMax: 7,
  align: ["Neutral", "Evil"],
  proficiency: { Stealth: "expertise" },
  senses: { darkvision: 60 },
  languages: ["Common", "Goblin"],
  features: [NimbleEscape],
  items: [
    { name: "shield" },
    { name: "scimitar" },
    { name: "shortbow" },
    { name: "arrow", quantity: 20 },
  ],
  config: {
    initial: { weapon: "scimitar" },
    get: (g) => ({
      weapon: new ChoiceResolver(g, [
        { label: "scimitar/shield", value: "scimitar" },
        { label: "shortbow", value: "shortbow" },
      ]),
    }),
    apply({ weapon }) {
      if (weapon === "shortbow") this.don(this.getInventoryItem("shortbow"));
      else {
        this.don(this.getInventoryItem("scimitar"));
        this.don(this.getInventoryItem("shield"));
      }
    },
  },
};
