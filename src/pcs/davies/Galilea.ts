import tokenUrl from "@img/tok/pc/galilea.png";

import PCTemplate from "../../data/PCTemplate";

const Galilea: PCTemplate = {
  name: "Galilea",
  tokenUrl,
  abilities: [13, 10, 15, 11, 11, 13],
  race: {
    name: "Human",
    configs: { "Extra Language": "Sylvan" },
  },
  background: {
    name: "Noble",
    proficiencies: ["playing card set"],
    languages: ["Orc"],
  },
  levels: [
    { class: "Paladin" },
    {
      class: "Paladin",
      subclass: "Devotion",
      configs: { "Fighting Style (Paladin)": "Fighting Style: Protection" },
    },
    { class: "Paladin" },
    {
      class: "Paladin",
      configs: {
        "Ability Score Improvement (Paladin 4)": {
          type: "ability",
          abilities: ["str", "str"],
        },
      },
    },
    { class: "Paladin" },
    { class: "Paladin" },
    { class: "Paladin" },
  ],
  items: [
    { name: "longsword", equip: true },
    { name: "shield", equip: true },
    { name: "splint armor", equip: true },
    { name: "ring of awe", equip: true, attune: true },
    { name: "silver shining amulet", equip: true, attune: true },
    { name: "figurine of wondrous power, silver raven" },
    { name: "wand of web", attune: true },
    { name: "light crossbow" },
    { name: "crossbow bolt", quantity: 20 },
  ],
  prepared: ["bless", "divine favor", "shield of faith", "aid", "magic weapon"],
};
export default Galilea;
