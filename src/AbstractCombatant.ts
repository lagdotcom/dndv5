import AbilityScore from "./AbilityScore";
import BonusCollector from "./collectors/BonusCollector";
import ConditionCollector from "./collectors/ConditionCollector";
import MultiplierCollector from "./collectors/MultiplierCollector";
import Engine from "./Engine";
import EffectAddedEvent from "./events/EffectAddedEvent";
import EffectRemovedEvent from "./events/EffectRemovedEvent";
import GetConditionsEvent from "./events/GetConditionsEvent";
import GetSpeedEvent from "./events/GetSpeedEvent";
import ConfiguredFeature from "./features/ConfiguredFeature";
import { MapSquareSize } from "./MapSquare";
import { spellImplementationWarning } from "./spells/common";
import AbilityName from "./types/AbilityName";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CombatantScore from "./types/CombatantScore";
import Concentration from "./types/Concentration";
import ConditionName from "./types/ConditionName";
import CreatureType from "./types/CreatureType";
import EffectType, {
  EffectConfig,
  EffectDurationTimer,
} from "./types/EffectType";
import Feature from "./types/Feature";
import Item, {
  AmmoItem,
  ArmorCategory,
  WeaponCategory,
  WeaponItem,
} from "./types/Item";
import LanguageName from "./types/LanguageName";
import MovementType from "./types/MovementType";
import PCClassName from "./types/PCClassName";
import Resource from "./types/Resource";
import SenseName from "./types/SenseName";
import SizeCategory from "./types/SizeCategory";
import SkillName from "./types/SkillName";
import Spell from "./types/Spell";
import SpellcastingMethod from "./types/SpellcastingMethod";
import ToolName from "./types/ToolName";
import { getProficiencyType } from "./utils/dnd";
import { isShield, isSuitOfArmor } from "./utils/items";
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

  diesAtZero: boolean;
  hp: number;
  hpMax: number;
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
  configs: Map<string, unknown>;
  saveProficiencies: Set<AbilityName>;
  features: Map<string, Feature>;
  classLevels: Map<PCClassName, number>;
  concentratingOn: Set<Concentration>;
  time: Set<"action" | "bonus action" | "reaction">;
  attunements: Set<Item>;
  movedSoFar: number;
  attacksSoFar: Set<Action>;
  effects: Map<EffectType<unknown>, EffectConfig<unknown>>;
  knownSpells: Set<Spell>;
  preparedSpells: Set<Spell>;
  toolProficiencies: Map<ToolName, number>;
  resourcesMax: Map<string, number>;
  spellcastingMethods: Set<SpellcastingMethod>;

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
      reach = MapSquareSize,
      chaScore = 10,
      conScore = 10,
      dexScore = 10,
      intScore = 10,
      strScore = 10,
      wisScore = 10,
    }: {
      diesAtZero?: boolean;
      hands?: number;
      hp?: number;
      hpMax?: number;
      img: string;
      level?: number;
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
    }
  ) {
    this.id = g.nextId();
    this.diesAtZero = diesAtZero;
    this.hands = hands;
    this.hp = hp;
    this.hpMax = hpMax;
    this.img = img;
    this.level = level;
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
    this.attacksSoFar = new Set();
    this.effects = new Map();
    this.knownSpells = new Set();
    this.preparedSpells = new Set();
    this.toolProficiencies = new Map();
    this.resourcesMax = new Map();
    this.spellcastingMethods = new Set();
  }

  get ac(): number {
    return this.g.getAC(this);
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
    return this.g.fire(
      new GetConditionsEvent({
        who: this,
        conditions: new ConditionCollector(),
      })
    ).detail.conditions.result;
  }

  get speed(): number {
    const bonus = new BonusCollector();
    bonus.add(this.movement.get("speed") ?? 0, this);

    const e = this.g.fire(
      new GetSpeedEvent({
        who: this,
        bonus,
        multiplier: new MultiplierCollector(),
      })
    );

    return bonus.result * e.detail.multiplier.result;
  }

  addFeature(feature: Feature) {
    if (this.features.get(feature.name)) {
      console.warn(
        `${this.name} already has a feature named ${feature.name}, skipping.`
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
    cha: number
  ) {
    this.str.setScore(str);
    this.dex.setScore(dex);
    this.con.setScore(con);
    this.int.setScore(int);
    this.wis.setScore(wis);
    this.cha.setScore(cha);
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
  }

  doff(item: Item) {
    if (this.equipment.delete(item)) {
      this.inventory.add(item);
    }
  }

  getProficiencyMultiplier(thing: Item | AbilityName | SkillName): number {
    const prof = getProficiencyType(thing);

    switch (prof?.type) {
      case "ability":
        return this.saveProficiencies.has(prof.ability) ? 1 : 0;

      case "armor":
        return this.armorProficiencies.has(prof.category) ? 1 : 0;

      case "skill":
        return this.skills.get(prof.skill) ?? 0;

      case "weapon":
        if (prof.category === "natural") return 1;
        if (this.weaponCategoryProficiencies.has(prof.category)) return 1;
        if (this.weaponProficiencies.has(prof.weapon)) return 1;
    }

    return 0;
  }

  initResource(resource: Resource, amount = resource.maximum, max = amount) {
    this.resources.set(resource.name, amount);
    this.resourcesMax.set(resource.name, max);
  }

  giveResource(resource: Resource, amount: number) {
    const old = this.resources.get(resource.name) ?? 0;
    this.resources.set(
      resource.name,
      Math.min(old + amount, this.getResourceMax(resource))
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

    this.hp = this.hpMax;

    for (const spell of this.preparedSpells)
      spellImplementationWarning(spell, this);
  }

  addEffect<T>(effect: EffectType<T>, config: EffectConfig<T>) {
    this.effects.set(effect, config);
    this.g.fire(new EffectAddedEvent({ who: this, effect, config }));
  }

  getEffectConfig<T>(effect: EffectType<T>) {
    return this.effects.get(effect) as EffectConfig<T> | undefined;
  }

  hasEffect<T>(effect: EffectType<T>) {
    return this.effects.has(effect);
  }

  removeEffect<T>(effect: EffectType<T>) {
    const config = this.getEffectConfig(effect);

    if (config) {
      this.effects.delete(effect);
      this.g.fire(new EffectRemovedEvent({ who: this, effect, config }));
    }
  }

  tickEffects(durationTimer: EffectDurationTimer) {
    for (const [effect, config] of this.effects) {
      if (effect.durationTimer === durationTimer && --config.duration < 1)
        this.removeEffect(effect);
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
}
