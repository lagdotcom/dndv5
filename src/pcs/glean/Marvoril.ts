import tokenUrl from "@img/tok/pc/marvoril.png";

import PCTemplate from "../../data/PCTemplate";

const Marvoril: PCTemplate = {
  name: "Marvoril",
  tokenUrl,
  abilities: [15, 8, 13, 12, 10, 14],
  race: {
    name: "Half-Elf",
    configs: {
      "Ability Score Bonus": ["str", "con"],
      "Skill Versatility": ["Athletics", "Persuasion"],
      "Extra Language": "Dwarvish",
    },
  },
  alignment: ["Lawful", "Neutral"],
  background: {
    name: "Acolyte",
    proficiencies: ["Survival", "Investigation"],
    languages: ["Primordial", "Infernal"],
  },
  levels: [{ class: "Paladin", proficiencies: ["Insight", "Religion"] }],
  items: [
    { name: "chain mail", equip: true },
    { name: "morningstar", equip: true },
    { name: "shield", equip: true },
  ],
};
export default Marvoril;
