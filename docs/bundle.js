"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // globalExternal:preact
  var require_preact = __commonJS({
    "globalExternal:preact"(exports, module) {
      module.exports = globalThis.preact;
    }
  });

  // globalExternal:preact/hooks
  var require_hooks = __commonJS({
    "globalExternal:preact/hooks"(exports, module) {
      module.exports = globalThis.preactHooks;
    }
  });

  // globalExternal:@preact/signals
  var require_signals = __commonJS({
    "globalExternal:@preact/signals"(exports, module) {
      module.exports = globalThis.preactSignals;
    }
  });

  // src/index.tsx
  var import_preact3 = __toESM(require_preact());

  // src/collectors/DamageResponseCollector.ts
  var DamageResponseCollector = class {
    constructor() {
      this.absorb = /* @__PURE__ */ new Set();
      this.immune = /* @__PURE__ */ new Set();
      this.resist = /* @__PURE__ */ new Set();
      this.normal = /* @__PURE__ */ new Set();
      this.vulnerable = /* @__PURE__ */ new Set();
    }
    add(response, source) {
      this[response].add(source);
    }
    get result() {
      if (this.absorb.size)
        return "absorb";
      if (this.immune.size)
        return "immune";
      if (this.resist.size)
        return "resist";
      if (this.vulnerable.size)
        return "vulnerable";
      return "normal";
    }
  };

  // src/collectors/InterruptionCollector.ts
  var InterruptionCollector = class extends Set {
  };

  // src/DiceBag.ts
  function matches(rt, m) {
    for (const [field, value] of Object.entries(m)) {
      if (rt[field] !== value)
        return false;
    }
    return true;
  }
  function sizeOfDice(rt) {
    switch (rt.type) {
      case "damage":
        return rt.size;
      default:
        return 20;
    }
  }
  var DiceBag = class {
    constructor() {
      this.forcedRolls = /* @__PURE__ */ new Set();
    }
    force(value, matcher) {
      this.forcedRolls.add({ value, matcher });
    }
    getForcedRoll(rt) {
      for (const fr of this.forcedRolls) {
        if (matches(rt, fr.matcher)) {
          this.forcedRolls.delete(fr);
          return fr.value;
        }
      }
    }
    roll(rt, dt) {
      var _a, _b;
      const size = sizeOfDice(rt);
      let value = (_a = this.getForcedRoll(rt)) != null ? _a : Math.ceil(Math.random() * size);
      const otherValues = /* @__PURE__ */ new Set();
      if (dt !== "normal") {
        const second = (_b = this.getForcedRoll(rt)) != null ? _b : Math.ceil(Math.random() * size);
        if (dt === "advantage" && second > value || dt === "disadvantage" && value > second) {
          otherValues.add(value);
          value = second;
        } else
          otherValues.add(second);
      }
      return { size, value, otherValues };
    }
  };

  // src/collectors/BonusCollector.ts
  var BonusCollector = class {
    constructor() {
      this.effects = /* @__PURE__ */ new Set();
    }
    add(value, source) {
      this.effects.add({ value, source });
    }
    get result() {
      let total = 0;
      for (const { value } of this.effects)
        total += value;
      return total;
    }
  };

  // src/collectors/DiceTypeCollector.ts
  var DiceTypeCollector = class {
    constructor() {
      this.advantage = /* @__PURE__ */ new Set();
      this.disadvantage = /* @__PURE__ */ new Set();
      this.normal = /* @__PURE__ */ new Set();
      this.sources = /* @__PURE__ */ new Set();
    }
    add(response, source) {
      this[response].add(source);
      this.sources.add(source);
    }
    involved(source) {
      return this.sources.has(source);
    }
    get result() {
      const hasAdvantage = this.advantage.size > 0;
      const hasDisadvantage = this.disadvantage.size > 0;
      if (hasAdvantage === hasDisadvantage)
        return "normal";
      return hasAdvantage ? "advantage" : "disadvantage";
    }
  };

  // src/collectors/ErrorCollector.ts
  var ErrorCollector = class {
    constructor() {
      this.errors = /* @__PURE__ */ new Set();
    }
    add(value, source) {
      this.errors.add({ value, source });
    }
    get messages() {
      return [...this.errors].map(
        (entry) => `${entry.value} (${entry.source.name})`
      );
    }
    get valid() {
      return this.errors.size === 0;
    }
  };

  // src/collectors/MultiplierCollector.ts
  var MultiplierCollector = class {
    constructor() {
      this.multipliers = /* @__PURE__ */ new Set();
    }
    add(value, source) {
      this.multipliers.add({ value, source });
    }
    get value() {
      let total = 1;
      for (const { value } of this.multipliers)
        total *= value;
      return total;
    }
  };

  // src/DamageMap.ts
  var DamageMap = class {
    constructor(...items) {
      this.map = new Map(items);
      this._total = items.reduce((total, [, value]) => total + value, 0);
    }
    get total() {
      return this._total;
    }
    add(type, value) {
      var _a;
      const old = (_a = this.map.get(type)) != null ? _a : 0;
      this.map.set(type, old + value);
      this._total += value;
    }
    [Symbol.iterator]() {
      return this.map[Symbol.iterator]();
    }
  };

  // src/events/AttackEvent.ts
  var AttackEvent = class extends CustomEvent {
    constructor(detail) {
      super("attack", { detail });
    }
  };

  // src/events/BeforeAttackEvent.ts
  var BeforeAttackEvent = class extends CustomEvent {
    constructor(detail) {
      super("beforeAttack", { detail });
    }
  };

  // src/events/GatherDamageEvent.ts
  var GatherDamageEvent = class extends CustomEvent {
    constructor(detail) {
      super("gatherDamage", { detail });
    }
  };

  // src/events/EffectAddedEvent.ts
  var EffectAddedEvent = class extends CustomEvent {
    constructor(detail) {
      super("effectAdded", { detail });
    }
  };

  // src/events/EffectRemovedEvent.ts
  var EffectRemovedEvent = class extends CustomEvent {
    constructor(detail) {
      super("effectRemoved", { detail });
    }
  };

  // src/events/GetConditionsEvent.ts
  var GetConditionsEvent = class extends CustomEvent {
    constructor(detail) {
      super("getConditions", { detail });
    }
  };

  // src/events/GetSpeedEvent.ts
  var GetSpeedEvent = class extends CustomEvent {
    constructor(detail) {
      super("getSpeed", { detail });
    }
  };

  // src/types/Ability.ts
  var Abilities = ["str", "dex", "con", "int", "wis", "cha"];

  // src/utils/dnd.ts
  function getAbilityBonus(ability) {
    return Math.floor((ability - 10) / 2);
  }
  function getDiceAverage(count, size) {
    return (size + 1) / 2 * count;
  }
  function getProficiencyBonusByLevel(level) {
    return Math.ceil(level / 4) + 1;
  }

  // src/utils/types.ts
  function isDefined(value) {
    return typeof value !== "undefined";
  }
  function isA(value, enumeration) {
    return enumeration.includes(value);
  }

  // src/utils/items.ts
  var isSuitOfArmor = (item) => item.itemType === "armor" && item.category !== "shield";
  var isShield = (item) => item.itemType === "armor" && item.category === "shield";
  function getWeaponAbility(who, weapon) {
    if (weapon.forceAbilityScore)
      return weapon.forceAbilityScore;
    const { str, dex } = who;
    if (weapon.properties.has("finesse")) {
      if (dex >= str)
        return "dex";
    }
    if (weapon.rangeCategory === "ranged")
      return "dex";
    return "str";
  }
  function getWeaponRange(who, weapon) {
    if (isDefined(weapon.longRange))
      return weapon.longRange;
    return who.reach;
  }
  function getValidAmmunition(who, weapon) {
    return who.ammunition.filter(
      (ammo) => ammo.ammunitionTag === weapon.ammunitionTag && ammo.quantity > 0
    );
  }
  function enchant(item, ...enchantments) {
    for (const enchantment of enchantments)
      item.addEnchantment(enchantment);
    return item;
  }

  // src/utils/units.ts
  var categoryUnits = {
    tiny: 1,
    small: 1,
    medium: 1,
    large: 2,
    huge: 3,
    gargantuan: 4
  };
  function convertSizeToUnit(size) {
    return categoryUnits[size] * 5;
  }
  function distance(g2, a, b) {
    const as = g2.getState(a);
    const bs = g2.getState(b);
    const dx = Math.abs(as.position.x - bs.position.x);
    const dy = Math.abs(as.position.y - bs.position.y);
    return Math.max(dx, dy);
  }
  function distanceTo(g2, who, to) {
    const s = g2.getState(who);
    const dx = Math.abs(s.position.x - to.x);
    const dy = Math.abs(s.position.y - to.y);
    return Math.max(dx, dy);
  }
  function getSquares(who, position) {
    const size = who.sizeInUnits;
    const points = [];
    for (let y = 0; y < size; y += 5)
      for (let x = 0; x < size; x += 5)
        points.push({ x: x + position.x, y: y + position.y });
    return points;
  }

  // src/AbstractCombatant.ts
  var defaultHandsAmount = {
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
    undead: 2
  };
  var AbstractCombatant = class {
    constructor(g2, name, {
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
      wisScore = 10
    }) {
      this.g = g2;
      this.name = name;
      this.id = g2.nextId();
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
      this.movement = /* @__PURE__ */ new Map();
      this.skills = /* @__PURE__ */ new Map();
      this.languages = /* @__PURE__ */ new Set();
      this.equipment = /* @__PURE__ */ new Set();
      this.inventory = /* @__PURE__ */ new Set();
      this.senses = /* @__PURE__ */ new Map();
      this.armorProficiencies = /* @__PURE__ */ new Set();
      this.weaponCategoryProficiencies = /* @__PURE__ */ new Set();
      this.weaponProficiencies = /* @__PURE__ */ new Set();
      this.naturalWeapons = /* @__PURE__ */ new Set();
      this.resources = /* @__PURE__ */ new Map();
      this.configs = /* @__PURE__ */ new Map();
      this.saveProficiencies = /* @__PURE__ */ new Set();
      this.features = /* @__PURE__ */ new Map();
      this.classLevels = /* @__PURE__ */ new Map();
      this.concentratingOn = /* @__PURE__ */ new Set();
      this.time = /* @__PURE__ */ new Set();
      this.attunements = /* @__PURE__ */ new Set();
      this.movedSoFar = 0;
      this.effects = /* @__PURE__ */ new Map();
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
    get ac() {
      return this.g.getAC(this);
    }
    get sizeInUnits() {
      return convertSizeToUnit(this.size);
    }
    get weapons() {
      const weapons = [];
      for (const weapon of this.naturalWeapons)
        weapons.push(weapon);
      for (const item of this.equipment)
        if (item.itemType === "weapon")
          weapons.push(item);
      return weapons;
    }
    get armor() {
      for (const item of this.equipment) {
        if (isSuitOfArmor(item))
          return item;
      }
    }
    get shield() {
      for (const item of this.equipment) {
        if (isShield(item))
          return item;
      }
    }
    get ammunition() {
      const ammo = [];
      for (const item of this.equipment) {
        if (item.itemType === "ammo")
          ammo.push(item);
      }
      for (const item of this.inventory) {
        if (item.itemType === "ammo")
          ammo.push(item);
      }
      return ammo;
    }
    get conditions() {
      return this.g.fire(
        new GetConditionsEvent({ who: this, conditions: /* @__PURE__ */ new Set() })
      ).detail.conditions;
    }
    get speed() {
      var _a;
      const bonus = new BonusCollector();
      bonus.add((_a = this.movement.get("speed")) != null ? _a : 0, this);
      const e = this.g.fire(
        new GetSpeedEvent({
          who: this,
          bonus,
          multiplier: new MultiplierCollector()
        })
      );
      return bonus.result * e.detail.multiplier.value;
    }
    addFeature(feature) {
      if (this.features.get(feature.name)) {
        console.warn(
          `${this.name} already has a feature named ${feature.name}, skipping.`
        );
        return false;
      }
      this.features.set(feature.name, feature);
      return true;
    }
    setAbilityScores(str, dex, con, int, wis, cha) {
      this.strScore = str;
      this.dexScore = dex;
      this.conScore = con;
      this.intScore = int;
      this.wisScore = wis;
      this.chaScore = cha;
    }
    don(item, attune = false) {
      if (item.itemType === "armor") {
        const predicate = isSuitOfArmor(item) ? isSuitOfArmor : isShield;
        for (const o2 of this.equipment) {
          if (predicate(o2))
            this.doff(o2);
        }
      }
      this.equipment.add(item);
      if (attune)
        this.attunements.add(item);
    }
    doff(item) {
      if (this.equipment.delete(item)) {
        this.inventory.add(item);
      }
    }
    getProficiencyMultiplier(thing) {
      var _a;
      if (typeof thing === "string") {
        if (isA(thing, Abilities))
          return this.saveProficiencies.has(thing) ? 1 : 0;
        return (_a = this.skills.get(thing)) != null ? _a : 0;
      }
      if (thing.itemType === "weapon") {
        if (this.weaponProficiencies.has(thing.weaponType))
          return 1;
        if (this.weaponCategoryProficiencies.has(thing.category))
          return 1;
        return 0;
      }
      if (thing.itemType === "armor") {
        if (this.armorProficiencies.has(thing.category))
          return 1;
      }
      return 0;
    }
    addResource(resource, amount) {
      this.resources.set(resource, amount != null ? amount : resource.maximum);
    }
    hasResource(resource, amount = 1) {
      var _a;
      return ((_a = this.resources.get(resource)) != null ? _a : 0) >= amount;
    }
    spendResource(resource, amount = 1) {
      var _a;
      const old = (_a = this.resources.get(resource)) != null ? _a : 0;
      if (old < amount)
        throw new Error(`Cannot spend ${amount} of ${resource.name} resource`);
      this.resources.set(resource, old - amount);
    }
    getConfig(key) {
      return this.configs.get(key);
    }
    setConfig(feature, config) {
      this.configs.set(feature.name, config);
    }
    concentrateOn(entry) {
      this.concentratingOn.add(entry);
    }
    finalise() {
      for (const feature of this.features.values())
        feature.setup(this.g, this, this.getConfig(feature.name));
      this.hp = this.hpMax;
    }
    addEffect(effect, duration) {
      this.effects.set(effect, duration);
      this.g.fire(new EffectAddedEvent({ who: this, effect, duration }));
    }
    hasEffect(effect) {
      return this.effects.has(effect);
    }
    removeEffect(effect) {
      var _a;
      const durationRemaining = (_a = this.effects.get(effect)) != null ? _a : NaN;
      this.effects.delete(effect);
      this.g.fire(
        new EffectRemovedEvent({ who: this, effect, durationRemaining })
      );
    }
    tickEffects(durationTimer) {
      for (const [effect, duration] of this.effects) {
        if (effect.durationTimer === durationTimer) {
          this.effects.set(effect, duration - 1);
          if (duration <= 1)
            this.removeEffect(effect);
        }
      }
    }
  };

  // src/resolvers/TargetResolver.ts
  var TargetResolver = class {
    constructor(g2, maxRange, allowSelf = false) {
      this.g = g2;
      this.maxRange = maxRange;
      this.allowSelf = allowSelf;
      this.type = "Combatant";
    }
    get name() {
      const clauses = [];
      if (this.maxRange < Infinity)
        clauses.push(`target within ${this.maxRange}'`);
      if (!this.allowSelf)
        clauses.push("not self");
      return clauses.length ? clauses.join(", ") : "any target";
    }
    check(value, action, ec = new ErrorCollector()) {
      if (!(value instanceof AbstractCombatant))
        ec.add("No target", this);
      else {
        if (!this.allowSelf && value === action.actor)
          ec.add("Cannot target self", this);
        if (distance(this.g, action.actor, value) > this.maxRange)
          ec.add("Out of range", this);
      }
      return ec;
    }
  };

  // src/actions/WeaponAttack.ts
  var WeaponAttack = class {
    constructor(g2, actor, weapon, ammo) {
      this.g = g2;
      this.actor = actor;
      this.weapon = weapon;
      this.ammo = ammo;
      const range = getWeaponRange(actor, weapon);
      this.ability = getWeaponAbility(actor, weapon);
      this.config = { target: new TargetResolver(g2, range) };
      this.name = ammo ? `${weapon.name} (${ammo.name})` : weapon.name;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAffectedArea(_config) {
      return void 0;
    }
    check(config, ec = new ErrorCollector()) {
      return ec;
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        const { ability, ammo, weapon, actor: attacker, g: g2 } = this;
        const pre = g2.fire(
          new BeforeAttackEvent({
            target,
            attacker,
            ability,
            weapon,
            ammo,
            diceType: new DiceTypeCollector(),
            bonus: new BonusCollector()
          })
        );
        if (pre.defaultPrevented)
          return;
        const roll = yield g2.roll(
          { type: "attack", who: attacker, target, weapon, ability },
          pre.detail.diceType.result
        );
        if (ammo)
          ammo.quantity--;
        const total = roll.value + pre.detail.bonus.result;
        const outcome = roll.value === 1 ? "miss" : roll.value === 20 ? "critical" : total >= target.ac ? "hit" : "miss";
        const attack = g2.fire(
          new AttackEvent({ pre: pre.detail, roll, total, outcome })
        );
        const critical = attack.detail.outcome === "critical";
        if (attack.detail.outcome !== "miss") {
          const map = new DamageMap();
          const { damage } = weapon;
          if (damage.type === "dice") {
            const { count, size } = damage.amount;
            const amount = yield g2.rollDamage(
              count,
              {
                size,
                damageType: damage.damageType,
                attacker,
                target,
                ability,
                weapon
              },
              critical
            );
            map.add(damage.damageType, amount);
          } else
            map.add(damage.damageType, damage.amount);
          const gd = yield g2.resolve(
            new GatherDamageEvent({
              attacker,
              target,
              ability,
              weapon,
              ammo,
              map,
              bonus: new BonusCollector(),
              critical,
              attack: attack.detail,
              interrupt: new InterruptionCollector(),
              multiplier: new MultiplierCollector()
            })
          );
          map.add(damage.damageType, gd.detail.bonus.result);
          yield g2.damage(map, {
            source: this,
            attacker,
            target,
            multiplier: gd.detail.multiplier.value
          });
        }
      });
    }
  };

  // src/PointSet.ts
  function asPoint(tag) {
    const [x, y] = tag.split(",").map(Number);
    return { x, y };
  }
  var asTag = ({ x, y }) => `${x},${y}`;
  var PointSet = class {
    constructor(points) {
      this.set = new Set(points == null ? void 0 : points.map(asTag));
    }
    add(p) {
      return this.set.add(asTag(p));
    }
    delete(p) {
      return this.set.delete(asTag(p));
    }
    has(p) {
      return this.set.has(asTag(p));
    }
    *[Symbol.iterator]() {
      for (const tag of this.set)
        yield asPoint(tag);
    }
  };

  // src/utils/areas.ts
  function resolveArea(area) {
    const points = [];
    switch (area.type) {
      case "sphere": {
        const left = area.centre.x - area.radius;
        const top = area.centre.y - area.radius;
        for (let y = 0; y <= area.radius * 2; y += 5) {
          const dy = y - area.radius + 2.5;
          for (let x = 0; x <= area.radius * 2; x += 5) {
            const dx = x - area.radius + 2.5;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d <= area.radius)
              points.push({ x: left + x, y: top + y });
          }
        }
      }
    }
    return points;
  }

  // src/DndRules.ts
  var DndRule = class {
    constructor(name, setup) {
      this.name = name;
      this.setup = setup;
    }
  };
  var AbilityScoreRule = new DndRule("Ability Score", (g2, me) => {
    g2.events.on("beforeAttack", ({ detail: { attacker, ability, bonus } }) => {
      bonus.add(attacker[ability], me);
    });
    g2.events.on("gatherDamage", ({ detail: { attacker, ability, bonus } }) => {
      bonus.add(attacker[ability], me);
    });
  });
  var ArmorCalculationRule = new DndRule("Armor Calculation", (g2) => {
    g2.events.on("getACMethods", ({ detail: { who, methods } }) => {
      var _a, _b;
      const { armor, dex, shield } = who;
      const armorAC = (_a = armor == null ? void 0 : armor.ac) != null ? _a : 10;
      const shieldAC = (_b = shield == null ? void 0 : shield.ac) != null ? _b : 0;
      const uses = /* @__PURE__ */ new Set();
      if (armor)
        uses.add(armor);
      if (shield)
        uses.add(shield);
      const name = armor ? `${armor.category} armor` : "unarmored";
      const dexMod = (armor == null ? void 0 : armor.category) === "medium" ? Math.min(dex, 2) : (armor == null ? void 0 : armor.category) === "heavy" ? 0 : dex;
      methods.push({ name, ac: armorAC + dexMod + shieldAC, uses });
    });
  });
  var BlindedRule = new DndRule("Blinded", (g2, me) => {
    g2.events.on("beforeAttack", ({ detail: { attacker, diceType, target } }) => {
      if (attacker.conditions.has("Blinded"))
        diceType.add("disadvantage", me);
      if (target.conditions.has("Blinded"))
        diceType.add("advantage", me);
    });
  });
  var EffectsRule = new DndRule("Effects", (g2) => {
    g2.events.on(
      "turnStarted",
      ({ detail: { who } }) => who.tickEffects("turnStart")
    );
    g2.events.on("turnEnded", ({ detail: { who } }) => who.tickEffects("turnEnd"));
  });
  var LongRangeAttacksRule = new DndRule(
    "Long Range Attacks",
    (g2, me) => {
      g2.events.on(
        "beforeAttack",
        ({ detail: { attacker, target, weapon, diceType } }) => {
          if (typeof (weapon == null ? void 0 : weapon.shortRange) === "number" && distance(g2, attacker, target) > weapon.shortRange)
            diceType.add("disadvantage", me);
        }
      );
    }
  );
  var ObscuredRule = new DndRule("Obscured", (g2, me) => {
    const isHeavilyObscuredAnywhere = (squares) => {
      for (const effect of g2.effects) {
        if (!effect.tags.has("heavily obscured"))
          continue;
        const area = new PointSet(resolveArea(effect));
        for (const square of squares) {
          if (area.has(square))
            return true;
        }
      }
      return false;
    };
    g2.events.on("beforeAttack", ({ detail: { diceType, target } }) => {
      const squares = new PointSet(
        getSquares(target, g2.getState(target).position)
      );
      if (isHeavilyObscuredAnywhere(squares))
        diceType.add("disadvantage", me);
    });
    g2.events.on("getConditions", ({ detail: { conditions, who } }) => {
      const squares = new PointSet(getSquares(who, g2.getState(who).position));
      if (isHeavilyObscuredAnywhere(squares))
        conditions.add("Blinded");
    });
  });
  var ProficiencyRule = new DndRule("Proficiency", (g2, me) => {
    g2.events.on("beforeAttack", ({ detail: { attacker, weapon, bonus } }) => {
      if (weapon && attacker.getProficiencyMultiplier(weapon))
        bonus.add(attacker.pb, me);
    });
  });
  var ResourcesRule = new DndRule("Resources", (g2) => {
    g2.events.on("turnStarted", ({ detail: { who } }) => {
      for (const resource of who.resources.keys()) {
        if (resource.refresh === "turnStart")
          who.resources.set(resource, resource.maximum);
      }
    });
  });
  var TurnTimeRule = new DndRule("Turn Time", (g2) => {
    g2.events.on("turnStarted", ({ detail: { who } }) => {
      who.time.add("action");
      who.time.add("bonus action");
      who.time.add("reaction");
    });
  });
  var WeaponAttackRule = new DndRule("Weapon Attacks", (g2) => {
    g2.events.on("getActions", ({ detail: { who, target, actions } }) => {
      if (who !== target) {
        for (const weapon of who.weapons) {
          if (weapon.ammunitionTag) {
            for (const ammo of getValidAmmunition(who, weapon)) {
              actions.push(new WeaponAttack(g2, who, weapon, ammo));
            }
          } else
            actions.push(new WeaponAttack(g2, who, weapon));
        }
      }
    });
  });
  var allDndRules = [
    AbilityScoreRule,
    ArmorCalculationRule,
    BlindedRule,
    EffectsRule,
    LongRangeAttacksRule,
    ObscuredRule,
    ProficiencyRule,
    ResourcesRule,
    TurnTimeRule,
    WeaponAttackRule
  ];
  var DndRules = class {
    constructor(g2) {
      this.g = g2;
      for (const rule of allDndRules)
        rule.setup(g2, rule);
    }
  };

  // src/events/AreaPlacedEvent.ts
  var AreaPlacedEvent = class extends CustomEvent {
    constructor(detail) {
      super("areaPlaced", { detail });
    }
  };

  // src/events/AreaRemovedEvent.ts
  var AreaRemovedEvent = class extends CustomEvent {
    constructor(detail) {
      super("areaRemoved", { detail });
    }
  };

  // src/events/CombatantDamagedEvent.ts
  var CombatantDamagedEvent = class extends CustomEvent {
    constructor(detail) {
      super("combatantDamaged", { detail });
    }
  };

  // src/events/CombatantDiedEvent.ts
  var CombatantDiedEvent = class extends CustomEvent {
    constructor(detail) {
      super("combatantDied", { detail });
    }
  };

  // src/events/CombatantMovedEvent.ts
  var CombatantMovedEvent = class extends CustomEvent {
    constructor(detail) {
      super("combatantMoved", { detail });
    }
  };

  // src/events/CombatantPlacedEvent.ts
  var CombatantPlacedEvent = class extends CustomEvent {
    constructor(detail) {
      super("combatantPlaced", { detail });
    }
  };

  // src/events/DiceRolledEvent.ts
  var DiceRolledEvent = class extends CustomEvent {
    constructor(detail) {
      super("diceRolled", { detail });
    }
  };

  // src/events/Dispatcher.ts
  var Dispatcher = class {
    constructor(debug = false, target = new EventTarget()) {
      this.debug = debug;
      this.target = target;
    }
    fire(event) {
      if (this.debug)
        console.log("fire:", event);
      return this.target.dispatchEvent(event);
    }
    on(type, callback, options) {
      return this.target.addEventListener(
        type,
        callback,
        options
      );
    }
    off(type, callback, options) {
      return this.target.removeEventListener(
        type,
        callback,
        options
      );
    }
  };

  // src/events/GetACMethodsEvent.ts
  var GetACMethodsEvent = class extends CustomEvent {
    constructor(detail) {
      super("getACMethods", { detail });
    }
  };

  // src/events/GetActionsEvent.ts
  var GetActionsEvent = class extends CustomEvent {
    constructor(detail) {
      super("getActions", { detail });
    }
  };

  // src/events/GetDamageResponseEvent.ts
  var GetDamageResponseEvent = class extends CustomEvent {
    constructor(detail) {
      super("getDamageResponse", { detail });
    }
  };

  // src/events/TurnEndedEvent.ts
  var TurnEndedEvent = class extends CustomEvent {
    constructor(detail) {
      super("turnEnded", { detail });
    }
  };

  // src/events/TurnStartedEvent.ts
  var TurnStartedEvent = class extends CustomEvent {
    constructor(detail) {
      super("turnStarted", { detail });
    }
  };

  // src/events/YesNoChoiceEvent.ts
  var YesNoChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("yesNoChoice", { detail });
    }
  };

  // src/interruptions/YesNoChoice.ts
  var YesNoChoice = class {
    constructor(who, source, title, text, yes, no) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.yes = yes;
      this.no = no;
    }
  };

  // src/utils/map.ts
  function orderedKeys(map, comparator) {
    const entries = [];
    for (const entry of map)
      entries.push(entry);
    entries.sort(comparator);
    return entries.map(([k]) => k);
  }

  // src/utils/numbers.ts
  function modulo(value, max) {
    return value % max;
  }
  function round(n, size) {
    return Math.floor(n / size) * size;
  }
  function enumerate(min, max) {
    const values = [];
    for (let i = min; i <= max; i++)
      values.push(i);
    return values;
  }
  function ordinal(n) {
    if (n >= 11 && n <= 13)
      return `${n}th`;
    const last = n % 10;
    switch (last) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  }

  // src/Engine.ts
  var Engine = class {
    constructor(dice = new DiceBag(), events = new Dispatcher()) {
      this.dice = dice;
      this.events = events;
      this.combatants = /* @__PURE__ */ new Map();
      this.effects = /* @__PURE__ */ new Set();
      this.id = 0;
      this.initiativeOrder = [];
      this.initiativePosition = NaN;
      this.rules = new DndRules(this);
    }
    nextId() {
      return ++this.id;
    }
    place(who, x, y) {
      const position = { x, y };
      this.combatants.set(who, { position, initiative: NaN });
      this.fire(new CombatantPlacedEvent({ who, position }));
    }
    start() {
      return __async(this, null, function* () {
        for (const [c, cs] of this.combatants) {
          c.finalise();
          cs.initiative = yield this.rollInitiative(c);
        }
        this.initiativeOrder = orderedKeys(
          this.combatants,
          ([, a], [, b]) => b.initiative - a.initiative
        );
        this.nextTurn();
      });
    }
    rollDamage(count, e, critical = false) {
      return __async(this, null, function* () {
        let total = 0;
        for (let i = 0; i < count * (critical ? 2 : 1); i++) {
          const roll = yield this.roll(__spreadProps(__spreadValues({}, e), { type: "damage" }));
          total += roll.value;
        }
        return total;
      });
    }
    rollInitiative(who) {
      return __async(this, null, function* () {
        const roll = yield this.roll({ type: "initiative", who });
        return roll.value + who.dex;
      });
    }
    roll(type, diceType = "normal") {
      return __async(this, null, function* () {
        const roll = this.dice.roll(type, diceType);
        return (yield this.resolve(
          new DiceRolledEvent(__spreadProps(__spreadValues({
            type,
            diceType
          }, roll), {
            interrupt: new InterruptionCollector()
          }))
        )).detail;
      });
    }
    nextTurn() {
      if (this.activeCombatant)
        this.fire(new TurnEndedEvent({ who: this.activeCombatant }));
      this.initiativePosition = isNaN(this.initiativePosition) ? 0 : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
      const who = this.initiativeOrder[this.initiativePosition];
      this.activeCombatant = who;
      who.movedSoFar = 0;
      this.fire(new TurnStartedEvent({ who }));
    }
    move(who, dx, dy, track = true) {
      return __async(this, null, function* () {
        const state = this.combatants.get(who);
        if (!state)
          return;
        const old = state.position;
        const x = old.x + dx;
        const y = old.y + dy;
        if (track)
          who.movedSoFar += Math.max(Math.abs(dx), Math.abs(dy));
        state.position = { x, y };
        this.fire(new CombatantMovedEvent({ who, old, position: state.position }));
      });
    }
    damage(_0, _1) {
      return __async(this, arguments, function* (damage, {
        attacker,
        multiplier: baseMultiplier = 1,
        target
      }) {
        let total = 0;
        const breakdown = /* @__PURE__ */ new Map();
        for (const [damageType, raw] of damage) {
          const collector = new DamageResponseCollector();
          this.fire(
            new GetDamageResponseEvent({
              who: target,
              damageType,
              response: collector
            })
          );
          const response = collector.result;
          if (response === "immune")
            continue;
          let multiplier = baseMultiplier;
          if (response === "resist")
            multiplier *= 0.5;
          else if (response === "vulnerable")
            multiplier *= 2;
          const amount = Math.ceil(raw * multiplier);
          breakdown.set(damageType, { response, raw, amount });
          total += amount;
        }
        this.fire(
          new CombatantDamagedEvent({ who: target, attacker, total, breakdown })
        );
        target.hp -= total;
        if (target.hp <= 0) {
          if (target.diesAtZero) {
            this.combatants.delete(target);
            this.fire(new CombatantDiedEvent({ who: target, attacker }));
          } else {
          }
        }
      });
    }
    act(action, config) {
      return __async(this, null, function* () {
        yield action.apply(config);
      });
    }
    getActions(who, target) {
      return this.fire(new GetActionsEvent({ who, target, actions: [] })).detail.actions;
    }
    getAC(who) {
      return this.fire(
        new GetACMethodsEvent({ who, methods: [] })
      ).detail.methods.reduce(
        (best, method) => method.ac > best ? method.ac : best,
        0
      );
    }
    fire(e) {
      if (e.interrupt)
        throw new Error(
          `Use Engine.resolve() on an interruptible event type: ${e.type}`
        );
      this.events.fire(e);
      return e;
    }
    resolve(e) {
      return __async(this, null, function* () {
        var _a, _b;
        this.events.fire(e);
        for (const interruption of e.detail.interrupt) {
          if (interruption instanceof YesNoChoice) {
            const choice = yield new Promise(
              (resolve) => this.fire(new YesNoChoiceEvent({ interruption, resolve }))
            );
            if (choice)
              yield (_a = interruption.yes) == null ? void 0 : _a.call(interruption);
            else
              yield (_b = interruption.no) == null ? void 0 : _b.call(interruption);
          } else {
            console.error(interruption);
            throw new Error("Unknown interruption type");
          }
        }
        return e;
      });
    }
    getState(who) {
      var _a;
      return (_a = this.combatants.get(who)) != null ? _a : {
        initiative: NaN,
        position: { x: NaN, y: NaN }
      };
    }
    addEffectArea(area) {
      area.id = this.nextId();
      this.effects.add(area);
      this.fire(new AreaPlacedEvent({ area }));
    }
    removeEffectArea(area) {
      this.effects.delete(area);
      this.fire(new AreaRemovedEvent({ area }));
    }
  };

  // src/utils/dice.ts
  var dd = (count, size, damage) => ({
    type: "dice",
    amount: { count, size },
    damageType: damage
  });
  function getDefaultHPRoll(level, hitDieSize) {
    if (level === 1)
      return hitDieSize;
    return Math.ceil(getDiceAverage(1, hitDieSize));
  }

  // src/items/AbstractItem.ts
  var AbstractItem = class {
    constructor(g2, itemType, name, hands = 0) {
      this.g = g2;
      this.itemType = itemType;
      this.name = name;
      this.hands = hands;
      this.enchantments = /* @__PURE__ */ new Set();
    }
    addEnchantment(e) {
      this.enchantments.add(e);
      e.setup(this.g, this);
    }
  };

  // src/items/weapons.ts
  var AbstractWeapon = class extends AbstractItem {
    constructor(g2, name, category, rangeCategory, damage, properties = [], shortRange, longRange) {
      super(g2, "weapon", name, 1);
      this.g = g2;
      this.category = category;
      this.rangeCategory = rangeCategory;
      this.damage = damage;
      this.shortRange = shortRange;
      this.longRange = longRange;
      this.weaponType = name;
      this.properties = new Set(properties);
      this.quantity = 1;
    }
  };
  var Mace = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "mace", "simple", "melee", dd(1, 6, "bludgeoning"));
    }
  };
  var Sickle = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "sickle", "simple", "melee", dd(1, 4, "slashing"), ["light"]);
    }
  };
  var LightCrossbow = class extends AbstractWeapon {
    constructor(g2) {
      super(
        g2,
        "light crossbow",
        "simple",
        "ranged",
        dd(1, 8, "piercing"),
        ["ammunition", "loading", "two-handed"],
        80,
        320
      );
      this.ammunitionTag = "crossbow";
    }
  };
  var Dart = class extends AbstractWeapon {
    constructor(g2, quantity) {
      super(
        g2,
        "dart",
        "simple",
        "ranged",
        dd(1, 4, "piercing"),
        ["finesse", "thrown"],
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var Sling = class extends AbstractWeapon {
    constructor(g2) {
      super(
        g2,
        "sling",
        "simple",
        "ranged",
        dd(1, 4, "bludgeoning"),
        ["ammunition"],
        30,
        120
      );
      this.ammunitionTag = "sling";
    }
  };
  var Rapier = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "rapier", "martial", "melee", dd(1, 8, "piercing"), ["finesse"]);
    }
  };
  var HeavyCrossbow = class extends AbstractWeapon {
    constructor(g2) {
      super(
        g2,
        "heavy crossbow",
        "martial",
        "ranged",
        dd(1, 10, "piercing"),
        ["ammunition", "heavy", "loading", "two-handed"],
        100,
        400
      );
      this.ammunitionTag = "crossbow";
    }
  };

  // src/Monster.ts
  var Monster = class extends AbstractCombatant {
    constructor(g2, name, cr, type, size, img) {
      super(g2, name, { type, size, img, side: 1 });
      this.cr = cr;
    }
    don(item, giveProficiency = false) {
      super.don(item);
      if (giveProficiency) {
        if (item.itemType === "weapon")
          this.weaponProficiencies.add(item.weaponType);
        else if (item.itemType === "armor")
          this.armorProficiencies.add(item.category);
      }
    }
  };

  // src/monsters/Badger_token.png
  var Badger_token_default = "./Badger_token-53MEBA7R.png";

  // src/monsters/Badger.ts
  var Bite = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "bite", "natural", "melee", {
        type: "flat",
        amount: 1,
        damageType: "piercing"
      });
      this.hands = 0;
      this.forceAbilityScore = "dex";
    }
  };
  var Badger = class extends Monster {
    constructor(g2) {
      super(g2, "badger", 0, "beast", "tiny", Badger_token_default);
      this.hp = this.hpMax = 3;
      this.movement.set("speed", 20);
      this.movement.set("burrow", 5);
      this.setAbilityScores(4, 11, 12, 2, 12, 5);
      this.senses.set("darkvision", 30);
      this.pb = 2;
      this.naturalWeapons.add(new Bite(g2));
    }
  };

  // src/items/ammunition.ts
  var AbstractAmmo = class extends AbstractItem {
    constructor(g2, name, ammunitionTag, quantity) {
      super(g2, "ammo", name);
      this.ammunitionTag = ammunitionTag;
      this.quantity = quantity;
    }
  };
  var CrossbowBolt = class extends AbstractAmmo {
    constructor(g2, quantity) {
      super(g2, "crossbow bolt", "crossbow", quantity);
    }
  };
  var SlingBullet = class extends AbstractAmmo {
    constructor(g2, quantity) {
      super(g2, "sling bullet", "sling", quantity);
    }
  };

  // src/items/armor.ts
  var AbstractArmor = class extends AbstractItem {
    constructor(g2, name, category, ac, stealthDisadvantage = false, minimumStrength = 0) {
      super(g2, "armor", name);
      this.category = category;
      this.ac = ac;
      this.stealthDisadvantage = stealthDisadvantage;
      this.minimumStrength = minimumStrength;
    }
  };
  var LeatherArmor = class extends AbstractArmor {
    constructor(g2) {
      super(g2, "leather armor", "light", 11);
    }
  };

  // src/monsters/Thug_token.png
  var Thug_token_default = "./Thug_token-IXRM6PKF.png";

  // src/monsters/Thug.ts
  var Thug = class extends Monster {
    constructor(g2) {
      super(g2, "thug", 0.5, "humanoid", "medium", Thug_token_default);
      this.don(new LeatherArmor(g2), true);
      this.hp = this.hpMax = 32;
      this.movement.set("speed", 30);
      this.setAbilityScores(15, 11, 14, 10, 10, 11);
      this.skills.set("Intimidation", 1);
      this.languages.add("Common");
      this.pb = 2;
      this.don(new Mace(g2), true);
      this.don(new HeavyCrossbow(g2), true);
      this.inventory.add(new CrossbowBolt(g2, Infinity));
    }
  };

  // src/features/SimpleFeature.ts
  var SimpleFeature = class {
    constructor(name, text, setup) {
      this.name = name;
      this.text = text;
      this.setup = setup;
    }
  };

  // src/features/common.ts
  function darkvisionFeature(range = 60) {
    return new SimpleFeature(
      "Darkvision",
      `You can see in dim light within ${range} feet of you as if it were bright light and in darkness as if it were dim light. You can\u2019t discern color in darkness, only shades of gray.`,
      (_2, me) => {
        me.senses.set("darkvision", range);
      }
    );
  }
  function nonCombatFeature(name, text) {
    return new SimpleFeature(name, text, () => {
    });
  }
  function notImplementedFeature(name, text) {
    return new SimpleFeature(name, text, (_2, me) => {
      console.warn(`[Feature Missing] ${name} (on ${me.name})`);
    });
  }

  // src/features/ConfiguredFeature.ts
  var ConfiguredFeature = class {
    constructor(name, text, apply) {
      this.name = name;
      this.text = text;
      this.apply = apply;
    }
    setup(g2, who) {
      const config = who.getConfig(this.name);
      if (typeof config === "undefined") {
        console.warn(`${who.name} has no config for ${this.name}`);
        return;
      }
      this.apply(g2, who, config);
    }
  };

  // src/classes/common.ts
  function asiSetup(g2, me, config) {
    if (config.type === "ability")
      for (const ability of config.abilities)
        me[`${ability}Score`]++;
    else
      me.addFeature(config.feat);
  }
  function makeASI(className, level) {
    return new ConfiguredFeature(
      `Ability Score Improvement (${className} ${level})`,
      `When you reach ${ordinal(
        level
      )} level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature.

If your DM allows the use of feats, you may instead take a feat.`,
      asiSetup
    );
  }

  // src/resources.ts
  var LongRestResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      this.refresh = "longRest";
    }
  };
  var TurnResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      this.refresh = "turnStart";
    }
  };

  // src/classes/rogue/SneakAttack.ts
  function getSneakAttackDice(level) {
    return Math.ceil(level / 2);
  }
  function getFlanker(g2, target) {
    for (const flanker of g2.combatants.keys()) {
      if (flanker.side === target.side)
        continue;
      if (flanker.conditions.has("Incapacitated"))
        continue;
      if (distance(g2, flanker, target) > 5)
        continue;
      return flanker;
    }
  }
  var SneakAttackResource = new TurnResource("Sneak Attack", 1);
  var SneakAttack = new SimpleFeature(
    "Sneak Attack",
    `Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.

You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.

The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.`,
    (g2, me) => {
      var _a;
      const count = getSneakAttackDice((_a = me.classLevels.get("Rogue")) != null ? _a : 1);
      me.addResource(SneakAttackResource);
      g2.events.on(
        "gatherDamage",
        ({
          detail: {
            ability,
            attack,
            attacker,
            critical,
            interrupt,
            map,
            target,
            weapon
          }
        }) => {
          if (attacker === me && me.hasResource(SneakAttackResource) && attack && weapon) {
            const isFinesseOrRangedWeapon = weapon.properties.has("finesse") || weapon.rangeCategory === "ranged";
            const hasAdvantage = attack.roll.diceType === "advantage";
            const didNotHaveDisadvantage = attack.pre.diceType.disadvantage.size === 0;
            if (isFinesseOrRangedWeapon && (hasAdvantage || getFlanker(g2, target) && didNotHaveDisadvantage)) {
              interrupt.add(
                new YesNoChoice(
                  attacker,
                  SneakAttack,
                  "Sneak Attack",
                  `Do ${count * (critical ? 2 : 1)}d6 bonus damage on this hit?`,
                  () => __async(void 0, null, function* () {
                    me.spendResource(SneakAttackResource);
                    const damageType = weapon.damage.damageType;
                    const damage = yield g2.rollDamage(
                      count,
                      { attacker, target, size: 6, damageType, weapon, ability },
                      critical
                    );
                    map.add(damageType, damage);
                  })
                )
              );
            }
          }
        }
      );
    }
  );
  var SneakAttack_default = SneakAttack;

  // src/BaseEffect.ts
  var BaseEffect = class {
    constructor(name, durationTimer) {
      this.name = name;
      this.durationTimer = durationTimer;
    }
  };

  // src/classes/rogue/SteadyAim.ts
  var SteadyAimNoMoveEffect = new BaseEffect("Steady Aim (No Move)", "turnEnd");
  var SteadyAimAdvantageEffect = new BaseEffect(
    "Steady Aim (Advantage)",
    "turnEnd"
  );
  var SteadyAimAction = class {
    constructor(g2, actor) {
      this.g = g2;
      this.actor = actor;
      this.config = {};
      this.name = "Steady Aim";
      this.time = "bonus action";
    }
    getAffectedArea() {
      return void 0;
    }
    check(config, ec = new ErrorCollector()) {
      if (!this.actor.time.has("bonus action"))
        ec.add("No bonus action left", this);
      if (this.actor.movedSoFar)
        ec.add("Already moved this turn", this);
      return ec;
    }
    apply() {
      return __async(this, null, function* () {
        this.actor.time.delete("bonus action");
        this.actor.addEffect(SteadyAimNoMoveEffect, 1);
        this.actor.addEffect(SteadyAimAdvantageEffect, 1);
      });
    }
  };
  var SteadyAim = new SimpleFeature(
    "Steady Aim",
    `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`,
    (g2, me) => {
      g2.events.on("getActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SteadyAimAction(g2, me));
      });
      g2.events.on("getSpeed", ({ detail: { who, multiplier } }) => {
        if (who.hasEffect(SteadyAimNoMoveEffect))
          multiplier.add(0, SteadyAimNoMoveEffect);
      });
      g2.events.on("beforeAttack", ({ detail: { attacker, diceType } }) => {
        if (attacker.hasEffect(SteadyAimAdvantageEffect))
          diceType.add("advantage", SteadyAimAdvantageEffect);
      });
      g2.events.on("attack", ({ detail: { pre } }) => {
        if (pre.diceType.involved(SteadyAimAdvantageEffect))
          pre.attacker.removeEffect(SteadyAimAdvantageEffect);
      });
    }
  );
  var SteadyAim_default = SteadyAim;

  // src/classes/rogue/index.ts
  var Expertise = new ConfiguredFeature(
    "Expertise",
    `At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\u2019 tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.

  At 6th level, you can choose two more of your proficiencies (in skills or with thieves\u2019 tools) to gain this benefit.`,
    (g2, me, config) => {
      for (const entry of config) {
        if (entry === "thieves' tools") {
        } else {
          if (me.skills.has(entry))
            me.skills.set(entry, 2);
          else
            console.warn(`Expertise in ${entry} without existing proficiency`);
        }
      }
    }
  );
  var ThievesCant = nonCombatFeature(
    "Thieves' Cant",
    `During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.

In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.`
  );
  var CunningAction = notImplementedFeature(
    "Cunning Action",
    `Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.`
  );
  var UncannyDodge = new SimpleFeature(
    "Uncanny Dodge",
    `Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
    (g2, me) => {
      g2.events.on(
        "gatherDamage",
        ({ detail: { target, attack, interrupt, multiplier } }) => {
          if (attack && target === me && me.time.has("reaction"))
            interrupt.add(
              new YesNoChoice(
                me,
                UncannyDodge,
                "Uncanny Dodge",
                `Use Uncanny Dodge to halve the incoming damage on ${me.name}?`,
                () => __async(void 0, null, function* () {
                  me.time.delete("reaction");
                  multiplier.add(0.5, UncannyDodge);
                })
              )
            );
        }
      );
    }
  );
  var Evasion = notImplementedFeature(
    "Evasion",
    `Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`
  );
  var ReliableTalent = notImplementedFeature(
    "Reliable Talent",
    `By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.`
  );
  var Blindsense = notImplementedFeature(
    "Blindsense",
    `Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.`
  );
  var SlipperyMind = new SimpleFeature(
    "Slippery Mind",
    `By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.`,
    (g2, me) => me.saveProficiencies.add("wis")
  );
  var Elusive = notImplementedFeature(
    "Elusive",
    `Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren't incapacitated.`
  );
  var StrokeOfLuck = notImplementedFeature(
    "Stroke of Luck",
    `At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.

Once you use this feature, you can't use it again until you finish a short or long rest.`
  );
  var ASI4 = makeASI("Rogue", 4);
  var ASI8 = makeASI("Rogue", 8);
  var ASI10 = makeASI("Rogue", 10);
  var ASI12 = makeASI("Rogue", 12);
  var ASI16 = makeASI("Rogue", 16);
  var ASI19 = makeASI("Rogue", 19);
  var Rogue = {
    name: "Rogue",
    hitDieSize: 8,
    armorProficiencies: /* @__PURE__ */ new Set(["light"]),
    weaponCategoryProficiencies: /* @__PURE__ */ new Set(["simple"]),
    weaponProficiencies: /* @__PURE__ */ new Set([
      "hand crossbow",
      "longsword",
      "rapier",
      "shortsword"
    ]),
    toolProficiencies: /* @__PURE__ */ new Set(["thieves' tools"]),
    saveProficiencies: /* @__PURE__ */ new Set(["dex", "int"]),
    skillChoices: 4,
    skillProficiencies: /* @__PURE__ */ new Set([
      "Acrobatics",
      "Athletics",
      "Deception",
      "Insight",
      "Intimidation",
      "Investigation",
      "Perception",
      "Performance",
      "Persuasion",
      "Sleight of Hand",
      "Stealth"
    ]),
    features: /* @__PURE__ */ new Map([
      [1, [Expertise, SneakAttack_default, ThievesCant]],
      [2, [CunningAction]],
      [3, [SteadyAim_default]],
      [4, [ASI4]],
      [5, [UncannyDodge]],
      [7, [Evasion]],
      [8, [ASI8]],
      [10, [ASI10]],
      [11, [ReliableTalent]],
      [12, [ASI12]],
      [14, [Blindsense]],
      [15, [SlipperyMind]],
      [16, [ASI16]],
      [18, [Elusive]],
      [19, [ASI19]],
      [20, [StrokeOfLuck]]
    ])
  };
  var rogue_default = Rogue;

  // src/classes/rogue/Scout/index.ts
  var Skirmisher = notImplementedFeature(
    "Skirmisher",
    `Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.`
  );
  var Survivalist = new SimpleFeature(
    "Survivalist",
    `When you choose this archetype at 3rd level, you gain proficiency in the Nature and Survival skills if you don't already have it. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.`,
    (g2, me) => {
      me.skills.set("Nature", 2);
      me.skills.set("Survival", 2);
    }
  );
  var SuperiorMobility = notImplementedFeature(
    "Superior Mobility",
    `At 9th level, your walking speed increases by 10 feet. If you have a climbing or swimming speed, this increase applies to that speed as well.`
  );
  var AmbushMaster = notImplementedFeature(
    "Ambush Master",
    `Starting at 13th level, you excel at leading ambushes and acting first in a fight.

You have advantage on initiative rolls. In addition, the first creature you hit during the first round of a combat becomes easier for you and others to strike; attack rolls against that target have advantage until the start of your next turn.`
  );
  var SuddenStrike = notImplementedFeature(
    "Sudden Strike",
    `Starting at 17th level, you can strike with deadly speed. If you take the Attack action on your turn, you can make one additional attack as a bonus action. This attack can benefit from your Sneak Attack even if you have already used it this turn, but you can't use your Sneak Attack against the same target more than once in a turn.`
  );
  var Scout = {
    name: "Scout",
    className: "Rogue",
    features: /* @__PURE__ */ new Map([
      [3, [Skirmisher, Survivalist]],
      [9, [SuperiorMobility]],
      [13, [AmbushMaster]],
      [17, [SuddenStrike]]
    ])
  };
  var Scout_default = Scout;

  // src/enchantments/plus.ts
  var plus1 = {
    name: "+1 bonus",
    setup(g2, item) {
      item.name += " +1";
      g2.events.on("beforeAttack", ({ detail: { weapon, ammo, bonus } }) => {
        if (weapon === item || ammo === item)
          bonus.add(1, this);
      });
      g2.events.on("gatherDamage", ({ detail: { weapon, ammo, bonus } }) => {
        if (weapon === item || ammo === item)
          bonus.add(1, this);
      });
    }
  };

  // src/enchantments/weapon.ts
  var vicious = {
    name: "vicious",
    setup(g2, item) {
      item.name = "vicious " + item.name;
      g2.events.on("gatherDamage", ({ detail: { weapon, bonus, attack } }) => {
        if (weapon === item && (attack == null ? void 0 : attack.roll.value) === 20)
          bonus.add(7, vicious);
      });
    }
  };

  // src/feats/Lucky.ts
  var LuckPoint = new LongRestResource("Luck Point", 3);
  function addLuckyOpportunity(g2, who, message, interrupt, callback) {
    interrupt.add(
      new YesNoChoice(who, Lucky, "Lucky", message, () => __async(this, null, function* () {
        who.spendResource(LuckPoint);
        const nr = yield g2.roll({ type: "luck", who });
        callback(nr.value);
      }))
    );
  }
  var Lucky = new SimpleFeature(
    "Lucky",
    `You have inexplicable luck that seems to kick in at just the right moment.

- You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.
- You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.
- You regain your expended luck points when you finish a long rest.`,
    (g2, me) => {
      me.addResource(LuckPoint);
      g2.events.on("diceRolled", ({ detail }) => {
        const { type, interrupt, value } = detail;
        if ((type.type === "attack" || type.type === "check" || type.type === "save") && type.who === me && me.hasResource(LuckPoint))
          addLuckyOpportunity(
            g2,
            me,
            `${me.name} got ${value} on a ${type.type} roll. Use a Luck point to re-roll?`,
            interrupt,
            (roll) => {
              if (roll > value) {
                detail.otherValues.add(value);
                detail.value = roll;
              } else
                detail.otherValues.add(roll);
            }
          );
        if (type.type === "attack" && type.target === me && me.hasResource(LuckPoint))
          addLuckyOpportunity(
            g2,
            me,
            `${type.who.name} got ${value} on an attack roll against ${me.name}. Use a Luck point to re-roll?`,
            interrupt,
            (roll) => {
              if (roll < value) {
                detail.otherValues.add(value);
                detail.value = roll;
              } else
                detail.otherValues.add(roll);
            }
          );
      });
    }
  );
  var Lucky_default = Lucky;

  // src/items/wondrous.ts
  var AbstractWondrous = class extends AbstractItem {
    constructor(g2, name, hands = 0) {
      super(g2, "wondrous", name);
      this.hands = hands;
    }
  };
  var BracersOfTheArbalest = class extends AbstractWondrous {
    constructor(g2) {
      super(g2, "Bracers of the Arbalest");
      g2.events.on("gatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
        if (attacker.equipment.has(this) && attacker.attunements.has(this) && (weapon == null ? void 0 : weapon.ammunitionTag) === "crossbow")
          bonus.add(2, this);
      });
    }
  };

  // src/PC.ts
  var UnarmedStrike = class extends AbstractWeapon {
    constructor(g2, owner) {
      super(g2, "unarmed strike", "natural", "melee", {
        type: "flat",
        amount: 1,
        damageType: "bludgeoning"
      });
      this.owner = owner;
    }
  };
  var PC = class extends AbstractCombatant {
    constructor(g2, name, img) {
      super(g2, name, {
        type: "humanoid",
        size: "medium",
        img,
        side: 0,
        diesAtZero: false,
        level: 0
      });
      this.subclasses = /* @__PURE__ */ new Map();
      this.naturalWeapons.add(new UnarmedStrike(g2, this));
    }
    setRace(race) {
      var _a, _b, _c;
      if (race.parent)
        this.setRace(race.parent);
      this.race = race;
      this.size = race.size;
      for (const [key, val] of race.abilities)
        this[`${key}Score`] += val;
      for (const [type, value] of (_a = race == null ? void 0 : race.movement) != null ? _a : [])
        this.movement.set(type, value);
      for (const language of (_b = race == null ? void 0 : race.languages) != null ? _b : [])
        this.languages.add(language);
      for (const feature of (_c = race == null ? void 0 : race.features) != null ? _c : [])
        this.addFeature(feature);
    }
    addClassLevel(cls, hpRoll) {
      var _a, _b, _c, _d, _e, _f, _g;
      const level = ((_a = this.classLevels.get(cls.name)) != null ? _a : 0) + 1;
      this.classLevels.set(cls.name, level);
      this.level++;
      this.pb = getProficiencyBonusByLevel(this.level);
      this.hpMax += (hpRoll != null ? hpRoll : getDefaultHPRoll(this.level, cls.hitDieSize)) + this.con;
      if (level === 1) {
        for (const prof of (_b = cls == null ? void 0 : cls.armorProficiencies) != null ? _b : [])
          this.armorProficiencies.add(prof);
        for (const prof of (_c = cls == null ? void 0 : cls.saveProficiencies) != null ? _c : [])
          this.saveProficiencies.add(prof);
        for (const prof of (_d = cls == null ? void 0 : cls.weaponCategoryProficiencies) != null ? _d : [])
          this.weaponCategoryProficiencies.add(prof);
        for (const prof of (_e = cls == null ? void 0 : cls.weaponProficiencies) != null ? _e : [])
          this.weaponProficiencies.add(prof);
      }
      for (const feature of (_f = cls.features.get(level)) != null ? _f : [])
        this.addFeature(feature);
      const sub = this.subclasses.get(cls.name);
      for (const feature of (_g = sub == null ? void 0 : sub.features.get(level)) != null ? _g : [])
        this.addFeature(feature);
    }
    addSubclass(sub) {
      this.subclasses.set(sub.className, sub);
    }
  };

  // src/events/SpellCastEvent.ts
  var SpellCastEvent = class extends CustomEvent {
    constructor(detail) {
      super("spellCast", { detail });
    }
  };

  // src/actions/CastSpell.ts
  var CastSpell = class {
    constructor(g2, actor, method, spell) {
      this.g = g2;
      this.actor = actor;
      this.method = method;
      this.spell = spell;
      this.name = `${spell.name} (${method.name})`;
      this.config = spell.config;
      this.time = spell.time;
    }
    getAffectedArea(config) {
      return this.spell.getAffectedArea(config);
    }
    check(config, ec = new ErrorCollector()) {
      if (!this.actor.time.has(this.spell.time))
        ec.add(`No ${this.spell.time} left`, this);
      const resource = this.method.getResourceForSpell(this.spell);
      if (resource && !this.actor.hasResource(resource))
        ec.add(`No ${resource.name} left`, this.method);
      return this.spell.check(config, ec);
    }
    apply(config) {
      return __async(this, null, function* () {
        this.actor.time.delete(this.spell.time);
        const resource = this.method.getResourceForSpell(this.spell);
        if (resource)
          this.actor.spendResource(resource, 1);
        const sc = this.g.fire(
          new SpellCastEvent({
            who: this.actor,
            spell: this.spell,
            method: this.method,
            level: this.spell.getLevel(config)
          })
        );
        if (sc.defaultPrevented)
          return;
        return this.spell.apply(this.actor, this.method, config);
      });
    }
  };

  // src/spells/InnateSpellcasting.ts
  var InnateSpellcasting = class {
    constructor(name, ability, getResourceForSpell) {
      this.name = name;
      this.ability = ability;
      this.getResourceForSpell = getResourceForSpell;
    }
    getMaxSlot(spell) {
      return spell.level;
    }
  };

  // src/spells/SimpleSpell.ts
  var SimpleSpell = class {
    constructor(name, level, school, time, concentration, config) {
      this.name = name;
      this.level = level;
      this.school = school;
      this.time = time;
      this.concentration = concentration;
      this.config = config;
      this.v = false;
      this.s = false;
    }
    setVSM(v = false, s = false, m) {
      this.v = v;
      this.s = s;
      this.m = m;
      return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAffectedArea(_config) {
      return void 0;
    }
    check(config, ec = new ErrorCollector()) {
      return ec;
    }
    getLevel() {
      return this.level;
    }
  };

  // src/spells/level2/Levitate.ts
  var Levitate = class extends SimpleSpell {
    constructor(g2) {
      super("Levitate", 2, "Transmutation", "action", true, {
        target: new TargetResolver(g2, 60, true)
      });
      this.g = g2;
      this.setVSM(
        true,
        true,
        "either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end"
      );
    }
    apply(_0, _1, _2) {
      return __async(this, arguments, function* (caster, method, { target }) {
      });
    }
  };

  // src/races/Genasi_EEPC.ts
  var Genasi = {
    name: "Genasi",
    size: "medium",
    abilities: /* @__PURE__ */ new Map([["con", 2]]),
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    languages: /* @__PURE__ */ new Set(["Common", "Primordial"])
  };
  var UnendingBreath = notImplementedFeature(
    "Unending Breath",
    `You can hold your breath indefinitely while you\u2019re not incapacitated.`
  );
  var MingleWithTheWindResource = new LongRestResource(
    "Mingle with the Wind",
    1
  );
  var MingleWithTheWindMethod = new InnateSpellcasting(
    "Mingle with the Wind",
    "con",
    () => MingleWithTheWindResource
  );
  var MingleWithTheWind = new SimpleFeature(
    "Mingle with the Wind",
    `You can cast the levitate spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell.`,
    (g2, me) => {
      me.addResource(MingleWithTheWindResource);
      g2.events.on("getActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new CastSpell(g2, me, MingleWithTheWindMethod, new Levitate(g2))
          );
      });
    }
  );
  var AirGenasi = {
    parent: Genasi,
    name: "Air Genasi",
    size: "medium",
    abilities: /* @__PURE__ */ new Map([["dex", 1]]),
    features: /* @__PURE__ */ new Set([UnendingBreath, MingleWithTheWind])
  };

  // src/pcs/davies/Aura_token.png
  var Aura_token_default = "./Aura_token-PXXTYCUY.png";

  // src/pcs/davies/Aura.ts
  var Aura = class extends PC {
    constructor(g2) {
      super(g2, "Aura", Aura_token_default);
      this.setAbilityScores(8, 15, 11, 14, 9, 14);
      this.setRace(AirGenasi);
      this.addSubclass(Scout_default);
      this.addClassLevel(rogue_default);
      this.addClassLevel(rogue_default);
      this.addClassLevel(rogue_default);
      this.addClassLevel(rogue_default);
      this.addClassLevel(rogue_default);
      this.addClassLevel(rogue_default);
      this.addClassLevel(rogue_default);
      this.setConfig(Expertise, [
        "Acrobatics",
        "thieves' tools",
        "Stealth",
        "Investigation"
      ]);
      this.setConfig(ASI4, { type: "feat", feat: Lucky_default });
      this.skills.set("Acrobatics", 1);
      this.skills.set("Athletics", 1);
      this.skills.set("Deception", 1);
      this.skills.set("Investigation", 1);
      this.skills.set("Medicine", 1);
      this.skills.set("Stealth", 1);
      this.don(enchant(new LightCrossbow(g2), vicious));
      this.don(new LeatherArmor(g2));
      this.don(new BracersOfTheArbalest(g2), true);
      this.don(new Rapier(g2));
      this.inventory.add(new CrossbowBolt(g2, 20));
      this.inventory.add(enchant(new CrossbowBolt(g2, 15), plus1));
    }
  };

  // src/classes/monk/index.ts
  var UnarmoredDefense = new SimpleFeature(
    "Unarmored Defense",
    `Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.`,
    (g2, me) => {
      g2.events.on("getACMethods", ({ detail: { who, methods } }) => {
        if (who === me && !me.armor && !me.shield)
          methods.push({
            name: "Unarmored Defense",
            ac: 10 + me.dex + me.wis,
            uses: /* @__PURE__ */ new Set()
          });
      });
    }
  );
  function getMartialArtsDie(level) {
    if (level < 5)
      return 4;
    if (level < 11)
      return 6;
    if (level < 17)
      return 8;
    return 10;
  }
  function isMonkWeapon(weapon) {
    if (weapon.weaponType === "unarmed strike")
      return true;
    if (weapon.weaponType === "shortsword")
      return true;
    return weapon.category === "simple" && weapon.rangeCategory === "melee" && !weapon.properties.has("two-handed") && !weapon.properties.has("heavy");
  }
  function isMonkWeaponAttack(action) {
    return action instanceof WeaponAttack && isMonkWeapon(action.weapon);
  }
  function canUpgradeDamage(damage, size) {
    const avg = getDiceAverage(1, size);
    if (damage.type === "flat")
      return avg > damage.amount;
    return size > getDiceAverage(damage.amount.count, damage.amount.size);
  }
  var MonkWeaponWrapper = class extends AbstractWeapon {
    constructor(g2, weapon, size) {
      super(
        g2,
        weapon.name,
        weapon.category,
        weapon.rangeCategory,
        dd(1, size, weapon.damage.damageType),
        [...weapon.properties],
        weapon.shortRange,
        weapon.longRange
      );
      this.weapon = weapon;
    }
  };
  var MartialArts = new SimpleFeature(
    "Martial Arts",
    `Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don't have the two-handed or heavy property.

You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield.

- You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
- You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.
- When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn.

Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama).`,
    (g2, me) => {
      var _a;
      console.warn(`[Feature Not Complete] Martial Arts (on ${me.name})`);
      const diceSize = getMartialArtsDie((_a = me.classLevels.get("Monk")) != null ? _a : 0);
      g2.events.on("getActions", ({ detail: { who, actions } }) => {
        if (who !== me)
          return;
        for (const wa of actions.filter(isMonkWeaponAttack)) {
          if (me.dex > me.str)
            wa.ability = "dex";
          if (canUpgradeDamage(wa.weapon.damage, diceSize))
            wa.weapon = new MonkWeaponWrapper(g2, wa.weapon, diceSize);
        }
      });
    }
  );
  var Monk = {
    name: "Monk",
    hitDieSize: 8,
    weaponCategoryProficiencies: /* @__PURE__ */ new Set(["simple"]),
    weaponProficiencies: /* @__PURE__ */ new Set(["shortsword"]),
    saveProficiencies: /* @__PURE__ */ new Set(["str", "dex"]),
    skillChoices: 2,
    skillProficiencies: /* @__PURE__ */ new Set([
      "Acrobatics",
      "Athletics",
      "History",
      "Insight",
      "Religion",
      "Stealth"
    ]),
    features: /* @__PURE__ */ new Map([[1, [UnarmoredDefense, MartialArts]]])
  };
  var monk_default = Monk;

  // src/areas/SphereEffectArea.ts
  var SphereEffectArea = class {
    constructor(name, centre, radius, tags = []) {
      this.name = name;
      this.centre = centre;
      this.radius = radius;
      this.id = NaN;
      this.tags = new Set(tags);
      this.type = "sphere";
    }
  };

  // src/resolvers/PointResolver.ts
  function isPoint(value) {
    return typeof value === "object" && typeof value.x === "number" && typeof value.y === "number";
  }
  var PointResolver = class {
    constructor(g2, maxRange) {
      this.g = g2;
      this.maxRange = maxRange;
      this.type = "Point";
    }
    get name() {
      if (this.maxRange === Infinity)
        return "any point";
      return `point within ${this.maxRange}'`;
    }
    check(value, action, ec = new ErrorCollector()) {
      if (!isPoint(value))
        ec.add("No target", this);
      else {
        if (distanceTo(this.g, action.actor, value) > this.maxRange)
          ec.add("Out of range", this);
      }
      return ec;
    }
  };

  // src/utils/time.ts
  var TURNS_PER_MINUTE = 10;
  var minutes = (n) => n * TURNS_PER_MINUTE;
  var hours = (n) => minutes(n * 60);

  // src/resolvers/SlotResolver.ts
  var SlotResolver = class {
    constructor(spell) {
      this.spell = spell;
      this.type = "SpellSlot";
    }
    get minimum() {
      return this.spell.level;
    }
    get maximum() {
      var _a, _b;
      return (_b = (_a = this.method) == null ? void 0 : _a.getMaxSlot(this.spell)) != null ? _b : 9;
    }
    get name() {
      if (this.minimum === this.maximum)
        return `spell slot (${this.minimum})`;
      return `spell slot (${this.minimum}-${this.maximum})`;
    }
    check(value, action, ec = new ErrorCollector()) {
      if (action instanceof CastSpell)
        this.method = action.method;
      if (typeof value !== "number")
        ec.add("No spell level chosen", this);
      else {
        if (value < this.minimum)
          ec.add("Too low", this);
        if (value > this.maximum)
          ec.add("Too high", this);
      }
      return ec;
    }
  };

  // src/spells/ScalingSpell.ts
  var ScalingSpell = class {
    constructor(name, level, school, time, concentration, config) {
      this.name = name;
      this.level = level;
      this.school = school;
      this.time = time;
      this.concentration = concentration;
      this.v = false;
      this.s = false;
      this.config = __spreadProps(__spreadValues({}, config), { slot: new SlotResolver(this) });
    }
    setVSM(v = false, s = false, m) {
      this.v = v;
      this.s = s;
      this.m = m;
      return this;
    }
    getAffectedArea(_config) {
      return void 0;
    }
    check(config, ec = new ErrorCollector()) {
      return ec;
    }
    getLevel({ slot }) {
      return slot;
    }
  };

  // src/spells/level1/FogCloud.ts
  var FogCloud = class extends ScalingSpell {
    constructor(g2) {
      super("Fog Cloud", 1, "Conjuration", "action", true, {
        point: new PointResolver(g2, 120)
      });
      this.g = g2;
      this.setVSM(true, true);
    }
    getAffectedArea({ point, slot }) {
      if (!point)
        return;
      return { type: "sphere", radius: 20 * (slot != null ? slot : 1), centre: point };
    }
    apply(_0, _1, _2) {
      return __async(this, arguments, function* (caster, method, { point, slot }) {
        const radius = 20 * slot;
        const area = new SphereEffectArea("Fog Cloud", point, radius, [
          "heavily obscured"
        ]);
        yield this.g.addEffectArea(area);
        caster.concentrateOn({
          spell: this,
          duration: hours(1),
          onSpellEnd: () => __async(this, null, function* () {
            return this.g.removeEffectArea(area);
          })
        });
      });
    }
  };

  // src/spells/level2/GustOfWind.ts
  var GustOfWind = class extends SimpleSpell {
    constructor(g2) {
      super("Gust of Wind", 2, "Evocation", "action", true, {
        point: new PointResolver(g2, 60)
      });
      this.g = g2;
      this.setVSM(true, true, "a legume seed");
    }
    apply(_0, _1, _2) {
      return __async(this, arguments, function* (caster, method, { point }) {
      });
    }
  };

  // src/resolvers/TextChoiceResolver.ts
  var TextChoiceResolver = class {
    constructor(g2, choices) {
      this.g = g2;
      this.type = "Text";
      this.values = new Set(choices);
    }
    get name() {
      return `One of: ${[...this.values].join(", ")}`;
    }
    check(value, action, ec = new ErrorCollector()) {
      if (!value)
        ec.add("No choice made", this);
      else if (!this.values.has(value))
        ec.add("Invalid choice", this);
      return ec;
    }
  };

  // src/spells/level3/WallOfWater.ts
  var WallOfWater = class extends SimpleSpell {
    constructor(g2) {
      super("Wall of Water", 3, "Evocation", "action", true, {
        point: new PointResolver(g2, 60),
        shape: new TextChoiceResolver(g2, ["line", "ring"])
      });
      this.g = g2;
    }
    apply(_0, _1, _2) {
      return __async(this, arguments, function* (caster, method, { point, shape }) {
      });
    }
  };

  // src/races/Triton.ts
  var Amphibious = notImplementedFeature(
    "Amphibious",
    `You can breathe air and water.`
  );
  var FogCloudResource = new LongRestResource(
    "Control Air and Water: Fog Cloud",
    1
  );
  var GustOfWindResource = new LongRestResource(
    "Control Air and Water: Gust of Wind",
    1
  );
  var WallOfWaterResource = new LongRestResource(
    "Control Air and Water: Wall of Water",
    1
  );
  var ControlAirAndWaterSpells = [
    { level: 1, spell: FogCloud, resource: FogCloudResource },
    { level: 3, spell: GustOfWind, resource: GustOfWindResource },
    { level: 5, spell: WallOfWater, resource: WallOfWaterResource }
  ];
  var ControlAirAndWaterMethod = new InnateSpellcasting(
    "Control Air and Water",
    "cha",
    (spell) => {
      if (spell instanceof FogCloud)
        return FogCloudResource;
      if (spell instanceof GustOfWind)
        return GustOfWindResource;
      if (spell instanceof WallOfWater)
        return WallOfWaterResource;
    }
  );
  var ControlAirAndWater = new SimpleFeature(
    "Control Air and Water",
    `You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can\u2019t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.`,
    (g2, me) => {
      const spells = ControlAirAndWaterSpells.filter(
        (entry) => entry.level <= me.level
      );
      for (const { resource } of spells)
        me.addResource(resource);
      g2.events.on("getActions", ({ detail: { who, actions } }) => {
        if (who === me)
          for (const { spell } of spells)
            actions.push(
              new CastSpell(g2, me, ControlAirAndWaterMethod, new spell(g2))
            );
      });
    }
  );
  var Darkvision = darkvisionFeature();
  var EmissaryOfTheSea = nonCombatFeature(
    "Emissary of the Sea",
    `Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.`
  );
  var GuardiansOfTheDepths = new SimpleFeature(
    "Guardians of the Depths",
    `Adapted to even the most extreme ocean depths, you have resistance to cold damage.`,
    (g2, me) => {
      g2.events.on(
        "getDamageResponse",
        ({ detail: { who, damageType, response: result } }) => {
          if (who === me && damageType === "cold")
            result.add("resist", GuardiansOfTheDepths);
        }
      );
    }
  );
  var Triton = {
    name: "Triton",
    size: "medium",
    abilities: /* @__PURE__ */ new Map([
      ["str", 1],
      ["con", 1],
      ["cha", 1]
    ]),
    movement: /* @__PURE__ */ new Map([
      ["speed", 30],
      ["swim", 30]
    ]),
    languages: /* @__PURE__ */ new Set(["Common", "Primordial"]),
    features: /* @__PURE__ */ new Set([
      Amphibious,
      ControlAirAndWater,
      Darkvision,
      EmissaryOfTheSea,
      GuardiansOfTheDepths
    ])
  };
  var Triton_default = Triton;

  // src/pcs/wizards/Tethilssethanar_token.png
  var Tethilssethanar_token_default = "./Tethilssethanar_token-7GNDRUAR.png";

  // src/pcs/wizards/Tethilssethanar.ts
  var Tethilssethanar = class extends PC {
    constructor(g2) {
      super(g2, "Tethilssethanar", Tethilssethanar_token_default);
      this.setAbilityScores(9, 14, 13, 8, 15, 13);
      this.setRace(Triton_default);
      this.addClassLevel(monk_default);
      this.skills.set("Athletics", 1);
      this.skills.set("Insight", 1);
      this.don(new Dart(g2, 10));
      this.don(new Sickle(g2));
      this.inventory.add(new Sling(g2));
      this.inventory.add(new SlingBullet(g2, 40));
    }
  };

  // src/ui/App.tsx
  var import_hooks10 = __toESM(require_hooks());

  // src/utils/config.ts
  function check(action, config) {
    const ec = new ErrorCollector();
    action.check(config, ec);
    for (const [key, resolver] of Object.entries(action.config)) {
      const value = config[key];
      resolver.check(value, action, ec);
    }
    return ec;
  }
  function checkConfig(action, config) {
    return check(action, config).valid;
  }

  // src/ui/ActiveUnitPanel.module.scss
  var ActiveUnitPanel_module_default = {
    "main": "_main_1g77q_1"
  };

  // src/ui/Labelled.tsx
  var import_hooks = __toESM(require_hooks());

  // src/ui/Labelled.module.scss
  var Labelled_module_default = {
    "label": "_label_29yx4_1"
  };

  // node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
  var import_preact = __toESM(require_preact());
  var import_preact2 = __toESM(require_preact());
  var _ = 0;
  function o(o2, e, n, t, f, l) {
    var s, u, a = {};
    for (u in e)
      "ref" == u ? s = e[u] : a[u] = e[u];
    var i = { type: o2, props: a, key: n, ref: s, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --_, __source: f, __self: l };
    if ("function" == typeof o2 && (s = o2.defaultProps))
      for (u in s)
        void 0 === a[u] && (a[u] = s[u]);
    return import_preact.options.vnode && import_preact.options.vnode(i), i;
  }

  // src/ui/Labelled.tsx
  function Labelled({ children, label, role = "group" }) {
    const labelId = (0, import_hooks.useId)();
    return /* @__PURE__ */ o("div", { className: Labelled_module_default.main, role, "aria-labelledby": labelId, children: [
      /* @__PURE__ */ o("div", { id: labelId, className: Labelled_module_default.label, "aria-hidden": "true", children: label }),
      children
    ] });
  }

  // src/ui/utils/state.ts
  var import_signals = __toESM(require_signals());
  var actionArea = (0, import_signals.signal)(void 0);
  var activeCombatantId = (0, import_signals.signal)(NaN);
  var activeCombatant = (0, import_signals.computed)(
    () => allCombatants.value.find((u) => u.id === activeCombatantId.value)
  );
  var allActions = (0, import_signals.signal)([]);
  var allCombatants = (0, import_signals.signal)([]);
  var allEffects = (0, import_signals.signal)([]);
  var scale = (0, import_signals.signal)(20);
  var wantsCombatant = (0, import_signals.signal)(
    void 0
  );
  var wantsPoint = (0, import_signals.signal)(void 0);
  var yesNo = (0, import_signals.signal)(void 0);
  window.state = {
    actionArea,
    activeCombatantId,
    activeCombatant,
    allActions,
    allEffects,
    allCombatants,
    scale,
    wantsPoint,
    yesNo
  };

  // src/ui/ActiveUnitPanel.tsx
  function ActiveUnitPanel({
    onChooseAction,
    onPass,
    who
  }) {
    return /* @__PURE__ */ o("aside", { className: ActiveUnitPanel_module_default.main, "aria-label": "Active Unit", children: [
      /* @__PURE__ */ o(Labelled, { label: "Current Turn", children: who.name }),
      /* @__PURE__ */ o("button", { onClick: onPass, children: "End Turn" }),
      /* @__PURE__ */ o("hr", {}),
      /* @__PURE__ */ o(Labelled, { label: "Actions", children: allActions.value.map((action) => /* @__PURE__ */ o("button", { onClick: () => onChooseAction(action), children: action.name }, action.name)) })
    ] });
  }

  // src/ui/App.module.scss
  var App_module_default = {
    "sidePanel": "_sidePanel_1hm63_5"
  };

  // src/ui/Battlefield.tsx
  var import_hooks5 = __toESM(require_hooks());

  // src/ui/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_hrxn9_1"
  };

  // src/ui/BattlefieldEffect.tsx
  var import_hooks2 = __toESM(require_hooks());

  // src/ui/BattlefieldEffect.module.scss
  var BattlefieldEffect_module_default = {
    "main": "_main_lrafe_1",
    "label": "_label_lrafe_10",
    "square": "_square_lrafe_14"
  };

  // src/ui/BattlefieldEffect.tsx
  function Sphere({
    centre,
    name,
    radius,
    tags
  }) {
    const style = (0, import_hooks2.useMemo)(() => {
      const size = radius * scale.value;
      return {
        left: centre.x * scale.value - size,
        top: centre.y * scale.value - size,
        width: size * 2,
        height: size * 2,
        borderRadius: size * 2,
        backgroundColor: tags.has("heavily obscured") ? "silver" : void 0
      };
    }, [centre.x, centre.y, radius, tags]);
    return /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.main, style, children: /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.label, children: `${name} Effect` }) });
  }
  function AffectedSquare({ point }) {
    const style = (0, import_hooks2.useMemo)(
      () => ({
        left: point.x * scale.value,
        top: point.y * scale.value,
        width: scale.value * 5,
        height: scale.value * 5
      }),
      [point]
    );
    return /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.square, style });
  }
  function BattlefieldEffect({ shape }) {
    const main = (0, import_hooks2.useMemo)(() => {
      switch (shape.type) {
        case "sphere":
          return /* @__PURE__ */ o(Sphere, __spreadValues({ name: "Pending", tags: /* @__PURE__ */ new Set() }, shape));
      }
    }, [shape]);
    const points = (0, import_hooks2.useMemo)(() => resolveArea(shape), [shape]);
    return /* @__PURE__ */ o(import_preact2.Fragment, { children: [
      main,
      points.map((p, i) => /* @__PURE__ */ o(AffectedSquare, { shape, point: p }, i))
    ] });
  }

  // src/ui/Unit.tsx
  var import_hooks4 = __toESM(require_hooks());

  // src/ui/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_12cn9_1",
    "token": "_token_12cn9_11"
  };

  // src/ui/UnitMoveButton.tsx
  var import_hooks3 = __toESM(require_hooks());

  // src/ui/UnitMoveButton.module.scss
  var UnitMoveButton_module_default = {
    "main": "_main_h46jm_5",
    "moveN": "_moveN_h46jm_22",
    "moveE": "_moveE_h46jm_28",
    "moveS": "_moveS_h46jm_34",
    "moveW": "_moveW_h46jm_40"
  };

  // src/ui/UnitMoveButton.tsx
  var makeButtonType = (className, emoji, label, dx, dy) => ({ className: UnitMoveButton_module_default[className], emoji, label, dx, dy });
  var buttonTypes = {
    north: makeButtonType("moveN", "\u2B06\uFE0F", "Move North", 0, -5),
    east: makeButtonType("moveE", "\u27A1\uFE0F", "Move East", 5, 0),
    south: makeButtonType("moveS", "\u2B07\uFE0F", "Move South", 0, 5),
    west: makeButtonType("moveW", "\u2B05\uFE0F", "Move West", -5, 0)
  };
  function UnitMoveButton({ disabled, onClick, type }) {
    const { className, emoji, label, dx, dy } = (0, import_hooks3.useMemo)(
      () => buttonTypes[type],
      [type]
    );
    const clicked = (0, import_hooks3.useCallback)(
      (e) => {
        e.stopPropagation();
        onClick(dx, dy);
      },
      [dx, dy, onClick]
    );
    return /* @__PURE__ */ o(
      "button",
      {
        disabled,
        className: `${UnitMoveButton_module_default.main} ${className}`,
        onClick: clicked,
        "aria-label": label,
        children: emoji
      }
    );
  }

  // src/ui/Unit.tsx
  function Unit({ isActive, onClick, onMove, u }) {
    const containerStyle = {
      left: u.position.x * scale.value,
      top: u.position.y * scale.value,
      width: u.sizeInUnits * scale.value,
      height: u.sizeInUnits * scale.value
    };
    const tokenStyle = {
      width: u.sizeInUnits * scale.value,
      height: u.sizeInUnits * scale.value
    };
    const disabled = u.movedSoFar >= u.speed;
    const clicked = (0, import_hooks4.useCallback)(
      (e) => onClick(u.who, e),
      [onClick, u]
    );
    const moved = (0, import_hooks4.useCallback)(
      (dx, dy) => onMove(u.who, dx, dy),
      [onMove, u]
    );
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      /* @__PURE__ */ o(
        "div",
        {
          className: Unit_module_default.main,
          style: containerStyle,
          title: u.name,
          onClick: clicked,
          children: [
            /* @__PURE__ */ o(
              "img",
              {
                className: Unit_module_default.token,
                style: tokenStyle,
                alt: u.name,
                src: u.img
              }
            ),
            isActive && /* @__PURE__ */ o(import_preact2.Fragment, { children: [
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "north" }),
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "east" }),
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "south" }),
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "west" })
            ] })
          ]
        }
      )
    );
  }

  // src/ui/Battlefield.tsx
  function Battlefield({
    onClickBattlefield,
    onClickCombatant,
    onMoveCombatant
  }) {
    const convertCoordinate = (0, import_hooks5.useCallback)((e) => {
      const x = round(Math.floor(e.pageX / scale.value), 5);
      const y = round(Math.floor(e.pageY / scale.value), 5);
      return { x, y };
    }, []);
    const onClick = (0, import_hooks5.useCallback)(
      (e) => onClickBattlefield(convertCoordinate(e), e),
      [convertCoordinate, onClickBattlefield]
    );
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      /* @__PURE__ */ o("main", { className: Battlefield_module_default.main, "aria-label": "Battlefield", onClick, children: [
        allCombatants.value.map((unit) => /* @__PURE__ */ o(
          Unit,
          {
            isActive: activeCombatantId.value === unit.id,
            u: unit,
            onClick: onClickCombatant,
            onMove: onMoveCombatant
          },
          unit.id
        )),
        allEffects.value.map((effect) => /* @__PURE__ */ o(BattlefieldEffect, { shape: effect }, effect.id)),
        actionArea.value && /* @__PURE__ */ o(BattlefieldEffect, { shape: actionArea.value })
      ] })
    );
  }

  // src/ui/ChooseActionConfigPanel.tsx
  var import_hooks6 = __toESM(require_hooks());

  // src/ui/ChooseActionConfigPanel.module.scss
  var ChooseActionConfigPanel_module_default = {
    "main": "_main_12wgw_1",
    "active": "_active_12wgw_8"
  };

  // src/ui/CombatantRef.module.scss
  var CombatantRef_module_default = {
    "main": "_main_u5vis_1",
    "icon": "_icon_u5vis_6",
    "iconLabel": "_iconLabel_u5vis_12"
  };

  // src/ui/CombatantRef.tsx
  function CombatantRef({ who }) {
    return /* @__PURE__ */ o("div", { className: CombatantRef_module_default.main, children: [
      /* @__PURE__ */ o("img", { className: CombatantRef_module_default.icon, src: who.img, alt: who.name }),
      /* @__PURE__ */ o("span", { className: CombatantRef_module_default.iconLabel, "aria-hidden": "true", children: who.name })
    ] });
  }

  // src/ui/ChooseActionConfigPanel.tsx
  function ChooseTarget({ field, value, onChange }) {
    const onClick = (0, import_hooks6.useCallback)(() => {
      wantsCombatant.value = (who) => {
        wantsCombatant.value = void 0;
        onChange(field, who);
      };
    }, [field, onChange]);
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Target: ",
        value ? /* @__PURE__ */ o(CombatantRef, { who: value }) : "NONE"
      ] }),
      /* @__PURE__ */ o("button", { onClick, children: "Choose Target" })
    ] });
  }
  function ChoosePoint({ field, value, onChange }) {
    const onClick = (0, import_hooks6.useCallback)(() => {
      wantsPoint.value = (point) => {
        wantsPoint.value = void 0;
        onChange(field, point);
      };
    }, [field, onChange]);
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Point: ",
        value ? `${value.x},${value.y}` : "NONE"
      ] }),
      /* @__PURE__ */ o("button", { onClick, children: "Choose Point" })
    ] });
  }
  function ChooseSlot({
    field,
    resolver,
    value,
    onChange
  }) {
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Spell Slot: ",
        value != null ? value : "NONE"
      ] }),
      /* @__PURE__ */ o("div", { children: enumerate(resolver.minimum, resolver.maximum).map((slot) => /* @__PURE__ */ o(
        "button",
        {
          className: value === slot ? ChooseActionConfigPanel_module_default.active : void 0,
          "aria-pressed": value === slot,
          onClick: () => onChange(field, slot),
          children: slot
        },
        slot
      )) })
    ] });
  }
  function getInitialConfig(action, initial) {
    const config = __spreadValues({}, initial);
    for (const [key, resolver] of Object.entries(action.config)) {
      if (resolver instanceof SlotResolver && !config[key])
        config[key] = resolver.minimum;
    }
    return config;
  }
  function ChooseActionConfigPanel({
    action,
    initialConfig = {},
    onCancel,
    onExecute
  }) {
    const [config, setConfig] = (0, import_hooks6.useState)(getInitialConfig(action, initialConfig));
    const patchConfig = (0, import_hooks6.useCallback)(
      (key, value) => {
        setConfig((old) => {
          const newConfig = __spreadProps(__spreadValues({}, old), { [key]: value });
          actionArea.value = action.getAffectedArea(newConfig);
          return newConfig;
        });
      },
      [action]
    );
    const errors = (0, import_hooks6.useMemo)(
      () => check(action, config).messages,
      [action, config]
    );
    const disabled = (0, import_hooks6.useMemo)(() => errors.length > 0, [errors]);
    const execute = (0, import_hooks6.useCallback)(() => {
      if (checkConfig(action, config))
        onExecute(action, config);
    }, [action, config, onExecute]);
    const elements = (0, import_hooks6.useMemo)(
      () => Object.entries(action.config).map(([key, resolver]) => {
        const props = {
          key,
          action,
          field: key,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolver,
          onChange: patchConfig,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: config[key]
        };
        if (resolver instanceof TargetResolver)
          return /* @__PURE__ */ o(ChooseTarget, __spreadValues({}, props));
        else if (resolver instanceof PointResolver)
          return /* @__PURE__ */ o(ChoosePoint, __spreadValues({}, props));
        else if (resolver instanceof SlotResolver)
          return /* @__PURE__ */ o(ChooseSlot, __spreadValues({}, props));
        else
          return /* @__PURE__ */ o("div", { children: [
            "(no frontend for resolver type [",
            props.resolver.type,
            "] yet)"
          ] });
      }),
      [action, config, patchConfig]
    );
    return /* @__PURE__ */ o("aside", { className: ChooseActionConfigPanel_module_default.main, "aria-label": "Action Options", children: [
      /* @__PURE__ */ o("div", { children: action.name }),
      /* @__PURE__ */ o("button", { disabled, onClick: execute, children: "Execute" }),
      /* @__PURE__ */ o("button", { onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ o("div", { children: elements }),
      errors.length > 0 && /* @__PURE__ */ o(Labelled, { label: "Errors", children: errors.map((msg, i) => /* @__PURE__ */ o("div", { children: msg }, i)) })
    ] });
  }

  // src/ui/EventLog.tsx
  var import_hooks7 = __toESM(require_hooks());

  // src/ui/EventLog.module.scss
  var EventLog_module_default = {
    "main": "_main_xdmbb_1",
    "wrapper": "_wrapper_xdmbb_19",
    "message": "_message_xdmbb_23"
  };

  // src/ui/EventLog.tsx
  function LogMessage({
    children,
    message
  }) {
    return /* @__PURE__ */ o("li", { "aria-label": message, className: EventLog_module_default.wrapper, children: /* @__PURE__ */ o("div", { "aria-hidden": "true", className: EventLog_module_default.message, children }) });
  }
  function AttackMessage({
    pre: { attacker, target, weapon, ammo },
    roll,
    total
  }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${attacker.name} attacks ${target.name}${roll.diceType !== "normal" ? ` at ${roll.diceType}` : ""}${weapon ? ` with ${weapon.name}` : ""}${ammo ? `, firing ${ammo.name}` : ""} (${total}).`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who: attacker }),
          "attacks\xA0",
          /* @__PURE__ */ o(CombatantRef, { who: target }),
          roll.diceType !== "normal" && ` at ${roll.diceType}`,
          weapon && ` with ${weapon.name}`,
          ammo && `, firing ${ammo.name}`,
          "\xA0(",
          total,
          ")."
        ]
      }
    );
  }
  function CastMessage({ level, spell, who }) {
    return /* @__PURE__ */ o(LogMessage, { message: `${who.name} casts ${spell.name} at level ${level}.`, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      "casts ",
      spell.name,
      " at level ",
      level,
      "."
    ] });
  }
  function getDamageEntryText([type, entry]) {
    return `${entry.amount} ${type}${entry.response !== "normal" ? ` ${entry.response}` : ""}`;
  }
  function DamageMessage({
    who,
    total,
    breakdown
  }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${who.name} takes ${total} damage. (${[...breakdown].map(
          getDamageEntryText
        )})`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who }),
          "takes ",
          total,
          " damage. (",
          [...breakdown].map(([type, entry]) => /* @__PURE__ */ o("span", { children: getDamageEntryText([type, entry]) }, type)),
          ")"
        ]
      }
    );
  }
  function DeathMessage({ who }) {
    return /* @__PURE__ */ o(LogMessage, { message: `${who.name} dies!`, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      "dies!"
    ] });
  }
  function EventLog({ g: g2 }) {
    const [messages, setMessages] = (0, import_hooks7.useState)([]);
    const addMessage = (0, import_hooks7.useCallback)(
      (el) => setMessages((old) => old.concat(el).slice(0, 50)),
      []
    );
    (0, import_hooks7.useEffect)(() => {
      g2.events.on(
        "attack",
        ({ detail }) => addMessage(/* @__PURE__ */ o(AttackMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "combatantDamaged",
        ({ detail }) => addMessage(/* @__PURE__ */ o(DamageMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "combatantDied",
        ({ detail }) => addMessage(/* @__PURE__ */ o(DeathMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "spellCast",
        ({ detail }) => addMessage(/* @__PURE__ */ o(CastMessage, __spreadValues({}, detail)))
      );
    }, [addMessage, g2]);
    return /* @__PURE__ */ o("ul", { className: EventLog_module_default.main, "aria-label": "Event Log", children: messages });
  }

  // src/ui/Menu.module.scss
  var Menu_module_default = {
    "main": "_main_1xuy6_1"
  };

  // src/ui/Menu.tsx
  function Menu({ caption, items, onClick, x, y }) {
    return /* @__PURE__ */ o("menu", { className: Menu_module_default.main, style: { left: x, top: y }, children: /* @__PURE__ */ o(Labelled, { label: caption, children: items.length === 0 ? /* @__PURE__ */ o("div", { children: "(empty)" }) : items.map(({ label, value, disabled }) => /* @__PURE__ */ o(
      "button",
      {
        role: "menuitem",
        disabled,
        onClick: () => onClick(value),
        children: label
      },
      label
    )) }) });
  }

  // src/ui/utils/types.ts
  function getUnitData(who, state) {
    const { position } = state;
    const { id, name, img, sizeInUnits, movedSoFar, speed } = who;
    return { who, position, id, name, img, sizeInUnits, movedSoFar, speed };
  }

  // src/ui/YesNoDialog.tsx
  var import_hooks9 = __toESM(require_hooks());

  // src/ui/Dialog.tsx
  var import_hooks8 = __toESM(require_hooks());

  // src/ui/Dialog.module.scss
  var Dialog_module_default = {
    "main": "_main_910pw_1",
    "shade": "_shade_910pw_5",
    "react": "_react_910pw_18",
    "title": "_title_910pw_24"
  };

  // src/ui/Dialog.tsx
  function ReactDialog({ title, text, children }) {
    const titleId = (0, import_hooks8.useId)();
    return /* @__PURE__ */ o("div", { className: Dialog_module_default.shade, children: /* @__PURE__ */ o(
      "div",
      {
        role: "dialog",
        "aria-labelledby": titleId,
        "aria-modal": "true",
        className: `${Dialog_module_default.main} ${Dialog_module_default.react}`,
        children: [
          /* @__PURE__ */ o("div", { id: titleId, className: Dialog_module_default.title, children: title }),
          /* @__PURE__ */ o("p", { className: Dialog_module_default.text, children: text }),
          children
        ]
      }
    ) });
  }
  function Dialog(props) {
    return /* @__PURE__ */ o(ReactDialog, __spreadValues({}, props));
  }

  // src/ui/YesNoDialog.tsx
  function YesNoDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks9.useCallback)(
      (value) => {
        yesNo.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    const onYes = (0, import_hooks9.useCallback)(() => decide(true), [decide]);
    const onNo = (0, import_hooks9.useCallback)(() => decide(false), [decide]);
    return /* @__PURE__ */ o(Dialog, { title: interruption.title, text: interruption.text, children: [
      /* @__PURE__ */ o("button", { onClick: onYes, children: "Yes" }),
      /* @__PURE__ */ o("button", { onClick: onNo, children: "No" })
    ] });
  }

  // src/ui/App.tsx
  function App({ g: g2, onMount }) {
    const [target, setTarget] = (0, import_hooks10.useState)();
    const [action, setAction] = (0, import_hooks10.useState)();
    const [actionMenu, setActionMenu] = (0, import_hooks10.useState)({
      show: false,
      x: NaN,
      y: NaN,
      items: []
    });
    const hideActionMenu = (0, import_hooks10.useCallback)(
      () => setActionMenu({ show: false, x: NaN, y: NaN, items: [] }),
      []
    );
    const refreshUnits = (0, import_hooks10.useCallback)(() => {
      const list = [];
      for (const [who, state] of g2.combatants)
        list.push(getUnitData(who, state));
      allCombatants.value = list;
    }, [g2]);
    const refreshAreas = (0, import_hooks10.useCallback)(() => {
      allEffects.value = [...g2.effects];
    }, [g2]);
    (0, import_hooks10.useEffect)(() => {
      g2.events.on("combatantPlaced", refreshUnits);
      g2.events.on("combatantMoved", refreshUnits);
      g2.events.on("combatantDied", refreshUnits);
      g2.events.on("areaPlaced", refreshAreas);
      g2.events.on("areaRemoved", refreshAreas);
      g2.events.on("turnStarted", ({ detail: { who } }) => {
        activeCombatantId.value = who.id;
        hideActionMenu();
        allActions.value = g2.getActions(who);
      });
      g2.events.on("yesNoChoice", (e) => yesNo.value = e);
      onMount == null ? void 0 : onMount(g2);
    }, [g2, hideActionMenu, onMount, refreshAreas, refreshUnits]);
    const onExecuteAction = (0, import_hooks10.useCallback)(
      (action2, config) => {
        setAction(void 0);
        actionArea.value = void 0;
        void g2.act(action2, config).then(refreshUnits);
      },
      [g2, refreshUnits]
    );
    const onClickAction = (0, import_hooks10.useCallback)(
      (action2) => {
        hideActionMenu();
        setAction(void 0);
        const point = target ? g2.getState(target).position : void 0;
        const config = { target, point };
        if (checkConfig(action2, config)) {
          onExecuteAction(action2, config);
        } else
          console.warn(config, "does not match", action2.config);
      },
      [g2, hideActionMenu, onExecuteAction, target]
    );
    const onClickBattlefield = (0, import_hooks10.useCallback)(
      (p) => {
        const givePoint = wantsPoint.peek();
        if (givePoint) {
          givePoint(p);
          return;
        }
        hideActionMenu();
        actionArea.value = void 0;
      },
      [hideActionMenu]
    );
    const onClickCombatant = (0, import_hooks10.useCallback)(
      (who, e) => {
        e.stopPropagation();
        const giveCombatant = wantsCombatant.peek();
        if (giveCombatant) {
          giveCombatant(who);
          return;
        }
        const givePoint = wantsPoint.peek();
        if (givePoint) {
          givePoint(g2.getState(who).position);
          return;
        }
        setAction(void 0);
        actionArea.value = void 0;
        if (activeCombatant.value) {
          setTarget(who);
          const items = allActions.value.map((action2) => ({
            label: action2.name,
            value: action2,
            disabled: !checkConfig(action2, {
              target: who,
              point: g2.getState(who).position
            })
          })).filter((item) => !item.disabled);
          setActionMenu({ show: true, x: e.clientX, y: e.clientY, items });
        }
      },
      [g2]
    );
    const onMoveCombatant = (0, import_hooks10.useCallback)(
      (who, dx, dy) => {
        hideActionMenu();
        void g2.move(who, dx, dy);
      },
      [g2, hideActionMenu]
    );
    const onPass = (0, import_hooks10.useCallback)(() => {
      setAction(void 0);
      actionArea.value = void 0;
      void g2.nextTurn();
    }, [g2]);
    const onCancelAction = (0, import_hooks10.useCallback)(() => {
      setAction(void 0);
      actionArea.value = void 0;
    }, []);
    const onChooseAction = (0, import_hooks10.useCallback)(
      (action2) => {
        hideActionMenu();
        setAction(action2);
      },
      [hideActionMenu]
    );
    return /* @__PURE__ */ o("div", { className: App_module_default.main, children: [
      /* @__PURE__ */ o(
        Battlefield,
        {
          onClickBattlefield,
          onClickCombatant,
          onMoveCombatant
        }
      ),
      actionMenu.show && /* @__PURE__ */ o(Menu, __spreadProps(__spreadValues({ caption: "Quick Actions" }, actionMenu), { onClick: onClickAction })),
      /* @__PURE__ */ o("div", { className: App_module_default.sidePanel, children: [
        activeCombatant.value && /* @__PURE__ */ o(
          ActiveUnitPanel,
          {
            who: activeCombatant.value,
            onPass,
            onChooseAction
          }
        ),
        action && /* @__PURE__ */ o(
          ChooseActionConfigPanel,
          {
            action,
            onCancel: onCancelAction,
            onExecute: onExecuteAction
          }
        )
      ] }),
      /* @__PURE__ */ o(EventLog, { g: g2 }),
      yesNo.value && /* @__PURE__ */ o(YesNoDialog, __spreadValues({}, yesNo.value.detail))
    ] });
  }

  // src/index.tsx
  var g = new Engine();
  window.g = g;
  (0, import_preact3.render)(
    /* @__PURE__ */ o(
      App,
      {
        g,
        onMount: () => {
          const thug = new Thug(g);
          const badger = new Badger(g);
          const hunk = new Tethilssethanar(g);
          const aura = new Aura(g);
          g.place(thug, 0, 0);
          g.place(badger, 10, 0);
          g.place(hunk, 10, 20);
          g.place(aura, 20, 20);
          g.start();
        }
      }
    ),
    document.body
  );
})();
//# sourceMappingURL=bundle.js.map
