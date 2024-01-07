import tokenUrl from "@img/tok/pc/aura.png";

import PCTemplate from "../../data/PCTemplate";

const Aura: PCTemplate = {
  name: "Aura",
  tokenUrl,
  abilities: [8, 15, 11, 14, 9, 14],
  race: { name: "Air Genasi" },
  alignment: ["Chaotic", "Neutral"],
  background: {
    name: "Criminal",
    proficiencies: ["Medicine", "Athletics", "dice set", "horn"],
  },
  levels: [
    {
      class: "Rogue",
      proficiencies: ["Acrobatics", "Deception", "Investigation", "Stealth"],
      configs: {
        Expertise: ["Acrobatics", "thieves' tools", "Stealth", "Investigation"],
      },
    },
    { class: "Rogue" },
    { class: "Rogue", subclass: "Scout" },
    {
      class: "Rogue",
      configs: {
        "Ability Score Improvement (Rogue 4)": { type: "feat", feat: "Lucky" },
      },
    },
    { class: "Rogue" },
    { class: "Rogue" },
    { class: "Rogue" },
  ],
  feats: ["Boon of Vassetri"],
  items: [
    { name: "light crossbow", equip: true, enchantments: ["vicious"] },
    { name: "leather armor", equip: true },
    { name: "bracers of the arbalest", equip: true, attune: true },
    { name: "rapier" },
    { name: "crossbow bolt", quantity: 20 },
    { name: "crossbow bolt", enchantments: ["+1 weapon"], quantity: 15 },
    // TODO { name: "bag of 1,000 ball bearings" },
    // TODO { name: "flask of oil", quantity: 2 },
    // TODO { name: "thieves' tools" },
  ],
};
export default Aura;
