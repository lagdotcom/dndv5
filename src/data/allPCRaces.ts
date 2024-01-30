import {
  FallenAasimar,
  ProtectorAasimar,
  ScourgeAasimar,
} from "../races/Aasimar_VGM";
import { BronzeDragonborn, GoldDragonborn } from "../races/Dragonborn_FTD";
import { HillDwarf, MountainDwarf } from "../races/Dwarf";
import { HighElf } from "../races/Elf";
import { AirGenasi, FireGenasi, WaterGenasi } from "../races/Genasi_EEPC";
import { RockGnome } from "../races/Gnome";
import { HalfElf } from "../races/HalfElf";
import { LightfootHalfling, StoutHalfling } from "../races/Halfling";
import { HalfOrc } from "../races/HalfOrc";
import Human from "../races/Human";
import { Asmodeus } from "../races/Tiefling";
import Triton from "../races/Triton";

const allPCRaces = {
  "Fallen Aasimar": FallenAasimar,
  "Protector Aasimar": ProtectorAasimar,
  "Scourge Aasimar": ScourgeAasimar,

  "Bronze Dragonborn": BronzeDragonborn,
  "Gold Dragonborn": GoldDragonborn,

  "Hill Dwarf": HillDwarf,
  "Mountain Dwarf": MountainDwarf,

  "High Elf": HighElf,

  "Air Genasi": AirGenasi,
  "Fire Genasi": FireGenasi,
  "Water Genasi": WaterGenasi,

  "Rock Gnome": RockGnome,

  "Half-Elf": HalfElf,

  "Lightfoot Halfling": LightfootHalfling,
  "Stout Halfling": StoutHalfling,

  "Half-Orc": HalfOrc,

  Human,

  "Tiefling (Asmodeus)": Asmodeus,

  Triton,
} as const;
export default allPCRaces;

export type PCRaceName = keyof typeof allPCRaces;
