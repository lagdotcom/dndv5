import AbilityName from "./AbilityName";
import Action from "./Action";
import ActionTime from "./ActionTime";
import CombatantScore from "./CombatantScore";
import Concentration from "./Concentration";
import ConditionName from "./ConditionName";
import CreatureType from "./CreatureType";
import EffectType, { EffectConfig, EffectDurationTimer } from "./EffectType";
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

  str: CombatantScore;
  dex: CombatantScore;
  con: CombatantScore;
  int: CombatantScore;
  wis: CombatantScore;
  cha: CombatantScore;

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
  attacksSoFar: Action[];
  speed: number;
  saveProficiencies: Set<AbilityName>;
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
  getProficiencyMultiplier(thing: Item | AbilityName | SkillName): number;
  initResource(resource: Resource, amount?: number, max?: number): void;
  giveResource(resource: Resource, amount: number): void;
  hasResource(resource: Resource, amount?: number): boolean;
  refreshResource(resource: Resource): void;
  spendResource(resource: Resource, amount?: number): void;
  getResource(resource: Resource): number;
  getResourceMax(resource: Resource): number;
  removeResource(resource: Resource): void;
  endConcentration(): Promise<void>;
  concentrateOn(entry: Concentration): Promise<void>;
  finalise(): void;
  addEffect<T>(effect: EffectType<T>, config: EffectConfig<T>): void;
  getEffectConfig<T>(effect: EffectType<T>): EffectConfig<T> | undefined;
  hasEffect<T>(effect: EffectType<T>): boolean;
  removeEffect<T>(effect: EffectType<T>): void;
  tickEffects(durationTimer: EffectDurationTimer): void;
}
