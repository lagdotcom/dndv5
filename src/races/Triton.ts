import {
  Amphibious,
  BonusSpellEntry,
  bonusSpellResourceFinder,
  bonusSpellsFeature,
  Darkvision60,
  nonCombatFeature,
} from "../features/common";
import { PCLevel } from "../flavours";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import SizeCategory from "../types/SizeCategory";
import { resistanceFeature } from "./common";

const FogCloudResource = new LongRestResource(
  "Control Air and Water: Fog Cloud",
  1,
);
const GustOfWindResource = new LongRestResource(
  "Control Air and Water: Gust of Wind",
  1,
);
const WallOfWaterResource = new LongRestResource(
  "Control Air and Water: Wall of Water",
  1,
);

const ControlAirAndWaterSpells: BonusSpellEntry<PCLevel>[] = [
  { level: 1, spell: "fog cloud", resource: FogCloudResource },
  { level: 3, spell: "gust of wind", resource: GustOfWindResource },
  { level: 5, spell: "wall of water", resource: WallOfWaterResource },
];

const ControlAirAndWaterMethod = new InnateSpellcasting(
  "Control Air and Water",
  "cha",
  bonusSpellResourceFinder(ControlAirAndWaterSpells),
);

const ControlAirAndWater = bonusSpellsFeature(
  "Control Air and Water",
  `You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can’t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.`,
  "level",
  ControlAirAndWaterMethod,
  ControlAirAndWaterSpells,
);

const EmissaryOfTheSea = nonCombatFeature(
  "Emissary of the Sea",
  `Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.`,
);

const GuardiansOfTheDepths = resistanceFeature(
  "Guardians of the Depths",
  `Adapted to even the most extreme ocean depths, you have resistance to cold damage.`,
  ["cold"],
);

const Triton: PCRace = {
  name: "Triton",
  size: SizeCategory.Medium,
  abilities: new Map([
    ["str", 1],
    ["con", 1],
    ["cha", 1],
  ]),
  movement: new Map([
    ["speed", 30],
    ["swim", 30],
  ]),
  languages: laSet("Common", "Primordial"),
  features: new Set([
    Amphibious,
    ControlAirAndWater,
    Darkvision60,
    EmissaryOfTheSea,
    GuardiansOfTheDepths,
  ]),
};
export default Triton;
