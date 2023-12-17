import tokenUrl from "@img/tok/pc/hagrond.png";

import PCTemplate from "../../data/PCTemplate";

const Hagrond: PCTemplate = {
  name: "Hagrond",
  tokenUrl,
  abilities: [15, 15, 13, 10, 8, 10],
  race: { name: "Stout Halfling" },
  background: {
    name: "Folk Hero",
    proficiencies: ["Sleight of Hand", "woodcarver's tools"],
  },
  levels: [
    { class: "Barbarian", proficiencies: ["Intimidation", "Animal Handling"] },
    { class: "Barbarian" },
    {
      class: "Barbarian",
      subclass: "Berserker",
      configs: { "Primal Knowledge": ["Perception"] },
    },
    {
      class: "Barbarian",
      configs: {
        "Ability Score Improvement (Barbarian 4)": {
          type: "ability",
          abilities: ["str", "con"],
        },
      },
    },
    { class: "Barbarian" },
    { class: "Barbarian" },
    { class: "Barbarian" },
  ],
  items: [
    { name: "spear", enchantments: ["dark sun"], equip: true, attune: true },
    {
      name: "trident",
      enchantments: ["of the deep"],
      equip: true,
      attune: true,
    },
    { name: "dagger", quantity: 4 },
    { name: "handaxe" },
    { name: "spear" },
    { name: "potion of hill giant strength" },
    { name: "longsword" },
    { name: "potion of healing" },
    // TODO { name: "thieves' tools" },
    // TODO { name: "woodcarver's tools" },
  ],
};
export default Hagrond;
