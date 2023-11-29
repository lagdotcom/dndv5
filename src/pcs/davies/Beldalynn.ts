import tokenUrl from "@img/tok/pc/beldalynn.png";

import PCTemplate from "../../data/PCTemplate";

const Beldalynn: PCTemplate = {
  name: "Beldalynn",
  tokenUrl,
  abilities: [11, 13, 13, 15, 13, 8],
  race: {
    name: "Bronze Dragonborn",
    abilities: ["dex", "con", "str"],
    languages: ["Draconic"],
  },
  background: {
    name: "Sage",
    proficiencies: ["Perception"],
    languages: ["Elvish", "Infernal"],
  },
  levels: [
    { class: "Wizard", proficiencies: ["Arcana", "Investigation"] },
    { class: "Wizard", subclass: "Evocation" },
    { class: "Wizard" },
    {
      class: "Wizard",
      configs: {
        "Ability Score Improvement (Wizard 4)": {
          type: "ability",
          abilities: ["int", "wis"],
        },
      },
    },
    { class: "Wizard" },
    { class: "Wizard" },
    { class: "Wizard" },
  ],
  items: [
    { name: "cloak of protection", equip: true, attune: true },
    { name: "quarterstaff", enchantments: ["chaotic burst"], equip: true },
    { name: "dragon-touched focus (slumbering)", equip: true, attune: true },
    { name: "dagger" },
  ],
  prepared: [
    "acid splash",
    "fire bolt",
    "mind sliver",
    "ray of frost",

    "ice knife",
    "magic missile",
    "shield",

    "enlarge/reduce",
    "hold person",
    "Melf's minute meteors",

    "fireball",
    "intellect fortress",
    // "Leomund's tiny hut",

    "wall of fire",
  ],
};
export default Beldalynn;
