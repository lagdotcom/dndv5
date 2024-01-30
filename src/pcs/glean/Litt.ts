import tokenUrl from "@img/tok/pc/litt.png";

import PCTemplate from "../../data/PCTemplate";

const Litt: PCTemplate = {
  name: "Litt",
  tokenUrl,
  abilities: [8, 10, 14, 12, 15, 13],
  race: { name: "Fire Genasi" },
  alignment: ["Chaotic", "Good"],
  background: {
    name: "Outlander",
    proficiencies: ["pan flute"],
    languages: ["Infernal"],
  },
  levels: [{ class: "Druid", proficiencies: ["Animal Handling", "Insight"] }],
  items: [
    { name: "leather armor", equip: true },
    { name: "quarterstaff", equip: true },
    { name: "dagger" },
  ],
  prepared: [
    "gust",
    "poison spray",
    "animal friendship",
    "faerie fire",
    "speak with animals",
  ],
};
export default Litt;
