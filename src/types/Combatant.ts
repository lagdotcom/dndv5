import Ability from "./Ability";
import ActionTime from "./ActionTime";
import Concentration from "./Concentration";
import { ConditionName } from "./ConditionName";
import CreatureType from "./CreatureType";
import Feature from "./Feature";
import Item, { AmmoItem, ArmorItem, WeaponItem } from "./Item";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import PCClassName from "./PCClassName";
import Resource from "./Resource";
import SenseName from "./SenseName";
import SizeCategory from "./SizeCategory";
import SkillName from "./SkillName";

export default interface Combatant {
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
  resources: Map<Resource, number>;
  classLevels: Map<PCClassName, number>;
  concentratingOn: Set<Concentration>;
  time: Set<ActionTime>;
  conditions: Set<ConditionName>;
  attunements: Set<Item>;

  weapons: WeaponItem[];
  armor?: ArmorItem;
  shield?: ArmorItem;
  ammunition: AmmoItem[];

  addFeature(feature: Feature): boolean;
  getConfig<T>(key: string): T | undefined;
  getProficiencyMultiplier(thing: Item | Ability | SkillName): number;
  addResource(resource: Resource, amount?: number): void;
  hasResource(resource: Resource, amount?: number): boolean;
  spendResource(resource: Resource, amount?: number): void;
  concentrateOn(entry: Concentration): void;
  finalise(): void;
}
