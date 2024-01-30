import tokenUrl from "@img/tok/pc/moya.png";

import PCTemplate from "../../data/PCTemplate";

const Moya: PCTemplate = {
  name: "Moya",
  tokenUrl,
  abilities: [11, 7, 15, 15, 17, 9],
  race: { name: "Water Genasi" },
  alignment: ["Neutral", "Good"],
  background: {
    name: "Hermit",
    proficiencies: ["brewer's supplies"],
    languages: ["Deep Speech"],
  },
  levels: [
    { class: "Druid", proficiencies: ["Nature", "Animal Handling"] },
    {
      class: "Druid",
      hpRoll: 8,
      subclass: "Shepherd",
      configs: {
        "Wild Shape": [
          "ape",
          "badger",
          "black bear",
          "cat",
          "constrictor snake",
          "cow",
          "crab",
          "crocodile",
          "deer",
          "dolphin",
          "draft horse",
          "elk",
          "giant crab",
          "giant frog",
          "giant lizard",
          "giant poisonous snake",
          "giant sea horse",
          "giant wolf spider",
          "goat",
          "lizard",
          "mastiff",
          "mule",
          "octopus",
          "ox",
          "quipper",
          "reef shark",
          "riding horse",
          "sea horse",
          "spider",
          "warhorse",
          "wolf",
        ],
      },
    },
    { class: "Druid", hpRoll: 8 },
    {
      class: "Druid",
      hpRoll: 5,
      configs: {
        "Ability Score Improvement (Druid 4)": {
          type: "feat",
          feat: "Ritual Caster",
        },
        "Ritual Caster": {
          list: "Wizard",
          spells: ["comprehend languages", "identify", "unseen servant"],
        },
      },
    },
    { class: "Druid", hpRoll: 2 },
    { class: "Druid", hpRoll: 8 },
  ],
  items: [
    // TODO { name: "horseshoes of speed" },
    // TODO { name: "tempest staff", equip: true, attune: true },
    { name: "breastplate", equip: true },
    // { name: "cloak of billowing", equip: true },
    // TODO { name: "lamannian oak focus", equip: true, attune: true },
    { name: "shield", equip: true },
    { name: "sickle" },
    { name: "potion of healing", quantity: 3 },
    // { name: "brewer's supplies" },
    // { name: "herbalism kit" },
  ],
  prepared: [
    "mending",
    "primal savagery",
    "thorn whip",

    "absorb elements",
    "cure wounds",
    "healing word",
    "thunderwave",

    "darkvision",
    "lesser restoration",
    "summon beast",

    "conjure animals",
    "dispel magic",
    "tidal wave",
  ],
};
export default Moya;
