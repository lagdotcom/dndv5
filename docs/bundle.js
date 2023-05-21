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
  var __reflectGet = Reflect.get;
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
  var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
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
      let valueIgnored = void 0;
      if (dt !== "normal") {
        valueIgnored = (_b = this.getForcedRoll(rt)) != null ? _b : Math.ceil(Math.random() * size);
        if (dt === "advantage" && valueIgnored > value || dt === "disadvantage" && value > valueIgnored)
          [value, valueIgnored] = [valueIgnored, value];
      }
      return { size, value, valueIgnored };
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
    }
    add(response, source) {
      this[response].add(source);
    }
    get result() {
      const hasAdvantage = this.advantage.size > 0;
      const hasDisadvantage = this.disadvantage.size > 0;
      if (hasAdvantage === hasDisadvantage)
        return "normal";
      return hasAdvantage ? "advantage" : "disadvantage";
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

  // src/events/EventBase.ts
  var EventBase = class extends CustomEvent {
    constructor(name, detail) {
      super(name, { detail });
    }
  };

  // src/events/AttackEvent.ts
  var AttackEvent = class extends EventBase {
    constructor(detail) {
      super("attack", detail);
    }
  };

  // src/events/BeforeAttackEvent.ts
  var BeforeAttackEvent = class extends EventBase {
    constructor(detail) {
      super("beforeAttack", detail);
    }
  };

  // src/events/GatherDamageEvent.ts
  var GatherDamageEvent = class extends EventBase {
    constructor(detail) {
      super("gatherDamage", detail);
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
    addFeature(feature) {
      if (this.features.get(feature.name)) {
        console.warn(
          `${this.name} already has a feature named ${feature.name}, skipping.`
        );
        return;
      }
      this.features.set(feature.name, feature);
      feature.setup(this.g, this, this.getConfig(feature.name));
    }
    setAbilityScores(str, dex, con, int, wis, cha) {
      this.strScore = str;
      this.dexScore = dex;
      this.conScore = con;
      this.intScore = int;
      this.wisScore = wis;
      this.chaScore = cha;
    }
    don(item) {
      if (item.itemType === "armor") {
        const predicate = isSuitOfArmor(item) ? isSuitOfArmor : isShield;
        for (const o2 of this.equipment) {
          if (predicate(o2))
            this.doff(o2);
        }
      }
      this.equipment.add(item);
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
  };

  // src/resolvers/TargetResolver.ts
  var TargetResolver = class {
    constructor(g2, maxRange, allowSelf = false) {
      this.g = g2;
      this.maxRange = maxRange;
      this.allowSelf = allowSelf;
      this.type = "Combatant";
    }
    check(value, action) {
      return value instanceof AbstractCombatant && (this.allowSelf || value !== action.actor) && distance(this.g, action.actor, value) <= this.maxRange;
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
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        const { ability, ammo, weapon, actor: attacker, g: g2 } = this;
        const pre = yield g2.resolve(
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
        const outcome = roll.value === 1 ? "miss" : roll.value === 20 ? "hit" : total >= target.ac ? "hit" : "miss";
        const attack = yield g2.resolve(
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
              map,
              bonus: new BonusCollector(),
              critical
            })
          );
          map.add(damage.damageType, gd.detail.bonus.result);
          yield g2.damage(map, { source: this, attacker, target });
        }
      });
    }
  };

  // src/DndRules.ts
  var AbilityRule = class {
    constructor(g2) {
      this.g = g2;
      this.name = "Ability";
      g2.events.on("beforeAttack", ({ detail: { attacker, ability, bonus } }) => {
        bonus.add(attacker[ability], this);
      });
      g2.events.on("gatherDamage", ({ detail: { attacker, ability, bonus } }) => {
        bonus.add(attacker[ability], this);
      });
    }
  };
  var CombatantArmourCalculation = class {
    constructor(g2) {
      this.g = g2;
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
    }
  };
  var CombatantWeaponAttacks = class {
    constructor(g2) {
      this.g = g2;
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
    }
  };
  var LongRangeAttacksRule = class {
    constructor(g2) {
      this.g = g2;
      g2.events.on(
        "beforeAttack",
        ({ detail: { attacker, target, weapon, diceType } }) => {
          if (typeof (weapon == null ? void 0 : weapon.shortRange) === "number" && distance(g2, attacker, target) > weapon.shortRange)
            diceType.add("disadvantage", CombatantWeaponAttacks);
        }
      );
    }
  };
  var ProficiencyRule = class {
    constructor(g2) {
      this.g = g2;
      this.name = "Proficiency";
      g2.events.on("beforeAttack", ({ detail: { attacker, weapon, bonus } }) => {
        if (weapon && attacker.getProficiencyMultiplier(weapon))
          bonus.add(attacker.pb, this);
      });
    }
  };
  var DndRules = class {
    constructor(g2) {
      this.g = g2;
      new AbilityRule(g2);
      new CombatantArmourCalculation(g2);
      new CombatantWeaponAttacks(g2);
      new LongRangeAttacksRule(g2);
      new ProficiencyRule(g2);
    }
  };

  // src/events/CombatantDamagedEvent.ts
  var CombatantDamagedEvent = class extends EventBase {
    constructor(detail) {
      super("combatantDamaged", detail);
    }
  };

  // src/events/CombatantDiedEvent.ts
  var CombatantDiedEvent = class extends EventBase {
    constructor(detail) {
      super("combatantDied", detail);
    }
  };

  // src/events/CombatantMovedEvent.ts
  var CombatantMovedEvent = class extends EventBase {
    constructor(detail) {
      super("combatantMoved", detail);
    }
  };

  // src/events/CombatantPlacedEvent.ts
  var CombatantPlacedEvent = class extends EventBase {
    constructor(detail) {
      super("combatantPlaced", detail);
    }
  };

  // src/events/DiceRolledEvent.ts
  var DiceRolledEvent = class extends EventBase {
    constructor(detail) {
      super("diceRolled", detail);
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
  var GetACMethodsEvent = class extends EventBase {
    constructor(detail) {
      super("getACMethods", detail);
    }
  };

  // src/events/GetActionsEvent.ts
  var GetActionsEvent = class extends EventBase {
    constructor(detail) {
      super("getActions", detail);
    }
  };

  // src/events/GetDamageResponseEvent.ts
  var GetDamageResponseEvent = class extends EventBase {
    constructor(detail) {
      super("getDamageResponse", detail);
    }
  };

  // src/events/TurnStartedEvent.ts
  var TurnStartedEvent = class extends EventBase {
    constructor(detail) {
      super("turnStarted", detail);
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

  // src/Engine.ts
  var Engine = class {
    constructor(dice = new DiceBag(), events = new Dispatcher()) {
      this.dice = dice;
      this.events = events;
      this.combatants = /* @__PURE__ */ new Map();
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
      this.events.fire(new CombatantPlacedEvent({ who, position }));
    }
    start() {
      return __async(this, null, function* () {
        for (const [c, cs] of this.combatants)
          cs.initiative = yield this.rollInitiative(c);
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
        return (yield this.resolve(new DiceRolledEvent(__spreadValues({ type, diceType }, roll)))).detail;
      });
    }
    nextTurn() {
      this.initiativePosition = isNaN(this.initiativePosition) ? 0 : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
      const who = this.initiativeOrder[this.initiativePosition];
      this.events.fire(new TurnStartedEvent({ who }));
    }
    move(who, dx, dy) {
      return __async(this, null, function* () {
        const state = this.combatants.get(who);
        if (!state)
          return;
        const old = state.position;
        const x = old.x + dx;
        const y = old.y + dy;
        state.position = { x, y };
        const e = new CombatantMovedEvent({ who, old, position: state.position });
        this.events.fire(e);
      });
    }
    damage(_0, _1) {
      return __async(this, arguments, function* (damage, {
        attacker,
        target
      }) {
        let total = 0;
        const breakdown = /* @__PURE__ */ new Map();
        for (const [damageType, raw] of damage) {
          const collector = new DamageResponseCollector();
          const e = new GetDamageResponseEvent({
            who: target,
            damageType,
            response: collector
          });
          this.events.fire(e);
          const response = collector.result;
          if (response === "immune")
            continue;
          let multiplier = 1;
          if (response === "resist")
            multiplier = 0.5;
          else if (response === "vulnerable")
            multiplier = 2;
          const amount = Math.ceil(raw * multiplier);
          breakdown.set(damageType, { response, raw, amount });
          total += amount;
        }
        this.events.fire(
          new CombatantDamagedEvent({ who: target, attacker, total, breakdown })
        );
        target.hp -= total;
        if (target.hp <= 0) {
          if (target.diesAtZero) {
            this.combatants.delete(target);
            this.events.fire(new CombatantDiedEvent({ who: target, attacker }));
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
      return __async(this, null, function* () {
        const e = new GetActionsEvent({ who, target, actions: [] });
        this.events.fire(e);
        return e.detail.actions;
      });
    }
    getAC(who) {
      const e = new GetACMethodsEvent({ who, methods: [] });
      this.events.fire(e);
      return e.detail.methods.reduce(
        (best, method) => method.ac > best ? method.ac : best,
        0
      );
    }
    resolve(e) {
      return __async(this, null, function* () {
        this.events.fire(e);
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
  };

  // src/utils/dice.ts
  var dd = (count, size, damage) => ({
    type: "dice",
    amount: { count, size },
    damageType: damage
  });

  // src/items/weapons.ts
  var AbstractWeapon = class {
    constructor(name, category, rangeCategory, damage, properties = [], shortRange, longRange) {
      this.name = name;
      this.category = category;
      this.rangeCategory = rangeCategory;
      this.damage = damage;
      this.shortRange = shortRange;
      this.longRange = longRange;
      this.hands = 1;
      this.itemType = "weapon";
      this.weaponType = name;
      this.properties = new Set(properties);
      this.quantity = 1;
    }
  };
  var Mace = class extends AbstractWeapon {
    constructor(g2) {
      super("mace", "simple", "melee", dd(1, 6, "bludgeoning"));
      this.g = g2;
    }
  };
  var Sickle = class extends AbstractWeapon {
    constructor(g2) {
      super("sickle", "simple", "melee", dd(1, 4, "slashing"), ["light"]);
      this.g = g2;
    }
  };
  var Dart = class extends AbstractWeapon {
    constructor(g2, quantity) {
      super(
        "dart",
        "simple",
        "ranged",
        dd(1, 4, "piercing"),
        ["finesse", "thrown"],
        20,
        60
      );
      this.g = g2;
      this.quantity = quantity;
    }
  };
  var Sling = class extends AbstractWeapon {
    constructor(g2) {
      super(
        "sling",
        "simple",
        "ranged",
        dd(1, 4, "bludgeoning"),
        ["ammunition"],
        30,
        120
      );
      this.g = g2;
      this.ammunitionTag = "sling";
    }
  };
  var HeavyCrossbow = class extends AbstractWeapon {
    constructor(g2) {
      super(
        "heavy crossbow",
        "martial",
        "ranged",
        dd(1, 10, "piercing"),
        ["ammunition", "heavy", "loading", "two-handed"],
        100,
        400
      );
      this.g = g2;
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
      super("bite", "natural", "melee", {
        type: "flat",
        amount: 1,
        damageType: "piercing"
      });
      this.g = g2;
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
  var AbstractAmmo = class {
    constructor(name, ammunitionTag, quantity) {
      this.name = name;
      this.ammunitionTag = ammunitionTag;
      this.quantity = quantity;
      this.itemType = "ammo";
      this.hands = 0;
    }
  };
  var CrossbowBolt = class extends AbstractAmmo {
    constructor(g2, quantity) {
      super("crossbow bolt", "crossbow", quantity);
      this.g = g2;
    }
  };
  var SlingBullet = class extends AbstractAmmo {
    constructor(g2, quantity) {
      super("sling bullet", "sling", quantity);
      this.g = g2;
    }
  };

  // src/items/armor.ts
  var AbstractArmor = class {
    constructor(name, category, ac, stealthDisadvantage = false, minimumStrength = 0) {
      this.name = name;
      this.category = category;
      this.ac = ac;
      this.stealthDisadvantage = stealthDisadvantage;
      this.minimumStrength = minimumStrength;
      this.itemType = "armor";
      this.hands = 0;
    }
  };
  var LeatherArmor = class extends AbstractArmor {
    constructor(g2) {
      super("leather armor", "light", 11);
      this.g = g2;
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
    constructor(name, setup) {
      this.name = name;
      this.setup = setup;
    }
  };

  // src/classes/monk/index.ts
  var UnarmoredDefense = new SimpleFeature("Unarmored Defense", (g2, me) => {
    g2.events.on("getACMethods", ({ detail: { who, methods } }) => {
      if (who === me && !me.armor && !me.shield)
        methods.push({
          name: "Unarmored Defense",
          ac: 10 + me.dex + me.wis,
          uses: /* @__PURE__ */ new Set()
        });
    });
  });
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
    constructor(weapon, size) {
      super(
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
  var MartialArts = new SimpleFeature("Martial Arts", (g2, me) => {
    var _a;
    console.warn("[Feature Not Complete] Martial Arts");
    const diceSize = getMartialArtsDie((_a = me.classLevels.get("Monk")) != null ? _a : 0);
    g2.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who !== me)
        return;
      for (const wa of actions.filter(isMonkWeaponAttack)) {
        if (me.dex > me.str)
          wa.ability = "dex";
        if (canUpgradeDamage(wa.weapon.damage, diceSize))
          wa.weapon = new MonkWeaponWrapper(wa.weapon, diceSize);
      }
    });
  });
  var Monk = {
    name: "Monk",
    hitDieSize: 8,
    armorProficiencies: /* @__PURE__ */ new Set(),
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

  // src/PC.ts
  var UnarmedStrike = class extends AbstractWeapon {
    constructor(g2, owner) {
      super("unarmed strike", "natural", "melee", {
        type: "flat",
        amount: 1,
        damageType: "bludgeoning"
      });
      this.g = g2;
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
      this.naturalWeapons.add(new UnarmedStrike(g2, this));
    }
    setRace(race) {
      this.size = race.size;
      for (const [key, val] of race.abilities)
        this[`${key}Score`] += val;
      for (const [type, value] of race.movement)
        this.movement.set(type, value);
      for (const language of race.languages)
        this.languages.add(language);
      for (const feature of race.features)
        this.addFeature(feature);
    }
    addClassLevel(cls, hpRoll = cls.hitDieSize) {
      var _a, _b;
      const level = ((_a = this.classLevels.get(cls.name)) != null ? _a : 0) + 1;
      this.classLevels.set(cls.name, level);
      this.level++;
      this.hpMax += hpRoll + this.con;
      this.hp = this.hpMax;
      if (level === 1) {
        for (const prof of cls.armorProficiencies)
          this.armorProficiencies.add(prof);
        for (const prof of cls.saveProficiencies)
          this.saveProficiencies.add(prof);
        for (const prof of cls.weaponCategoryProficiencies)
          this.weaponCategoryProficiencies.add(prof);
        for (const prof of cls.weaponProficiencies)
          this.weaponProficiencies.add(prof);
      }
      for (const feature of (_b = cls.features.get(level)) != null ? _b : [])
        this.addFeature(feature);
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
    apply(config) {
      return this.spell.apply(this.actor, this.method, config);
    }
  };

  // src/features/common.ts
  function darkvisionFeature(range = 60) {
    return new SimpleFeature("Darkvision", (_2, me) => {
      me.senses.set("darkvision", range);
    });
  }
  function notImplementedFeature(name) {
    return new SimpleFeature(name, () => {
      console.warn(`[Feature Missing] ${name}`);
    });
  }

  // src/resources.ts
  var LongRestResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
    }
  };

  // src/spells/InnateSpellcasting.ts
  var InnateSpellcasting = class {
    constructor(name, ability) {
      this.name = name;
      this.ability = ability;
    }
  };

  // src/resolvers/PointResolver.ts
  var PointResolver = class {
    constructor(g2, maxRange) {
      this.g = g2;
      this.maxRange = maxRange;
      this.type = "Point";
    }
    check(value, action) {
      return typeof value === "object" && typeof value.x === "number" && typeof value.y === "number" && distanceTo(this.g, action.actor, value) <= this.maxRange;
    }
  };

  // src/resolvers/SlotResolver.ts
  var SlotResolver = class {
    constructor(g2, minimum) {
      this.g = g2;
      this.minimum = minimum;
      this.type = "SpellSlot";
    }
    check(value) {
      return typeof value === "number" && value >= this.minimum && value <= 9;
    }
  };

  // src/spells/AbstractSpell.ts
  var AbstractSpell = class {
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
  };

  // src/spells/level1/FogCloud.ts
  var FogCloud = class extends AbstractSpell {
    constructor(g2) {
      super("Fog Cloud", 1, "Conjuration", "action", true, {
        point: new PointResolver(g2, 120),
        slot: new SlotResolver(g2, 1)
      });
      this.g = g2;
      this.setVSM(true, true);
    }
    apply(_0, _1, _2) {
      return __async(this, arguments, function* (caster, method, { point, slot }) {
      });
    }
  };

  // src/spells/level2/GustOfWind.ts
  var GustOfWind = class extends AbstractSpell {
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
      this.values = new Set(choices);
    }
    check(value) {
      return typeof value === "string" && this.values.has(value);
    }
  };

  // src/spells/level3/WallOfWater.ts
  var WallOfWater = class extends AbstractSpell {
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
  var Amphibious = notImplementedFeature("Amphibious");
  var ControlAirAndWaterSpells = [
    {
      level: 0,
      // FIXME once I get class levels in
      spell: FogCloud,
      resource: new LongRestResource("Control Air and Water: Fog Cloud", 1)
    },
    {
      level: 3,
      spell: GustOfWind,
      resource: new LongRestResource("Control Air and Water: Gust of Wind", 1)
    },
    {
      level: 5,
      spell: WallOfWater,
      resource: new LongRestResource("Control Air and Water: Wall of Water", 1)
    }
  ];
  var ControlAirAndWaterSpellAction = class extends CastSpell {
    constructor(g2, who, method, spell, resource) {
      super(g2, who, method, spell);
      this.resource = resource;
    }
    // TODO check has resource before allowing cast
    apply(config) {
      return __async(this, null, function* () {
        this.actor.spendResource(this.resource);
        return __superGet(ControlAirAndWaterSpellAction.prototype, this, "apply").call(this, config);
      });
    }
  };
  var ControlAirAndWater = new SimpleFeature(
    "Control Air and Water",
    (g2, me) => {
      const method = new InnateSpellcasting("Control Air and Water", "cha");
      const spells = ControlAirAndWaterSpells.filter(
        (entry) => entry.level <= me.level
      );
      for (const { resource } of spells)
        me.addResource(resource);
      g2.events.on("getActions", ({ detail: { who, actions } }) => {
        if (who === me)
          for (const { spell, resource } of spells)
            actions.push(
              new ControlAirAndWaterSpellAction(
                g2,
                me,
                method,
                new spell(g2),
                resource
              )
            );
      });
    }
  );
  var Darkvision = darkvisionFeature();
  var EmissaryOfTheSea = notImplementedFeature("Emissary of the Sea");
  var GuardiansOfTheDepths = new SimpleFeature(
    "Guardians of the Depths",
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
  var import_hooks4 = __toESM(require_hooks());

  // src/utils/config.ts
  function checkConfig(action, config) {
    for (const [key, resolver] of Object.entries(action.config)) {
      const value = config[key];
      if (!resolver.check(value, action))
        return false;
    }
    return true;
  }

  // src/ui/ActiveUnitPanel.module.scss
  var ActiveUnitPanel_module_default = {
    "main": "_main_12cww_1"
  };

  // src/ui/state.ts
  var import_signals = __toESM(require_signals());
  var activeCombatant = (0, import_signals.signal)(void 0);
  var allActions = (0, import_signals.signal)([]);
  var allCombatants = (0, import_signals.signal)([]);
  window.state = { activeCombatant, allActions, allCombatants };

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

  // src/ui/ActiveUnitPanelContainer.tsx
  function ActiveUnitPanel({ onPass, who }) {
    return /* @__PURE__ */ o("aside", { className: ActiveUnitPanel_module_default.main, children: [
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ o("div", { children: "Current Turn:" }),
        /* @__PURE__ */ o("div", { children: who.name })
      ] }),
      /* @__PURE__ */ o("button", { onClick: onPass, children: "Pass" }),
      /* @__PURE__ */ o("hr", {}),
      /* @__PURE__ */ o("div", { children: allActions.value.map((action) => /* @__PURE__ */ o("button", { children: action.name }, action.name)) })
    ] });
  }
  function ActiveUnitPanelContainer(props) {
    const who = activeCombatant.value;
    if (!who)
      return null;
    return /* @__PURE__ */ o(ActiveUnitPanel, __spreadProps(__spreadValues({}, props), { who }));
  }

  // src/ui/App.module.scss
  var App_module_default = {};

  // src/ui/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_1fv7t_1"
  };

  // src/ui/Unit.tsx
  var import_hooks2 = __toESM(require_hooks());

  // src/ui/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_wjbod_1",
    "token": "_token_wjbod_10"
  };

  // src/ui/UnitMoveButton.tsx
  var import_hooks = __toESM(require_hooks());

  // src/ui/UnitMoveButton.module.scss
  var UnitMoveButton_module_default = {
    "main": "_main_1p3ee_5",
    "moveN": "_moveN_1p3ee_22",
    "moveE": "_moveE_1p3ee_28",
    "moveS": "_moveS_1p3ee_34",
    "moveW": "_moveW_1p3ee_40"
  };

  // src/ui/UnitMoveButton.tsx
  var makeButtonType = (className, emoji, label, dx, dy) => ({ className: UnitMoveButton_module_default[className], emoji, label, dx, dy });
  var buttonTypes = {
    north: makeButtonType("moveN", "\u2B06\uFE0F", "Move North", 0, -5),
    east: makeButtonType("moveE", "\u27A1\uFE0F", "Move East", 5, 0),
    south: makeButtonType("moveS", "\u2B07\uFE0F", "Move South", 0, 5),
    west: makeButtonType("moveW", "\u2B05\uFE0F", "Move West", -5, 0)
  };
  function UnitMoveButton({ onClick, type }) {
    const { className, emoji, label, dx, dy } = (0, import_hooks.useMemo)(
      () => buttonTypes[type],
      [type]
    );
    const clicked = (0, import_hooks.useCallback)(
      (e) => {
        e.stopPropagation();
        onClick(dx, dy);
      },
      [dx, dy, onClick]
    );
    return /* @__PURE__ */ o(
      "button",
      {
        className: `${UnitMoveButton_module_default.main} ${className}`,
        onClick: clicked,
        "aria-label": label,
        children: emoji
      }
    );
  }

  // src/ui/Unit.tsx
  function Unit({
    isActive,
    onClick,
    onMove,
    scale,
    state,
    who
  }) {
    const containerStyle = (0, import_hooks2.useMemo)(
      () => ({
        left: state.position.x * scale,
        top: state.position.y * scale,
        width: who.sizeInUnits * scale,
        height: who.sizeInUnits * scale
      }),
      [scale, state.position.x, state.position.y, who.sizeInUnits]
    );
    const tokenStyle = (0, import_hooks2.useMemo)(
      () => ({
        width: who.sizeInUnits * scale,
        height: who.sizeInUnits * scale
      }),
      [scale, who.sizeInUnits]
    );
    const clicked = (0, import_hooks2.useCallback)(
      (e) => onClick(who, e),
      [onClick, who]
    );
    const moved = (0, import_hooks2.useCallback)(
      (dx, dy) => onMove(who, dx, dy),
      [onMove, who]
    );
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      /* @__PURE__ */ o(
        "div",
        {
          className: Unit_module_default.main,
          style: containerStyle,
          title: who.name,
          onClick: clicked,
          children: [
            /* @__PURE__ */ o(
              "img",
              {
                className: Unit_module_default.token,
                style: tokenStyle,
                alt: who.name,
                src: who.img
              }
            ),
            isActive && /* @__PURE__ */ o(import_preact2.Fragment, { children: [
              /* @__PURE__ */ o(UnitMoveButton, { onClick: moved, type: "north" }),
              /* @__PURE__ */ o(UnitMoveButton, { onClick: moved, type: "east" }),
              /* @__PURE__ */ o(UnitMoveButton, { onClick: moved, type: "south" }),
              /* @__PURE__ */ o(UnitMoveButton, { onClick: moved, type: "west" })
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
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      /* @__PURE__ */ o("main", { className: Battlefield_module_default.main, onClick: onClickBattlefield, children: allCombatants.value.map(({ who, state }) => /* @__PURE__ */ o(
        Unit,
        {
          isActive: activeCombatant.value === who,
          who,
          scale: 20,
          state,
          onClick: onClickCombatant,
          onMove: onMoveCombatant
        },
        who.id
      )) })
    );
  }

  // src/ui/EventLog.tsx
  var import_hooks3 = __toESM(require_hooks());

  // src/ui/EventLog.module.scss
  var EventLog_module_default = {
    "main": "_main_1nene_1",
    "message": "_message_1nene_19",
    "icon": "_icon_1nene_25",
    "iconLabel": "_iconLabel_1nene_31"
  };

  // src/ui/EventLog.tsx
  function CombatantRef({ who }) {
    return /* @__PURE__ */ o(import_preact2.Fragment, { children: [
      /* @__PURE__ */ o("img", { className: EventLog_module_default.icon, src: who.img, alt: who.name }),
      /* @__PURE__ */ o("span", { className: EventLog_module_default.iconLabel, "aria-hidden": "true", children: who.name })
    ] });
  }
  function AttackMessage({
    pre: { attacker, target, weapon, ammo },
    total
  }) {
    return /* @__PURE__ */ o("li", { className: EventLog_module_default.message, children: [
      /* @__PURE__ */ o(CombatantRef, { who: attacker }),
      "attacks\xA0",
      /* @__PURE__ */ o(CombatantRef, { who: target }),
      weapon && `with ${weapon.name}`,
      ammo && `, firing ${ammo.name}`,
      "\xA0(",
      total,
      ")."
    ] });
  }
  function DamageMessage({
    who,
    total,
    breakdown
  }) {
    return /* @__PURE__ */ o("li", { className: EventLog_module_default.message, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      "takes ",
      total,
      " damage. (",
      [...breakdown].map(([type, entry]) => /* @__PURE__ */ o("span", { children: [
        entry.amount,
        " ",
        type,
        entry.response !== "normal" ? ` ${entry.response}` : ""
      ] }, type)),
      ")"
    ] });
  }
  function DeathMessage({ who }) {
    return /* @__PURE__ */ o("li", { className: EventLog_module_default.message, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      "dies!"
    ] });
  }
  function EventLog({ g: g2 }) {
    const [messages, setMessages] = (0, import_hooks3.useState)([]);
    const addMessage = (0, import_hooks3.useCallback)(
      (el) => setMessages((old) => old.concat(el).slice(0, 50)),
      []
    );
    (0, import_hooks3.useEffect)(() => {
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
    }, [addMessage, g2]);
    return /* @__PURE__ */ o("ul", { className: EventLog_module_default.main, "aria-label": "Event Log", children: messages });
  }

  // src/ui/Menu.module.scss
  var Menu_module_default = {
    "main": "_main_1ct3i_1"
  };

  // src/ui/Menu.tsx
  function Menu({ items, onClick, x, y }) {
    return /* @__PURE__ */ o("menu", { className: Menu_module_default.main, style: { left: x, top: y }, children: items.length === 0 ? /* @__PURE__ */ o("div", { children: "(empty)" }) : items.map(({ label, value, disabled }) => /* @__PURE__ */ o(
      "button",
      {
        role: "menuitem",
        disabled,
        onClick: () => onClick(value),
        children: label
      },
      label
    )) });
  }

  // src/ui/App.tsx
  function App({ g: g2, onMount }) {
    const [target, setTarget] = (0, import_hooks4.useState)();
    const [actionMenu, setActionMenu] = (0, import_hooks4.useState)({
      show: false,
      x: NaN,
      y: NaN,
      items: []
    });
    const hideActionMenu = (0, import_hooks4.useCallback)(
      () => setActionMenu({ show: false, x: NaN, y: NaN, items: [] }),
      []
    );
    const refreshUnits = (0, import_hooks4.useCallback)(() => {
      const list = [];
      for (const [who, state] of g2.combatants)
        list.push({ who, state });
      allCombatants.value = list;
    }, [g2]);
    (0, import_hooks4.useEffect)(() => {
      g2.events.on("combatantPlaced", refreshUnits);
      g2.events.on("combatantMoved", refreshUnits);
      g2.events.on("combatantDied", refreshUnits);
      g2.events.on("turnStarted", ({ detail: { who } }) => {
        activeCombatant.value = who;
        hideActionMenu();
        allActions.value = [];
        void g2.getActions(who).then((actions) => allActions.value = actions);
      });
      onMount == null ? void 0 : onMount(g2);
    }, [g2, hideActionMenu, onMount, refreshUnits]);
    const onClickAction = (0, import_hooks4.useCallback)(
      (action) => {
        hideActionMenu();
        const point = target ? g2.getState(target).position : void 0;
        const config = { target, point };
        if (checkConfig(action, config)) {
          void action.apply(config);
        } else
          console.warn(config, "does not match", action.config);
      },
      [g2, hideActionMenu, target]
    );
    const onClickBattlefield = (0, import_hooks4.useCallback)(() => {
      hideActionMenu();
    }, [hideActionMenu]);
    const onClickCombatant = (0, import_hooks4.useCallback)(
      (who, e) => {
        e.stopPropagation();
        if (activeCombatant.value) {
          setTarget(who);
          const items = allActions.value.map((action) => ({
            label: action.name,
            value: action,
            disabled: !checkConfig(action, {
              target: who,
              point: g2.getState(who).position
            })
          }));
          setActionMenu({ show: true, x: e.clientX, y: e.clientY, items });
        }
      },
      [activeCombatant.value, allActions.value, g2]
    );
    const onMoveCombatant = (0, import_hooks4.useCallback)(
      (who, dx, dy) => {
        hideActionMenu();
        g2.move(who, dx, dy);
      },
      [g2, hideActionMenu]
    );
    const onPass = (0, import_hooks4.useCallback)(() => {
      void g2.nextTurn();
    }, [g2]);
    return /* @__PURE__ */ o("div", { className: App_module_default.main, children: [
      /* @__PURE__ */ o(
        Battlefield,
        {
          onClickBattlefield,
          onClickCombatant,
          onMoveCombatant
        }
      ),
      actionMenu.show && /* @__PURE__ */ o(Menu, __spreadProps(__spreadValues({}, actionMenu), { onClick: onClickAction })),
      /* @__PURE__ */ o(ActiveUnitPanelContainer, { onPass }),
      /* @__PURE__ */ o(EventLog, { g: g2 })
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
          const teth = new Tethilssethanar(g);
          g.place(thug, 0, 0);
          g.place(badger, 10, 0);
          g.place(teth, 10, 20);
          g.start();
        }
      }
    ),
    document.body
  );
})();
//# sourceMappingURL=bundle.js.map
