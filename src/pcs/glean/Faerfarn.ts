import tokenUrl from "@img/tok/pc/faerfarn.png";

import PCTemplate from "../../data/PCTemplate";

const Faerfarn: PCTemplate = {
  name: "Faefarn Alruuth",
  tokenUrl,
  abilities: [15, 14, 12, 10, 13, 8],
  race: { name: "Gold Dragonborn" },
  alignment: ["Neutral", "Neutral"],
  background: { name: "Soldier", proficiencies: ["dragonchess set"] },
  levels: [
    {
      class: "Fighter",
      proficiencies: ["Acrobatics", "Survival"],
      configs: {
        "Fighting Style (Fighter)": "Fighting Style: Great Weapon Fighting",
      },
    },
  ],
  items: [
    { name: "longsword", equip: true },
    { name: "leather armor", equip: true },
    { name: "light crossbow" },
    { name: "longbow" },
    { name: "arrow", quantity: 20 },
    { name: "crossbow bolt", quantity: 20 },
  ],
};
export default Faerfarn;
