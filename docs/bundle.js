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
    constructor(maxRange) {
      this.maxRange = maxRange;
      this.type = "Combatant";
    }
    check(value) {
      return value instanceof AbstractCombatant;
    }
  };

  // src/actions/WeaponAttack.ts
  var WeaponAttack = class {
    constructor(attacker, weapon) {
      this.attacker = attacker;
      this.weapon = weapon;
      const range = getWeaponRange(attacker, weapon);
      this.ability = getWeaponAbility(attacker, weapon);
      this.config = { target: new TargetResolver(range) };
      this.name = weapon.name;
    }
    apply(_0, _1) {
      return __async(this, arguments, function* (g2, { target }) {
        const { ability, weapon, attacker } = this;
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
          {
            type: "attack",
            who: attacker,
            target,
            weapon,
            ability
          },
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
            actions.push(new WeaponAttack(who, weapon));
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
        source,
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
        yield action.apply(this, config);
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

  // src/ui/App.tsx
  var import_hooks4 = __toESM(require_hooks());

  // src/utils/config.ts
  function checkConfig(action, config) {
    for (const [key, resolver] of Object.entries(action.config)) {
      const value = config[key];
      if (!resolver.check(value))
        return false;
    }
    return true;
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
    "main": "_main_ul2jc_5",
    "moveN": "_moveN_ul2jc_20",
    "moveE": "_moveE_ul2jc_26",
    "moveS": "_moveS_ul2jc_32",
    "moveW": "_moveW_ul2jc_38"
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
    active,
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
              isActive: active === who,
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
    }, [active, onClickCombatant, onMoveCombatant, units]);
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
    return /* @__PURE__ */ o("menu", { className: Menu_module_default.main, style: { left: x, top: y }, children: items.length === 0 ? /* @__PURE__ */ o("div", { children: "(empty)" }) : items.map(({ label, value }) => /* @__PURE__ */ o("li", { children: /* @__PURE__ */ o("button", { onClick: () => onClick(value), children: label }) }, label)) });
  }

  // src/ui/App.tsx
  function App({ g: g2, onMount }) {
    const [active, setActive] = (0, import_hooks4.useState)();
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
        setActive(who);
        hideActionMenu();
      });
      onMount == null ? void 0 : onMount(g2);
    }, [g2, hideActionMenu, onMount, updateUnits]);
    const onClickAction = (0, import_hooks4.useCallback)(
      (action) => {
        hideActionMenu();
        const config = { target };
        if (checkConfig(action, config)) {
          void action.apply(g2, config);
        } else
          console.warn(config, "does not match", action.config);
      },
      [g2, hideActionMenu, target]
    );
    const onClickBattlefield = (0, import_hooks4.useCallback)(
      (e) => {
        hideActionMenu();
      },
      [hideActionMenu]
    );
    const onClickCombatant = (0, import_hooks4.useCallback)(
      (who, e) => {
        e.stopPropagation();
        if (active) {
          setTarget(who);
          void g2.getActions(active, who).then((actions) => {
            setActionMenu({
              show: true,
              x: e.clientX,
              y: e.clientY,
              items: actions.map((a) => ({ label: a.name, value: a }))
            });
            return actions;
          });
        }
      },
      [active, g2]
    );
    const onMoveCombatant = (0, import_hooks4.useCallback)(
      (who, dx, dy) => g2.move(who, dx, dy),
      [g2]
    );
    return /* @__PURE__ */ o("div", { className: App_module_default.main, children: [
      /* @__PURE__ */ o(
        Battlefield,
        {
          active,
          units,
          onClickBattlefield,
          onClickCombatant,
          onMoveCombatant
        }
      ),
      actionMenu.show && /* @__PURE__ */ o(Menu, __spreadProps(__spreadValues({}, actionMenu), { onClick: onClickAction }))
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
          g.place(thug, 0, 0);
          g.place(badger, 10, 0);
          g.start();
        }
      }
    ),
    document.body
  );
})();
//# sourceMappingURL=bundle.js.map
