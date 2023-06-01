import BonusCollector from "./collectors/BonusCollector";
import MultiplierCollector from "./collectors/MultiplierCollector";
import Engine from "./Engine";
import EffectAddedEvent from "./events/EffectAddedEvent";
import EffectRemovedEvent from "./events/EffectRemovedEvent";
import GetConditionsEvent from "./events/GetConditionsEvent";
import GetSpeedEvent from "./events/GetSpeedEvent";
import ConfiguredFeature from "./features/ConfiguredFeature";
import Ability, { Abilities } from "./types/Ability";
import Combatant from "./types/Combatant";
import CombatantEffect from "./types/CombatantEffect";
import Concentration from "./types/Concentration";
import { ConditionName } from "./types/ConditionName";
import CreatureType from "./types/CreatureType";
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
import ToolName from "./types/ToolName";
import { getAbilityBonus } from "./utils/dnd";
import { isShield, isSuitOfArmor } from "./utils/items";
import { isA } from "./utils/types";
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
  configs: Map<string, unknown>;
  saveProficiencies: Set<Ability>;
  features: Map<string, Feature>;
  classLevels: Map<PCClassName, number>;
  concentratingOn: Set<Concentration>;
  time: Set<"action" | "bonus action" | "reaction">;
  attunements: Set<Item>;
  movedSoFar: number;
  effects: Map<CombatantEffect, number>;
  knownSpells: Set<Spell>;
  preparedSpells: Set<Spell>;
  toolProficiencies: Map<ToolName, number>;

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
      reach = 5,
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
    this.strScore = strScore;
    this.dexScore = dexScore;
    this.conScore = conScore;
    this.intScore = intScore;
    this.wisScore = wisScore;
    this.chaScore = chaScore;

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
    this.effects = new Map();
    this.knownSpells = new Set();
    this.preparedSpells = new Set();
    this.toolProficiencies = new Map();
  }

  get str() {
    return getAbilityBonus(this.strScore);
  }
  get dex() {
    return getAbilityBonus(this.dexScore);
  }
  get con() {
    return getAbilityBonus(this.conScore);
  }
  get int() {
    return getAbilityBonus(this.intScore);
  }
  get wis() {
    return getAbilityBonus(this.wisScore);
  }
  get cha() {
    return getAbilityBonus(this.chaScore);
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
      new GetConditionsEvent({ who: this, conditions: new Set() })
    ).detail.conditions;
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

    return bonus.result * e.detail.multiplier.value;
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
    this.strScore = str;
    this.dexScore = dex;
    this.conScore = con;
    this.intScore = int;
    this.wisScore = wis;
    this.chaScore = cha;
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

  getProficiencyMultiplier(thing: Item | Ability | SkillName): number {
    if (typeof thing === "string") {
      if (isA(thing, Abilities))
        return this.saveProficiencies.has(thing) ? 1 : 0;
      return this.skills.get(thing) ?? 0;
    }

    if (thing.itemType === "weapon") {
      if (thing.category === "natural") return 1;
      if (this.weaponProficiencies.has(thing.weaponType)) return 1;
      if (this.weaponCategoryProficiencies.has(thing.category)) return 1;
      return 0;
    }

    if (thing.itemType === "armor")
      if (this.armorProficiencies.has(thing.category)) return 1;

    return 0;
  }

  addResource(resource: Resource, amount?: number): void {
    this.resources.set(resource.name, amount ?? resource.maximum);
  }

  hasResource(resource: Resource, amount = 1): boolean {
    return (this.resources.get(resource.name) ?? 0) >= amount;
  }

  spendResource(resource: Resource, amount = 1): void {
    const old = this.resources.get(resource.name) ?? 0;
    if (old < amount)
      throw new Error(`Cannot spend ${amount} of ${resource.name} resource`);

    this.resources.set(resource.name, old - amount);
  }

  getConfig<T>(key: string): T | undefined {
    return this.configs.get(key) as T | undefined;
  }

  setConfig<T>(feature: ConfiguredFeature<T>, config: T) {
    this.configs.set(feature.name, config);
  }

  concentrateOn(entry: Concentration): void {
    // TODO destroy existing concentratingOn entries?
    this.concentratingOn.add(entry);
  }

  finalise() {
    for (const feature of this.features.values())
      feature.setup(this.g, this, this.getConfig(feature.name));

    this.hp = this.hpMax;
  }

  addEffect(effect: CombatantEffect, duration: number) {
    this.effects.set(effect, duration);
    this.g.fire(new EffectAddedEvent({ who: this, effect, duration }));
  }

  hasEffect(effect: CombatantEffect) {
    return this.effects.has(effect);
  }

  removeEffect(effect: CombatantEffect) {
    const durationRemaining = this.effects.get(effect) ?? NaN;

    this.effects.delete(effect);
    this.g.fire(
      new EffectRemovedEvent({ who: this, effect, durationRemaining })
    );
  }

  tickEffects(durationTimer: CombatantEffect["durationTimer"]) {
    for (const [effect, duration] of this.effects) {
      if (effect.durationTimer === durationTimer) {
        this.effects.set(effect, duration - 1);
        if (duration <= 1) this.removeEffect(effect);
      }
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
