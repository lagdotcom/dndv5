import Ability from "./Ability";
import ActionTime from "./ActionTime";
import CombatantEffect from "./CombatantEffect";
import Concentration from "./Concentration";
import { ConditionName } from "./ConditionName";
import CreatureType from "./CreatureType";
import Feature from "./Feature";
import Item, {
  AmmoItem,
  ArmorCategory,
  ArmorItem,
  WeaponCategory,
  WeaponItem,
} from "./Item";
import LanguageName from "./LanguageName";
import MovementType from "./MovementType";
import PCClassName from "./PCClassName";
import Resource from "./Resource";
import SenseName from "./SenseName";
import SizeCategory from "./SizeCategory";
import SkillName from "./SkillName";
import Source from "./Source";
import Spell from "./Spell";
import SpellcastingMethod from "./SpellcastingMethod";
import ToolName from "./ToolName";

export default interface Combatant extends Source {
  id: number;
  img: string;
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
  weaponProficiencies: Set<string>;
  weaponCategoryProficiencies: Set<WeaponCategory>;
  armorProficiencies: Set<ArmorCategory>;
  naturalWeapons: Set<WeaponItem>;
  resources: Map<string, number>;
  classLevels: Map<PCClassName, number>;
  concentratingOn: Set<Concentration>;
  time: Set<ActionTime>;
  conditions: Set<ConditionName>;
  attunements: Set<Item>;
  movedSoFar: number;
  speed: number;
  saveProficiencies: Set<Ability>;
  knownSpells: Set<Spell>;
  preparedSpells: Set<Spell>;
  toolProficiencies: Map<ToolName, number>;
  spellcastingMethods: Set<SpellcastingMethod>;

  weapons: WeaponItem[];
  armor?: ArmorItem;
  shield?: ArmorItem;
  ammunition: AmmoItem[];

  addFeature(feature: Feature): boolean;
  getConfig<T>(key: string): T | undefined;
  getProficiencyMultiplier(thing: Item | Ability | SkillName): number;
  initResource(resource: Resource, amount?: number, max?: number): void;
  giveResource(resource: Resource, amount: number): void;
  hasResource(resource: Resource, amount?: number): boolean;
  refreshResource(resource: Resource): void;
  spendResource(resource: Resource, amount?: number): void;
  getResource(resource: Resource): number;
  getResourceMax(resource: Resource): number;
  removeResource(resource: Resource): void;
  concentrateOn(entry: Concentration): void;
  finalise(): void;
  addEffect(effect: CombatantEffect, duration: number): void;
  hasEffect(effect: CombatantEffect): boolean;
  removeEffect(effect: CombatantEffect): void;
  tickEffects(durationTimer: CombatantEffect["durationTimer"]): void;
}
