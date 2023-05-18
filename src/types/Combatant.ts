import CreatureType from "./CreatureType";
import Item, { ArmorItem, WeaponItem } from "./Item";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import SenseName from "./SenseName";
import SizeCategory from "./SizeCategory";
import SkillName from "./SkillName";

interface Combatant {
  img: string;
  name: string;
  type: CreatureType;
  size: SizeCategory;
  sizeInUnits: number;
  side: number;
  hands: number;
  reach: number;

  diesAtZero: boolean;
  hp: number;
  hpMax: number;
  ac: number;
  pb: number;

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

  movement: Map<MovementType, number>;
  skills: Map<SkillName, number>;
  languages: Set<LanguageName>;
  equipment: Set<Item>;
  inventory: Set<Item>;
  senses: Map<SenseName, number>;
  naturalWeapons: Set<WeaponItem>;

  weapons: WeaponItem[];
  armor?: ArmorItem;
  shield?: ArmorItem;

  getProficiencyMultiplier(thing: Item | SkillName): number;
}
export default Combatant;
