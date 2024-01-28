import tokenUrl from "@img/tok/pc/dandelion.png";

import PCTemplate from "../../data/PCTemplate";

const Dandelion: PCTemplate = {
  name: "Dandelion",
  tokenUrl,
  abilities: [13, 16, 14, 8, 9, 15],
  race: { name: "Protector Aasimar" },
  alignment: ["Lawful", "Neutral"],
  background: {
    name: "Outlander",
    proficiencies: ["horn"],
    languages: ["Gith"],
  },
  levels: [
    {
      class: "Rogue",
      proficiencies: ["Persuasion", "Performance", "Insight", "Perception"],
      configs: { Expertise: ["Persuasion", "Insight"] },
    },
    { class: "Rogue", hpRoll: 7 },
    { class: "Rogue", hpRoll: 1, subclass: "Swashbuckler" },
    { class: "Paladin", hpRoll: 9 },
    {
      class: "Paladin",
      hpRoll: 1,
      configs: { "Fighting Style (Paladin)": "Fighting Style: Defense" },
    },
    { class: "Paladin", hpRoll: 9, subclass: "Crown" },
    {
      class: "Paladin",
      hpRoll: 9,
      configs: {
        "Ability Score Improvement (Paladin 4)": {
          type: "feat",
          feat: "War Caster",
        },
      },
    },
    { class: "Paladin", hpRoll: 9 },
    { class: "Paladin", hpRoll: 9 },
  ],
  items: [
    // TODO { name: "Colonel Marsoc Mcflucky" },
    { name: "belt of dwarvenkind", equip: true, attune: true },
    // TODO { name: "Francis Scott Lockpick" },
    { name: "gauntlets of flaming fury", equip: true, attune: true },
    { name: "pariah's shield", equip: true, attune: true },
    { name: "rapier", enchantments: ["+2 weapon"], equip: true },
    { name: "potion of greater healing", quantity: 2 },
    { name: "dagger", quantity: 2 },
    { name: "half plate armor", equip: true },
    { name: "shortbow" },
    { name: "dimensional shackles" },
    // { name: "calligrapher's supplies" },
    // TODO { name: "hunting trap" },
    // { name: "thieves' tools" },
    { name: "arrow", quantity: 28 },
  ],
  prepared: [
    "bless",
    "divine favor",
    "protection from evil and good",

    "aid",
    // "find steed",
    // "prayer of healing",
  ],
};

export default Dandelion;
