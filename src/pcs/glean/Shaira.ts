import tokenUrl from "@img/tok/pc/shaira.png";

import PCTemplate from "../../data/PCTemplate";

const Shaira: PCTemplate = {
  name: "Shaira",
  tokenUrl,
  abilities: [13, 10, 8, 14, 15, 12],
  race: {
    name: "Half-Elf",
    configs: {
      "Ability Score Bonus": ["int", "wis"],
      "Skill Versatility": ["Persuasion", "History"],
      "Extra Language": ["Dwarvish"],
    },
  },
  background: { name: "Criminal", proficiencies: ["playing card set"] },
  levels: [
    {
      class: "Bard",
      proficiencies: [
        "birdpipes",
        "glaur",
        "tocken",
        "Investigation",
        "Medicine",
        "Survival",
      ],
    },
  ],
  items: [
    { name: "leather armor", equip: true },
    { name: "rapier", equip: true },
    { name: "dagger" },
  ],
  prepared: [
    // "dancing lights",
    "thunderclap",

    // "comprehend languages",
    "healing word",
    "hideous laughter",
    "sleep",
  ],
};
export default Shaira;
