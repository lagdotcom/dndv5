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
      var _a;
      const size = sizeOfDice(rt);
      const value = (_a = this.getForcedRoll(rt)) != null ? _a : Math.ceil(Math.random() * size);
      return { size, value };
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

  // src/utils/dnd.ts
  function getAbilityBonus(ability) {
    return Math.floor((ability - 10) / 2);
  }

  // src/utils/isDefined.ts
  function isDefined(value) {
    return typeof value !== "undefined";
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
      hpMax = 1,
      hp = hpMax,
      level = 0,
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
      if (typeof thing === "string")
        return (_a = this.skills.get(thing)) != null ? _a : 0;
      if (thing.itemType === "weapon") {
        if (this.weaponProficiencies.has(thing.weaponType))
          return 1;
        if (this.weaponCategoryProficiencies.has(thing.category))
          return 1;
        return 0;
      }
      if (this.armorProficiencies.has(thing.category))
        return 1;
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
    constructor(g2, actor, weapon) {
      this.g = g2;
      this.actor = actor;
      this.weapon = weapon;
      const range = getWeaponRange(actor, weapon);
      this.ability = getWeaponAbility(actor, weapon);
      this.config = { target: new TargetResolver(g2, range) };
      this.name = weapon.name;
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        const { ability, weapon, actor: attacker, g: g2 } = this;
        const ba = yield g2.resolve(
          new BeforeAttackEvent({
            target,
            attacker,
            ability,
            weapon,
            diceType: new DiceTypeCollector(),
            bonus: new BonusCollector()
          })
        );
        const attack = yield g2.roll(
          { type: "attack", who: attacker, target, weapon, ability },
          ba.diceType.result
        );
        const total = attack.value + ba.bonus.result;
        if (total >= target.ac) {
          const map = new DamageMap();
          const { damage } = weapon;
          if (damage.type === "dice") {
            const { count, size } = damage.amount;
            const amount = yield g2.rollDamage(count, {
              size,
              damageType: damage.damageType,
              attacker,
              target,
              ability,
              weapon
            });
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
              bonus: new BonusCollector()
            })
          );
          map.add(damage.damageType, gd.bonus.result);
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
          for (const weapon of who.weapons)
            actions.push(new WeaponAttack(g2, who, weapon));
        }
      });
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
    rollDamage(count, e) {
      return __async(this, null, function* () {
        let total = 0;
        for (let i = 0; i < count; i++) {
          const roll = yield this.roll(__spreadProps(__spreadValues({}, e), { type: "damage" }));
          total += roll.value;
        }
        return total;
      });
    }
    rollInitiative(who) {
      return __async(this, null, function* () {
        const roll = yield this.roll({ type: "initiative", who });
        return roll.value;
      });
    }
    roll(type, diceType = "normal") {
      return __async(this, null, function* () {
        const roll = this.dice.roll(type, diceType);
        return this.resolve(
          new DiceRolledEvent({
            type,
            diceType,
            size: roll.size,
            value: roll.value
          })
        );
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
        return e.detail;
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
    }
  };
  var Mace = class extends AbstractWeapon {
    constructor(g2) {
      super("mace", "simple", "melee", dd(1, 6, "bludgeoning"));
      this.g = g2;
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
      super(
        g2,
        "badger",
        0,
        "beast",
        "tiny",
        "https://5e.tools/img/MM/Badger.png"
      );
      this.hp = this.hpMax = 3;
      this.movement.set("speed", 20);
      this.movement.set("burrow", 5);
      this.strScore = 4;
      this.dexScore = 11;
      this.conScore = 12;
      this.intScore = 2;
      this.wisScore = 12;
      this.chaScore = 5;
      this.senses.set("darkvision", 30);
      this.pb = 2;
      this.naturalWeapons.add(new Bite(g2));
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

  // src/monsters/Thug.ts
  var Thug = class extends Monster {
    constructor(g2) {
      super(
        g2,
        "thug",
        0.5,
        "humanoid",
        "medium",
        "https://5e.tools/img/MM/Thug.png"
      );
      this.don(new LeatherArmor(g2), true);
      this.hp = this.hpMax = 32;
      this.movement.set("speed", 30);
      this.strScore = 15;
      this.dexScore = 11;
      this.conScore = 14;
      this.intScore = 10;
      this.wisScore = 10;
      this.chaScore = 11;
      this.skills.set("Intimidation", 1);
      this.languages.add("Common");
      this.pb = 2;
      this.don(new Mace(g2), true);
      this.don(new HeavyCrossbow(g2), true);
    }
  };

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
        diesAtZero: false
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
        feature.setup(this.g, this, this.getConfig(feature.name));
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
    }
    apply(config) {
      return this.spell.apply(this.actor, this.method, config);
    }
  };

  // src/features/SimpleFeature.ts
  var SimpleFeature = class {
    constructor(name, setup) {
      this.name = name;
      this.setup = setup;
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

  // src/pcs/wizards/Tethilssethanar.ts
  var Tethilssethanar = class extends PC {
    constructor(g2) {
      super(
        g2,
        "Tethilssethanar",
        "https://www.dndbeyond.com/avatars/22548/562/1581111423-64025171.jpeg"
      );
      this.setRace(Triton_default);
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
    "main": "_main_1er1e_1"
  };

  // src/ui/state.ts
  var import_signals = __toESM(require_signals());
  var activeCombatant = (0, import_signals.signal)(void 0);
  var allActions = (0, import_signals.signal)([]);

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
      /* @__PURE__ */ o("button", { onClick: onPass, children: "Pass" })
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

  // src/ui/Battlefield.tsx
  var import_hooks3 = __toESM(require_hooks());

  // src/ui/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_1fv7t_1"
  };

  // src/ui/Unit.tsx
  var import_hooks2 = __toESM(require_hooks());

  // src/ui/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_1qwrm_1",
    "token": "_token_1qwrm_5"
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
  var buttonTypes = {
    north: {
      className: UnitMoveButton_module_default.moveN,
      emoji: "\u2B06\uFE0F",
      label: "North",
      dx: 0,
      dy: -5
    },
    east: { className: UnitMoveButton_module_default.moveE, emoji: "\u27A1\uFE0F", label: "East", dx: 5, dy: 0 },
    south: { className: UnitMoveButton_module_default.moveS, emoji: "\u2B07\uFE0F", label: "South", dx: 0, dy: 5 },
    west: { className: UnitMoveButton_module_default.moveW, emoji: "\u2B05\uFE0F", label: "West", dx: -5, dy: 0 }
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
      /* @__PURE__ */ o("div", { className: Unit_module_default.main, style: containerStyle, onClick: clicked, children: [
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
      ] })
    );
  }

  // src/ui/Battlefield.tsx
  function Battlefield({
    onClickBattlefield,
    onClickCombatant,
    onMoveCombatant,
    units
  }) {
    const unitElements = (0, import_hooks3.useMemo)(() => {
      const elements = [];
      for (const [who, state] of units)
        elements.push(
          /* @__PURE__ */ o(
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
          )
        );
      return elements;
    }, [activeCombatant.value, onClickCombatant, onMoveCombatant, units]);
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      /* @__PURE__ */ o("div", { className: Battlefield_module_default.main, onClick: onClickBattlefield, children: unitElements })
    );
  }

  // src/ui/Menu.module.scss
  var Menu_module_default = {
    "main": "_main_2qfwl_1"
  };

  // src/ui/Menu.tsx
  function Menu({ items, onClick, x, y }) {
    return /* @__PURE__ */ o("menu", { className: Menu_module_default.main, style: { left: x, top: y }, children: items.length === 0 ? /* @__PURE__ */ o("div", { children: "(empty)" }) : items.map(({ label, value, disabled }) => /* @__PURE__ */ o("li", { children: /* @__PURE__ */ o("button", { disabled, onClick: () => onClick(value), children: label }) }, label)) });
  }

  // src/ui/App.tsx
  function App({ g: g2, onMount }) {
    const [target, setTarget] = (0, import_hooks4.useState)();
    const [units, setUnits] = (0, import_hooks4.useState)(
      () => /* @__PURE__ */ new Map()
    );
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
    const updateUnits = (0, import_hooks4.useCallback)(
      (updateFn) => setUnits((old) => {
        const map = new Map(old);
        updateFn(map);
        return map;
      }),
      [setUnits]
    );
    (0, import_hooks4.useEffect)(() => {
      g2.events.on(
        "combatantPlaced",
        ({ detail: { who, position } }) => updateUnits((map) => map.set(who, { position, initiative: NaN }))
      );
      g2.events.on(
        "combatantMoved",
        ({ detail: { who, position } }) => updateUnits((map) => map.set(who, { position, initiative: NaN }))
      );
      g2.events.on("combatantDied", ({ detail: { who } }) => {
        updateUnits((map) => map.delete(who));
      });
      g2.events.on("turnStarted", ({ detail: { who } }) => {
        activeCombatant.value = who;
        hideActionMenu();
        void g2.getActions(who).then((actions) => allActions.value = actions);
      });
      onMount == null ? void 0 : onMount(g2);
    }, [g2, hideActionMenu, onMount, updateUnits]);
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
      (who, dx, dy) => g2.move(who, dx, dy),
      [g2]
    );
    const onPass = (0, import_hooks4.useCallback)(() => {
      void g2.nextTurn();
    }, [g2]);
    return /* @__PURE__ */ o("div", { className: App_module_default.main, children: [
      /* @__PURE__ */ o(
        Battlefield,
        {
          units,
          onClickBattlefield,
          onClickCombatant,
          onMoveCombatant
        }
      ),
      actionMenu.show && /* @__PURE__ */ o(Menu, __spreadProps(__spreadValues({}, actionMenu), { onClick: onClickAction })),
      /* @__PURE__ */ o(ActiveUnitPanelContainer, { onPass })
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
