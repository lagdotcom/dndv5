import tokenUrl from "@img/tok/pc/tethilssethanar.png";

import PCTemplate from "../../data/PCTemplate";

const Tethilssethanar: PCTemplate = {
  name: "Tethilssethanar",
  tokenUrl,
  abilities: [9, 14, 13, 8, 15, 13],
  race: { name: "Triton" },
  background: {
    name: "Knight",
    proficiencies: ["playing card set"],
    languages: ["Deep Speech"],
  },
  levels: [{ class: "Monk", proficiencies: ["Athletics", "Insight"] }],
  items: [
    { name: "sickle", equip: true },
    { name: "dart", quantity: 10, equip: true },
    { name: "sling" },
    { name: "sling bullet", quantity: 40 },
  ],
};
export default Tethilssethanar;
