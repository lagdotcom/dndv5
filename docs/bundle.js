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
  var AbstractCombatant = class {
    constructor(g, name, type, size, img, side, diesAtZero) {
      this.g = g;
      this.name = name;
      this.type = type;
      this.size = size;
      this.img = img;
      this.side = side;
      this.diesAtZero = diesAtZero;
      this.strScore = 10;
      this.dexScore = 10;
      this.conScore = 10;
      this.intScore = 10;
      this.wisScore = 10;
      this.chaScore = 10;
      this.hp = 0;
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
      return 10 + this.dex;
    }
    get sizeInUnits() {
      return convertSizeToUnit(this.size);
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

  // src/actions/UnarmedStrike.ts
  var UnarmedStrike = class {
    constructor(who) {
      this.who = who;
      this.config = { target: new TargetResolver(5) };
      this.name = "Unarmed Strike";
    }
    apply(_0, _1) {
      return __async(this, arguments, function* (g, { target }) {
        const { who } = this;
        const attack = yield g.roll({ type: "attack", who, target });
        const bonus = who.str;
        if (attack.value + bonus >= target.ac) {
          const damage = new DamageMap(["bludgeoning", 1 + who.str]);
          yield g.damage(damage, { source: this, attacker: who, target });
        }
      });
    }
  };

  // src/DndRules.ts
  var CombatantAttackRule = class {
    constructor(g) {
      this.g = g;
      g.events.on("getActions", ({ detail: { who, target, actions } }) => {
        if (who !== target)
          actions.push(new UnarmedStrike(who));
      });
    }
  };
  var DndRules = class {
    constructor(g) {
      this.g = g;
      new CombatantAttackRule(g);
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
  var make = document.createElement.bind(document);
  function configure(element, patch, events = {}) {
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
        configure(
          make("button"),
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
      this.element = configure(make("div"), { className: Unit_module_default.main });
      this.token = this.element.appendChild(
        configure(make("img"), {
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
      this.element = configure(
        make("div"),
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
      this.element = configure(make("menu"), { className: Menu_module_default.main });
      this.empty = this.element.appendChild(
        configure(make("div"), { textContent: "(empty)" })
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
        configure(
          make("button"),
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
    rollDamage(_0, _1, _2, _3) {
      return __async(this, arguments, function* ({ count, size }, damage, attacker, target) {
        let total = 0;
        for (let i = 0; i < count; i++) {
          const roll = yield this.roll({
            type: "damage",
            attacker,
            target,
            size,
            damage
          });
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
  };

  // src/Monster.ts
  var Monster = class extends AbstractCombatant {
    constructor(g, name, type, size, img) {
      super(g, name, type, size, img, 1, true);
    }
  };

  // src/PC.ts
  var PC = class extends AbstractCombatant {
    constructor(g, name, raceName, img) {
      super(g, name, "humanoid", "medium", img, 0, false);
    }
  };

  // src/index.ts
  window.addEventListener("load", () => {
    const g = new Engine(document.body);
    window.g = g;
    const pc = new PC(g, "Tester", "Human", "https://5e.tools/img/MM/Thug.png");
    const mon = new Monster(
      g,
      "Badger",
      "beast",
      "tiny",
      "https://5e.tools/img/MM/Badger.png"
    );
    g.place(pc, 0, 0);
    g.place(mon, 10, 0);
  });
})();
//# sourceMappingURL=bundle.js.map
