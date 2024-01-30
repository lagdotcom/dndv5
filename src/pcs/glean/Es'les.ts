import tokenUrl from "@img/tok/pc/esles.png";

import PCTemplate from "../../data/PCTemplate";

const Esles: PCTemplate = {
  name: "Es'les",
  tokenUrl,
  abilities: [8, 13, 14, 10, 12, 15],
  race: { name: "Tiefling (Asmodeus)" },
  alignment: ["Lawful", "Evil"],
  background: { name: "Sage", languages: ["Abyssal", "Celestial"] },
  levels: [
    {
      class: "Warlock",
      subclass: "Fiend",
      proficiencies: ["Deception", "Nature"],
    },
  ],
  items: [
    { name: "quarterstaff", equip: true },
    { name: "leather armor", equip: true },
    { name: "crossbow bolt", quantity: 20 },
    { name: "light crossbow" },
    { name: "dagger", quantity: 2 },
  ],
  prepared: ["minor illusion", "charm person", "command"],
};
export default Esles;
