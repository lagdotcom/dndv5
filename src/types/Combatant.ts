import Ability from "./Ability";
import Concentration from "./Concentration";
import CreatureType from "./CreatureType";
import Item, { AmmoItem, ArmorItem, WeaponItem } from "./Item";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import PCClassName from "./PCClassName";
import Resource from "./Resource";
import SenseName from "./SenseName";
import SizeCategory from "./SizeCategory";
import SkillName from "./SkillName";

interface Combatant {
  id: number;
  img: string;
  name: string;
  type: CreatureType;
  size: SizeCategory;
  sizeInUnits: number;
  side: number;
  hands: number;
  reach: number;

  diesAtZero: boolean;
  level: number;
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
  classLevels: Map<PCClassName, number>;
  concentratingOn: Set<Concentration>;

  weapons: WeaponItem[];
  armor?: ArmorItem;
  shield?: ArmorItem;
  ammunition: AmmoItem[];

  getConfig<T>(key: string): T | undefined;
  getProficiencyMultiplier(thing: Item | Ability | SkillName): number;
  addResource(resource: Resource, amount?: number): void;
  spendResource(resource: Resource, amount?: number): void;
  concentrateOn(entry: Concentration): void;
}
export default Combatant;
