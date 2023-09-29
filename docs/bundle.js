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
    for (var prop in b || (b = {}))
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
  var import_preact4 = __toESM(require_preact());

  // src/collectors/AbstractCollector.ts
  var AbstractCollector = class {
    constructor() {
      this.entries = /* @__PURE__ */ new Set();
      this.ignoredSources = /* @__PURE__ */ new Set();
      this.ignoredValues = /* @__PURE__ */ new Set();
    }
    add(value, source) {
      this.entries.add({ value, source });
    }
    ignore(source) {
      this.ignoredSources.add(source);
    }
    ignoreValue(value) {
      this.ignoredValues.add(value);
    }
    isInvolved(source) {
      if (this.ignoredSources.has(source))
        return false;
      for (const entry of this.entries)
        if (entry.source === source && !this.ignoredValues.has(entry.value))
          return true;
      return false;
    }
    getValidEntries() {
      return Array.from(this.entries).filter(
        (entry) => !(this.ignoredSources.has(entry.source) || this.ignoredValues.has(entry.value))
      ).map((entry) => entry.value);
    }
  };
  var AbstractSumCollector = class extends AbstractCollector {
    get result() {
      return this.getSum(this.getValidEntries());
    }
  };
  var SetCollector = class extends AbstractCollector {
    get result() {
      return new Set(this.getValidEntries());
    }
  };

  // src/collectors/BonusCollector.ts
  var BonusCollector = class extends AbstractSumCollector {
    getSum(values) {
      return values.reduce((total, value) => total + value, 0);
    }
  };

  // src/collectors/DamageResponseCollector.ts
  var priority = ["absorb", "immune", "resist", "vulnerable"];
  var DamageResponseCollector = class extends AbstractSumCollector {
    getSum(values) {
      for (const p of priority) {
        if (values.includes(p))
          return p;
      }
      return "normal";
    }
  };

  // src/collectors/DiceTypeCollector.ts
  var DiceTypeCollector = class extends AbstractSumCollector {
    getSum(values) {
      const hasAdvantage = values.includes("advantage");
      const hasDisadvantage = values.includes("disadvantage");
      if (hasAdvantage === hasDisadvantage)
        return "normal";
      return hasAdvantage ? "advantage" : "disadvantage";
    }
  };

  // src/collectors/ErrorCollector.ts
  var ErrorCollector = class {
    constructor() {
      this.errors = /* @__PURE__ */ new Set();
      this.ignored = /* @__PURE__ */ new Set();
    }
    add(value, source) {
      this.errors.add({ value, source });
    }
    ignore(source) {
      this.ignored.add(source);
    }
    get valid() {
      return Array.from(this.errors).filter(
        (entry) => !this.ignored.has(entry.source)
      );
    }
    get messages() {
      return this.valid.map((entry) => `${entry.value} (${entry.source.name})`);
    }
    get result() {
      return this.valid.length === 0;
    }
  };

  // src/collectors/InterruptionCollector.ts
  var InterruptionCollector = class extends Set {
  };

  // src/collectors/MultiplierCollector.ts
  var MultiplierCollector = class extends AbstractSumCollector {
    getSum(values) {
      let power = 0;
      for (const value of values) {
        if (value === "double")
          power++;
        else if (value === "half")
          power--;
        else if (value === "zero")
          return 0;
      }
      return 2 ** power;
    }
  };

  // src/collectors/SaveDamageResponseCollector.ts
  var SaveDamageResponseCollector = class extends AbstractSumCollector {
    constructor(fallback) {
      super();
      this.fallback = fallback;
    }
    getSum(values) {
      if (values.includes("zero"))
        return "zero";
      if (values.includes("half"))
        return "half";
      return this.fallback;
    }
  };

  // src/collectors/SuccessResponseCollector.ts
  var SuccessResponseCollector = class extends AbstractSumCollector {
    getSum(values) {
      if (values.includes("success"))
        return "success";
      if (values.includes("fail"))
        return "fail";
      return "normal";
    }
  };

  // src/DamageMap.ts
  var DamageMap = class extends Map {
    constructor(items = []) {
      super(items);
    }
    get total() {
      let total = 0;
      for (const amount of this.values())
        total += amount;
      return total;
    }
    add(type, value) {
      var _a;
      const old = (_a = this.get(type)) != null ? _a : 0;
      this.set(type, old + value);
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
      case "heal":
        return rt.size;
      case "bane":
      case "bless":
        return 4;
      case "attack":
      case "check":
      case "initiative":
      case "luck":
      case "save":
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
    roll(rt, dt = "normal") {
      var _a, _b;
      const size = sizeOfDice(rt);
      let value = (_a = this.getForcedRoll(rt)) != null ? _a : Math.ceil(Math.random() * size);
      const otherValues = [];
      if (dt !== "normal") {
        const second = (_b = this.getForcedRoll(rt)) != null ? _b : Math.ceil(Math.random() * size);
        if (dt === "advantage" && second > value || dt === "disadvantage" && value > second) {
          otherValues.push(value);
          value = second;
        } else
          otherValues.push(second);
      }
      return { size, value, otherValues };
    }
  };

  // src/DndRule.ts
  var RuleRepository = /* @__PURE__ */ new Set();
  var DndRule = class {
    constructor(name, setup) {
      this.name = name;
      this.setup = setup;
      RuleRepository.add(this);
    }
  };

  // src/Effect.ts
  var Effect = class {
    constructor(name, durationTimer, setup, quiet = false, tags = []) {
      this.name = name;
      this.durationTimer = durationTimer;
      this.quiet = quiet;
      this.tags = new Set(tags);
      if (setup)
        this.rule = new DndRule(name, setup);
    }
  };

  // src/actions/AbstractAction.ts
  var AbstractAction = class {
    constructor(g2, actor, name, status, config, { area, damage, heal, resources, time } = {}) {
      this.g = g2;
      this.actor = actor;
      this.name = name;
      this.status = status;
      this.config = config;
      this.area = area;
      this.damage = damage;
      this.heal = heal;
      this.resources = new Map(resources);
      this.time = time;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAffectedArea(config) {
      return this.area;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getConfig(config) {
      return this.config;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDamage(config) {
      return this.damage;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getHeal(config) {
      return this.heal;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getResources(config) {
      return this.resources;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getTime(config) {
      return this.time;
    }
    check(config, ec) {
      const time = this.getTime(config);
      if (time && !this.actor.time.has(time))
        ec.add(`No ${time} left`, this);
      for (const [resource, cost] of this.getResources(config))
        if (!this.actor.hasResource(resource, cost))
          ec.add(`Not enough ${resource.name} left`, this);
      return ec;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    apply(config) {
      return __async(this, null, function* () {
        const time = this.getTime(config);
        if (time)
          this.actor.time.delete(time);
        for (const [resource, cost] of this.getResources(config))
          this.actor.spendResource(resource, cost);
      });
    }
  };

  // src/actions/DashAction.ts
  var DashEffect = new Effect("Dash", "turnEnd", (g2) => {
    g2.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.hasEffect(DashEffect))
        multiplier.add("double", DashEffect);
    });
  });
  var DashAction = class _DashAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "Dash", "implemented", {}, { time: "action" });
    }
    check(config, ec) {
      if (this.actor.speed <= 0)
        ec.add("Zero speed", this);
      return super.check(config, ec);
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_DashAction.prototype, this, "apply").call(this, {});
        yield this.actor.addEffect(DashEffect, { duration: 1 });
      });
    }
  };

  // src/actions/DisengageAction.ts
  var DisengageEffect = new Effect("Disengage", "turnEnd", () => {
  });
  var DisengageAction = class _DisengageAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "Disengage", "missing", {}, { time: "action" });
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_DisengageAction.prototype, this, "apply").call(this, {});
        yield this.actor.addEffect(DisengageEffect, { duration: 1 });
      });
    }
  };

  // src/actions/DodgeAction.ts
  function canDodge(who) {
    return who.hasEffect(DodgeEffect) && who.speed > 0 && !who.conditions.has("Incapacitated");
  }
  var DodgeEffect = new Effect("Dodge", "turnStart", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
      if (canDodge(target))
        diceType.add("disadvantage", DodgeEffect);
    });
    g2.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
      if (canDodge(who))
        diceType.add("advantage", DodgeEffect);
    });
  });
  var DodgeAction = class _DodgeAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "Dodge", "incomplete", {}, { time: "action" });
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_DodgeAction.prototype, this, "apply").call(this, {});
        yield this.actor.addEffect(DodgeEffect, { duration: 1 });
      });
    }
  };

  // src/colours.ts
  var ItemRarityColours = {
    Common: "#242528",
    Uncommon: "#1FC219",
    Rare: "#4990E2",
    "Very Rare": "#9810E0",
    Legendary: "#FEA227",
    Artifact: "#BE8972"
  };
  function getItemIcon(item) {
    if (item == null ? void 0 : item.iconUrl)
      return { url: item.iconUrl, colour: ItemRarityColours[item.rarity] };
  }

  // src/types/AbilityName.ts
  var AbilityNames = ["str", "dex", "con", "int", "wis", "cha"];
  var abSet = (...items) => new Set(items);

  // src/utils/types.ts
  function isDefined(value) {
    return typeof value !== "undefined";
  }
  function isA(value, enumeration) {
    return enumeration.includes(value);
  }
  function isCombatantArray(value) {
    if (!Array.isArray(value))
      return false;
    for (const who of value)
      if (!(who instanceof AbstractCombatant))
        return false;
    return true;
  }
  function isPoint(value) {
    return typeof value === "object" && typeof value.x === "number" && typeof value.y === "number";
  }
  function isPointArray(value) {
    if (!Array.isArray(value))
      return false;
    for (const point of value)
      if (!isPoint(point))
        return false;
    return true;
  }

  // src/utils/dnd.ts
  function getAbilityModifier(ability) {
    return Math.floor((ability - 10) / 2);
  }
  function getDiceAverage(count, size) {
    return (size + 1) / 2 * count;
  }
  function getProficiencyBonusByLevel(level) {
    return Math.ceil(level / 4) + 1;
  }
  function getProficiencyType(thing) {
    if (typeof thing === "string") {
      if (isA(thing, AbilityNames))
        return { type: "ability", ability: thing };
      return { type: "skill", skill: thing };
    }
    if (thing.itemType === "weapon")
      return {
        type: "weapon",
        category: thing.category,
        weapon: thing.weaponType
      };
    if (thing.itemType === "armor")
      return { type: "armor", category: thing.category };
  }
  function getSaveDC(who, ability) {
    return 8 + who.pb + who[ability].modifier;
  }
  var getNaturalArmourMethod = (who, naturalAC) => {
    const uses = /* @__PURE__ */ new Set();
    let ac = naturalAC + who.dex.modifier;
    if (who.shield) {
      uses.add(who.shield);
      ac += who.shield.ac;
    }
    return { name: "natural armor", ac, uses };
  };

  // src/AbilityScore.ts
  var AbilityScore = class {
    constructor(baseScore = 10, baseMaximum = 20) {
      this.baseScore = baseScore;
      this.baseMaximum = baseMaximum;
    }
    get score() {
      return Math.min(this.baseScore, this.maximum);
    }
    set score(value) {
      this.baseScore = value;
    }
    get maximum() {
      return this.baseMaximum;
    }
    set maximum(value) {
      this.baseMaximum = value;
    }
    get modifier() {
      return getAbilityModifier(this.score);
    }
    setMaximum(value) {
      this.baseMaximum = Math.max(this.baseMaximum, value);
    }
    setScore(value) {
      this.baseScore = value;
    }
  };

  // src/collectors/ConditionCollector.ts
  var ConditionCollector = class extends SetCollector {
  };

  // src/events/BeforeEffectEvent.ts
  var BeforeEffectEvent = class extends CustomEvent {
    constructor(detail) {
      super("BeforeEffect", { detail });
    }
  };

  // src/events/EffectAddedEvent.ts
  var EffectAddedEvent = class extends CustomEvent {
    constructor(detail) {
      super("EffectAdded", { detail });
    }
  };

  // src/events/EffectRemovedEvent.ts
  var EffectRemovedEvent = class extends CustomEvent {
    constructor(detail) {
      super("EffectRemoved", { detail });
    }
  };

  // src/events/ExhaustionEvent.ts
  var ExhaustionEvent = class extends CustomEvent {
    constructor(detail) {
      super("Exhaustion", { detail });
    }
  };

  // src/events/GetConditionsEvent.ts
  var GetConditionsEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetConditions", { detail });
    }
  };

  // src/events/GetSpeedEvent.ts
  var GetSpeedEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetSpeed", { detail });
    }
  };

  // src/Polygon.ts
  var Polygon = class {
    constructor(points) {
      this.points = points;
      const lines = [];
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const a = points[i];
        const b = points[j];
        lines.push([a, b]);
      }
      this.lines = lines;
    }
    containsPoint({ x, y }) {
      let inside = false;
      for (const line of this.lines) {
        const [a, b] = line;
        if (a.y > y != b.y > y && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x)
          inside = !inside;
      }
      return inside;
    }
  };

  // src/utils/set.ts
  function hasAll(set, matches2) {
    if (!set)
      return false;
    for (const item of matches2)
      if (!set.has(item))
        return false;
    return true;
  }
  function intersects(a, b) {
    for (const item of a)
      if (b.has(item))
        return true;
    return false;
  }
  function* mapSet(values, fn) {
    let index = 0;
    for (const item of values)
      yield fn(item, index++, values);
  }

  // src/PointSet.ts
  function asPoint(tag) {
    const [x, y] = tag.split(",").map(Number);
    return { x, y };
  }
  var asTag = ({ x, y }) => `${x},${y}`;
  var PointSet = class {
    constructor(points = []) {
      this.set = new Set(mapSet(points, asTag));
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
    overlaps(ps) {
      for (const point of ps) {
        if (this.has(point))
          return true;
      }
      return false;
    }
    *[Symbol.iterator]() {
      for (const tag of this.set)
        yield asPoint(tag);
    }
  };

  // src/utils/areas.ts
  function resolvePolygon(points) {
    const poly = new Polygon(points);
    const set = new PointSet();
    for (const square of getAllMapSquaresContainingPolygon(poly)) {
      if (poly.containsPoint(square.getMiddle()))
        set.add(square.getTopLeft());
    }
    return set;
  }
  function getBoundingBox(points) {
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    for (const { x, y } of points) {
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
    return { x: left, y: top, w: right - left, h: bottom - top };
  }
  function getTilesWithinCircle(centre, radius) {
    const set = new PointSet();
    for (const square of getAllMapSquaresContainingCircle(centre, radius)) {
      const midpoint = square.getMiddle();
      const dx = midpoint.x - centre.x;
      const dy = midpoint.y - centre.y;
      const distance2 = Math.sqrt(dx * dx + dy * dy);
      if (distance2 <= radius)
        set.add(square.getTopLeft());
    }
    return set;
  }
  function getRectangleAsPolygon({ x, y }, width, height) {
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height }
    ];
  }
  function getTilesWithinRectangle(topLeft, width, height) {
    return resolvePolygon(getRectangleAsPolygon(topLeft, width, height));
  }
  function getLineAsPolygon({ x: sx, y: sy }, { x: tx, y: ty }, width, length) {
    const dir = Math.atan2(ty - sy, tx - sx);
    const off = dir - Math.PI / 2;
    const xd = length * Math.cos(dir);
    const yd = length * Math.sin(dir);
    const w2 = width / 2;
    const xo = w2 * Math.cos(off);
    const yo = w2 * Math.sin(off);
    const ax = sx + xo;
    const ay = sy + yo;
    const bx = sx - xo;
    const by = sy - yo;
    const cx = bx + xd;
    const cy = by + yd;
    const dx = ax + xd;
    const dy = ay + yd;
    return [
      { x: ax, y: ay },
      { x: bx, y: by },
      { x: cx, y: cy },
      { x: dx, y: dy }
    ];
  }
  function getTilesWithinLine(start, end, width, length) {
    return resolvePolygon(getLineAsPolygon(start, end, width, length));
  }
  function getConeAsPolygon({ x: sx, y: sy }, { x: tx, y: ty }, radius) {
    const dir = Math.atan2(ty - sy, tx - sx);
    const off = dir - Math.PI / 2;
    const xd = radius * Math.cos(dir);
    const yd = radius * Math.sin(dir);
    const w2 = radius / 2;
    const xo = w2 * Math.cos(off);
    const yo = w2 * Math.sin(off);
    const ax = sx + xd + xo;
    const ay = sy + yd + yo;
    const bx = sx + xd - xo;
    const by = sy + yd - yo;
    return [
      { x: sx, y: sy },
      { x: ax, y: ay },
      { x: bx, y: by }
    ];
  }
  function getTilesWithinCone(start, end, radius) {
    return resolvePolygon(getConeAsPolygon(start, end, radius));
  }
  function resolveArea(area) {
    switch (area.type) {
      case "cylinder":
      case "sphere":
        return getTilesWithinCircle(area.centre, area.radius);
      case "within": {
        const x = area.position.x - area.radius;
        const y = area.position.y - area.radius;
        const size = area.target.sizeInUnits + area.radius * 2;
        return getTilesWithinRectangle({ x, y }, size, size);
      }
      case "cone":
        return getTilesWithinCone(area.centre, area.target, area.radius);
      case "line":
        return getTilesWithinLine(
          area.start,
          area.target,
          area.width,
          area.length
        );
    }
  }

  // src/utils/numbers.ts
  function modulo(value, max) {
    return value % max;
  }
  function round(n, size) {
    return Math.floor(n / size) * size;
  }
  function roundUp(n, size) {
    return Math.ceil(n / size) * size;
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
  function clamp(n, min, max) {
    return Math.min(max, Math.max(n, min));
  }

  // src/MapSquare.ts
  var MapSquareSize = 5;
  var HalfSquare = MapSquareSize / 2;
  var MapSquare = class extends Polygon {
    constructor(x, y) {
      super([
        { x, y },
        { x: x + MapSquareSize, y },
        { x: x + MapSquareSize, y: y + MapSquareSize },
        { x, y: y + MapSquareSize }
      ]);
      this.x = x;
      this.y = y;
    }
    getTopLeft() {
      return { x: this.x, y: this.y };
    }
    getMiddle() {
      return { x: this.x + HalfSquare, y: this.y + HalfSquare };
    }
  };
  function* enumerateMapSquares(minX, minY, maxX, maxY) {
    for (let y = minY; y < maxY; y += MapSquareSize)
      for (let x = minX; x < maxX; x += MapSquareSize)
        yield new MapSquare(x, y);
  }
  function getAllMapSquaresContainingPolygon(poly) {
    const box = getBoundingBox(poly.points);
    const minX = round(box.x, MapSquareSize);
    const minY = round(box.y, MapSquareSize);
    const maxX = roundUp(box.x + box.w, MapSquareSize);
    const maxY = roundUp(box.y + box.h, MapSquareSize);
    return enumerateMapSquares(minX, minY, maxX, maxY);
  }
  function getAllMapSquaresContainingCircle(centre, radius) {
    const minX = round(centre.x - radius, MapSquareSize);
    const minY = round(centre.y - radius, MapSquareSize);
    const maxX = roundUp(centre.x + radius, MapSquareSize);
    const maxY = roundUp(centre.y + radius, MapSquareSize);
    return enumerateMapSquares(minX, minY, maxX, maxY);
  }

  // src/events/SpellCastEvent.ts
  var SpellCastEvent = class extends CustomEvent {
    constructor(detail) {
      super("SpellCast", { detail });
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
      this.isSpell = true;
      this.time = spell.time;
      this.icon = spell.icon;
      this.subIcon = method.icon;
    }
    get status() {
      return this.spell.status;
    }
    getConfig(config) {
      return this.spell.getConfig(this.g, this.actor, this.method, config);
    }
    getAffectedArea(config) {
      return this.spell.getAffectedArea(this.g, this.actor, config);
    }
    getDamage(config) {
      return this.spell.getDamage(this.g, this.actor, this.method, config);
    }
    getHeal(config) {
      return this.spell.getHeal(this.g, this.actor, this.method, config);
    }
    getResources(config) {
      var _a;
      const level = this.spell.scaling ? (_a = config.slot) != null ? _a : this.spell.level : this.spell.level;
      const resource = this.method.getResourceForSpell(
        this.spell,
        level,
        this.actor
      );
      return new Map(resource ? [[resource, 1]] : void 0);
    }
    getTime() {
      return this.time;
    }
    check(config, ec) {
      if (!this.actor.time.has(this.spell.time))
        ec.add(`No ${this.spell.time} left`, this);
      for (const [resource, amount] of this.getResources(config))
        if (!this.actor.hasResource(resource, amount))
          ec.add(`Not enough ${resource.name} left`, this.method);
      return this.spell.check(this.g, config, ec);
    }
    apply(config) {
      return __async(this, null, function* () {
        const { actor, g: g2, method, spell } = this;
        actor.time.delete(spell.time);
        for (const [resource, amount] of this.getResources(config))
          actor.spendResource(resource, amount);
        const sc = yield g2.resolve(
          new SpellCastEvent({
            who: actor,
            spell,
            method,
            level: spell.getLevel(config),
            targets: new Set(spell.getTargets(g2, actor, config)),
            interrupt: new InterruptionCollector(),
            success: new SuccessResponseCollector()
          })
        );
        if (sc.detail.success.result === "fail")
          return;
        return spell.apply(g2, actor, method, config);
      });
    }
  };

  // src/resolvers/SlotResolver.ts
  var SlotResolver = class {
    constructor(spell, method) {
      this.spell = spell;
      this.method = method;
      this.name = "spell slot";
      this.type = "SpellSlot";
    }
    getMinimum(who) {
      return this.method.getMinSlot(this.spell, who);
    }
    getMaximum(who) {
      return this.method.getMaxSlot(this.spell, who);
    }
    check(value, action, ec) {
      if (action instanceof CastSpell)
        this.method = action.method;
      if (typeof value !== "number")
        ec.add("No spell level chosen", this);
      else {
        if (value < this.getMinimum(action.actor))
          ec.add("Too low", this);
        if (value > this.getMaximum(action.actor))
          ec.add("Too high", this);
      }
      return ec;
    }
  };

  // src/spells/common.ts
  function getCantripDice(who) {
    if (who.level < 5)
      return 1;
    if (who.level < 11)
      return 2;
    if (who.level < 17)
      return 3;
    return 4;
  }
  var simpleSpell = ({
    name,
    level,
    ritual = false,
    school,
    concentration = false,
    time = "action",
    v = false,
    s = false,
    m,
    lists,
    icon,
    apply,
    check = (_g, _config, ec) => ec,
    getAffectedArea = () => void 0,
    getConfig,
    getDamage = () => void 0,
    getHeal = () => void 0,
    getTargets,
    status = "missing"
  }) => ({
    status,
    name,
    level,
    ritual,
    scaling: false,
    school,
    concentration,
    time,
    v,
    s,
    m,
    lists,
    icon,
    apply,
    check,
    getAffectedArea,
    getConfig,
    getDamage,
    getHeal,
    getLevel() {
      return level;
    },
    getTargets
  });
  var scalingSpell = ({
    name,
    level,
    ritual = false,
    school,
    concentration = false,
    time = "action",
    v = false,
    s = false,
    m,
    lists,
    icon,
    apply,
    check = (_g, _config, ec) => ec,
    getAffectedArea = () => void 0,
    getConfig,
    getDamage = () => void 0,
    getHeal = () => void 0,
    getTargets,
    status = "missing"
  }) => ({
    status,
    name,
    level,
    ritual,
    scaling: true,
    school,
    concentration,
    time,
    v,
    s,
    m,
    lists,
    icon,
    apply,
    check,
    getAffectedArea,
    getConfig(g2, actor, method, config) {
      return __spreadProps(__spreadValues({}, getConfig(g2, actor, method, config)), {
        slot: new SlotResolver(this, method)
      });
    },
    getDamage,
    getHeal,
    getLevel({ slot }) {
      return slot;
    },
    getTargets
  });
  function spellImplementationWarning(spell, owner) {
    if (spell.status === "incomplete")
      console.warn(`[Spell Not Complete] ${spell.name} (on ${owner.name})`);
    else if (spell.status === "missing")
      console.warn(`[Spell Missing] ${spell.name} (on ${owner.name})`);
  }

  // src/utils/items.ts
  var isSuitOfArmor = (item) => item.itemType === "armor" && item.category !== "shield";
  var isShield = (item) => item.itemType === "armor" && item.category === "shield";
  function getWeaponAbility(who, weapon) {
    if (weapon.forceAbilityScore)
      return weapon.forceAbilityScore;
    const { str, dex } = who;
    if (weapon.properties.has("finesse") && dex.score >= str.score)
      return "dex";
    if (weapon.rangeCategory === "ranged")
      return "dex";
    return "str";
  }
  function getWeaponRange(who, weapon) {
    if (isDefined(weapon.longRange))
      return weapon.longRange;
    return who.reach + weapon.reach;
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
    return categoryUnits[size] * MapSquareSize;
  }
  function getDistanceBetween(posA, sizeA, posB, sizeB) {
    const dx = Math.abs(posA.x - posB.x);
    const dy = Math.abs(posA.y - posB.y);
    return Math.max(dx, dy);
  }
  function distance(g2, a, b) {
    const as = g2.getState(a);
    const bs = g2.getState(b);
    return getDistanceBetween(
      as.position,
      a.sizeInUnits,
      bs.position,
      b.sizeInUnits
    );
  }
  function distanceTo(g2, who, to) {
    const s = g2.getState(who);
    return getDistanceBetween(s.position, who.sizeInUnits, to, MapSquareSize);
  }
  function getSquares(who, position) {
    return new PointSet(
      enumerateMapSquares(
        position.x,
        position.y,
        position.x + who.sizeInUnits,
        position.y + who.sizeInUnits
      )
    );
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
      reach = MapSquareSize,
      chaScore = 10,
      conScore = 10,
      dexScore = 10,
      intScore = 10,
      strScore = 10,
      wisScore = 10,
      naturalAC = 10
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
      this.str = new AbilityScore(strScore);
      this.dex = new AbilityScore(dexScore);
      this.con = new AbilityScore(conScore);
      this.int = new AbilityScore(intScore);
      this.wis = new AbilityScore(wisScore);
      this.cha = new AbilityScore(chaScore);
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
      this.attacksSoFar = [];
      this.effects = /* @__PURE__ */ new Map();
      this.knownSpells = /* @__PURE__ */ new Set();
      this.preparedSpells = /* @__PURE__ */ new Set();
      this.toolProficiencies = /* @__PURE__ */ new Map();
      this.resourcesMax = /* @__PURE__ */ new Map();
      this.spellcastingMethods = /* @__PURE__ */ new Set();
      this.naturalAC = naturalAC;
      this.damageResponses = /* @__PURE__ */ new Map();
      this.exhaustion = 0;
      this.temporaryHP = 0;
    }
    get baseACMethod() {
      return getNaturalArmourMethod(this, this.naturalAC);
    }
    get acMethod() {
      return this.g.getBestACMethod(this);
    }
    get baseAC() {
      return this.acMethod.ac;
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
        new GetConditionsEvent({
          who: this,
          conditions: new ConditionCollector()
        })
      ).detail.conditions.result;
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
      return bonus.result * e.detail.multiplier.result;
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
      this.str.setScore(str);
      this.dex.setScore(dex);
      this.con.setScore(con);
      this.int.setScore(int);
      this.wis.setScore(wis);
      this.cha.setScore(cha);
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
      const prof = getProficiencyType(thing);
      switch (prof == null ? void 0 : prof.type) {
        case "ability":
          return this.saveProficiencies.has(prof.ability) ? 1 : 0;
        case "armor":
          return this.armorProficiencies.has(prof.category) ? 1 : 0;
        case "skill":
          return (_a = this.skills.get(prof.skill)) != null ? _a : 0;
        case "weapon":
          if (prof.category === "natural")
            return 1;
          if (this.weaponCategoryProficiencies.has(prof.category))
            return 1;
          if (this.weaponProficiencies.has(prof.weapon))
            return 1;
      }
      return 0;
    }
    initResource(resource, amount = resource.maximum, max = amount) {
      this.resources.set(resource.name, amount);
      this.resourcesMax.set(resource.name, max);
    }
    giveResource(resource, amount) {
      var _a;
      const old = (_a = this.resources.get(resource.name)) != null ? _a : 0;
      this.resources.set(
        resource.name,
        Math.min(old + amount, this.getResourceMax(resource))
      );
    }
    hasResource(resource, amount = 1) {
      var _a;
      return ((_a = this.resources.get(resource.name)) != null ? _a : 0) >= amount;
    }
    refreshResource(resource) {
      this.resources.set(resource.name, this.getResourceMax(resource));
    }
    spendResource(resource, amount = 1) {
      var _a;
      const old = (_a = this.resources.get(resource.name)) != null ? _a : 0;
      if (old < amount)
        throw new Error(`Cannot spend ${amount} of ${resource.name} resource`);
      this.resources.set(resource.name, old - amount);
    }
    getResource(resource) {
      var _a;
      return (_a = this.resources.get(resource.name)) != null ? _a : 0;
    }
    getResourceMax(resource) {
      var _a;
      return (_a = this.resourcesMax.get(resource.name)) != null ? _a : resource.maximum;
    }
    removeResource(resource) {
      this.resources.delete(resource.name);
    }
    getConfig(key) {
      return this.configs.get(key);
    }
    setConfig(feature, config) {
      this.configs.set(feature.name, config);
    }
    endConcentration() {
      return __async(this, null, function* () {
        for (const other of this.concentratingOn)
          yield other.onSpellEnd();
        this.concentratingOn.clear();
      });
    }
    concentrateOn(entry) {
      return __async(this, null, function* () {
        yield this.endConcentration();
        this.concentratingOn.add(entry);
      });
    }
    finalise() {
      for (const feature of this.features.values())
        feature.setup(this.g, this, this.getConfig(feature.name));
      this.hp = this.hpMax;
      for (const spell of this.preparedSpells)
        spellImplementationWarning(spell, this);
    }
    addEffect(effect, config, attacker) {
      return __async(this, null, function* () {
        const e = yield this.g.resolve(
          new BeforeEffectEvent({
            who: this,
            effect,
            config,
            attacker,
            interrupt: new InterruptionCollector(),
            success: new SuccessResponseCollector()
          })
        );
        if (e.detail.success.result === "fail")
          return false;
        this.effects.set(effect, config);
        yield this.g.resolve(
          new EffectAddedEvent({
            who: this,
            effect,
            config,
            interrupt: new InterruptionCollector()
          })
        );
        return true;
      });
    }
    getEffectConfig(effect) {
      return this.effects.get(effect);
    }
    hasEffect(effect) {
      return this.effects.has(effect);
    }
    removeEffect(effect) {
      return __async(this, null, function* () {
        const config = this.getEffectConfig(effect);
        if (config) {
          this.effects.delete(effect);
          yield this.g.resolve(
            new EffectRemovedEvent({
              who: this,
              effect,
              config,
              interrupt: new InterruptionCollector()
            })
          );
          return true;
        }
        return false;
      });
    }
    tickEffects(durationTimer) {
      return __async(this, null, function* () {
        for (const [effect, config] of this.effects) {
          if (effect.durationTimer === durationTimer && --config.duration < 1)
            yield this.removeEffect(effect);
        }
      });
    }
    addKnownSpells(...spells) {
      for (const spell of spells)
        this.knownSpells.add(spell);
    }
    addPreparedSpells(...spells) {
      for (const spell of spells) {
        this.knownSpells.add(spell);
        this.preparedSpells.add(spell);
      }
    }
    changeExhaustion(delta) {
      return __async(this, null, function* () {
        const old = this.exhaustion;
        const value = clamp(this.exhaustion + delta, 0, 6);
        const e = new ExhaustionEvent({
          who: this,
          old,
          delta,
          value,
          interrupt: new InterruptionCollector(),
          success: new SuccessResponseCollector()
        });
        yield this.g.resolve(e);
        if (e.detail.success.result !== "fail")
          this.exhaustion = value;
        return this.exhaustion;
      });
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
    check(value, action, ec) {
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

  // src/types/ConditionName.ts
  var coSet = (...items) => new Set(items);

  // src/effects.ts
  var Dead = new Effect(
    "Dead",
    "turnStart",
    (g2) => {
      g2.events.on("GetConditions", ({ detail: { conditions, who } }) => {
        if (who.hasEffect(Dead)) {
          conditions.add("Incapacitated", Dead);
          conditions.add("Prone", Dead);
          conditions.add("Unconscious", Dead);
        }
      });
    },
    true
  );
  var UsedAttackAction = new Effect(
    "Used Attack Action",
    "turnStart",
    void 0,
    true
  );
  var DropProneAction = class _DropProneAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "Drop Prone", "implemented", {});
    }
    check(config, ec) {
      if (this.actor.conditions.has("Prone"))
        ec.add("already prone", this);
      return super.check(config, ec);
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_DropProneAction.prototype, this, "apply").call(this, {});
        yield this.actor.addEffect(Prone, {
          conditions: coSet("Prone"),
          duration: Infinity
        });
      });
    }
  };
  var StandUpAction = class _StandUpAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "Stand Up", "implemented", {});
    }
    check(config, ec) {
      if (!this.actor.conditions.has("Prone"))
        ec.add("not prone", this);
      const speed = this.actor.speed;
      if (speed <= 0)
        ec.add("cannot move", this);
      else if (this.actor.movedSoFar > speed / 2)
        ec.add("not enough movement", this);
      return super.check(config, ec);
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_StandUpAction.prototype, this, "apply").call(this, {});
        const speed = this.actor.speed;
        this.actor.movedSoFar += speed / 2;
        yield this.actor.removeEffect(Prone);
      });
    }
  };
  var Prone = new Effect("Prone", "turnEnd", (g2) => {
    g2.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(Prone))
        conditions.add("Prone", Prone);
    });
    g2.events.on("GetActions", ({ detail: { who, actions } }) => {
      actions.push(
        who.conditions.has("Prone") ? new StandUpAction(g2, who) : new DropProneAction(g2, who)
      );
    });
    g2.events.on("GetMoveCost", ({ detail: { who, multiplier } }) => {
      if (who.conditions.has("Prone"))
        multiplier.add("double", Prone);
    });
    g2.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
      if (who.conditions.has("Prone"))
        diceType.add("disadvantage", Prone);
      if (target.conditions.has("Prone")) {
        const d = distance(g2, who, target);
        diceType.add(d <= 5 ? "advantage" : "disadvantage", Prone);
      }
    });
  });

  // src/actions/AbstractAttackAction.ts
  var AbstractAttackAction = class _AbstractAttackAction extends AbstractAction {
    constructor(g2, actor, name, status, config, options = {}) {
      super(g2, actor, name, status, config, options);
      this.isAttack = true;
    }
    getTime() {
      if (this.actor.hasEffect(UsedAttackAction))
        return void 0;
      return "action";
    }
    apply(config) {
      return __async(this, null, function* () {
        __superGet(_AbstractAttackAction.prototype, this, "apply").call(this, config);
        this.actor.attacksSoFar.push(this);
        yield this.actor.addEffect(UsedAttackAction, { duration: 1 });
      });
    }
  };

  // src/actions/WeaponAttack.ts
  var WeaponAttack = class _WeaponAttack extends AbstractAttackAction {
    constructor(g2, actor, weapon, ammo) {
      super(
        g2,
        actor,
        ammo ? `${weapon.name} (${ammo.name})` : weapon.name,
        weapon.properties.has("thrown") ? "incomplete" : "implemented",
        { target: new TargetResolver(g2, getWeaponRange(actor, weapon)) }
      );
      this.weapon = weapon;
      this.ammo = ammo;
      this.ability = getWeaponAbility(actor, weapon);
      this.icon = getItemIcon(weapon);
      this.subIcon = getItemIcon(ammo);
    }
    getDamage() {
      return [this.weapon.damage];
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        __superGet(_WeaponAttack.prototype, this, "apply").call(this, { target });
        yield doStandardAttack(this.g, {
          ability: this.ability,
          ammo: this.ammo,
          attacker: this.actor,
          source: this,
          target,
          weapon: this.weapon
        });
      });
    }
  };
  function doStandardAttack(_0, _1) {
    return __async(this, arguments, function* (g2, {
      ability,
      ammo,
      attacker,
      source,
      target,
      weapon
    }) {
      const tags = /* @__PURE__ */ new Set();
      tags.add(
        distance(g2, attacker, target) > attacker.reach + weapon.reach ? "ranged" : "melee"
      );
      if (weapon.category !== "natural")
        tags.add("weapon");
      if (weapon.magical || (ammo == null ? void 0 : ammo.magical))
        tags.add("magical");
      const e = yield g2.attack({
        who: attacker,
        tags,
        target,
        ability,
        weapon,
        ammo
      });
      if (e.hit) {
        if (ammo)
          ammo.quantity--;
        const { damage } = weapon;
        const baseDamage = [];
        if (damage.type === "dice") {
          const { count, size } = damage.amount;
          const amount = yield g2.rollDamage(
            count,
            {
              source,
              size,
              damageType: damage.damageType,
              attacker,
              target,
              ability,
              weapon
            },
            e.critical
          );
          baseDamage.push([damage.damageType, amount]);
        } else
          baseDamage.push([damage.damageType, damage.amount]);
        const e2 = yield g2.damage(
          weapon,
          weapon.damage.damageType,
          {
            attack: e.attack,
            attacker,
            target,
            ability,
            weapon,
            ammo,
            critical: e.critical
          },
          baseDamage
        );
        return { type: "hit", attack: e, damage: e2 };
      }
      return { type: "miss", attack: e };
    });
  }

  // src/resources.ts
  var ResourceRegistry = /* @__PURE__ */ new Map();
  var ShortRestResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      ResourceRegistry.set(name, this);
      this.refresh = "shortRest";
    }
  };
  var LongRestResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      ResourceRegistry.set(name, this);
      this.refresh = "longRest";
    }
  };
  var TemporaryResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      ResourceRegistry.set(name, this);
      this.refresh = "never";
    }
  };
  var TurnResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      ResourceRegistry.set(name, this);
      this.refresh = "turnStart";
    }
  };

  // src/DndRules.ts
  var AbilityScoreRule = new DndRule("Ability Score", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { who, ability, bonus } }) => {
      bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g2.events.on("BeforeCheck", ({ detail: { who, ability, bonus } }) => {
      bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g2.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
      bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g2.events.on("GatherDamage", ({ detail: { attacker, ability, bonus } }) => {
      if (ability)
        bonus.add(attacker[ability].modifier, AbilityScoreRule);
    });
    g2.events.on("GetInitiative", ({ detail: { who, bonus } }) => {
      bonus.add(who.dex.modifier, AbilityScoreRule);
    });
  });
  var ArmorCalculationRule = new DndRule("Armor Calculation", (g2) => {
    g2.events.on("GetACMethods", ({ detail: { who, methods } }) => {
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
      const dexMod = (armor == null ? void 0 : armor.category) === "medium" ? Math.min(dex.modifier, 2) : (armor == null ? void 0 : armor.category) === "heavy" ? 0 : dex.modifier;
      methods.push({ name, ac: armorAC + dexMod + shieldAC, uses });
    });
  });
  var BlindedRule = new DndRule("Blinded", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
      if (who.conditions.has("Blinded"))
        diceType.add("disadvantage", BlindedRule);
      if (target.conditions.has("Blinded"))
        diceType.add("advantage", BlindedRule);
    });
  });
  var CombatActionsRule = new DndRule("Combat Actions", (g2) => {
    g2.events.on("GetActions", ({ detail: { who, actions } }) => {
      actions.push(new DashAction(g2, who));
      actions.push(new DisengageAction(g2, who));
      actions.push(new DodgeAction(g2, who));
    });
  });
  var DifficultTerrainRule = new DndRule("Difficult Terrain", (g2) => {
    const isDifficultTerrainAnywhere = (squares) => {
      for (const effect of g2.effects) {
        if (!effect.tags.has("difficult terrain"))
          continue;
        const area = resolveArea(effect.shape);
        for (const square of squares) {
          if (area.has(square))
            return true;
        }
      }
      return false;
    };
    g2.events.on("GetMoveCost", ({ detail: { who, to, multiplier } }) => {
      const squares = getSquares(who, to);
      if (isDifficultTerrainAnywhere(squares))
        multiplier.add("double", DifficultTerrainRule);
    });
  });
  var EffectsRule = new DndRule("Effects", (g2) => {
    g2.events.on(
      "TurnStarted",
      ({ detail: { who } }) => who.tickEffects("turnStart")
    );
    g2.events.on("TurnEnded", ({ detail: { who } }) => who.tickEffects("turnEnd"));
  });
  var ExhaustionRule = new DndRule("Exhaustion", (g2) => {
    g2.events.on("BeforeCheck", ({ detail: { who, diceType } }) => {
      if (who.exhaustion >= 1)
        diceType.add("disadvantage", ExhaustionRule);
    });
    g2.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.exhaustion >= 2)
        multiplier.add("half", ExhaustionRule);
      if (who.exhaustion >= 5)
        multiplier.add("zero", ExhaustionRule);
    });
    g2.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
      if (who.exhaustion >= 3)
        diceType.add("disadvantage", ExhaustionRule);
    });
    g2.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
      if (who.exhaustion >= 3)
        diceType.add("disadvantage", ExhaustionRule);
    });
  });
  var LongRangeAttacksRule = new DndRule("Long Range Attacks", (g2) => {
    g2.events.on(
      "BeforeAttack",
      ({ detail: { who, target, weapon, diceType } }) => {
        if (typeof (weapon == null ? void 0 : weapon.shortRange) === "number" && distance(g2, who, target) > weapon.shortRange)
          diceType.add("disadvantage", LongRangeAttacksRule);
      }
    );
  });
  var ObscuredRule = new DndRule("Obscured", (g2) => {
    const isHeavilyObscuredAnywhere = (squares) => {
      for (const effect of g2.effects) {
        if (!effect.tags.has("heavily obscured"))
          continue;
        const area = resolveArea(effect.shape);
        for (const square of squares) {
          if (area.has(square))
            return true;
        }
      }
      return false;
    };
    g2.events.on("BeforeAttack", ({ detail: { diceType, target } }) => {
      const squares = getSquares(target, g2.getState(target).position);
      if (isHeavilyObscuredAnywhere(squares))
        diceType.add("disadvantage", ObscuredRule);
    });
    g2.events.on("GetConditions", ({ detail: { conditions, who } }) => {
      const squares = getSquares(who, g2.getState(who).position);
      if (isHeavilyObscuredAnywhere(squares))
        conditions.add("Blinded", ObscuredRule);
    });
  });
  var OneAttackPerTurnRule = new DndRule("Attacks per turn", (g2) => {
    g2.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.isAttack && action.actor.attacksSoFar.length)
        error.add("No attacks left", OneAttackPerTurnRule);
    });
  });
  var ProficiencyRule = new DndRule("Proficiency", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { who, bonus, spell, weapon } }) => {
      const mul = weapon ? who.getProficiencyMultiplier(weapon) : spell ? 1 : 0;
      bonus.add(who.pb * mul, ProficiencyRule);
    });
    g2.events.on("BeforeCheck", ({ detail: { who, skill, bonus } }) => {
      const mul = who.getProficiencyMultiplier(skill);
      bonus.add(who.pb * mul, ProficiencyRule);
    });
    g2.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
      const mul = who.getProficiencyMultiplier(ability);
      bonus.add(who.pb * mul, ProficiencyRule);
    });
  });
  var ResourcesRule = new DndRule("Resources", (g2) => {
    g2.events.on("TurnStarted", ({ detail: { who } }) => {
      for (const name of who.resources.keys()) {
        const resource = ResourceRegistry.get(name);
        if ((resource == null ? void 0 : resource.refresh) === "turnStart")
          who.refreshResource(resource);
      }
    });
  });
  var TurnTimeRule = new DndRule("Turn Time", (g2) => {
    g2.events.on("TurnStarted", ({ detail: { who } }) => {
      who.time.add("action");
      who.time.add("bonus action");
      who.time.add("reaction");
    });
  });
  var WeaponAttackRule = new DndRule("Weapon Attacks", (g2) => {
    g2.events.on("GetActions", ({ detail: { who, target, actions } }) => {
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
  var DndRules = class {
    constructor(g2) {
      this.g = g2;
      for (const rule of RuleRepository)
        rule.setup(g2);
    }
  };

  // src/events/AbilityCheckEvent.ts
  var AbilityCheckEvent = class extends CustomEvent {
    constructor(detail) {
      super("AbilityCheck", { detail });
    }
  };

  // src/events/AfterActionEvent.ts
  var AfterActionEvent = class extends CustomEvent {
    constructor(detail) {
      super("AfterAction", { detail });
    }
  };

  // src/events/AreaPlacedEvent.ts
  var AreaPlacedEvent = class extends CustomEvent {
    constructor(detail) {
      super("AreaPlaced", { detail });
    }
  };

  // src/events/AreaRemovedEvent.ts
  var AreaRemovedEvent = class extends CustomEvent {
    constructor(detail) {
      super("AreaRemoved", { detail });
    }
  };

  // src/events/AttackEvent.ts
  var AttackEvent = class extends CustomEvent {
    constructor(detail) {
      super("Attack", { detail });
    }
  };

  // src/events/BattleStartedEvent.ts
  var BattleStartedEvent = class extends CustomEvent {
    constructor(detail) {
      super("BattleStarted", { detail });
    }
  };

  // src/events/BeforeAttackEvent.ts
  var BeforeAttackEvent = class extends CustomEvent {
    constructor(detail) {
      super("BeforeAttack", { detail });
    }
  };

  // src/events/BeforeCheckEvent.ts
  var BeforeCheckEvent = class extends CustomEvent {
    constructor(detail) {
      super("BeforeCheck", { detail });
    }
  };

  // src/events/BeforeMoveEvent.ts
  var BeforeMoveEvent = class extends CustomEvent {
    constructor(detail) {
      super("BeforeMove", { detail });
    }
  };

  // src/events/BeforeSaveEvent.ts
  var BeforeSaveEvent = class extends CustomEvent {
    constructor(detail) {
      super("BeforeSave", { detail });
    }
  };

  // src/events/BoundedMoveEvent.ts
  var BoundedMoveEvent = class extends CustomEvent {
    constructor(detail) {
      super("BoundedMove", { detail });
    }
  };

  // src/events/CheckActionEvent.ts
  var CheckActionEvent = class extends CustomEvent {
    constructor(detail) {
      super("CheckAction", { detail });
    }
  };

  // src/events/CombatantDamagedEvent.ts
  var CombatantDamagedEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantDamaged", { detail });
    }
  };

  // src/events/CombatantDiedEvent.ts
  var CombatantDiedEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantDied", { detail });
    }
  };

  // src/events/CombatantHealedEvent.ts
  var CombatantHealedEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantHealed", { detail });
    }
  };

  // src/events/CombatantMovedEvent.ts
  var CombatantMovedEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantMoved", { detail });
    }
  };

  // src/events/CombatantPlacedEvent.ts
  var CombatantPlacedEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantPlaced", { detail });
    }
  };

  // src/events/DiceRolledEvent.ts
  var DiceRolledEvent = class extends CustomEvent {
    constructor(detail) {
      super("DiceRolled", { detail });
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
      this.target.addEventListener(
        type,
        callback,
        options
      );
      return () => this.off(type, callback);
    }
    off(type, callback, options) {
      return this.target.removeEventListener(
        type,
        callback,
        options
      );
    }
  };

  // src/events/GatherDamageEvent.ts
  var GatherDamageEvent = class extends CustomEvent {
    constructor(detail) {
      super("GatherDamage", { detail });
    }
  };

  // src/events/GatherHealEvent.ts
  var GatherHealEvent = class extends CustomEvent {
    constructor(detail) {
      super("GatherHeal", { detail });
    }
  };

  // src/events/GetACEvent.ts
  var GetACEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetAC", { detail });
    }
  };

  // src/events/GetACMethodsEvent.ts
  var GetACMethodsEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetACMethods", { detail });
    }
  };

  // src/events/GetActionsEvent.ts
  var GetActionsEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetActions", { detail });
    }
  };

  // src/events/GetDamageResponseEvent.ts
  var GetDamageResponseEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetDamageResponse", { detail });
    }
  };

  // src/events/GetInitiativeEvent.ts
  var GetInitiativeEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetInitiative", { detail });
    }
  };

  // src/events/GetMoveCostEvent.ts
  var GetMoveCostEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetMoveCost", { detail });
    }
  };

  // src/events/SaveEvent.ts
  var SaveEvent = class extends CustomEvent {
    constructor(detail) {
      super("Save", { detail });
    }
  };

  // src/events/TurnEndedEvent.ts
  var TurnEndedEvent = class extends CustomEvent {
    constructor(detail) {
      super("TurnEnded", { detail });
    }
  };

  // src/events/TurnStartedEvent.ts
  var TurnStartedEvent = class extends CustomEvent {
    constructor(detail) {
      super("TurnStarted", { detail });
    }
  };

  // src/events/YesNoChoiceEvent.ts
  var YesNoChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("YesNoChoice", { detail });
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
    apply(g2) {
      return __async(this, null, function* () {
        var _a, _b;
        const choice = yield new Promise(
          (resolve) => g2.fire(new YesNoChoiceEvent({ interruption: this, resolve }))
        );
        if (choice)
          yield (_a = this.yes) == null ? void 0 : _a.call(this);
        else
          yield (_b = this.no) == null ? void 0 : _b.call(this);
        return choice;
      });
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

  // src/utils/points.ts
  var _p = (x, y) => ({ x, y });
  function addPoints(a, b) {
    return _p(a.x + b.x, a.y + b.y);
  }
  function mulPoint(z, mul) {
    return _p(z.x * mul, z.y * mul);
  }
  var moveOffsets = {
    east: _p(MapSquareSize, 0),
    southeast: _p(MapSquareSize, MapSquareSize),
    south: _p(0, MapSquareSize),
    southwest: _p(-MapSquareSize, MapSquareSize),
    west: _p(-MapSquareSize, 0),
    northwest: _p(-MapSquareSize, -MapSquareSize),
    north: _p(0, -MapSquareSize),
    northeast: _p(MapSquareSize, -MapSquareSize)
  };
  function movePoint(p, d) {
    return addPoints(p, moveOffsets[d]);
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
        yield this.resolve(
          new BattleStartedEvent({ interrupt: new InterruptionCollector() })
        );
        yield this.nextTurn();
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
        const gi = yield this.resolve(
          new GetInitiativeEvent({
            who,
            bonus: new BonusCollector(),
            diceType: new DiceTypeCollector(),
            interrupt: new InterruptionCollector()
          })
        );
        const roll = yield this.roll(
          { type: "initiative", who },
          gi.detail.diceType.result
        );
        return roll.value + gi.detail.bonus.result;
      });
    }
    savingThrow(_0, _1) {
      return __async(this, arguments, function* (dc, e, { save, fail } = {
        save: "half",
        fail: "normal"
      }) {
        const successResponse = new SuccessResponseCollector();
        const bonus = new BonusCollector();
        const diceType = new DiceTypeCollector();
        const saveDamageResponse = new SaveDamageResponseCollector(save);
        const failDamageResponse = new SaveDamageResponseCollector(fail);
        const pre = yield this.resolve(
          new BeforeSaveEvent(__spreadProps(__spreadValues({}, e), {
            dc,
            bonus,
            diceType,
            successResponse,
            saveDamageResponse,
            failDamageResponse,
            interrupt: new InterruptionCollector()
          }))
        );
        let forced = false;
        let success = false;
        const roll = yield this.roll(__spreadValues({ type: "save" }, e), diceType.result);
        const total = roll.value + bonus.result;
        if (successResponse.result !== "normal") {
          success = successResponse.result === "success";
          forced = true;
        } else {
          success = total >= dc;
        }
        const outcome = success ? "success" : "fail";
        this.fire(
          new SaveEvent({ pre: pre.detail, roll, dc, outcome, total, forced })
        );
        return {
          outcome,
          forced,
          damageResponse: success ? saveDamageResponse.result : failDamageResponse.result
        };
      });
    }
    abilityCheck(dc, e) {
      return __async(this, null, function* () {
        const successResponse = new SuccessResponseCollector();
        const bonus = new BonusCollector();
        const diceType = new DiceTypeCollector();
        const pre = this.fire(
          new BeforeCheckEvent(__spreadProps(__spreadValues({}, e), { dc, bonus, diceType, successResponse }))
        );
        let forced = false;
        let success = false;
        const roll = yield this.roll(__spreadValues({ type: "check" }, e), diceType.result);
        const total = roll.value + bonus.result;
        if (successResponse.result !== "normal") {
          success = successResponse.result === "success";
          forced = true;
        } else {
          success = total >= dc;
        }
        const outcome = success ? "success" : "fail";
        this.fire(
          new AbilityCheckEvent({
            pre: pre.detail,
            roll,
            dc,
            outcome,
            total,
            forced
          })
        );
        return { outcome, forced };
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
      return __async(this, null, function* () {
        if (this.activeCombatant)
          yield this.resolve(
            new TurnEndedEvent({
              who: this.activeCombatant,
              interrupt: new InterruptionCollector()
            })
          );
        let who = this.initiativeOrder[this.initiativePosition];
        let scan = true;
        while (scan) {
          this.initiativePosition = isNaN(this.initiativePosition) ? 0 : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
          who = this.initiativeOrder[this.initiativePosition];
          if (!who.hasEffect(Dead))
            scan = false;
          else {
            who.tickEffects("turnStart");
            who.tickEffects("turnEnd");
          }
        }
        this.activeCombatant = who;
        who.attacksSoFar = [];
        who.movedSoFar = 0;
        yield this.resolve(
          new TurnStartedEvent({ who, interrupt: new InterruptionCollector() })
        );
      });
    }
    move(who, direction, handler, type = "speed") {
      return __async(this, null, function* () {
        const state = this.combatants.get(who);
        if (!state)
          return { type: "invalid" };
        const old = state.position;
        const position = movePoint(old, direction);
        const error = new ErrorCollector();
        const pre = yield this.resolve(
          new BeforeMoveEvent({
            who,
            from: old,
            direction,
            to: position,
            handler,
            type,
            error,
            interrupt: new InterruptionCollector(),
            success: new SuccessResponseCollector()
          })
        );
        if (pre.detail.success.result === "fail")
          return { type: "prevented" };
        if (!error.result)
          return { type: "error", error };
        const multiplier = new MultiplierCollector();
        this.fire(
          new GetMoveCostEvent({
            who,
            from: old,
            direction,
            to: position,
            handler,
            type,
            multiplier
          })
        );
        state.position = position;
        const handlerDone = handler.onMove(who, multiplier.result * MapSquareSize);
        yield this.resolve(
          new CombatantMovedEvent({
            who,
            direction,
            old,
            position,
            handler,
            type,
            interrupt: new InterruptionCollector()
          })
        );
        if (handlerDone)
          return { type: "unbind" };
        return { type: "ok" };
      });
    }
    applyDamage(_0, _1) {
      return __async(this, arguments, function* (damage, {
        attack,
        attacker,
        multiplier: baseMultiplier = 1,
        target
      }) {
        let total = 0;
        let heal = 0;
        const breakdown = /* @__PURE__ */ new Map();
        for (const [damageType, raw] of damage) {
          const collector = new DamageResponseCollector();
          const innateResponse = target.damageResponses.get(damageType);
          if (innateResponse)
            collector.add(innateResponse, target);
          this.fire(
            new GetDamageResponseEvent({
              attack,
              who: target,
              damageType,
              response: collector
            })
          );
          const response = collector.result;
          if (response === "immune")
            continue;
          let amount = raw;
          if (response === "absorb") {
            heal += raw;
          } else {
            let multiplier = baseMultiplier;
            if (response === "resist")
              multiplier *= 0.5;
            else if (response === "vulnerable")
              multiplier *= 2;
            amount = Math.ceil(raw * multiplier);
            total += amount;
          }
          breakdown.set(damageType, { response, raw, amount });
        }
        if (heal > total)
          return this.applyHeal(target, heal - total, target);
        total -= heal;
        if (total < 1)
          return;
        const takenByTemporaryHP = Math.min(total, target.temporaryHP);
        target.temporaryHP -= takenByTemporaryHP;
        const afterTemporaryHP = total - takenByTemporaryHP;
        target.hp -= afterTemporaryHP;
        const temporaryHPSource = target.temporaryHPSource;
        if (target.temporaryHP <= 0)
          target.temporaryHPSource = void 0;
        yield this.resolve(
          new CombatantDamagedEvent({
            who: target,
            attack,
            attacker,
            total,
            takenByTemporaryHP,
            afterTemporaryHP,
            temporaryHPSource,
            breakdown,
            interrupt: new InterruptionCollector()
          })
        );
        if (target.hp <= 0) {
          if (target.diesAtZero) {
            this.combatants.delete(target);
            yield target.addEffect(Dead, { duration: Infinity });
            this.fire(new CombatantDiedEvent({ who: target, attacker }));
          } else {
          }
        }
      });
    }
    attack(e) {
      return __async(this, null, function* () {
        const pre = yield this.resolve(
          new BeforeAttackEvent(__spreadProps(__spreadValues({}, e), {
            diceType: new DiceTypeCollector(),
            bonus: new BonusCollector(),
            interrupt: new InterruptionCollector(),
            success: new SuccessResponseCollector()
          }))
        );
        if (pre.detail.success.result === "fail")
          return { outcome: "cancelled", hit: false };
        const ac = yield this.getAC(e.target, pre.detail);
        const roll = yield this.roll(
          {
            type: "attack",
            who: e.who,
            target: e.target,
            ac,
            ability: e.ability
          },
          pre.detail.diceType.result
        );
        const total = roll.value + pre.detail.bonus.result;
        const attack = yield this.resolve(
          new AttackEvent({
            pre: pre.detail,
            roll,
            total,
            ac,
            outcome: roll.value === 1 ? "miss" : roll.value === 20 ? "critical" : total >= ac ? "hit" : "miss",
            forced: false,
            // TODO
            interrupt: new InterruptionCollector()
          })
        );
        const { outcome } = attack.detail;
        return {
          outcome,
          attack: attack.detail,
          hit: outcome === "hit" || outcome === "critical",
          critical: outcome === "critical"
        };
      });
    }
    damage(_0, _1, _2) {
      return __async(this, arguments, function* (source, damageType, e, damageInitialiser = [], startingMultiplier) {
        if (startingMultiplier === "zero")
          return;
        const map = new DamageMap(damageInitialiser);
        const multiplier = new MultiplierCollector();
        if (typeof startingMultiplier !== "undefined")
          multiplier.add(startingMultiplier, source);
        const gather = yield this.resolve(
          new GatherDamageEvent(__spreadProps(__spreadValues({
            critical: false
          }, e), {
            map,
            bonus: new BonusCollector(),
            interrupt: new InterruptionCollector(),
            multiplier
          }))
        );
        map.add(damageType, gather.detail.bonus.result);
        return this.applyDamage(map, {
          source,
          attack: e.attack,
          attacker: e.attacker,
          target: e.target,
          multiplier: multiplier.result
        });
      });
    }
    check(action, config) {
      const error = new ErrorCollector();
      this.fire(new CheckActionEvent({ action, config, error }));
      return error;
    }
    act(action, config) {
      return __async(this, null, function* () {
        yield action.apply(config);
        return this.resolve(
          new AfterActionEvent({
            action,
            config,
            interrupt: new InterruptionCollector()
          })
        );
      });
    }
    getActions(who, target) {
      return this.fire(new GetActionsEvent({ who, target, actions: [] })).detail.actions;
    }
    getBestACMethod(who) {
      return this.fire(
        new GetACMethodsEvent({
          who,
          methods: [who.baseACMethod]
        })
      ).detail.methods.reduce(
        (best, method) => method.ac > best.ac ? method : best,
        who.baseACMethod
      );
    }
    getAC(who, pre) {
      return __async(this, null, function* () {
        const method = this.getBestACMethod(who);
        const e = yield this.resolve(
          new GetACEvent({
            who,
            method,
            bonus: new BonusCollector(),
            interrupt: new InterruptionCollector(),
            pre
          })
        );
        return method.ac + e.detail.bonus.result;
      });
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
        this.events.fire(e);
        for (const interruption of e.detail.interrupt)
          yield interruption.apply(this);
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
    getInside(area) {
      const points = resolveArea(area);
      const inside = [];
      for (const [combatant, state] of this.combatants) {
        const squares = new PointSet(getSquares(combatant, state.position));
        if (points.overlaps(squares))
          inside.push(combatant);
      }
      return inside;
    }
    applyBoundedMove(who, handler) {
      return __async(this, null, function* () {
        return new Promise(
          (resolve) => this.fire(new BoundedMoveEvent({ who, handler, resolve }))
        );
      });
    }
    rollHeal(count, e, critical = false) {
      return __async(this, null, function* () {
        let total = 0;
        for (let i = 0; i < count * (critical ? 2 : 1); i++) {
          const roll = yield this.roll(__spreadProps(__spreadValues({}, e), { type: "heal" }));
          total += roll.value;
        }
        return total;
      });
    }
    heal(source, amount, e, startingMultiplier) {
      return __async(this, null, function* () {
        const bonus = new BonusCollector();
        bonus.add(amount, source);
        const multiplier = new MultiplierCollector();
        if (typeof startingMultiplier !== "undefined")
          multiplier.add(startingMultiplier, source);
        const gather = yield this.resolve(
          new GatherHealEvent(__spreadProps(__spreadValues({}, e), {
            bonus,
            multiplier,
            interrupt: new InterruptionCollector()
          }))
        );
        const total = bonus.result * multiplier.result;
        return this.applyHeal(gather.detail.target, total, gather.detail.actor);
      });
    }
    applyHeal(who, fullAmount, actor) {
      return __async(this, null, function* () {
        const amount = Math.min(fullAmount, who.hpMax - who.hp);
        return this.resolve(
          new CombatantHealedEvent({
            who,
            actor,
            amount,
            fullAmount,
            interrupt: new InterruptionCollector()
          })
        );
      });
    }
    giveTemporaryHP(who, count, source) {
      return __async(this, null, function* () {
        var _a;
        if (who.temporaryHP > 0)
          return new YesNoChoice(
            who,
            source,
            `Replace Temporary HP?`,
            `${who.name} already has ${who.temporaryHP} temporary HP from ${(_a = who.temporaryHPSource) == null ? void 0 : _a.name}. Replace with ${count} temporary HP from ${source.name}?`,
            () => __async(this, null, function* () {
              return this.setTemporaryHP(who, count, source);
            })
          ).apply(this);
        this.setTemporaryHP(who, count, source);
        return true;
      });
    }
    setTemporaryHP(who, count, source) {
      who.temporaryHP = count;
      who.temporaryHPSource = source;
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

  // src/interruptions/EvaluateLater.ts
  var EvaluateLater = class {
    constructor(who, source, apply) {
      this.who = who;
      this.source = source;
      this.apply = apply;
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

  // src/spells/InnateSpellcasting.ts
  var InnateSpellcasting = class {
    constructor(name, ability, getResourceForSpell, icon) {
      this.name = name;
      this.ability = ability;
      this.getResourceForSpell = getResourceForSpell;
      this.icon = icon;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addCastableSpell() {
    }
    getMinSlot(spell) {
      return spell.level;
    }
    getMaxSlot(spell) {
      return spell.level;
    }
  };

  // src/utils/time.ts
  var TURNS_PER_MINUTE = 10;
  var minutes = (n) => n * TURNS_PER_MINUTE;
  var hours = (n) => minutes(n * 60);

  // src/spells/level1/ArmorOfAgathys.ts
  var ArmorOfAgathysEffect = new Effect(
    "Armor of Agathys",
    "turnStart",
    (g2) => {
      g2.events.on("Attack", ({ detail: { pre, interrupt } }) => {
        const config = pre.target.getEffectConfig(ArmorOfAgathysEffect);
        if (config && pre.target.temporaryHPSource === ArmorOfAgathysEffect && pre.tags.has("melee"))
          interrupt.add(
            new EvaluateLater(pre.who, ArmorOfAgathysEffect, () => __async(void 0, null, function* () {
              yield g2.damage(
                ArmorOfAgathysEffect,
                "cold",
                { attacker: pre.target, target: pre.who },
                [["cold", config.count]]
              );
            }))
          );
      });
      g2.events.on(
        "CombatantDamaged",
        ({ detail: { who, temporaryHPSource, interrupt } }) => {
          if (temporaryHPSource === ArmorOfAgathysEffect && who.temporaryHP <= 0)
            interrupt.add(
              new EvaluateLater(who, ArmorOfAgathysEffect, () => __async(void 0, null, function* () {
                yield who.removeEffect(ArmorOfAgathysEffect);
              }))
            );
        }
      );
    }
  );
  var ArmorOfAgathys = scalingSpell({
    status: "implemented",
    name: "Armor of Agathys",
    level: 1,
    school: "Abjuration",
    v: true,
    s: true,
    m: "a cup of water",
    lists: ["Warlock"],
    getConfig: () => ({}),
    getTargets: (g2, caster) => [caster],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { slot }) {
        const count = slot * 5;
        if (yield g2.giveTemporaryHP(caster, count, ArmorOfAgathysEffect)) {
          const duration = hours(1);
          yield caster.addEffect(ArmorOfAgathysEffect, { count, duration }, caster);
        }
      });
    }
  });
  var ArmorOfAgathys_default = ArmorOfAgathys;

  // src/types/AttackTag.ts
  var atSet = (...items) => new Set(items);

  // src/spells/SpellAttack.ts
  var SpellAttack = class {
    constructor(g2, caster, spell, method, type, config) {
      this.g = g2;
      this.caster = caster;
      this.spell = spell;
      this.method = method;
      this.type = type;
      this.config = config;
    }
    attack(target) {
      return __async(this, null, function* () {
        const { caster: who, method, spell, type } = this;
        this.attackResult = yield this.g.attack({
          who,
          target,
          ability: method.ability,
          tags: atSet(type, "spell", "magical"),
          spell,
          method
        });
        return this.attackResult;
      });
    }
    getDamage(target) {
      return __async(this, null, function* () {
        if (!this.attackResult)
          throw new Error("Run .attack() first");
        const { critical } = this.attackResult;
        const { g: g2, caster: attacker, config, method, spell } = this;
        const damage = spell.getDamage(g2, attacker, method, config);
        if (damage) {
          const amounts = [];
          let first = true;
          for (const { type, amount, damageType } of damage) {
            if (first) {
              this.baseDamageType = damageType;
              first = false;
            }
            if (type === "dice") {
              const { count, size } = amount;
              const roll = yield g2.rollDamage(
                count,
                {
                  source: spell,
                  size,
                  damageType,
                  attacker,
                  target,
                  spell,
                  method
                },
                critical
              );
              amounts.push([damageType, roll]);
            } else
              amounts.push([damageType, amount]);
          }
          return amounts;
        }
      });
    }
    damage(target, initialiser) {
      return __async(this, null, function* () {
        if (!this.attackResult)
          throw new Error("Run .attack() first");
        const { attack, critical, hit } = this.attackResult;
        if (!hit)
          return;
        const { g: g2, baseDamageType, caster: attacker, method, spell } = this;
        if (!baseDamageType)
          throw new Error("Run .getDamage() first");
        return g2.damage(
          spell,
          baseDamageType,
          { attack, attacker, target, critical, spell, method },
          initialiser
        );
      });
    }
  };

  // src/types/CheckTag.ts
  var chSet = (...items) => new Set(items);

  // src/types/SaveTag.ts
  var svSet = (...items) => new Set(items);

  // src/utils/dice.ts
  var _dd = (count, size, damage) => ({
    type: "dice",
    amount: { count, size },
    damageType: damage
  });
  function getDefaultHPRoll(level, hitDieSize) {
    if (level === 1)
      return hitDieSize;
    return Math.ceil(getDiceAverage(1, hitDieSize));
  }

  // src/monsters/fiendishParty/Birnotec_token.png
  var Birnotec_token_default = "./Birnotec_token-JGKE3FD4.png";

  // src/monsters/fiendishParty/Birnotec.ts
  function getArea(g2, target) {
    return {
      type: "within",
      radius: 5,
      target,
      position: g2.getState(target).position
    };
  }
  var EldritchBurstSpell = simpleSpell({
    status: "implemented",
    name: "Eldritch Burst",
    level: 0,
    school: "Evocation",
    lists: ["Warlock"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 120) }),
    getAffectedArea: (g2, caster, { target }) => target && [getArea(g2, target)],
    getDamage: () => [_dd(2, 10, "force")],
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
        const rsa = new SpellAttack(
          g2,
          caster,
          EldritchBurstSpell,
          BirnotecSpellcasting,
          "ranged",
          { target }
        );
        const attack = yield rsa.attack(target);
        if (attack.outcome === "cancelled")
          return;
        if (attack.hit) {
          const damage2 = yield rsa.getDamage(target);
          yield rsa.damage(target, damage2);
        }
        const damage = yield g2.rollDamage(
          1,
          { size: 10, source: this, attacker: caster, damageType: "force" },
          attack.critical
        );
        for (const other of g2.getInside(getArea(g2, target))) {
          if (other === target)
            continue;
          const save = yield g2.savingThrow(
            15,
            {
              attacker: caster,
              who: other,
              ability: "dex",
              spell: EldritchBurstSpell,
              method,
              tags: svSet()
            },
            { fail: "normal", save: "zero" }
          );
          yield g2.damage(
            this,
            "force",
            { attacker: caster, target: other, spell: EldritchBurstSpell, method },
            [["force", damage]],
            save.damageResponse
          );
        }
      });
    }
  });
  var BirnotecSpellcasting = new InnateSpellcasting(
    "Spellcasting",
    "cha",
    () => void 0
  );
  var EldritchBurst = new SimpleFeature(
    "Eldritch Burst",
    `Ranged Spell Attack: +8 to hit, range 120 ft., one target. Hit: 11 (2d10) force damage. All other creatures within 5 ft. must make a DC 15 Dexterity save or take 5 (1d10) force damage.`,
    (g2, me) => {
      me.spellcastingMethods.add(BirnotecSpellcasting);
      me.preparedSpells.add(EldritchBurstSpell);
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new CastSpell(g2, me, BirnotecSpellcasting, EldritchBurstSpell)
          );
      });
    }
  );
  var ArmorOfAgathys2 = new SimpleFeature(
    "Armor of Agathys",
    `Birnotec has 15 temporary hit points. While these persist, any creature that hits him in melee takes 15 cold damage.`,
    (g2, me) => {
      g2.events.on("BattleStarted", ({ detail: { interrupt } }) => {
        interrupt.add(
          new EvaluateLater(me, ArmorOfAgathys2, () => __async(void 0, null, function* () {
            yield ArmorOfAgathys_default.apply(g2, me, BirnotecSpellcasting, {
              slot: 3
            });
          }))
        );
      });
    }
  );
  var AntimagicProdigy = new SimpleFeature(
    "Antimagic Prodigy",
    `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
    (g2, me) => {
      g2.events.on("SpellCast", ({ detail: { who, interrupt, success } }) => {
        if (me.time.has("reaction") && who.side !== me.side)
          interrupt.add(
            new YesNoChoice(
              me,
              AntimagicProdigy,
              "Antimagic Prodigy",
              `Use ${me.name}'s reaction to attempt to counter the spell?`,
              () => __async(void 0, null, function* () {
                me.time.delete("reaction");
                const save = yield g2.abilityCheck(15, {
                  who,
                  attacker: me,
                  skill: "Arcana",
                  ability: "int",
                  tags: chSet("counterspell")
                });
                if (save.outcome === "fail")
                  success.add("fail", AntimagicProdigy);
              })
            )
          );
      });
    }
  );
  var HellishRebuke = new SimpleFeature(
    "Hellish Rebuke",
    `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
    (g2, me) => {
      g2.events.on(
        "CombatantDamaged",
        ({ detail: { who, attacker, interrupt } }) => {
          if (who === me && me.time.has("reaction"))
            interrupt.add(
              new YesNoChoice(
                me,
                HellishRebuke,
                "Hellish Rebuke",
                `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
                () => __async(void 0, null, function* () {
                  me.time.delete("reaction");
                  const damage = yield g2.rollDamage(2, {
                    source: HellishRebuke,
                    size: 10,
                    attacker: me,
                    target: attacker,
                    damageType: "fire"
                  });
                  const save = yield g2.savingThrow(15, {
                    who: attacker,
                    attacker: me,
                    ability: "dex",
                    tags: svSet()
                  });
                  yield g2.damage(
                    HellishRebuke,
                    "fire",
                    { attacker: me, target: attacker },
                    [["fire", damage]],
                    save.damageResponse
                  );
                })
              )
            );
        }
      );
    }
  );
  var Birnotec = class extends Monster {
    constructor(g2) {
      super(g2, "Birnotec", 5, "humanoid", "medium", Birnotec_token_default);
      this.diesAtZero = false;
      this.hp = this.hpMax = 35;
      this.movement.set("speed", 30);
      this.setAbilityScores(6, 15, 8, 12, 13, 20);
      this.pb = 3;
      this.saveProficiencies.add("wis");
      this.saveProficiencies.add("cha");
      this.skills.set("Arcana", 1);
      this.skills.set("Nature", 1);
      this.damageResponses.set("poison", "immune");
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.addFeature(ArmorOfAgathys2);
      this.addFeature(EldritchBurst);
      this.addFeature(AntimagicProdigy);
      this.addFeature(HellishRebuke);
    }
  };

  // src/classes/rogue/Evasion.ts
  var Evasion = new SimpleFeature(
    "Evasion",
    `Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`,
    (g2, me) => {
      g2.events.on(
        "BeforeSave",
        ({
          detail: { who, ability, failDamageResponse, saveDamageResponse }
        }) => {
          if (who === me && ability === "dex" && saveDamageResponse.fallback === "half") {
            failDamageResponse.add("half", Evasion);
            saveDamageResponse.add("zero", Evasion);
          }
        }
      );
    }
  );
  var Evasion_default = Evasion;

  // src/items/AbstractItem.ts
  var AbstractItem = class {
    constructor(g2, itemType, name, hands = 0) {
      this.g = g2;
      this.itemType = itemType;
      this.name = name;
      this.hands = hands;
      this.enchantments = /* @__PURE__ */ new Set();
      this.rarity = "Common";
    }
    addEnchantment(e) {
      this.enchantments.add(e);
      e.setup(this.g, this);
    }
  };

  // src/items/icons/bolt.svg
  var bolt_default = "./bolt-RV5OQWXW.svg";

  // src/items/ammunition.ts
  var AbstractAmmo = class extends AbstractItem {
    constructor(g2, name, ammunitionTag, quantity) {
      super(g2, "ammo", name);
      this.ammunitionTag = ammunitionTag;
      this.quantity = quantity;
    }
  };
  var Arrow = class extends AbstractAmmo {
    constructor(g2, quantity) {
      super(g2, "arrow", "bow", quantity);
    }
  };
  var CrossbowBolt = class extends AbstractAmmo {
    constructor(g2, quantity) {
      super(g2, "crossbow bolt", "crossbow", quantity);
      this.iconUrl = bolt_default;
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
  var StuddedLeatherArmor = class extends AbstractArmor {
    constructor(g2) {
      super(g2, "studded leather armor", "light", 12);
    }
  };
  var HideArmor = class extends AbstractArmor {
    constructor(g2) {
      super(g2, "hide armor", "medium", 12);
    }
  };
  var ScaleMailArmor = class extends AbstractArmor {
    constructor(g2) {
      super(g2, "scale mail armor", "medium", 14, true);
    }
  };
  var SplintArmor = class extends AbstractArmor {
    constructor(g2) {
      super(g2, "splint armor", "heavy", 17, true, 15);
    }
  };
  var Shield = class extends AbstractArmor {
    constructor(g2) {
      super(g2, "shield", "shield", 2);
      this.hands = 1;
    }
  };

  // src/items/icons/light-crossbow.svg
  var light_crossbow_default = "./light-crossbow-PIY5SWC5.svg";

  // src/items/icons/longsword.svg
  var longsword_default = "./longsword-B4PZKYLG.svg";

  // src/items/icons/quarterstaff.svg
  var quarterstaff_default = "./quarterstaff-EMYY63PI.svg";

  // src/items/icons/spear.svg
  var spear_default = "./spear-JE22DTMJ.svg";

  // src/items/icons/trident.svg
  var trident_default = "./trident-XL6WP2YY.svg";

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
    get reach() {
      return this.properties.has("reach") ? 5 : 0;
    }
  };
  var Dagger = class extends AbstractWeapon {
    constructor(g2, quantity) {
      super(
        g2,
        "dagger",
        "simple",
        "melee",
        _dd(1, 4, "piercing"),
        ["finesse", "light", "thrown"],
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var Handaxe = class extends AbstractWeapon {
    constructor(g2, quantity) {
      super(
        g2,
        "handaxe",
        "simple",
        "melee",
        _dd(1, 6, "slashing"),
        ["light", "thrown"],
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var Mace = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "mace", "simple", "melee", _dd(1, 6, "bludgeoning"));
    }
  };
  var Quarterstaff = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "quarterstaff", "simple", "melee", _dd(1, 6, "bludgeoning"), [
        "versatile"
      ]);
      this.iconUrl = quarterstaff_default;
    }
  };
  var Spear = class extends AbstractWeapon {
    constructor(g2, quantity) {
      super(
        g2,
        "spear",
        "simple",
        "melee",
        _dd(1, 6, "piercing"),
        ["thrown", "versatile"],
        20,
        60
      );
      this.quantity = quantity;
      this.iconUrl = spear_default;
    }
  };
  var LightCrossbow = class extends AbstractWeapon {
    constructor(g2) {
      super(
        g2,
        "light crossbow",
        "simple",
        "ranged",
        _dd(1, 8, "piercing"),
        ["ammunition", "loading", "two-handed"],
        80,
        320
      );
      this.ammunitionTag = "crossbow";
      this.iconUrl = light_crossbow_default;
    }
  };
  var Greataxe = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "greataxe", "martial", "melee", _dd(1, 12, "slashing"), [
        "heavy",
        "two-handed"
      ]);
    }
  };
  var Longsword = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "longsword", "martial", "melee", _dd(1, 8, "slashing"), [
        "versatile"
      ]);
      this.iconUrl = longsword_default;
    }
  };
  var Rapier = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "rapier", "martial", "melee", _dd(1, 8, "piercing"), ["finesse"]);
    }
  };
  var Shortsword = class extends AbstractWeapon {
    constructor(g2) {
      super(g2, "shortsword", "martial", "melee", _dd(1, 6, "piercing"), [
        "finesse",
        "light"
      ]);
    }
  };
  var Trident = class extends AbstractWeapon {
    constructor(g2, quantity) {
      super(
        g2,
        "trident",
        "martial",
        "melee",
        _dd(1, 6, "piercing"),
        ["thrown", "versatile"],
        20,
        60
      );
      this.quantity = quantity;
      this.iconUrl = trident_default;
    }
  };
  var Longbow = class extends AbstractWeapon {
    constructor(g2) {
      super(
        g2,
        "longbow",
        "martial",
        "ranged",
        _dd(1, 8, "piercing"),
        ["ammunition", "heavy", "two-handed"],
        150,
        600
      );
      this.ammunitionTag = "bow";
    }
  };

  // src/types/DamageType.ts
  var MundaneDamageTypes = [
    "bludgeoning",
    "piercing",
    "slashing"
  ];

  // src/features/common.ts
  function bonusSpellsFeature(name, text, levelType, method, entries, addAsList) {
    return new SimpleFeature(name, text, (g2, me) => {
      var _a;
      const casterLevel = levelType === "level" ? me.level : (_a = me.classLevels.get(levelType)) != null ? _a : 1;
      const spells = entries.filter((entry) => entry.level <= casterLevel);
      for (const { resource, spell } of spells) {
        if (resource)
          me.initResource(resource);
        if (addAsList) {
          me.preparedSpells.add(spell);
          method.addCastableSpell(spell, me);
        } else
          spellImplementationWarning(spell, me);
      }
      me.spellcastingMethods.add(method);
      if (!addAsList)
        g2.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            for (const { spell } of spells)
              actions.push(new CastSpell(g2, me, method, spell));
        });
    });
  }
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

  // src/monsters/common.ts
  var KeenSmell = new SimpleFeature(
    "Keen Smell",
    `This has advantage on Wisdom (Perception) checks that rely on smell.`,
    (g2, me) => {
      g2.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("smell"))
          diceType.add("advantage", KeenSmell);
      });
    }
  );
  var PackTactics = notImplementedFeature(
    "Pack Tactics",
    `This has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn't incapacitated.`
  );
  function makeMultiattack(text, canStillAttack) {
    return new SimpleFeature("Multiattack", text, (g2, me) => {
      g2.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor === me && action.isAttack && canStillAttack(me, action))
          error.ignore(OneAttackPerTurnRule);
      });
    });
  }

  // src/monsters/fiendishParty/Kay_token.png
  var Kay_token_default = "./Kay_token-LUSXSSD5.png";

  // src/monsters/fiendishParty/Kay.ts
  var hiddenName = "Shrouded Figure";
  var realName = "Kay of the Abyss";
  var ScreamingInside = new SimpleFeature(
    "Screaming Inside",
    "Kay does an extra 4 (1d6) psychic damage when he hits with a weapon attack.",
    (g2, me) => {
      g2.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.tags.has("weapon")))
            interrupt.add(
              new EvaluateLater(me, ScreamingInside, () => __async(void 0, null, function* () {
                const amount = yield g2.rollDamage(
                  1,
                  {
                    source: ScreamingInside,
                    attacker,
                    target,
                    size: 6,
                    damageType: "psychic"
                  },
                  critical
                );
                map.add("psychic", amount);
              }))
            );
        }
      );
    }
  );
  var WreathedInShadowEffect = new Effect(
    "Wreathed in Shadow",
    "turnStart",
    (g2) => {
      g2.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
        if (target.hasEffect(WreathedInShadowEffect))
          diceType.add("disadvantage", WreathedInShadowEffect);
      });
      g2.events.on("CombatantDamaged", ({ detail: { who, total, interrupt } }) => {
        if (who.hasEffect(WreathedInShadowEffect) && total >= 10)
          interrupt.add(
            new EvaluateLater(who, WreathedInShadowEffect, () => __async(void 0, null, function* () {
              yield who.removeEffect(WreathedInShadowEffect);
              who.name = realName;
            }))
          );
      });
    }
  );
  var WreathedInShadow = new SimpleFeature(
    "Wreathed in Shadow",
    "Kay's appearance is hidden from view by a thick black fog that whirls about him. Only a DC 22 Perception check can reveal his identity. All attacks against him are at disadvantage. This effect is dispelled until the beginning of his next turn if he takes more than 10 damage in one hit.",
    (g2, me) => {
      const wreathe = new EvaluateLater(me, WreathedInShadow, () => __async(void 0, null, function* () {
        yield me.addEffect(WreathedInShadowEffect, { duration: Infinity });
        me.name = hiddenName;
      }));
      g2.events.on("BattleStarted", ({ detail: { interrupt } }) => {
        interrupt.add(wreathe);
      });
      g2.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        if (who === me && !who.hasEffect(WreathedInShadowEffect))
          interrupt.add(wreathe);
      });
    }
  );
  var SmoulderingRage = new SimpleFeature(
    "Smouldering Rage",
    "Kay resists bludgeoning, piercing, and slashing damage from nonmagical attacks.",
    (g2, me) => {
      g2.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, attack, response } }) => {
          if (who === me && !(attack == null ? void 0 : attack.pre.tags.has("magical")) && MundaneDamageTypes.includes(damageType))
            response.add("resist", SmoulderingRage);
        }
      );
    }
  );
  var Kay = class extends Monster {
    constructor(g2) {
      super(g2, hiddenName, 6, "humanoid", "medium", Kay_token_default);
      this.diesAtZero = false;
      this.hp = this.hpMax = 75;
      this.movement.set("speed", 30);
      this.setAbilityScores(14, 18, 16, 10, 8, 14);
      this.pb = 3;
      this.saveProficiencies.add("str");
      this.saveProficiencies.add("dex");
      this.skills.set("Athletics", 1);
      this.skills.set("Stealth", 2);
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.languages.add("Orc");
      this.addFeature(ScreamingInside);
      this.addFeature(WreathedInShadow);
      this.addFeature(
        makeMultiattack(
          "Kay attacks twice with his Spear or Longbow.",
          (me) => me.attacksSoFar.length < 2
        )
      );
      this.addFeature(Evasion_default);
      this.addFeature(SmoulderingRage);
      this.don(new StuddedLeatherArmor(g2), true);
      this.don(new Longbow(g2), true);
      this.don(new Spear(g2, 1), true);
      this.inventory.add(new Arrow(g2, Infinity));
    }
  };

  // src/features/fightingStyles.ts
  var FightingStyleProtection = new SimpleFeature(
    "Fighting Style: Protection",
    `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
    (g2, me) => {
      g2.events.on(
        "BeforeAttack",
        ({ detail: { who, target, interrupt, diceType } }) => {
          if (who !== me && target !== me && target.side === me.side && me.time.has("reaction") && me.shield && distance(g2, me, target) <= 5)
            interrupt.add(
              new YesNoChoice(
                me,
                FightingStyleProtection,
                "Fighting Style: Protection",
                `${target.name} is being attacked. Impose disadvantage?`,
                () => __async(void 0, null, function* () {
                  me.time.delete("reaction");
                  diceType.add("disadvantage", FightingStyleProtection);
                })
              )
            );
        }
      );
    }
  );

  // src/spells/level1/GuidingBolt.ts
  var GuidingBoltEffect = new Effect("Guiding Bolt", "turnEnd", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { target, diceType, interrupt } }) => {
      if (target.hasEffect(GuidingBoltEffect)) {
        diceType.add("advantage", GuidingBoltEffect);
        interrupt.add(
          new EvaluateLater(target, GuidingBoltEffect, () => __async(void 0, null, function* () {
            yield target.removeEffect(GuidingBoltEffect);
          }))
        );
      }
    });
  });
  var GuidingBolt = scalingSpell({
    status: "implemented",
    name: "Guiding Bolt",
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Cleric"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 120) }),
    getDamage: (_2, caster, method, { slot }) => [
      _dd((slot != null ? slot : 1) + 3, 6, "radiant")
    ],
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { slot, target }) {
        const rsa = new SpellAttack(g2, attacker, GuidingBolt, method, "ranged", {
          slot,
          target
        });
        if ((yield rsa.attack(target)).hit) {
          const damage = yield rsa.getDamage(target);
          yield rsa.damage(target, damage);
          yield target.addEffect(GuidingBoltEffect, { duration: 2 }, attacker);
        }
      });
    }
  });
  var GuidingBolt_default = GuidingBolt;

  // src/utils/text.ts
  var niceAbilityName = {
    str: "Strength",
    dex: "Dexterity",
    con: "Constitution",
    int: "Intelligence",
    wis: "Wisdom",
    cha: "Charisma"
  };
  function describeAbility(ability) {
    return niceAbilityName[ability];
  }
  function describeRange(min, max) {
    if (min === 0) {
      if (max === Infinity)
        return "any number of";
      return `up to ${max}`;
    }
    if (max === Infinity)
      return `${min}+`;
    if (min === max)
      return min.toString();
    return `${min}-${max}`;
  }
  function describePoint(p) {
    return p ? `${p.x},${p.y}` : "NONE";
  }

  // src/resolvers/MultiTargetResolver.ts
  var MultiTargetResolver = class {
    constructor(g2, minimum, maximum, maxRange, allowSelf = false) {
      this.g = g2;
      this.minimum = minimum;
      this.maximum = maximum;
      this.maxRange = maxRange;
      this.allowSelf = allowSelf;
      this.type = "Combatants";
    }
    get name() {
      return `${describeRange(this.minimum, this.maximum)} targets${this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""}${this.allowSelf ? "" : ", not self"}`;
    }
    check(value, action, ec) {
      if (!isCombatantArray(value))
        ec.add("No target", this);
      else {
        if (value.length < this.minimum)
          ec.add(`At least ${this.minimum} targets`, this);
        if (value.length > this.maximum)
          ec.add(`At most ${this.maximum} targets`, this);
        for (const who of value) {
          if (!this.allowSelf && who === action.actor)
            ec.add("Cannot target self", this);
          if (distance(this.g, action.actor, who) > this.maxRange)
            ec.add("Out of range", this);
        }
      }
      return ec;
    }
  };

  // src/spells/level3/MassHealingWord.ts
  var MassHealingWord = scalingSpell({
    status: "incomplete",
    name: "Mass Healing Word",
    level: 3,
    school: "Evocation",
    time: "bonus action",
    v: true,
    lists: ["Bard", "Cleric"],
    getConfig: (g2) => ({
      targets: new MultiTargetResolver(g2, 1, 6, 60, true)
    }),
    getHeal: (g2, caster, method, { slot }) => [
      { type: "dice", amount: { count: (slot != null ? slot : 3) - 2, size: 4 } },
      { type: "flat", amount: caster[method.ability].modifier }
    ],
    getTargets: (g2, caster, { targets }) => targets,
    // TODO This spell has no effect on undead or constructs.
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, actor, method, { slot, targets }) {
        const amount = (yield g2.rollHeal(slot - 2, {
          source: MassHealingWord,
          actor,
          size: 4
        })) + actor[method.ability].modifier;
        for (const target of targets)
          yield g2.applyHeal(target, amount, actor);
      });
    }
  });
  var MassHealingWord_default = MassHealingWord;

  // src/monsters/fiendishParty/OGonrit_token.png
  var OGonrit_token_default = "./OGonrit_token-C5AF3HHR.png";

  // src/monsters/fiendishParty/OGonrit.ts
  var FiendishMantle = new SimpleFeature(
    "Fiendish Mantle",
    "Whenever any ally within 30 ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.",
    (g2, me) => {
      g2.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, critical, interrupt, map } }) => {
          if (attacker.side === me.side && attacker !== me && (attack == null ? void 0 : attack.pre.tags.has("weapon")) && distance(g2, me, attacker) <= 30)
            interrupt.add(
              new EvaluateLater(attacker, FiendishMantle, () => __async(void 0, null, function* () {
                const amount = yield g2.rollDamage(
                  1,
                  {
                    attacker,
                    source: FiendishMantle,
                    damageType: "necrotic",
                    size: 4
                  },
                  critical
                );
                map.add("necrotic", amount);
              }))
            );
        }
      );
    }
  );
  var ShieldBashEffect = new Effect("Shield Bash", "turnEnd", (g2) => {
    g2.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(ShieldBashEffect))
        conditions.add("Stunned", ShieldBashEffect);
    });
  });
  var ShieldBashAction = class _ShieldBashAction extends AbstractAction {
    constructor(g2, actor, ability) {
      super(
        g2,
        actor,
        "Shield Bash",
        "implemented",
        { target: new TargetResolver(g2, actor.reach) },
        { time: "action" }
      );
      this.ability = ability;
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        __superGet(_ShieldBashAction.prototype, this, "apply").call(this, { target });
        const { g: g2, actor, ability } = this;
        const dc = getSaveDC(actor, ability);
        const config = { conditions: coSet("Stunned"), duration: 1 };
        const { outcome } = yield g2.savingThrow(dc, {
          ability: "con",
          attacker: actor,
          effect: ShieldBashEffect,
          config,
          who: target,
          tags: svSet()
        });
        if (outcome === "fail")
          yield target.addEffect(ShieldBashEffect, config, actor);
      });
    }
  };
  var ShieldBash = new SimpleFeature(
    "Shield Bash",
    "One enemy within 5 ft. must succeed on a DC 15 Constitution save or be stunned until the end of their next turn.",
    (g2, me) => {
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new ShieldBashAction(g2, me, "wis"));
      });
    }
  );
  var SpellcastingMethod = new InnateSpellcasting(
    "Spellcasting",
    "wis",
    () => void 0
  );
  var Spellcasting = bonusSpellsFeature(
    "Spellcasting",
    "O Gonrit can cast guiding bolt and mass healing word at will.",
    "level",
    SpellcastingMethod,
    [
      { level: 1, spell: GuidingBolt_default },
      { level: 5, spell: MassHealingWord_default }
    ]
  );
  var OGonrit = class extends Monster {
    constructor(g2) {
      super(g2, "O Gonrit", 5, "fiend", "medium", OGonrit_token_default);
      this.diesAtZero = false;
      this.hp = this.hpMax = 65;
      this.movement.set("speed", 30);
      this.setAbilityScores(12, 8, 14, 10, 18, 13);
      this.pb = 3;
      this.level = 5;
      this.saveProficiencies.add("wis");
      this.saveProficiencies.add("cha");
      this.skills.set("Insight", 1);
      this.skills.set("Persuasion", 1);
      this.damageResponses.set("fire", "resist");
      this.damageResponses.set("poison", "resist");
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.addFeature(FiendishMantle);
      this.addFeature(ShieldBash);
      this.addFeature(Spellcasting);
      this.addFeature(FightingStyleProtection);
      this.don(new SplintArmor(g2), true);
      this.don(new Shield(g2), true);
      this.don(new Mace(g2), true);
    }
  };

  // src/spells/level1/HealingWord.ts
  var HealingWord = scalingSpell({
    status: "incomplete",
    name: "Healing Word",
    level: 1,
    school: "Evocation",
    time: "bonus action",
    v: true,
    lists: ["Bard", "Cleric", "Druid"],
    getConfig: (g2) => ({
      target: new TargetResolver(g2, 60, true)
    }),
    getHeal: (g2, caster, method, { slot }) => [
      { type: "dice", amount: { count: slot != null ? slot : 1, size: 4 } },
      { type: "flat", amount: caster[method.ability].modifier }
    ],
    getTargets: (g2, caster, { target }) => [target],
    // TODO This spell has no effect on undead or constructs.
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, actor, method, { slot, target }) {
        const modifier = actor[method.ability].modifier;
        const rolled = yield g2.rollHeal(slot, {
          source: HealingWord,
          actor,
          target,
          spell: HealingWord,
          method,
          size: 4
        });
        yield g2.heal(HealingWord, rolled + modifier, {
          actor,
          spell: HealingWord,
          target
        });
      });
    }
  });
  var HealingWord_default = HealingWord;

  // src/monsters/fiendishParty/Yulash_token.png
  var Yulash_token_default = "./Yulash_token-YXCZ3ZVJ.png";

  // src/monsters/fiendishParty/Yulash.ts
  var Cheer = notImplementedFeature(
    "Cheer",
    "One ally within 30 ft. may make a melee attack against an enemy in range."
  );
  var Discord = notImplementedFeature(
    "Discord",
    "One enemy within 30 ft. must make a DC 15 Charisma save or use its reaction to make one melee attack against an ally in range."
  );
  var Irritation = notImplementedFeature(
    "Irritation",
    "One enemy within 30ft. must make a DC 15 Constitution check or lose concentration."
  );
  var SpellcastingMethod2 = new InnateSpellcasting(
    "Spellcasting",
    "cha",
    () => void 0
  );
  var Spellcasting2 = bonusSpellsFeature(
    "Spellcasting",
    "Yulash can cast healing word at will.",
    "level",
    SpellcastingMethod2,
    [{ level: 1, spell: HealingWord_default }]
  );
  var DancingStep = notImplementedFeature(
    "Dancing Step",
    "Reaction: When an enemy moves within 5 ft., Yulash teleports to a spot within 20 ft. that she can see."
  );
  var Yulash = class extends Monster {
    constructor(g2) {
      super(g2, "Yulash", 5, "monstrosity", "medium", Yulash_token_default);
      this.diesAtZero = false;
      this.hp = this.hpMax = 65;
      this.movement.set("speed", 30);
      this.setAbilityScores(8, 16, 14, 12, 13, 18);
      this.pb = 3;
      this.level = 5;
      this.saveProficiencies.add("dex");
      this.saveProficiencies.add("cha");
      this.skills.set("Deception", 1);
      this.skills.set("Perception", 1);
      this.damageResponses.set("poison", "immune");
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.addFeature(Cheer);
      this.addFeature(Discord);
      this.addFeature(Irritation);
      this.addFeature(Spellcasting2);
      this.addFeature(DancingStep);
      this.don(new LeatherArmor(g2), true);
      this.don(new Rapier(g2), true);
    }
  };

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
        console.error(`${who.name} has no config for ${this.name}`);
        return;
      }
      this.apply(g2, who, config);
    }
  };

  // src/monsters/fiendishParty/Zafron_token.png
  var Zafron_token_default = "./Zafron_token-HS5HC4BR.png";

  // src/monsters/fiendishParty/Zafron.ts
  var LustForBattle = new ConfiguredFeature(
    "Lust for Battle",
    "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
    (g2, me, weapon) => {
      g2.events.on(
        "CombatantDamaged",
        ({ detail: { attack, attacker, interrupt } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.weapon) === weapon)
            interrupt.add(
              new EvaluateLater(me, LustForBattle, (g3) => __async(void 0, null, function* () {
                yield g3.giveTemporaryHP(me, 5, LustForBattle);
              }))
            );
        }
      );
    }
  );
  var BullRush = notImplementedFeature(
    "Bull Rush",
    "Until the beginning of his next turn, Zafron gains resistance to bludgeoning, piercing and slashing damage. Then, he moves up to his speed in a single direction. All enemies that he passes through must make a DC 15 Dexterity save or be knocked prone."
  );
  var SurvivalReflex = notImplementedFeature(
    "Survival Reflex",
    "Reaction: When forced to make a skill check or saving throw, Zafron gains advantage on the roll. After the triggering action is complete, he may move up to half his speed."
  );
  var Zafron = class extends Monster {
    constructor(g2) {
      super(g2, "Zafron Halehart", 5, "fiend", "medium", Zafron_token_default);
      this.diesAtZero = false;
      this.hp = this.hpMax = 105;
      this.movement.set("speed", 30);
      this.setAbilityScores(18, 14, 20, 7, 10, 13);
      this.pb = 3;
      this.saveProficiencies.add("str");
      this.saveProficiencies.add("con");
      this.skills.set("Acrobatics", 1);
      this.skills.set("Intimidation", 1);
      this.damageResponses.set("fire", "resist");
      this.damageResponses.set("poison", "resist");
      this.languages.add("Abyssal");
      const axe = new Greataxe(g2);
      this.addFeature(LustForBattle);
      this.setConfig(LustForBattle, axe);
      this.addFeature(
        makeMultiattack(
          "Zafron attacks twice with his Greataxe.",
          (me) => me.attacksSoFar.length < 2
        )
      );
      this.addFeature(BullRush);
      this.addFeature(SurvivalReflex);
      this.don(new ScaleMailArmor(g2), true);
      this.don(axe, true);
    }
  };

  // src/types/Item.ts
  var wcSet = (...items) => new Set(items);
  var acSet = (...items) => new Set(items);

  // src/types/SkillName.ts
  var skSet = (...items) => new Set(items);

  // src/types/ToolName.ts
  var toSet = (...items) => new Set(items);

  // src/classes/common.ts
  function asiSetup(g2, me, config) {
    if (config.type === "ability")
      for (const ability of config.abilities)
        me[ability].score++;
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
  function makeExtraAttack(name, text, extra = 1) {
    return new SimpleFeature(name, text, (g2, me) => {
      g2.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.isAttack && action.actor === me && action.actor.attacksSoFar.length <= extra)
          error.ignore(OneAttackPerTurnRule);
      });
    });
  }

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
      me.initResource(SneakAttackResource);
      g2.events.on(
        "GatherDamage",
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
            const didNotHaveDisadvantage = !attack.pre.diceType.getValidEntries().includes("disadvantage");
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
                      {
                        source: SneakAttack,
                        attacker,
                        target,
                        size: 6,
                        damageType,
                        weapon,
                        ability
                      },
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

  // src/classes/rogue/SteadyAim.ts
  var SteadyAimNoMoveEffect = new Effect(
    "Steady Aim",
    "turnEnd",
    (g2) => {
      g2.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
        if (who.hasEffect(SteadyAimNoMoveEffect))
          multiplier.add("zero", SteadyAimNoMoveEffect);
      });
    },
    true
  );
  var SteadyAimAdvantageEffect = new Effect("Steady Aim", "turnEnd", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
      if (who.hasEffect(SteadyAimAdvantageEffect))
        diceType.add("advantage", SteadyAimAdvantageEffect);
    });
    g2.events.on("Attack", ({ detail: { pre, interrupt } }) => {
      if (pre.diceType.isInvolved(SteadyAimAdvantageEffect))
        interrupt.add(
          new EvaluateLater(pre.who, SteadyAimAdvantageEffect, () => __async(void 0, null, function* () {
            yield pre.who.removeEffect(SteadyAimAdvantageEffect);
          }))
        );
    });
  });
  var SteadyAimAction = class _SteadyAimAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "Steady Aim", "implemented", {}, { time: "bonus action" });
    }
    check(config, ec) {
      if (this.actor.movedSoFar)
        ec.add("Already moved this turn", this);
      return super.check(config, ec);
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_SteadyAimAction.prototype, this, "apply").call(this, {});
        yield this.actor.addEffect(SteadyAimNoMoveEffect, { duration: 1 });
        yield this.actor.addEffect(SteadyAimAdvantageEffect, { duration: 1 });
      });
    }
  };
  var SteadyAim = new SimpleFeature(
    "Steady Aim",
    `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`,
    (g2, me) => {
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SteadyAimAction(g2, me));
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
          if (me.toolProficiencies.has(entry))
            me.toolProficiencies.set(entry, 2);
          else
            console.warn(`Expertise in ${entry} without existing proficiency`);
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
  var CunningAction = new SimpleFeature(
    "Cunning Action",
    `Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.`,
    (g2, me) => {
      console.warn(`[Feature Not Complete] Cunning Action (on ${me.name})`);
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          const cunning = [new DashAction(g2, who), new DisengageAction(g2, who)];
          for (const action of cunning) {
            action.name += " (Cunning Action)";
            action.time = "bonus action";
          }
          actions.push(...cunning);
        }
      });
    }
  );
  var UncannyDodge = new SimpleFeature(
    "Uncanny Dodge",
    `Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
    (g2, me) => {
      g2.events.on(
        "GatherDamage",
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
                  multiplier.add("half", UncannyDodge);
                })
              )
            );
        }
      );
    }
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
    armorProficiencies: acSet("light"),
    weaponCategoryProficiencies: wcSet("simple"),
    weaponProficiencies: /* @__PURE__ */ new Set([
      "hand crossbow",
      "longsword",
      "rapier",
      "shortsword"
    ]),
    toolProficiencies: toSet("thieves' tools"),
    saveProficiencies: abSet("dex", "int"),
    skillChoices: 4,
    skillProficiencies: skSet(
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
    ),
    features: /* @__PURE__ */ new Map([
      [1, [Expertise, SneakAttack_default, ThievesCant]],
      [2, [CunningAction]],
      [3, [SteadyAim_default]],
      [4, [ASI4]],
      [5, [UncannyDodge]],
      [7, [Evasion_default]],
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

  // src/movement.ts
  var getDefaultMovement = (who) => ({
    name: "Movement",
    cannotApproach: /* @__PURE__ */ new Set(),
    maximum: who.speed,
    mustUseAll: false,
    provokesOpportunityAttacks: true,
    onMove(who2, cost) {
      who2.movedSoFar += cost;
      return who2.movedSoFar >= who2.speed;
    }
  });
  var BoundedMoveRule = new DndRule("Bounded Movement", (g2) => {
    g2.events.on("BeforeMove", ({ detail: { who, from, to, handler, error } }) => {
      for (const other of handler.cannotApproach) {
        const otherPos = g2.getState(other).position;
        const oldDistance = getDistanceBetween(
          from,
          who.sizeInUnits,
          otherPos,
          other.sizeInUnits
        );
        const newDistance = getDistanceBetween(
          to,
          who.sizeInUnits,
          otherPos,
          other.sizeInUnits
        );
        if (newDistance < oldDistance)
          error.add(`cannot move towards ${other.name}`, BoundedMoveRule);
      }
    });
  });
  var BoundedMove = class {
    constructor(source, maximum, {
      cannotApproach = [],
      mustUseAll = false,
      provokesOpportunityAttacks = true
    } = {}) {
      this.source = source;
      this.maximum = maximum;
      this.name = source.name;
      this.used = 0;
      this.cannotApproach = new Set(cannotApproach);
      this.mustUseAll = mustUseAll;
      this.provokesOpportunityAttacks = provokesOpportunityAttacks;
    }
    onMove(who, cost) {
      this.used += cost;
      return this.used >= this.maximum;
    }
  };

  // src/classes/rogue/Scout/index.ts
  var Skirmisher = new SimpleFeature(
    "Skirmisher",
    `Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.`,
    (g2, me) => {
      g2.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        if (who.side !== me.side && me.time.has("reaction") && distance(g2, me, who) <= 5)
          interrupt.add(
            new YesNoChoice(
              me,
              Skirmisher,
              "Skirmisher",
              `Use ${me.name}'s reaction to move half their speed?`,
              () => __async(void 0, null, function* () {
                me.time.delete("reaction");
                return g2.applyBoundedMove(
                  me,
                  new BoundedMove(Skirmisher, me.speed / 2, {
                    provokesOpportunityAttacks: false
                  })
                );
              })
            )
          );
      });
    }
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
  var weaponPlus = (value, rarity) => ({
    name: `+${value} bonus`,
    setup(g2, item) {
      item.name = `${item.name} +${value}`;
      item.magical = true;
      item.rarity = rarity;
      g2.events.on("BeforeAttack", ({ detail: { weapon, ammo, bonus } }) => {
        if (weapon === item || ammo === item)
          bonus.add(value, this);
      });
      g2.events.on("GatherDamage", ({ detail: { weapon, ammo, bonus } }) => {
        if (weapon === item || ammo === item)
          bonus.add(value, this);
      });
    }
  });
  var weaponPlus1 = weaponPlus(1, "Uncommon");
  var weaponPlus2 = weaponPlus(2, "Rare");
  var weaponPlus3 = weaponPlus(3, "Very Rare");
  var armorPlus = (value, rarity) => ({
    name: `+${value} bonus`,
    setup(g2, item) {
      item.name = `${item.name} +${value}`;
      item.magical = true;
      item.rarity = rarity;
      item.ac += value;
    }
  });
  var armorPlus1 = armorPlus(1, "Rare");
  var armorPlus2 = armorPlus(2, "Very Rare");
  var armorPlus3 = armorPlus(3, "Legendary");

  // src/events/ListChoiceEvent.ts
  var ListChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("ListChoice", { detail });
    }
  };

  // src/interruptions/PickFromListChoice.ts
  var PickFromListChoice = class {
    constructor(who, source, title, text, items, chosen) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.items = items;
      this.chosen = chosen;
    }
    apply(g2) {
      return __async(this, null, function* () {
        const choice = yield new Promise(
          (resolve) => g2.fire(new ListChoiceEvent({ interruption: this, resolve }))
        );
        return this.chosen(choice);
      });
    }
  };

  // src/enchantments/weapon.ts
  var ChaoticBurstResource = new TurnResource("Chaotic Burst", 1);
  var chaoticBurstTypes = [
    "acid",
    "cold",
    "fire",
    "force",
    "lightning",
    "poison",
    "psychic",
    "thunder"
  ];
  var getOptionFromRoll = (roll) => {
    const value = chaoticBurstTypes[roll - 1];
    return { label: value, value };
  };
  var chaoticBurst = {
    name: "chaotic burst",
    setup(g2, item) {
      weaponPlus1.setup(g2, item);
      item.name = `chaotic burst ${item.weaponType}`;
      item.attunement = true;
      item.rarity = "Rare";
      g2.events.on("TurnStarted", ({ detail: { who } }) => {
        if (who.equipment.has(item) && who.attunements.has(item))
          who.initResource(ChaoticBurstResource);
      });
      g2.events.on(
        "GatherDamage",
        ({ detail: { attacker, critical, interrupt, map } }) => {
          if (critical && attacker.equipment.has(item) && attacker.attunements.has(item) && attacker.hasResource(ChaoticBurstResource)) {
            attacker.spendResource(ChaoticBurstResource);
            const a = g2.dice.roll({
              source: chaoticBurst,
              type: "damage",
              attacker,
              size: 8
            }).value;
            const b = g2.dice.roll({
              source: chaoticBurst,
              type: "damage",
              attacker,
              size: 8
            }).value;
            const addBurst = (type) => map.add(type, a + b);
            if (a === b)
              addBurst(chaoticBurstTypes[a - 1]);
            else
              interrupt.add(
                new PickFromListChoice(
                  attacker,
                  chaoticBurst,
                  "Chaotic Burst",
                  "Choose the damage type:",
                  [a, b].map(getOptionFromRoll),
                  (type) => __async(this, null, function* () {
                    return addBurst(type);
                  })
                )
              );
          }
        }
      );
    }
  };
  var vicious = {
    name: "vicious",
    setup(g2, item) {
      item.name = `vicious ${item.name}`;
      item.magical = true;
      item.rarity = "Rare";
      g2.events.on("GatherDamage", ({ detail: { weapon, bonus, attack } }) => {
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
      me.initResource(LuckPoint);
      g2.events.on("DiceRolled", ({ detail }) => {
        const { type, interrupt, value } = detail;
        if ((type.type === "attack" || type.type === "check" || type.type === "save") && type.who === me && me.hasResource(LuckPoint))
          addLuckyOpportunity(
            g2,
            me,
            `${me.name} got ${value} on a ${type.type} roll. Use a Luck point to re-roll?`,
            interrupt,
            (roll) => {
              if (roll > value) {
                detail.otherValues.push(value);
                detail.value = roll;
              } else
                detail.otherValues.push(roll);
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
                detail.otherValues.push(value);
                detail.value = roll;
              } else
                detail.otherValues.push(roll);
            }
          );
      });
    }
  );
  var Lucky_default = Lucky;

  // src/features/boons.ts
  var HissResource = new ShortRestResource("Hiss (Boon of Vassetri)", 1);
  var HissAction = class _HissAction extends AbstractAction {
    constructor(g2, actor) {
      super(
        g2,
        actor,
        "Hiss (Boon of Vassetri)",
        "implemented",
        { target: new TargetResolver(g2, 5) },
        { time: "bonus action", resources: [[HissResource, 1]] }
      );
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        __superGet(_HissAction.prototype, this, "apply").call(this, { target });
        const { g: g2, actor } = this;
        if (target.time.has("reaction")) {
          const dc = getSaveDC(actor, "cha");
          const save = yield g2.savingThrow(dc, {
            who: target,
            attacker: actor,
            ability: "wis",
            tags: svSet("frightened", "forced movement")
          });
          if (save.outcome === "fail") {
            target.time.delete("reaction");
            yield g2.applyBoundedMove(
              target,
              new BoundedMove(this, target.speed / 2, {
                cannotApproach: [actor],
                mustUseAll: true,
                provokesOpportunityAttacks: false
              })
            );
          }
        }
      });
    }
  };
  var BoonOfVassetri = new SimpleFeature(
    "Boon of Vassetri",
    `You dared ask Vassetri for a boon of power and a bite on the neck was your reward. It provides the following benefits:

  - You may cast the spell [speak with animals] at will, but it can only target snakes.
  - As a bonus action, you hiss threateningly at an enemy within 5 feet. If the enemy fails a Wisdom save, they must spend their reaction to move half of their speed away from you in any direction. The DC is 8 + your proficiency bonus + your Charisma modifier. You can only use this ability once per short or long rest, and only when you are able to speak.`,
    (g2, me) => {
      console.warn(`[Feature Not Complete] Boon of Vassetri (on ${me.name})`);
      me.initResource(HissResource);
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new HissAction(g2, me));
      });
    }
  );

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
      this.attunement = true;
      this.rarity = "Uncommon";
      g2.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
        if (attacker.equipment.has(this) && attacker.attunements.has(this) && (weapon == null ? void 0 : weapon.ammunitionTag) === "crossbow")
          bonus.add(2, this);
      });
    }
  };
  var BootsOfTheWinterlands = class extends AbstractWondrous {
    constructor(g2) {
      super(g2, "Boots of the Winterlands");
      this.attunement = true;
      this.rarity = "Uncommon";
      g2.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who.equipment.has(this) && who.attunements.has(this) && damageType === "cold")
            response.add("resist", this);
        }
      );
    }
  };
  var CloakOfProtection = class extends AbstractWondrous {
    constructor(g2) {
      super(g2, "Cloak of Protection");
      this.attunement = true;
      this.rarity = "Uncommon";
      g2.events.on("GetACMethods", ({ detail: { who, methods } }) => {
        if (who.equipment.has(this) && who.attunements.has(this))
          for (const method of methods) {
            method.ac++;
            method.uses.add(this);
          }
      });
      g2.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
        if (who.equipment.has(this) && who.attunements.has(this))
          bonus.add(1, this);
      });
    }
  };
  var DragonTouchedFocus = class extends AbstractWondrous {
    constructor(g2, level) {
      super(g2, `Dragon-Touched Focus (${level})`, 1);
      this.attunement = true;
      this.rarity = "Uncommon";
      g2.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
        if (who.equipment.has(this) && who.attunements.has(this))
          diceType.add("advantage", this);
      });
    }
  };
  var FigurineOfWondrousPower = class extends AbstractWondrous {
    constructor(g2, type) {
      super(g2, `Figurine of Wondrous Power, ${type}`, 0);
      this.type = type;
    }
  };
  var RingOfAwe = class extends AbstractWondrous {
    constructor(g2) {
      super(g2, "Ring of Awe", 0);
      this.attunement = true;
      this.rarity = "Rare";
    }
  };
  var SilverShiningAmulet = class extends AbstractWondrous {
    constructor(g2) {
      super(g2, "Silver Shining Amulet", 0);
      this.attunement = true;
      this.rarity = "Rare";
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
      var _a, _b, _c, _d;
      if (race.parent)
        this.setRace(race.parent);
      this.race = race;
      this.size = race.size;
      for (const [ability, bonus] of (_a = race == null ? void 0 : race.abilities) != null ? _a : [])
        this[ability].score += bonus;
      for (const [type, value] of (_b = race == null ? void 0 : race.movement) != null ? _b : [])
        this.movement.set(type, value);
      for (const language of (_c = race == null ? void 0 : race.languages) != null ? _c : [])
        this.languages.add(language);
      for (const feature of (_d = race == null ? void 0 : race.features) != null ? _d : [])
        this.addFeature(feature);
    }
    addClassLevel(cls, hpRoll) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const level = ((_a = this.classLevels.get(cls.name)) != null ? _a : 0) + 1;
      this.classLevels.set(cls.name, level);
      this.level++;
      this.pb = getProficiencyBonusByLevel(this.level);
      this.hpMax += (hpRoll != null ? hpRoll : getDefaultHPRoll(this.level, cls.hitDieSize)) + this.con.modifier;
      if (level === 1) {
        for (const prof of (_b = cls == null ? void 0 : cls.armorProficiencies) != null ? _b : [])
          this.armorProficiencies.add(prof);
        for (const prof of (_c = cls == null ? void 0 : cls.saveProficiencies) != null ? _c : [])
          this.saveProficiencies.add(prof);
        for (const prof of (_d = cls == null ? void 0 : cls.toolProficiencies) != null ? _d : [])
          this.toolProficiencies.set(prof, 1);
        for (const prof of (_e = cls == null ? void 0 : cls.weaponCategoryProficiencies) != null ? _e : [])
          this.weaponCategoryProficiencies.add(prof);
        for (const prof of (_f = cls == null ? void 0 : cls.weaponProficiencies) != null ? _f : [])
          this.weaponProficiencies.add(prof);
      }
      for (const feature of (_g = cls.features.get(level)) != null ? _g : [])
        this.addFeature(feature);
      const sub = this.subclasses.get(cls.name);
      for (const feature of (_h = sub == null ? void 0 : sub.features.get(level)) != null ? _h : [])
        this.addFeature(feature);
    }
    addSubclass(sub) {
      this.subclasses.set(sub.className, sub);
    }
  };

  // src/spells/level2/Levitate.ts
  var Levitate = simpleSpell({
    name: "Levitate",
    level: 2,
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end",
    lists: ["Druid", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 60, true) }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
      });
    }
  });
  var Levitate_default = Levitate;

  // src/types/LanguageName.ts
  var laSet = (...items) => new Set(items);

  // src/races/Genasi_EEPC.ts
  var Genasi = {
    name: "Genasi",
    size: "medium",
    abilities: /* @__PURE__ */ new Map([["con", 2]]),
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    languages: laSet("Common", "Primordial")
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
      me.initResource(MingleWithTheWindResource);
      spellImplementationWarning(Levitate_default, me);
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new CastSpell(g2, me, MingleWithTheWindMethod, Levitate_default));
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
      this.toolProficiencies.set("dice set", 1);
      this.toolProficiencies.set("horn", 1);
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
      this.addFeature(BoonOfVassetri);
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
      this.inventory.add(enchant(new CrossbowBolt(g2, 15), weaponPlus1));
    }
  };

  // src/spells/NormalSpellcasting.ts
  var SpellSlots = {
    full: [
      [2],
      [3],
      [4, 2],
      [4, 3],
      [4, 3, 2],
      [4, 3, 3],
      [4, 3, 3, 1],
      [4, 3, 3, 2],
      [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 2],
      [4, 3, 3, 3, 2, 1],
      [4, 3, 3, 3, 2, 1],
      [4, 3, 3, 3, 2, 1, 1],
      [4, 3, 3, 3, 2, 1, 1],
      [4, 3, 3, 3, 2, 1, 1, 1],
      [4, 3, 3, 3, 2, 1, 1, 1],
      [4, 3, 3, 3, 2, 1, 1, 1, 1],
      [4, 3, 3, 3, 3, 1, 1, 1, 1],
      [4, 3, 3, 3, 3, 2, 1, 1, 1],
      [4, 3, 3, 3, 3, 2, 2, 1, 1]
    ],
    half: [
      [],
      [2],
      [3],
      [4],
      [4, 2],
      [4, 2],
      [4, 3],
      [4, 3],
      [4, 3, 2],
      [4, 3, 2],
      [4, 3, 3],
      [4, 3, 3],
      [4, 3, 3, 1],
      [4, 3, 3, 1],
      [4, 3, 3, 2],
      [4, 3, 3, 2],
      [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 1],
      [4, 3, 3, 3, 2],
      [4, 3, 3, 3, 2]
    ]
  };
  var getSpellSlotResourceName = (level) => `Spell Slot (${level})`;
  var SpellSlotResources = enumerate(0, 9).map(
    (slot) => new LongRestResource(getSpellSlotResourceName(slot), 0)
  );
  function getMaxSpellSlotAvailable(who) {
    for (let level = 1; level <= 9; level++) {
      const name = getSpellSlotResourceName(level);
      if (!who.resources.has(name))
        return level - 1;
    }
    return 9;
  }
  var NormalSpellcasting = class {
    constructor(name, text, ability, strength, className, list, icon) {
      this.name = name;
      this.text = text;
      this.ability = ability;
      this.strength = strength;
      this.className = className;
      this.list = list;
      this.icon = icon;
      this.entries = /* @__PURE__ */ new Map();
      this.feature = new SimpleFeature("Spellcasting", text, (g2, me) => {
        var _a;
        this.initialise(me, (_a = me.classLevels.get(className)) != null ? _a : 1);
        me.spellcastingMethods.add(this);
        g2.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me) {
            for (const spell of me.preparedSpells) {
              if (spell.time !== "reaction" && this.canCast(spell, who))
                actions.push(new CastSpell(g2, me, this, spell));
            }
          }
        });
      });
    }
    getEntry(who) {
      const entry = this.entries.get(who);
      if (!entry)
        throw new Error(
          `${who.name} has not initialised their ${this.name} spellcasting method.`
        );
      return entry;
    }
    canCast(spell, caster) {
      const { spells } = this.getEntry(caster);
      return spell.lists.includes(this.list) || spells.has(spell);
    }
    addCastableSpell(spell, caster) {
      const { spells } = this.getEntry(caster);
      spells.add(spell);
    }
    initialise(who, casterLevel) {
      const slots = SpellSlots[this.strength][casterLevel - 1];
      const resources = [];
      for (let i = 0; i < slots.length; i++) {
        const resource = SpellSlotResources[i + 1];
        who.initResource(resource, slots[i]);
        resources.push(resource);
      }
      this.entries.set(who, { resources, spells: /* @__PURE__ */ new Set() });
    }
    getMinSlot(spell) {
      return spell.level;
    }
    getMaxSlot(spell, who) {
      if (!spell.scaling)
        return spell.level;
      const { resources } = this.getEntry(who);
      return resources.length;
    }
    getResourceForSpell(spell, level, who) {
      const { resources } = this.getEntry(who);
      return resources[level - 1];
    }
  };

  // src/classes/wizard/index.ts
  var ArcaneRecovery = nonCombatFeature(
    "Arcane Recovery",
    `You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.

For example, if you're a 4th-level wizard, you can recover up to two levels worth of spell slots.

You can recover either a 2nd-level spell slot or two 1st-level spell slots.`
  );
  var WizardSpellcasting = new NormalSpellcasting(
    "Wizard",
    `As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power.`,
    "int",
    "full",
    "Wizard",
    "Wizard"
  );
  var CantripFormulas = nonCombatFeature(
    "Cantrip Formulas",
    `You have scribed a set of arcane formulas in your spellbook that you can use to formulate a cantrip in your mind. Whenever you finish a long rest and consult those formulas in your spellbook, you can replace one wizard cantrip you know with another cantrip from the wizard spell list.`
  );
  var SpellMastery = notImplementedFeature(
    "Spell Mastery",
    `At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal.

By spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels.`
  );
  var SignatureSpells = notImplementedFeature(
    "Signature Spells",
    `When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.

If you want to cast either spell at a higher level, you must expend a spell slot as normal.`
  );
  var ASI42 = makeASI("Wizard", 4);
  var ASI82 = makeASI("Wizard", 8);
  var ASI122 = makeASI("Wizard", 12);
  var ASI162 = makeASI("Wizard", 16);
  var ASI192 = makeASI("Wizard", 19);
  var Wizard = {
    name: "Wizard",
    hitDieSize: 6,
    weaponProficiencies: /* @__PURE__ */ new Set([
      "dagger",
      "dart",
      "sling",
      "quarterstaff",
      "light crossbow"
    ]),
    saveProficiencies: abSet("int", "wis"),
    skillChoices: 2,
    skillProficiencies: skSet(
      "Arcana",
      "History",
      "Insight",
      "Investigation",
      "Medicine",
      "Religion"
    ),
    features: /* @__PURE__ */ new Map([
      [1, [ArcaneRecovery, WizardSpellcasting.feature]],
      [3, [CantripFormulas]],
      [4, [ASI42]],
      [8, [ASI82]],
      [12, [ASI122]],
      [16, [ASI162]],
      [18, [SpellMastery]],
      [19, [ASI192]],
      [20, [SignatureSpells]]
    ])
  };
  var wizard_default = Wizard;

  // src/events/MultiListChoiceEvent.ts
  var MultiListChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("MultiListChoice", { detail });
    }
  };

  // src/interruptions/MultiListChoice.ts
  var MultiListChoice = class {
    constructor(who, source, title, text, items, minimum, maximum = items.length, chosen) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.items = items;
      this.minimum = minimum;
      this.maximum = maximum;
      this.chosen = chosen;
    }
    apply(g2) {
      return __async(this, null, function* () {
        const choice = yield new Promise(
          (resolve) => g2.fire(new MultiListChoiceEvent({ interruption: this, resolve }))
        );
        return this.chosen(choice);
      });
    }
  };

  // src/classes/wizard/Evocation/index.ts
  var EvocationSavant = nonCombatFeature(
    "Evocation Savant",
    `Beginning when you select this school at 2nd level, the gold and time you must spend to copy an evocation spell into your spellbook is halved.`
  );
  var SculptSpells = new SimpleFeature(
    "Sculpt Spells",
    `Beginning at 2nd level, you can create pockets of relative safety within the effects of your evocation spells. When you cast an evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 + the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.`,
    (g2, me) => {
      g2.events.on(
        "SpellCast",
        ({ detail: { who, spell, level, targets, interrupt } }) => {
          if (who === me && spell.school === "Evocation")
            interrupt.add(
              new MultiListChoice(
                me,
                SculptSpells,
                "Sculpt Spells",
                `Pick combatants who will be somewhat protected from your spell.`,
                Array.from(targets).map((value) => ({
                  value,
                  label: value.name
                })),
                0,
                level + 1,
                (chosen) => __async(void 0, null, function* () {
                  for (const target of chosen) {
                    const unsubscribe = g2.events.on(
                      "BeforeSave",
                      ({
                        detail: {
                          who: who2,
                          spell: saveSpell,
                          attacker,
                          successResponse,
                          saveDamageResponse
                        }
                      }) => {
                        if (attacker === me && who2 === target && saveSpell === spell) {
                          successResponse.add("success", SculptSpells);
                          saveDamageResponse.add("zero", SculptSpells);
                          unsubscribe();
                        }
                      }
                    );
                  }
                })
              )
            );
        }
      );
    }
  );
  var PotentCantrip = new SimpleFeature(
    "Potent Cantrip",
    `Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.`,
    (g2, me) => {
      g2.events.on(
        "BeforeSave",
        ({ detail: { attacker, spell, saveDamageResponse } }) => {
          if (attacker === me && (spell == null ? void 0 : spell.level) === 0)
            saveDamageResponse.add("half", PotentCantrip);
        }
      );
    }
  );
  var EmpoweredEvocation = notImplementedFeature(
    "Empowered Evocation",
    `Beginning at 10th level, you can add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.`
  );
  var Overchannel = notImplementedFeature(
    "Overchannel",
    `Starting at 14th level, you can increase the power of your simpler spells. When you cast a wizard spell of 1st through 5th-level that deals damage, you can deal maximum damage with that spell.

The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a long rest, you take 2d12 necrotic damage for each level of the spell, immediately after you cast it. Each time you use this feature again before finishing a long rest, the necrotic damage per spell level increases by 1d12. This damage ignores resistance and immunity.`
  );
  var Evocation = {
    name: "Evocation",
    className: "Wizard",
    features: /* @__PURE__ */ new Map([
      [2, [EvocationSavant, SculptSpells]],
      [6, [PotentCantrip]],
      [10, [EmpoweredEvocation]],
      [14, [Overchannel]]
    ])
  };
  var Evocation_default = Evocation;

  // src/aim.ts
  var eighth = Math.PI / 4;
  var eighthOffset = eighth / 2;
  var octant1 = eighthOffset;
  var octant2 = octant1 + eighth;
  var octant3 = octant2 + eighth;
  var octant4 = octant3 + eighth;
  var octant5 = octant4 + eighth;
  var octant6 = octant5 + eighth;
  var octant7 = octant6 + eighth;
  var octant8 = octant7 + eighth;
  function getAimOffset(a, b) {
    let angle = Math.atan2(b.y - a.y, b.x - a.x);
    if (angle < 0)
      angle += Math.PI * 2;
    if (angle < octant1)
      return { x: 1, y: 0.5 };
    else if (angle < octant2)
      return { x: 1, y: 1 };
    else if (angle < octant3)
      return { x: 0.5, y: 1 };
    else if (angle < octant4)
      return { x: 0, y: 1 };
    else if (angle < octant5)
      return { x: 0, y: 0.5 };
    else if (angle < octant6)
      return { x: 0, y: 0 };
    else if (angle < octant7)
      return { x: 0.5, y: 0 };
    else if (angle < octant8)
      return { x: 1, y: 0 };
    return { x: 1, y: 0.5 };
  }
  function aimCone(position, size, aim, radius) {
    const offset = getAimOffset(position, aim);
    return {
      type: "cone",
      radius,
      centre: addPoints(position, mulPoint(offset, size)),
      target: addPoints(aim, mulPoint(offset, MapSquareSize))
    };
  }
  function aimLine(position, size, aim, length, width) {
    const offset = getAimOffset(position, aim);
    return {
      type: "line",
      length,
      width,
      start: addPoints(position, mulPoint(offset, size)),
      target: addPoints(aim, mulPoint(offset, MapSquareSize))
    };
  }

  // src/resolvers/PointResolver.ts
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
    check(value, action, ec) {
      if (!isPoint(value))
        ec.add("No target", this);
      else {
        if (distanceTo(this.g, action.actor, value) > this.maxRange)
          ec.add("Out of range", this);
      }
      return ec;
    }
  };

  // src/races/common.ts
  function poisonResistance(name, text) {
    const feature = new SimpleFeature(name, text, (g2, me) => {
      g2.events.on("BeforeSave", ({ detail: { who, diceType, tags } }) => {
        if (who === me && tags.has("poison"))
          diceType.add("advantage", feature);
      });
      g2.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who === me && damageType === "poison")
            response.add("resist", feature);
        }
      );
    });
    return feature;
  }
  function resistanceFeature(name, text, types) {
    const feature = new SimpleFeature(name, text, (g2, me) => {
      g2.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response: result } }) => {
          if (who === me && types.includes(damageType))
            result.add("resist", feature);
        }
      );
    });
    return feature;
  }

  // src/races/Dragonborn_FTD.ts
  var MetallicDragonborn = {
    name: "Dragonborn (Metallic)",
    size: "medium",
    movement: /* @__PURE__ */ new Map([["speed", 30]])
  };
  var BreathWeaponResource = new LongRestResource("Breath Weapon", 2);
  var MetallicBreathWeaponResource = new LongRestResource(
    "Metallic Breath Weapon",
    1
  );
  function getBreathArea(g2, me, point) {
    const position = g2.getState(me).position;
    const size = me.sizeInUnits;
    return aimCone(position, size, point, 15);
  }
  var BreathWeaponAction = class _BreathWeaponAction extends AbstractAttackAction {
    constructor(g2, actor, damageType, damageDice) {
      super(
        g2,
        actor,
        "Breath Weapon",
        "incomplete",
        { point: new PointResolver(g2, 15) },
        {
          damage: [_dd(damageDice, 10, damageType)],
          resources: [[BreathWeaponResource, 1]]
        }
      );
      this.damageType = damageType;
      this.damageDice = damageDice;
    }
    getAffectedArea({ point }) {
      if (point)
        return [getBreathArea(this.g, this.actor, point)];
    }
    apply(_0) {
      return __async(this, arguments, function* ({ point }) {
        __superGet(_BreathWeaponAction.prototype, this, "apply").call(this, { point });
        const { actor: attacker, g: g2, damageDice, damageType } = this;
        const damage = yield g2.rollDamage(damageDice, {
          source: this,
          attacker,
          size: 10,
          damageType
        });
        const dc = 8 + attacker.con.modifier + attacker.pb;
        for (const target of g2.getInside(getBreathArea(g2, attacker, point))) {
          const save = yield g2.savingThrow(dc, {
            attacker,
            who: target,
            ability: "dex",
            tags: svSet()
          });
          yield g2.damage(
            this,
            damageType,
            { attacker, target },
            [[damageType, damage]],
            save.damageResponse
          );
        }
      });
    }
  };
  function getBreathWeaponDamageDice(level) {
    if (level < 5)
      return 1;
    if (level < 11)
      return 2;
    if (level < 17)
      return 3;
    return 4;
  }
  var MetallicBreathAction = class extends AbstractAttackAction {
    constructor(g2, actor, name, status = "missing") {
      super(
        g2,
        actor,
        name,
        status,
        { point: new PointResolver(g2, 15) },
        { resources: [[MetallicBreathWeaponResource, 1]] }
      );
    }
    getAffectedArea({
      point
    }) {
      if (point)
        return [getBreathArea(this.g, this.actor, point)];
    }
  };
  var EnervatingBreathEffect = new Effect(
    "Enervating Breath",
    "turnStart",
    (g2) => {
      g2.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(EnervatingBreathEffect))
          conditions.add("Incapacitated", EnervatingBreathEffect);
      });
    }
  );
  var EnervatingBreathAction = class _EnervatingBreathAction extends MetallicBreathAction {
    constructor(g2, actor) {
      super(g2, actor, "Enervating Breath", "implemented");
    }
    apply(_0) {
      return __async(this, arguments, function* ({ point }) {
        __superGet(_EnervatingBreathAction.prototype, this, "apply").call(this, { point });
        const { g: g2, actor } = this;
        const dc = getSaveDC(actor, "con");
        const config = { conditions: coSet("Incapacitated"), duration: 2 };
        for (const target of g2.getInside(getBreathArea(g2, actor, point))) {
          const save = yield g2.savingThrow(dc, {
            attacker: actor,
            ability: "con",
            who: target,
            effect: EnervatingBreathEffect,
            config,
            tags: svSet()
          });
          if (!save)
            yield target.addEffect(EnervatingBreathEffect, config, actor);
        }
      });
    }
  };
  var RepulsionBreathAction = class _RepulsionBreathAction extends MetallicBreathAction {
    constructor(g2, actor) {
      super(g2, actor, "Repulsion Breath", "incomplete");
    }
    apply(config) {
      return __async(this, null, function* () {
        __superGet(_RepulsionBreathAction.prototype, this, "apply").call(this, config);
        const { g: g2, actor } = this;
        const dc = getSaveDC(actor, "con");
        for (const target of g2.getInside(
          getBreathArea(this.g, actor, config.point)
        )) {
          const save = yield g2.savingThrow(dc, {
            attacker: actor,
            ability: "str",
            who: target,
            effect: Prone,
            tags: svSet()
          });
          if (!save) {
            yield target.addEffect(Prone, { duration: Infinity });
          }
        }
      });
    }
  };
  function makeAncestry(a, dt) {
    const breathWeapon = new SimpleFeature(
      "Breath Weapon",
      `When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in a 15-foot cone. Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). On a failed save, the creature takes 1d10 damage of the type associated with your Metallic Ancestry. On a successful save, it takes half as much damage. This damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).

  You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
      (g2, me) => {
        me.initResource(BreathWeaponResource, me.pb);
        g2.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            actions.push(
              new BreathWeaponAction(
                g2,
                me,
                dt,
                getBreathWeaponDamageDice(me.level)
              )
            );
        });
      }
    );
    const draconicResistance = resistanceFeature(
      "Draconic Resistance",
      `You have resistance to the damage type associated with your Metallic Ancestry.`,
      [dt]
    );
    const metallicBreathWeapon = new SimpleFeature(
      "Metallic Breath Weapon",
      `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus. Whenever you use this trait, choose one:

  - Enervating Breath. Each creature in the cone must succeed on a Constitution saving throw or become incapacitated until the start of your next turn.

  - Repulsion Breath. Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.

  Once you use your Metallic Breath Weapon, you can\u2019t do so again until you finish a long rest.`,
      (g2, me) => {
        if (me.level < 5)
          return;
        console.warn(
          `[Feature Not Complete] Metallic Breath Weapon (on ${me.name})`
        );
        me.initResource(MetallicBreathWeaponResource);
        g2.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me) {
            actions.push(new EnervatingBreathAction(g2, me));
            actions.push(new RepulsionBreathAction(g2, me));
          }
        });
      }
    );
    return {
      parent: MetallicDragonborn,
      name: `${a} Dragonborn`,
      size: "medium",
      features: /* @__PURE__ */ new Set([breathWeapon, draconicResistance, metallicBreathWeapon])
    };
  }
  var BronzeDragonborn = makeAncestry("Bronze", "lightning");

  // src/spells/cantrip/AcidSplash.ts
  var AcidSplash = simpleSpell({
    status: "implemented",
    name: "Acid Splash",
    level: 0,
    school: "Conjuration",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ targets: new MultiTargetResolver(g2, 1, 2, 60) }),
    getDamage: (g2, caster) => [_dd(getCantripDice(caster), 6, "acid")],
    getTargets: (g2, caster, { targets }) => targets,
    check(g2, { targets }, ec) {
      if (isCombatantArray(targets) && targets.length === 2) {
        const [a, b] = targets;
        if (distance(g2, a, b) > 5)
          ec.add("Targets are not within 5 feet of each other", AcidSplash);
      }
      return ec;
    },
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { targets }) {
        const count = getCantripDice(attacker);
        const damage = yield g2.rollDamage(count, {
          source: AcidSplash,
          size: 6,
          attacker,
          spell: AcidSplash,
          method,
          damageType: "acid"
        });
        for (const target of targets) {
          const save = yield g2.savingThrow(
            getSaveDC(attacker, method.ability),
            {
              who: target,
              attacker,
              ability: "dex",
              spell: AcidSplash,
              method,
              tags: svSet()
            },
            { fail: "normal", save: "zero" }
          );
          yield g2.damage(
            AcidSplash,
            "acid",
            { attacker, target, spell: AcidSplash, method },
            [["acid", damage]],
            save.damageResponse
          );
        }
      });
    }
  });
  var AcidSplash_default = AcidSplash;

  // src/spells/cantrip/FireBolt.ts
  var FireBolt = simpleSpell({
    status: "implemented",
    name: "Fire Bolt",
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 60) }),
    getDamage: (g2, caster) => [_dd(getCantripDice(caster), 10, "fire")],
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { target }) {
        const rsa = new SpellAttack(g2, attacker, FireBolt, method, "ranged", {
          target
        });
        if ((yield rsa.attack(target)).hit) {
          const damage = yield rsa.getDamage(target);
          yield rsa.damage(target, damage);
        }
      });
    }
  });
  var FireBolt_default = FireBolt;

  // src/spells/cantrip/MindSliver.ts
  var MindSliverEffect = new Effect("Mind Sliver", "turnStart", (g2) => {
    g2.events.on("BeforeSave", ({ detail: { who, bonus, interrupt } }) => {
      if (who.hasEffect(MindSliverEffect)) {
        const { value } = g2.dice.roll({ type: "bane", who });
        bonus.add(-value, MindSliver);
        interrupt.add(
          new EvaluateLater(who, MindSliverEffect, () => __async(void 0, null, function* () {
            who.removeEffect(MindSliverEffect);
          }))
        );
      }
    });
  });
  var MindSliver = simpleSpell({
    status: "implemented",
    name: "Mind Sliver",
    level: 0,
    school: "Enchantment",
    v: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 60) }),
    getDamage: (_2, caster) => [_dd(getCantripDice(caster), 6, "psychic")],
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { target }) {
        const damage = yield g2.rollDamage(getCantripDice(attacker), {
          source: MindSliver,
          attacker,
          target,
          spell: MindSliver,
          method,
          size: 6,
          damageType: "psychic"
        });
        const save = yield g2.savingThrow(
          getSaveDC(attacker, method.ability),
          {
            who: target,
            attacker,
            ability: "int",
            spell: MindSliver,
            method,
            tags: svSet()
          },
          { fail: "normal", save: "zero" }
        );
        yield g2.damage(
          MindSliver,
          "psychic",
          { attacker, target, spell: MindSliver, method },
          [["psychic", damage]],
          save.damageResponse
        );
        if (save.outcome === "fail") {
          let endCounter = 2;
          const removeTurnTracker = g2.events.on(
            "TurnEnded",
            ({ detail: { who, interrupt } }) => {
              if (who === attacker && endCounter-- <= 0) {
                removeTurnTracker();
                interrupt.add(
                  new EvaluateLater(who, MindSliver, () => __async(this, null, function* () {
                    yield target.removeEffect(MindSliverEffect);
                  }))
                );
              }
            }
          );
          yield target.addEffect(MindSliverEffect, { duration: 2 }, attacker);
        }
      });
    }
  });
  var MindSliver_default = MindSliver;

  // src/spells/cantrip/RayOfFrost.ts
  var RayOfFrostEffect = new Effect("Ray of Frost", "turnStart", (g2) => {
    g2.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(RayOfFrostEffect))
        bonus.add(-10, RayOfFrostEffect);
    });
  });
  var RayOfFrost = simpleSpell({
    status: "implemented",
    name: "Ray of Frost",
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 60) }),
    getDamage: (_2, caster) => [_dd(getCantripDice(caster), 8, "cold")],
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { target }) {
        const rsa = new SpellAttack(g2, attacker, RayOfFrost, method, "ranged", {
          target
        });
        if ((yield rsa.attack(target)).hit) {
          const damage = yield rsa.getDamage(target);
          yield rsa.damage(target, damage);
          yield target.addEffect(RayOfFrostEffect, { duration: 2 }, attacker);
        }
      });
    }
  });
  var RayOfFrost_default = RayOfFrost;

  // src/spells/level1/IceKnife.ts
  var getArea2 = (g2, target) => ({
    type: "within",
    target,
    position: g2.getState(target).position,
    radius: 5
  });
  var IceKnife = scalingSpell({
    status: "implemented",
    name: "Ice Knife",
    level: 1,
    school: "Conjuration",
    s: true,
    m: "a drop of water or piece of ice",
    lists: ["Druid", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 60) }),
    getAffectedArea: (g2, caster, { target }) => target && [getArea2(g2, target)],
    getDamage: (g2, caster, method, { slot }) => [
      _dd(1, 10, "piercing"),
      _dd(1 + (slot != null ? slot : 1), 6, "cold")
    ],
    getTargets: (g2, caster, { target }) => g2.getInside(getArea2(g2, target)),
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { slot, target }) {
        const { attack, hit, critical } = yield g2.attack({
          who: attacker,
          tags: atSet("ranged", "spell", "magical"),
          target,
          ability: method.ability,
          spell: IceKnife,
          method
        });
        if (hit) {
          const damage2 = yield g2.rollDamage(
            1,
            {
              source: IceKnife,
              size: 10,
              attacker,
              target,
              spell: IceKnife,
              method,
              damageType: "piercing"
            },
            critical
          );
          yield g2.damage(
            IceKnife,
            "piercing",
            { attack, attacker, target, spell: IceKnife, method, critical },
            [["piercing", damage2]]
          );
        }
        const damage = yield g2.rollDamage(1 + slot, {
          source: IceKnife,
          size: 6,
          attacker,
          spell: IceKnife,
          method,
          damageType: "cold"
        });
        const dc = getSaveDC(attacker, method.ability);
        for (const victim of g2.getInside(getArea2(g2, target))) {
          const save = yield g2.savingThrow(
            dc,
            {
              attacker,
              ability: "dex",
              spell: IceKnife,
              method,
              who: victim,
              tags: svSet()
            },
            { fail: "normal", save: "zero" }
          );
          yield g2.damage(
            IceKnife,
            "cold",
            { attacker, target: victim, spell: IceKnife, method },
            [["cold", damage]],
            save.damageResponse
          );
        }
      });
    }
  });
  var IceKnife_default = IceKnife;

  // src/spells/level1/MagicMissile.ts
  var MagicMissile = scalingSpell({
    name: "Magic Missile",
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Sorcerer", "Wizard"],
    getConfig: (g2, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g2, 1, (slot != null ? slot : 1) + 2, 120)
    }),
    getTargets: (g2, caster, { targets }) => targets,
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var MagicMissile_default = MagicMissile;

  // src/spells/level1/Shield.ts
  var Shield2 = simpleSpell({
    name: "Shield",
    level: 1,
    school: "Abjuration",
    time: "reaction",
    // TODO which you take when you are hit by an attack or targeted by the magic missile spell
    v: true,
    s: true,
    lists: ["Sorcerer", "Wizard"],
    getConfig: () => ({}),
    getTargets: (g2, caster) => [caster],
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var Shield_default = Shield2;

  // src/resolvers/ChoiceResolver.ts
  var ChoiceResolver = class {
    constructor(g2, entries) {
      this.g = g2;
      this.entries = entries;
      this.type = "Choice";
    }
    get name() {
      if (this.entries.length === 0)
        return "empty";
      return `One of: ${this.entries.map((e) => e.label).join(", ")}`;
    }
    check(value, action, ec) {
      if (this.entries.length === 0)
        ec.add("No valid choices", this);
      else if (!value)
        ec.add("No choice made", this);
      else if (!this.entries.find((e) => e.value === value))
        ec.add("Invalid choice", this);
      return ec;
    }
  };

  // src/spells/level2/EnlargeReduce.ts
  var EnlargeReduce = simpleSpell({
    name: "Enlarge/Reduce",
    level: 2,
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "a pinch of powdered iron",
    lists: ["Artificer", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({
      target: new TargetResolver(g2, 30, true),
      mode: new ChoiceResolver(g2, [
        { label: "enlarge", value: "enlarge" },
        { label: "reduce", value: "reduce" }
      ])
    }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { mode, target }) {
      });
    }
  });
  var EnlargeReduce_default = EnlargeReduce;

  // src/spells/level2/HoldPerson.ts
  var HoldPersonEffect = new Effect("Hold Person", "turnStart", (g2) => {
    g2.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(HoldPersonEffect))
        conditions.add("Paralyzed", HoldPersonEffect);
    });
    g2.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(HoldPersonEffect);
      if (config) {
        const dc = getSaveDC(config.caster, config.method.ability);
        interrupt.add(
          new EvaluateLater(who, HoldPersonEffect, () => __async(void 0, null, function* () {
            const save = yield g2.savingThrow(dc, {
              who,
              attacker: config.caster,
              ability: "wis",
              spell: HoldPerson,
              effect: HoldPersonEffect,
              config,
              tags: svSet()
            });
            if (save.outcome === "success") {
              yield who.removeEffect(HoldPersonEffect);
              config.affected.delete(who);
            }
          }))
        );
      }
    });
  });
  var HoldPerson = scalingSpell({
    status: "incomplete",
    name: "Hold Person",
    level: 2,
    school: "Enchantment",
    concentration: true,
    v: true,
    s: true,
    m: "a small, straight piece of iron",
    lists: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],
    getConfig: (g2, actor, method, { slot }) => ({
      targets: new MultiTargetResolver(g2, 1, (slot != null ? slot : 2) - 1, 60)
    }),
    getTargets: (g2, caster, { targets }) => targets,
    check(g2, { targets }, ec) {
      return ec;
    },
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { targets }) {
        const dc = getSaveDC(caster, method.ability);
        const affected = /* @__PURE__ */ new Set();
        const duration = minutes(1);
        const conditions = coSet("Paralyzed");
        for (const target of targets) {
          const config = {
            affected,
            caster,
            method,
            duration,
            conditions
          };
          const save = yield g2.savingThrow(dc, {
            who: target,
            attacker: caster,
            ability: "wis",
            spell: HoldPerson,
            effect: HoldPersonEffect,
            config,
            tags: svSet()
          });
          if (save.outcome === "fail" && (yield target.addEffect(HoldPersonEffect, config)))
            affected.add(target);
        }
        if (affected.size > 0)
          yield caster.concentrateOn({
            spell: HoldPerson,
            duration,
            onSpellEnd() {
              return __async(this, null, function* () {
                for (const target of affected)
                  yield target.removeEffect(HoldPersonEffect);
              });
            }
          });
      });
    }
  });
  var HoldPerson_default = HoldPerson;

  // src/resolvers/MultiPointResolver.ts
  var MultiPointResolver = class {
    constructor(g2, minimum, maximum, maxRange) {
      this.g = g2;
      this.minimum = minimum;
      this.maximum = maximum;
      this.maxRange = maxRange;
      this.type = "Points";
    }
    get name() {
      return `${describeRange(this.minimum, this.maximum)} points${this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""}`;
    }
    check(value, action, ec) {
      if (!isPointArray(value))
        ec.add("No points", this);
      else {
        if (value.length < this.minimum)
          ec.add(`At least ${this.minimum} points`, this);
        if (value.length > this.maximum)
          ec.add(`At most ${this.maximum} points`, this);
        for (const point of value) {
          if (distanceTo(this.g, action.actor, point) > this.maxRange)
            ec.add("Out of range", this);
        }
      }
      return ec;
    }
  };

  // src/spells/level2/MelfsMinuteMeteors.ts
  var MeteorResource = new TemporaryResource("Melf's Minute Meteors", 6);
  function fireMeteors(_0, _1, _2, _3) {
    return __async(this, arguments, function* (g2, attacker, method, { points }, spendMeteors = true) {
      if (spendMeteors)
        attacker.spendResource(MeteorResource, points.length);
      const damage = yield g2.rollDamage(2, {
        source: MelfsMinuteMeteors,
        attacker,
        size: 6,
        spell: MelfsMinuteMeteors,
        method,
        damageType: "fire"
      });
      const dc = getSaveDC(attacker, method.ability);
      for (const point of points) {
        for (const target of g2.getInside({
          type: "sphere",
          centre: point,
          radius: 5
        })) {
          const save = yield g2.savingThrow(dc, {
            ability: "dex",
            attacker,
            spell: MelfsMinuteMeteors,
            method,
            who: target,
            tags: svSet()
          });
          yield g2.damage(
            MelfsMinuteMeteors,
            "fire",
            { attacker, target, spell: MelfsMinuteMeteors, method },
            [["fire", damage]],
            save.damageResponse
          );
        }
      }
    });
  }
  var FireMeteorsAction = class _FireMeteorsAction extends AbstractAction {
    constructor(g2, actor, method) {
      var _a;
      super(
        g2,
        actor,
        "Melf's Minute Meteors",
        "incomplete",
        {
          points: new MultiPointResolver(
            g2,
            1,
            Math.min(2, (_a = actor.resources.get(MeteorResource.name)) != null ? _a : 2),
            120
          )
        },
        { time: "bonus action", damage: [_dd(2, 6, "fire")] }
      );
      this.method = method;
    }
    getAffectedArea({ points }) {
      if (points)
        return points.map(
          (centre) => ({ type: "sphere", centre, radius: 5 })
        );
    }
    getResources({ points }) {
      var _a;
      return /* @__PURE__ */ new Map([[MeteorResource, (_a = points == null ? void 0 : points.length) != null ? _a : 1]]);
    }
    apply(config) {
      return __async(this, null, function* () {
        __superGet(_FireMeteorsAction.prototype, this, "apply").call(this, config);
        return fireMeteors(this.g, this.actor, this.method, config, false);
      });
    }
  };
  var MelfsMinuteMeteors = scalingSpell({
    status: "implemented",
    name: "Melf's Minute Meteors",
    level: 3,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "niter, sulfur, and pine tar formed into a bead",
    lists: ["Sorcerer", "Wizard"],
    getConfig: (g2) => ({
      points: new MultiPointResolver(g2, 1, 2, 120)
    }),
    getAffectedArea: (g2, caster, { points }) => points && points.map((centre) => ({ type: "sphere", centre, radius: 5 })),
    getTargets: (g2, caster, { points }) => points.flatMap(
      (centre) => g2.getInside({ type: "sphere", centre, radius: 5 })
    ),
    getDamage: () => [_dd(2, 6, "fire")],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { points, slot }) {
        const meteors = slot * 2;
        attacker.initResource(MeteorResource, meteors);
        yield fireMeteors(g2, attacker, method, { points });
        let meteorActionEnabled = false;
        const removeMeteorAction = g2.events.on(
          "GetActions",
          ({ detail: { who, actions } }) => {
            if (who === attacker && meteorActionEnabled)
              actions.push(new FireMeteorsAction(g2, attacker, method));
          }
        );
        const removeTurnListener = g2.events.on(
          "TurnEnded",
          ({ detail: { who } }) => {
            if (who === attacker) {
              meteorActionEnabled = true;
              removeTurnListener();
            }
          }
        );
        yield attacker.concentrateOn({
          spell: MelfsMinuteMeteors,
          duration: minutes(10),
          onSpellEnd() {
            return __async(this, null, function* () {
              removeMeteorAction();
              removeTurnListener();
              attacker.removeResource(MeteorResource);
            });
          }
        });
      });
    }
  });
  var MelfsMinuteMeteors_default = MelfsMinuteMeteors;

  // src/spells/level3/Fireball.ts
  var getArea3 = (centre) => ({
    type: "sphere",
    centre,
    radius: 20
  });
  var Fireball = scalingSpell({
    status: "implemented",
    name: "Fireball",
    level: 3,
    school: "Evocation",
    v: true,
    s: true,
    m: "a tiny ball of bat guano and sulfur",
    lists: ["Sorcerer", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 150) }),
    getAffectedArea: (g2, caster, { point }) => point && [getArea3(point)],
    getDamage: (g2, caster, method, { slot }) => [_dd(5 + (slot != null ? slot : 3), 6, "fire")],
    getTargets: (g2, caster, { point }) => g2.getInside(getArea3(point)),
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { point, slot }) {
        const damage = yield g2.rollDamage(5 + slot, {
          source: Fireball,
          size: 6,
          spell: Fireball,
          method,
          damageType: "fire",
          attacker
        });
        const dc = getSaveDC(attacker, method.ability);
        for (const target of g2.getInside(getArea3(point))) {
          const save = yield g2.savingThrow(dc, {
            attacker,
            ability: "dex",
            spell: Fireball,
            method,
            who: target,
            tags: svSet()
          });
          yield g2.damage(
            Fireball,
            "fire",
            { attacker, spell: Fireball, method, target },
            [["fire", damage]],
            save.damageResponse
          );
        }
      });
    }
  });
  var Fireball_default = Fireball;

  // src/spells/level3/IntellectFortress.ts
  var mental = ["int", "wis", "cha"];
  var IntellectFortressEffect = new Effect(
    "Intellect Fortress",
    "turnStart",
    (g2) => {
      g2.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who.hasEffect(IntellectFortressEffect) && damageType === "psychic")
            response.add("resist", IntellectFortressEffect);
        }
      );
      g2.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
        if (who.hasEffect(IntellectFortressEffect) && mental.includes(ability))
          diceType.add("advantage", IntellectFortressEffect);
      });
    }
  );
  var IntellectFortress = scalingSpell({
    status: "incomplete",
    name: "Intellect Fortress",
    level: 3,
    school: "Abjuration",
    concentration: true,
    v: true,
    lists: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"],
    // TODO  The creatures must be within 30 feet of each other when you target them.
    getConfig: (g2, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g2, 1, (slot != null ? slot : 3) - 2, 30, true)
    }),
    getTargets: (g2, caster, { targets }) => targets,
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { targets }) {
        const duration = hours(1);
        for (const target of targets)
          yield target.addEffect(IntellectFortressEffect, { duration }, caster);
        caster.concentrateOn({
          spell: IntellectFortress,
          duration,
          onSpellEnd() {
            return __async(this, null, function* () {
              for (const target of targets)
                yield target.removeEffect(IntellectFortressEffect);
            });
          }
        });
      });
    }
  });
  var IntellectFortress_default = IntellectFortress;

  // src/spells/level4/WallOfFire.ts
  var shapeChoices = [
    { label: "line", value: "line" },
    { label: "ring", value: "ring" }
  ];
  var WallOfFire = scalingSpell({
    name: "Wall of Fire",
    level: 4,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "a small piece of phosphorus",
    lists: ["Druid", "Sorcerer", "Wizard"],
    // TODO choose dimensions of line wall
    getConfig: (g2) => ({
      point: new PointResolver(g2, 120),
      shape: new ChoiceResolver(g2, shapeChoices)
    }),
    getTargets: () => [],
    getDamage: (g2, caster, method, { slot }) => [_dd((slot != null ? slot : 4) + 1, 8, "fire")],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { point, shape }) {
      });
    }
  });
  var WallOfFire_default = WallOfFire;

  // src/pcs/davies/Beldalynn_token.png
  var Beldalynn_token_default = "./Beldalynn_token-B47TNTON.png";

  // src/pcs/davies/Beldalynn.ts
  var Beldalynn = class extends PC {
    constructor(g2) {
      super(g2, "Beldalynn", Beldalynn_token_default);
      this.setAbilityScores(11, 13, 13, 15, 13, 8);
      this.setRace(BronzeDragonborn);
      this.dex.score++;
      this.con.score++;
      this.str.score++;
      this.languages.add("Common");
      this.languages.add("Draconic");
      this.languages.add("Elvish");
      this.languages.add("Infernal");
      this.addSubclass(Evocation_default);
      this.addClassLevel(wizard_default);
      this.addClassLevel(wizard_default);
      this.addClassLevel(wizard_default);
      this.addClassLevel(wizard_default);
      this.addClassLevel(wizard_default);
      this.addClassLevel(wizard_default);
      this.addClassLevel(wizard_default);
      this.setConfig(ASI42, { type: "ability", abilities: ["int", "wis"] });
      this.skills.set("History", 1);
      this.skills.set("Perception", 1);
      this.skills.set("Arcana", 1);
      this.skills.set("Investigation", 1);
      this.don(new CloakOfProtection(g2), true);
      this.don(enchant(new Quarterstaff(g2), chaoticBurst), true);
      this.don(new DragonTouchedFocus(g2, "Slumbering"), true);
      this.inventory.add(new Dagger(g2, 1));
      this.addPreparedSpells(
        AcidSplash_default,
        FireBolt_default,
        MindSliver_default,
        RayOfFrost_default,
        IceKnife_default,
        MagicMissile_default,
        Shield_default,
        EnlargeReduce_default,
        HoldPerson_default,
        MelfsMinuteMeteors_default,
        Fireball_default,
        IntellectFortress_default,
        // TODO LeomundsTinyHut,
        WallOfFire_default
      );
    }
  };

  // src/ActiveEffectArea.ts
  var ActiveEffectArea = class {
    constructor(name, shape, tags) {
      this.name = name;
      this.shape = shape;
      this.tags = tags;
      this.id = NaN;
    }
  };

  // src/types/EffectArea.ts
  var arSet = (...items) => new Set(items);

  // src/classes/paladin/common.ts
  var PaladinSpellcasting = new NormalSpellcasting(
    "Paladin",
    `By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.`,
    "cha",
    "half",
    "Paladin",
    "Paladin"
  );
  var ChannelDivinityResource = new ShortRestResource(
    "Channel Divinity",
    1
  );
  function getPaladinAuraRadius(level) {
    if (level < 18)
      return 10;
    return 30;
  }

  // src/classes/paladin/HarnessDivinePower.ts
  var HarnessDivinePowerResource = new LongRestResource(
    "Harness Divine Power",
    1
  );
  var HarnessDivinePowerAction = class _HarnessDivinePowerAction extends AbstractAction {
    constructor(g2, actor) {
      super(
        g2,
        actor,
        "Harness Divine Power",
        "implemented",
        {
          slot: new ChoiceResolver(
            g2,
            enumerate(1, 9).filter(
              (slot) => actor.resources.has(getSpellSlotResourceName(slot))
            ).map((value) => {
              const resource = SpellSlotResources[value];
              return {
                label: ordinal(value),
                value,
                disabled: actor.getResourceMax(resource) <= actor.getResource(resource)
              };
            })
          )
        },
        {
          time: "bonus action",
          resources: [
            [ChannelDivinityResource, 1],
            [HarnessDivinePowerResource, 1]
          ]
        }
      );
    }
    check({ slot }, ec) {
      if (slot) {
        const resource = SpellSlotResources[slot];
        if (this.actor.getResource(resource) === this.actor.getResourceMax(resource))
          ec.add(`full on ${resource.name}`, this);
      }
      return super.check({ slot }, ec);
    }
    apply(_0) {
      return __async(this, arguments, function* ({ slot }) {
        __superGet(_HarnessDivinePowerAction.prototype, this, "apply").call(this, { slot });
        this.actor.giveResource(SpellSlotResources[slot], 1);
      });
    }
  };
  function getHarnessCount(level) {
    if (level < 7)
      return 1;
    if (level < 15)
      return 2;
    return 3;
  }
  var HarnessDivinePower = new SimpleFeature(
    "Channel Divinity: Harness Divine Power",
    `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`,
    (g2, me) => {
      var _a;
      me.initResource(
        HarnessDivinePowerResource,
        getHarnessCount((_a = me.classLevels.get("Paladin")) != null ? _a : 3)
      );
      g2.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(new HarnessDivinePowerAction(g2, me));
      });
    }
  );
  var HarnessDivinePower_default = HarnessDivinePower;

  // src/resolvers/NumberRangeResolver.ts
  var NumberRangeResolver = class {
    constructor(g2, rangeName, min, max) {
      this.g = g2;
      this.rangeName = rangeName;
      this.min = min;
      this.max = max;
      this.type = "NumberRange";
    }
    get name() {
      const range = this.max === Infinity ? `${this.min}+` : `${this.min}-${this.max}`;
      return `${this.rangeName} ${range}`;
    }
    check(value, action, ec) {
      if (this.min > this.max)
        ec.add("Invalid range", this);
      if (typeof value !== "number")
        ec.add("No choice", this);
      else {
        if (value < this.min)
          ec.add("Too low", this);
        if (value > this.max)
          ec.add("Too high", this);
      }
      return ec;
    }
  };

  // src/classes/paladin/LayOnHands.ts
  var LayOnHandsResource = new LongRestResource("Lay on Hands", 5);
  var LayOnHandsHealAction = class _LayOnHandsHealAction extends AbstractAction {
    constructor(g2, actor) {
      super(
        g2,
        actor,
        "Lay on Hands (Heal)",
        "implemented",
        {
          cost: new NumberRangeResolver(g2, "Spend", 1, Infinity),
          target: new TargetResolver(g2, actor.reach, true)
        },
        { time: "action" }
      );
    }
    getConfig() {
      const resourceMax = this.actor.getResource(LayOnHandsResource);
      return {
        cost: new NumberRangeResolver(this.g, "Spend", 1, resourceMax),
        target: new TargetResolver(this.g, this.actor.reach, true)
      };
    }
    getHeal({ cost }) {
      if (typeof cost === "number")
        return [{ type: "flat", amount: cost }];
    }
    getResources({ cost }) {
      const resources = /* @__PURE__ */ new Map();
      if (typeof cost === "number")
        resources.set(LayOnHandsResource, cost);
      return resources;
    }
    apply(config) {
      return __async(this, null, function* () {
        yield __superGet(_LayOnHandsHealAction.prototype, this, "apply").call(this, config);
        yield this.g.heal(this, config.cost, {
          action: this,
          target: config.target,
          actor: this.actor
        });
      });
    }
  };
  var LayOnHands = new SimpleFeature(
    "Lay on Hands",
    `Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level \xD7 5.

As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.

Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.

This feature has no effect on undead and constructs.`,
    (g2, me) => {
      var _a;
      console.warn(`[Feature Not Complete] Lay on Hands (on ${me.name})`);
      const max = ((_a = me.classLevels.get("Paladin")) != null ? _a : 1) * 5;
      me.initResource(LayOnHandsResource, max, max);
      g2.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(new LayOnHandsHealAction(g2, me));
      });
    }
  );
  var LayOnHands_default = LayOnHands;

  // src/classes/paladin/index.ts
  var DivineSense = notImplementedFeature(
    "Divine Sense",
    `The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire Count Strahd von Zarovich, for instance). Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the hallow spell.

You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.`
  );
  var DivineSmite = new SimpleFeature(
    "Divine Smite",
    `Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.`,
    (g2, me) => {
      g2.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, critical, interrupt, map, target } }) => {
          if (attacker === me && hasAll(attack == null ? void 0 : attack.pre.tags, ["melee", "weapon"]))
            interrupt.add(
              new PickFromListChoice(
                attacker,
                DivineSmite,
                "Divine Smite",
                "Choose a spell slot to use.",
                [
                  { label: "None", value: NaN },
                  ...enumerate(1, getMaxSpellSlotAvailable(me)).map((value) => ({
                    label: ordinal(value),
                    value,
                    disabled: me.getResource(SpellSlotResources[value]) < 1
                  }))
                ],
                (slot) => __async(void 0, null, function* () {
                  if (isNaN(slot))
                    return;
                  me.spendResource(SpellSlotResources[slot], 1);
                  const count = Math.min(5, slot + 1);
                  const extra = target.type === "undead" || target.type === "fiend" ? 1 : 0;
                  const damage = yield g2.rollDamage(
                    count + extra,
                    { source: DivineSmite, attacker, size: 8 },
                    critical
                  );
                  map.add("radiant", damage);
                })
              )
            );
        }
      );
    }
  );
  var PaladinFightingStyle = new ConfiguredFeature(
    "Fighting Style (Paladin)",
    `At 2nd level, you adopt a particular style of fighting as your specialty. You can't take the same Fighting Style option more than once, even if you get to choose again.`,
    (g2, me, style) => {
      me.addFeature(style);
    }
  );
  var DivineHealth = new SimpleFeature(
    "Divine Health",
    `By 3rd level, the divine magic flowing through you makes you immune to disease.`,
    (g2, me) => {
      g2.events.on("BeforeEffect", ({ detail: { who, effect, success } }) => {
        if (who === me && effect.tags.has("disease"))
          success.add("fail", DivineHealth);
      });
    }
  );
  var ChannelDivinity = new SimpleFeature(
    "Channel Divinity",
    `Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.
When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.`,
    (g2, me) => {
      me.initResource(ChannelDivinityResource);
    }
  );
  var MartialVersatility = nonCombatFeature(
    "Martial Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to paladins. This replacement represents a shift of focus in your martial practice.`
  );
  var ExtraAttack = makeExtraAttack(
    "Extra Attack",
    `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
  );
  var AuraOfProtection = new SimpleFeature(
    "Aura of Protection",
    `Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.

At 18th level, the range of this aura increases to 30 feet.`,
    (g2, me) => {
      var _a;
      const radius = getPaladinAuraRadius((_a = me.classLevels.get("Paladin")) != null ? _a : 6);
      let area;
      const updateAura = (position) => {
        if (area)
          g2.removeEffectArea(area);
        area = new ActiveEffectArea(
          `Paladin Aura (${me.name})`,
          { type: "within", radius, target: me, position },
          arSet("holy")
        );
        g2.addEffectArea(area);
      };
      g2.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
        if (who.side === me.side && !me.conditions.has("Unconscious") && distance(g2, me, who) <= radius)
          bonus.add(Math.max(1, me.cha.modifier), AuraOfProtection);
      });
      g2.events.on("CombatantMoved", ({ detail: { who, position } }) => {
        if (who === me && !me.conditions.has("Unconscious"))
          updateAura(position);
      });
      g2.events.on("EffectAdded", ({ detail: { who } }) => {
        if (who === me && me.conditions.has("Unconscious") && area) {
          g2.removeEffectArea(area);
          area = void 0;
        }
      });
      g2.events.on("EffectRemoved", ({ detail: { who } }) => {
        if (who === me && !me.conditions.has("Unconscious"))
          updateAura(g2.getState(me).position);
      });
      updateAura(g2.getState(me).position);
    }
  );
  var AuraOfCourage = new SimpleFeature(
    "Aura of Courage",
    `Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`,
    (g2, me) => {
      var _a;
      const radius = getPaladinAuraRadius((_a = me.classLevels.get("Paladin")) != null ? _a : 10);
      g2.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
        var _a2;
        if (!me.conditions.has("Unconscious") && ((_a2 = config.conditions) == null ? void 0 : _a2.has("Frightened")) && who.side === me.side && distance(g2, who, me) <= radius)
          success.add("fail", AuraOfCourage);
      });
    }
  );
  var ImprovedDivineSmite = new SimpleFeature(
    "Improved Divine Smite",
    `By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.`,
    (g2, me) => {
      g2.events.on(
        "GatherDamage",
        ({ detail: { attack, attacker, critical, target, interrupt, map } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.tags.has("melee")) && attack.pre.tags.has("weapon"))
            interrupt.add(
              new EvaluateLater(attacker, ImprovedDivineSmite, () => __async(void 0, null, function* () {
                const amount = yield g2.rollDamage(
                  1,
                  {
                    source: ImprovedDivineSmite,
                    attacker,
                    target,
                    size: 8,
                    damageType: "radiant"
                  },
                  critical
                );
                map.add("radiant", amount);
              }))
            );
        }
      );
    }
  );
  var CleansingTouch = notImplementedFeature(
    "Cleansing Touch",
    `Beginning at 14th level, you can use your action to end one spell on yourself or on one willing creature that you touch.

You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain expended uses when you finish a long rest.`
  );
  var ASI43 = makeASI("Paladin", 4);
  var ASI83 = makeASI("Paladin", 8);
  var ASI123 = makeASI("Paladin", 12);
  var ASI163 = makeASI("Paladin", 16);
  var ASI193 = makeASI("Paladin", 19);
  var Paladin = {
    name: "Paladin",
    hitDieSize: 10,
    armorProficiencies: acSet("light", "medium", "heavy", "shield"),
    weaponCategoryProficiencies: wcSet("simple", "martial"),
    saveProficiencies: abSet("wis", "cha"),
    skillChoices: 2,
    skillProficiencies: skSet(
      "Athletics",
      "Insight",
      "Intimidation",
      "Medicine",
      "Persuasion",
      "Religion"
    ),
    features: /* @__PURE__ */ new Map([
      [1, [DivineSense, LayOnHands_default]],
      [2, [DivineSmite, PaladinFightingStyle, PaladinSpellcasting.feature]],
      [3, [DivineHealth, ChannelDivinity, HarnessDivinePower_default]],
      [4, [ASI43, MartialVersatility]],
      [5, [ExtraAttack]],
      [6, [AuraOfProtection]],
      [8, [ASI83]],
      [10, [AuraOfCourage]],
      [11, [ImprovedDivineSmite]],
      [12, [ASI123]],
      [14, [CleansingTouch]],
      [16, [ASI163]],
      [19, [ASI193]]
    ])
  };
  var paladin_default = Paladin;

  // src/types/CreatureType.ts
  var ctSet = (...items) => new Set(items);

  // src/spells/level1/ProtectionFromEvilAndGood.ts
  var affectedTypes = ctSet(
    "aberration",
    "celestial",
    "elemental",
    "fey",
    "fiend",
    "undead"
  );
  var isAffected = (attacker) => attacker && affectedTypes.has(attacker.type);
  var isValidEffect = (effect, config) => {
    var _a, _b;
    return (effect == null ? void 0 : effect.tags.has("possession")) || ((_a = config == null ? void 0 : config.conditions) == null ? void 0 : _a.has("Charmed")) || ((_b = config == null ? void 0 : config.conditions) == null ? void 0 : _b.has("Frightened"));
  };
  var ProtectionEffect = new Effect(
    "Protection from Evil and Good",
    "turnStart",
    (g2) => {
      g2.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        if (who.hasEffect(ProtectionEffect) && isAffected(target))
          diceType.add("disadvantage", ProtectionEffect);
      });
      g2.events.on(
        "BeforeEffect",
        ({ detail: { who, attacker, effect, config, success } }) => {
          if (who.hasEffect(ProtectionEffect) && isAffected(attacker) && isValidEffect(effect, config))
            success.add("fail", ProtectionEffect);
        }
      );
      g2.events.on(
        "BeforeSave",
        ({ detail: { who, attacker, effect, config, diceType } }) => {
          if (who.hasEffect(ProtectionEffect) && isAffected(attacker) && isValidEffect(effect, config))
            diceType.add("advantage", ProtectionEffect);
        }
      );
    }
  );
  var ProtectionFromEvilAndGood = simpleSpell({
    status: "implemented",
    name: "Protection from Evil and Good",
    level: 1,
    school: "Abjuration",
    concentration: true,
    v: true,
    s: true,
    m: "holy water or powdered silver and iron, which the spell consumes",
    lists: ["Cleric", "Paladin", "Warlock", "Wizard"],
    getConfig: (g2, caster) => ({
      target: new TargetResolver(g2, caster.reach, true)
    }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
        const duration = minutes(10);
        yield target.addEffect(ProtectionEffect, { duration }, caster);
        yield caster.concentrateOn({
          spell: ProtectionFromEvilAndGood,
          duration,
          onSpellEnd() {
            return __async(this, null, function* () {
              yield target.removeEffect(ProtectionEffect);
            });
          }
        });
      });
    }
  });
  var ProtectionFromEvilAndGood_default = ProtectionFromEvilAndGood;

  // src/spells/level1/Sanctuary.ts
  var SanctuaryEffect = new Effect("Sanctuary", "turnStart", (g2) => {
  });
  var Sanctuary = simpleSpell({
    name: "Sanctuary",
    level: 1,
    school: "Abjuration",
    time: "bonus action",
    v: true,
    s: true,
    m: "a small silver mirror",
    lists: ["Artificer", "Cleric"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 30, true) }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
        yield target.addEffect(
          SanctuaryEffect,
          { caster, method, duration: minutes(1) },
          caster
        );
      });
    }
  });
  var Sanctuary_default = Sanctuary;

  // src/spells/level2/LesserRestoration.ts
  var validConditions = /* @__PURE__ */ new Set([
    "Blinded",
    "Deafened",
    "Paralyzed",
    "Poisoned"
  ]);
  var LesserRestoration = simpleSpell({
    status: "implemented",
    name: "Lesser Restoration",
    level: 2,
    school: "Abjuration",
    v: true,
    s: true,
    lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],
    getConfig: (g2, caster, method, { target }) => {
      const effectTypes = [];
      if (target)
        for (const [type, config] of target.effects) {
          if (type.tags.has("disease") || config.conditions && intersects(config.conditions, validConditions))
            effectTypes.push(type);
        }
      return {
        target: new TargetResolver(g2, caster.reach, true),
        effect: new ChoiceResolver(
          g2,
          effectTypes.map((value) => ({
            label: value.name,
            value
          }))
        )
      };
    },
    getTargets: (g2, caster, { target }) => [target],
    check(g2, { effect, target }, ec) {
      if (target && effect && !target.hasEffect(effect))
        ec.add("target does not have chosen effect", LesserRestoration);
      return ec;
    },
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target, effect }) {
        yield target.removeEffect(effect);
      });
    }
  });
  var LesserRestoration_default = LesserRestoration;

  // src/classes/paladin/Devotion/SacredWeapon.ts
  var SacredWeaponEffect = new Effect(
    "Sacred Weapon",
    "turnStart",
    (g2) => {
      g2.events.on("BeforeAttack", ({ detail: { who, bonus, weapon, tags } }) => {
        const config = who.getEffectConfig(SacredWeaponEffect);
        if (config && config.weapon === weapon) {
          bonus.add(Math.max(1, who.cha.modifier), SacredWeaponEffect);
          tags.add("magical");
        }
      });
    }
  );
  var SacredWeaponAction = class _SacredWeaponAction extends AbstractAction {
    constructor(g2, actor) {
      super(
        g2,
        actor,
        "Channel Divinity: Sacred Weapon",
        "implemented",
        {
          weapon: new ChoiceResolver(
            g2,
            actor.weapons.filter((weapon) => weapon.category !== "natural").map((value) => ({ label: value.name, value }))
          )
        },
        { time: "action", resources: [[ChannelDivinityResource, 1]] }
      );
    }
    check(config, ec) {
      if (this.actor.hasEffect(SacredWeaponEffect))
        ec.add("already active", this);
      return ec;
    }
    apply(_0) {
      return __async(this, arguments, function* ({ weapon }) {
        __superGet(_SacredWeaponAction.prototype, this, "apply").call(this, { weapon });
        yield this.actor.addEffect(SacredWeaponEffect, {
          duration: minutes(1),
          weapon
        });
      });
    }
  };
  var SacredWeapon = new SimpleFeature(
    "Channel Divinity: Sacred Weapon",
    `As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.

You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.`,
    (g2, me) => {
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SacredWeaponAction(g2, me));
      });
    }
  );
  var SacredWeapon_default = SacredWeapon;

  // src/classes/paladin/Devotion/index.ts
  var TurnTheUnholy = notImplementedFeature(
    "Channel Divinity: Turn the Unholy",
    `As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`
  );
  var AuraOfDevotion = notImplementedFeature(
    "Aura of Devotion",
    `Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`
  );
  var PurityOfSpirit = notImplementedFeature(
    "Purity of Spirit",
    `Beginning at 15th level, you are always under the effects of a protection from evil and good spell.`
  );
  var HolyNimbus = notImplementedFeature(
    "Holy Nimbus",
    `At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that.

Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage.

In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead.

Once you use this feature, you can't use it again until you finish a long rest.

`
  );
  var OathSpells = bonusSpellsFeature(
    "Oath Spells",
    `You gain oath spells at the paladin levels listed.`,
    "Paladin",
    PaladinSpellcasting,
    [
      { level: 3, spell: ProtectionFromEvilAndGood_default },
      { level: 3, spell: Sanctuary_default },
      { level: 5, spell: LesserRestoration_default }
      // TODO { level: 5, spell: ZoneOfTruth },
      // TODO { level: 9, spell: BeaconOfHope },
      // TODO { level: 9, spell: DispelMagic },
      // TODO { level: 13, spell: FreedomOfMovement },
      // TODO { level: 13, spell: GuardianOfFaith },
      // TODO { level: 17, spell: Commune },
      // TODO { level: 17, spell: FlameStrike },
    ],
    "Paladin"
  );
  var Devotion = {
    className: "Paladin",
    name: "Oath ofDevotion",
    features: /* @__PURE__ */ new Map([
      [3, [OathSpells, SacredWeapon_default, TurnTheUnholy]],
      [7, [AuraOfDevotion]],
      [15, [PurityOfSpirit]],
      [20, [HolyNimbus]]
    ])
  };
  var Devotion_default = Devotion;

  // src/items/wands.ts
  var WandOfWeb = class extends AbstractWondrous {
    constructor(g2, charges = 7) {
      super(g2, "Wand of Web", 1);
      this.charges = charges;
      this.attunement = true;
      this.rarity = "Uncommon";
    }
  };

  // src/races/Human.ts
  var Human = {
    name: "Human",
    size: "medium",
    abilities: /* @__PURE__ */ new Map([
      ["str", 1],
      ["dex", 1],
      ["con", 1],
      ["int", 1],
      ["wis", 1],
      ["cha", 1]
    ]),
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    languages: laSet("Common")
  };
  var Human_default = Human;

  // src/spells/level1/Bless.ts
  function applyBless(g2, who, bonus) {
    if (who.hasEffect(BlessEffect)) {
      const dr = g2.dice.roll({ type: "bless", who });
      bonus.add(dr.value, BlessEffect);
    }
  }
  var BlessEffect = new Effect("Bless", "turnEnd", (g2) => {
    g2.events.on(
      "BeforeAttack",
      ({ detail: { bonus, who } }) => applyBless(g2, who, bonus)
    );
    g2.events.on(
      "BeforeSave",
      ({ detail: { bonus, who } }) => applyBless(g2, who, bonus)
    );
  });
  var Bless = scalingSpell({
    status: "implemented",
    name: "Bless",
    level: 1,
    school: "Enchantment",
    concentration: true,
    v: true,
    s: true,
    m: "a sprinkling of holy water",
    lists: ["Cleric", "Paladin"],
    getConfig: (g2, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g2, 1, (slot != null ? slot : 1) + 2, 30, true)
    }),
    getTargets: (g2, caster, { targets }) => targets,
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { targets }) {
        const duration = minutes(1);
        for (const target of targets)
          yield target.addEffect(BlessEffect, { duration }, caster);
        yield caster.concentrateOn({
          spell: Bless,
          duration,
          onSpellEnd: () => __async(this, null, function* () {
            for (const target of targets)
              yield target.removeEffect(BlessEffect);
          })
        });
      });
    }
  });
  var Bless_default = Bless;

  // src/spells/level1/DivineFavor.ts
  var DivineFavorEffect = new Effect("Divine Favor", "turnEnd", (g2) => {
    g2.events.on(
      "GatherDamage",
      ({ detail: { attacker, critical, map, weapon, interrupt } }) => {
        if (attacker.hasEffect(DivineFavorEffect) && weapon)
          interrupt.add(
            new EvaluateLater(attacker, DivineFavorEffect, () => __async(void 0, null, function* () {
              map.add(
                "radiant",
                yield g2.rollDamage(
                  1,
                  {
                    source: DivineFavor,
                    size: 4,
                    attacker,
                    damageType: "radiant"
                  },
                  critical
                )
              );
            }))
          );
      }
    );
  });
  var DivineFavor = simpleSpell({
    status: "implemented",
    name: "Divine Favor",
    level: 1,
    school: "Evocation",
    concentration: true,
    time: "bonus action",
    v: true,
    s: true,
    lists: ["Paladin"],
    getConfig: () => ({}),
    getTargets: (g2, caster) => [caster],
    apply(g2, caster) {
      return __async(this, null, function* () {
        const duration = minutes(1);
        yield caster.addEffect(DivineFavorEffect, { duration }, caster);
        yield caster.concentrateOn({
          spell: DivineFavor,
          duration,
          onSpellEnd() {
            return __async(this, null, function* () {
              yield caster.removeEffect(DivineFavorEffect);
            });
          }
        });
      });
    }
  });
  var DivineFavor_default = DivineFavor;

  // src/spells/level1/ShieldOfFaith.ts
  var ShieldOfFaithEffect = new Effect("Shield of Faith", "turnStart", (g2) => {
    g2.events.on("GetAC", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(ShieldOfFaithEffect))
        bonus.add(2, ShieldOfFaith);
    });
  });
  var ShieldOfFaith = simpleSpell({
    status: "implemented",
    name: "Shield of Faith",
    level: 1,
    school: "Abjuration",
    time: "bonus action",
    v: true,
    s: true,
    m: "a small parchment with a bit of holy text written on it",
    lists: ["Cleric", "Paladin"],
    getConfig: (g2) => ({ target: new TargetResolver(g2, 60, true) }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
        yield target.addEffect(
          ShieldOfFaithEffect,
          { duration: minutes(10) },
          caster
        );
        caster.concentrateOn({
          spell: ShieldOfFaith,
          duration: minutes(10),
          onSpellEnd: () => __async(this, null, function* () {
            yield target.removeEffect(ShieldOfFaithEffect);
          })
        });
      });
    }
  });
  var ShieldOfFaith_default = ShieldOfFaith;

  // src/pcs/davies/Galilea_token.png
  var Galilea_token_default = "./Galilea_token-D4XX5FIV.png";

  // src/pcs/davies/Galilea.ts
  var Galilea = class extends PC {
    constructor(g2) {
      super(g2, "Galilea", Galilea_token_default);
      this.toolProficiencies.set("playing card set", 1);
      this.setAbilityScores(13, 10, 15, 11, 11, 13);
      this.setRace(Human_default);
      this.languages.add("Sylvan");
      this.addSubclass(Devotion_default);
      this.addClassLevel(paladin_default);
      this.addClassLevel(paladin_default);
      this.addClassLevel(paladin_default);
      this.addClassLevel(paladin_default);
      this.addClassLevel(paladin_default);
      this.addClassLevel(paladin_default);
      this.addClassLevel(paladin_default);
      this.setConfig(PaladinFightingStyle, FightingStyleProtection);
      this.setConfig(ASI43, { type: "ability", abilities: ["str", "str"] });
      this.skills.set("Insight", 1);
      this.skills.set("Intimidation", 1);
      this.skills.set("History", 1);
      this.skills.set("Persuasion", 1);
      this.don(new Longsword(g2));
      this.don(new Shield(g2));
      this.don(new SplintArmor(g2));
      this.don(new RingOfAwe(g2), true);
      this.don(new SilverShiningAmulet(g2), true);
      this.inventory.add(new FigurineOfWondrousPower(g2, "Silver Raven"));
      const wand = new WandOfWeb(g2);
      this.inventory.add(wand);
      this.attunements.add(wand);
      this.inventory.add(new LightCrossbow(g2));
      this.inventory.add(new CrossbowBolt(g2, 20));
      this.addPreparedSpells(
        Bless_default,
        DivineFavor_default,
        ShieldOfFaith_default
        // TODO Aid,
        // TODO MagicWeapon
      );
    }
  };

  // src/classes/barbarian/Rage.ts
  function getRageCount(level) {
    if (level < 3)
      return 2;
    if (level < 6)
      return 3;
    if (level < 12)
      return 4;
    if (level < 17)
      return 5;
    if (level < 20)
      return 6;
    return Infinity;
  }
  function getRageBonus(level) {
    if (level < 9)
      return 2;
    if (level < 16)
      return 3;
    return 4;
  }
  var RageResource = new LongRestResource("Rage", 2);
  var EndRageAction = class _EndRageAction extends AbstractAction {
    constructor(g2, actor) {
      super(g2, actor, "End Rage", "implemented", {}, { time: "bonus action" });
    }
    check(config, ec) {
      if (!this.actor.hasEffect(RageEffect))
        ec.add("Not raging", this);
      return ec;
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_EndRageAction.prototype, this, "apply").call(this, {});
        yield this.actor.removeEffect(RageEffect);
      });
    }
  };
  function isRaging(who) {
    var _a;
    return who.hasEffect(RageEffect) && ((_a = who.armor) == null ? void 0 : _a.category) !== "heavy";
  }
  var DidAttackTag = new Effect("(Attacked)", "turnStart", void 0, true);
  var TookDamageTag = new Effect("(Damaged)", "turnEnd", void 0, true);
  var RageEffect = new Effect("Rage", "turnStart", (g2) => {
    g2.events.on("BeforeCheck", ({ detail: { who, ability, diceType } }) => {
      if (isRaging(who) && ability === "str")
        diceType.add("advantage", RageEffect);
    });
    g2.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      if (isRaging(who) && ability === "str")
        diceType.add("advantage", RageEffect);
    });
    g2.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, ability, bonus } }) => {
        var _a;
        if (isRaging(attacker) && hasAll(attack == null ? void 0 : attack.pre.tags, ["melee", "weapon"]) && ability === "str")
          bonus.add(
            getRageBonus((_a = attacker.classLevels.get("Barbarian")) != null ? _a : 0),
            RageEffect
          );
      }
    );
    g2.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (isRaging(who) && MundaneDamageTypes.includes(damageType))
          response.add("resist", RageEffect);
      }
    );
    g2.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.actor.hasEffect(RageEffect) && action.isSpell)
        error.add("cannot cast spells", RageEffect);
    });
    g2.events.on("EffectAdded", ({ detail: { who, interrupt } }) => {
      if (isRaging(who) && who.conditions.has("Unconscious"))
        interrupt.add(
          new EvaluateLater(who, RageEffect, () => __async(void 0, null, function* () {
            yield who.removeEffect(RageEffect);
          }))
        );
    });
    g2.events.on("Attack", ({ detail: { pre, interrupt } }) => {
      if (isRaging(pre.who) && pre.who.side !== pre.target.side)
        interrupt.add(
          new EvaluateLater(pre.who, RageEffect, () => __async(void 0, null, function* () {
            yield pre.who.addEffect(DidAttackTag, { duration: Infinity });
          }))
        );
    });
    g2.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
      if (isRaging(who))
        interrupt.add(
          new EvaluateLater(who, RageEffect, () => __async(void 0, null, function* () {
            yield who.addEffect(TookDamageTag, { duration: Infinity });
          }))
        );
    });
    g2.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      if (isRaging(who)) {
        if (!who.hasEffect(DidAttackTag) && !who.hasEffect(TookDamageTag))
          interrupt.add(
            new EvaluateLater(who, RageEffect, () => __async(void 0, null, function* () {
              yield who.removeEffect(RageEffect);
            }))
          );
        else
          interrupt.add(
            new EvaluateLater(who, RageEffect, () => __async(void 0, null, function* () {
              yield who.removeEffect(DidAttackTag);
              yield who.removeEffect(TookDamageTag);
            }))
          );
      }
    });
    g2.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.hasEffect(RageEffect))
        actions.push(new EndRageAction(g2, who));
    });
  });
  var RageAction = class _RageAction extends AbstractAction {
    constructor(g2, actor) {
      super(
        g2,
        actor,
        "Rage",
        "incomplete",
        {},
        { time: "bonus action", resources: [[RageResource, 1]] }
      );
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_RageAction.prototype, this, "apply").call(this, {});
        if (yield this.actor.addEffect(RageEffect, { duration: minutes(1) }))
          yield this.actor.endConcentration();
      });
    }
  };
  var Rage = new SimpleFeature(
    "Rage",
    `In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.

While raging, you gain the following benefits if you aren't wearing heavy armor:

- You have advantage on Strength checks and Strength saving throws.
- When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.
- You have resistance to bludgeoning, piercing, and slashing damage.

If you are able to cast spells, you can't cast them or concentrate on them while raging.

Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.

Once you have raged the maximum number of times for your barbarian level, you must finish a long rest before you can rage again. You may rage 2 times at 1st level, 3 at 3rd, 4 at 6th, 5 at 12th, and 6 at 17th.`,
    (g2, me) => {
      var _a;
      me.initResource(
        RageResource,
        getRageCount((_a = me.classLevels.get("Barbarian")) != null ? _a : 0)
      );
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me && !me.hasEffect(RageEffect))
          actions.push(new RageAction(g2, who));
      });
    }
  );
  var Rage_default = Rage;

  // src/classes/barbarian/RecklessAttack.ts
  var RecklessAttackResource = new TurnResource("Reckless Attack", 1);
  function canBeReckless(who, tags, ability) {
    return who.hasEffect(RecklessAttackEffect) && hasAll(tags, ["melee", "weapon"]) && ability === "str";
  }
  var RecklessAttackEffect = new Effect("Reckless Attack", "turnStart", (g2) => {
    g2.events.on(
      "BeforeAttack",
      ({ detail: { who, target, diceType, ability, tags } }) => {
        if (canBeReckless(who, tags, ability))
          diceType.add("advantage", RecklessAttackEffect);
        if (target.hasEffect(RecklessAttackEffect))
          diceType.add("advantage", RecklessAttackEffect);
      }
    );
  });
  var RecklessAttack = new SimpleFeature(
    "Reckless Attack",
    `Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.`,
    (g2, me) => {
      me.initResource(RecklessAttackResource);
      g2.events.on(
        "BeforeAttack",
        ({ detail: { who, interrupt, tags, ability, diceType } }) => {
          if (who === me && me.hasResource(RecklessAttackResource)) {
            me.spendResource(RecklessAttackResource);
            interrupt.add(
              new YesNoChoice(
                me,
                RecklessAttack,
                "Reckless Attack",
                `Get advantage on all melee weapon attack rolls using Strength this turn at the cost of all incoming attacks having advantage?`,
                () => __async(void 0, null, function* () {
                  yield me.addEffect(RecklessAttackEffect, { duration: 1 });
                  if (canBeReckless(who, tags, ability))
                    diceType.add("advantage", RecklessAttackEffect);
                })
              )
            );
          }
        }
      );
    }
  );

  // src/classes/barbarian/index.ts
  var UnarmoredDefense = new SimpleFeature(
    "Unarmored Defense",
    `While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.`,
    (g2, me) => {
      g2.events.on("GetACMethods", ({ detail: { who, methods } }) => {
        if (who === me && !me.armor) {
          const uses = /* @__PURE__ */ new Set();
          let ac = 10 + me.dex.modifier + me.con.modifier;
          if (me.shield) {
            ac += me.shield.ac;
            uses.add(me.shield);
          }
          methods.push({ name: "Unarmored Defense", ac, uses });
        }
      });
    }
  );
  var dangerSenseConditions = /* @__PURE__ */ new Set([
    "Blinded",
    "Deafened",
    "Incapacitated"
  ]);
  var DangerSense = new SimpleFeature(
    "Danger Sense",
    `At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.`,
    (g2, me) => {
      g2.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
        if (who === me && ability === "dex" && !intersects(me.conditions, dangerSenseConditions))
          diceType.add("advantage", DangerSense);
      });
    }
  );
  var PrimalKnowledge = new ConfiguredFeature(
    "Primal Knowledge",
    `When you reach 3rd level and again at 10th level, you gain proficiency in one skill of your choice from the list of skills available to barbarians at 1st level.`,
    (g2, me, skills) => {
      for (const skill of skills)
        me.skills.set(skill, 1);
    }
  );
  var ExtraAttack2 = makeExtraAttack(
    "Extra Attack",
    `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
  );
  var FastMovement = new SimpleFeature(
    "Fast Movement",
    `Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.`,
    (g2, me) => {
      g2.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
        var _a;
        if (who === me && ((_a = me.armor) == null ? void 0 : _a.category) !== "heavy")
          bonus.add(10, FastMovement);
      });
    }
  );
  var FeralInstinct = new SimpleFeature(
    "Feral Instinct",
    `By 7th level, your instincts are so honed that you have advantage on initiative rolls.

Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.`,
    (g2, me) => {
      g2.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
        if (who === me)
          diceType.add("advantage", FeralInstinct);
      });
    }
  );
  var InstinctivePounce = new SimpleFeature(
    "Instinctive Pounce",
    `As part of the bonus action you take to enter your rage, you can move up to half your speed.`,
    (g2, me) => {
      g2.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
        if (action instanceof RageAction && action.actor === me)
          interrupt.add(
            new EvaluateLater(
              me,
              InstinctivePounce,
              () => __async(void 0, null, function* () {
                return g2.applyBoundedMove(
                  me,
                  new BoundedMove(InstinctivePounce, me.speed / 2)
                );
              })
            )
          );
      });
    }
  );
  var BrutalCritical = notImplementedFeature(
    "Brutal Critical",
    `Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.

This increases to two additional dice at 13th level and three additional dice at 17th level.`
  );
  var RelentlessRage = notImplementedFeature(
    "Relentless Rage",
    `Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.

Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.`
  );
  var PersistentRage = notImplementedFeature(
    "Persistent Rage",
    `Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.`
  );
  var IndomitableMight = notImplementedFeature(
    "Indomitable Might",
    `Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.`
  );
  var PrimalChampion = new SimpleFeature(
    "Primal Champion",
    `At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.`,
    (g2, me) => {
      me.str.setMaximum(24);
      me.con.setMaximum(24);
      me.str.score += 4;
      me.con.score += 4;
    }
  );
  var ASI44 = makeASI("Barbarian", 4);
  var ASI84 = makeASI("Barbarian", 8);
  var ASI124 = makeASI("Barbarian", 12);
  var ASI164 = makeASI("Barbarian", 16);
  var ASI194 = makeASI("Barbarian", 19);
  var Barbarian = {
    name: "Barbarian",
    hitDieSize: 12,
    armorProficiencies: acSet("light", "medium", "shield"),
    weaponCategoryProficiencies: wcSet("simple", "martial"),
    saveProficiencies: abSet("str", "con"),
    skillChoices: 2,
    skillProficiencies: skSet(
      "Animal Handling",
      "Athletics",
      "Intimidation",
      "Nature",
      "Perception",
      "Survival"
    ),
    features: /* @__PURE__ */ new Map([
      [1, [Rage_default, UnarmoredDefense]],
      [2, [DangerSense, RecklessAttack]],
      [3, [PrimalKnowledge]],
      [4, [ASI44]],
      [5, [ExtraAttack2, FastMovement]],
      [7, [FeralInstinct, InstinctivePounce]],
      [8, [ASI84]],
      [9, [BrutalCritical]],
      [11, [RelentlessRage]],
      [12, [ASI124]],
      [15, [PersistentRage]],
      [16, [ASI164]],
      [18, [IndomitableMight]],
      [19, [ASI194]],
      [20, [PrimalChampion]]
    ])
  };
  var barbarian_default = Barbarian;

  // src/classes/barbarian/Berserker/icons/frenzy.svg
  var frenzy_default = "./frenzy-XYJEPIJ4.svg";

  // src/classes/barbarian/Berserker/index.ts
  var FrenzyAttack = class _FrenzyAttack extends AbstractAction {
    constructor(g2, actor, weapon) {
      super(
        g2,
        actor,
        `${weapon.name} (Frenzy)`,
        "implemented",
        { target: new TargetResolver(g2, actor.reach + weapon.reach) },
        { damage: [weapon.damage], time: "bonus action" }
      );
      this.weapon = weapon;
      this.ability = getWeaponAbility(actor, weapon);
      this.icon = getItemIcon(weapon);
      this.subIcon = { url: frenzy_default };
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        __superGet(_FrenzyAttack.prototype, this, "apply").call(this, { target });
        yield doStandardAttack(this.g, {
          ability: this.ability,
          attacker: this.actor,
          source: this,
          target,
          weapon: this.weapon
        });
      });
    }
  };
  var FrenzyEffect = new Effect("Frenzy", "turnEnd", (g2) => {
    g2.events.on("GetActions", ({ detail: { who, target, actions } }) => {
      if (who.hasEffect(FrenzyEffect) && who !== target) {
        for (const weapon of who.weapons) {
          if (weapon.rangeCategory === "melee")
            actions.push(new FrenzyAttack(g2, who, weapon));
        }
      }
    });
    g2.events.on("EffectRemoved", ({ detail: { who, effect, interrupt } }) => {
      if (effect === RageEffect && who.hasEffect(FrenzyEffect)) {
        interrupt.add(
          new EvaluateLater(who, FrenzyEffect, () => __async(void 0, null, function* () {
            yield who.removeEffect(FrenzyEffect);
            yield who.changeExhaustion(1);
          }))
        );
      }
    });
  });
  var Frenzy = new SimpleFeature(
    "Frenzy",
    `Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.`,
    (g2, me) => {
      g2.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
        if (action instanceof RageAction && action.actor === me)
          interrupt.add(
            new YesNoChoice(
              me,
              Frenzy,
              "Frenzy",
              `Should ${me.name} enter a Frenzy?`,
              () => __async(void 0, null, function* () {
                yield me.addEffect(FrenzyEffect, { duration: minutes(1) });
              })
            )
          );
      });
    }
  );
  var MindlessRage = new SimpleFeature(
    "Mindless Rage",
    `Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.`,
    (g2, me) => {
      g2.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who === me && me.hasEffect(RageEffect)) {
          conditions.ignoreValue("Charmed");
          conditions.ignoreValue("Frightened");
        }
      });
      g2.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
        var _a, _b;
        if (who.hasEffect(RageEffect) && (((_a = config.conditions) == null ? void 0 : _a.has("Charmed")) || ((_b = config.conditions) == null ? void 0 : _b.has("Frightened"))))
          success.add("fail", MindlessRage);
      });
    }
  );
  var IntimidatingPresence = notImplementedFeature(
    "Intimidating Presence",
    `Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.

If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.`
  );
  var Retaliation = notImplementedFeature(
    "Retaliation",
    `Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.`
  );
  var Berserker = {
    className: "Barbarian",
    name: "Path of the Berserker",
    features: /* @__PURE__ */ new Map([
      [3, [Frenzy]],
      [6, [MindlessRage]],
      [10, [IntimidatingPresence]],
      [14, [Retaliation]]
    ])
  };
  var Berserker_default = Berserker;

  // src/enchantments/darkSun.ts
  var darkSun = {
    name: "dark sun",
    setup(g2, item) {
      weaponPlus1.setup(g2, item);
      item.name = `${item.weaponType} of the dark sun`;
      item.attunement = true;
      item.rarity = "Rare";
      g2.events.on(
        "GatherDamage",
        ({ detail: { attacker, critical, weapon, map, interrupt } }) => {
          if (weapon === item && attacker.attunements.has(weapon))
            interrupt.add(
              new EvaluateLater(attacker, this, () => __async(this, null, function* () {
                const damageType = "radiant";
                map.add(
                  damageType,
                  yield g2.rollDamage(
                    1,
                    { source: darkSun, size: 10, attacker, damageType },
                    critical
                  )
                );
              }))
            );
        }
      );
    }
  };
  var darkSun_default = darkSun;

  // src/enchantments/ofTheDeep.ts
  var ofTheDeep = {
    name: "of the deep",
    setup(g2, item) {
      item.name = `${item.name} of the deep`;
      item.magical = true;
      item.rarity = "Rare";
    }
  };
  var ofTheDeep_default = ofTheDeep;

  // src/items/potions.ts
  var GiantStats = {
    Hill: { str: 21, rarity: "Uncommon" },
    Stone: { str: 23, rarity: "Rare" },
    Frost: { str: 23, rarity: "Rare" },
    Fire: { str: 25, rarity: "Rare" },
    Cloud: { str: 27, rarity: "Very Rare" },
    Storm: { str: 29, rarity: "Legendary" }
  };
  var PotionOfGiantStrength = class extends AbstractWondrous {
    constructor(g2, type) {
      super(g2, `Potion of ${type} Giant Strength`, 0);
      this.type = type;
      this.rarity = GiantStats[type].rarity;
    }
  };

  // src/races/Halfling.ts
  var Lucky2 = notImplementedFeature(
    "Lucky",
    `When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.`
  );
  var Brave = new SimpleFeature(
    "Brave",
    `You have advantage on saving throws against being frightened.`,
    (g2, me) => {
      g2.events.on("BeforeSave", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("frightened"))
          diceType.add("advantage", Brave);
      });
    }
  );
  var HalflingNimbleness = notImplementedFeature(
    "Halfling Nimbleness",
    `You can move through the space of any creature that is of a size larger than yours.`
  );
  var Halfling = {
    name: "Halfling",
    abilities: /* @__PURE__ */ new Map([["dex", 2]]),
    size: "small",
    movement: /* @__PURE__ */ new Map([["speed", 25]]),
    features: /* @__PURE__ */ new Set([Lucky2, Brave, HalflingNimbleness]),
    languages: laSet("Common", "Halfling")
  };
  var StoutResilience = poisonResistance(
    "Stout Resilience",
    `You have advantage on saving throws against poison, and you have resistance against poison damage.`
  );
  var StoutHalfling = {
    parent: Halfling,
    name: "Stout Halfling",
    abilities: /* @__PURE__ */ new Map([["con", 1]]),
    size: "small",
    features: /* @__PURE__ */ new Set([StoutResilience])
  };

  // src/pcs/davies/Hagrond_token.png
  var Hagrond_token_default = "./Hagrond_token-SXREGQ37.png";

  // src/pcs/davies/Hagrond.ts
  var Hagrond = class extends PC {
    constructor(g2) {
      super(g2, "Hagrond", Hagrond_token_default);
      this.skills.set("Survival", 1);
      this.skills.set("Sleight of Hand", 1);
      this.toolProficiencies.set("vehicles (land)", 1);
      this.toolProficiencies.set("woodcarver's tools", 1);
      this.setAbilityScores(15, 15, 13, 10, 8, 10);
      this.setRace(StoutHalfling);
      this.addSubclass(Berserker_default);
      this.addClassLevel(barbarian_default);
      this.addClassLevel(barbarian_default);
      this.addClassLevel(barbarian_default);
      this.addClassLevel(barbarian_default);
      this.addClassLevel(barbarian_default);
      this.addClassLevel(barbarian_default);
      this.addClassLevel(barbarian_default);
      this.setConfig(ASI44, { type: "ability", abilities: ["str", "con"] });
      this.setConfig(PrimalKnowledge, ["Perception"]);
      this.skills.set("Intimidation", 1);
      this.skills.set("Animal Handling", 1);
      this.don(enchant(new Spear(g2, 1), darkSun_default), true);
      this.don(enchant(new Trident(g2, 1), ofTheDeep_default), true);
      this.inventory.add(new Dagger(g2, 4));
      this.inventory.add(new Handaxe(g2, 1));
      this.inventory.add(new Spear(g2, 1));
      this.inventory.add(new PotionOfGiantStrength(g2, "Hill"));
    }
  };

  // src/classes/druid/index.ts
  var Druidic = nonCombatFeature(
    "Druidic",
    `You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message's presence with a successful DC 15 Wisdom (Perception) check but can't decipher it without magic.`
  );
  var DruidSpellcasting = new NormalSpellcasting(
    "Druid",
    `Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will.`,
    "wis",
    "full",
    "Druid",
    "Druid"
  );
  var WildShape = notImplementedFeature(
    "Wild Shape",
    `Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.`
  );
  var WildCompanion = notImplementedFeature(
    "Wild Companion",
    `You gain the ability to summon a spirit that assumes an animal form: as an action, you can expend a use of your Wild Shape feature to cast the find familiar spell, without material components.`
  );
  var CantripVersatility = nonCombatFeature(
    "Cantrip Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the druid spell list.`
  );
  var TimelessBody = nonCombatFeature(
    "Timeless Body",
    `Starting at 18th level, the primal magic that you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year.`
  );
  var BeastSpells = notImplementedFeature(
    "Beast Spells",
    `Beginning at 18th level, you can cast many of your druid spells in any shape you assume using Wild Shape. You can perform the somatic and verbal components of a druid spell while in a beast shape, but you aren't able to provide material components.`
  );
  var Archdruid = notImplementedFeature(
    "Archdruid",
    `At 20th level, you can use your Wild Shape an unlimited number of times.

Additionally, you can ignore the verbal and somatic components of your druid spells, as well as any material components that lack a cost and aren't consumed by a spell. You gain this benefit in both your normal shape and your beast shape from Wild Shape.`
  );
  var ASI45 = makeASI("Druid", 4);
  var ASI85 = makeASI("Druid", 8);
  var ASI125 = makeASI("Druid", 12);
  var ASI165 = makeASI("Druid", 16);
  var ASI195 = makeASI("Druid", 19);
  var Druid = {
    name: "Druid",
    hitDieSize: 8,
    // TODO druids will not wear armor or use shields made of metal
    armorProficiencies: acSet("light", "medium", "shield"),
    weaponProficiencies: /* @__PURE__ */ new Set([
      "club",
      "dagger",
      "dart",
      "javelin",
      "mace",
      "quarterstaff",
      "scimitar",
      "sickle",
      "sling",
      "spear"
    ]),
    toolProficiencies: toSet("herbalism kit"),
    saveProficiencies: abSet("int", "wis"),
    skillChoices: 2,
    skillProficiencies: skSet(
      "Arcana",
      "Animal Handling",
      "Insight",
      "Medicine",
      "Nature",
      "Perception",
      "Religion",
      "Survival"
    ),
    features: /* @__PURE__ */ new Map([
      [1, [Druidic, DruidSpellcasting.feature]],
      [2, [WildShape, WildCompanion]],
      [4, [ASI45, CantripVersatility]],
      [8, [ASI85]],
      [12, [ASI125]],
      [16, [ASI165]],
      [18, [TimelessBody, BeastSpells]],
      [19, [ASI195]],
      [20, [Archdruid]]
    ])
  };
  var druid_default = Druid;

  // src/spells/level2/Blur.ts
  var BlurEffect = new Effect("Blur", "turnStart", (g2) => {
    g2.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
      if (who.hasEffect(BlurEffect))
        diceType.add("disadvantage", BlurEffect);
    });
  });
  var Blur = simpleSpell({
    status: "incomplete",
    name: "Blur",
    level: 2,
    school: "Illusion",
    concentration: true,
    v: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    getConfig: () => ({}),
    getTargets: (g2, caster) => [caster],
    apply(g2, caster) {
      return __async(this, null, function* () {
        const duration = minutes(1);
        yield caster.addEffect(BlurEffect, { duration }, caster);
        yield caster.concentrateOn({
          spell: Blur,
          duration,
          onSpellEnd() {
            return __async(this, null, function* () {
              yield caster.removeEffect(BlurEffect);
            });
          }
        });
      });
    }
  });
  var Blur_default = Blur;

  // src/spells/level2/MirrorImage.ts
  var MirrorImage = simpleSpell({
    name: "Mirror Image",
    level: 2,
    school: "Illusion",
    v: true,
    s: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    getConfig: () => ({}),
    getTargets: (g2, caster) => [caster],
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var MirrorImage_default = MirrorImage;

  // src/spells/level2/MistyStep.ts
  var MistyStep = simpleSpell({
    name: "Misty Step",
    level: 2,
    school: "Conjuration",
    time: "bonus action",
    v: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 30) }),
    getTargets: (g2, caster) => [caster],
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var MistyStep_default = MistyStep;

  // src/spells/level2/Silence.ts
  var Silence = simpleSpell({
    name: "Silence",
    level: 2,
    ritual: true,
    school: "Illusion",
    concentration: true,
    v: true,
    s: true,
    lists: ["Bard", "Cleric", "Ranger"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 120) }),
    getAffectedArea: (g2, caster, { point }) => point && [{ type: "sphere", radius: 20, centre: point }],
    getTargets: () => [],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { point }) {
      });
    }
  });
  var Silence_default = Silence;

  // src/spells/level2/SpiderClimb.ts
  var SpiderClimb = simpleSpell({
    name: "Spider Climb",
    level: 2,
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "a drop of bitumen and a spider",
    lists: ["Artificer", "Sorcerer", "Warlock", "Wizard"],
    getConfig: (g2, caster) => ({
      target: new TargetResolver(g2, caster.reach, true)
    }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
      });
    }
  });
  var SpiderClimb_default = SpiderClimb;

  // src/spells/level2/SpikeGrowth.ts
  var SpikeGrowth = simpleSpell({
    status: "incomplete",
    name: "Spike Growth",
    level: 2,
    school: "Transmutation",
    v: true,
    s: true,
    m: "seven sharp thorns or seven small twigs, each sharpened to a point",
    concentration: true,
    lists: ["Druid", "Ranger"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 150) }),
    getAffectedArea: (g2, caster, { point }) => point && [{ type: "sphere", centre: point, radius: 20 }],
    getTargets: () => [],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { point }) {
        const area = new ActiveEffectArea(
          "Spike Growth",
          { type: "sphere", centre: point, radius: 20 },
          arSet("difficult terrain", "plants")
        );
        g2.addEffectArea(area);
        const spiky = resolveArea(area.shape);
        const unsubscribe = g2.events.on(
          "CombatantMoved",
          ({ detail: { who, position, interrupt } }) => {
            const squares = getSquares(who, position);
            if (spiky.overlaps(squares))
              interrupt.add(
                new EvaluateLater(who, SpikeGrowth, () => __async(this, null, function* () {
                  const amount = yield g2.rollDamage(2, {
                    source: SpikeGrowth,
                    attacker,
                    target: who,
                    size: 4,
                    damageType: "piercing",
                    spell: SpikeGrowth,
                    method
                  });
                  yield g2.damage(
                    SpikeGrowth,
                    "piercing",
                    { attacker, target: who, spell: SpikeGrowth, method },
                    [["piercing", amount]]
                  );
                }))
              );
          }
        );
        attacker.concentrateOn({
          spell: SpikeGrowth,
          duration: minutes(10),
          onSpellEnd() {
            return __async(this, null, function* () {
              g2.removeEffectArea(area);
              unsubscribe();
            });
          }
        });
      });
    }
  });
  var SpikeGrowth_default = SpikeGrowth;

  // src/spells/level3/LightningBolt.ts
  function getArea4(g2, actor, point) {
    const position = g2.getState(actor).position;
    const size = actor.sizeInUnits;
    return aimLine(position, size, point, 100, 5);
  }
  var LightningBolt = scalingSpell({
    status: "implemented",
    name: "Lightning Bolt",
    level: 3,
    school: "Evocation",
    v: true,
    s: true,
    m: "a bit of fur and a rod of amber, crystal, or glass",
    lists: ["Sorcerer", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 100) }),
    getDamage: (g2, caster, method, { slot }) => [
      _dd((slot != null ? slot : 3) + 5, 6, "lightning")
    ],
    getAffectedArea: (g2, caster, { point }) => point && [getArea4(g2, caster, point)],
    getTargets: (g2, caster, { point }) => g2.getInside(getArea4(g2, caster, point)),
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { slot, point }) {
        const damage = yield g2.rollDamage(5 + slot, {
          source: LightningBolt,
          size: 6,
          spell: LightningBolt,
          method,
          damageType: "lightning",
          attacker
        });
        const dc = getSaveDC(attacker, method.ability);
        for (const target of g2.getInside(getArea4(g2, attacker, point))) {
          const save = yield g2.savingThrow(dc, {
            attacker,
            ability: "dex",
            spell: LightningBolt,
            method,
            who: target,
            tags: svSet()
          });
          yield g2.damage(
            LightningBolt,
            "lightning",
            { attacker, spell: LightningBolt, method, target },
            [["lightning", damage]],
            save.damageResponse
          );
        }
      });
    }
  });
  var LightningBolt_default = LightningBolt;

  // src/spells/level3/SleetStorm.ts
  var SleetStorm = simpleSpell({
    name: "Sleet Storm",
    level: 3,
    school: "Conjuration",
    concentration: true,
    v: true,
    s: true,
    m: "a pinch of dust and a few drops of water",
    lists: ["Druid", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 150) }),
    getAffectedArea: (g2, caster, { point }) => point && [{ type: "cylinder", centre: point, radius: 40, height: 20 }],
    getTargets: () => [],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { point }) {
      });
    }
  });
  var SleetStorm_default = SleetStorm;

  // src/spells/level3/Slow.ts
  var Slow = simpleSpell({
    name: "Slow",
    level: 3,
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "a drop of molasses",
    lists: ["Sorcerer", "Wizard"],
    getConfig: (g2) => ({ targets: new MultiTargetResolver(g2, 1, 6, 120) }),
    getTargets: (g2, caster, { targets }) => targets,
    check(g2, config, ec) {
      return ec;
    },
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { targets }) {
      });
    }
  });
  var Slow_default = Slow;

  // src/spells/level3/WaterBreathing.ts
  var WaterBreathing = simpleSpell({
    name: "Water Breathing",
    level: 3,
    ritual: true,
    school: "Transmutation",
    v: true,
    s: true,
    m: "a short reed or piece of straw",
    lists: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ targets: new MultiTargetResolver(g2, 1, 10, 30) }),
    getTargets: (g2, caster, { targets }) => targets,
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var WaterBreathing_default = WaterBreathing;

  // src/spells/level3/WaterWalk.ts
  var WaterWalk = simpleSpell({
    name: "Water Walk",
    level: 3,
    ritual: true,
    school: "Transmutation",
    v: true,
    s: true,
    m: "a piece of cork",
    lists: ["Artificer", "Cleric", "Druid", "Ranger", "Sorcerer"],
    getConfig: (g2) => ({ targets: new MultiTargetResolver(g2, 1, 10, 30) }),
    getTargets: (g2, caster, { targets }) => targets,
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var WaterWalk_default = WaterWalk;

  // src/spells/level4/ControlWater.ts
  var ControlWater = simpleSpell({
    name: "Control Water",
    level: 4,
    school: "Transmutation",
    v: true,
    s: true,
    m: "a drop of water and a pinch of dust",
    lists: ["Cleric", "Druid", "Wizard"],
    getConfig: () => ({}),
    getTargets: () => [],
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var ControlWater_default = ControlWater;

  // src/spells/level4/FreedomOfMovement.ts
  var FreedomOfMovement = simpleSpell({
    name: "Freedom of Movement",
    level: 4,
    school: "Abjuration",
    v: true,
    s: true,
    m: "a leather strap, bound around the arm or a similar appendage",
    lists: ["Artificer", "Bard", "Cleric", "Druid", "Ranger"],
    getConfig: (g2, caster) => ({ target: new TargetResolver(g2, caster.reach) }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
      });
    }
  });
  var FreedomOfMovement_default = FreedomOfMovement;

  // src/spells/level4/IceStorm.ts
  var getArea5 = (centre) => ({
    type: "cylinder",
    centre,
    radius: 20,
    height: 40
  });
  var IceStorm = scalingSpell({
    name: "Ice Storm",
    level: 4,
    school: "Evocation",
    v: true,
    s: true,
    m: "a pinch of dust and a few drops of water",
    lists: ["Druid", "Sorcerer", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 300) }),
    getAffectedArea: (g2, caster, { point }) => point && [getArea5(point)],
    getTargets: (g2, caster, { point }) => g2.getInside(getArea5(point)),
    getDamage: (g2, caster, method, { slot }) => [
      _dd((slot != null ? slot : 4) - 2, 8, "bludgeoning"),
      _dd(4, 6, "cold")
    ],
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var IceStorm_default = IceStorm;

  // src/spells/level4/Stoneskin.ts
  var StoneskinEffect = new Effect("Stoneskin", "turnStart", (g2) => {
    g2.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response, attack } }) => {
        if (who.hasEffect(StoneskinEffect) && !(attack == null ? void 0 : attack.pre.tags.has("magical")) && MundaneDamageTypes.includes(damageType))
          response.add("resist", StoneskinEffect);
      }
    );
  });
  var Stoneskin = simpleSpell({
    status: "implemented",
    name: "Stoneskin",
    level: 4,
    school: "Abjuration",
    concentration: true,
    v: true,
    s: true,
    m: "diamond dust worth 100gp, which the spell consumes",
    lists: ["Artificer", "Druid", "Ranger", "Sorcerer", "Wizard"],
    getConfig: (g2, caster) => ({
      target: new TargetResolver(g2, caster.reach, true)
    }),
    getTargets: (g2, caster, { target }) => [target],
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, caster, method, { target }) {
        const duration = hours(1);
        yield target.addEffect(StoneskinEffect, { duration }, caster);
        yield caster.concentrateOn({
          spell: Stoneskin,
          duration,
          onSpellEnd() {
            return __async(this, null, function* () {
              yield target.removeEffect(StoneskinEffect);
            });
          }
        });
      });
    }
  });
  var Stoneskin_default = Stoneskin;

  // src/spells/level5/CommuneWithNature.ts
  var CommuneWithNature = simpleSpell({
    name: "Commune with Nature",
    level: 5,
    ritual: true,
    school: "Divination",
    time: "long",
    v: true,
    s: true,
    lists: ["Druid", "Ranger"],
    getConfig: () => ({}),
    getTargets: () => [],
    apply(g2, caster, method) {
      return __async(this, null, function* () {
      });
    }
  });
  var CommuneWithNature_default = CommuneWithNature;

  // src/spells/level5/ConeOfCold.ts
  var getArea6 = (g2, caster, target) => ({
    type: "cone",
    radius: 60,
    centre: g2.getState(caster).position,
    target
  });
  var ConeOfCold = scalingSpell({
    status: "implemented",
    name: "Cone of Cold",
    level: 5,
    school: "Evocation",
    v: true,
    s: true,
    m: "a small crystal or glass cone",
    lists: ["Sorcerer", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 60) }),
    getDamage: (g2, caster, method, { slot }) => [_dd(3 + (slot != null ? slot : 5), 8, "cold")],
    getAffectedArea: (g2, caster, { point }) => point && [getArea6(g2, caster, point)],
    getTargets: (g2, caster, { point }) => g2.getInside(getArea6(g2, caster, point)),
    apply(_0, _1, _2, _3) {
      return __async(this, arguments, function* (g2, attacker, method, { slot, point }) {
        const damage = yield g2.rollDamage(3 + slot, {
          source: ConeOfCold,
          size: 8,
          spell: ConeOfCold,
          method,
          damageType: "cold",
          attacker
        });
        const dc = getSaveDC(attacker, method.ability);
        for (const target of g2.getInside(getArea6(g2, attacker, point))) {
          const save = yield g2.savingThrow(dc, {
            attacker,
            ability: "con",
            spell: ConeOfCold,
            method,
            who: target,
            tags: svSet()
          });
          yield g2.damage(
            ConeOfCold,
            "cold",
            { attacker, spell: ConeOfCold, method, target },
            [["cold", damage]],
            save.damageResponse
          );
        }
      });
    }
  });
  var ConeOfCold_default = ConeOfCold;

  // src/spells/level5/ConjureElemental.ts
  var ConjureElemental = scalingSpell({
    name: "Conjure Elemental",
    level: 5,
    school: "Conjuration",
    concentration: true,
    time: "long",
    v: true,
    s: true,
    m: "burning incense for air, soft clay for earth, sulfur and phosphorus for fire, or water and sand for water",
    lists: ["Druid", "Wizard"],
    getConfig: (g2) => ({ point: new PointResolver(g2, 90) }),
    getTargets: () => [],
    apply(g2, caster, method, config) {
      return __async(this, null, function* () {
      });
    }
  });
  var ConjureElemental_default = ConjureElemental;

  // src/spells/level5/Scrying.ts
  var Scrying = simpleSpell({
    name: "Scrying",
    level: 5,
    school: "Divination",
    time: "long",
    v: true,
    s: true,
    m: "a focus worth at least 1,000 gp, such as a crystal ball, a silver mirror, or a font filled with holy water",
    lists: ["Bard", "Cleric", "Druid", "Warlock", "Wizard"],
    getConfig: () => ({}),
    getTargets: () => [],
    apply(g2, caster, method) {
      return __async(this, null, function* () {
      });
    }
  });
  var Scrying_default = Scrying;

  // src/classes/druid/Land/index.ts
  var BonusCantrip = new ConfiguredFeature(
    "Bonus Cantrip",
    `You learn one additional druid cantrip of your choice. This cantrip doesn't count against the number of druid cantrips you know.`,
    (g2, me, spell) => {
      me.preparedSpells.add(spell);
    }
  );
  var NaturalRecovery = nonCombatFeature(
    "Natural Recovery",
    `Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest.

For example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots.`
  );
  var bonusSpells = {
    arctic: [
      { level: 3, spell: HoldPerson_default },
      { level: 3, spell: SpikeGrowth_default },
      { level: 5, spell: SleetStorm_default },
      { level: 5, spell: Slow_default },
      { level: 7, spell: FreedomOfMovement_default },
      { level: 7, spell: IceStorm_default },
      { level: 9, spell: CommuneWithNature_default },
      { level: 9, spell: ConeOfCold_default }
    ],
    coast: [
      { level: 3, spell: MirrorImage_default },
      { level: 3, spell: MistyStep_default },
      { level: 5, spell: WaterBreathing_default },
      { level: 5, spell: WaterWalk_default },
      { level: 7, spell: ControlWater_default },
      { level: 7, spell: FreedomOfMovement_default },
      { level: 9, spell: ConjureElemental_default },
      { level: 9, spell: Scrying_default }
    ],
    desert: [
      { level: 3, spell: Blur_default },
      { level: 3, spell: Silence_default }
      // { level: 5, spell: CreateFoodAndWater },
      // { level: 5, spell: ProtectionFromEnergy },
      // { level: 7, spell: Blight },
      // { level: 7, spell: HallucinatoryTerrain },
      // { level: 9, spell: InsectPlague },
      // { level: 9, spell: WallOfStone },
    ],
    forest: [
      // { level: 3, spell: Barkskin },
      { level: 3, spell: SpiderClimb_default },
      // { level: 5, spell: CallLightning },
      // { level: 5, spell: PlantGrowth },
      // { level: 7, spell: Divination },
      { level: 7, spell: FreedomOfMovement_default },
      { level: 9, spell: CommuneWithNature_default }
      // { level: 9, spell: TreeStride },
    ],
    grassland: [
      // { level: 3, spell: Invisibility },
      // { level: 3, spell: PassWithoutTrade },
      // { level: 5, spell: Daylight },
      // { level: 5, spell: Haste },
      // { level: 7, spell: Divination },
      { level: 7, spell: FreedomOfMovement_default }
      // { level: 9, spell: Dream },
      // { level: 9, spell: InsectPlague },
    ],
    mountain: [
      { level: 3, spell: SpiderClimb_default },
      { level: 3, spell: SpikeGrowth_default },
      { level: 5, spell: LightningBolt_default },
      // { level: 5, spell: MeldIntoStone },
      // { level: 7, spell: StoneShape },
      { level: 7, spell: Stoneskin_default }
      // { level: 9, spell: Passwall },
      // { level: 9, spell: WallOfStone },
    ],
    swamp: [
      // { level: 3, spell: Darkness },
      // { level: 3, spell: MelfsAcidArrow },
      { level: 5, spell: WaterWalk_default },
      // { level: 5, spell: StinkingCloud },
      { level: 7, spell: FreedomOfMovement_default },
      // { level: 7, spell: LocateCreature },
      // { level: 9, spell: InsectPlague },
      { level: 9, spell: Scrying_default }
    ],
    Underdark: [
      { level: 3, spell: SpiderClimb_default }
      // { level: 3, spell: Web },
      // { level: 5, spell: GaseousForm },
      // { level: 5, spell: StinkingCloud },
      // { level: 7, spell: GreaterInvisibility },
      // { level: 7, spell: StoneShape },
      // { level: 9, spell: Cloudkill },
      // { level: 9, spell: InsectPlague },
    ]
  };
  var bonusSpellsFeatures = new Map(
    Object.entries(bonusSpells).map(([type, entries]) => [
      type,
      bonusSpellsFeature(
        "Circle Spells",
        `Your mystical connection to the land infuses you with the ability to cast certain spells.`,
        "Druid",
        DruidSpellcasting,
        entries,
        "Druid"
      )
    ])
  );
  var CircleSpells = new ConfiguredFeature(
    "Circle Spells",
    `Your mystical connection to the land infuses you with the ability to cast certain spells. At 3rd, 5th, 7th, and 9th level you gain access to circle spells connected to the land where you became a druid. Choose that land\u2014arctic, coast, desert, forest, grassland, mountain, swamp, or Underdark\u2014and consult the associated list of spells.

Once you gain access to a circle spell, you always have it prepared, and it doesn't count against the number of spells you can prepare each day. If you gain access to a spell that doesn't appear on the druid spell list, the spell is nonetheless a druid spell for you.`,
    (g2, me, type) => {
      const feature = bonusSpellsFeatures.get(type);
      feature == null ? void 0 : feature.setup(g2, me);
    }
  );
  var LandsStride = notImplementedFeature(
    "Land's Stride",
    `Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.

In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.`
  );
  var NaturesWard = notImplementedFeature(
    "Nature's Ward",
    `When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.`
  );
  var NaturesSanctuary = notImplementedFeature(
    "Nature's Sanctuary",
    `When you reach 14th level, creatures of the natural world sense your connection to nature and become hesitant to attack you. When a beast or plant creature attacks you, that creature must make a Wisdom saving throw against your druid spell save DC. On a failed save, the creature must choose a different target, or the attack automatically misses. On a successful save, the creature is immune to this effect for 24 hours.

The creature is aware of this effect before it makes its attack against you.`
  );
  var Land = {
    className: "Druid",
    name: "Circle of the Land",
    features: /* @__PURE__ */ new Map([
      [2, [BonusCantrip, NaturalRecovery, CircleSpells]],
      [6, [LandsStride]],
      [10, [NaturesWard]],
      [14, [NaturesSanctuary]]
    ])
  };
  var Land_default = Land;

  // src/enchantments/silvered.ts
  var silvered = {
    name: "silvered",
    setup(g2, item) {
      item.name = `silvered ${item.name}`;
      g2.events.on("BeforeAttack", ({ detail: { weapon, ammo, tags } }) => {
        if (weapon === item || ammo === item)
          tags.add("silvered");
      });
    }
  };
  var silvered_default = silvered;

  // src/items/CloakOfElvenkind.ts
  var CloakHoodAction = class _CloakHoodAction extends AbstractAction {
    constructor(g2, actor, cloak) {
      super(
        g2,
        actor,
        cloak.hoodUp ? "Pull Hood Down" : "Pull Hood Up",
        "incomplete",
        {},
        { time: "action" }
      );
      this.cloak = cloak;
    }
    apply() {
      return __async(this, null, function* () {
        __superGet(_CloakHoodAction.prototype, this, "apply").call(this, {});
        this.cloak.hoodUp = !this.cloak.hoodUp;
      });
    }
  };
  var CloakOfElvenkind = class extends AbstractWondrous {
    constructor(g2, hoodUp = true) {
      super(g2, "Cloak of Elvenkind");
      this.hoodUp = hoodUp;
      this.attunement = true;
      this.rarity = "Uncommon";
      const cloaked = (who) => who && who.equipment.has(this) && who.attunements.has(this) && this.hoodUp;
      g2.events.on(
        "BeforeCheck",
        ({ detail: { who, target, skill, diceType } }) => {
          if (skill === "Perception" && cloaked(target))
            diceType.add("disadvantage", this);
          if (skill === "Stealth" && cloaked(who))
            diceType.add("advantage", this);
        }
      );
      g2.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who.equipment.has(this) && who.attunements.has(this))
          actions.push(new CloakHoodAction(g2, who, this));
      });
    }
  };

  // src/items/shields.ts
  var ArrowCatchingShield = class extends Shield {
    constructor(g2) {
      super(g2);
      this.name = "Arrow-Catching Shield";
      this.attunement = true;
      this.rarity = "Rare";
      g2.events.on("GetAC", ({ detail: { who, pre, bonus } }) => {
        if (who.equipment.has(this) && (pre == null ? void 0 : pre.tags.has("ranged")))
          bonus.add(2, this);
      });
    }
  };

  // src/races/Dwarf.ts
  var Darkvision = darkvisionFeature();
  var DwarvenResilience = poisonResistance(
    "Dwarven Resilience",
    `You have advantage on saving throws against poison, and you have resistance against poison damage.`
  );
  var DwarvenCombatTraining = new SimpleFeature(
    "Dwarven Combat Training",
    `You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.`,
    (g2, me) => {
      for (const weapon of ["battleaxe", "handaxe", "light hammer", "warhammer"])
        me.weaponProficiencies.add(weapon);
    }
  );
  var ToolProficiency = new ConfiguredFeature(
    "Tool Proficiency",
    `You gain proficiency with the artisan's tools of your choice: Smith's tools, brewer's supplies, or mason's tools.`,
    (g2, me, tool) => {
      me.toolProficiencies.set(tool, 1);
    }
  );
  var Stonecunning = nonCombatFeature(
    "Stonecunning",
    `Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.`
  );
  var Dwarf = {
    name: "Dwarf",
    abilities: /* @__PURE__ */ new Map([["con", 2]]),
    size: "medium",
    movement: /* @__PURE__ */ new Map([["speed", 25]]),
    features: /* @__PURE__ */ new Set([
      Darkvision,
      DwarvenResilience,
      DwarvenCombatTraining,
      ToolProficiency,
      Stonecunning
    ]),
    languages: laSet("Common", "Dwarvish")
  };
  var DwarvenArmorTraining = new SimpleFeature(
    "Dwarven Armor Training",
    `You have proficiency with light and medium armor.`,
    (g2, me) => {
      me.armorProficiencies.add("light");
      me.armorProficiencies.add("medium");
    }
  );
  var MountainDwarf = {
    parent: Dwarf,
    name: "Mountain Dwarf",
    abilities: /* @__PURE__ */ new Map([["str", 2]]),
    size: "medium",
    features: /* @__PURE__ */ new Set([DwarvenArmorTraining])
  };

  // src/spells/cantrip/MagicStone.ts
  var MagicStoneResource = new TemporaryResource("Magic Stone", 3);
  var MagicStoneAction = class _MagicStoneAction extends AbstractAttackAction {
    constructor(g2, actor, method, unsubscribe) {
      super(
        g2,
        actor,
        "Throw Magic Stone",
        "incomplete",
        { target: new TargetResolver(g2, 60) },
        {
          damage: [_dd(1, 6, "bludgeoning")],
          resources: [[MagicStoneResource, 1]]
        }
      );
      this.method = method;
      this.unsubscribe = unsubscribe;
    }
    apply(_0) {
      return __async(this, arguments, function* ({ target }) {
        __superGet(_MagicStoneAction.prototype, this, "apply").call(this, { target });
        const { g: g2, actor, method } = this;
        if (actor.getResource(MagicStoneResource) < 1)
          this.unsubscribe();
        const { attack, critical, hit } = yield g2.attack({
          who: actor,
          tags: atSet("ranged", "spell", "magical"),
          target,
          ability: method.ability,
          spell: MagicStone,
          method
        });
        if (hit) {
          const amount = yield g2.rollDamage(
            1,
            {
              source: MagicStone,
              size: 6,
              damageType: "bludgeoning",
              attacker: actor,
              target,
              ability: method.ability,
              spell: MagicStone,
              method
            },
            critical
          );
          yield g2.damage(
            this,
            "bludgeoning",
            {
              attack,
              attacker: actor,
              target,
              ability: method.ability,
              critical,
              spell: MagicStone,
              method
            },
            [["bludgeoning", amount]]
          );
        }
      });
    }
  };
  var MagicStone = simpleSpell({
    status: "incomplete",
    name: "Magic Stone",
    level: 0,
    school: "Transmutation",
    time: "bonus action",
    v: true,
    s: true,
    lists: ["Artificer", "Druid", "Warlock"],
    getConfig: () => ({}),
    getTargets: (g2, caster) => [caster],
    apply(g2, caster, method) {
      return __async(this, null, function* () {
        caster.initResource(MagicStoneResource);
        const unsubscribe = g2.events.on(
          "GetActions",
          ({ detail: { who, actions } }) => {
            if (who === caster && who.hasResource(MagicStoneResource))
              actions.push(new MagicStoneAction(g2, who, method, unsubscribe));
          }
        );
      });
    }
  });
  var MagicStone_default = MagicStone;

  // src/pcs/davies/Salgar_token.png
  var Salgar_token_default = "./Salgar_token-WLUJXZFZ.png";

  // src/pcs/davies/Salgar.ts
  var Salgar = class extends PC {
    constructor(g2) {
      super(g2, "Salgar", Salgar_token_default);
      this.skills.set("Arcana", 1);
      this.skills.set("History", 1);
      this.setAbilityScores(10, 8, 14, 14, 15, 10);
      this.setRace(MountainDwarf);
      this.languages.add("Elvish");
      this.languages.add("Giant");
      this.addSubclass(Land_default);
      this.addClassLevel(druid_default);
      this.addClassLevel(druid_default);
      this.addClassLevel(druid_default);
      this.addClassLevel(druid_default);
      this.addClassLevel(druid_default);
      this.addClassLevel(druid_default);
      this.addClassLevel(druid_default);
      this.setConfig(ToolProficiency, "mason's tools");
      this.setConfig(CircleSpells, "mountain");
      this.setConfig(BonusCantrip, MagicStone_default);
      this.setConfig(ASI45, { type: "ability", abilities: ["cha", "wis"] });
      this.skills.set("Insight", 1);
      this.skills.set("Survival", 1);
      this.don(new ArrowCatchingShield(g2), true);
      this.don(new BootsOfTheWinterlands(g2), true);
      this.don(new CloakOfElvenkind(g2), true);
      this.don(new Spear(g2, 1), true);
      this.don(new HideArmor(g2));
      this.inventory.add(new Handaxe(g2, 1));
      this.inventory.add(enchant(new Shortsword(g2), silvered_default));
      this.addPreparedSpells(
        // TODO Druidcraft,
        // TODO Mending,
        // TODO MoldEarth,
        // TODO DetectMagic,
        // TODO EarthTremor,
        HealingWord_default,
        // TODO SpeakWithAnimals,
        LesserRestoration_default
        // TODO LocateObject,
        // TODO Moonbeam,
        // TODO EruptingEarth,
        // TODO CharmMonster,
        // TODO GuardianOfNature
      );
    }
  };

  // src/ui/App.tsx
  var import_hooks15 = __toESM(require_hooks());

  // src/utils/config.ts
  function getConfigErrors(g2, action, config) {
    const ec = g2.check(action, config);
    action.check(config, ec);
    for (const [key, resolver] of Object.entries(action.getConfig(config))) {
      const value = config[key];
      resolver.check(value, action, ec);
    }
    return ec;
  }
  function checkConfig(g2, action, config) {
    return getConfigErrors(g2, action, config).result;
  }

  // src/ui/common.module.scss
  var common_module_default = {
    "damageList": "_damageList_f4xy4_1",
    "healList": "_healList_f4xy4_8",
    "panel": "_panel_f4xy4_15"
  };

  // src/ui/IconButton.module.scss
  var IconButton_module_default = {
    "main": "_main_13fqt_1",
    "image": "_image_13fqt_8",
    "sub": "_sub_13fqt_9"
  };

  // src/ui/SVGIcon.tsx
  var import_hooks = __toESM(require_hooks());

  // src/ui/utils/SVGCache.ts
  var import_preact = __toESM(require_preact());
  var FetchCache = class {
    constructor(init) {
      this.init = init;
      this.cache = /* @__PURE__ */ new Map();
    }
    get(src) {
      const cached = this.cache.get(src);
      if (cached)
        return cached;
      const promise = fetch(src, this.init).then((r2) => r2.text());
      this.cache.set(src, promise);
      return promise;
    }
  };
  var SVGCacheContext = (0, import_preact.createContext)({
    get() {
      throw new Error("Missing SVGCacheContext.Provider");
    }
  });

  // node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
  var import_preact2 = __toESM(require_preact());
  var import_preact3 = __toESM(require_preact());
  var _ = 0;
  function o(o2, e, n, t, f, l) {
    var s, u, a = {};
    for (u in e)
      "ref" == u ? s = e[u] : a[u] = e[u];
    var i = { type: o2, props: a, key: n, ref: s, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --_, __source: f, __self: l };
    if ("function" == typeof o2 && (s = o2.defaultProps))
      for (u in s)
        void 0 === a[u] && (a[u] = s[u]);
    return import_preact2.options.vnode && import_preact2.options.vnode(i), i;
  }

  // src/ui/SVGIcon.tsx
  function SVGIcon({ className, color, size, src }) {
    const cache2 = (0, import_hooks.useContext)(SVGCacheContext);
    const ref = (0, import_hooks.useRef)(null);
    (0, import_hooks.useEffect)(() => {
      void cache2.get(src).then((html) => {
        if (ref.current)
          ref.current.innerHTML = html;
        return html;
      });
    }, [cache2, src]);
    return /* @__PURE__ */ o(
      "div",
      {
        ref,
        className,
        "aria-hidden": true,
        style: { color, width: size, height: size }
      }
    );
  }

  // src/ui/IconButton.tsx
  function IconButton({
    onClick,
    alt,
    disabled,
    icon,
    size = 48,
    sub,
    subSize = 24
  }) {
    return /* @__PURE__ */ o(
      "button",
      {
        className: IconButton_module_default.main,
        disabled,
        style: { width: size, height: size },
        onClick,
        title: alt,
        "aria-label": alt,
        children: [
          /* @__PURE__ */ o(
            SVGIcon,
            {
              className: IconButton_module_default.image,
              src: icon.url,
              size,
              color: icon.colour
            }
          ),
          sub && /* @__PURE__ */ o(
            SVGIcon,
            {
              className: IconButton_module_default.sub,
              src: sub.url,
              size: subSize,
              color: sub.colour
            }
          )
        ]
      }
    );
  }

  // src/ui/Labelled.tsx
  var import_hooks2 = __toESM(require_hooks());

  // src/ui/Labelled.module.scss
  var Labelled_module_default = {
    "label": "_label_ehxn3_1"
  };

  // src/ui/utils/classnames.ts
  function classnames(...items) {
    const names = [];
    for (const item of items) {
      if (typeof item === "undefined")
        continue;
      else if (typeof item === "string")
        names.push(item);
      else {
        for (const [key, value] of Object.entries(item)) {
          if (value)
            names.push(key);
        }
      }
    }
    return names.join(" ");
  }

  // src/ui/Labelled.tsx
  function Labelled({
    children,
    label,
    labelClass,
    contentsClass,
    role = "group"
  }) {
    const labelId = (0, import_hooks2.useId)();
    return /* @__PURE__ */ o("div", { className: Labelled_module_default.main, role, "aria-labelledby": labelId, children: [
      /* @__PURE__ */ o(
        "div",
        {
          id: labelId,
          className: classnames(Labelled_module_default.label, labelClass),
          "aria-hidden": "true",
          children: label
        }
      ),
      /* @__PURE__ */ o("div", { className: classnames(Labelled_module_default.contents, contentsClass), children })
    ] });
  }

  // src/ui/utils/state.ts
  var import_signals = __toESM(require_signals());
  var actionAreas = (0, import_signals.signal)(
    void 0
  );
  var activeCombatantId = (0, import_signals.signal)(NaN);
  var activeCombatant = (0, import_signals.computed)(
    () => allCombatants.value.find((u) => u.id === activeCombatantId.value)
  );
  var allActions = (0, import_signals.signal)([]);
  var allCombatants = (0, import_signals.signal)([]);
  var allEffects = (0, import_signals.signal)([]);
  var chooseFromList = (0, import_signals.signal)(void 0);
  var chooseManyFromList = (0, import_signals.signal)(
    void 0
  );
  var chooseYesNo = (0, import_signals.signal)(void 0);
  var moveBounds = (0, import_signals.signal)(void 0);
  var moveHandler = (0, import_signals.signal)(void 0);
  var movingCombatantId = (0, import_signals.signal)(NaN);
  var movingCombatant = (0, import_signals.computed)(
    () => allCombatants.value.find((u) => u.id === movingCombatantId.value)
  );
  var scale = (0, import_signals.signal)(20);
  var wantsCombatant = (0, import_signals.signal)(
    void 0
  );
  var wantsPoint = (0, import_signals.signal)(void 0);
  window.state = {
    actionAreas,
    activeCombatantId,
    activeCombatant,
    allActions,
    allCombatants,
    allEffects,
    chooseFromList,
    chooseManyFromList,
    chooseYesNo,
    moveBounds,
    moveHandler,
    movingCombatantId,
    movingCombatant,
    scale,
    wantsCombatant,
    wantsPoint
  };

  // src/ui/ActiveUnitPanel.tsx
  function ActiveUnitPanel({
    onChooseAction,
    onPass,
    who
  }) {
    return /* @__PURE__ */ o("aside", { className: common_module_default.panel, "aria-label": "Active Unit", children: [
      /* @__PURE__ */ o(Labelled, { label: "Current Turn", children: who.name }),
      /* @__PURE__ */ o("button", { onClick: onPass, children: "End Turn" }),
      /* @__PURE__ */ o("hr", {}),
      /* @__PURE__ */ o(Labelled, { label: "Actions", children: allActions.value.map(
        (action) => action.icon ? /* @__PURE__ */ o(
          IconButton,
          {
            onClick: () => onChooseAction(action),
            icon: action.icon,
            sub: action.subIcon,
            alt: action.name
          },
          action.name
        ) : /* @__PURE__ */ o("button", { onClick: () => onChooseAction(action), children: action.name }, action.name)
      ) })
    ] });
  }

  // src/ui/App.module.scss
  var App_module_default = {
    "sidePanel": "_sidePanel_czif9_5"
  };

  // src/ui/Battlefield.tsx
  var import_hooks6 = __toESM(require_hooks());

  // src/ui/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_1lt6z_1"
  };

  // src/ui/BattlefieldEffect.tsx
  var import_hooks3 = __toESM(require_hooks());

  // src/ui/BattlefieldEffect.module.scss
  var BattlefieldEffect_module_default = {
    "main": "_main_1mq49_1",
    "label": "_label_1mq49_10",
    "square": "_square_1mq49_14"
  };

  // src/ui/BattlefieldEffect.tsx
  function getAuraColour(tags) {
    if (tags.has("heavily obscured"))
      return "silver";
    if (tags.has("holy"))
      return "yellow";
    if (tags.has("plants"))
      return "green";
  }
  function Sphere({
    shape,
    name,
    tags
  }) {
    const style = (0, import_hooks3.useMemo)(() => {
      const size = shape.radius * scale.value;
      return {
        left: shape.centre.x * scale.value - size,
        top: shape.centre.y * scale.value - size,
        width: size * 2,
        height: size * 2,
        borderRadius: size * 2,
        backgroundColor: getAuraColour(tags)
      };
    }, [shape.centre.x, shape.centre.y, shape.radius, tags]);
    return /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.main, style, children: /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.label, children: name }) });
  }
  function WithinArea({
    shape,
    name,
    tags
  }) {
    const style = (0, import_hooks3.useMemo)(() => {
      const size = (shape.radius * 2 + shape.target.sizeInUnits) * scale.value;
      return {
        left: (shape.position.x - shape.radius) * scale.value,
        top: (shape.position.y - shape.radius) * scale.value,
        width: size,
        height: size,
        backgroundColor: getAuraColour(tags)
      };
    }, [
      shape.position.x,
      shape.position.y,
      shape.radius,
      shape.target.sizeInUnits,
      tags
    ]);
    return /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.main, style, children: /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.label, children: name }) });
  }
  function AffectedSquare({ point }) {
    const style = (0, import_hooks3.useMemo)(
      () => ({
        left: point.x * scale.value,
        top: point.y * scale.value,
        width: scale.value * MapSquareSize,
        height: scale.value * MapSquareSize
      }),
      [point]
    );
    return /* @__PURE__ */ o("div", { className: BattlefieldEffect_module_default.square, style });
  }
  function BattlefieldEffect({
    name = "Pending",
    shape,
    tags = /* @__PURE__ */ new Set()
  }) {
    const main = (0, import_hooks3.useMemo)(() => {
      switch (shape.type) {
        case "cylinder":
        case "sphere":
          return /* @__PURE__ */ o(Sphere, { name, tags, shape });
        case "within":
          return /* @__PURE__ */ o(WithinArea, { name, tags, shape });
      }
    }, [name, shape, tags]);
    const points = (0, import_hooks3.useMemo)(() => Array.from(resolveArea(shape)), [shape]);
    return /* @__PURE__ */ o(import_preact3.Fragment, { children: [
      main,
      points.map((p, i) => /* @__PURE__ */ o(AffectedSquare, { shape, point: p }, i))
    ] });
  }

  // src/ui/Unit.tsx
  var import_hooks5 = __toESM(require_hooks());

  // src/ui/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_ap8hd_1",
    "token": "_token_ap8hd_11"
  };

  // src/ui/UnitMoveButton.tsx
  var import_hooks4 = __toESM(require_hooks());

  // src/ui/icons/e.svg
  var e_default = "./e-DATSAPHV.svg";

  // src/ui/icons/n.svg
  var n_default = "./n-2BLT76O4.svg";

  // src/ui/icons/ne.svg
  var ne_default = "./ne-WAOZPP55.svg";

  // src/ui/icons/nw.svg
  var nw_default = "./nw-EMUGHXVG.svg";

  // src/ui/icons/s.svg
  var s_default = "./s-4OPBNP4F.svg";

  // src/ui/icons/se.svg
  var se_default = "./se-XCDEOBHI.svg";

  // src/ui/icons/sw.svg
  var sw_default = "./sw-NWNDSPVE.svg";

  // src/ui/icons/w.svg
  var w_default = "./w-IMIMIJNF.svg";

  // src/ui/UnitMoveButton.module.scss
  var UnitMoveButton_module_default = {
    "main": "_main_etih8_5",
    "moveE": "_moveE_etih8_17",
    "moveSE": "_moveSE_etih8_23",
    "moveS": "_moveS_etih8_23",
    "moveSW": "_moveSW_etih8_34",
    "moveW": "_moveW_etih8_39",
    "moveNW": "_moveNW_etih8_45",
    "moveN": "_moveN_etih8_45",
    "moveNE": "_moveNE_etih8_56"
  };

  // src/ui/UnitMoveButton.tsx
  var makeButtonType = (className, iconUrl, label) => ({
    className: UnitMoveButton_module_default[className],
    iconUrl,
    label
  });
  var buttonTypes = {
    east: makeButtonType("moveE", e_default, "Move East"),
    southeast: makeButtonType("moveSE", se_default, "Move Southeast"),
    south: makeButtonType("moveS", s_default, "Move South"),
    southwest: makeButtonType("moveSW", sw_default, "Move Southwest"),
    west: makeButtonType("moveW", w_default, "Move West"),
    northwest: makeButtonType("moveNW", nw_default, "Move Northwest"),
    north: makeButtonType("moveN", n_default, "Move North"),
    northeast: makeButtonType("moveNE", ne_default, "Move Northeast")
  };
  function UnitMoveButton({ disabled, onClick, type }) {
    const { className, iconUrl, label } = (0, import_hooks4.useMemo)(
      () => buttonTypes[type],
      [type]
    );
    const clicked = (0, import_hooks4.useCallback)(
      (e) => {
        e.stopPropagation();
        onClick(type);
      },
      [type, onClick]
    );
    return /* @__PURE__ */ o(
      "button",
      {
        disabled,
        className: classnames(UnitMoveButton_module_default.main, className),
        onClick: clicked,
        "aria-label": label,
        children: /* @__PURE__ */ o(SVGIcon, { src: iconUrl, size: 26 })
      }
    );
  }

  // src/ui/Unit.tsx
  function Unit({ isMoving, onClick, onMove, u }) {
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
    const clicked = (0, import_hooks5.useCallback)(
      (e) => onClick(u.who, e),
      [onClick, u]
    );
    const moved = (0, import_hooks5.useCallback)(
      (dir) => onMove(u.who, dir),
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
            isMoving && /* @__PURE__ */ o(import_preact3.Fragment, { children: [
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "east" }),
              /* @__PURE__ */ o(
                UnitMoveButton,
                {
                  disabled,
                  onClick: moved,
                  type: "southeast"
                }
              ),
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "south" }),
              /* @__PURE__ */ o(
                UnitMoveButton,
                {
                  disabled,
                  onClick: moved,
                  type: "southwest"
                }
              ),
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "west" }),
              /* @__PURE__ */ o(
                UnitMoveButton,
                {
                  disabled,
                  onClick: moved,
                  type: "northwest"
                }
              ),
              /* @__PURE__ */ o(UnitMoveButton, { disabled, onClick: moved, type: "north" }),
              /* @__PURE__ */ o(
                UnitMoveButton,
                {
                  disabled,
                  onClick: moved,
                  type: "northeast"
                }
              )
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
    var _a;
    const convertCoordinate = (0, import_hooks6.useCallback)((e) => {
      const x = round(Math.floor(e.pageX / scale.value), MapSquareSize);
      const y = round(Math.floor(e.pageY / scale.value), MapSquareSize);
      return { x, y };
    }, []);
    const onClick = (0, import_hooks6.useCallback)(
      (e) => onClickBattlefield(convertCoordinate(e), e),
      [convertCoordinate, onClickBattlefield]
    );
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      /* @__PURE__ */ o("main", { className: Battlefield_module_default.main, "aria-label": "Battlefield", onClick, children: [
        allCombatants.value.map((unit) => /* @__PURE__ */ o(
          Unit,
          {
            isMoving: movingCombatantId.value === unit.id,
            u: unit,
            onClick: onClickCombatant,
            onMove: onMoveCombatant
          },
          unit.id
        )),
        allEffects.value.map((effect) => /* @__PURE__ */ o(BattlefieldEffect, __spreadValues({}, effect), effect.id)),
        ((_a = actionAreas.value) != null ? _a : []).map((shape, i) => /* @__PURE__ */ o(BattlefieldEffect, { shape }, `temp${i}`))
      ] })
    );
  }

  // src/ui/BoundedMovePanel.tsx
  function BoundedMovePanel({ bounds, onFinish }) {
    return /* @__PURE__ */ o("aside", { className: common_module_default.panel, "aria-label": "Bounded Movement", children: [
      /* @__PURE__ */ o(Labelled, { label: bounds.handler.name, children: bounds.who.name }),
      /* @__PURE__ */ o("div", { children: [
        "Move up to ",
        bounds.handler.maximum,
        " feet."
      ] }),
      /* @__PURE__ */ o("button", { onClick: onFinish, disabled: bounds.handler.mustUseAll, children: "End Movement Early" })
    ] });
  }

  // src/ui/ChooseActionConfigPanel.tsx
  var import_hooks7 = __toESM(require_hooks());

  // src/ui/button.module.scss
  var button_module_default = {
    "active": "_active_10ff1_1"
  };

  // src/ui/ChooseActionConfigPanel.module.scss
  var ChooseActionConfigPanel_module_default = {
    "warning": "_warning_q460t_1"
  };

  // src/ui/CombatantRef.module.scss
  var CombatantRef_module_default = {
    "main": "_main_dtrbs_1",
    "icon": "_icon_dtrbs_6",
    "iconLabel": "_iconLabel_dtrbs_12"
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
    const setTarget = (0, import_hooks7.useCallback)(
      (who) => {
        onChange(field, who);
        wantsCombatant.value = void 0;
      },
      [field, onChange]
    );
    const onClick = (0, import_hooks7.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== setTarget ? setTarget : void 0;
    }, [setTarget]);
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Target: ",
        value ? /* @__PURE__ */ o(CombatantRef, { who: value }) : "NONE"
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          className: classnames({
            [button_module_default.active]: wantsCombatant.value === setTarget
          }),
          onClick,
          children: "Choose Target"
        }
      )
    ] });
  }
  function ChooseTargets({
    field,
    resolver,
    value,
    onChange
  }) {
    var _a;
    const addTarget = (0, import_hooks7.useCallback)(
      (who) => {
        if (who && !(value != null ? value : []).includes(who))
          onChange(field, (value != null ? value : []).concat(who));
        wantsCombatant.value = void 0;
      },
      [field, onChange, value]
    );
    const onClick = (0, import_hooks7.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== addTarget ? addTarget : void 0;
    }, [addTarget]);
    const remove = (0, import_hooks7.useCallback)(
      (who) => onChange(
        field,
        (value != null ? value : []).filter((x) => x !== who)
      ),
      [field, onChange, value]
    );
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Targets (",
        describeRange(resolver.minimum, resolver.maximum),
        "):",
        (value != null ? value : []).length ? /* @__PURE__ */ o("ul", { children: (value != null ? value : []).map((who) => /* @__PURE__ */ o("li", { children: [
          /* @__PURE__ */ o(CombatantRef, { who }),
          " ",
          /* @__PURE__ */ o("button", { onClick: () => remove(who), children: [
            "remove ",
            who.name
          ] })
        ] }, who.id)) }) : ` NONE`
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          className: classnames({
            [button_module_default.active]: wantsCombatant.value === addTarget
          }),
          disabled: ((_a = value == null ? void 0 : value.length) != null ? _a : 0) >= resolver.maximum,
          onClick,
          children: "Add Target"
        }
      )
    ] });
  }
  function ChoosePoint({ field, value, onChange }) {
    const setTarget = (0, import_hooks7.useCallback)(
      (p) => {
        onChange(field, p);
        wantsPoint.value = void 0;
      },
      [field, onChange]
    );
    const onClick = (0, import_hooks7.useCallback)(() => {
      wantsPoint.value = wantsPoint.value !== setTarget ? setTarget : void 0;
    }, [setTarget]);
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Point: ",
        describePoint(value)
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          className: classnames({
            [button_module_default.active]: wantsPoint.value === setTarget
          }),
          onClick,
          children: "Choose Point"
        }
      )
    ] });
  }
  function ChoosePoints({
    field,
    resolver,
    value,
    onChange
  }) {
    const addPoint = (0, import_hooks7.useCallback)(
      (p) => {
        if (p)
          onChange(field, (value != null ? value : []).concat(p));
        wantsPoint.value = void 0;
      },
      [field, onChange, value]
    );
    const onClick = (0, import_hooks7.useCallback)(() => {
      wantsPoint.value = wantsPoint.value !== addPoint ? addPoint : void 0;
    }, [addPoint]);
    const remove = (0, import_hooks7.useCallback)(
      (p) => onChange(
        field,
        (value != null ? value : []).filter((x) => x !== p)
      ),
      [field, onChange, value]
    );
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Points (",
        describeRange(resolver.minimum, resolver.maximum),
        "):",
        (value != null ? value : []).length ? /* @__PURE__ */ o("ul", { children: (value != null ? value : []).map((p, i) => /* @__PURE__ */ o("li", { children: [
          describePoint(p),
          /* @__PURE__ */ o("button", { onClick: () => remove(p), children: [
            "remove ",
            describePoint(p)
          ] })
        ] }, i)) }) : ` NONE`
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          className: classnames({
            [button_module_default.active]: wantsPoint.value === addPoint
          }),
          onClick,
          children: "Add Point"
        }
      )
    ] });
  }
  function ChooseSlot({
    action,
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
      /* @__PURE__ */ o("div", { children: enumerate(
        resolver.getMinimum(action.actor),
        resolver.getMaximum(action.actor)
      ).map((slot) => /* @__PURE__ */ o(
        "button",
        {
          className: classnames({ [button_module_default.active]: value === slot }),
          "aria-pressed": value === slot,
          onClick: () => onChange(field, slot),
          children: slot
        },
        slot
      )) })
    ] });
  }
  function ChooseText({
    field,
    resolver,
    value,
    onChange
  }) {
    const [label, setLabel] = (0, import_hooks7.useState)("NONE");
    const choose = (e) => () => {
      if (e.value === value) {
        onChange(field, void 0);
        setLabel("NONE");
        return;
      }
      onChange(field, e.value);
      setLabel(e.label);
    };
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Choice: ",
        label
      ] }),
      /* @__PURE__ */ o("div", { children: resolver.entries.map((e) => /* @__PURE__ */ o(
        "button",
        {
          className: classnames({ [button_module_default.active]: value === e.value }),
          "aria-pressed": value === e.value,
          onClick: choose(e),
          disabled: e.disabled,
          children: e.label
        },
        e.label
      )) })
    ] });
  }
  function ChooseNumber({
    field,
    resolver,
    value,
    onChange
  }) {
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        resolver.rangeName,
        " Choice: ",
        value != null ? value : "NONE"
      ] }),
      /* @__PURE__ */ o("div", { children: /* @__PURE__ */ o(
        "input",
        {
          type: "range",
          min: resolver.min,
          max: resolver.max,
          value,
          onChange: (e) => onChange(field, e.currentTarget.valueAsNumber)
        }
      ) })
    ] });
  }
  function getInitialConfig(action, initial) {
    const config = __spreadValues({}, initial);
    for (const [key, resolver] of Object.entries(action.getConfig(config))) {
      if (resolver instanceof SlotResolver && !config[key])
        config[key] = resolver.getMinimum(action.actor);
      else if (resolver instanceof NumberRangeResolver && !config[key])
        config[key] = resolver.min;
    }
    return config;
  }
  function AmountElement({ a, type }) {
    return /* @__PURE__ */ o("span", { children: [
      a.type === "flat" ? a.amount : `${a.amount.count}d${a.amount.size}`,
      type && " " + type
    ] });
  }
  function amountReducer(total, a) {
    return total + (a.type === "flat" ? a.amount : getDiceAverage(a.amount.count, a.amount.size));
  }
  function ChooseActionConfigPanel({
    g: g2,
    action,
    initialConfig = {},
    onCancel,
    onExecute
  }) {
    const [config, setConfig] = (0, import_hooks7.useState)(getInitialConfig(action, initialConfig));
    const patchConfig = (0, import_hooks7.useCallback)(
      (key, value) => setConfig((old) => __spreadProps(__spreadValues({}, old), { [key]: value })),
      []
    );
    (0, import_hooks7.useEffect)(() => {
      actionAreas.value = action.getAffectedArea(config);
    }, [action, activeCombatant.value, config]);
    const errors = (0, import_hooks7.useMemo)(
      () => getConfigErrors(g2, action, config).messages,
      [g2, action, config]
    );
    const disabled = (0, import_hooks7.useMemo)(() => errors.length > 0, [errors]);
    const damage = (0, import_hooks7.useMemo)(() => action.getDamage(config), [action, config]);
    const heal = (0, import_hooks7.useMemo)(() => action.getHeal(config), [action, config]);
    const execute = (0, import_hooks7.useCallback)(() => {
      if (checkConfig(g2, action, config))
        onExecute(action, config);
    }, [g2, action, config, onExecute]);
    const elements = (0, import_hooks7.useMemo)(
      () => Object.entries(action.getConfig(config)).map(([key, resolver]) => {
        const subProps = {
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
          return /* @__PURE__ */ o(ChooseTarget, __spreadValues({}, subProps));
        else if (resolver instanceof MultiTargetResolver)
          return /* @__PURE__ */ o(ChooseTargets, __spreadValues({}, subProps));
        else if (resolver instanceof PointResolver)
          return /* @__PURE__ */ o(ChoosePoint, __spreadValues({}, subProps));
        else if (resolver instanceof MultiPointResolver)
          return /* @__PURE__ */ o(ChoosePoints, __spreadValues({}, subProps));
        else if (resolver instanceof SlotResolver)
          return /* @__PURE__ */ o(ChooseSlot, __spreadValues({}, subProps));
        else if (resolver instanceof ChoiceResolver)
          return /* @__PURE__ */ o(ChooseText, __spreadValues({}, subProps));
        else if (resolver instanceof NumberRangeResolver)
          return /* @__PURE__ */ o(ChooseNumber, __spreadValues({}, subProps));
        else
          return /* @__PURE__ */ o("div", { children: [
            "(no frontend for resolver type [",
            subProps.resolver.type,
            "] yet)"
          ] });
      }),
      [action, config, patchConfig]
    );
    const statusWarning = action.status === "incomplete" ? /* @__PURE__ */ o("div", { className: ChooseActionConfigPanel_module_default.warning, children: "Incomplete implementation" }) : action.status === "missing" ? /* @__PURE__ */ o("div", { className: ChooseActionConfigPanel_module_default.warning, children: "Not implemented" }) : null;
    return /* @__PURE__ */ o("aside", { className: common_module_default.panel, "aria-label": "Action Options", children: [
      /* @__PURE__ */ o("div", { children: action.name }),
      statusWarning,
      damage && /* @__PURE__ */ o("div", { children: [
        "Damage:",
        " ",
        /* @__PURE__ */ o("div", { className: common_module_default.damageList, children: [
          damage.map((a, i) => /* @__PURE__ */ o(AmountElement, { a, type: a.damageType }, i)),
          " ",
          "(",
          Math.ceil(damage.reduce(amountReducer, 0)),
          ")"
        ] })
      ] }),
      heal && /* @__PURE__ */ o("div", { children: [
        "Heal:",
        " ",
        /* @__PURE__ */ o("div", { className: common_module_default.healList, children: [
          heal.map((a, i) => /* @__PURE__ */ o(AmountElement, { a }, i)),
          " ",
          "(",
          Math.ceil(heal.reduce(amountReducer, 0)),
          ")"
        ] })
      ] }),
      /* @__PURE__ */ o("button", { disabled, onClick: execute, children: "Execute" }),
      /* @__PURE__ */ o("button", { onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ o("div", { children: elements }),
      errors.length > 0 && /* @__PURE__ */ o(Labelled, { label: "Errors", children: errors.map((msg, i) => /* @__PURE__ */ o("div", { children: msg }, i)) })
    ] });
  }

  // src/ui/EventLog.tsx
  var import_hooks9 = __toESM(require_hooks());

  // src/ui/EventLog.module.scss
  var EventLog_module_default = {
    "container": "_container_8nmu9_1",
    "main": "_main_8nmu9_14",
    "messageWrapper": "_messageWrapper_8nmu9_22",
    "message": "_message_8nmu9_22"
  };

  // src/ui/hooks/useTimeout.ts
  var import_hooks8 = __toESM(require_hooks());
  function useTimeout(handler, ms = void 0) {
    const [handle, setHandle] = (0, import_hooks8.useState)();
    const fire = (0, import_hooks8.useCallback)(
      () => setHandle((old) => {
        if (old)
          return old;
        return setTimeout(() => {
          setHandle(void 0);
          handler();
        }, ms);
      }),
      [handler, ms]
    );
    const cancel = (0, import_hooks8.useCallback)(
      () => setHandle((old) => {
        if (old)
          clearTimeout(old);
        return void 0;
      }),
      []
    );
    (0, import_hooks8.useEffect)(() => cancel, [cancel]);
    return { cancel, fire, handle };
  }

  // src/ui/EventLog.tsx
  function LogMessage({
    children,
    message
  }) {
    return /* @__PURE__ */ o("li", { "aria-label": message, className: EventLog_module_default.messageWrapper, children: /* @__PURE__ */ o("div", { "aria-hidden": "true", className: EventLog_module_default.message, children }) });
  }
  function AttackMessage({
    pre: { who, target, weapon, ammo, spell },
    roll,
    total,
    ac
  }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${who.name} attacks ${target.name}${roll.diceType !== "normal" ? ` at ${roll.diceType}` : ""}${weapon ? ` with ${weapon.name}` : ""}${spell ? ` with ${spell.name}` : ""}${ammo ? `, firing ${ammo.name}` : ""} (${total}). (AC ${ac})`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who }),
          "attacks\xA0",
          /* @__PURE__ */ o(CombatantRef, { who: target }),
          roll.diceType !== "normal" && ` at ${roll.diceType}`,
          weapon && ` with ${weapon.name}`,
          spell && ` with ${spell.name}`,
          ammo && `, firing ${ammo.name}`,
          "\xA0(",
          total,
          "). (AC ",
          ac,
          ")"
        ]
      }
    );
  }
  function CastMessage({ level, spell, who }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${who.name} casts ${spell.name}${level !== spell.level ? ` at level ${level}` : ""}.`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who }),
          "casts ",
          spell.name,
          level !== spell.level && ` at level ${level}`,
          "."
        ]
      }
    );
  }
  function getDamageEntryText([type, entry]) {
    return `${entry.amount} ${type}${entry.response !== "normal" ? ` ${entry.response}` : ""}`;
  }
  function DamageMessage({ who, total, breakdown }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${who.name} takes ${total} damage. (${Array.from(breakdown).map(getDamageEntryText).join(", ")})`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who }),
          "takes ",
          total,
          " damage. (",
          /* @__PURE__ */ o("div", { className: common_module_default.damageList, children: Array.from(breakdown).map(([type, entry]) => /* @__PURE__ */ o("span", { children: getDamageEntryText([type, entry]) }, type)) }),
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
  function EffectAddedMessage({ who, effect }) {
    return /* @__PURE__ */ o(LogMessage, { message: `${who.name} gains effect: ${effect.name}`, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      " gains effect: ",
      effect.name,
      "."
    ] });
  }
  function EffectRemovedMessage({ who, effect }) {
    return /* @__PURE__ */ o(LogMessage, { message: `${who.name} loses effect: ${effect.name}`, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      " loses effect: ",
      effect.name,
      "."
    ] });
  }
  function AbilityCheckMessage({ roll, total, dc }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${roll.type.who.name} rolls a ${total} on a ${describeAbility(
          roll.type.ability
        )} (${roll.type.skill}) ability check. (DC ${dc})`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who: roll.type.who }),
          " rolls a ",
          total,
          " on a",
          " ",
          describeAbility(roll.type.ability),
          " (",
          roll.type.skill,
          ") ability check. (DC ",
          dc,
          ")"
        ]
      }
    );
  }
  function InitiativeMessage({
    diceType,
    type,
    value
  }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${type.who.name} rolls a ${value} for initiative${diceType !== "normal" ? ` at ${diceType}` : ""}.`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who: type.who }),
          " rolls a ",
          value,
          " for initiative",
          diceType !== "normal" && ` at ${diceType}`,
          "."
        ]
      }
    );
  }
  function SaveMessage({ roll, total, dc }) {
    return /* @__PURE__ */ o(
      LogMessage,
      {
        message: `${roll.type.who.name} rolls a ${total} on a ${describeAbility(
          roll.type.ability
        )} saving throw. (DC ${dc})`,
        children: [
          /* @__PURE__ */ o(CombatantRef, { who: roll.type.who }),
          " rolls a ",
          total,
          " on a",
          " ",
          describeAbility(roll.type.ability),
          " saving throw. (DC ",
          dc,
          ")"
        ]
      }
    );
  }
  function HealedMessage({ who, amount, fullAmount }) {
    const over = fullAmount - amount;
    const wasted = over > 0 ? ` (${over} wasted)` : void 0;
    return /* @__PURE__ */ o(LogMessage, { message: `${who.name} heals for ${amount}${wasted}.`, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      " heals for ",
      amount,
      wasted,
      "."
    ] });
  }
  function ExhaustionMessage({ who, value }) {
    const amount = value ? `${value}` : "no";
    return /* @__PURE__ */ o(LogMessage, { message: `${who.name} now has ${amount} exhaustion.`, children: [
      /* @__PURE__ */ o(CombatantRef, { who }),
      " now has ",
      amount,
      " exhaustion."
    ] });
  }
  function EventLog({ g: g2 }) {
    const ref = (0, import_hooks9.useRef)(null);
    const [messages, setMessages] = (0, import_hooks9.useState)([]);
    const { fire } = useTimeout(
      () => {
        var _a, _b;
        return (_b = (_a = ref.current) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, { behavior: "smooth" });
      }
    );
    const addMessage = (0, import_hooks9.useCallback)((el) => {
      setMessages((old) => old.concat(el).slice(-50));
      fire();
    }, []);
    (0, import_hooks9.useEffect)(() => {
      g2.events.on(
        "Attack",
        ({ detail }) => addMessage(/* @__PURE__ */ o(AttackMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "CombatantDamaged",
        ({ detail }) => addMessage(/* @__PURE__ */ o(DamageMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "CombatantHealed",
        ({ detail }) => addMessage(/* @__PURE__ */ o(HealedMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "CombatantDied",
        ({ detail }) => addMessage(/* @__PURE__ */ o(DeathMessage, __spreadValues({}, detail)))
      );
      g2.events.on("EffectAdded", ({ detail }) => {
        if (!detail.effect.quiet)
          addMessage(/* @__PURE__ */ o(EffectAddedMessage, __spreadValues({}, detail)));
      });
      g2.events.on("EffectRemoved", ({ detail }) => {
        if (!detail.effect.quiet)
          addMessage(/* @__PURE__ */ o(EffectRemovedMessage, __spreadValues({}, detail)));
      });
      g2.events.on(
        "SpellCast",
        ({ detail }) => addMessage(/* @__PURE__ */ o(CastMessage, __spreadValues({}, detail)))
      );
      g2.events.on("DiceRolled", ({ detail }) => {
        if (detail.type.type === "initiative")
          addMessage(
            /* @__PURE__ */ o(
              InitiativeMessage,
              __spreadValues({}, detail)
            )
          );
      });
      g2.events.on(
        "AbilityCheck",
        ({ detail }) => addMessage(/* @__PURE__ */ o(AbilityCheckMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "Save",
        ({ detail }) => addMessage(/* @__PURE__ */ o(SaveMessage, __spreadValues({}, detail)))
      );
      g2.events.on(
        "Exhaustion",
        ({ detail }) => addMessage(/* @__PURE__ */ o(ExhaustionMessage, __spreadValues({}, detail)))
      );
    }, [addMessage, g2]);
    return /* @__PURE__ */ o("div", { className: EventLog_module_default.container, children: [
      /* @__PURE__ */ o("ul", { className: EventLog_module_default.main, "aria-label": "Event Log", children: messages }),
      /* @__PURE__ */ o("div", { ref })
    ] });
  }

  // src/ui/ListChoiceDialog.tsx
  var import_hooks11 = __toESM(require_hooks());

  // src/ui/Dialog.tsx
  var import_hooks10 = __toESM(require_hooks());

  // src/ui/Dialog.module.scss
  var Dialog_module_default = {
    "main": "_main_1hd4j_1",
    "shade": "_shade_1hd4j_5",
    "react": "_react_1hd4j_18",
    "title": "_title_1hd4j_24"
  };

  // src/ui/Dialog.tsx
  function ReactDialog({ title, text, children }) {
    const titleId = (0, import_hooks10.useId)();
    return /* @__PURE__ */ o("div", { className: Dialog_module_default.shade, children: /* @__PURE__ */ o(
      "div",
      {
        role: "dialog",
        "aria-labelledby": titleId,
        "aria-modal": "true",
        className: classnames(Dialog_module_default.main, Dialog_module_default.react),
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

  // src/ui/ListChoiceDialog.tsx
  function ListChoiceDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks11.useCallback)(
      (value) => {
        chooseFromList.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    return /* @__PURE__ */ o(Dialog, { title: interruption.title, text: interruption.text, children: interruption.items.map(({ label, value, disabled }) => /* @__PURE__ */ o("button", { disabled, onClick: () => decide(value), children: label }, label)) });
  }

  // src/ui/Menu.module.scss
  var Menu_module_default = {
    "main": "_main_1j00q_1",
    "sub": "_sub_1j00q_14"
  };

  // src/ui/Menu.tsx
  function Menu({ caption, items, onClick, x, y }) {
    return /* @__PURE__ */ o("menu", { className: Menu_module_default.main, style: { left: x, top: y }, children: /* @__PURE__ */ o(Labelled, { label: caption, contentsClass: Menu_module_default.sub, children: items.length === 0 ? /* @__PURE__ */ o("div", { children: "(empty)" }) : items.map(({ label, value, disabled }) => /* @__PURE__ */ o(
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

  // src/ui/MultiListChoiceDialog.tsx
  var import_hooks13 = __toESM(require_hooks());

  // src/ui/hooks/useList.ts
  var import_hooks12 = __toESM(require_hooks());
  function useList(initialValue = []) {
    const [list, setList] = (0, import_hooks12.useState)(initialValue);
    const toggle = (0, import_hooks12.useCallback)(
      (item) => setList(
        (old) => old.includes(item) ? old.filter((x) => x !== item) : old.concat(item)
      ),
      []
    );
    return { list, setList, toggle };
  }

  // src/ui/MultiListChoiceDialog.tsx
  function MultiListChoiceDialog({
    interruption,
    resolve
  }) {
    const { list, toggle } = useList();
    const invalidSelection = list.length < interruption.minimum || list.length > interruption.maximum;
    const decide = (0, import_hooks13.useCallback)(() => {
      chooseManyFromList.value = void 0;
      resolve(list);
    }, [list, resolve]);
    return /* @__PURE__ */ o(Dialog, { title: interruption.title, text: interruption.text, children: [
      /* @__PURE__ */ o("div", { children: [
        "Choose between ",
        interruption.minimum,
        " and ",
        interruption.maximum,
        " ",
        "inclusive."
      ] }),
      interruption.items.map(({ label, value, disabled }) => /* @__PURE__ */ o(
        "button",
        {
          className: classnames({
            [button_module_default.active]: list.includes(value)
          }),
          disabled,
          onClick: () => toggle(value),
          children: label
        },
        label
      )),
      /* @__PURE__ */ o("button", { disabled: invalidSelection, onClick: decide, children: "OK" })
    ] });
  }

  // src/ui/utils/icons.ts
  function getAllIcons(g2) {
    const icons = /* @__PURE__ */ new Set();
    for (const [who] of g2.combatants) {
      for (const item of who.inventory)
        if (item.iconUrl)
          icons.add(item.iconUrl);
      for (const item of who.equipment)
        if (item.iconUrl)
          icons.add(item.iconUrl);
      for (const item of who.knownSpells)
        if (item.icon)
          icons.add(item.icon.url);
      for (const item of who.preparedSpells)
        if (item.icon)
          icons.add(item.icon.url);
      for (const item of who.spellcastingMethods)
        if (item.icon)
          icons.add(item.icon.url);
    }
    return icons;
  }

  // src/ui/utils/types.ts
  function getUnitData(who, state) {
    const { position } = state;
    const {
      id,
      name,
      img,
      sizeInUnits,
      attacksSoFar,
      movedSoFar,
      speed,
      hp,
      hpMax,
      temporaryHP
    } = who;
    return {
      who,
      position,
      id,
      name,
      img,
      sizeInUnits,
      attacksSoFar: attacksSoFar.length,
      movedSoFar,
      speed,
      hp,
      hpMax,
      temporaryHP
    };
  }

  // src/ui/YesNoDialog.tsx
  var import_hooks14 = __toESM(require_hooks());
  function YesNoDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks14.useCallback)(
      (value) => {
        chooseYesNo.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    const onYes = (0, import_hooks14.useCallback)(() => decide(true), [decide]);
    const onNo = (0, import_hooks14.useCallback)(() => decide(false), [decide]);
    return /* @__PURE__ */ o(Dialog, { title: interruption.title, text: interruption.text, children: [
      /* @__PURE__ */ o("button", { onClick: onYes, children: "Yes" }),
      /* @__PURE__ */ o("button", { onClick: onNo, children: "No" })
    ] });
  }

  // src/ui/App.tsx
  function App({ g: g2, onMount }) {
    const cache2 = (0, import_hooks15.useContext)(SVGCacheContext);
    const [target, setTarget] = (0, import_hooks15.useState)();
    const [action, setAction] = (0, import_hooks15.useState)();
    const [actionMenu, setActionMenu] = (0, import_hooks15.useState)({
      show: false,
      x: NaN,
      y: NaN,
      items: []
    });
    const hideActionMenu = (0, import_hooks15.useCallback)(
      () => setActionMenu({ show: false, x: NaN, y: NaN, items: [] }),
      []
    );
    const refreshUnits = (0, import_hooks15.useCallback)(() => {
      const list = [];
      for (const [who, state] of g2.combatants)
        list.push(getUnitData(who, state));
      allCombatants.value = list;
    }, [g2]);
    const refreshAreas = (0, import_hooks15.useCallback)(() => {
      allEffects.value = Array.from(g2.effects);
    }, [g2]);
    (0, import_hooks15.useEffect)(() => {
      g2.events.on("CombatantPlaced", refreshUnits);
      g2.events.on("CombatantMoved", refreshUnits);
      g2.events.on("CombatantDied", refreshUnits);
      g2.events.on("AreaPlaced", refreshAreas);
      g2.events.on("AreaRemoved", refreshAreas);
      g2.events.on("TurnStarted", ({ detail: { who } }) => {
        activeCombatantId.value = who.id;
        moveHandler.value = getDefaultMovement(who);
        movingCombatantId.value = who.id;
        hideActionMenu();
        allActions.value = g2.getActions(who);
      });
      g2.events.on("ListChoice", (e) => chooseFromList.value = e);
      g2.events.on("MultiListChoice", (e) => chooseManyFromList.value = e);
      g2.events.on("YesNoChoice", (e) => chooseYesNo.value = e);
      g2.events.on("BoundedMove", (e) => {
        moveBounds.value = e;
        moveHandler.value = e.detail.handler;
        movingCombatantId.value = e.detail.who.id;
      });
      onMount == null ? void 0 : onMount(g2);
      for (const iconUrl of getAllIcons(g2))
        cache2.get(iconUrl);
    }, [cache2, g2, hideActionMenu, onMount, refreshAreas, refreshUnits]);
    const onExecuteAction = (0, import_hooks15.useCallback)(
      (action2, config) => {
        setAction(void 0);
        actionAreas.value = void 0;
        void g2.act(action2, config).then(() => {
          refreshUnits();
          const actions = g2.getActions(action2.actor);
          allActions.value = actions;
          return actions;
        });
      },
      [g2, refreshUnits]
    );
    const onClickAction = (0, import_hooks15.useCallback)(
      (action2) => {
        hideActionMenu();
        setAction(void 0);
        const point = target ? g2.getState(target).position : void 0;
        const config = { target, point };
        if (checkConfig(g2, action2, config)) {
          onExecuteAction(action2, config);
        } else
          console.warn(config, "does not match", action2.getConfig(config));
      },
      [g2, hideActionMenu, onExecuteAction, target]
    );
    const onClickBattlefield = (0, import_hooks15.useCallback)(
      (p) => {
        const givePoint = wantsPoint.peek();
        if (givePoint) {
          givePoint(p);
          return;
        }
        hideActionMenu();
        actionAreas.value = void 0;
      },
      [hideActionMenu]
    );
    const onClickCombatant = (0, import_hooks15.useCallback)(
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
        actionAreas.value = void 0;
        const me = activeCombatant.value;
        if (me) {
          setTarget(who);
          const items = allActions.value.map((action2) => {
            const testConfig = { target: who, point: g2.getState(who).position };
            const invalidConfig = !checkConfig(g2, action2, testConfig);
            const config = action2.getConfig(testConfig);
            const needsTarget = "target" in config || me.who === who;
            const needsPoint = "point" in config;
            return {
              label: action2.name,
              value: action2,
              disabled: invalidConfig || !needsTarget && !needsPoint
            };
          }).filter((item) => !item.disabled);
          setActionMenu({ show: true, x: e.clientX, y: e.clientY, items });
        }
      },
      [g2]
    );
    const onFinishBoundedMove = (0, import_hooks15.useCallback)(() => {
      if (moveBounds.value) {
        moveBounds.value.detail.resolve();
        moveBounds.value = void 0;
        if (g2.activeCombatant) {
          movingCombatantId.value = g2.activeCombatant.id;
          moveHandler.value = getDefaultMovement(g2.activeCombatant);
        }
      }
    }, [g2]);
    const onMoveCombatant = (0, import_hooks15.useCallback)(
      (who, dir) => {
        if (moveHandler.value) {
          hideActionMenu();
          void g2.move(who, dir, moveHandler.value).then((result) => {
            if (result.type === "error")
              console.warn(result.error.messages);
            else if (result.type === "unbind")
              onFinishBoundedMove();
            return result;
          });
        }
      },
      [g2, hideActionMenu, onFinishBoundedMove]
    );
    const onPass = (0, import_hooks15.useCallback)(() => {
      setAction(void 0);
      actionAreas.value = void 0;
      void g2.nextTurn();
    }, [g2]);
    const onCancelAction = (0, import_hooks15.useCallback)(() => {
      setAction(void 0);
      actionAreas.value = void 0;
    }, []);
    const onChooseAction = (0, import_hooks15.useCallback)(
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
            g: g2,
            action,
            onCancel: onCancelAction,
            onExecute: onExecuteAction
          }
        ),
        moveBounds.value && /* @__PURE__ */ o(
          BoundedMovePanel,
          {
            bounds: moveBounds.value.detail,
            onFinish: onFinishBoundedMove
          }
        )
      ] }),
      /* @__PURE__ */ o(EventLog, { g: g2 }),
      chooseFromList.value && /* @__PURE__ */ o(ListChoiceDialog, __spreadValues({}, chooseFromList.value.detail)),
      chooseManyFromList.value && /* @__PURE__ */ o(MultiListChoiceDialog, __spreadValues({}, chooseManyFromList.value.detail)),
      chooseYesNo.value && /* @__PURE__ */ o(YesNoDialog, __spreadValues({}, chooseYesNo.value.detail))
    ] });
  }

  // src/index.tsx
  var cache = new FetchCache();
  var g = new Engine();
  window.g = g;
  (0, import_preact4.render)(
    /* @__PURE__ */ o(SVGCacheContext.Provider, { value: cache, children: /* @__PURE__ */ o(
      App,
      {
        g,
        onMount: () => {
          const aura = new Aura(g);
          const beldalynn = new Beldalynn(g);
          const galilea = new Galilea(g);
          const salgar = new Salgar(g);
          const hagrond = new Hagrond(g);
          const birnotec = new Birnotec(g);
          const kay = new Kay(g);
          const gonrit = new OGonrit(g);
          const yulash = new Yulash(g);
          const zafron = new Zafron(g);
          g.place(aura, 20, 20);
          g.place(beldalynn, 10, 30);
          g.place(galilea, 5, 0);
          g.place(salgar, 15, 30);
          g.place(hagrond, 0, 5);
          g.place(birnotec, 15, 0);
          g.place(kay, 20, 0);
          g.place(gonrit, 10, 15);
          g.place(yulash, 25, 10);
          g.place(zafron, 10, 5);
          g.start();
        }
      }
    ) }),
    document.body
  );
})();
