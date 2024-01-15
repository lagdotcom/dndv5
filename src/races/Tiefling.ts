import {
  BonusSpellEntry,
  bonusSpellsFeature,
  Darkvision60,
} from "../features/common";
import { PCLevel } from "../flavours";
import { LongRestResource } from "../resources";
import Thaumaturgy from "../spells/cantrip/Thaumaturgy";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import HellishRebuke from "../spells/level1/HellishRebuke";
import Darkness from "../spells/level2/Darkness";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import SizeCategory from "../types/SizeCategory";
import { resistanceFeature } from "./common";

const HellishResistance = resistanceFeature(
  "Hellish Resistance",
  `You have resistance to fire damage.`,
  ["fire"],
);

const Tiefling: PCRace = {
  name: "Tiefling",
  size: SizeCategory.Medium,
  abilities: new Map([["cha", 2]]),
  movement: new Map([["speed", 30]]),
  features: new Set([Darkvision60, HellishResistance]),
  languages: laSet("Common", "Infernal"),
};

const HellishRebukeResource = new LongRestResource(
  "Infernal Legacy: Hellish Rebuke",
  1,
);
const DarknessResource = new LongRestResource("Infernal Legacy: Darkness", 1);

const InfernalLegacySpells: BonusSpellEntry<PCLevel>[] = [
  { level: 1, spell: Thaumaturgy },
  { level: 3, spell: HellishRebuke, resource: HellishRebukeResource },
  { level: 5, spell: Darkness, resource: DarknessResource },
];

const InfernalLegacyMethod = new InnateSpellcasting(
  "Infernal Legacy",
  "cha",
  (spell) => {
    if (spell === HellishRebuke) return HellishRebukeResource;
    if (spell === Darkness) return DarknessResource;
  },
);

const InfernalLegacy = bonusSpellsFeature(
  "Infernal Legacy",
  `You know the thaumaturgy cantrip. Once you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell with this trait; you regain the ability to cast it when you finish a long rest. Once you reach 5th level, you can also cast the darkness spell once per day with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells.`,
  "level",
  InfernalLegacyMethod,
  InfernalLegacySpells,
);

export const Asmodeus: PCRace = {
  parent: Tiefling,
  name: "Tiefling (Asmodeus)",
  size: SizeCategory.Medium,
  abilities: new Map([["int", 1]]),
  features: new Set([InfernalLegacy]),
};
