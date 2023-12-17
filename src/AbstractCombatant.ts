import AbilityScore from "./AbilityScore";
import BonusCollector from "./collectors/BonusCollector";
import ConditionCollector from "./collectors/ConditionCollector";
import InterruptionCollector from "./collectors/InterruptionCollector";
import MultiplierCollector from "./collectors/MultiplierCollector";
import SuccessResponseCollector from "./collectors/SuccessResponseCollector";
import Engine from "./Engine";
import BeforeEffectEvent from "./events/BeforeEffectEvent";
import CombatantFinalisingEvent from "./events/CombatantFinalising";
import EffectAddedEvent from "./events/EffectAddedEvent";
import EffectRemovedEvent from "./events/EffectRemovedEvent";
import ExhaustionEvent from "./events/ExhaustionEvent";
import GetConditionsEvent from "./events/GetConditionsEvent";
import GetMaxHPEvent from "./events/GetMaxHPEvent";
import GetSpeedEvent from "./events/GetSpeedEvent";
import ConfiguredFeature from "./features/ConfiguredFeature";
import { MapSquareSize } from "./MapSquare";
import { spellImplementationWarning } from "./spells/common";
import AbilityName from "./types/AbilityName";
import ACMethod from "./types/ACMethod";
import Action from "./types/Action";
import ActionTime from "./types/ActionTime";
import AICoefficient from "./types/AICoefficient";
import AIRule from "./types/AIRule";
import Combatant from "./types/Combatant";
import CombatantGroup from "./types/CombatantGroup";
import CombatantScore from "./types/CombatantScore";
import Concentration from "./types/Concentration";
import ConditionName from "./types/ConditionName";
import CreatureType from "./types/CreatureType";
import DamageResponse from "./types/DamageResponse";
import DamageType from "./types/DamageType";
import EffectType, {
  EffectConfig,
  EffectDurationTimer,
} from "./types/EffectType";
import Feature from "./types/Feature";
import HasProficiency from "./types/HasProficiency";
import Item, {
  AmmoItem,
  ArmorCategory,
  WeaponCategory,
  WeaponItem,
} from "./types/Item";
import LanguageName from "./types/LanguageName";
import MovementType from "./types/MovementType";
import PCClassName from "./types/PCClassName";
import Point from "./types/Point";
import ProficiencyType from "./types/ProficiencyType";
import Resource from "./types/Resource";
import SenseName from "./types/SenseName";
import SizeCategory from "./types/SizeCategory";
import SkillName from "./types/SkillName";
import Source from "./types/Source";
import Spell from "./types/Spell";
import SpellcastingMethod from "./types/SpellcastingMethod";
import ToolName from "./types/ToolName";
import WeaponType from "./types/WeaponType";
import {
  getNaturalArmourMethod,
  getProficiencyMax,
  getProficiencyType,
} from "./utils/dnd";
import { isShield, isSuitOfArmor } from "./utils/items";
import { MapInitialiser } from "./utils/map";
import { clamp } from "./utils/numbers";
import { SetInitialiser } from "./utils/set";
import { isDefined } from "./utils/types";
import { convertSizeToUnit } from "./utils/units";

const defaultHandsAmount: Record<CreatureType, number> = {
  aberration: 0,
  beast: 0,
  celestial: 2,
  construct: 0,
  dragon: 0,
  elemental: 0,
  fey: 2,
  fiend: 2,
  giant: 2,
  humanoid: 2,
  monstrosity: 0,
  ooze: 0,
  plant: 0,
  undead: 2,
};

export default abstract class AbstractCombatant implements Combatant {
  id: number;
  img: string;
  type: CreatureType;
  size: SizeCategory;
  side: number;
  hands: number;
  reach: number;
  level: number;
  cr: number;

  position: Point;
  initiative: number;

  diesAtZero: boolean;
  hp: number;
  baseHpMax: number;
  pb: number;
  naturalAC: number;

  str: CombatantScore;
  dex: CombatantScore;
  con: CombatantScore;
  int: CombatantScore;
  wis: CombatantScore;
  cha: CombatantScore;

  movement: Map<MovementType, number>;
  skills: Map<SkillName, ProficiencyType>;
  languages: Set<LanguageName>;
  equipment: Set<Item>;
  inventory: Set<Item>;
  senses: Map<SenseName, number>;
  weaponProficiencies: Set<WeaponType>;
  weaponCategoryProficiencies: Set<WeaponCategory>;
  armorProficiencies: Set<ArmorCategory>;
  naturalWeapons: Set<WeaponItem>;
  resources: Map<string, number>;
  configs: Map<string, unknown>;
  saveProficiencies: Set<AbilityName>;
  features: Map<string, Feature>;
  classLevels: Map<PCClassName, number>;
  concentratingOn: Set<Concentration>;
  time: Set<ActionTime>;
  attunements: Set<Item>;
  movedSoFar: number;
  attacksSoFar: Action[];
  effects: Map<EffectType<unknown>, EffectConfig<unknown>>;
  knownSpells: Set<Spell>;
  preparedSpells: Set<Spell>;
  toolProficiencies: Map<ToolName, ProficiencyType>;
  resourcesMax: Map<string, number>;
  spellcastingMethods: Set<SpellcastingMethod>;
  damageResponses: Map<DamageType, DamageResponse>;
  exhaustion: number;
  temporaryHP: number;
  temporaryHPSource?: Source;
  conditionImmunities: Set<ConditionName>;
  deathSaveFailures: number;
  deathSaveSuccesses: number;
  rules: Set<AIRule>;
  coefficients: Map<AICoefficient, number>;
  groups: Set<CombatantGroup>;
  spellsSoFar: Spell[];

  constructor(
    public g: Engine,
    public name: string,
    {
      img,
      side,
      size,
      type,
      diesAtZero = true,
      hands = defaultHandsAmount[type],
      hpMax = 0,
      hp = hpMax,
      level = NaN,
      pb = 2,
      cr = NaN,
      reach = MapSquareSize,
      chaScore = 10,
      conScore = 10,
      dexScore = 10,
      intScore = 10,
      strScore = 10,
      wisScore = 10,
      naturalAC = 10,
      rules,
      coefficients,
      groups,
    }: {
      diesAtZero?: boolean;
      hands?: number;
      hp?: number;
      hpMax?: number;
      img: string;
      level?: number;
      cr?: number;
      pb?: number;
      reach?: number;
      side: number;
      size: SizeCategory;
      type: CreatureType;
      chaScore?: number;
      conScore?: number;
      dexScore?: number;
      intScore?: number;
      strScore?: number;
      wisScore?: number;
      naturalAC?: number;
      rules?: SetInitialiser<AIRule>;
      coefficients?: MapInitialiser<AICoefficient, number>;
      groups?: SetInitialiser<CombatantGroup>;
    },
  ) {
    this.id = g.nextId();
    this.position = { x: NaN, y: NaN };
    this.initiative = NaN;

    this.diesAtZero = diesAtZero;
    this.hands = hands;
    this.hp = hp;
    this.baseHpMax = hpMax;
    this.img = img;
    this.level = level;
    this.cr = cr;
    this.pb = pb;
    this.reach = reach;
    this.side = side;
    this.size = size;
    this.type = type;
    this.str = new AbilityScore(strScore);
    this.dex = new AbilityScore(dexScore);
    this.con = new AbilityScore(conScore);
    this.int = new AbilityScore(intScore);
    this.wis = new AbilityScore(wisScore);
    this.cha = new AbilityScore(chaScore);

    this.movement = new Map();
    this.skills = new Map();
    this.languages = new Set();
    this.equipment = new Set();
    this.inventory = new Set();
    this.senses = new Map();
    this.armorProficiencies = new Set();
    this.weaponCategoryProficiencies = new Set();
    this.weaponProficiencies = new Set();
    this.naturalWeapons = new Set();
    this.resources = new Map();
    this.configs = new Map();
    this.saveProficiencies = new Set();
    this.features = new Map();
    this.classLevels = new Map();
    this.concentratingOn = new Set();
    this.time = new Set();
    this.attunements = new Set();
    this.movedSoFar = 0;
    this.attacksSoFar = [];
    this.effects = new Map();
    this.knownSpells = new Set();
    this.preparedSpells = new Set();
    this.toolProficiencies = new Map();
    this.resourcesMax = new Map();
    this.spellcastingMethods = new Set();
    this.naturalAC = naturalAC;
    this.damageResponses = new Map();
    this.exhaustion = 0;
    this.temporaryHP = 0;
    this.conditionImmunities = new Set();
    this.deathSaveFailures = 0;
    this.deathSaveSuccesses = 0;
    this.rules = new Set(rules);
    this.coefficients = new Map(coefficients);
    this.groups = new Set(groups);
    this.spellsSoFar = [];
  }

  get baseACMethod(): ACMethod {
    return getNaturalArmourMethod(this, this.naturalAC);
  }

  get acMethod(): ACMethod {
    return this.g.getBestACMethod(this);
  }

  get baseAC(): number {
    return this.acMethod.ac;
  }

  get sizeInUnits() {
    return convertSizeToUnit(this.size);
  }

  get weapons() {
    const weapons: WeaponItem[] = [];
    for (const weapon of this.naturalWeapons) weapons.push(weapon);
    for (const item of this.equipment)
      if (item.itemType === "weapon") weapons.push(item);
    return weapons;
  }

  get armor() {
    for (const item of this.equipment) {
      if (isSuitOfArmor(item)) return item;
    }
  }

  get shield() {
    for (const item of this.equipment) {
      if (isShield(item)) return item;
    }
  }

  get ammunition() {
    const ammo: AmmoItem[] = [];
    for (const item of this.equipment) {
      if (item.itemType === "ammo") ammo.push(item);
    }
    for (const item of this.inventory) {
      if (item.itemType === "ammo") ammo.push(item);
    }
    return ammo;
  }

  get conditions(): Set<ConditionName> {
    return this.getConditions().conditions.result;
  }

  get frightenedBy(): Set<Combatant> {
    return this.getConditions().frightenedBy;
  }

  get grappling(): Set<Combatant> {
    return this.getConditions().grappling;
  }

  get speed(): number {
    const bonus = new BonusCollector();
    bonus.add(this.movement.get("speed") ?? 0, this);

    const e = this.g.fire(
      new GetSpeedEvent({
        who: this,
        bonus,
        multiplier: new MultiplierCollector(),
      }),
    );

    return bonus.result * e.detail.multiplier.result;
  }

  get hpMax(): number {
    const bonus = new BonusCollector();
    bonus.add(this.baseHpMax, this);

    const e = this.g.fire(
      new GetMaxHPEvent({
        who: this,
        bonus,
        multiplier: new MultiplierCollector(),
      }),
    );

    return bonus.result * e.detail.multiplier.result;
  }

  get freeHands() {
    let free = this.hands;
    for (const item of this.equipment) free -= item.hands;

    return free;
  }

  private getConditions() {
    const conditions = new ConditionCollector();
    for (const condition of this.conditionImmunities)
      conditions.ignoreValue(condition);

    const frightenedBy = new Set<Combatant>();
    const grappling = new Set<Combatant>();

    this.g.fire(
      new GetConditionsEvent({
        who: this,
        conditions,
        frightenedBy,
        grappling,
      }),
    );

    // cascading conditions
    for (const condition of conditions.getEntries()) {
      if (
        condition.value === "Paralyzed" ||
        condition.value === "Petrified" ||
        condition.value === "Stunned" ||
        condition.value === "Unconscious"
      )
        conditions.add("Incapacitated", condition.source);
    }

    if (!conditions.result.has("Frightened")) frightenedBy.clear();

    return { conditions, frightenedBy, grappling };
  }

  addFeatures(features?: Feature[]) {
    for (const feature of features ?? []) this.addFeature(feature);
  }

  addFeature(feature: Feature) {
    if (this.features.get(feature.name)) {
      console.warn(
        `${this.name} already has a feature named ${feature.name}, skipping.`,
      );
      return false;
    }

    this.features.set(feature.name, feature);

    return true;
  }

  setAbilityScores(
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
  ) {
    this.str.score = str;
    this.dex.score = dex;
    this.con.score = con;
    this.int.score = int;
    this.wis.score = wis;
    this.cha.score = cha;
  }

  don(item: Item, attune = false) {
    if (item.itemType === "armor") {
      const predicate = isSuitOfArmor(item) ? isSuitOfArmor : isShield;

      for (const o of this.equipment) {
        if (predicate(o)) this.doff(o);
      }
    }

    // TODO error conditions, hands, time to equip, etc.
    this.equipment.add(item);

    // TODO max attunements
    if (attune) this.attunements.add(item);

    return true;
  }

  doff(item: Item) {
    if (this.equipment.delete(item)) {
      this.inventory.add(item);
      return true;
    }

    return false;
  }

  addProficiency(thing: HasProficiency, value: ProficiencyType) {
    const prof = getProficiencyType(thing);

    switch (prof?.type) {
      case "ability":
        this.saveProficiencies.add(prof.ability);
        return;

      case "armor":
        this.armorProficiencies.add(prof.category);
        return;

      case "skill": {
        const old = this.skills.get(prof.skill) ?? "none";
        this.skills.set(prof.skill, getProficiencyMax(old, value));
        return;
      }

      case "tool": {
        const old = this.toolProficiencies.get(prof.tool) ?? "none";
        this.toolProficiencies.set(prof.tool, getProficiencyMax(old, value));
        return;
      }

      case "weapon":
        if (prof.category !== "natural")
          this.weaponProficiencies.add(prof.weapon);
        return;

      case "weaponCategory":
        this.weaponCategoryProficiencies.add(prof.category);
        return;
    }
  }

  getProficiency(thing: HasProficiency): ProficiencyType {
    const prof = getProficiencyType(thing);

    switch (prof?.type) {
      case "ability":
        return this.saveProficiencies.has(prof.ability) ? "proficient" : "none";

      case "armor":
        return this.armorProficiencies.has(prof.category)
          ? "proficient"
          : "none";

      case "skill":
        return this.skills.get(prof.skill) ?? "none";

      case "tool":
        return this.toolProficiencies.get(prof.tool) ?? "none";

      case "weapon":
        if (prof.category === "natural") return "proficient";
        if (this.weaponCategoryProficiencies.has(prof.category))
          return "proficient";
        if (this.weaponProficiencies.has(prof.weapon)) return "proficient";
        break;

      case "weaponCategory":
        return this.weaponCategoryProficiencies.has(prof.category)
          ? "proficient"
          : "none";
    }

    return "none";
  }

  initResource(resource: Resource, amount = resource.maximum, max = amount) {
    this.resources.set(resource.name, amount);
    this.resourcesMax.set(resource.name, max);
  }

  giveResource(resource: Resource, amount: number) {
    const old = this.resources.get(resource.name) ?? 0;
    this.resources.set(
      resource.name,
      Math.min(old + amount, this.getResourceMax(resource)),
    );
  }

  hasResource(resource: Resource, amount = 1) {
    return (this.resources.get(resource.name) ?? 0) >= amount;
  }

  refreshResource(resource: Resource): void {
    this.resources.set(resource.name, this.getResourceMax(resource));
  }

  spendResource(resource: Resource, amount = 1) {
    const old = this.resources.get(resource.name) ?? 0;
    if (old < amount)
      throw new Error(`Cannot spend ${amount} of ${resource.name} resource`);

    this.resources.set(resource.name, old - amount);
  }

  getResource(resource: Resource) {
    return this.resources.get(resource.name) ?? 0;
  }

  getResourceMax(resource: Resource) {
    return this.resourcesMax.get(resource.name) ?? resource.maximum;
  }

  removeResource(resource: Resource) {
    this.resources.delete(resource.name);
  }

  getConfig<T>(key: string) {
    return this.configs.get(key) as T | undefined;
  }

  setConfig<T>(feature: ConfiguredFeature<T>, config: T) {
    this.configs.set(feature.name, config);
  }

  async endConcentration() {
    for (const other of this.concentratingOn) await other.onSpellEnd();
    this.concentratingOn.clear();
  }

  async concentrateOn(entry: Concentration) {
    await this.endConcentration();
    this.concentratingOn.add(entry);
  }

  finalise() {
    for (const feature of this.features.values())
      feature.setup(this.g, this, this.getConfig(feature.name));

    // this is where items should apply stuff
    this.g.fire(new CombatantFinalisingEvent({ who: this }));

    this.hp = this.hpMax;

    for (const spell of this.preparedSpells)
      spellImplementationWarning(spell, this);
  }

  async addEffect<T>(
    effect: EffectType<T>,
    config: EffectConfig<T>,
    attacker?: Combatant,
  ): Promise<boolean> {
    const e = await this.g.resolve(
      new BeforeEffectEvent({
        who: this,
        effect,
        config,
        attacker,
        interrupt: new InterruptionCollector(),
        success: new SuccessResponseCollector(),
      }),
    );
    if (e.detail.success.result === "fail") return false;

    this.effects.set(effect, config);
    await this.g.resolve(
      new EffectAddedEvent({
        who: this,
        effect,
        config,
        interrupt: new InterruptionCollector(),
      }),
    );

    return true;
  }

  getEffectConfig<T>(effect: EffectType<T>) {
    return this.effects.get(effect) as EffectConfig<T> | undefined;
  }

  hasEffect<T>(effect: EffectType<T>) {
    return this.effects.has(effect);
  }

  async removeEffect<T>(effect: EffectType<T>): Promise<boolean> {
    const config = this.getEffectConfig(effect);

    if (config) {
      this.effects.delete(effect);
      await this.g.resolve(
        new EffectRemovedEvent({
          who: this,
          effect,
          config,
          interrupt: new InterruptionCollector(),
        }),
      );
      return true;
    }

    return false;
  }

  async tickEffects(durationTimer: EffectDurationTimer) {
    for (const [effect, config] of this.effects) {
      if (effect.durationTimer === durationTimer && --config.duration < 1)
        await this.removeEffect(effect);
    }
  }

  addKnownSpells(...spells: Spell[]) {
    for (const spell of spells) this.knownSpells.add(spell);
  }

  addPreparedSpells(...spells: Spell[]) {
    for (const spell of spells) {
      this.knownSpells.add(spell);
      this.preparedSpells.add(spell);
    }
  }

  async changeExhaustion(delta: number): Promise<number> {
    const old = this.exhaustion;
    const value = clamp(this.exhaustion + delta, 0, 6);

    const e = new ExhaustionEvent({
      who: this,
      old,
      delta,
      value,
      interrupt: new InterruptionCollector(),
      success: new SuccessResponseCollector(),
    });
    await this.g.resolve(e);

    if (e.detail.success.result !== "fail") this.exhaustion = value;
    return this.exhaustion;
  }

  hasTime(time: ActionTime) {
    return this.time.has(time);
  }

  useTime(time: ActionTime): void {
    this.time.delete(time);
  }

  resetTime(): void {
    this.time.clear();
    this.time.add("action");
    this.time.add("bonus action");
    this.time.add("reaction");
    this.time.add("item interaction");
  }

  regainTime(time: ActionTime): void {
    this.time.add(time);
  }

  getCoefficient(co: AICoefficient) {
    const values = [this.coefficients.get(co)];
    for (const group of this.groups) values.push(group.getCoefficient(co));
    const filtered = values.filter(isDefined);

    return filtered.length
      ? filtered.reduce((p, c) => p * c, 1)
      : co.defaultValue;
  }
}
