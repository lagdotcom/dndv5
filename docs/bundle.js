"use strict";
(() => {
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
    roll(rt) {
      const size = sizeOfDice(rt);
      for (const fr of this.forcedRolls) {
        if (matches(rt, fr.matcher)) {
          this.forcedRolls.delete(fr);
          return { size, value: fr.value };
        }
      }
      const value = Math.ceil(Math.random() * size);
      return { size, value };
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
    return categoryUnits[size];
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
    constructor(g, name, {
      img,
      side,
      size,
      type,
      diesAtZero = true,
      hands = defaultHandsAmount[type],
      hpMax = 1,
      hp = hpMax,
      pb = 2,
      reach = 5,
      chaScore = 10,
      conScore = 10,
      dexScore = 10,
      intScore = 10,
      strScore = 10,
      wisScore = 10
    }) {
      this.g = g;
      this.name = name;
      this.diesAtZero = diesAtZero;
      this.hands = hands;
      this.hp = hp;
      this.hpMax = hpMax;
      this.img = img;
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
        for (const o of this.equipment) {
          if (predicate(o))
            this.doff(o);
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
    constructor(who, weapon) {
      this.who = who;
      this.weapon = weapon;
      const range = getWeaponRange(who, weapon);
      this.ability = getWeaponAbility(who, weapon);
      this.config = { target: new TargetResolver(range) };
      this.name = weapon.name;
    }
    apply(_0, _1) {
      return __async(this, arguments, function* (g, { target }) {
        const { ability, weapon, who } = this;
        const attack = yield g.roll({
          type: "attack",
          who,
          target,
          weapon,
          ability
        });
        const proficiencyBonus = weapon ? who.getProficiencyMultiplier(weapon) * who.pb : 0;
        const abilityBonus = who[ability];
        const total = attack.value + proficiencyBonus + abilityBonus;
        if (total >= target.ac) {
          const map = new DamageMap();
          const { damage } = weapon;
          if (damage.type === "dice") {
            const { count, size } = damage.amount;
            const amount = yield g.rollDamage(count, {
              size,
              damageType: damage.damageType,
              attacker: who,
              target,
              ability,
              weapon
            });
            map.add(damage.damageType, amount + abilityBonus);
          } else
            map.add(damage.damageType, damage.amount + abilityBonus);
          yield g.damage(map, { source: this, attacker: who, target });
        }
      });
    }
  };

  // src/DndRules.ts
  var CombatantArmourCalculation = class {
    constructor(g) {
      this.g = g;
      g.events.on("getACMethods", ({ detail: { who, methods } }) => {
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
    constructor(g) {
      this.g = g;
      g.events.on("getActions", ({ detail: { who, target, actions } }) => {
        if (who !== target) {
          for (const weapon of who.weapons)
            actions.push(new WeaponAttack(who, weapon));
        }
      });
    }
  };
  var DndRules = class {
    constructor(g) {
      this.g = g;
      new CombatantArmourCalculation(g);
      new CombatantWeaponAttacks(g);
    }
  };

  // src/events/EventBase.ts
  var EventBase = class extends CustomEvent {
    constructor(name, detail) {
      super(name, { detail });
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

  // src/events/TurnStartedEvent.ts
  var TurnStartedEvent = class extends EventBase {
    constructor(detail) {
      super("turnStarted", detail);
    }
  };

  // src/Observable.ts
  var Observable = class {
    constructor(_value) {
      this._value = _value;
      this.listeners = /* @__PURE__ */ new Set();
    }
    on(cb) {
      this.listeners.add(cb);
    }
    off(cb) {
      this.listeners.delete(cb);
    }
    get value() {
      return this._value;
    }
    set(value) {
      this._value = value;
      for (const l of this.listeners)
        l(value);
    }
    setter(value) {
      return () => this.set(value);
    }
  };

  // src/utils/dom.ts
  function make(tag, patch = {}, events = {}) {
    const element = document.createElement(tag);
    Object.assign(element, patch);
    for (const name of Object.keys(events))
      element.addEventListener(
        name,
        events[name]
      );
    return element;
  }
  function getStyleProperty(property, defaultValue) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(property) || defaultValue;
  }
  function getStylePropertyNumber(property, defaultValue) {
    const raw = getStyleProperty(property, px(defaultValue)).trim();
    return Number(raw.endsWith("px") ? raw.slice(0, -2) : raw);
  }
  function px(size) {
    return `${size}px`;
  }

  // src/CssSizeVariable.ts
  var CssSizeVariable = class extends Observable {
    constructor(key, defaultValue) {
      super(getStylePropertyNumber(key, defaultValue));
      this.key = key;
    }
    set(value) {
      document.documentElement.style.setProperty(this.key, px(value));
      super.set(value);
    }
  };

  // src/globals.ts
  var busy = new Observable(false);
  var moveButtonSize = new CssSizeVariable("--movebtn-size", 30);
  var scale = new CssSizeVariable("--scale", 100);

  // src/utils/config.ts
  function checkConfig(action, config) {
    for (const [key, resolver] of Object.entries(action.config)) {
      const value = config[key];
      if (!resolver.check(value))
        return false;
    }
    return true;
  }

  // src/ui/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_1fv7t_1"
  };

  // src/ui/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_epbg7_5",
    "token": "_token_epbg7_9",
    "moveButton": "_moveButton_epbg7_15",
    "moveN": "_moveN_epbg7_30",
    "moveE": "_moveE_epbg7_34",
    "moveS": "_moveS_epbg7_38",
    "moveW": "_moveW_epbg7_42"
  };

  // src/ui/Unit.ts
  var buttonTypes = {
    north: {
      className: Unit_module_default.moveN,
      emoji: "\u2B06\uFE0F",
      label: "North",
      dx: 0,
      dy: -1
    },
    east: { className: Unit_module_default.moveE, emoji: "\u27A1\uFE0F", label: "East", dx: 1, dy: 0 },
    south: { className: Unit_module_default.moveS, emoji: "\u2B07\uFE0F", label: "South", dx: 0, dy: 1 },
    west: { className: Unit_module_default.moveW, emoji: "\u2B05\uFE0F", label: "West", dx: -1, dy: 0 }
  };
  var UnitMoveButton = class {
    constructor(parent, type, onMove) {
      this.parent = parent;
      this.type = type;
      this.onMove = onMove;
      this.onClick = (e) => {
        e.stopPropagation();
        this.onMove(this.type);
      };
      const { className, label } = buttonTypes[type];
      this.element = parent.appendChild(
        make(
          "button",
          {
            className: `${Unit_module_default.moveButton} ${className}`,
            textContent: label
          },
          { click: this.onClick }
        )
      );
    }
    show(value) {
      this.element.style.display = value ? "" : "none";
    }
    resize(size) {
      const offset = (size - moveButtonSize.value) / 2;
      if (this.type === "north" || this.type === "south")
        this.element.style.left = px(offset);
      else
        this.element.style.top = px(offset);
    }
  };
  var Unit = class {
    constructor(g, who, x, y, onRemove) {
      this.g = g;
      this.who = who;
      this.x = x;
      this.y = y;
      this.onRemove = onRemove;
      this.onBusyChange = (value) => {
        for (const btn of this.moveButtons)
          btn.element.disabled = value;
      };
      this.onCombatantDied = ({ detail: { who } }) => {
        if (who === this.who) {
          this.element.remove();
          this.onRemove(this);
        }
      };
      this.onCombatantMoved = ({ detail: { who, x, y } }) => {
        if (who === this.who) {
          this.x = x;
          this.y = y;
          this.update();
        }
      };
      this.onMove = (type) => __async(this, null, function* () {
        const { dx, dy } = buttonTypes[type];
        busy.set(true);
        yield this.g.move(this.who, dx * 5, dy * 5);
        busy.set(false);
      });
      this.onTurnStarted = ({ detail: { who } }) => {
        this.isMyTurn(who === this.who);
      };
      this.element = make("div", { className: Unit_module_default.main });
      this.token = this.element.appendChild(
        make("img", {
          className: Unit_module_default.token,
          alt: who.name,
          src: who.img
        })
      );
      this.moveButtons = [
        new UnitMoveButton(this.element, "north", this.onMove),
        new UnitMoveButton(this.element, "east", this.onMove),
        new UnitMoveButton(this.element, "south", this.onMove),
        new UnitMoveButton(this.element, "west", this.onMove)
      ];
      busy.on(this.onBusyChange);
      scale.on(this.update);
      this.update();
      this.isMyTurn(false);
      g.ui.battlefield.element.appendChild(this.element);
      g.events.on("combatantDied", this.onCombatantDied);
      g.events.on("combatantMoved", this.onCombatantMoved);
      g.events.on("turnStarted", this.onTurnStarted);
    }
    update() {
      const offset = scale.value / 5;
      this.element.style.left = px(this.x * offset);
      this.element.style.top = px(this.y * offset);
      this.size = this.who.sizeInUnits * scale.value;
      this.element.style.width = px(this.size);
      this.element.style.height = px(this.size);
      this.token.style.width = px(this.size);
      this.token.style.height = px(this.size);
      for (const btn of this.moveButtons)
        btn.resize(this.size);
    }
    isMyTurn(value) {
      for (const btn of this.moveButtons)
        btn.show(value);
    }
  };

  // src/ui/Battlefield.ts
  var Battlefield = class {
    constructor(g, onClickBattlefield, onClickCombatant) {
      this.g = g;
      this.onClickCombatant = onClickCombatant;
      this.removeUnit = (unit) => {
        this.units.delete(unit);
      };
      this.onCombatantPlaced = ({ detail: { who, x, y } }) => {
        const unit = new Unit(this.g, who, x, y, this.removeUnit);
        this.units.add(unit);
        unit.element.addEventListener(
          "click",
          (e) => this.onClickCombatant(who, e)
        );
      };
      this.element = make(
        "div",
        { className: Battlefield_module_default.main },
        { click: onClickBattlefield }
      );
      this.units = /* @__PURE__ */ new Set();
      g.container.appendChild(this.element);
      g.events.on("combatantPlaced", this.onCombatantPlaced);
    }
  };

  // src/ui/Menu.module.scss
  var Menu_module_default = {
    "main": "_main_2qfwl_1"
  };

  // src/ui/Menu.ts
  var Menu = class {
    constructor(g, onClick) {
      this.g = g;
      this.onClick = onClick;
      this.element = make("menu", { className: Menu_module_default.main });
      this.empty = this.element.appendChild(
        make("div", { textContent: "(empty)" })
      );
      this.list = [];
      this.hide();
      g.container.appendChild(this.element);
    }
    show(x, y) {
      this.element.style.display = "";
      this.element.style.left = px(x);
      this.element.style.top = px(y);
    }
    hide() {
      this.element.style.display = "none";
    }
    clear() {
      for (const el of this.list)
        this.element.removeChild(el);
      this.list = [];
      this.empty.style.display = "block";
    }
    add(label, value) {
      const li = this.element.appendChild(make("li"));
      li.appendChild(
        make(
          "button",
          { textContent: label },
          { click: () => this.onClick(value) }
        )
      );
      this.list.push(li);
      this.empty.style.display = "none";
    }
  };

  // src/ui/UI.ts
  var UI = class {
    constructor(g) {
      this.g = g;
      this.onClickAction = (action) => __async(this, null, function* () {
        this.actionMenu.hide();
        const config = { target: this.target };
        if (checkConfig(action, config)) {
          busy.set(true);
          yield action.apply(this.g, config);
          busy.set(false);
        } else
          console.warn(config, "does not match", action.config);
      });
      this.onClickBattlefield = () => __async(this, null, function* () {
        this.target = void 0;
        this.actionMenu.hide();
      });
      this.onClickCombatant = (who, e) => __async(this, null, function* () {
        e.stopPropagation();
        if (this.current) {
          this.target = who;
          busy.set(true);
          const actions = yield this.g.getActions(this.current, who);
          busy.set(false);
          this.actionMenu.clear();
          for (const action of actions)
            this.actionMenu.add(action.name, action);
          this.actionMenu.show(e.clientX, e.clientY);
        }
      });
      this.onTurnStarted = ({ detail: { who } }) => {
        this.current = who;
        this.target = void 0;
      };
      this.actionMenu = new Menu(g, this.onClickAction);
      this.battlefield = new Battlefield(
        g,
        this.onClickBattlefield,
        this.onClickCombatant
      );
      g.events.on("turnStarted", this.onTurnStarted);
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
    constructor(container, dice = new DiceBag(), events = new Dispatcher()) {
      this.container = container;
      this.dice = dice;
      this.events = events;
      this.combatants = /* @__PURE__ */ new Map();
      this.initiativeOrder = [];
      this.initiativePosition = NaN;
      this.ui = new UI(this);
      this.rules = new DndRules(this);
    }
    place(who, x, y) {
      this.combatants.set(who, { x, y, initiative: NaN });
      this.events.fire(new CombatantPlacedEvent({ who, x, y }));
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
          const roll = yield this.roll(
            Object.assign({ type: "damage" }, e)
          );
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
    roll(type) {
      return __async(this, null, function* () {
        const roll = this.dice.roll(type);
        const e = new DiceRolledEvent({ type, size: roll.size, value: roll.value });
        this.events.fire(e);
        return e.detail;
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
        const ox = state.x;
        const oy = state.y;
        const x = ox + dx;
        const y = oy + dy;
        state.x = x;
        state.y = y;
        const e = new CombatantMovedEvent({ who, ox, oy, x, y });
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
        for (const [, amount] of damage) {
          total += amount;
        }
        this.events.fire(
          new CombatantDamagedEvent({ who: target, attacker, total })
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
    constructor(g) {
      super("mace", "simple", "melee", dd(1, 6, "bludgeoning"));
      this.g = g;
    }
  };
  var HeavyCrossbow = class extends AbstractWeapon {
    constructor(g) {
      super(
        "heavy crossbow",
        "martial",
        "ranged",
        dd(1, 10, "piercing"),
        ["ammunition", "heavy", "loading", "two-handed"],
        100,
        400
      );
      this.g = g;
      this.ammunitionTag = "crossbow";
    }
  };

  // src/Monster.ts
  var Monster = class extends AbstractCombatant {
    constructor(g, name, cr, type, size, img) {
      super(g, name, { type, size, img, side: 1 });
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
    constructor(g) {
      super("bite", "natural", "melee", {
        type: "flat",
        amount: 1,
        damageType: "piercing"
      });
      this.g = g;
      this.hands = 0;
      this.forceAbilityScore = "dex";
    }
  };
  var Badger = class extends Monster {
    constructor(g) {
      super(
        g,
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
      this.naturalWeapons.add(new Bite(g));
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
    constructor(g) {
      super("leather armor", "light", 11);
      this.g = g;
    }
  };

  // src/monsters/Thug.ts
  var Thug = class extends Monster {
    constructor(g) {
      super(
        g,
        "thug",
        0.5,
        "humanoid",
        "medium",
        "https://5e.tools/img/MM/Thug.png"
      );
      this.don(new LeatherArmor(g), true);
      this.hp = this.hpMax = 32;
      this.movement.set("speed", 30);
      this.strScore = 15;
      this.dexScore = 11;
      this.conScore = 14;
      this.intScore = 10;
      this.wisScore = 10;
      this.chaScore = 11;
      this.skills.set("Intimidation", 1);
      this.languages.add("common");
      this.pb = 2;
      this.don(new Mace(g), true);
      this.don(new HeavyCrossbow(g), true);
    }
  };

  // src/index.ts
  window.addEventListener("load", () => {
    const g = new Engine(document.body);
    window.g = g;
    const thug = new Thug(g);
    const badger = new Badger(g);
    g.place(thug, 0, 0);
    g.place(badger, 10, 0);
  });
})();
//# sourceMappingURL=bundle.js.map
