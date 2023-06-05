import {
  bonusSpellsFeature,
  darkvisionFeature,
  nonCombatFeature,
  notImplementedFeature,
} from "../features/common";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import FogCloud from "../spells/level1/FogCloud";
import GustOfWind from "../spells/level2/GustOfWind";
import WallOfWater from "../spells/level3/WallOfWater";
import PCRace from "../types/PCRace";
import { resistanceFeature } from "./common";

// TODO
const Amphibious = notImplementedFeature(
  "Amphibious",
  `You can breathe air and water.`
);

const FogCloudResource = new LongRestResource(
  "Control Air and Water: Fog Cloud",
  1
);
const GustOfWindResource = new LongRestResource(
  "Control Air and Water: Gust of Wind",
  1
);
const WallOfWaterResource = new LongRestResource(
  "Control Air and Water: Wall of Water",
  1
);

const ControlAirAndWaterSpells = [
  { level: 1, spell: FogCloud, resource: FogCloudResource },
  { level: 3, spell: GustOfWind, resource: GustOfWindResource },
  { level: 5, spell: WallOfWater, resource: WallOfWaterResource },
];

const ControlAirAndWaterMethod = new InnateSpellcasting(
  "Control Air and Water",
  "cha",
  (spell) => {
    if (spell === FogCloud) return FogCloudResource;
    if (spell === GustOfWind) return GustOfWindResource;
    if (spell === WallOfWater) return WallOfWaterResource;
  }
);

const ControlAirAndWater = bonusSpellsFeature(
  "Control Air and Water",
  `You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can’t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.`,
  "level",
  ControlAirAndWaterMethod,
  ControlAirAndWaterSpells
);

const Darkvision = darkvisionFeature();

const EmissaryOfTheSea = nonCombatFeature(
  "Emissary of the Sea",
  `Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.`
);

const GuardiansOfTheDepths = resistanceFeature(
  "Guardians of the Depths",
  `Adapted to even the most extreme ocean depths, you have resistance to cold damage.`,
  ["cold"]
);

const Triton: PCRace = {
  name: "Triton",
  size: "medium",
  abilities: new Map([
    ["str", 1],
    ["con", 1],
    ["cha", 1],
  ]),
  movement: new Map([
    ["speed", 30],
    ["swim", 30],
  ]),
  languages: new Set(["Common", "Primordial"]),
  features: new Set([
    Amphibious,
    ControlAirAndWater,
    Darkvision,
    EmissaryOfTheSea,
    GuardiansOfTheDepths,
  ]),
};
export default Triton;
