import AbilityName from "./AbilityName";
import ACMethod from "./ACMethod";
import Action from "./Action";
import ActionTime from "./ActionTime";
import AICoefficient from "./AICoefficient";
import AIRule from "./AIRule";
import CombatantGroup from "./CombatantGroup";
import CombatantScore from "./CombatantScore";
import Concentration from "./Concentration";
import ConditionName from "./ConditionName";
import CreatureType from "./CreatureType";
import DamageResponse from "./DamageResponse";
import DamageType from "./DamageType";
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
import Point from "./Point";
import Resource from "./Resource";
import SenseName from "./SenseName";
import SizeCategory from "./SizeCategory";
import SkillName from "./SkillName";
import Source from "./Source";
import Spell from "./Spell";
import SpellcastingMethod from "./SpellcastingMethod";
import ToolName from "./ToolName";

export type CombatantID = number;

export default interface Combatant extends Source {
  id: CombatantID;
  img: string;
  type: CreatureType;
  size: SizeCategory;
  sizeInUnits: number;
  side: number;
  hands: number;
  reach: number;

  initiative: number;
  position: Point;

  diesAtZero: boolean;
  level: number;
  hp: number;
  baseHpMax: number;
  hpMax: number;
  baseACMethod: ACMethod;
  baseAC: number;
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
  conditions: Set<ConditionName>;
  attunements: Set<Item>;
  movedSoFar: number;
  attacksSoFar: Action[];
  effects: Map<EffectType<unknown>, EffectConfig<unknown>>;
  readonly speed: number;
  saveProficiencies: Set<AbilityName>;
  knownSpells: Set<Spell>;
  preparedSpells: Set<Spell>;
  toolProficiencies: Map<ToolName, number>;
  spellcastingMethods: Set<SpellcastingMethod>;
  damageResponses: Map<DamageType, DamageResponse>;
  readonly exhaustion: number;
  temporaryHP: number;
  temporaryHPSource?: Source;
  deathSaveFailures: number;
  deathSaveSuccesses: number;
  features: Map<string, Feature>;
  groups: Set<CombatantGroup>;
  rules: Set<AIRule>;

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
  addEffect<T>(
    effect: EffectType<T>,
    config: EffectConfig<T>,
    attacker?: Combatant,
  ): Promise<boolean>;
  getEffectConfig<T>(effect: EffectType<T>): EffectConfig<T> | undefined;
  hasEffect<T>(effect: EffectType<T>): boolean;
  removeEffect<T>(effect: EffectType<T>): Promise<boolean>;
  tickEffects(durationTimer: EffectDurationTimer): void;
  changeExhaustion(delta: number): Promise<number>;
  hasTime(time: ActionTime): boolean;
  useTime(time: ActionTime): void;
  regainTime(time: ActionTime): void;
  resetTime(): void;
  getCoefficient(co: AICoefficient): number;
}
