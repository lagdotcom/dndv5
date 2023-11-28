import { Darkvision60, nonCombatFeature } from "../features/common";
import ConfiguredFeature from "../features/ConfiguredFeature";
import SimpleFeature from "../features/SimpleFeature";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import { poisonResistance } from "./common";

const DwarvenResilience = poisonResistance(
  "Dwarven Resilience",
  `You have advantage on saving throws against poison, and you have resistance against poison damage.`,
);

const DwarvenCombatTraining = new SimpleFeature(
  "Dwarven Combat Training",
  `You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.`,
  (g, me) => {
    for (const weapon of ["battleaxe", "handaxe", "light hammer", "warhammer"])
      me.weaponProficiencies.add(weapon);
  },
);

type DwarfTool = "smith's tools" | "brewer's supplies" | "mason's tools";
export const ToolProficiency = new ConfiguredFeature<DwarfTool>(
  "Tool Proficiency",
  `You gain proficiency with the artisan's tools of your choice: Smith's tools, brewer's supplies, or mason's tools.`,
  (g, me, tool) => {
    me.addProficiency(tool, "proficient");
  },
);

const Stonecunning = nonCombatFeature(
  "Stonecunning",
  `Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.`,
);

const Dwarf: PCRace = {
  name: "Dwarf",
  abilities: new Map([["con", 2]]),
  size: "medium",
  movement: new Map([["speed", 25]]),
  features: new Set([
    Darkvision60,
    DwarvenResilience,
    DwarvenCombatTraining,
    ToolProficiency,
    Stonecunning,
  ]),
  languages: laSet("Common", "Dwarvish"),
};

const DwarvenToughness = new SimpleFeature(
  "Dwarven Toughness",
  `Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.`,
  (g, me) => {
    me.baseHpMax += me.level;
  },
);

export const HillDwarf: PCRace = {
  parent: Dwarf,
  name: "Hill Dwarf",
  abilities: new Map([["wis", 1]]),
  size: "medium",
  features: new Set([DwarvenToughness]),
};

const DwarvenArmorTraining = new SimpleFeature(
  "Dwarven Armor Training",
  `You have proficiency with light and medium armor.`,
  (g, me) => {
    me.armorProficiencies.add("light");
    me.armorProficiencies.add("medium");
  },
);

export const MountainDwarf: PCRace = {
  parent: Dwarf,
  name: "Mountain Dwarf",
  abilities: new Map([["str", 2]]),
  size: "medium",
  features: new Set([DwarvenArmorTraining]),
};
