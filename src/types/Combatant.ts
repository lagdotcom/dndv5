import {
  ArmorClass,
  ChallengeRating,
  CombatantID,
  Exhaustion,
  Feet,
  Hands,
  HitPoints,
  ModifiedDiceRoll,
  Modifier,
  PCClassLevel,
  PCLevel,
  Quantity,
  SideID,
  Url,
} from "../flavours";
import AbilityName from "./AbilityName";
import ACMethod from "./ACMethod";
import Action from "./Action";
import ActionTime from "./ActionTime";
import AICoefficient from "./AICoefficient";
import AIRule from "./AIRule";
import { GEAlignment, LCAlignment } from "./Alignment";
import CombatantGroup from "./CombatantGroup";
import CombatantScore from "./CombatantScore";
import { CombatantTag } from "./CombatantTag";
import Concentration from "./Concentration";
import ConditionName from "./ConditionName";
import CreatureType from "./CreatureType";
import DamageResponse from "./DamageResponse";
import DamageType from "./DamageType";
import EffectType, { EffectConfig, EffectDurationTimer } from "./EffectType";
import Feature from "./Feature";
import HasProficiency from "./HasProficiency";
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
import ProficiencyType from "./ProficiencyType";
import Resource from "./Resource";
import SenseName from "./SenseName";
import SizeCategory from "./SizeCategory";
import SkillName from "./SkillName";
import Source from "./Source";
import Spell from "./Spell";
import SpellcastingMethod from "./SpellcastingMethod";
import ToolName from "./ToolName";

export default interface Combatant extends Source {
  id: CombatantID;
  img: Url;
  type: CreatureType;
  alignGE?: GEAlignment;
  alignLC?: LCAlignment;
  size: SizeCategory;
  sizeInUnits: Feet;
  side: SideID;
  hands: Hands;
  freeHands: Hands;
  reach: Feet;

  initiative: ModifiedDiceRoll;
  position: Point;

  diesAtZero: boolean;
  level: PCLevel;
  cr: ChallengeRating;
  hp: HitPoints;
  baseHpMax: HitPoints;
  hpMax: HitPoints;
  baseACMethod: ACMethod;
  baseAC: ArmorClass;
  pb: Modifier;

  str: CombatantScore;
  dex: CombatantScore;
  con: CombatantScore;
  int: CombatantScore;
  wis: CombatantScore;
  cha: CombatantScore;

  movement: Map<MovementType, Feet>;
  skills: Map<SkillName, ProficiencyType>;
  languages: Set<LanguageName>;
  equipment: Set<Item>;
  inventory: Map<Item, Quantity>;
  senses: Map<SenseName, Feet>;
  weaponProficiencies: Set<string>;
  weaponCategoryProficiencies: Set<WeaponCategory>;
  armorProficiencies: Set<ArmorCategory>;
  naturalWeapons: Set<WeaponItem>;
  resources: Map<string, number>;
  classLevels: Map<PCClassName, PCClassLevel>;
  concentratingOn: Set<Concentration>;
  conditions: Set<ConditionName>;
  attunements: Set<Item>;
  movedSoFar: Feet;
  attacksSoFar: Action[];
  effects: Map<EffectType<unknown>, EffectConfig<unknown>>;
  readonly speed: Feet;
  saveProficiencies: Set<AbilityName>;
  knownSpells: Set<Spell>;
  preparedSpells: Set<Spell>;
  toolProficiencies: Map<ToolName, ProficiencyType>;
  spellcastingMethods: Set<SpellcastingMethod>;
  damageResponses: Map<DamageType, DamageResponse>;
  readonly exhaustion: Exhaustion;
  temporaryHP: HitPoints;
  temporaryHPSource?: Source;
  deathSaveFailures: number;
  deathSaveSuccesses: number;
  features: Map<string, Feature>;
  groups: Set<CombatantGroup>;
  rules: Set<AIRule>;
  frightenedBy: Set<Combatant>;
  spellsSoFar: Spell[];
  grappling: Set<Combatant>;
  tags: Set<CombatantTag>;

  weapons: WeaponItem[];
  armor?: ArmorItem;
  shield?: ArmorItem;
  ammunition: AmmoItem[];

  addFeature(feature: Feature): boolean;
  getConfig<T>(key: string): T | undefined;
  addProficiency(thing: HasProficiency, value: ProficiencyType): void;
  getProficiency(thing: HasProficiency): ProficiencyType;
  initResource(resource: Resource, amount?: number, max?: number): void;
  giveResource(resource: Resource, amount: number): void;
  hasResource(resource: Resource, amount?: number): boolean;
  refreshResource(resource: Resource): void;
  spendResource(resource: Resource, amount?: number): void;
  getResource(resource: Resource): number;
  getResourceMax(resource: Resource): number;
  removeResource(resource: Resource): void;

  endConcentration(spell?: Spell): Promise<void>;
  concentrateOn(entry: Concentration): Promise<void>;
  isConcentratingOn(spell: Spell): boolean;

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
  changeExhaustion(delta: number): Promise<Exhaustion>;
  hasTime(time: ActionTime): boolean;
  useTime(time: ActionTime): void;
  regainTime(time: ActionTime): void;
  resetTime(): void;
  getCoefficient(co: AICoefficient): number;

  don(item: Item): boolean;
  doff(item: Item): boolean;
  addToInventory(item: Item, quantity?: Quantity): void;
  removeFromInventory(item: Item, quantity?: Quantity): boolean;

  getClassLevel(name: PCClassName, assume: PCClassLevel): PCClassLevel;
}
