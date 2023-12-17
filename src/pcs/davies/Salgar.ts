import tokenUrl from "@img/tok/pc/salgar.png";

import PCTemplate from "../../data/PCTemplate";

const Salgar: PCTemplate = {
  name: "Salgar",
  tokenUrl,
  abilities: [10, 8, 14, 14, 15, 10],
  race: {
    name: "Mountain Dwarf",
    configs: { "Tool Proficiency": "mason's tools" },
  },
  background: { name: "Sage", languages: ["Elvish", "Giant"] },
  levels: [
    { class: "Druid", proficiencies: ["Insight", "Survival"] },
    {
      class: "Druid",
      subclass: "Land",
      configs: {
        "Wild Shape": ["bat", "giant badger"],
        "Circle Spells": "mountain",
        "Bonus Cantrip": "magic stone",
      },
    },
    { class: "Druid" },
    {
      class: "Druid",
      configs: {
        "Ability Score Improvement (Druid 4)": {
          type: "ability",
          abilities: ["cha", "wis"],
        },
      },
    },
    { class: "Druid" },
    { class: "Druid" },
    { class: "Druid" },
  ],
  items: [
    { name: "arrow-catching shield", equip: true, attune: true },
    { name: "boots of the winterlands", equip: true, attune: true },
    { name: "cloak of elvenkind", equip: true, attune: true },
    { name: "spear", equip: true },
    { name: "hide armor", equip: true },
    { name: "handaxe" },
    { name: "shortsword", enchantments: ["silvered"] },
    // TODO { name: "Ioun stone of reserve", equip: true, attune: true },
    // TODO { name: "potion of speed" },
    // TODO { name: "pale mushroom poison", quantity: 4 },
    // TODO { name: "potion of necrotic resistance" },
  ],
  prepared: [
    // "druidcraft",
    // "mending",
    // "mold earth",

    // "detect magic",
    "earth tremor",
    "healing word",
    // "speak with animals",

    "lesser restoration",
    // "locate object",
    "moonbeam",

    "erupting earth",

    "charm monster",
    "guardian of nature",
  ],
};
export default Salgar;
