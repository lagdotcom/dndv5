import { BronzeDragonborn } from "../races/Dragonborn_FTD";
import { HillDwarf, MountainDwarf } from "../races/Dwarf";
import { HighElf } from "../races/Elf";
import { AirGenasi } from "../races/Genasi_EEPC";
import { RockGnome } from "../races/Gnome";
import { HalfElf } from "../races/HalfElf";
import { LightfootHalfling, StoutHalfling } from "../races/Halfling";
import { HalfOrc } from "../races/HalfOrc";
import Human from "../races/Human";
import { Asmodeus } from "../races/Tiefling";
import Triton from "../races/Triton";

const allPCRaces = {
  "Bronze Dragonborn": BronzeDragonborn,

  "Hill Dwarf": HillDwarf,
  "Mountain Dwarf": MountainDwarf,

  "High Elf": HighElf,

  "Air Genasi": AirGenasi,

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
