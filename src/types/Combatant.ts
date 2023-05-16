import CreatureType from "./CreatureType";
import SizeCategory from "./SizeCategory";

interface Combatant {
  img: string;
  name: string;
  type: CreatureType;
  size: SizeCategory;
  sizeInUnits: number;
  side: number;

  diesAtZero: boolean;
  hp: number;
  ac: number;

  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  strScore: number;
  dexScore: number;
  conScore: number;
  intScore: number;
  wisScore: number;
  chaScore: number;
}
export default Combatant;
