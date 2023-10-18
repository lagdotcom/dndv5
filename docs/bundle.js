"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // globalExternal:preact
  var require_preact = __commonJS({
    "globalExternal:preact"(exports, module) {
      module.exports = globalThis.preact;
    }
  });

  // globalExternal:@preact/signals
  var require_signals = __commonJS({
    "globalExternal:@preact/signals"(exports, module) {
      module.exports = globalThis.preactSignals;
    }
  });

  // globalExternal:preact/hooks
  var require_hooks = __commonJS({
    "globalExternal:preact/hooks"(exports, module) {
      module.exports = globalThis.preactHooks;
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
  var InterruptionCollector = class {
    constructor() {
      this.set = /* @__PURE__ */ new Set();
    }
    add(interrupt) {
      this.set.add(interrupt);
    }
    *[Symbol.iterator]() {
      const interruptions = [...this.set];
      interruptions.sort((a, b) => b.priority - a.priority);
      for (const i of interruptions)
        yield i;
    }
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

  // src/img/act/dash.svg
  var dash_default = "./dash-CNRMKC55.svg";

  // src/colours.ts
  var ClassColours = {
    Barbarian: "#e7623e",
    Bard: "#ab6dac",
    Cleric: "#91a1b2",
    Druid: "#7a853b",
    Fighter: "#7f513e",
    Monk: "#51a5c5",
    Paladin: "#b59e54",
    Ranger: "#507f62",
    Rogue: "#555752",
    Sorcerer: "#992e2e",
    Warlock: "#7b469b",
    Wizard: "#2a50a1"
  };
  var DamageColours = {
    bludgeoning: "#8b0000",
    piercing: "#4169e1",
    slashing: "#ff8c00",
    acid: "#32cd32",
    cold: "#6699cc",
    fire: "#ce2029",
    force: "#800080",
    lightning: "#ffd700",
    necrotic: "#6a0dad",
    poison: "#00ff00",
    psychic: "#9966cc",
    radiant: "#daa520",
    thunder: "#1e90ff"
  };
  var Heal = "#50c878";
  var ItemRarityColours = {
    Common: "#242528",
    Uncommon: "#1FC219",
    Rare: "#4990E2",
    "Very Rare": "#9810E0",
    Legendary: "#FEA227",
    Artifact: "#BE8972"
  };
  var makeIcon = (url, colour) => ({
    url,
    colour
  });

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
    constructor(name, durationTimer, setup, { quiet = false, icon, tags = [] } = {}) {
      this.name = name;
      this.durationTimer = durationTimer;
      this.quiet = quiet;
      this.icon = icon;
      this.tags = new Set(tags);
      if (setup)
        this.rule = new DndRule(name, setup);
    }
  };

  // src/actions/AbstractAction.ts
  var AbstractAction = class {
    constructor(g, actor, name, status, config, {
      area,
      damage,
      description,
      heal,
      icon,
      resources,
      time
    } = {}) {
      this.g = g;
      this.actor = actor;
      this.name = name;
      this.status = status;
      this.config = config;
      this.area = area;
      this.damage = damage;
      this.description = description;
      this.heal = heal;
      this.resources = new Map(resources);
      this.time = time;
      this.icon = icon;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateHealingConfigs(targets) {
      return [];
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
    getDescription(config) {
      return this.description;
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
    getTargets(config) {
      return [this.actor];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getTime(config) {
      return this.time;
    }
    check(config, ec) {
      const time = this.getTime(config);
      if (time && !this.actor.hasTime(time))
        ec.add(`No ${time} left`, this);
      for (const [resource, cost] of this.getResources(config))
        if (!this.actor.hasResource(resource, cost))
          ec.add(`Not enough ${resource.name} left`, this);
      return ec;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async apply(config) {
      const time = this.getTime(config);
      if (time)
        this.actor.useTime(time);
      for (const [resource, cost] of this.getResources(config))
        this.actor.spendResource(resource, cost);
    }
  };

  // src/actions/DashAction.ts
  var DashIcon = makeIcon(dash_default);
  var DashEffect = new Effect(
    "Dash",
    "turnEnd",
    (g) => {
      g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
        if (who.hasEffect(DashEffect))
          multiplier.add("double", DashEffect);
      });
    },
    { icon: DashIcon }
  );
  var DashAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Dash",
        "implemented",
        {},
        {
          icon: DashIcon,
          time: "action",
          description: `When you take the Dash action, you gain extra movement for the current turn. The increase equals your speed, after applying any modifiers. With a speed of 30 feet, for example, you can move up to 60 feet on your turn if you dash.

        Any increase or decrease to your speed changes this additional movement by the same amount. If your speed of 30 feet is reduced to 15 feet, for instance, you can move up to 30 feet this turn if you dash.`
        }
      );
    }
    check(config, ec) {
      if (this.actor.speed <= 0)
        ec.add("Zero speed", this);
      return super.check(config, ec);
    }
    async apply() {
      await super.apply({});
      await this.actor.addEffect(DashEffect, { duration: 1 });
    }
  };

  // src/img/act/disengage.svg
  var disengage_default = "./disengage-7WZ2C2CM.svg";

  // src/filters.ts
  var makeFilter = ({
    name,
    message = name,
    check
  }) => ({ name, message, check });
  var canSee = makeFilter({
    name: "can see",
    message: "not visible",
    check: (g, action, value) => g.canSee(action.actor, value)
  });
  var isAlly = makeFilter({
    name: "ally",
    message: "must target ally",
    check: (g, action, value) => action.actor.side === value.side
  });
  var isConcentrating = makeFilter({
    name: "concentrating",
    message: "target must be concentrating",
    check: (g, action, value) => value.concentratingOn.size > 0
  });
  var isEnemy = makeFilter({
    name: "enemy",
    message: "must target enemy",
    check: (g, action, value) => action.actor.side !== value.side
  });
  var notSelf = makeFilter({
    name: "not self",
    check: (g, action, value) => action.actor !== value
  });
  var ofCreatureType = (...types) => makeFilter({
    name: types.join("/"),
    message: "wrong creature type",
    check: (g, action, value) => types.includes(value.type)
  });
  var notOfCreatureType = (...types) => makeFilter({
    name: `not ${types.join("/")}`,
    message: "wrong creature type",
    check: (g, action, value) => !types.includes(value.type)
  });

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
  function mergeSets(destination, source) {
    for (const item of source != null ? source : [])
      destination.add(item);
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
    average(scaleValue = 1, offset = HalfSquareSize) {
      let count = 0;
      let x = 0;
      let y = 0;
      for (const p of this) {
        count++;
        x += p.x;
        y += p.y;
      }
      return {
        x: (x / count + offset) * scaleValue,
        y: (y / count + offset) * scaleValue
      };
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
      case "cube": {
        const x = area.centre.x - area.length / 2;
        const y = area.centre.y - area.length / 2;
        const size = area.length;
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
  var HalfSquareSize = MapSquareSize / 2;
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
      return { x: this.x + HalfSquareSize, y: this.y + HalfSquareSize };
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
  function getDistanceBetween({ x: x1, y: y1 }, size1, { x: x2, y: y2 }, size2) {
    const closest_x1 = Math.max(x1, x2);
    const closest_x2 = Math.min(x1 + size1, x2 + size2);
    const closest_y1 = Math.max(y1, y2);
    const closest_y2 = Math.min(y1 + size1, y2 + size2);
    return Math.max(closest_x1 - closest_x2, closest_y1 - closest_y2) + MapSquareSize;
  }
  function distance(g, a, b) {
    const as = g.getState(a);
    const bs = g.getState(b);
    return getDistanceBetween(
      as.position,
      a.sizeInUnits,
      bs.position,
      b.sizeInUnits
    );
  }
  function distanceTo(g, who, to) {
    const s = g.getState(who);
    return getDistanceBetween(s.position, who.sizeInUnits, to, MapSquareSize);
  }
  function compareDistances(stationary, stationaryPosition, mover, oldPosition, newPosition) {
    const oldDistance = getDistanceBetween(
      oldPosition,
      mover.sizeInUnits,
      stationaryPosition,
      stationary.sizeInUnits
    );
    const newDistance = getDistanceBetween(
      newPosition,
      mover.sizeInUnits,
      stationaryPosition,
      stationary.sizeInUnits
    );
    return { oldDistance, newDistance };
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
  var getNaturalArmourMethod = (who, naturalAC) => {
    const uses = /* @__PURE__ */ new Set();
    let ac = naturalAC + who.dex.modifier;
    if (who.shield) {
      uses.add(who.shield);
      ac += who.shield.ac;
    }
    return { name: "natural armor", ac, uses };
  };
  function getFlanker(g, attacker, target) {
    for (const flanker of g.combatants.keys()) {
      if (flanker.side !== attacker.side)
        continue;
      if (flanker === attacker)
        continue;
      if (flanker.conditions.has("Incapacitated"))
        continue;
      if (distance(g, flanker, target) > 5)
        continue;
      return flanker;
    }
  }

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

  // src/events/GetMaxHPEvent.ts
  var GetMaxHPEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetMaxHP", { detail });
    }
  };

  // src/events/GetSpeedEvent.ts
  var GetSpeedEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetSpeed", { detail });
    }
  };

  // src/events/SpellCastEvent.ts
  var SpellCastEvent = class extends CustomEvent {
    constructor(detail) {
      super("SpellCast", { detail });
    }
  };

  // src/actions/CastSpell.ts
  var CastSpell = class {
    constructor(g, actor, method, spell) {
      this.g = g;
      this.actor = actor;
      this.method = method;
      this.spell = spell;
      this.name = `${spell.name} (${method.name})`;
      this.isSpell = true;
      this.time = spell.time;
      this.icon = spell.icon;
      this.subIcon = method.icon;
      this.vocal = spell.v;
    }
    get status() {
      return this.spell.status;
    }
    generateHealingConfigs(targets) {
      return this.spell.generateHealingConfigs(
        this.g,
        this.actor,
        this.method,
        targets
      );
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
    getDescription() {
      return this.spell.description;
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
    getTargets(config) {
      return this.spell.getTargets(this.g, this.actor, config);
    }
    getTime() {
      return this.time;
    }
    check(config, ec) {
      if (!this.actor.hasTime(this.spell.time))
        ec.add(`No ${this.spell.time} left`, this);
      for (const [resource, amount] of this.getResources(config))
        if (!this.actor.hasResource(resource, amount))
          ec.add(`Not enough ${resource.name} left`, this.method);
      return this.spell.check(this.g, config, ec);
    }
    async apply(config) {
      const { actor, g, method, spell } = this;
      actor.useTime(spell.time);
      for (const [resource, amount] of this.getResources(config))
        actor.spendResource(resource, amount);
      const sc = await g.resolve(
        new SpellCastEvent({
          who: actor,
          spell,
          method,
          level: spell.getLevel(config),
          targets: new Set(spell.getTargets(g, actor, config)),
          interrupt: new InterruptionCollector(),
          success: new SuccessResponseCollector()
        })
      );
      if (sc.detail.success.result === "fail")
        return;
      if (spell.concentration)
        await actor.endConcentration();
      return spell.apply(g, actor, method, config);
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
      var _a, _b, _c;
      return (_c = (_b = (_a = this.method).getMinSlot) == null ? void 0 : _b.call(_a, this.spell, who)) != null ? _c : this.spell.level;
    }
    getMaximum(who) {
      var _a, _b, _c;
      return (_c = (_b = (_a = this.method).getMaxSlot) == null ? void 0 : _b.call(_a, this.spell, who)) != null ? _c : this.spell.level;
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
    description,
    icon,
    apply,
    check = (_g, _config, ec) => ec,
    generateHealingConfigs = () => [],
    getAffectedArea = () => void 0,
    getConfig,
    getDamage: getDamage2 = () => void 0,
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
    description,
    icon,
    apply,
    check,
    generateHealingConfigs,
    getAffectedArea,
    getConfig,
    getDamage: getDamage2,
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
    description,
    apply,
    check = (_g, _config, ec) => ec,
    generateHealingConfigs,
    getAffectedArea = () => void 0,
    getConfig,
    getDamage: getDamage2 = () => void 0,
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
    description,
    icon,
    apply,
    check,
    generateHealingConfigs(g, caster, method, targets) {
      var _a, _b, _c, _d;
      if (!generateHealingConfigs)
        return [];
      const minSlot = (_b = (_a = method.getMinSlot) == null ? void 0 : _a.call(method, this, caster)) != null ? _b : level;
      const maxSlot = (_d = (_c = method.getMaxSlot) == null ? void 0 : _c.call(method, this, caster)) != null ? _d : level;
      return enumerate(minSlot, maxSlot).flatMap(
        (slot) => generateHealingConfigs(slot, targets, g, caster, method).map(
          (config) => ({ ...config, slot })
        )
      );
    },
    getAffectedArea,
    getConfig(g, actor, method, config) {
      return {
        ...getConfig(g, actor, method, config),
        slot: new SlotResolver(this, method)
      };
    },
    getDamage: getDamage2,
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
  function isEquipmentAttuned(item, who) {
    return (who == null ? void 0 : who.equipment.has(item)) && who.attunements.has(item);
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
      naturalAC = 10,
      rules = [],
      coefficients = [],
      groups = []
    }) {
      this.g = g;
      this.name = name;
      this.id = g.nextId();
      this.diesAtZero = diesAtZero;
      this.hands = hands;
      this.hp = hp;
      this.baseHpMax = hpMax;
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
      this.conditionImmunities = /* @__PURE__ */ new Set();
      this.deathSaveFailures = 0;
      this.deathSaveSuccesses = 0;
      this.rules = new Set(rules);
      this.coefficients = new Map(coefficients);
      this.groups = new Set(groups);
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
      const conditions = new ConditionCollector();
      for (const condition of this.conditionImmunities)
        conditions.ignoreValue(condition);
      this.g.fire(new GetConditionsEvent({ who: this, conditions }));
      for (const co of conditions.entries) {
        if (co.value === "Paralyzed" || co.value === "Petrified" || co.value === "Stunned" || co.value === "Unconscious")
          conditions.add("Incapacitated", co.source);
      }
      return conditions.result;
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
    get hpMax() {
      const bonus = new BonusCollector();
      bonus.add(this.baseHpMax, this);
      const e = this.g.fire(
        new GetMaxHPEvent({
          who: this,
          bonus,
          multiplier: new MultiplierCollector()
        })
      );
      return bonus.result * e.detail.multiplier.result;
    }
    addFeatures(features) {
      for (const feature of features != null ? features : [])
        this.addFeature(feature);
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
    async endConcentration() {
      for (const other of this.concentratingOn)
        await other.onSpellEnd();
      this.concentratingOn.clear();
    }
    async concentrateOn(entry) {
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
    async addEffect(effect, config, attacker) {
      const e = await this.g.resolve(
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
      await this.g.resolve(
        new EffectAddedEvent({
          who: this,
          effect,
          config,
          interrupt: new InterruptionCollector()
        })
      );
      return true;
    }
    getEffectConfig(effect) {
      return this.effects.get(effect);
    }
    hasEffect(effect) {
      return this.effects.has(effect);
    }
    async removeEffect(effect) {
      const config = this.getEffectConfig(effect);
      if (config) {
        this.effects.delete(effect);
        await this.g.resolve(
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
    }
    async tickEffects(durationTimer) {
      for (const [effect, config] of this.effects) {
        if (effect.durationTimer === durationTimer && --config.duration < 1)
          await this.removeEffect(effect);
      }
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
    async changeExhaustion(delta) {
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
      await this.g.resolve(e);
      if (e.detail.success.result !== "fail")
        this.exhaustion = value;
      return this.exhaustion;
    }
    hasTime(time) {
      return this.time.has(time);
    }
    useTime(time) {
      this.time.delete(time);
    }
    resetTime() {
      this.time.clear();
      this.time.add("action");
      this.time.add("bonus action");
      this.time.add("reaction");
    }
    getCoefficient(co) {
      const values = [this.coefficients.get(co)];
      for (const group of this.groups)
        values.push(group.getCoefficient(co));
      const filtered = values.filter(isDefined);
      return filtered.length ? filtered.reduce((p, c) => p * c, 1) : co.defaultValue;
    }
  };

  // src/resolvers/TargetResolver.ts
  var TargetResolver = class {
    constructor(g, maxRange, filters) {
      this.g = g;
      this.maxRange = maxRange;
      this.filters = filters;
      this.type = "Combatant";
    }
    get name() {
      const clauses = [];
      if (this.maxRange < Infinity)
        clauses.push(`target within ${this.maxRange}'`);
      clauses.push(...this.filters.map((f) => f.name));
      return clauses.length ? clauses.join(", ") : "any target";
    }
    check(value, action, ec) {
      if (!(value instanceof AbstractCombatant)) {
        ec.add("No target", this);
      } else {
        const isOutOfRange = distance(this.g, action.actor, value) > this.maxRange;
        const filterErrors = this.filters.filter((filter) => !filter.check(this.g, action, value)).map((filter) => filter.message);
        if (isOutOfRange)
          ec.add("Out of range", this);
        for (const error of filterErrors)
          ec.add(error, this);
      }
      return ec;
    }
  };

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
  function describeDice(amounts) {
    let average = 0;
    let flat = 0;
    const dice = [];
    for (const a of amounts) {
      if (a.type === "flat") {
        average += a.amount;
        flat += a.amount;
      } else {
        const { count, size } = a.amount;
        average += getDiceAverage(count, size);
        dice.push(`${count}d${size}`);
      }
    }
    let list = dice.join(" + ");
    if (flat < 0)
      list += ` - ${-flat}`;
    else if (flat > 0)
      list += ` + ${flat}`;
    return { average, list };
  }

  // src/img/act/dying.svg
  var dying_default = "./dying-OMHSKQST.svg";

  // src/img/act/prone.svg
  var prone_default = "./prone-ZBMZRVQM.svg";

  // src/types/ConditionName.ts
  var coSet = (...items) => new Set(items);

  // src/actions/DropProneAction.ts
  var DropProneIcon = makeIcon(prone_default);
  var DropProneAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Drop Prone",
        "implemented",
        {},
        {
          icon: DropProneIcon,
          description: `You can drop prone without using any of your speed.`
        }
      );
    }
    check(config, ec) {
      if (this.actor.conditions.has("Prone"))
        ec.add("already prone", this);
      return super.check(config, ec);
    }
    async apply() {
      await super.apply({});
      await this.actor.addEffect(Prone, {
        conditions: coSet("Prone"),
        duration: Infinity
      });
    }
  };

  // src/img/act/stand.svg
  var stand_default = "./stand-L4X6POXJ.svg";

  // src/actions/StandUpAction.ts
  var StandUpIcon = makeIcon(stand_default);
  var StandUpAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Stand Up",
        "implemented",
        {},
        {
          icon: StandUpIcon,
          description: `Standing up takes more effort; doing so costs an amount of movement equal to half your speed. For example, if your speed is 30 feet, you must spend 15 feet of movement to stand up. You can't stand up if you don't have enough movement left or if your speed is 0.`
        }
      );
    }
    get cost() {
      return round(this.actor.speed / 2, MapSquareSize);
    }
    check(config, ec) {
      if (!this.actor.conditions.has("Prone"))
        ec.add("not prone", this);
      const speed = this.actor.speed;
      if (speed <= 0)
        ec.add("cannot move", this);
      else if (this.actor.movedSoFar > this.cost)
        ec.add("not enough movement", this);
      return super.check(config, ec);
    }
    async apply() {
      await super.apply({});
      this.actor.movedSoFar += this.cost;
      await this.actor.removeEffect(Prone);
    }
  };

  // src/interruptions/EvaluateLater.ts
  var EvaluateLater = class {
    constructor(who, source, apply, priority2 = 5) {
      this.who = who;
      this.source = source;
      this.apply = apply;
      this.priority = priority2;
    }
  };

  // src/effects.ts
  var Dying = new Effect(
    "Dying",
    "turnStart",
    (g) => {
      g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
        if (who.hasEffect(Dying)) {
          conditions.add("Incapacitated", Dying);
          conditions.add("Prone", Dying);
          conditions.add("Unconscious", Dying);
        }
      });
      g.events.on("TurnSkipped", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(Dying))
          interrupt.add(
            new EvaluateLater(who, Dying, async () => {
              const { outcome, roll } = await g.save({
                source: Dying,
                type: { type: "flat", dc: 10 },
                who,
                tags: ["death"]
              });
              if (roll.value === 20)
                await g.heal(Dying, 1, { target: who });
              else if (roll.value === 1)
                await g.failDeathSave(who, 2);
              else if (outcome === "fail")
                await g.failDeathSave(who);
              else
                await g.succeedDeathSave(who);
            })
          );
      });
      g.events.on("CombatantHealed", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(Dying))
          interrupt.add(
            new EvaluateLater(who, Dying, async () => {
              who.deathSaveFailures = 0;
              who.deathSaveSuccesses = 0;
              await who.removeEffect(Dying);
              await who.addEffect(Prone, { duration: Infinity });
            })
          );
      });
    },
    { icon: makeIcon(dying_default, "red") }
  );
  var Stable = new Effect("Stable", "turnStart", (g) => {
    g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
      if (who.hasEffect(Stable)) {
        conditions.add("Incapacitated", Stable);
        conditions.add("Prone", Stable);
        conditions.add("Unconscious", Stable);
      }
    });
    g.events.on("CombatantHealed", ({ detail: { who, interrupt } }) => {
      if (who.hasEffect(Stable))
        interrupt.add(
          new EvaluateLater(who, Stable, async () => {
            await who.removeEffect(Stable);
            await who.addEffect(Prone, { duration: Infinity });
          })
        );
    });
  });
  var Dead = new Effect(
    "Dead",
    "turnStart",
    (g) => {
      g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
        if (who.hasEffect(Dead)) {
          conditions.add("Incapacitated", Dead);
          conditions.add("Prone", Dead);
          conditions.add("Unconscious", Dead);
        }
      });
    },
    { quiet: true }
  );
  var UsedAttackAction = new Effect(
    "Used Attack Action",
    "turnStart",
    void 0,
    { quiet: true }
  );
  var Prone = new Effect(
    "Prone",
    "turnEnd",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(Prone))
          conditions.add("Prone", Prone);
      });
      g.events.on("GetMoveCost", ({ detail: { who, multiplier } }) => {
        if (who.conditions.has("Prone"))
          multiplier.add("double", Prone);
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        actions.push(
          who.conditions.has("Prone") ? new StandUpAction(g, who) : new DropProneAction(g, who)
        );
      });
      g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        if (who.conditions.has("Prone"))
          diceType.add("disadvantage", Prone);
        if (target.conditions.has("Prone")) {
          const d = distance(g, who, target);
          diceType.add(d <= 5 ? "advantage" : "disadvantage", Prone);
        }
      });
    },
    { icon: makeIcon(prone_default) }
  );

  // src/actions/AbstractAttackAction.ts
  var AbstractAttackAction = class extends AbstractAction {
    constructor(g, actor, name, status, config, options = {}) {
      super(g, actor, name, status, config, options);
      this.isAttack = true;
    }
    generateHealingConfigs() {
      return [];
    }
    getTime() {
      if (this.actor.hasEffect(UsedAttackAction))
        return void 0;
      return "action";
    }
    async apply(config) {
      await super.apply(config);
      if (this.isAttack) {
        this.actor.attacksSoFar.push(this);
        await this.actor.addEffect(UsedAttackAction, { duration: 1 });
      }
    }
  };

  // src/actions/WeaponAttack.ts
  var WeaponAttack = class extends AbstractAttackAction {
    constructor(g, actor, weapon, ammo) {
      super(
        g,
        actor,
        ammo ? `${weapon.name} (${ammo.name})` : weapon.name,
        weapon.properties.has("thrown") ? "incomplete" : "implemented",
        {
          target: new TargetResolver(g, getWeaponRange(actor, weapon), [notSelf])
        }
      );
      this.weapon = weapon;
      this.ammo = ammo;
      this.ability = getWeaponAbility(actor, weapon);
      this.icon = weapon.icon;
      this.subIcon = ammo == null ? void 0 : ammo.icon;
    }
    getDamage() {
      return [this.weapon.damage];
    }
    getDescription() {
      const { actor, weapon } = this;
      const rangeCategories = [];
      const ranges = [];
      if (weapon.rangeCategory === "melee") {
        rangeCategories.push("Melee");
        ranges.push(`reach ${actor.reach + weapon.reach} ft.`);
      }
      if (weapon.rangeCategory === "ranged" || weapon.properties.has("thrown")) {
        rangeCategories.push("Ranged");
        ranges.push(`range ${weapon.shortRange}/${weapon.longRange} ft.`);
      }
      const bonus = "+?";
      const { average, list } = describeDice([weapon.damage]);
      const damageType = weapon.damage.damageType;
      return `${rangeCategories.join(
        " or "
      )} Weapon Attack: ${bonus} to hit, ${ranges.join(
        " or "
      )}, one target. Hit: ${Math.ceil(average)} (${list}) ${damageType} damage.`;
    }
    getTargets(config) {
      return [config.target];
    }
    async apply({ target }) {
      await super.apply({ target });
      await doStandardAttack(this.g, {
        ability: this.ability,
        ammo: this.ammo,
        attacker: this.actor,
        source: this,
        target,
        weapon: this.weapon
      });
    }
  };
  async function doStandardAttack(g, {
    ability,
    ammo,
    attacker,
    source,
    target,
    weapon
  }) {
    const tags = /* @__PURE__ */ new Set();
    tags.add(
      distance(g, attacker, target) > attacker.reach + weapon.reach ? "ranged" : "melee"
    );
    if (weapon.category !== "natural")
      tags.add("weapon");
    if (weapon.magical || (ammo == null ? void 0 : ammo.magical))
      tags.add("magical");
    const e = await g.attack({
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
        const amount = await g.rollDamage(
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
      const e2 = await g.damage(
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
  }

  // src/actions/OpportunityAttack.ts
  var OpportunityAttack = class extends WeaponAttack {
    constructor(g, actor, weapon) {
      super(g, actor, weapon);
      this.isAttack = false;
    }
    getTime() {
      return "reaction";
    }
    check(config, ec) {
      if (this.weapon.rangeCategory !== "melee")
        ec.add("can only make opportunity attacks with melee weapons", this);
      return super.check(config, ec);
    }
  };

  // src/actions/DisengageAction.ts
  var DisengageIcon = makeIcon(disengage_default, "darkgrey");
  var DisengageEffect = new Effect(
    "Disengage",
    "turnEnd",
    (g) => {
      g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
        if (action instanceof OpportunityAttack && config.target.hasEffect(DisengageEffect))
          error.add("target used Disengage", DisengageEffect);
      });
    },
    { icon: DisengageIcon }
  );
  var DisengageAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Disengage",
        "implemented",
        {},
        {
          time: "action",
          icon: DisengageIcon,
          description: `If you take the Disengage action, your movement doesn't provoke opportunity attacks for the rest of the turn.`
        }
      );
    }
    async apply() {
      await super.apply({});
      await this.actor.addEffect(DisengageEffect, { duration: 1 });
    }
  };

  // src/img/act/dodge.svg
  var dodge_default = "./dodge-NSUUDBS5.svg";

  // src/actions/DodgeAction.ts
  var DodgeIcon = makeIcon(dodge_default);
  function canDodge(who) {
    return who.hasEffect(DodgeEffect) && who.speed > 0 && !who.conditions.has("Incapacitated");
  }
  var DodgeEffect = new Effect(
    "Dodge",
    "turnStart",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { target, diceType, who } }) => {
        if (canDodge(target) && g.canSee(target, who))
          diceType.add("disadvantage", DodgeEffect);
      });
      g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
        if (canDodge(who))
          diceType.add("advantage", DodgeEffect);
      });
    },
    { icon: DodgeIcon }
  );
  var DodgeAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Dodge",
        "implemented",
        {},
        {
          icon: DodgeIcon,
          time: "action",
          description: `When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated (as explained in the appendix) or if your speed drops to 0.`
        }
      );
    }
    async apply() {
      await super.apply({});
      await this.actor.addEffect(DodgeEffect, { duration: 1 });
    }
  };

  // src/events/ListChoiceEvent.ts
  var ListChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("ListChoice", { detail });
    }
  };

  // src/interruptions/PickFromListChoice.ts
  var PickFromListChoice = class {
    constructor(who, source, title, text, items, chosen, allowNone = false, priority2 = 10) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.items = items;
      this.chosen = chosen;
      this.allowNone = allowNone;
      this.priority = priority2;
    }
    async apply(g) {
      const choice = await new Promise(
        (resolve) => g.fire(new ListChoiceEvent({ interruption: this, resolve }))
      );
      if (choice)
        return this.chosen(choice);
    }
  };

  // src/resources.ts
  var ResourceRegistry = /* @__PURE__ */ new Map();
  var DawnResource = class {
    constructor(name, maximum) {
      this.name = name;
      this.maximum = maximum;
      ResourceRegistry.set(name, this);
      this.refresh = "dawn";
    }
  };
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

  // src/utils/config.ts
  function getConfigErrors(g, action, config) {
    const ec = g.check(action, config);
    for (const [key, resolver] of Object.entries(action.getConfig(config))) {
      const value = config[key];
      resolver.check(value, action, ec);
    }
    return ec;
  }
  function checkConfig(g, action, config) {
    return getConfigErrors(g, action, config).result;
  }

  // src/DndRules.ts
  var AbilityScoreRule = new DndRule("Ability Score", (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, ability, bonus } }) => {
      if (ability)
        bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g.events.on("BeforeCheck", ({ detail: { who, ability, bonus } }) => {
      bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
      if (ability)
        bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g.events.on("GatherDamage", ({ detail: { attacker, ability, bonus } }) => {
      if (ability)
        bonus.add(attacker[ability].modifier, AbilityScoreRule);
    });
    g.events.on("GetInitiative", ({ detail: { who, bonus } }) => {
      bonus.add(who.dex.modifier, AbilityScoreRule);
    });
    g.events.on("GetSaveDC", ({ detail: { type, bonus, who } }) => {
      if (type.type === "ability" && who)
        bonus.add(who[type.ability].modifier, AbilityScoreRule);
    });
  });
  var ArmorCalculationRule = new DndRule("Armor Calculation", (g) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
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
  var BlindedRule = new DndRule("Blinded", (g) => {
    g.events.on("CheckVision", ({ detail: { who, error } }) => {
      if (who.conditions.has("Blinded"))
        error.add("cannot see", BlindedRule);
    });
    g.events.on("BeforeCheck", ({ detail }) => {
      if (detail.who.conditions.has("Blinded") && detail.tags.has("sight"))
        detail.successResponse.add("fail", BlindedRule);
    });
    g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
      if (target.conditions.has("Blinded"))
        diceType.add("advantage", BlindedRule);
      if (who.conditions.has("Blinded"))
        diceType.add("disadvantage", BlindedRule);
    });
  });
  var CombatActionsRule = new DndRule("Combat Actions", (g) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      actions.push(new DashAction(g, who));
      actions.push(new DisengageAction(g, who));
      actions.push(new DodgeAction(g, who));
    });
  });
  var DifficultTerrainRule = new DndRule("Difficult Terrain", (g) => {
    const isDifficultTerrainAnywhere = (squares) => {
      for (const effect of g.effects) {
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
    g.events.on("GetMoveCost", ({ detail: { who, to, multiplier } }) => {
      const squares = getSquares(who, to);
      if (isDifficultTerrainAnywhere(squares))
        multiplier.add("double", DifficultTerrainRule);
    });
  });
  var EffectsRule = new DndRule("Effects", (g) => {
    g.events.on(
      "TurnStarted",
      ({ detail: { who } }) => who.tickEffects("turnStart")
    );
    g.events.on("TurnEnded", ({ detail: { who } }) => who.tickEffects("turnEnd"));
  });
  var ExhaustionRule = new DndRule("Exhaustion", (g) => {
    g.events.on("BeforeCheck", ({ detail: { who, diceType } }) => {
      if (who.exhaustion >= 1)
        diceType.add("disadvantage", ExhaustionRule);
    });
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.exhaustion >= 2)
        multiplier.add("half", ExhaustionRule);
      if (who.exhaustion >= 5)
        multiplier.add("zero", ExhaustionRule);
    });
    g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
      if (who.exhaustion >= 3)
        diceType.add("disadvantage", ExhaustionRule);
    });
    g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
      if (who.exhaustion >= 3)
        diceType.add("disadvantage", ExhaustionRule);
    });
    g.events.on("GetMaxHP", ({ detail: { who, multiplier } }) => {
      if (who.exhaustion >= 4)
        multiplier.add("half", ExhaustionRule);
    });
    g.events.on("Exhaustion", ({ detail: { who, interrupt } }) => {
      if (who.exhaustion >= 6)
        interrupt.add(
          new EvaluateLater(who, ExhaustionRule, async () => g.kill(who))
        );
    });
  });
  var IncapacitatedRule = new DndRule("Incapacitated", (g) => {
    g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
      if (action.actor.conditions.has("Incapacitated") && (action.isAttack || action.getTime(config)))
        error.add("incapacitated", IncapacitatedRule);
    });
  });
  var LongRangeAttacksRule = new DndRule("Long Range Attacks", (g) => {
    g.events.on(
      "BeforeAttack",
      ({ detail: { who, target, weapon, diceType } }) => {
        if (typeof (weapon == null ? void 0 : weapon.shortRange) === "number" && distance(g, who, target) > weapon.shortRange)
          diceType.add("disadvantage", LongRangeAttacksRule);
      }
    );
  });
  var ObscuredRule = new DndRule("Obscured", (g) => {
    const isHeavilyObscuredAnywhere = (squares) => {
      for (const effect of g.effects) {
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
    g.events.on("BeforeAttack", ({ detail: { diceType, target } }) => {
      const squares = getSquares(target, g.getState(target).position);
      if (isHeavilyObscuredAnywhere(squares))
        diceType.add("disadvantage", ObscuredRule);
    });
    g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
      const squares = getSquares(who, g.getState(who).position);
      if (isHeavilyObscuredAnywhere(squares))
        conditions.add("Blinded", ObscuredRule);
    });
  });
  var OneAttackPerTurnRule = new DndRule("Attacks per turn", (g) => {
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.isAttack && action.actor.attacksSoFar.length)
        error.add("No attacks left", OneAttackPerTurnRule);
    });
  });
  function getValidOpportunityAttacks(g, attacker, position, target, from, to) {
    const { oldDistance, newDistance } = compareDistances(
      attacker,
      position,
      target,
      from,
      to
    );
    return attacker.weapons.filter((weapon) => weapon.rangeCategory === "melee").filter((weapon) => {
      const range = attacker.reach + weapon.reach;
      return oldDistance <= range && newDistance > range;
    }).map((weapon) => new OpportunityAttack(g, attacker, weapon)).filter((opportunity) => checkConfig(g, opportunity, { target }));
  }
  var OpportunityAttacksRule = new DndRule(
    "Opportunity Attacks",
    (g) => {
      g.events.on(
        "BeforeMove",
        ({ detail: { handler, who, from, to, interrupt } }) => {
          if (!handler.provokesOpportunityAttacks)
            return;
          for (const [attacker, { position }] of g.combatants) {
            if (attacker.side === who.side)
              continue;
            const validActions = getValidOpportunityAttacks(
              g,
              attacker,
              position,
              who,
              from,
              to
            );
            if (validActions.length)
              interrupt.add(
                new PickFromListChoice(
                  attacker,
                  OpportunityAttacksRule,
                  "Opportunity Attack",
                  `${who.name} is moving out of ${attacker.name}'s reach. Make an opportunity attack?`,
                  validActions.map((value) => ({
                    label: value.weapon.name,
                    value
                  })),
                  async (opportunity) => {
                    await g.act(opportunity, { target: who });
                  },
                  true
                )
              );
          }
        }
      );
    }
  );
  var autoFail = (condition, rule, abilities) => ({ detail: { ability, who, successResponse } }) => {
    if (who.conditions.has(condition) && ability && abilities.includes(ability))
      successResponse.add("fail", rule);
  };
  var autoCrit = (g, condition, rule, maxRange = 5) => ({ detail }) => {
    const { who, target } = detail.pre;
    if (target.conditions.has(condition) && distance(g, who, target) <= maxRange && detail.outcome === "hit") {
      detail.forced = true;
      detail.outcome = "critical";
    }
  };
  var ParalyzedRule = new DndRule("Paralyzed", (g) => {
    g.events.on("BeforeMove", ({ detail: { who, error } }) => {
      if (who.conditions.has("Paralyzed"))
        error.add("paralyzed", ParalyzedRule);
    });
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.actor.conditions.has("Paralyzed") && action.vocal)
        error.add("paralyzed", ParalyzedRule);
    });
    g.events.on(
      "BeforeSave",
      autoFail("Paralyzed", ParalyzedRule, ["str", "dex"])
    );
    g.events.on("BeforeAttack", ({ detail }) => {
      if (detail.target.conditions.has("Paralyzed"))
        detail.diceType.add("advantage", ParalyzedRule);
    });
    g.events.on("Attack", autoCrit(g, "Paralyzed", ParalyzedRule));
  });
  var PoisonedRule = new DndRule("Poisoned", (g) => {
    const poisonCheck = ({
      detail: { who, diceType }
    }) => {
      if (who.conditions.has("Poisoned"))
        diceType.add("disadvantage", PoisonedRule);
    };
    g.events.on("BeforeAttack", poisonCheck);
    g.events.on("BeforeCheck", poisonCheck);
  });
  var ProficiencyRule = new DndRule("Proficiency", (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, bonus, spell, weapon } }) => {
      const mul = weapon ? who.getProficiencyMultiplier(weapon) : spell ? 1 : 0;
      bonus.add(who.pb * mul, ProficiencyRule);
    });
    g.events.on("BeforeCheck", ({ detail: { who, skill, bonus } }) => {
      if (skill) {
        const mul = who.getProficiencyMultiplier(skill);
        bonus.add(who.pb * mul, ProficiencyRule);
      }
    });
    g.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
      if (ability) {
        const mul = who.getProficiencyMultiplier(ability);
        bonus.add(who.pb * mul, ProficiencyRule);
      }
    });
    g.events.on("GetSaveDC", ({ detail: { type, bonus, who } }) => {
      if (type.type === "ability" && who)
        bonus.add(who.pb, ProficiencyRule);
    });
  });
  var ResourcesRule = new DndRule("Resources", (g) => {
    g.events.on("TurnStarted", ({ detail: { who } }) => {
      for (const name of who.resources.keys()) {
        const resource = ResourceRegistry.get(name);
        if ((resource == null ? void 0 : resource.refresh) === "turnStart")
          who.refreshResource(resource);
      }
    });
  });
  var RestrainedRule = new DndRule("Restrained", (g) => {
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.conditions.has("Restrained"))
        multiplier.add("zero", RestrainedRule);
    });
    g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
      if (target.conditions.has("Restrained"))
        diceType.add("advantage", RestrainedRule);
      if (who.conditions.has("Restrained"))
        diceType.add("disadvantage", RestrainedRule);
    });
    g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      if (who.conditions.has("Restrained") && ability === "dex")
        diceType.add("disadvantage", RestrainedRule);
    });
  });
  var StunnedRule = new DndRule("Stunned", (g) => {
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.conditions.has("Stunned"))
        multiplier.add("zero", StunnedRule);
    });
    g.events.on("BeforeSave", autoFail("Stunned", StunnedRule, ["str", "dex"]));
    g.events.on("BeforeAttack", ({ detail: { diceType, target } }) => {
      if (target.conditions.has("Stunned"))
        diceType.add("advantage", StunnedRule);
    });
  });
  var TurnTimeRule = new DndRule("Turn Time", (g) => {
    g.events.on("TurnStarted", ({ detail: { who } }) => who.resetTime());
  });
  var UnconsciousRule = new DndRule("Unconscious", (g) => {
    g.events.on(
      "BeforeSave",
      autoFail("Unconscious", UnconsciousRule, ["str", "dex"])
    );
    g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
      if (target.conditions.has("Unconscious"))
        diceType.add("advantage", UnconsciousRule);
    });
    g.events.on("Attack", autoCrit(g, "Unconscious", UnconsciousRule));
  });
  var WeaponAttackRule = new DndRule("Weapon Attacks", (g) => {
    g.events.on("GetActions", ({ detail: { who, target, actions } }) => {
      if (who !== target) {
        for (const weapon of who.weapons) {
          if (weapon.ammunitionTag) {
            for (const ammo of getValidAmmunition(who, weapon)) {
              actions.push(new WeaponAttack(g, who, weapon, ammo));
            }
          } else
            actions.push(new WeaponAttack(g, who, weapon));
        }
      }
    });
  });
  var DndRules = class {
    constructor(g) {
      this.g = g;
      for (const rule of RuleRepository)
        rule.setup(g);
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

  // src/events/CheckVisionEvent.ts
  var CheckVisionEvent = class extends CustomEvent {
    constructor(detail) {
      super("CheckVision", { detail });
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
      this.taps = /* @__PURE__ */ new Set();
    }
    tap(listener) {
      this.taps.add(listener);
      return () => this.taps.delete(listener);
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
      const cleanup = () => this.off(type, callback);
      for (const tap of this.taps)
        tap(cleanup);
      return cleanup;
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

  // src/events/GetSaveDCEvent.ts
  var GetSaveDCEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetSaveDC", { detail });
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

  // src/events/TurnSkippedEvent.ts
  var TurnSkippedEvent = class extends CustomEvent {
    constructor(detail) {
      super("TurnSkipped", { detail });
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
    constructor(who, source, title, text, yes, no, priority2 = 10) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.yes = yes;
      this.no = no;
      this.priority = priority2;
    }
    async apply(g) {
      var _a, _b;
      const choice = await new Promise(
        (resolve) => g.fire(new YesNoChoiceEvent({ interruption: this, resolve }))
      );
      if (choice)
        await ((_a = this.yes) == null ? void 0 : _a.call(this));
      else
        await ((_b = this.no) == null ? void 0 : _b.call(this));
      return choice;
    }
  };

  // src/types/SaveTag.ts
  var svSet = (...items) => new Set(items);

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
    async start() {
      for (const [c, cs] of this.combatants) {
        c.finalise();
        cs.initiative = await this.rollInitiative(c);
      }
      this.initiativeOrder = orderedKeys(
        this.combatants,
        ([, a], [, b]) => b.initiative - a.initiative
      );
      await this.resolve(
        new BattleStartedEvent({ interrupt: new InterruptionCollector() })
      );
      await this.nextTurn();
    }
    async rollMany(count, e, critical = false) {
      const rolls = await Promise.all(
        Array(count * (critical ? 2 : 1)).fill(null).map(async () => await this.roll(e))
      );
      return rolls.reduce((acc, roll) => acc + roll.value, 0);
    }
    async rollDamage(count, e, critical = false) {
      return this.rollMany(count, { ...e, type: "damage" }, critical);
    }
    async rollHeal(count, e, critical = false) {
      return this.rollMany(count, { ...e, type: "heal" }, critical);
    }
    async rollInitiative(who) {
      const gi = await this.resolve(
        new GetInitiativeEvent({
          who,
          bonus: new BonusCollector(),
          diceType: new DiceTypeCollector(),
          interrupt: new InterruptionCollector()
        })
      );
      const roll = await this.roll(
        { type: "initiative", who },
        gi.detail.diceType.result
      );
      return roll.value + gi.detail.bonus.result;
    }
    async savingThrow(dc, e, { save, fail } = {
      save: "half",
      fail: "normal"
    }) {
      const successResponse = new SuccessResponseCollector();
      const bonus = new BonusCollector();
      const diceType = new DiceTypeCollector();
      const saveDamageResponse = new SaveDamageResponseCollector(save);
      const failDamageResponse = new SaveDamageResponseCollector(fail);
      const pre = await this.resolve(
        new BeforeSaveEvent({
          ...e,
          dc,
          bonus,
          diceType,
          successResponse,
          saveDamageResponse,
          failDamageResponse,
          interrupt: new InterruptionCollector()
        })
      );
      let forced = false;
      let success = false;
      const roll = await this.roll({ type: "save", ...e }, diceType.result);
      const total = roll.value + bonus.result;
      if (successResponse.result !== "normal") {
        success = successResponse.result === "success";
        forced = true;
      } else {
        success = total >= dc;
      }
      const outcome = success ? "success" : "fail";
      this.fire(
        new SaveEvent({
          pre: pre.detail,
          diceType: diceType.result,
          roll,
          dc,
          outcome,
          total,
          forced
        })
      );
      return {
        roll,
        outcome,
        forced,
        damageResponse: success ? saveDamageResponse.result : failDamageResponse.result
      };
    }
    async abilityCheck(dc, e) {
      const successResponse = new SuccessResponseCollector();
      const bonus = new BonusCollector();
      const diceType = new DiceTypeCollector();
      const pre = await this.resolve(
        new BeforeCheckEvent({
          ...e,
          dc,
          bonus,
          diceType,
          successResponse,
          interrupt: new InterruptionCollector()
        })
      );
      let forced = false;
      let success = false;
      const roll = await this.roll({ type: "check", ...e }, diceType.result);
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
          diceType: diceType.result,
          roll,
          dc,
          outcome,
          total,
          forced
        })
      );
      return { outcome, forced };
    }
    async roll(type, diceType = "normal") {
      const roll = this.dice.roll(type, diceType);
      return (await this.resolve(
        new DiceRolledEvent({
          type,
          diceType,
          ...roll,
          interrupt: new InterruptionCollector()
        })
      )).detail;
    }
    async nextTurn() {
      if (this.activeCombatant)
        await this.resolve(
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
        if (!who.conditions.has("Unconscious"))
          scan = false;
        else {
          who.tickEffects("turnStart");
          await this.resolve(
            new TurnSkippedEvent({ who, interrupt: new InterruptionCollector() })
          );
          who.tickEffects("turnEnd");
        }
      }
      this.activeCombatant = who;
      who.attacksSoFar = [];
      who.movedSoFar = 0;
      await this.resolve(
        new TurnStartedEvent({ who, interrupt: new InterruptionCollector() })
      );
    }
    async moveInDirection(who, direction, handler, type = "speed") {
      const state = this.getState(who);
      const old = state.position;
      const position = movePoint(old, direction);
      return this.move(who, position, handler, type);
    }
    async move(who, position, handler, type = "speed") {
      const state = this.getState(who);
      const old = state.position;
      const error = new ErrorCollector();
      const pre = await this.resolve(
        new BeforeMoveEvent({
          who,
          from: old,
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
          to: position,
          handler,
          type,
          multiplier
        })
      );
      state.position = position;
      const handlerDone = handler.onMove(who, multiplier.result * MapSquareSize);
      await this.resolve(
        new CombatantMovedEvent({
          who,
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
    }
    async applyDamage(damage, {
      attack,
      attacker,
      multiplier: baseMultiplier = 1,
      target
    }) {
      const { total, healAmount, breakdown } = this.calculateDamage(
        damage,
        target,
        baseMultiplier,
        attack
      );
      if (healAmount > 0) {
        await this.applyHeal(target, healAmount, target);
      }
      if (total < 1)
        return;
      const { takenByTemporaryHP, afterTemporaryHP, temporaryHPSource } = this.applyTemporaryHP(target, total);
      await this.resolve(
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
        await this.handleCombatantDeath(target, attacker);
      } else if (target.concentratingOn.size) {
        await this.handleConcentrationCheck(target, total);
      }
    }
    calculateDamage(damage, target, baseMultiplier, attack) {
      let total = 0;
      let healAmount = 0;
      const breakdown = /* @__PURE__ */ new Map();
      for (const [damageType, raw] of damage) {
        const { response, amount } = this.calculateDamageResponse(
          damageType,
          raw,
          target,
          baseMultiplier,
          attack
        );
        if (response === "absorb") {
          healAmount += raw;
        } else {
          total += amount;
        }
        breakdown.set(damageType, { response, raw, amount });
      }
      return { total, healAmount, breakdown };
    }
    calculateDamageResponse(damageType, raw, target, baseMultiplier, attack) {
      const collector = new DamageResponseCollector();
      const innateResponse = target.damageResponses.get(damageType);
      if (innateResponse) {
        collector.add(innateResponse, target);
      }
      this.fire(
        new GetDamageResponseEvent({
          attack,
          who: target,
          damageType,
          response: collector
        })
      );
      const { response, amount } = this.calculateDamageAmount(
        raw,
        collector.result,
        baseMultiplier
      );
      return { response, amount };
    }
    calculateDamageAmount(raw, response, baseMultiplier) {
      let amount = raw;
      if (response === "absorb" || response === "immune") {
        amount = 0;
      } else {
        let multiplier = baseMultiplier;
        if (response === "resist") {
          multiplier *= 0.5;
        } else if (response === "vulnerable") {
          multiplier *= 2;
        }
        amount = Math.ceil(raw * multiplier);
      }
      return { response, amount };
    }
    applyTemporaryHP(target, totalDamage) {
      const takenByTemporaryHP = Math.min(totalDamage, target.temporaryHP);
      target.temporaryHP -= takenByTemporaryHP;
      const afterTemporaryHP = totalDamage - takenByTemporaryHP;
      target.hp -= afterTemporaryHP;
      const temporaryHPSource = target.temporaryHPSource;
      if (target.temporaryHP <= 0) {
        target.temporaryHPSource = void 0;
      }
      return { takenByTemporaryHP, afterTemporaryHP, temporaryHPSource };
    }
    async handleCombatantDeath(target, attacker) {
      await target.endConcentration();
      if (target.diesAtZero || target.hp <= -target.hpMax) {
        await this.kill(target, attacker);
      } else if (!target.hasEffect(Dying)) {
        target.hp = 0;
        await target.removeEffect(Stable);
        await target.addEffect(Dying, { duration: Infinity });
      } else {
        target.hp = 0;
        await this.failDeathSave(target);
      }
    }
    async handleConcentrationCheck(target, totalDamage) {
      const dc = Math.max(10, Math.floor(totalDamage / 2));
      const result = await this.savingThrow(dc, {
        attacker: target,
        who: target,
        ability: "con",
        tags: svSet("concentration")
      });
      if (result.outcome === "fail") {
        target.endConcentration();
      }
    }
    async kill(target, attacker) {
      this.combatants.delete(target);
      await target.addEffect(Dead, { duration: Infinity });
      this.fire(new CombatantDiedEvent({ who: target, attacker }));
    }
    async failDeathSave(who, count = 1, attacker) {
      who.deathSaveFailures += count;
      if (who.deathSaveFailures >= 3)
        await this.kill(who, attacker);
    }
    async succeedDeathSave(who) {
      who.deathSaveSuccesses++;
      if (who.deathSaveSuccesses >= 3) {
        await who.removeEffect(Dying);
        who.deathSaveFailures = 0;
        who.deathSaveSuccesses = 0;
        await who.addEffect(Stable, { duration: Infinity });
      }
    }
    getAttackOutcome(ac, roll, total) {
      return roll === 1 ? "miss" : roll === 20 ? "critical" : total >= ac ? "hit" : "miss";
    }
    async attack(e) {
      const pre = await this.resolve(
        new BeforeAttackEvent({
          ...e,
          diceType: new DiceTypeCollector(),
          bonus: new BonusCollector(),
          interrupt: new InterruptionCollector(),
          success: new SuccessResponseCollector()
        })
      );
      if (pre.detail.success.result === "fail")
        return { outcome: "cancelled", hit: false };
      const ac = await this.getAC(e.target, pre.detail);
      const roll = await this.roll(
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
      const attack = await this.resolve(
        new AttackEvent({
          pre: pre.detail,
          roll,
          total,
          ac,
          outcome: this.getAttackOutcome(ac, roll.value, total),
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
    }
    async damage(source, damageType, e, damageInitialiser = [], startingMultiplier) {
      if (startingMultiplier === "zero")
        return;
      const map = new DamageMap(damageInitialiser);
      const multiplier = new MultiplierCollector();
      if (typeof startingMultiplier !== "undefined")
        multiplier.add(startingMultiplier, source);
      const gather = await this.resolve(
        new GatherDamageEvent({
          critical: false,
          ...e,
          map,
          bonus: new BonusCollector(),
          interrupt: new InterruptionCollector(),
          multiplier
        })
      );
      map.add(damageType, gather.detail.bonus.result);
      return this.applyDamage(map, {
        source,
        attack: e.attack,
        attacker: e.attacker,
        target: e.target,
        multiplier: multiplier.result
      });
    }
    /** @deprecated use `checkConfig` or `getConfigErrors` instead */
    check(action, config) {
      const error = new ErrorCollector();
      this.fire(new CheckActionEvent({ action, config, error }));
      action.check(config, error);
      return error;
    }
    async act(action, config) {
      await action.apply(config);
      return this.resolve(
        new AfterActionEvent({
          action,
          config,
          interrupt: new InterruptionCollector()
        })
      );
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
    async getAC(who, pre) {
      const method = this.getBestACMethod(who);
      const e = await this.resolve(
        new GetACEvent({
          who,
          method,
          bonus: new BonusCollector(),
          interrupt: new InterruptionCollector(),
          pre
        })
      );
      return method.ac + e.detail.bonus.result;
    }
    fire(e) {
      if (e.detail.interrupt)
        throw new Error(
          `Use Engine.resolve() on an interruptible event type: ${e.type}`
        );
      this.events.fire(e);
      return e;
    }
    async resolve(e) {
      this.events.fire(e);
      for (const interruption of e.detail.interrupt)
        await interruption.apply(this);
      return e;
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
    getInside(area, ignore = []) {
      const points = resolveArea(area);
      const inside = [];
      for (const [combatant, state] of this.combatants) {
        if (ignore.includes(combatant))
          continue;
        const squares = new PointSet(getSquares(combatant, state.position));
        if (points.overlaps(squares))
          inside.push(combatant);
      }
      return inside;
    }
    async applyBoundedMove(who, handler) {
      return new Promise(
        (resolve) => this.fire(new BoundedMoveEvent({ who, handler, resolve }))
      );
    }
    async heal(source, amount, e, startingMultiplier) {
      const bonus = new BonusCollector();
      bonus.add(amount, source);
      const multiplier = new MultiplierCollector();
      if (typeof startingMultiplier !== "undefined")
        multiplier.add(startingMultiplier, source);
      const gather = await this.resolve(
        new GatherHealEvent({
          ...e,
          bonus,
          multiplier,
          interrupt: new InterruptionCollector()
        })
      );
      const total = bonus.result * multiplier.result;
      return this.applyHeal(gather.detail.target, total, gather.detail.actor);
    }
    async applyHeal(who, fullAmount, actor) {
      const amount = Math.min(fullAmount, who.hpMax - who.hp);
      who.hp += amount;
      return this.resolve(
        new CombatantHealedEvent({
          who,
          actor,
          amount,
          fullAmount,
          interrupt: new InterruptionCollector()
        })
      );
    }
    async giveTemporaryHP(who, count, source) {
      var _a;
      if (who.temporaryHP > 0)
        return new YesNoChoice(
          who,
          source,
          `Replace Temporary HP?`,
          `${who.name} already has ${who.temporaryHP} temporary HP from ${(_a = who.temporaryHPSource) == null ? void 0 : _a.name}. Replace with ${count} temporary HP from ${source.name}?`,
          async () => this.setTemporaryHP(who, count, source)
        ).apply(this);
      this.setTemporaryHP(who, count, source);
      return true;
    }
    setTemporaryHP(who, count, source) {
      who.temporaryHP = count;
      who.temporaryHPSource = source;
    }
    canSee(who, target) {
      return this.fire(
        new CheckVisionEvent({ who, target, error: new ErrorCollector() })
      ).detail.error.result;
    }
    async getSaveDC(e) {
      const bonus = new BonusCollector();
      const interrupt = new InterruptionCollector();
      switch (e.type.type) {
        case "ability":
          bonus.add(8, e.source);
          break;
        case "flat":
          bonus.add(e.type.dc, e.source);
          break;
      }
      const result = await this.resolve(
        new GetSaveDCEvent({ ...e, bonus, interrupt })
      );
      return result.detail;
    }
    async save({
      source,
      type,
      attacker,
      who,
      ability,
      spell,
      method,
      effect,
      config,
      tags,
      save = "half",
      fail = "normal"
    }) {
      const dcRoll = await this.getSaveDC({
        type,
        source,
        who: attacker,
        target: who,
        ability,
        spell,
        method
      });
      const result = await this.savingThrow(
        dcRoll.bonus.result,
        {
          who,
          attacker,
          ability,
          spell,
          method,
          effect,
          config,
          tags: new Set(tags)
        },
        { save, fail }
      );
      return { ...result, dcRoll };
    }
  };

  // src/img/act/eldritch-burst.svg
  var eldritch_burst_default = "./eldritch-burst-CNPKMEMY.svg";

  // src/img/spl/counterspell.svg
  var counterspell_default = "./counterspell-M3AYEKY7.svg";

  // src/img/spl/hellish-rebuke.svg
  var hellish_rebuke_default = "./hellish-rebuke-LKQR2ION.svg";

  // src/img/tok/boss/birnotec.png
  var birnotec_default = "./birnotec-JGKE3FD4.png";

  // src/features/SimpleFeature.ts
  var SimpleFeature = class {
    constructor(name, text, setup) {
      this.name = name;
      this.text = text;
      this.setup = setup;
    }
  };

  // src/Monster.ts
  var Monster = class extends AbstractCombatant {
    constructor(g, name, cr, type, size, img, hpMax) {
      super(g, name, {
        type,
        size,
        img,
        side: 1,
        hpMax
      });
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
    getSaveType() {
      return { type: "ability", ability: this.ability };
    }
  };

  // src/img/spl/armor-of-agathys.svg
  var armor_of_agathys_default = "./armor-of-agathys-JEP4EVNV.svg";

  // src/utils/time.ts
  var TURNS_PER_MINUTE = 10;
  var minutes = (n) => n * TURNS_PER_MINUTE;
  var hours = (n) => minutes(n * 60);

  // src/spells/level1/ArmorOfAgathys.ts
  var ArmorOfAgathysIcon = makeIcon(armor_of_agathys_default, DamageColours.cold);
  var ArmorOfAgathysEffect = new Effect(
    "Armor of Agathys",
    "turnStart",
    (g) => {
      g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
        const config = pre.target.getEffectConfig(ArmorOfAgathysEffect);
        if (config && pre.target.temporaryHPSource === ArmorOfAgathysEffect && pre.tags.has("melee"))
          interrupt.add(
            new EvaluateLater(pre.who, ArmorOfAgathysEffect, async () => {
              await g.damage(
                ArmorOfAgathysEffect,
                "cold",
                { attacker: pre.target, target: pre.who },
                [["cold", config.count]]
              );
            })
          );
      });
      g.events.on(
        "CombatantDamaged",
        ({ detail: { who, temporaryHPSource, interrupt } }) => {
          if (temporaryHPSource === ArmorOfAgathysEffect && who.temporaryHP <= 0)
            interrupt.add(
              new EvaluateLater(who, ArmorOfAgathysEffect, async () => {
                await who.removeEffect(ArmorOfAgathysEffect);
              })
            );
        }
      );
    },
    { icon: ArmorOfAgathysIcon }
  );
  var ArmorOfAgathys = scalingSpell({
    status: "implemented",
    name: "Armor of Agathys",
    icon: ArmorOfAgathysIcon,
    level: 1,
    school: "Abjuration",
    v: true,
    s: true,
    m: "a cup of water",
    lists: ["Warlock"],
    description: `A protective magical force surrounds you, manifesting as a spectral frost that covers you and your gear. You gain 5 temporary hit points for the duration. If a creature hits you with a melee attack while you have these hit points, the creature takes 5 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, both the temporary hit points and the cold damage increase by 5 for each slot level above 1st.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method, { slot }) {
      const count = slot * 5;
      if (await g.giveTemporaryHP(caster, count, ArmorOfAgathysEffect)) {
        const duration = hours(1);
        await caster.addEffect(ArmorOfAgathysEffect, { count, duration }, caster);
      }
    }
  });
  var ArmorOfAgathys_default = ArmorOfAgathys;

  // src/types/AttackTag.ts
  var atSet = (...items) => new Set(items);

  // src/spells/SpellAttack.ts
  var SpellAttack = class {
    constructor(g, caster, spell, method, type, config) {
      this.g = g;
      this.caster = caster;
      this.spell = spell;
      this.method = method;
      this.type = type;
      this.config = config;
    }
    async attack(target) {
      const { caster: who, method, spell, type } = this;
      this.attackResult = await this.g.attack({
        who,
        target,
        ability: method.ability,
        tags: atSet(type, "spell", "magical"),
        spell,
        method
      });
      return this.attackResult;
    }
    async getDamage(target) {
      if (!this.attackResult)
        throw new Error("Run .attack() first");
      const { critical } = this.attackResult;
      const { g, caster: attacker, config, method, spell } = this;
      const damage = spell.getDamage(g, attacker, method, config);
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
            const roll = await g.rollDamage(
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
    }
    async damage(target, initialiser) {
      if (!this.attackResult)
        throw new Error("Run .attack() first");
      const { attack, critical, hit } = this.attackResult;
      if (!hit)
        return;
      const { g, baseDamageType, caster: attacker, method, spell } = this;
      if (!baseDamageType)
        throw new Error("Run .getDamage() first");
      return g.damage(
        spell,
        baseDamageType,
        { attack, attacker, target, critical, spell, method },
        initialiser
      );
    }
  };

  // src/types/CheckTag.ts
  var chSet = (...items) => new Set(items);

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

  // src/monsters/fiendishParty/Birnotec.ts
  var getEldritchBurstArea = (g, target) => ({
    type: "within",
    radius: 5,
    target,
    position: g.getState(target).position
  });
  var BurstIcon = makeIcon(eldritch_burst_default, DamageColours.force);
  var EldritchBurstSpell = simpleSpell({
    status: "implemented",
    name: "Eldritch Burst",
    icon: BurstIcon,
    level: 0,
    school: "Evocation",
    lists: ["Warlock"],
    description: `Make a ranged spell attack against the target. On a hit, the target takes 2d10 force damage. All other creatures within 5 ft. must make a Dexterity save or take 1d10 force damage.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 120, [isEnemy]) }),
    getAffectedArea: (g, caster, { target }) => target && [getEldritchBurstArea(g, target)],
    getDamage: () => [_dd(2, 10, "force")],
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
      const rsa = new SpellAttack(
        g,
        caster,
        EldritchBurstSpell,
        BirnotecSpellcasting,
        "ranged",
        { target }
      );
      const attack = await rsa.attack(target);
      if (attack.outcome === "cancelled")
        return;
      if (attack.hit) {
        const damage2 = await rsa.getDamage(target);
        await rsa.damage(target, damage2);
      }
      const damage = await g.rollDamage(
        1,
        { size: 10, source: this, attacker: caster, damageType: "force" },
        attack.critical
      );
      for (const other of g.getInside(getEldritchBurstArea(g, target))) {
        if (other === target)
          continue;
        const { damageResponse } = await g.save({
          source: EldritchBurstSpell,
          type: { type: "flat", dc: 15 },
          attacker: caster,
          who: other,
          ability: "dex",
          spell: EldritchBurstSpell,
          method,
          fail: "normal",
          save: "zero"
        });
        await g.damage(
          this,
          "force",
          { attacker: caster, target: other, spell: EldritchBurstSpell, method },
          [["force", damage]],
          damageResponse
        );
      }
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
    (g, me) => {
      me.spellcastingMethods.add(BirnotecSpellcasting);
      me.preparedSpells.add(EldritchBurstSpell);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new CastSpell(g, me, BirnotecSpellcasting, EldritchBurstSpell)
          );
      });
    }
  );
  var ArmorOfAgathys2 = new SimpleFeature(
    "Armor of Agathys",
    `Birnotec has 15 temporary hit points. While these persist, any creature that hits him in melee takes 15 cold damage.`,
    (g, me) => {
      g.events.on("BattleStarted", ({ detail: { interrupt } }) => {
        interrupt.add(
          new EvaluateLater(me, ArmorOfAgathys2, async () => {
            await ArmorOfAgathys_default.apply(g, me, BirnotecSpellcasting, {
              slot: 3
            });
          })
        );
      });
    }
  );
  var AntimagicIcon = makeIcon(counterspell_default);
  var AntimagicProdigyAction = class extends AbstractAction {
    constructor(g, actor, dc, success) {
      super(
        g,
        actor,
        "Antimagic Prodigy",
        "implemented",
        { target: new TargetResolver(g, Infinity, [isEnemy]) },
        {
          time: "reaction",
          icon: AntimagicIcon,
          description: `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`
        }
      );
      this.dc = dc;
      this.success = success;
    }
    async apply({ target }) {
      await super.apply({ target });
      const { g, actor, dc, success } = this;
      const save = await g.abilityCheck(dc, {
        who: target,
        attacker: actor,
        skill: "Arcana",
        ability: "int",
        tags: chSet("counterspell")
      });
      if (save.outcome === "fail")
        success.add("fail", AntimagicProdigy);
    }
  };
  var AntimagicProdigy = new SimpleFeature(
    "Antimagic Prodigy",
    `When an enemy casts a spell, Birnotec forces them to make a DC 15 Arcana check or lose the spell.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new AntimagicProdigyAction(g, me, 15, new SuccessResponseCollector())
          );
      });
      g.events.on(
        "SpellCast",
        ({ detail: { who: target, interrupt, success } }) => {
          const action = new AntimagicProdigyAction(g, me, 15, success);
          const config = { target };
          if (checkConfig(g, action, config))
            interrupt.add(
              new YesNoChoice(
                me,
                AntimagicProdigy,
                "Antimagic Prodigy",
                `Use ${me.name}'s reaction to attempt to counter the spell?`,
                async () => {
                  await g.act(action, config);
                }
              )
            );
        }
      );
    }
  );
  var RebukeIcon = makeIcon(hellish_rebuke_default, DamageColours.fire);
  var HellishRebukeAction = class extends AbstractAction {
    constructor(g, actor, dc) {
      super(
        g,
        actor,
        "Hellish Rebuke",
        "implemented",
        { target: new TargetResolver(g, Infinity, [isEnemy]) },
        {
          time: "reaction",
          icon: RebukeIcon,
          description: `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`
        }
      );
      this.dc = dc;
    }
    async apply({ target }) {
      await super.apply({ target });
      const { g, actor: attacker, dc } = this;
      const damage = await g.rollDamage(2, {
        source: HellishRebuke,
        size: 10,
        attacker,
        target,
        damageType: "fire"
      });
      const { damageResponse } = await g.save({
        source: HellishRebuke,
        type: { type: "flat", dc },
        who: target,
        attacker,
        ability: "dex"
      });
      await g.damage(
        HellishRebuke,
        "fire",
        { attacker, target },
        [["fire", damage]],
        damageResponse
      );
    }
  };
  var HellishRebuke = new SimpleFeature(
    "Hellish Rebuke",
    `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new HellishRebukeAction(g, me, 15));
      });
      g.events.on(
        "CombatantDamaged",
        ({ detail: { who, attacker, interrupt } }) => {
          if (who === me) {
            const action = new HellishRebukeAction(g, me, 15);
            const config = { target: attacker };
            if (checkConfig(g, action, config))
              interrupt.add(
                new YesNoChoice(
                  me,
                  HellishRebuke,
                  "Hellish Rebuke",
                  `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
                  async () => {
                    await g.act(action, config);
                  }
                )
              );
          }
        }
      );
    }
  );
  var Birnotec = class extends Monster {
    constructor(g) {
      super(g, "Birnotec", 5, "humanoid", "medium", birnotec_default, 35);
      this.diesAtZero = false;
      this.movement.set("speed", 30);
      this.setAbilityScores(6, 15, 8, 12, 13, 20);
      this.pb = 3;
      this.saveProficiencies.add("wis");
      this.saveProficiencies.add("cha");
      this.skills.set("Arcana", 1);
      this.skills.set("Nature", 1);
      this.damageResponses.set("poison", "immune");
      this.conditionImmunities.add("Poisoned");
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.addFeature(ArmorOfAgathys2);
      this.addFeature(EldritchBurst);
      this.addFeature(AntimagicProdigy);
      this.addFeature(HellishRebuke);
    }
  };

  // src/img/act/wreathed-in-shadow.svg
  var wreathed_in_shadow_default = "./wreathed-in-shadow-DFCHPKIO.svg";

  // src/img/tok/boss/kay.png
  var kay_default = "./kay-LUSXSSD5.png";

  // src/classes/rogue/Evasion.ts
  var Evasion = new SimpleFeature(
    "Evasion",
    `Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`,
    (g, me) => {
      g.events.on(
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

  // src/img/eq/arrow.svg
  var arrow_default = "./arrow-ZFSXM2J5.svg";

  // src/img/eq/bolt.svg
  var bolt_default = "./bolt-RV5OQWXW.svg";

  // src/items/AbstractItem.ts
  var AbstractItem = class {
    constructor(g, itemType, name, hands = 0, iconUrl) {
      this.g = g;
      this.itemType = itemType;
      this.name = name;
      this.hands = hands;
      this.iconUrl = iconUrl;
      this.enchantments = /* @__PURE__ */ new Set();
      this.rarity = "Common";
    }
    get icon() {
      if (this.iconUrl)
        return { url: this.iconUrl, colour: ItemRarityColours[this.rarity] };
    }
    addEnchantment(e) {
      this.enchantments.add(e);
      e.setup(this.g, this);
    }
  };

  // src/items/ammunition.ts
  var AbstractAmmo = class extends AbstractItem {
    constructor(g, name, ammunitionTag, quantity, iconUrl) {
      super(g, "ammo", name, 0, iconUrl);
      this.ammunitionTag = ammunitionTag;
      this.quantity = quantity;
    }
  };
  var Arrow = class extends AbstractAmmo {
    constructor(g, quantity) {
      super(g, "arrow", "bow", quantity, arrow_default);
    }
  };
  var CrossbowBolt = class extends AbstractAmmo {
    constructor(g, quantity) {
      super(g, "crossbow bolt", "crossbow", quantity, bolt_default);
    }
  };

  // src/items/armor.ts
  var AbstractArmor = class extends AbstractItem {
    constructor(g, name, category, ac, stealthDisadvantage = false, minimumStrength = 0, iconUrl) {
      super(g, "armor", name, 0, iconUrl);
      this.category = category;
      this.ac = ac;
      this.stealthDisadvantage = stealthDisadvantage;
      this.minimumStrength = minimumStrength;
    }
  };
  var LeatherArmor = class extends AbstractArmor {
    constructor(g) {
      super(g, "leather armor", "light", 11);
    }
  };
  var StuddedLeatherArmor = class extends AbstractArmor {
    constructor(g) {
      super(g, "studded leather armor", "light", 12);
    }
  };
  var HideArmor = class extends AbstractArmor {
    constructor(g) {
      super(g, "hide armor", "medium", 12);
    }
  };
  var ScaleMailArmor = class extends AbstractArmor {
    constructor(g) {
      super(g, "scale mail armor", "medium", 14, true);
    }
  };
  var SplintArmor = class extends AbstractArmor {
    constructor(g) {
      super(g, "splint armor", "heavy", 17, true, 15);
    }
  };
  var Shield = class extends AbstractArmor {
    constructor(g) {
      super(g, "shield", "shield", 2);
      this.hands = 1;
    }
  };

  // src/img/eq/greataxe.svg
  var greataxe_default = "./greataxe-D7DZHVBT.svg";

  // src/img/eq/light-crossbow.svg
  var light_crossbow_default = "./light-crossbow-PIY5SWC5.svg";

  // src/img/eq/longbow.svg
  var longbow_default = "./longbow-2S2OQHMY.svg";

  // src/img/eq/longsword.svg
  var longsword_default = "./longsword-B4PZKYLG.svg";

  // src/img/eq/mace.svg
  var mace_default = "./mace-NNUCEVKZ.svg";

  // src/img/eq/quarterstaff.svg
  var quarterstaff_default = "./quarterstaff-EMYY63PI.svg";

  // src/img/eq/rapier.svg
  var rapier_default = "./rapier-ZROPHPFJ.svg";

  // src/img/eq/spear.svg
  var spear_default = "./spear-JE22DTMJ.svg";

  // src/img/eq/trident.svg
  var trident_default = "./trident-XL6WP2YY.svg";

  // src/items/weapons.ts
  var AbstractWeapon = class extends AbstractItem {
    constructor(g, name, category, rangeCategory, damage, properties = [], iconUrl, shortRange, longRange) {
      super(g, "weapon", name, 1, iconUrl);
      this.g = g;
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
    constructor(g, quantity) {
      super(
        g,
        "dagger",
        "simple",
        "melee",
        _dd(1, 4, "piercing"),
        ["finesse", "light", "thrown"],
        void 0,
        // TODO [ICON]
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var Handaxe = class extends AbstractWeapon {
    constructor(g, quantity) {
      super(
        g,
        "handaxe",
        "simple",
        "melee",
        _dd(1, 6, "slashing"),
        ["light", "thrown"],
        void 0,
        // TODO [ICON]
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var Mace = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "mace",
        "simple",
        "melee",
        _dd(1, 6, "bludgeoning"),
        void 0,
        mace_default
      );
    }
  };
  var Quarterstaff = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "quarterstaff",
        "simple",
        "melee",
        _dd(1, 6, "bludgeoning"),
        ["versatile"],
        quarterstaff_default
      );
    }
  };
  var Spear = class extends AbstractWeapon {
    constructor(g, quantity) {
      super(
        g,
        "spear",
        "simple",
        "melee",
        _dd(1, 6, "piercing"),
        ["thrown", "versatile"],
        spear_default,
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var LightCrossbow = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "light crossbow",
        "simple",
        "ranged",
        _dd(1, 8, "piercing"),
        ["ammunition", "loading", "two-handed"],
        light_crossbow_default,
        80,
        320
      );
      this.ammunitionTag = "crossbow";
    }
  };
  var Greataxe = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "greataxe",
        "martial",
        "melee",
        _dd(1, 12, "slashing"),
        ["heavy", "two-handed"],
        greataxe_default
      );
    }
  };
  var Longsword = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "longsword",
        "martial",
        "melee",
        _dd(1, 8, "slashing"),
        ["versatile"],
        longsword_default
      );
    }
  };
  var Rapier = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "rapier",
        "martial",
        "melee",
        _dd(1, 8, "piercing"),
        ["finesse"],
        rapier_default
      );
    }
  };
  var Shortsword = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "shortsword",
        "martial",
        "melee",
        _dd(1, 6, "piercing"),
        ["finesse", "light"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Trident = class extends AbstractWeapon {
    constructor(g, quantity) {
      super(
        g,
        "trident",
        "martial",
        "melee",
        _dd(1, 6, "piercing"),
        ["thrown", "versatile"],
        trident_default,
        20,
        60
      );
      this.quantity = quantity;
    }
  };
  var Longbow = class extends AbstractWeapon {
    constructor(g) {
      super(
        g,
        "longbow",
        "martial",
        "ranged",
        _dd(1, 8, "piercing"),
        ["ammunition", "heavy", "two-handed"],
        longbow_default,
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

  // src/monsters/common.ts
  var KeenHearing = new SimpleFeature(
    "Keen Hearing",
    `This has advantage on Wisdom (Perception) checks that rely on hearing.`,
    (g, me) => {
      g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("hearing"))
          diceType.add("advantage", KeenHearing);
      });
    }
  );
  var KeenSmell = new SimpleFeature(
    "Keen Smell",
    `This has advantage on Wisdom (Perception) checks that rely on smell.`,
    (g, me) => {
      g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("smell"))
          diceType.add("advantage", KeenSmell);
      });
    }
  );
  var PackTactics = new SimpleFeature(
    "Pack Tactics",
    `This has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn't incapacitated.`,
    (g, me) => {
      g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        if (who === me && getFlanker(g, me, target))
          diceType.add("advantage", PackTactics);
      });
    }
  );
  function makeMultiattack(text, canStillAttack) {
    return new SimpleFeature("Multiattack", text, (g, me) => {
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor === me && action.isAttack && canStillAttack(me, action))
          error.ignore(OneAttackPerTurnRule);
      });
    });
  }

  // src/monsters/fiendishParty/Kay.ts
  var hiddenName = "Shrouded Figure";
  var realName = "Kay of the Abyss";
  var ScreamingInside = new SimpleFeature(
    "Screaming Inside",
    "Kay does an extra 4 (1d6) psychic damage when he hits with a weapon attack.",
    (g, me) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.tags.has("weapon")))
            interrupt.add(
              new EvaluateLater(me, ScreamingInside, async () => {
                const amount = await g.rollDamage(
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
              })
            );
        }
      );
    }
  );
  var WreathedInShadowEffect = new Effect(
    "Wreathed in Shadow",
    "turnStart",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
        if (target.hasEffect(WreathedInShadowEffect))
          diceType.add("disadvantage", WreathedInShadowEffect);
      });
      g.events.on("CombatantDamaged", ({ detail: { who, total, interrupt } }) => {
        if (who.hasEffect(WreathedInShadowEffect) && total >= 10)
          interrupt.add(
            new EvaluateLater(who, WreathedInShadowEffect, async () => {
              await who.removeEffect(WreathedInShadowEffect);
              who.name = realName;
            })
          );
      });
    },
    { icon: makeIcon(wreathed_in_shadow_default) }
  );
  var WreathedInShadow = new SimpleFeature(
    "Wreathed in Shadow",
    "Kay's appearance is hidden from view by a thick black fog that whirls about him. Only a DC 22 Perception check can reveal his identity. All attacks against him are at disadvantage. This effect is dispelled until the beginning of his next turn if he takes more than 10 damage in one hit.",
    (g, me) => {
      const wreathe = new EvaluateLater(me, WreathedInShadow, async () => {
        await me.addEffect(WreathedInShadowEffect, { duration: Infinity });
        me.name = hiddenName;
      });
      g.events.on("BattleStarted", ({ detail: { interrupt } }) => {
        interrupt.add(wreathe);
      });
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        if (who === me && !who.hasEffect(WreathedInShadowEffect))
          interrupt.add(wreathe);
      });
    }
  );
  var SmoulderingRage = new SimpleFeature(
    "Smouldering Rage",
    "Kay resists bludgeoning, piercing, and slashing damage from nonmagical attacks.",
    (g, me) => {
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, attack, response } }) => {
          if (who === me && !(attack == null ? void 0 : attack.pre.tags.has("magical")) && MundaneDamageTypes.includes(damageType))
            response.add("resist", SmoulderingRage);
        }
      );
    }
  );
  var Kay = class extends Monster {
    constructor(g) {
      super(g, hiddenName, 6, "humanoid", "medium", kay_default, 75);
      this.diesAtZero = false;
      this.movement.set("speed", 30);
      this.setAbilityScores(14, 18, 16, 10, 8, 14);
      this.pb = 3;
      this.saveProficiencies.add("str");
      this.saveProficiencies.add("dex");
      this.skills.set("Athletics", 1);
      this.skills.set("Stealth", 2);
      this.conditionImmunities.add("Frightened");
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
      this.don(new StuddedLeatherArmor(g), true);
      this.don(new Longbow(g), true);
      this.don(new Spear(g, 1), true);
      this.inventory.add(new Arrow(g, Infinity));
    }
  };

  // src/img/act/shield-bash.svg
  var shield_bash_default = "./shield-bash-MWF4OEPW.svg";

  // src/img/tok/boss/o-gonrit.png
  var o_gonrit_default = "./o-gonrit-C5AF3HHR.png";

  // src/ai/coefficients.ts
  var makeAICo = (name, defaultValue = 1) => ({
    name,
    defaultValue
  });
  var HealSelf = makeAICo("HealSelf");
  var HealAllies = makeAICo("HealAllies");
  var OverHealAllies = makeAICo("OverHealAllies", -0.5);

  // src/features/common.ts
  function bonusSpellsFeature(name, text, levelType, method, entries, addAsList) {
    return new SimpleFeature(name, text, (g, me) => {
      var _a, _b;
      const casterLevel = levelType === "level" ? me.level : (_a = me.classLevels.get(levelType)) != null ? _a : 1;
      const spells = entries.filter((entry) => entry.level <= casterLevel);
      for (const { resource, spell } of spells) {
        if (resource)
          me.initResource(resource);
        if (addAsList) {
          me.preparedSpells.add(spell);
          (_b = method.addCastableSpell) == null ? void 0 : _b.call(method, spell, me);
        } else
          spellImplementationWarning(spell, me);
      }
      me.spellcastingMethods.add(method);
      if (!addAsList)
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            for (const { spell } of spells)
              actions.push(new CastSpell(g, me, method, spell));
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

  // src/img/act/protection.svg
  var protection_default = "./protection-JHQ3GBTR.svg";

  // src/features/fightingStyles.ts
  var ProtectionIcon = makeIcon(protection_default);
  var ProtectionAction = class extends AbstractAction {
    constructor(g, actor, diceType) {
      super(
        g,
        actor,
        "Fighting Style: Protection",
        "implemented",
        {
          target: new TargetResolver(g, 5, [isAlly, notSelf]),
          attacker: new TargetResolver(g, Infinity, [isEnemy, canSee])
        },
        {
          time: "reaction",
          icon: ProtectionIcon,
          description: `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`
        }
      );
      this.diceType = diceType;
    }
    check(config, ec) {
      if (!this.actor.shield)
        ec.add("need shield", this);
      return super.check(config, ec);
    }
    async apply({ attacker, target }) {
      await super.apply({ attacker, target });
      this.diceType.add("disadvantage", this);
    }
  };
  var FightingStyleProtection = new SimpleFeature(
    "Fighting Style: Protection",
    `When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new ProtectionAction(g, me, new DiceTypeCollector()));
      });
      g.events.on(
        "BeforeAttack",
        ({ detail: { who, target, interrupt, diceType } }) => {
          if (who === me)
            return;
          const action = new ProtectionAction(g, me, diceType);
          const config = { attacker: who, target };
          if (checkConfig(g, action, config))
            interrupt.add(
              new YesNoChoice(
                me,
                FightingStyleProtection,
                "Fighting Style: Protection",
                `${target.name} is being attacked by ${who.name}. Use ${me.name}'s reaction to impose disadvantage?`,
                async () => {
                  await g.act(action, config);
                }
              )
            );
        }
      );
    }
  );

  // src/spells/level1/GuidingBolt.ts
  var GuidingBoltEffect = new Effect("Guiding Bolt", "turnEnd", (g) => {
    g.events.on("BeforeAttack", ({ detail: { target, diceType, interrupt } }) => {
      if (target.hasEffect(GuidingBoltEffect)) {
        diceType.add("advantage", GuidingBoltEffect);
        interrupt.add(
          new EvaluateLater(target, GuidingBoltEffect, async () => {
            await target.removeEffect(GuidingBoltEffect);
          })
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
    description: `A flash of light streaks toward a creature of your choice within range. Make a ranged spell attack against the target. On a hit, the target takes 4d6 radiant damage, and the next attack roll made against this target before the end of your next turn has advantage, thanks to the mystical dim light glittering on the target until then.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 120, [notSelf]) }),
    getDamage: (_2, caster, method, { slot }) => [
      _dd((slot != null ? slot : 1) + 3, 6, "radiant")
    ],
    getTargets: (g, caster, { target }) => [target],
    async apply(g, attacker, method, { slot, target }) {
      const rsa = new SpellAttack(g, attacker, GuidingBolt, method, "ranged", {
        slot,
        target
      });
      if ((await rsa.attack(target)).hit) {
        const damage = await rsa.getDamage(target);
        await rsa.damage(target, damage);
        await target.addEffect(GuidingBoltEffect, { duration: 2 }, attacker);
      }
    }
  });
  var GuidingBolt_default = GuidingBolt;

  // src/resolvers/MultiTargetResolver.ts
  var MultiTargetResolver = class {
    constructor(g, minimum, maximum, maxRange, filters) {
      this.g = g;
      this.minimum = minimum;
      this.maximum = maximum;
      this.maxRange = maxRange;
      this.filters = filters;
      this.type = "Combatants";
    }
    get name() {
      let name = `${describeRange(this.minimum, this.maximum)} targets${this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""}`;
      for (const filter of this.filters)
        name += `, ${filter.name}`;
      return name;
    }
    check(value, action, ec) {
      if (!isCombatantArray(value)) {
        ec.add("No target", this);
      } else {
        if (value.length < this.minimum)
          ec.add(`At least ${this.minimum} targets`, this);
        if (value.length > this.maximum)
          ec.add(`At most ${this.maximum} targets`, this);
        for (const who of value) {
          const isOutOfRange = distance(this.g, action.actor, who) > this.maxRange;
          const filterErrors = this.filters.filter((filter) => !filter.check(this.g, action, who)).map((filter) => filter.message);
          if (isOutOfRange)
            ec.add(`${who.name}: Out of range`, this);
          for (const error of filterErrors)
            ec.add(`${who.name}: ${error}`, this);
        }
      }
      return ec;
    }
  };

  // src/types/CreatureType.ts
  var ctSet = (...items) => new Set(items);

  // src/utils/combinatorics.ts
  function combinations(source, size) {
    const results = [];
    function backtrack(start, current) {
      if (current.length === size) {
        results.push([...current]);
        return;
      }
      for (let i = start; i < source.length; i++) {
        current.push(source[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }
    backtrack(0, []);
    return results;
  }
  function combinationsMulti(source, min, max) {
    const v = [];
    for (let l = min; l <= max; l++)
      v.push(...combinations(source, l));
    return v;
  }

  // src/spells/level3/MassHealingWord.ts
  var cannotHeal = ctSet("undead", "construct");
  var MassHealingWord = scalingSpell({
    status: "implemented",
    name: "Mass Healing Word",
    level: 3,
    school: "Evocation",
    time: "bonus action",
    v: true,
    lists: ["Bard", "Cleric"],
    description: `As you call out words of restoration, up to six creatures of your choice that you can see within range regain hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the healing increases by 1d4 for each slot level above 3rd.`,
    generateHealingConfigs(slot, allTargets, g, caster) {
      return combinationsMulti(
        allTargets.filter(
          (co) => co.side === caster.side && distance(g, caster, co) <= 60
        ),
        1,
        6
      ).map((targets) => ({ targets }));
    },
    getConfig: (g) => ({
      targets: new MultiTargetResolver(g, 1, 6, 60, [])
    }),
    getHeal: (g, caster, method, { slot }) => [
      { type: "dice", amount: { count: (slot != null ? slot : 3) - 2, size: 4 } },
      {
        type: "flat",
        amount: method.ability ? caster[method.ability].modifier : 0
      }
    ],
    getTargets: (g, caster, { targets }) => targets,
    check(g, { targets }, ec) {
      if (targets) {
        for (const target of targets)
          if (cannotHeal.has(target.type))
            ec.add(
              `Cannot heal ${target.name}, they are a ${target.type}`,
              MassHealingWord
            );
      }
      return ec;
    },
    async apply(g, actor, method, { slot, targets }) {
      const amount = await g.rollHeal(slot - 2, {
        source: MassHealingWord,
        actor,
        size: 4
      }) + (method.ability ? actor[method.ability].modifier : 0);
      for (const target of targets) {
        if (cannotHeal.has(target.type))
          continue;
        await g.applyHeal(target, amount, actor);
      }
    }
  });
  var MassHealingWord_default = MassHealingWord;

  // src/monsters/fiendishParty/common.ts
  var FiendishParty = {
    name: "Fiendish Party",
    getCoefficient: () => void 0
  };

  // src/monsters/fiendishParty/OGonrit.ts
  var FiendishMantle = new SimpleFeature(
    "Fiendish Mantle",
    "Whenever any ally within 30 ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.",
    (g, me) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, critical, interrupt, map } }) => {
          if (attacker.side === me.side && attacker !== me && (attack == null ? void 0 : attack.pre.tags.has("weapon")) && distance(g, me, attacker) <= 30)
            interrupt.add(
              new EvaluateLater(attacker, FiendishMantle, async () => {
                const amount = await g.rollDamage(
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
              })
            );
        }
      );
    }
  );
  var ShieldBashIcon = makeIcon(shield_bash_default);
  var ShieldBashEffect = new Effect(
    "Shield Bash",
    "turnEnd",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(ShieldBashEffect))
          conditions.add("Stunned", ShieldBashEffect);
      });
    },
    { icon: ShieldBashIcon }
  );
  var ShieldBashAction = class extends AbstractAction {
    constructor(g, actor, ability) {
      super(
        g,
        actor,
        "Shield Bash",
        "implemented",
        { target: new TargetResolver(g, actor.reach, [isEnemy]) },
        { icon: ShieldBashIcon, time: "action" }
      );
      this.ability = ability;
    }
    async apply({ target }) {
      await super.apply({ target });
      const { g, actor, ability } = this;
      const config = { conditions: coSet("Stunned"), duration: 1 };
      const { outcome } = await g.save({
        source: this,
        type: { type: "ability", ability },
        attacker: actor,
        who: target,
        ability: "con",
        effect: ShieldBashEffect,
        config
      });
      if (outcome === "fail")
        await target.addEffect(ShieldBashEffect, config, actor);
    }
  };
  var ShieldBash = new SimpleFeature(
    "Shield Bash",
    "One enemy within 5 ft. must succeed on a DC 15 Constitution save or be stunned until the end of their next turn.",
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new ShieldBashAction(g, me, "wis"));
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
    constructor(g) {
      super(g, "O Gonrit", 5, "fiend", "medium", o_gonrit_default, 65);
      this.coefficients.set(HealAllies, 1.2);
      this.groups.add(FiendishParty);
      this.diesAtZero = false;
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
      this.conditionImmunities.add("Poisoned");
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.addFeature(FiendishMantle);
      this.addFeature(ShieldBash);
      this.addFeature(Spellcasting);
      this.addFeature(FightingStyleProtection);
      this.don(new SplintArmor(g), true);
      this.don(new Shield(g), true);
      this.don(new Mace(g), true);
    }
  };

  // src/img/act/song.svg
  var song_default = "./song-VSC3JBXD.svg";

  // src/img/tok/boss/yulash.png
  var yulash_default = "./yulash-YXCZ3ZVJ.png";

  // src/movement.ts
  var getDefaultMovement = (who) => ({
    name: "Movement",
    cannotApproach: /* @__PURE__ */ new Set(),
    maximum: who.speed,
    mustUseAll: false,
    provokesOpportunityAttacks: true,
    teleportation: false,
    onMove(who2, cost) {
      who2.movedSoFar += cost;
      return who2.movedSoFar >= who2.speed;
    }
  });
  var getTeleportation = (maximum, name = "Teleport") => ({
    name,
    cannotApproach: /* @__PURE__ */ new Set(),
    maximum,
    mustUseAll: false,
    provokesOpportunityAttacks: false,
    teleportation: true,
    onMove: () => true
  });
  var BoundedMoveRule = new DndRule("Bounded Movement", (g) => {
    g.events.on("BeforeMove", ({ detail: { who, from, to, handler, error } }) => {
      var _a;
      for (const other of (_a = handler.cannotApproach) != null ? _a : []) {
        const otherPos = g.getState(other).position;
        const { oldDistance, newDistance } = compareDistances(
          other,
          otherPos,
          who,
          from,
          to
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
      provokesOpportunityAttacks = true,
      teleportation = false
    } = {}) {
      this.source = source;
      this.maximum = maximum;
      this.name = source.name;
      this.used = 0;
      this.cannotApproach = new Set(cannotApproach);
      this.mustUseAll = mustUseAll;
      this.provokesOpportunityAttacks = provokesOpportunityAttacks;
      this.teleportation = teleportation;
    }
    onMove(who, cost) {
      this.used += cost;
      return this.used >= this.maximum;
    }
  };

  // src/spells/level1/HealingWord.ts
  var cannotHeal2 = ctSet("undead", "construct");
  var HealingWord = scalingSpell({
    status: "implemented",
    name: "Healing Word",
    level: 1,
    school: "Evocation",
    time: "bonus action",
    v: true,
    lists: ["Bard", "Cleric", "Druid"],
    description: `A creature of your choice that you can see within range regains hit points equal to 1d4 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d4 for each slot level above 1st.`,
    generateHealingConfigs(slot, targets) {
      return targets.map((target) => ({ target }));
    },
    getConfig: (g) => ({
      target: new TargetResolver(g, 60, [
        canSee,
        notOfCreatureType("undead", "construct")
      ])
    }),
    getHeal: (g, caster, method, { slot }) => [
      { type: "dice", amount: { count: slot != null ? slot : 1, size: 4 } },
      {
        type: "flat",
        amount: method.ability ? caster[method.ability].modifier : 0
      }
    ],
    getTargets: (g, caster, { target }) => [target],
    check(g, { target }, ec) {
      if (target && cannotHeal2.has(target.type))
        ec.add(`Cannot heal a ${target.type}`, HealingWord);
      return ec;
    },
    async apply(g, actor, method, { slot, target }) {
      if (cannotHeal2.has(target.type))
        return;
      const modifier = method.ability ? actor[method.ability].modifier : 0;
      const rolled = await g.rollHeal(slot, {
        source: HealingWord,
        actor,
        target,
        spell: HealingWord,
        method,
        size: 4
      });
      await g.heal(HealingWord, rolled + modifier, {
        actor,
        spell: HealingWord,
        target
      });
    }
  });
  var HealingWord_default = HealingWord;

  // src/monsters/fiendishParty/Yulash.ts
  function getMeleeAttackOptions(g, attacker, filter) {
    const options = [];
    const attackerPosition = g.getState(attacker).position;
    for (const weapon of attacker.weapons) {
      if (weapon.rangeCategory !== "melee")
        continue;
      for (const [target, { position }] of g.combatants) {
        if (target === attacker || !filter(target, weapon))
          continue;
        const reach = attacker.reach + weapon.reach;
        if (reach >= getDistanceBetween(
          attackerPosition,
          attacker.sizeInUnits,
          position,
          target.sizeInUnits
        ))
          options.push({ target, weapon });
      }
    }
    return options;
  }
  var cheerIcon = makeIcon(song_default, "green");
  var discordIcon = makeIcon(song_default, "red");
  var irritationIcon = makeIcon(song_default, "purple");
  var CheerAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Cheer",
        "implemented",
        { target: new TargetResolver(g, 30, [isAlly]) },
        {
          time: "action",
          icon: cheerIcon,
          description: `One ally within 30 ft. may make a melee attack against an enemy in range.`
        }
      );
    }
    check({ target }, ec) {
      if (target && !this.getValidAttacks(target).length)
        ec.add("no valid attack", this);
      return super.check({ target }, ec);
    }
    getValidAttacks(attacker) {
      return getMeleeAttackOptions(
        this.g,
        attacker,
        (target) => attacker.side !== target.side
      );
    }
    async apply({ target: attacker }) {
      await super.apply({ target: attacker });
      const attacks = this.getValidAttacks(attacker);
      const choice = new PickFromListChoice(
        attacker,
        this,
        "Cheer",
        `Pick an attack to make.`,
        attacks.map((value) => ({
          value,
          label: `attack ${value.target.name} with ${value.weapon.name}`
        })),
        async ({ target, weapon }) => {
          await doStandardAttack(this.g, {
            source: this,
            ability: getWeaponAbility(attacker, weapon),
            attacker,
            target,
            weapon
          });
        },
        true
      );
      await choice.apply(this.g);
    }
  };
  var Cheer = new SimpleFeature(
    "Cheer",
    "One ally within 30 ft. may make a melee attack against an enemy in range.",
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new CheerAction(g, me));
      });
    }
  );
  var DiscordAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Discord",
        "implemented",
        { target: new TargetResolver(g, 30, [isEnemy]) },
        {
          time: "action",
          icon: discordIcon,
          description: `One enemy within 30 ft. must make a Charisma save or use its reaction to make one melee attack against an ally in range.`
        }
      );
    }
    check({ target }, ec) {
      if (target) {
        if (!target.hasTime("reaction"))
          ec.add("no reaction left", this);
        if (!this.getValidAttacks(target).length)
          ec.add("no valid attack", this);
      }
      return super.check({ target }, ec);
    }
    getValidAttacks(attacker) {
      return getMeleeAttackOptions(
        this.g,
        attacker,
        (target) => attacker.side === target.side
      );
    }
    async apply({ target: attacker }) {
      await super.apply({ target: attacker });
      const { outcome } = await this.g.save({
        source: this,
        type: { type: "ability", ability: "cha" },
        attacker: this.actor,
        who: attacker,
        ability: "cha",
        tags: ["charm"]
      });
      if (outcome === "success")
        return;
      const attacks = this.getValidAttacks(attacker);
      const choice = new PickFromListChoice(
        attacker,
        this,
        "Discord",
        `Pick an attack to make.`,
        attacks.map((value) => ({
          value,
          label: `attack ${value.target.name} with ${value.weapon.name}`
        })),
        async ({ target, weapon }) => {
          await doStandardAttack(this.g, {
            source: this,
            ability: getWeaponAbility(attacker, weapon),
            attacker,
            target,
            weapon
          });
        }
      );
      await choice.apply(this.g);
    }
  };
  var Discord = new SimpleFeature(
    "Discord",
    "One enemy within 30 ft. must make a DC 15 Charisma save or use its reaction to make one melee attack against an ally in range.",
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new DiscordAction(g, me));
      });
    }
  );
  var IrritationAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Irritation",
        "implemented",
        { target: new TargetResolver(g, 30, [isEnemy, isConcentrating]) },
        {
          time: "action",
          icon: irritationIcon,
          description: `One enemy within 30ft. must make a Constitution check or lose concentration.`
        }
      );
    }
    async apply({ target }) {
      await super.apply({ target });
      const { outcome } = await this.g.save({
        source: this,
        type: { type: "ability", ability: "cha" },
        attacker: this.actor,
        who: target,
        ability: "con",
        tags: ["concentration"]
      });
      if (outcome === "fail")
        await target.endConcentration();
    }
  };
  var Irritation = new SimpleFeature(
    "Irritation",
    "One enemy within 30ft. must make a DC 15 Constitution check or lose concentration.",
    (g, me) => {
      g.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(new IrritationAction(g, who));
      });
    }
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
  var DancingStepAction = class extends AbstractAction {
    constructor(g, actor, distance2 = 20) {
      super(
        g,
        actor,
        "Dancing Step",
        "implemented",
        { target: new TargetResolver(g, 5, [isEnemy]) },
        {
          time: "reaction",
          description: `When an enemy moves within 5 ft., you may teleport to a spot within ${distance2} ft. that you can see.`
        }
      );
      this.distance = distance2;
    }
    async apply(config) {
      await super.apply(config);
      await this.g.applyBoundedMove(
        this.actor,
        getTeleportation(this.distance, "Dancing Step")
      );
    }
  };
  var DancingStep = new SimpleFeature(
    "Dancing Step",
    "Reaction: When an enemy moves within 5 ft., Yulash teleports to a spot within 20 ft. that she can see.",
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new DancingStepAction(g, me));
      });
      g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
        const step = new DancingStepAction(g, me);
        const config = { target: who };
        if (checkConfig(g, step, config))
          interrupt.add(
            new YesNoChoice(
              me,
              DancingStep,
              "Dancing Step",
              `${who.name} moved with 5 ft. of ${me.name}. Teleport up to 20 ft. away?`,
              async () => {
                await g.act(step, config);
              }
            )
          );
      });
    }
  );
  var Yulash = class extends Monster {
    constructor(g) {
      super(g, "Yulash", 5, "monstrosity", "medium", yulash_default, 65);
      this.diesAtZero = false;
      this.movement.set("speed", 30);
      this.setAbilityScores(8, 16, 14, 12, 13, 18);
      this.pb = 3;
      this.level = 5;
      this.saveProficiencies.add("dex");
      this.saveProficiencies.add("cha");
      this.skills.set("Deception", 1);
      this.skills.set("Perception", 1);
      this.damageResponses.set("poison", "immune");
      this.conditionImmunities.add("Poisoned");
      this.languages.add("Abyssal");
      this.languages.add("Common");
      this.addFeature(Cheer);
      this.addFeature(Discord);
      this.addFeature(Irritation);
      this.addFeature(Spellcasting2);
      this.addFeature(DancingStep);
      this.don(new LeatherArmor(g), true);
      this.don(new Rapier(g), true);
    }
  };

  // src/img/act/bull-rush.svg
  var bull_rush_default = "./bull-rush-C6PSXUHN.svg";

  // src/img/tok/boss/zafron.png
  var zafron_default = "./zafron-HS5HC4BR.png";

  // src/features/ConfiguredFeature.ts
  var ConfiguredFeature = class {
    constructor(name, text, apply) {
      this.name = name;
      this.text = text;
      this.apply = apply;
    }
    setup(g, who) {
      const config = who.getConfig(this.name);
      if (typeof config === "undefined") {
        console.error(`${who.name} has no config for ${this.name}`);
        return;
      }
      this.apply(g, who, config);
    }
  };

  // src/monsters/fiendishParty/Zafron.ts
  var LustForBattle = new ConfiguredFeature(
    "Lust for Battle",
    "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
    (g, me, weapon) => {
      g.events.on(
        "CombatantDamaged",
        ({ detail: { attack, attacker, interrupt } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.weapon) === weapon)
            interrupt.add(
              new EvaluateLater(me, LustForBattle, async () => {
                await g.giveTemporaryHP(me, 5, LustForBattle);
              })
            );
        }
      );
    }
  );
  var BullRushIcon = makeIcon(bull_rush_default);
  var BullRushEffect = new Effect(
    "Bull Rush",
    "turnStart",
    (g) => {
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who.hasEffect(BullRushEffect) && MundaneDamageTypes.includes(damageType))
            response.add("resist", BullRushEffect);
        }
      );
    },
    { icon: BullRushIcon }
  );
  var BullRushAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Bull Rush",
        "incomplete",
        {},
        {
          icon: BullRushIcon,
          time: "action",
          description: `Until the beginning of your next turn, gain resistance to bludgeoning, piercing and slashing damage. Then, move up to your speed in a single direction. All enemies that you pass through must make a Dexterity save or be knocked prone.`
        }
      );
    }
    check(config, ec) {
      if (this.actor.speed <= 0)
        ec.add("cannot move", this);
      return super.check(config, ec);
    }
    async apply() {
      await super.apply({});
      const { g, actor } = this;
      const affected = [actor];
      const promises = [];
      await actor.addEffect(BullRushEffect, { duration: 1 });
      const maximum = actor.speed;
      let used = 0;
      await g.applyBoundedMove(actor, {
        // TODO must keep moving in same direction
        name: "Bull Rush",
        maximum,
        provokesOpportunityAttacks: true,
        cannotApproach: /* @__PURE__ */ new Set(),
        mustUseAll: false,
        teleportation: false,
        onMove: (who, cost) => {
          const position = g.getState(who).position;
          for (const hit of g.getInside(
            {
              type: "within",
              position,
              target: actor,
              radius: 0
            },
            affected
          )) {
            affected.push(hit);
            promises.push(this.knockOver(hit));
          }
          used += cost;
          return used >= maximum;
        }
      });
      await Promise.all(promises);
    }
    async knockOver(who) {
      const config = { duration: Infinity, conditions: coSet("Prone") };
      const { outcome } = await this.g.save({
        source: this,
        type: { type: "ability", ability: "str" },
        attacker: this.actor,
        who,
        ability: "dex",
        effect: Prone,
        config
      });
      if (outcome === "fail")
        await who.addEffect(Prone, config, this.actor);
    }
  };
  var BullRush = new SimpleFeature(
    "Bull Rush",
    "Until the beginning of his next turn, Zafron gains resistance to bludgeoning, piercing and slashing damage. Then, he moves up to his speed in a single direction. All enemies that he passes through must make a DC 15 Dexterity save or be knocked prone.",
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new BullRushAction(g, me));
      });
    }
  );
  var SurvivalReflex = new SimpleFeature(
    "Survival Reflex",
    "Reaction: When forced to make a skill check or saving throw, Zafron gains advantage on the roll. After the triggering action is complete, he may move up to half his speed.",
    (g, me) => {
      let activated = false;
      const useReflex = ({
        detail: { who, interrupt, diceType }
      }) => {
        if (who === me && me.hasTime("reaction"))
          interrupt.add(
            new YesNoChoice(
              me,
              SurvivalReflex,
              "Survival Reflex",
              `Use ${me.name}'s reaction to gain advantage and move half their speed?`,
              async () => {
                me.useTime("reaction");
                activated = true;
                diceType.add("advantage", SurvivalReflex);
              }
            )
          );
      };
      g.events.on("BeforeCheck", useReflex);
      g.events.on("BeforeSave", useReflex);
      g.events.on("AfterAction", ({ detail: { interrupt } }) => {
        if (activated) {
          activated = false;
          interrupt.add(
            new EvaluateLater(
              me,
              SurvivalReflex,
              async () => g.applyBoundedMove(
                me,
                new BoundedMove(
                  SurvivalReflex,
                  round(me.speed / 2, MapSquareSize)
                )
              )
            )
          );
        }
      });
    }
  );
  var Zafron = class extends Monster {
    constructor(g) {
      super(g, "Zafron Halehart", 5, "fiend", "medium", zafron_default, 105);
      this.diesAtZero = false;
      this.movement.set("speed", 30);
      this.setAbilityScores(18, 14, 20, 7, 10, 13);
      this.pb = 3;
      this.saveProficiencies.add("str");
      this.saveProficiencies.add("con");
      this.skills.set("Acrobatics", 1);
      this.skills.set("Intimidation", 1);
      this.damageResponses.set("fire", "resist");
      this.damageResponses.set("poison", "resist");
      this.conditionImmunities.add("Poisoned");
      this.languages.add("Abyssal");
      const axe = new Greataxe(g);
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
      this.don(new ScaleMailArmor(g), true);
      this.don(axe, true);
    }
  };

  // src/img/tok/pc/aura.png
  var aura_default = "./aura-PXXTYCUY.png";

  // src/types/Item.ts
  var wcSet = (...items) => new Set(items);
  var acSet = (...items) => new Set(items);

  // src/types/SkillName.ts
  var skSet = (...items) => new Set(items);

  // src/types/ToolName.ts
  var toSet = (...items) => new Set(items);

  // src/classes/common.ts
  function asiSetup(g, me, config) {
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
    return new SimpleFeature(name, text, (g, me) => {
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.isAttack && action.actor === me && action.actor.attacksSoFar.length <= extra)
          error.ignore(OneAttackPerTurnRule);
      });
    });
  }

  // src/img/class/rogue.svg
  var rogue_default = "./rogue-NHSUDBY6.svg";

  // src/classes/rogue/common.ts
  var RogueIcon = makeIcon(rogue_default, ClassColours.Rogue);

  // src/classes/rogue/SneakAttack.ts
  function getSneakAttackDice(level) {
    return Math.ceil(level / 2);
  }
  var SneakAttackResource = new TurnResource("Sneak Attack", 1);
  var SneakAttack = new SimpleFeature(
    "Sneak Attack",
    `Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.

You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.

The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.`,
    (g, me) => {
      var _a;
      const count = getSneakAttackDice((_a = me.classLevels.get("Rogue")) != null ? _a : 1);
      me.initResource(SneakAttackResource);
      g.events.on(
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
            const advantage = attack.roll.diceType === "advantage";
            const noDisadvantage = !attack.pre.diceType.getValidEntries().includes("disadvantage");
            if (isFinesseOrRangedWeapon && (advantage || getFlanker(g, me, target) && noDisadvantage)) {
              interrupt.add(
                new YesNoChoice(
                  attacker,
                  SneakAttack,
                  "Sneak Attack",
                  `Do ${count * (critical ? 2 : 1)}d6 bonus damage on this hit?`,
                  async () => {
                    me.spendResource(SneakAttackResource);
                    const damageType = weapon.damage.damageType;
                    const damage = await g.rollDamage(
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
                  }
                )
              );
            }
          }
        }
      );
    }
  );
  var SneakAttack_default = SneakAttack;

  // src/img/act/steady-aim.svg
  var steady_aim_default = "./steady-aim-INID7FA2.svg";

  // src/classes/rogue/SteadyAim.ts
  var SteadyAimIcon = makeIcon(steady_aim_default);
  var SteadyAimNoMoveEffect = new Effect(
    "Steady Aim",
    "turnEnd",
    (g) => {
      g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
        if (who.hasEffect(SteadyAimNoMoveEffect))
          multiplier.add("zero", SteadyAimNoMoveEffect);
      });
    },
    { quiet: true }
  );
  var SteadyAimAdvantageEffect = new Effect(
    "Steady Aim",
    "turnEnd",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
        if (who.hasEffect(SteadyAimAdvantageEffect))
          diceType.add("advantage", SteadyAimAdvantageEffect);
      });
      g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
        if (pre.diceType.isInvolved(SteadyAimAdvantageEffect))
          interrupt.add(
            new EvaluateLater(pre.who, SteadyAimAdvantageEffect, async () => {
              await pre.who.removeEffect(SteadyAimAdvantageEffect);
            })
          );
      });
    },
    { icon: SteadyAimIcon }
  );
  var SteadyAimAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Steady Aim",
        "implemented",
        {},
        {
          icon: SteadyAimIcon,
          time: "bonus action",
          description: `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`
        }
      );
      this.subIcon = RogueIcon;
    }
    check(config, ec) {
      if (this.actor.movedSoFar)
        ec.add("Already moved this turn", this);
      return super.check(config, ec);
    }
    async apply() {
      await super.apply({});
      await this.actor.addEffect(SteadyAimNoMoveEffect, { duration: 1 });
      await this.actor.addEffect(SteadyAimAdvantageEffect, { duration: 1 });
    }
  };
  var SteadyAim = new SimpleFeature(
    "Steady Aim",
    `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SteadyAimAction(g, me));
      });
    }
  );
  var SteadyAim_default = SteadyAim;

  // src/classes/rogue/index.ts
  var Expertise = new ConfiguredFeature(
    "Expertise",
    `At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves\u2019 tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.

  At 6th level, you can choose two more of your proficiencies (in skills or with thieves\u2019 tools) to gain this benefit.`,
    (g, me, config) => {
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
    (g, me) => {
      console.warn(`[Feature Not Complete] Cunning Action (on ${me.name})`);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          const cunning = [new DashAction(g, who), new DisengageAction(g, who)];
          for (const action of cunning) {
            action.name += " (Cunning Action)";
            action.time = "bonus action";
            action.subIcon = RogueIcon;
          }
          actions.push(...cunning);
        }
      });
    }
  );
  var UncannyDodgeAction = class extends AbstractAction {
    constructor(g, actor, multiplier) {
      super(
        g,
        actor,
        "Uncanny Dodge",
        "implemented",
        { target: new TargetResolver(g, Infinity, [canSee]) },
        {
          description: `When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
          time: "reaction"
        }
      );
      this.multiplier = multiplier;
    }
    async apply({ target }) {
      await super.apply({ target });
      this.multiplier.add("half", this);
    }
  };
  var UncannyDodge = new SimpleFeature(
    "Uncanny Dodge",
    `Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (me === who)
          actions.push(new UncannyDodgeAction(g, me, new MultiplierCollector()));
      });
      g.events.on(
        "GatherDamage",
        ({ detail: { target, attack, interrupt, multiplier, attacker } }) => {
          if (attack && target === me) {
            const action = new UncannyDodgeAction(g, me, multiplier);
            const config = { target: attacker };
            if (checkConfig(g, action, config))
              interrupt.add(
                new YesNoChoice(
                  me,
                  UncannyDodge,
                  "Uncanny Dodge",
                  `Use Uncanny Dodge to halve the incoming damage on ${me.name}?`,
                  async () => {
                    await g.act(action, config);
                  }
                )
              );
          }
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
    (g, me) => me.saveProficiencies.add("wis")
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
  var rogue_default2 = Rogue;

  // src/classes/rogue/Scout/index.ts
  var SkirmisherAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Skirmisher",
        "implemented",
        { target: new TargetResolver(g, 5, [isEnemy]) },
        {
          time: "reaction",
          description: `You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.`
        }
      );
    }
    check({ target }, ec) {
      if (this.actor.speed <= 0)
        ec.add("cannot move", this);
      return super.check({ target }, ec);
    }
    async apply({ target }) {
      await super.apply({ target });
      await this.g.applyBoundedMove(
        this.actor,
        new BoundedMove(Skirmisher, round(this.actor.speed / 2, MapSquareSize), {
          provokesOpportunityAttacks: false
        })
      );
    }
  };
  var Skirmisher = new SimpleFeature(
    "Skirmisher",
    `Starting at 3rd level, you are difficult to pin down during a fight. You can move up to half your speed as a reaction when an enemy ends its turn within 5 feet of you. This movement doesn't provoke opportunity attacks.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SkirmisherAction(g, me));
      });
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        const action = new SkirmisherAction(g, me);
        const config = { target: who };
        if (checkConfig(g, action, config))
          interrupt.add(
            new YesNoChoice(
              me,
              Skirmisher,
              "Skirmisher",
              `Use ${me.name}'s reaction to move half their speed?`,
              async () => {
                await g.act(action, config);
              }
            )
          );
      });
    }
  );
  var Survivalist = new SimpleFeature(
    "Survivalist",
    `When you choose this archetype at 3rd level, you gain proficiency in the Nature and Survival skills if you don't already have it. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.`,
    (g, me) => {
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
  function getWeaponPlusHandler(item, value, source) {
    return ({ detail: { weapon, ammo, bonus } }) => {
      if (weapon === item || ammo === item)
        bonus.add(value, source);
    };
  }
  var weaponPlus = (value, rarity) => ({
    name: `+${value} bonus`,
    setup(g, item) {
      item.name = `${item.name} +${value}`;
      item.magical = true;
      item.rarity = rarity;
      if (item.icon)
        item.icon.colour = ItemRarityColours[rarity];
      const handler = getWeaponPlusHandler(item, value, this);
      g.events.on("BeforeAttack", handler);
      g.events.on("GatherDamage", handler);
    }
  });
  var weaponPlus1 = weaponPlus(1, "Uncommon");
  var weaponPlus2 = weaponPlus(2, "Rare");
  var weaponPlus3 = weaponPlus(3, "Very Rare");
  var armorPlus = (value, rarity) => ({
    name: `+${value} bonus`,
    setup(g, item) {
      item.name = `${item.name} +${value}`;
      item.magical = true;
      item.rarity = rarity;
      if (item.icon)
        item.icon.colour = ItemRarityColours[rarity];
      item.ac += value;
    }
  });
  var armorPlus1 = armorPlus(1, "Rare");
  var armorPlus2 = armorPlus(2, "Very Rare");
  var armorPlus3 = armorPlus(3, "Legendary");

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
    setup(g, item) {
      weaponPlus1.setup(g, item);
      item.name = `chaotic burst ${item.weaponType}`;
      item.attunement = true;
      item.rarity = "Rare";
      if (item.icon)
        item.icon.colour = ItemRarityColours.Rare;
      g.events.on("TurnStarted", ({ detail: { who } }) => {
        if (isEquipmentAttuned(item, who))
          who.initResource(ChaoticBurstResource);
      });
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, critical, interrupt, map } }) => {
          if (critical && isEquipmentAttuned(item, attacker) && attacker.hasResource(ChaoticBurstResource)) {
            attacker.spendResource(ChaoticBurstResource);
            const a = g.dice.roll({
              source: chaoticBurst,
              type: "damage",
              attacker,
              size: 8
            }).value;
            const b = g.dice.roll({
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
                  async (type) => addBurst(type)
                )
              );
          }
        }
      );
    }
  };
  var vicious = {
    name: "vicious",
    setup(g, item) {
      item.name = `vicious ${item.name}`;
      item.magical = true;
      item.rarity = "Rare";
      if (item.icon)
        item.icon.colour = ItemRarityColours.Rare;
      g.events.on("GatherDamage", ({ detail: { weapon, bonus, attack } }) => {
        if (weapon === item && (attack == null ? void 0 : attack.roll.value) === 20)
          bonus.add(7, vicious);
      });
    }
  };

  // src/feats/Lucky.ts
  var LuckPoint = new LongRestResource("Luck Point", 3);
  function addLuckyOpportunity(g, who, message, interrupt, callback) {
    interrupt.add(
      new YesNoChoice(who, Lucky, "Lucky", message, async () => {
        who.spendResource(LuckPoint);
        const nr = await g.roll({ type: "luck", who });
        callback(nr.value);
      })
    );
  }
  var Lucky = new SimpleFeature(
    "Lucky",
    `You have inexplicable luck that seems to kick in at just the right moment.

- You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll the die, but before the outcome is determined. You choose which of the d20s is used for the attack roll, ability check, or saving throw.
- You can also spend one luck point when an attack roll is made against you. Roll a d20, and then choose whether the attack uses the attacker's roll or yours. If more than one creature spends a luck point to influence the outcome of a roll, the points cancel each other out; no additional dice are rolled.
- You regain your expended luck points when you finish a long rest.`,
    (g, me) => {
      me.initResource(LuckPoint);
      g.events.on("DiceRolled", ({ detail }) => {
        const { type, interrupt, value } = detail;
        if ((type.type === "attack" || type.type === "check" || type.type === "save") && type.who === me && me.hasResource(LuckPoint))
          addLuckyOpportunity(
            g,
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
            g,
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

  // src/img/act/hiss.svg
  var hiss_default = "./hiss-UPUMVUAV.svg";

  // src/features/boons.ts
  var HissResource = new ShortRestResource("Hiss (Boon of Vassetri)", 1);
  var HissFleeAction = class extends AbstractAction {
    constructor(g, actor, other) {
      super(g, actor, "Flee from Hiss", "implemented", {}, { time: "reaction" });
      this.other = other;
    }
    async apply() {
      await super.apply({});
      await this.g.applyBoundedMove(
        this.actor,
        new BoundedMove(this, round(this.actor.speed / 2, MapSquareSize), {
          cannotApproach: [this.other],
          mustUseAll: true,
          provokesOpportunityAttacks: false
        })
      );
    }
  };
  var HissAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Hiss (Boon of Vassetri)",
        "implemented",
        { target: new TargetResolver(g, 5, [isEnemy]) },
        {
          icon: makeIcon(hiss_default),
          time: "bonus action",
          resources: [[HissResource, 1]]
        }
      );
    }
    async apply({ target }) {
      await super.apply({ target });
      const { g, actor } = this;
      const action = new HissFleeAction(g, target, actor);
      if (checkConfig(g, action, {})) {
        const { outcome } = await g.save({
          source: this,
          type: { type: "ability", ability: "cha" },
          attacker: actor,
          who: target,
          ability: "wis",
          tags: ["frightened", "forced movement"]
        });
        if (outcome === "fail")
          await g.act(action, {});
      }
    }
  };
  var BoonOfVassetri = new SimpleFeature(
    "Boon of Vassetri",
    `You dared ask Vassetri for a boon of power and a bite on the neck was your reward. It provides the following benefits:

  - You may cast the spell [speak with animals] at will, but it can only target snakes.
  - As a bonus action, you hiss threateningly at an enemy within 5 feet. If the enemy fails a Wisdom save, they must spend their reaction to move half of their speed away from you in any direction. The DC is 8 + your proficiency bonus + your Charisma modifier. You can only use this ability once per short or long rest, and only when you are able to speak.`,
    (g, me) => {
      console.warn(`[Feature Not Complete] Boon of Vassetri (on ${me.name})`);
      me.initResource(HissResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new HissAction(g, me));
      });
    }
  );

  // src/items/wondrous.ts
  var AbstractWondrous = class extends AbstractItem {
    constructor(g, name, hands = 0, iconUrl) {
      super(g, "wondrous", name, hands, iconUrl);
    }
  };
  var BracersOfTheArbalest = class extends AbstractWondrous {
    constructor(g) {
      super(g, "Bracers of the Arbalest");
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
        if (isEquipmentAttuned(this, attacker) && (weapon == null ? void 0 : weapon.ammunitionTag) === "crossbow")
          bonus.add(2, this);
      });
    }
  };
  var BootsOfTheWinterlands = class extends AbstractWondrous {
    constructor(g) {
      super(g, "Boots of the Winterlands");
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (isEquipmentAttuned(this, who) && damageType === "cold")
            response.add("resist", this);
        }
      );
    }
  };
  var CloakOfProtection = class extends AbstractWondrous {
    constructor(g) {
      super(g, "Cloak of Protection");
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
        if (isEquipmentAttuned(this, who))
          for (const method of methods) {
            method.ac++;
            method.uses.add(this);
          }
      });
      g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
        if (isEquipmentAttuned(this, who))
          bonus.add(1, this);
      });
    }
  };
  var DragonTouchedFocus = class extends AbstractWondrous {
    constructor(g, level) {
      super(g, `Dragon-Touched Focus (${level})`, 1);
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
        if (isEquipmentAttuned(this, who))
          diceType.add("advantage", this);
      });
    }
  };
  var FigurineData = {
    "Bronze Griffin": { rarity: "Rare" },
    "Ebony Fly": { rarity: "Rare" },
    "Golden Lions": { rarity: "Rare" },
    "Ivory Goats": { rarity: "Rare" },
    "Marble Elephant": { rarity: "Rare" },
    "Obsidian Steed": { rarity: "Very Rare" },
    "Onyx Dog": { rarity: "Rare" },
    "Serpentine Owl": { rarity: "Rare" },
    "Silver Raven": { rarity: "Uncommon" }
  };
  var FigurineOfWondrousPower = class extends AbstractWondrous {
    constructor(g, type) {
      super(g, `Figurine of Wondrous Power, ${type}`, 0);
      this.type = type;
      this.rarity = FigurineData[type].rarity;
    }
  };
  var RingOfAwe = class extends AbstractWondrous {
    constructor(g) {
      super(g, "Ring of Awe", 0);
      this.attunement = true;
      this.rarity = "Rare";
    }
  };
  var SilverShiningAmulet = class extends AbstractWondrous {
    constructor(g) {
      super(g, "Silver Shining Amulet", 0);
      this.attunement = true;
      this.rarity = "Rare";
      const giveBonus = ({
        detail: { who, spell, bonus }
      }) => {
        if (isEquipmentAttuned(this, who) && spell)
          bonus.add(1, this);
      };
      g.events.on("BeforeAttack", giveBonus);
      g.events.on("GetSaveDC", giveBonus);
    }
  };

  // src/img/eq/punch.svg
  var punch_default = "./punch-JPHSSLGW.svg";

  // src/PC.ts
  var UnarmedStrike = class extends AbstractWeapon {
    constructor(g, owner) {
      super(
        g,
        "unarmed strike",
        "natural",
        "melee",
        { type: "flat", amount: 1, damageType: "bludgeoning" },
        void 0,
        punch_default
      );
      this.owner = owner;
    }
  };
  var PC = class extends AbstractCombatant {
    constructor(g, name, img) {
      super(g, name, {
        type: "humanoid",
        size: "medium",
        img,
        side: 0,
        diesAtZero: false,
        level: 0
      });
      this.subclasses = /* @__PURE__ */ new Map();
      this.naturalWeapons.add(new UnarmedStrike(g, this));
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
      var _a, _b;
      const level = ((_a = this.classLevels.get(cls.name)) != null ? _a : 0) + 1;
      this.classLevels.set(cls.name, level);
      this.level++;
      this.pb = getProficiencyBonusByLevel(this.level);
      this.baseHpMax += (hpRoll != null ? hpRoll : getDefaultHPRoll(this.level, cls.hitDieSize)) + this.con.modifier;
      if (level === 1) {
        mergeSets(this.armorProficiencies, cls.armorProficiencies);
        mergeSets(this.saveProficiencies, cls.saveProficiencies);
        mergeSets(
          this.weaponCategoryProficiencies,
          cls.weaponCategoryProficiencies
        );
        mergeSets(this.weaponProficiencies, cls.weaponProficiencies);
        for (const prof of (_b = cls == null ? void 0 : cls.toolProficiencies) != null ? _b : [])
          this.toolProficiencies.set(prof, 1);
      }
      this.addFeatures(cls.features.get(level));
      const sub = this.subclasses.get(cls.name);
      this.addFeatures(sub == null ? void 0 : sub.features.get(level));
    }
    addSubclass(sub) {
      this.subclasses.set(sub.className, sub);
    }
  };

  // src/img/spl/levitate.svg
  var levitate_default = "./levitate-QW3QKX7H.svg";

  // src/spells/level2/Levitate.ts
  var Levitate = simpleSpell({
    name: "Levitate",
    level: 2,
    icon: makeIcon(levitate_default),
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "either a small leather loop or a piece of golden wire bent into a cup shape with a long shank on one end",
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `One creature or loose object of your choice that you can see within range rises vertically, up to 20 feet, and remains suspended there for the duration. The spell can levitate a target that weighs up to 500 pounds. An unwilling creature that succeeds on a Constitution saving throw is unaffected.

  The target can move only by pushing or pulling against a fixed object or surface within reach (such as a wall or a ceiling), which allows it to move as if it were climbing. You can change the target's altitude by up to 20 feet in either direction on your turn. If you are the target, you can move up or down as part of your move. Otherwise, you can use your action to move the target, which must remain within the spell's range.

  When the spell ends, the target floats gently to the ground if it is still aloft.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 60, [canSee]) }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
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
    (g, me) => {
      me.initResource(MingleWithTheWindResource);
      spellImplementationWarning(Levitate_default, me);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new CastSpell(g, me, MingleWithTheWindMethod, Levitate_default));
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

  // src/pcs/davies/Aura.ts
  var Aura = class extends PC {
    constructor(g) {
      super(g, "Aura", aura_default);
      this.toolProficiencies.set("dice set", 1);
      this.toolProficiencies.set("horn", 1);
      this.setAbilityScores(8, 15, 11, 14, 9, 14);
      this.setRace(AirGenasi);
      this.addSubclass(Scout_default);
      this.addClassLevel(rogue_default2);
      this.addClassLevel(rogue_default2);
      this.addClassLevel(rogue_default2);
      this.addClassLevel(rogue_default2);
      this.addClassLevel(rogue_default2);
      this.addClassLevel(rogue_default2);
      this.addClassLevel(rogue_default2);
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
      this.don(enchant(new LightCrossbow(g), vicious));
      this.don(new LeatherArmor(g));
      this.don(new BracersOfTheArbalest(g), true);
      this.don(new Rapier(g));
      this.inventory.add(new CrossbowBolt(g, 20));
      this.inventory.add(enchant(new CrossbowBolt(g, 15), weaponPlus1));
    }
  };

  // src/img/tok/pc/beldalynn.png
  var beldalynn_default = "./beldalynn-B47TNTON.png";

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
      this.feature = new SimpleFeature("Spellcasting", text, (g, me) => {
        var _a;
        this.initialise(me, (_a = me.classLevels.get(className)) != null ? _a : 1);
        me.spellcastingMethods.add(this);
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me) {
            for (const spell of me.preparedSpells) {
              if (this.canCast(spell, who))
                actions.push(new CastSpell(g, me, this, spell));
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
    getSaveType() {
      return { type: "ability", ability: this.ability };
    }
  };

  // src/img/class/wizard.svg
  var wizard_default = "./wizard-FEOOHPRA.svg";

  // src/classes/wizard/common.ts
  var WizardIcon = makeIcon(wizard_default, ClassColours.Wizard);

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
    "Wizard",
    WizardIcon
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
  var wizard_default2 = Wizard;

  // src/events/MultiListChoiceEvent.ts
  var MultiListChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("MultiListChoice", { detail });
    }
  };

  // src/interruptions/MultiListChoice.ts
  var MultiListChoice = class {
    constructor(who, source, title, text, items, minimum, maximum = items.length, chosen, priority2 = 10) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.items = items;
      this.minimum = minimum;
      this.maximum = maximum;
      this.chosen = chosen;
      this.priority = priority2;
    }
    async apply(g) {
      const choice = await new Promise(
        (resolve) => g.fire(new MultiListChoiceEvent({ interruption: this, resolve }))
      );
      return this.chosen(choice);
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
    (g, me) => {
      g.events.on(
        "SpellCast",
        ({ detail: { who, spell, level, targets, interrupt } }) => {
          if (who === me && spell.school === "Evocation")
            interrupt.add(
              new MultiListChoice(
                me,
                SculptSpells,
                "Sculpt Spells",
                `Pick combatants who will be somewhat protected from your spell.`,
                Array.from(targets, (value) => ({
                  value,
                  label: value.name
                })),
                0,
                level + 1,
                async (chosen) => {
                  for (const target of chosen) {
                    const unsubscribe = g.events.on(
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
                }
              )
            );
        }
      );
    }
  );
  var PotentCantrip = new SimpleFeature(
    "Potent Cantrip",
    `Starting at 6th level, your damaging cantrips affect even creatures that avoid the brunt of the effect. When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip.`,
    (g, me) => {
      g.events.on(
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

  // src/img/act/breath.svg
  var breath_default = "./breath-JCG457K5.svg";

  // src/img/act/special-breath.svg
  var special_breath_default = "./special-breath-M2XCTDTK.svg";

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
    constructor(g, maxRange) {
      this.g = g;
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
    const feature = new SimpleFeature(name, text, (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, diceType, tags } }) => {
        if (who === me && tags.has("poison"))
          diceType.add("advantage", feature);
      });
      g.events.on(
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
    const feature = new SimpleFeature(name, text, (g, me) => {
      g.events.on(
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
  function getBreathArea(g, me, point) {
    const position = g.getState(me).position;
    const size = me.sizeInUnits;
    return aimCone(position, size, point, 15);
  }
  var BreathWeaponAction = class extends AbstractAttackAction {
    constructor(g, actor, damageType, damageDice) {
      super(
        g,
        actor,
        "Breath Weapon",
        "implemented",
        { point: new PointResolver(g, 15) },
        {
          icon: makeIcon(breath_default, DamageColours[damageType]),
          damage: [_dd(damageDice, 10, damageType)],
          resources: [[BreathWeaponResource, 1]],
          description: `When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in a 15-foot cone. Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). On a failed save, the creature takes 1d10 damage of the type associated with your Metallic Ancestry. On a successful save, it takes half as much damage. This damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).
        You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`
        }
      );
      this.damageType = damageType;
      this.damageDice = damageDice;
    }
    getAffectedArea({ point }) {
      if (point)
        return [getBreathArea(this.g, this.actor, point)];
    }
    async apply({ point }) {
      await super.apply({ point });
      const { actor: attacker, g, damageDice, damageType } = this;
      const damage = await g.rollDamage(damageDice, {
        source: this,
        attacker,
        size: 10,
        damageType
      });
      for (const target of g.getInside(getBreathArea(g, attacker, point))) {
        const save = await g.save({
          source: this,
          type: { type: "ability", ability: "con" },
          attacker,
          who: target,
          ability: "dex"
        });
        await g.damage(
          this,
          damageType,
          { attacker, target },
          [[damageType, damage]],
          save.damageResponse
        );
      }
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
    constructor(g, actor, name, status = "missing", description, iconColour) {
      super(
        g,
        actor,
        name,
        status,
        { point: new PointResolver(g, 15) },
        {
          resources: [[MetallicBreathWeaponResource, 1]],
          description,
          icon: makeIcon(special_breath_default, iconColour)
        }
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
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(EnervatingBreathEffect))
          conditions.add("Incapacitated", EnervatingBreathEffect);
      });
    }
  );
  var EnervatingBreathAction = class extends MetallicBreathAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Enervating Breath",
        "implemented",
        `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus.
      Each creature in the cone must succeed on a Constitution saving throw or become incapacitated until the start of your next turn.`
      );
    }
    async apply({ point }) {
      await super.apply({ point });
      const { g, actor } = this;
      const config = { conditions: coSet("Incapacitated"), duration: 2 };
      for (const target of g.getInside(getBreathArea(g, actor, point))) {
        const save = await g.save({
          source: this,
          type: { type: "ability", ability: "con" },
          attacker: actor,
          ability: "con",
          who: target,
          effect: EnervatingBreathEffect,
          config
        });
        if (!save)
          await target.addEffect(EnervatingBreathEffect, config, actor);
      }
    }
  };
  var RepulsionBreathAction = class extends MetallicBreathAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Repulsion Breath",
        "incomplete",
        `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus.
      Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.`
      );
    }
    async apply({ point }) {
      await super.apply({ point });
      const { g, actor } = this;
      for (const target of g.getInside(getBreathArea(this.g, actor, point))) {
        const config = { duration: Infinity };
        const save = await g.save({
          source: this,
          type: { type: "ability", ability: "con" },
          attacker: actor,
          ability: "str",
          who: target,
          effect: Prone,
          config
        });
        if (!save) {
          await target.addEffect(Prone, config);
        }
      }
    }
  };
  function makeAncestry(a, dt) {
    const breathWeapon = new SimpleFeature(
      "Breath Weapon",
      `When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in a 15-foot cone. Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). On a failed save, the creature takes 1d10 damage of the type associated with your Metallic Ancestry. On a successful save, it takes half as much damage. This damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).

  You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
      (g, me) => {
        me.initResource(BreathWeaponResource, me.pb);
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            actions.push(
              new BreathWeaponAction(
                g,
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
      (g, me) => {
        if (me.level < 5)
          return;
        console.warn(
          `[Feature Not Complete] Metallic Breath Weapon (on ${me.name})`
        );
        me.initResource(MetallicBreathWeaponResource);
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me) {
            actions.push(new EnervatingBreathAction(g, me));
            actions.push(new RepulsionBreathAction(g, me));
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

  // src/img/spl/acid-splash.svg
  var acid_splash_default = "./acid-splash-7IYZVNCL.svg";

  // src/spells/cantrip/AcidSplash.ts
  var AcidSplash = simpleSpell({
    status: "implemented",
    name: "Acid Splash",
    icon: makeIcon(acid_splash_default, DamageColours.acid),
    level: 0,
    school: "Conjuration",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `You hurl a bubble of acid. Choose one creature you can see within range, or choose two creatures you can see within range that are within 5 feet of each other. A target must succeed on a Dexterity saving throw or take 1d6 acid damage.

  This spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
    getConfig: (g) => ({
      targets: new MultiTargetResolver(g, 1, 2, 60, [canSee])
    }),
    getDamage: (g, caster) => [_dd(getCantripDice(caster), 6, "acid")],
    getTargets: (g, caster, { targets }) => targets,
    check(g, { targets }, ec) {
      if (isCombatantArray(targets) && targets.length === 2) {
        const [a, b] = targets;
        if (distance(g, a, b) > 5)
          ec.add("Targets are not within 5 feet of each other", AcidSplash);
      }
      return ec;
    },
    async apply(g, attacker, method, { targets }) {
      const count = getCantripDice(attacker);
      const damage = await g.rollDamage(count, {
        source: AcidSplash,
        size: 6,
        attacker,
        spell: AcidSplash,
        method,
        damageType: "acid"
      });
      for (const target of targets) {
        const { damageResponse } = await g.save({
          source: AcidSplash,
          type: method.getSaveType(attacker, AcidSplash),
          who: target,
          attacker,
          ability: "dex",
          spell: AcidSplash,
          method,
          fail: "normal",
          save: "zero"
        });
        await g.damage(
          AcidSplash,
          "acid",
          { attacker, target, spell: AcidSplash, method },
          [["acid", damage]],
          damageResponse
        );
      }
    }
  });
  var AcidSplash_default = AcidSplash;

  // src/img/spl/fire-bolt.svg
  var fire_bolt_default = "./fire-bolt-JP4GPEON.svg";

  // src/spells/cantrip/FireBolt.ts
  var FireBolt = simpleSpell({
    status: "implemented",
    name: "Fire Bolt",
    icon: makeIcon(fire_bolt_default, DamageColours.fire),
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried.

  This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).`,
    getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf]) }),
    getDamage: (g, caster) => [_dd(getCantripDice(caster), 10, "fire")],
    getTargets: (g, caster, { target }) => [target],
    async apply(g, attacker, method, { target }) {
      const rsa = new SpellAttack(g, attacker, FireBolt, method, "ranged", {
        target
      });
      if ((await rsa.attack(target)).hit) {
        const damage = await rsa.getDamage(target);
        await rsa.damage(target, damage);
      }
    }
  });
  var FireBolt_default = FireBolt;

  // src/spells/cantrip/MindSliver.ts
  var MindSliverEffect = new Effect("Mind Sliver", "turnStart", (g) => {
    g.events.on("BeforeSave", ({ detail: { who, bonus, interrupt } }) => {
      if (who.hasEffect(MindSliverEffect)) {
        const { value } = g.dice.roll({ type: "bane", who });
        bonus.add(-value, MindSliver);
        interrupt.add(
          new EvaluateLater(who, MindSliverEffect, async () => {
            who.removeEffect(MindSliverEffect);
          })
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
    description: `You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.

  This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
    getConfig: (g) => ({ target: new TargetResolver(g, 60, [canSee, notSelf]) }),
    getDamage: (_2, caster) => [_dd(getCantripDice(caster), 6, "psychic")],
    getTargets: (g, caster, { target }) => [target],
    async apply(g, attacker, method, { target }) {
      const damage = await g.rollDamage(getCantripDice(attacker), {
        source: MindSliver,
        attacker,
        target,
        spell: MindSliver,
        method,
        size: 6,
        damageType: "psychic"
      });
      const { damageResponse, outcome } = await g.save({
        source: MindSliver,
        type: method.getSaveType(attacker, MindSliver),
        who: target,
        attacker,
        ability: "int",
        spell: MindSliver,
        method,
        fail: "normal",
        save: "zero"
      });
      await g.damage(
        MindSliver,
        "psychic",
        { attacker, target, spell: MindSliver, method },
        [["psychic", damage]],
        damageResponse
      );
      if (outcome === "fail") {
        let endCounter = 2;
        const removeTurnTracker = g.events.on(
          "TurnEnded",
          ({ detail: { who, interrupt } }) => {
            if (who === attacker && endCounter-- <= 0) {
              removeTurnTracker();
              interrupt.add(
                new EvaluateLater(who, MindSliver, async () => {
                  await target.removeEffect(MindSliverEffect);
                })
              );
            }
          }
        );
        await target.addEffect(MindSliverEffect, { duration: 2 }, attacker);
      }
    }
  });
  var MindSliver_default = MindSliver;

  // src/img/spl/ray-of-frost.svg
  var ray_of_frost_default = "./ray-of-frost-5EAHUBPB.svg";

  // src/spells/cantrip/RayOfFrost.ts
  var RayOfFrostEffect = new Effect("Ray of Frost", "turnStart", (g) => {
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who.hasEffect(RayOfFrostEffect))
        bonus.add(-10, RayOfFrostEffect);
    });
  });
  var RayOfFrost = simpleSpell({
    status: "implemented",
    name: "Ray of Frost",
    icon: makeIcon(ray_of_frost_default, DamageColours.cold),
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
    getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf]) }),
    getDamage: (_2, caster) => [_dd(getCantripDice(caster), 8, "cold")],
    getTargets: (g, caster, { target }) => [target],
    async apply(g, attacker, method, { target }) {
      const rsa = new SpellAttack(g, attacker, RayOfFrost, method, "ranged", {
        target
      });
      if ((await rsa.attack(target)).hit) {
        const damage = await rsa.getDamage(target);
        await rsa.damage(target, damage);
        await target.addEffect(RayOfFrostEffect, { duration: 2 }, attacker);
      }
    }
  });
  var RayOfFrost_default = RayOfFrost;

  // src/img/spl/ice-knife.svg
  var ice_knife_default = "./ice-knife-4B5PYKBA.svg";

  // src/spells/level1/IceKnife.ts
  var getIceKnifeArea = (g, target) => ({
    type: "within",
    target,
    position: g.getState(target).position,
    radius: 5
  });
  var IceKnife = scalingSpell({
    status: "implemented",
    name: "Ice Knife",
    icon: makeIcon(ice_knife_default, DamageColours.cold),
    level: 1,
    school: "Conjuration",
    s: true,
    m: "a drop of water or piece of ice",
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 60, [notSelf]) }),
    getAffectedArea: (g, caster, { target }) => target && [getIceKnifeArea(g, target)],
    getDamage: (g, caster, method, { slot }) => [
      _dd(1, 10, "piercing"),
      _dd(1 + (slot != null ? slot : 1), 6, "cold")
    ],
    getTargets: (g, caster, { target }) => g.getInside(getIceKnifeArea(g, target)),
    async apply(g, attacker, method, { slot, target }) {
      const { attack, hit, critical } = await g.attack({
        who: attacker,
        tags: atSet("ranged", "spell", "magical"),
        target,
        ability: method.ability,
        spell: IceKnife,
        method
      });
      if (hit) {
        const damage2 = await g.rollDamage(
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
        await g.damage(
          IceKnife,
          "piercing",
          { attack, attacker, target, spell: IceKnife, method, critical },
          [["piercing", damage2]]
        );
      }
      const damage = await g.rollDamage(1 + slot, {
        source: IceKnife,
        size: 6,
        attacker,
        spell: IceKnife,
        method,
        damageType: "cold"
      });
      for (const victim of g.getInside(getIceKnifeArea(g, target))) {
        const { damageResponse } = await g.save({
          source: IceKnife,
          type: method.getSaveType(attacker, IceKnife, slot),
          attacker,
          ability: "dex",
          spell: IceKnife,
          method,
          who: victim,
          fail: "normal",
          save: "zero"
        });
        await g.damage(
          IceKnife,
          "cold",
          { attacker, target: victim, spell: IceKnife, method },
          [["cold", damage]],
          damageResponse
        );
      }
    }
  });
  var IceKnife_default = IceKnife;

  // src/img/spl/magic-missile.svg
  var magic_missile_default = "./magic-missile-SXB2PGXZ.svg";

  // src/resolvers/AllocationResolver.ts
  function isAllocation(value) {
    return typeof value === "object" && typeof value.amount === "number" && typeof value.who === "object";
  }
  function isAllocationArray(value) {
    if (!Array.isArray(value))
      return false;
    for (const entry of value) {
      if (!isAllocation(entry))
        return false;
    }
    return true;
  }
  var AllocationResolver = class {
    constructor(g, rangeName, minimum, maximum, maxRange, filters) {
      this.g = g;
      this.rangeName = rangeName;
      this.minimum = minimum;
      this.maximum = maximum;
      this.maxRange = maxRange;
      this.filters = filters;
      this.type = "Allocations";
    }
    get name() {
      let name = `${this.rangeName}: ${describeRange(
        this.minimum,
        this.maximum
      )} allocations${this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""}`;
      for (const filter of this.filters)
        name += `, ${filter.name}`;
      return name;
    }
    check(value, action, ec) {
      if (!isAllocationArray(value))
        ec.add("No targets", this);
      else {
        const total = value.reduce((p, entry) => p + entry.amount, 0);
        if (total < this.minimum)
          ec.add(`At least ${this.minimum} allocations`, this);
        if (total > this.maximum)
          ec.add(`At most ${this.maximum} allocations`, this);
        for (const { who } of value) {
          const isOutOfRange = distance(this.g, action.actor, who) > this.maxRange;
          const filterErrors = this.filters.filter((filter) => !filter.check(this.g, action, who)).map((filter) => filter.message);
          if (isOutOfRange)
            ec.add(`${who.name}: Out of range`, this);
          for (const error of filterErrors)
            ec.add(`${who.name}: ${error}`, this);
        }
      }
      return ec;
    }
  };

  // src/spells/level1/MagicMissile.ts
  var getDamage = (slot) => [
    _dd(slot + 2, 4, "force"),
    { type: "flat", amount: slot + 2, damageType: "force" }
  ];
  var MagicMissile = scalingSpell({
    status: "implemented",
    name: "Magic Missile",
    icon: makeIcon(magic_missile_default, DamageColours.force),
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Sorcerer", "Wizard"],
    description: `You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.`,
    getConfig: (g, caster, method, { slot }) => ({
      targets: new AllocationResolver(
        g,
        "Missiles",
        (slot != null ? slot : 1) + 2,
        (slot != null ? slot : 1) + 2,
        120,
        [canSee]
      )
    }),
    getDamage: (g, caster, method, { slot }) => getDamage(slot != null ? slot : 1),
    getTargets: (g, caster, { targets }) => targets.map((e) => e.who),
    async apply(g, attacker, method, { targets }) {
      const perBolt = await g.rollDamage(1, {
        source: MagicMissile,
        spell: MagicMissile,
        method,
        attacker,
        damageType: "force",
        size: 4
      }) + 1;
      for (const { amount, who } of targets) {
        if (amount < 1)
          continue;
        await g.damage(
          MagicMissile,
          "force",
          { spell: MagicMissile, method, target: who, attacker },
          [["force", perBolt * amount]]
        );
      }
    }
  });
  var MagicMissile_default = MagicMissile;

  // src/img/spl/shield.svg
  var shield_default = "./shield-O4MYNFME.svg";

  // src/spells/level1/Shield.ts
  var ShieldIcon = makeIcon(shield_default);
  var ShieldEffect = new Effect(
    "Shield",
    "turnStart",
    (g) => {
      const check = (message, who, interrupt, after = async () => {
      }) => {
        const shield = g.getActions(who).filter((a) => a instanceof CastSpell && a.spell === Shield2);
        if (!shield.length)
          return;
        interrupt.add(
          new PickFromListChoice(
            who,
            Shield2,
            "Shield",
            `${message} Cast Shield as a reaction?`,
            shield.map((value) => ({ value, label: value.name })),
            async (action) => {
              await g.act(action, {});
              await after();
            },
            true
          )
        );
      };
      g.events.on("Attack", ({ detail }) => {
        const { target, who, bonus } = detail.pre;
        if (!target.hasEffect(ShieldEffect) && detail.outcome === "hit")
          check(
            `${who.name} hit ${target.name} with an attack.`,
            target,
            detail.interrupt,
            async () => {
              const ac = await g.getAC(target, detail.pre);
              const roll = detail.roll.value;
              detail.outcome = g.getAttackOutcome(ac, roll, roll + bonus.result);
            }
          );
      });
      g.events.on(
        "SpellCast",
        ({ detail: { who, spell, targets, interrupt } }) => {
          if (spell !== MagicMissile_default)
            return;
          for (const target of targets) {
            if (!target.hasEffect(ShieldEffect))
              check(
                `${who.name} is casting Magic Missile on ${target.name}.`,
                target,
                interrupt
              );
          }
        }
      );
      g.events.on("GetAC", ({ detail: { who, bonus } }) => {
        if (who.hasEffect(ShieldEffect))
          bonus.add(5, ShieldEffect);
      });
      g.events.on("GatherDamage", ({ detail: { target, spell, multiplier } }) => {
        if (target.hasEffect(ShieldEffect) && spell === MagicMissile_default)
          multiplier.add("zero", ShieldEffect);
      });
    },
    { icon: ShieldIcon }
  );
  var Shield2 = simpleSpell({
    status: "implemented",
    name: "Shield",
    icon: ShieldIcon,
    level: 1,
    school: "Abjuration",
    time: "reaction",
    v: true,
    s: true,
    lists: ["Sorcerer", "Wizard"],
    description: `An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from magic missile.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster) {
      await caster.addEffect(ShieldEffect, { duration: 1 });
    }
  });
  var Shield_default = Shield2;

  // src/resolvers/ChoiceResolver.ts
  var ChoiceResolver = class {
    constructor(g, entries) {
      this.g = g;
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

  // src/types/SizeCategory.ts
  var SizeCategories = [
    "tiny",
    "small",
    "medium",
    "large",
    "huge",
    "gargantuan"
  ];

  // src/spells/level2/EnlargeReduce.ts
  var EnlargeEffect = new Effect("Enlarge", "turnStart", (g) => {
    const giveAdvantage = ({
      detail: { who, ability, diceType }
    }) => {
      if (who.hasEffect(EnlargeEffect) && ability === "str")
        diceType.add("advantage", EnlargeEffect);
    };
    g.events.on("BeforeCheck", giveAdvantage);
    g.events.on("BeforeSave", giveAdvantage);
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, weapon, interrupt, critical, bonus } }) => {
        if (attacker.hasEffect(EnlargeEffect) && weapon)
          interrupt.add(
            new EvaluateLater(attacker, EnlargeEffect, async () => {
              const amount = await g.rollDamage(
                1,
                { source: EnlargeEffect, attacker, size: 4 },
                critical
              );
              bonus.add(amount, EnlargeEffect);
            })
          );
      }
    );
  });
  var ReduceEffect = new Effect("Reduce", "turnStart", (g) => {
    const giveDisadvantage = ({
      detail: { who, ability, diceType }
    }) => {
      if (who.hasEffect(ReduceEffect) && ability === "str")
        diceType.add("disadvantage", ReduceEffect);
    };
    g.events.on("BeforeCheck", giveDisadvantage);
    g.events.on("BeforeSave", giveDisadvantage);
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, weapon, interrupt, critical, bonus } }) => {
        if (attacker.hasEffect(ReduceEffect) && weapon)
          interrupt.add(
            new EvaluateLater(attacker, ReduceEffect, async () => {
              const amount = await g.rollDamage(
                1,
                { source: ReduceEffect, attacker, size: 4 },
                critical
              );
              bonus.add(-amount, ReduceEffect);
            })
          );
      }
    );
  });
  function applySizeChange(size, change) {
    const index = SizeCategories.indexOf(size) + change;
    if (index < 0 || index >= SizeCategories.length)
      return void 0;
    return SizeCategories[index];
  }
  var EnlargeReduceController = class {
    constructor(caster, effect, config, victim, sizeChange = effect === EnlargeEffect ? 1 : -1) {
      this.caster = caster;
      this.effect = effect;
      this.config = config;
      this.victim = victim;
      this.sizeChange = sizeChange;
      this.applied = false;
    }
    async apply() {
      const { effect, config, victim, sizeChange } = this;
      if (!await victim.addEffect(effect, config))
        return;
      const newSize = applySizeChange(victim.size, sizeChange);
      if (newSize) {
        this.applied = true;
        victim.size = newSize;
      }
      this.caster.concentrateOn({
        duration: config.duration,
        spell: EnlargeReduce,
        onSpellEnd: this.remove.bind(this)
      });
    }
    async remove() {
      if (this.applied) {
        const oldSize = applySizeChange(this.victim.size, -this.sizeChange);
        if (oldSize)
          this.victim.size = oldSize;
      }
      await this.victim.removeEffect(this.effect);
    }
  };
  var EnlargeReduce = simpleSpell({
    status: "implemented",
    name: "Enlarge/Reduce",
    level: 2,
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "a pinch of powdered iron",
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect.

  If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.

  - Enlarge. The target's size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category\u2014from Medium to Large, for example. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.
  - Reduce. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category\u2014from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target's weapons also shrink to match its new size. While these weapons are reduced, the target's attacks with them deal 1d4 less damage (this can't reduce the damage below 1).`,
    getConfig: (g) => ({
      target: new TargetResolver(g, 30, [canSee]),
      mode: new ChoiceResolver(g, [
        { label: "enlarge", value: "enlarge" },
        { label: "reduce", value: "reduce" }
      ])
    }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { mode, target }) {
      const effect = mode === "enlarge" ? EnlargeEffect : ReduceEffect;
      const config = { duration: minutes(1) };
      if (target.side !== caster.side) {
        const { outcome } = await g.save({
          source: EnlargeReduce,
          type: method.getSaveType(caster, EnlargeReduce),
          attacker: caster,
          who: target,
          ability: "con",
          spell: EnlargeReduce,
          method,
          effect,
          config
        });
        if (outcome === "success")
          return;
      }
      const controller = new EnlargeReduceController(
        caster,
        effect,
        config,
        target
      );
      await controller.apply();
    }
  });
  var EnlargeReduce_default = EnlargeReduce;

  // src/spells/level2/HoldPerson.ts
  var HoldPersonEffect = new Effect("Hold Person", "turnStart", (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(HoldPersonEffect))
        conditions.add("Paralyzed", HoldPersonEffect);
    });
    g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
      const config = who.getEffectConfig(HoldPersonEffect);
      if (config) {
        interrupt.add(
          new EvaluateLater(who, HoldPersonEffect, async () => {
            const { outcome } = await g.save({
              source: HoldPersonEffect,
              type: config.method.getSaveType(config.caster, HoldPerson),
              who,
              attacker: config.caster,
              ability: "wis",
              spell: HoldPerson,
              effect: HoldPersonEffect,
              config
            });
            if (outcome === "success") {
              await who.removeEffect(HoldPersonEffect);
              config.affected.delete(who);
              if (config.affected.size < 1)
                await config.caster.endConcentration();
            }
          })
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
    description: `Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target.

  At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd. The humanoids must be within 30 feet of each other when you target them.`,
    getConfig: (g, actor, method, { slot }) => ({
      targets: new MultiTargetResolver(g, 1, (slot != null ? slot : 2) - 1, 60, [
        canSee,
        ofCreatureType("humanoid")
      ])
    }),
    getTargets: (g, caster, { targets }) => targets,
    check(g, { targets }, ec) {
      return ec;
    },
    async apply(g, caster, method, { targets }) {
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
        const { outcome } = await g.save({
          source: HoldPerson,
          type: method.getSaveType(caster, HoldPerson),
          who: target,
          attacker: caster,
          ability: "wis",
          spell: HoldPerson,
          effect: HoldPersonEffect,
          config
        });
        if (outcome === "fail" && await target.addEffect(HoldPersonEffect, config))
          affected.add(target);
      }
      if (affected.size > 0)
        await caster.concentrateOn({
          spell: HoldPerson,
          duration,
          async onSpellEnd() {
            for (const target of affected)
              await target.removeEffect(HoldPersonEffect);
          }
        });
    }
  });
  var HoldPerson_default = HoldPerson;

  // src/img/spl/fireball.svg
  var fireball_default = "./fireball-GYKJUQJQ.svg";

  // src/spells/level3/Fireball.ts
  var getFireballArea = (centre) => ({
    type: "sphere",
    centre,
    radius: 20
  });
  var Fireball = scalingSpell({
    status: "implemented",
    name: "Fireball",
    icon: makeIcon(fireball_default, DamageColours.fire),
    level: 3,
    school: "Evocation",
    v: true,
    s: true,
    m: "a tiny ball of bat guano and sulfur",
    lists: ["Sorcerer", "Wizard"],
    description: `A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a Dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.

  The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,
    getConfig: (g) => ({ point: new PointResolver(g, 150) }),
    getAffectedArea: (g, caster, { point }) => point && [getFireballArea(point)],
    getDamage: (g, caster, method, { slot }) => [_dd(5 + (slot != null ? slot : 3), 6, "fire")],
    getTargets: (g, caster, { point }) => g.getInside(getFireballArea(point)),
    async apply(g, attacker, method, { point, slot }) {
      const damage = await g.rollDamage(5 + slot, {
        source: Fireball,
        size: 6,
        spell: Fireball,
        method,
        damageType: "fire",
        attacker
      });
      for (const target of g.getInside(getFireballArea(point))) {
        const save = await g.save({
          source: Fireball,
          type: method.getSaveType(attacker, Fireball, slot),
          attacker,
          ability: "dex",
          spell: Fireball,
          method,
          who: target
        });
        await g.damage(
          Fireball,
          "fire",
          { attacker, spell: Fireball, method, target },
          [["fire", damage]],
          save.damageResponse
        );
      }
    }
  });
  var Fireball_default = Fireball;

  // src/spells/level3/IntellectFortress.ts
  var mental = abSet("int", "wis", "cha");
  var IntellectFortressEffect = new Effect(
    "Intellect Fortress",
    "turnStart",
    (g) => {
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who.hasEffect(IntellectFortressEffect) && damageType === "psychic")
            response.add("resist", IntellectFortressEffect);
        }
      );
      g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
        if (who.hasEffect(IntellectFortressEffect) && ability && mental.has(ability))
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
    description: `For the duration, you or one willing creature you can see within range has resistance to psychic damage, as well as advantage on Intelligence, Wisdom, and Charisma saving throws.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd. The creatures must be within 30 feet of each other when you target them.`,
    // TODO  The creatures must be within 30 feet of each other when you target them.
    getConfig: (g, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g, 1, (slot != null ? slot : 3) - 2, 30, [canSee])
    }),
    getTargets: (g, caster, { targets }) => targets,
    async apply(g, caster, method, { targets }) {
      const duration = hours(1);
      for (const target of targets)
        await target.addEffect(IntellectFortressEffect, { duration }, caster);
      caster.concentrateOn({
        spell: IntellectFortress,
        duration,
        async onSpellEnd() {
          for (const target of targets)
            await target.removeEffect(IntellectFortressEffect);
        }
      });
    }
  });
  var IntellectFortress_default = IntellectFortress;

  // src/img/spl/melfs-minute-meteors.svg
  var melfs_minute_meteors_default = "./melfs-minute-meteors-FGCLF5JZ.svg";

  // src/resolvers/MultiPointResolver.ts
  var MultiPointResolver = class {
    constructor(g, minimum, maximum, maxRange) {
      this.g = g;
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

  // src/spells/level3/MelfsMinuteMeteors.ts
  var MelfsMinuteMeteorsIcon = makeIcon(melfs_minute_meteors_default, DamageColours.fire);
  var MeteorResource = new TemporaryResource("Melf's Minute Meteors", 6);
  async function fireMeteors(g, attacker, method, { points }, spendMeteors = true) {
    if (spendMeteors)
      attacker.spendResource(MeteorResource, points.length);
    const damage = await g.rollDamage(2, {
      source: MelfsMinuteMeteors,
      attacker,
      size: 6,
      spell: MelfsMinuteMeteors,
      method,
      damageType: "fire"
    });
    for (const point of points) {
      for (const target of g.getInside({
        type: "sphere",
        centre: point,
        radius: 5
      })) {
        const { damageResponse } = await g.save({
          source: MelfsMinuteMeteors,
          type: method.getSaveType(attacker, MelfsMinuteMeteors),
          ability: "dex",
          attacker,
          spell: MelfsMinuteMeteors,
          method,
          who: target
        });
        await g.damage(
          MelfsMinuteMeteors,
          "fire",
          { attacker, target, spell: MelfsMinuteMeteors, method },
          [["fire", damage]],
          damageResponse
        );
      }
    }
  }
  var FireMeteorsAction = class extends AbstractAction {
    constructor(g, actor, method) {
      var _a;
      super(
        g,
        actor,
        "Melf's Minute Meteors",
        "incomplete",
        {
          points: new MultiPointResolver(
            g,
            1,
            Math.min(2, (_a = actor.resources.get(MeteorResource.name)) != null ? _a : 2),
            120
          )
        },
        {
          icon: MelfsMinuteMeteorsIcon,
          time: "bonus action",
          damage: [_dd(2, 6, "fire")],
          description: `You can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.`
        }
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
    async apply(config) {
      await super.apply(config);
      return fireMeteors(this.g, this.actor, this.method, config, false);
    }
  };
  var MelfsMinuteMeteors = scalingSpell({
    status: "implemented",
    name: "Melf's Minute Meteors",
    icon: MelfsMinuteMeteorsIcon,
    level: 3,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "niter, sulfur, and pine tar formed into a bead",
    lists: ["Sorcerer", "Wizard"],
    description: `You create six tiny meteors in your space. They float in the air and orbit you for the spell's duration. When you cast the spell\u2014and as a bonus action on each of your turns thereafter\u2014you can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the number of meteors created increases by two for each slot level above 3rd.`,
    getConfig: (g) => ({
      points: new MultiPointResolver(g, 1, 2, 120)
    }),
    getAffectedArea: (g, caster, { points }) => points && points.map((centre) => ({ type: "sphere", centre, radius: 5 })),
    getTargets: (g, caster, { points }) => points.flatMap(
      (centre) => g.getInside({ type: "sphere", centre, radius: 5 })
    ),
    getDamage: () => [_dd(2, 6, "fire")],
    async apply(g, attacker, method, { points, slot }) {
      const meteors = slot * 2;
      attacker.initResource(MeteorResource, meteors);
      await fireMeteors(g, attacker, method, { points });
      let meteorActionEnabled = false;
      const removeMeteorAction = g.events.on(
        "GetActions",
        ({ detail: { who, actions } }) => {
          if (who === attacker && meteorActionEnabled)
            actions.push(new FireMeteorsAction(g, attacker, method));
        }
      );
      const removeTurnListener = g.events.on(
        "TurnEnded",
        ({ detail: { who } }) => {
          if (who === attacker) {
            meteorActionEnabled = true;
            removeTurnListener();
          }
        }
      );
      await attacker.concentrateOn({
        spell: MelfsMinuteMeteors,
        duration: minutes(10),
        async onSpellEnd() {
          removeMeteorAction();
          removeTurnListener();
          attacker.removeResource(MeteorResource);
        }
      });
    }
  });
  var MelfsMinuteMeteors_default = MelfsMinuteMeteors;

  // src/img/spl/fire-wall.svg
  var fire_wall_default = "./fire-wall-4FF3YRI5.svg";

  // src/spells/level4/WallOfFire.ts
  var shapeChoices = [
    { label: "line", value: "line" },
    { label: "ring", value: "ring" }
  ];
  var WallOfFire = scalingSpell({
    name: "Wall of Fire",
    level: 4,
    icon: makeIcon(fire_wall_default, DamageColours.fire),
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "a small piece of phosphorus",
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.

  When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.

  One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.`,
    // TODO choose dimensions of line wall
    getConfig: (g) => ({
      point: new PointResolver(g, 120),
      shape: new ChoiceResolver(g, shapeChoices)
    }),
    getTargets: () => [],
    getDamage: (g, caster, method, { slot }) => [_dd((slot != null ? slot : 4) + 1, 8, "fire")],
    async apply(g, caster, method, { point, shape }) {
    }
  });
  var WallOfFire_default = WallOfFire;

  // src/pcs/davies/Beldalynn.ts
  var Beldalynn = class extends PC {
    constructor(g) {
      super(g, "Beldalynn", beldalynn_default);
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
      this.addClassLevel(wizard_default2);
      this.addClassLevel(wizard_default2);
      this.addClassLevel(wizard_default2);
      this.addClassLevel(wizard_default2);
      this.addClassLevel(wizard_default2);
      this.addClassLevel(wizard_default2);
      this.addClassLevel(wizard_default2);
      this.setConfig(ASI42, { type: "ability", abilities: ["int", "wis"] });
      this.skills.set("History", 1);
      this.skills.set("Perception", 1);
      this.skills.set("Arcana", 1);
      this.skills.set("Investigation", 1);
      this.don(new CloakOfProtection(g), true);
      this.don(enchant(new Quarterstaff(g), chaoticBurst), true);
      this.don(new DragonTouchedFocus(g, "Slumbering"), true);
      this.inventory.add(new Dagger(g, 1));
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

  // src/img/tok/pc/galilea.png
  var galilea_default = "./galilea-D4XX5FIV.png";

  // src/ActiveEffectArea.ts
  var ActiveEffectArea = class {
    constructor(name, shape, tags, tint) {
      this.name = name;
      this.shape = shape;
      this.tags = tags;
      this.tint = tint;
      this.id = NaN;
    }
  };

  // src/types/EffectArea.ts
  var arSet = (...items) => new Set(items);

  // src/img/class/paladin.svg
  var paladin_default = "./paladin-QFY4DOD4.svg";

  // src/classes/paladin/common.ts
  var PaladinIcon = makeIcon(paladin_default, ClassColours.Paladin);
  var PaladinSpellcasting = new NormalSpellcasting(
    "Paladin",
    `By 2nd level, you have learned to draw on divine magic through meditation and prayer to cast spells as a cleric does.`,
    "cha",
    "half",
    "Paladin",
    "Paladin",
    PaladinIcon
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
  var HarnessDivinePowerAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Harness Divine Power",
        "implemented",
        {
          slot: new ChoiceResolver(
            g,
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
          ],
          description: `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`
        }
      );
      this.subIcon = PaladinIcon;
    }
    check({ slot }, ec) {
      if (slot) {
        const resource = SpellSlotResources[slot];
        if (this.actor.getResource(resource) === this.actor.getResourceMax(resource))
          ec.add(`full on ${resource.name}`, this);
      }
      return super.check({ slot }, ec);
    }
    async apply({ slot }) {
      await super.apply({ slot });
      this.actor.giveResource(SpellSlotResources[slot], 1);
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
    (g, me) => {
      var _a;
      me.initResource(
        HarnessDivinePowerResource,
        getHarnessCount((_a = me.classLevels.get("Paladin")) != null ? _a : 3)
      );
      g.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(new HarnessDivinePowerAction(g, me));
      });
    }
  );
  var HarnessDivinePower_default = HarnessDivinePower;

  // src/img/act/lay-on-hands.svg
  var lay_on_hands_default = "./lay-on-hands-F5ZGB5B6.svg";

  // src/resolvers/MultiChoiceResolver.ts
  var MultiChoiceResolver = class {
    constructor(g, entries, minimum, maximum) {
      this.g = g;
      this.entries = entries;
      this.minimum = minimum;
      this.maximum = maximum;
      this.type = "Choices";
    }
    get name() {
      if (this.entries.length === 0)
        return "empty";
      return `${describeRange(this.minimum, this.maximum)}: ${this.entries.map((e) => e.label).join(", ")}`;
    }
    check(value, action, ec) {
      if (this.entries.length === 0)
        ec.add("No valid choices", this);
      else if (!Array.isArray(value))
        ec.add("No choices", this);
      else {
        if (value.length < this.minimum)
          ec.add(`At least ${this.minimum} choices`, this);
        if (value.length > this.maximum)
          ec.add(`At most ${this.maximum} choices`, this);
      }
      return ec;
    }
  };

  // src/resolvers/NumberRangeResolver.ts
  var NumberRangeResolver = class {
    constructor(g, rangeName, min, max) {
      this.g = g;
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
  var LayOnHandsCureIcon = makeIcon(lay_on_hands_default);
  var LayOnHandsHealIcon = makeIcon(lay_on_hands_default, Heal);
  var LayOnHandsResource = new LongRestResource("Lay on Hands", 5);
  var isHealable = notOfCreatureType("undead", "construct");
  var LayOnHandsHealAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Lay on Hands (Heal)",
        "implemented",
        {
          cost: new NumberRangeResolver(g, "Spend", 1, Infinity),
          target: new TargetResolver(g, actor.reach, [isHealable])
        },
        { icon: LayOnHandsHealIcon, time: "action" }
      );
      this.subIcon = PaladinIcon;
    }
    generateHealingConfigs(targets) {
      const resourceMax = this.actor.getResource(LayOnHandsResource);
      return targets.flatMap(
        (target) => enumerate(1, resourceMax).map((cost) => ({ cost, target }))
      );
    }
    getConfig() {
      const resourceMax = this.actor.getResource(LayOnHandsResource);
      return {
        cost: new NumberRangeResolver(this.g, "Spend", 1, resourceMax),
        target: new TargetResolver(this.g, this.actor.reach, [])
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
    async apply(config) {
      await super.apply(config);
      await this.g.heal(this, config.cost, {
        action: this,
        target: config.target,
        actor: this.actor
      });
    }
  };
  function isCurable(e) {
    return e.tags.has("disease") || e.tags.has("poison");
  }
  function getCurableEffects(who) {
    const effects = [];
    for (const [effect] of who.effects)
      if (isCurable(effect))
        effects.push({ value: effect, label: effect.name });
    return effects;
  }
  var LayOnHandsCureAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Lay on Hands (Cure)",
        "implemented",
        {
          target: new TargetResolver(g, actor.reach, [isHealable]),
          effects: new MultiChoiceResolver(g, [], 1, Infinity)
        },
        { icon: LayOnHandsCureIcon }
      );
      this.subIcon = PaladinIcon;
    }
    getConfig({ target }) {
      const valid = target ? getCurableEffects(target) : [];
      return {
        target: new TargetResolver(this.g, this.actor.reach, [isHealable]),
        effects: new MultiChoiceResolver(this.g, valid, 1, Infinity)
      };
    }
    check({ target, effects }, ec) {
      if (target && effects) {
        const cost = effects.length * 5;
        if (!this.actor.hasResource(LayOnHandsResource, cost))
          ec.add("not enough healing left", this);
        for (const effect of effects) {
          if (!isCurable(effect))
            ec.add(`not valid: ${effect.name}`, this);
          if (!target.hasEffect(effect))
            ec.add(`not present: ${effect.name}`, this);
        }
      }
      return super.check({ target }, ec);
    }
    async apply({ target, effects }) {
      await super.apply({ target, effects });
      const cost = effects.length * 5;
      this.actor.spendResource(LayOnHandsResource, cost);
      for (const effect of effects)
        await target.removeEffect(effect);
    }
  };
  var LayOnHands = new SimpleFeature(
    "Lay on Hands",
    `Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level \xD7 5.

As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.

Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.

This feature has no effect on undead and constructs.`,
    (g, me) => {
      var _a;
      const max = ((_a = me.classLevels.get("Paladin")) != null ? _a : 1) * 5;
      me.initResource(LayOnHandsResource, max, max);
      g.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(
            new LayOnHandsHealAction(g, me),
            new LayOnHandsCureAction(g, me)
          );
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
    (g, me) => {
      g.events.on(
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
                async (slot) => {
                  if (isNaN(slot))
                    return;
                  me.spendResource(SpellSlotResources[slot], 1);
                  const count = Math.min(5, slot + 1);
                  const extra = target.type === "undead" || target.type === "fiend" ? 1 : 0;
                  const damage = await g.rollDamage(
                    count + extra,
                    { source: DivineSmite, attacker, size: 8 },
                    critical
                  );
                  map.add("radiant", damage);
                }
              )
            );
        }
      );
    }
  );
  var PaladinFightingStyle = new ConfiguredFeature(
    "Fighting Style (Paladin)",
    `At 2nd level, you adopt a particular style of fighting as your specialty. You can't take the same Fighting Style option more than once, even if you get to choose again.`,
    (g, me, style) => {
      me.addFeature(style);
    }
  );
  var DivineHealth = new SimpleFeature(
    "Divine Health",
    `By 3rd level, the divine magic flowing through you makes you immune to disease.`,
    (g, me) => {
      g.events.on("BeforeEffect", ({ detail: { who, effect, success } }) => {
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
    (g, me) => {
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
    (g, me) => {
      var _a;
      const radius = getPaladinAuraRadius((_a = me.classLevels.get("Paladin")) != null ? _a : 6);
      let area;
      const updateAura = (position) => {
        if (area)
          g.removeEffectArea(area);
        area = new ActiveEffectArea(
          `Paladin Aura (${me.name})`,
          { type: "within", radius, target: me, position },
          arSet("holy"),
          "yellow"
        );
        g.addEffectArea(area);
      };
      g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
        if (who.side === me.side && !me.conditions.has("Unconscious") && distance(g, me, who) <= radius)
          bonus.add(Math.max(1, me.cha.modifier), AuraOfProtection);
      });
      g.events.on("CombatantMoved", ({ detail: { who, position } }) => {
        if (who === me && !me.conditions.has("Unconscious"))
          updateAura(position);
      });
      g.events.on("EffectAdded", ({ detail: { who } }) => {
        if (who === me && me.conditions.has("Unconscious") && area) {
          g.removeEffectArea(area);
          area = void 0;
        }
      });
      g.events.on("EffectRemoved", ({ detail: { who } }) => {
        if (who === me && !me.conditions.has("Unconscious"))
          updateAura(g.getState(me).position);
      });
      updateAura(g.getState(me).position);
    }
  );
  var AuraOfCourage = new SimpleFeature(
    "Aura of Courage",
    `Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`,
    (g, me) => {
      var _a;
      const radius = getPaladinAuraRadius((_a = me.classLevels.get("Paladin")) != null ? _a : 10);
      g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
        var _a2;
        if (!me.conditions.has("Unconscious") && ((_a2 = config.conditions) == null ? void 0 : _a2.has("Frightened")) && who.side === me.side && distance(g, who, me) <= radius)
          success.add("fail", AuraOfCourage);
      });
    }
  );
  var ImprovedDivineSmite = new SimpleFeature(
    "Improved Divine Smite",
    `By 11th level, you are so suffused with righteous might that all your melee weapon strikes carry divine power with them. Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage.`,
    (g, me) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attack, attacker, critical, target, interrupt, map } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.tags.has("melee")) && attack.pre.tags.has("weapon"))
            interrupt.add(
              new EvaluateLater(attacker, ImprovedDivineSmite, async () => {
                const amount = await g.rollDamage(
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
              })
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
  var paladin_default2 = Paladin;

  // src/img/spl/protection-evil-good.svg
  var protection_evil_good_default = "./protection-evil-good-OPG4SIM6.svg";

  // src/spells/level1/ProtectionFromEvilAndGood.ts
  var ProtectionEvilGoodIcon = makeIcon(protection_evil_good_default);
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
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        if (who.hasEffect(ProtectionEffect) && isAffected(target))
          diceType.add("disadvantage", ProtectionEffect);
      });
      g.events.on(
        "BeforeEffect",
        ({ detail: { who, attacker, effect, config, success } }) => {
          if (who.hasEffect(ProtectionEffect) && isAffected(attacker) && isValidEffect(effect, config))
            success.add("fail", ProtectionEffect);
        }
      );
      g.events.on(
        "BeforeSave",
        ({ detail: { who, attacker, effect, config, diceType } }) => {
          if (who.hasEffect(ProtectionEffect) && isAffected(attacker) && isValidEffect(effect, config))
            diceType.add("advantage", ProtectionEffect);
        }
      );
    },
    { icon: ProtectionEvilGoodIcon }
  );
  var ProtectionFromEvilAndGood = simpleSpell({
    status: "implemented",
    name: "Protection from Evil and Good",
    icon: ProtectionEvilGoodIcon,
    level: 1,
    school: "Abjuration",
    concentration: true,
    v: true,
    s: true,
    m: "holy water or powdered silver and iron, which the spell consumes",
    lists: ["Cleric", "Paladin", "Warlock", "Wizard"],
    description: `Until the spell ends, one willing creature you touch is protected against certain types of creatures: aberrations, celestials, elementals, fey, fiends, and undead.

  The protection grants several benefits. Creatures of those types have disadvantage on attack rolls against the target. The target also can't be charmed, frightened, or possessed by them. If the target is already charmed, frightened, or possessed by such a creature, the target has advantage on any new saving throw against the relevant effect.`,
    getConfig: (g, caster) => ({
      target: new TargetResolver(g, caster.reach, [])
    }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
      const duration = minutes(10);
      await target.addEffect(ProtectionEffect, { duration }, caster);
      await caster.concentrateOn({
        spell: ProtectionFromEvilAndGood,
        duration,
        async onSpellEnd() {
          await target.removeEffect(ProtectionEffect);
        }
      });
    }
  });
  var ProtectionFromEvilAndGood_default = ProtectionFromEvilAndGood;

  // src/spells/level1/Sanctuary.ts
  var SanctuaryEffect = new Effect("Sanctuary", "turnStart", (g) => {
    const getRemover = (who) => new EvaluateLater(who, SanctuaryEffect, async () => {
      await who.removeEffect(SanctuaryEffect);
    });
    g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
      if (pre.who.hasEffect(SanctuaryEffect))
        interrupt.add(getRemover(pre.who));
    });
    g.events.on("SpellCast", ({ detail: { who, targets, interrupt } }) => {
      if (who.hasEffect(SanctuaryEffect))
        for (const target of targets) {
          if (target.side !== who.side) {
            interrupt.add(getRemover(target));
            return;
          }
        }
    });
    g.events.on("CombatantDamaged", ({ detail: { attacker, interrupt } }) => {
      if (attacker.hasEffect(SanctuaryEffect))
        interrupt.add(getRemover(attacker));
    });
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
    description: `You ward a creature within range against attack. Until the spell ends, any creature who targets the warded creature with an attack or a harmful spell must first make a Wisdom saving throw. On a failed save, the creature must choose a new target or lose the attack or spell. This spell doesn't protect the warded creature from area effects, such as the explosion of a fireball.

  If the warded creature makes an attack, casts a spell that affects an enemy, or deals damage to another creature, this spell ends.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 30, []) }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
      await target.addEffect(
        SanctuaryEffect,
        { caster, method, duration: minutes(1) },
        caster
      );
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
    description: `You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.`,
    getConfig: (g, caster, method, { target }) => {
      const effectTypes = [];
      if (target)
        for (const [type, config] of target.effects) {
          if (type.tags.has("disease") || config.conditions && intersects(config.conditions, validConditions))
            effectTypes.push(type);
        }
      return {
        target: new TargetResolver(g, caster.reach, []),
        effect: new ChoiceResolver(
          g,
          effectTypes.map((value) => ({
            label: value.name,
            value
          }))
        )
      };
    },
    getTargets: (g, caster, { target }) => [target],
    check(g, { effect, target }, ec) {
      if (target && effect && !target.hasEffect(effect))
        ec.add("target does not have chosen effect", LesserRestoration);
      return ec;
    },
    async apply(g, caster, method, { target, effect }) {
      await target.removeEffect(effect);
    }
  });
  var LesserRestoration_default = LesserRestoration;

  // src/img/act/sacred-weapon.svg
  var sacred_weapon_default = "./sacred-weapon-IVBS7HAL.svg";

  // src/classes/paladin/Devotion/SacredWeapon.ts
  var SacredWeaponIcon = makeIcon(sacred_weapon_default, DamageColours.radiant);
  var SacredWeaponEffect = new Effect(
    "Sacred Weapon",
    "turnStart",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { who, bonus, weapon, tags } }) => {
        const config = who.getEffectConfig(SacredWeaponEffect);
        if (config && config.weapon === weapon) {
          bonus.add(Math.max(1, who.cha.modifier), SacredWeaponEffect);
          tags.add("magical");
        }
      });
    },
    { icon: SacredWeaponIcon }
  );
  var SacredWeaponAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Channel Divinity: Sacred Weapon",
        "implemented",
        {
          weapon: new ChoiceResolver(
            g,
            actor.weapons.filter((weapon) => weapon.category !== "natural").map((value) => ({ label: value.name, value }))
          )
        },
        {
          time: "action",
          resources: [[ChannelDivinityResource, 1]],
          icon: SacredWeaponIcon,
          description: `As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.
      You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.`
        }
      );
      this.subIcon = PaladinIcon;
    }
    check(config, ec) {
      if (this.actor.hasEffect(SacredWeaponEffect))
        ec.add("already active", this);
      return super.check(config, ec);
    }
    async apply({ weapon }) {
      await super.apply({ weapon });
      await this.actor.addEffect(SacredWeaponEffect, {
        duration: minutes(1),
        weapon
      });
    }
  };
  var SacredWeapon = new SimpleFeature(
    "Channel Divinity: Sacred Weapon",
    `As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.

You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SacredWeaponAction(g, me));
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

Once you use this feature, you can't use it again until you finish a long rest.`
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

  // src/img/spl/web.svg
  var web_default = "./web-ERLMYCL3.svg";

  // src/spells/level2/Web.ts
  var WebIcon = makeIcon(web_default);
  var BreakFreeFromWebAction = class extends AbstractAction {
    constructor(g, actor, caster, method) {
      super(
        g,
        actor,
        "Break Free from Webs",
        "implemented",
        {},
        {
          icon: WebIcon,
          time: "action",
          description: `Make a Strength check to break free of the webs.`
        }
      );
      this.caster = caster;
      this.method = method;
    }
    async apply() {
      await super.apply({});
      const type = this.method.getSaveType(this.caster, Web);
      const dc = await this.g.getSaveDC({ source: Web, type });
      const result = await this.g.abilityCheck(dc.bonus.result, {
        ability: "str",
        who: this.actor,
        tags: chSet()
      });
      if (result.outcome === "success")
        await this.actor.removeEffect(Webbed);
    }
  };
  var Webbed = new Effect(
    "Webbed",
    "turnStart",
    (g) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        const config = who.getEffectConfig(Webbed);
        if (config)
          actions.push(
            new BreakFreeFromWebAction(g, who, config.caster, config.method)
          );
      });
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(Webbed))
          conditions.add("Restrained", Webbed);
      });
    },
    { icon: WebIcon }
  );
  var getWebArea = (centre) => ({
    type: "cube",
    length: 20,
    centre
  });
  var WebController = class {
    constructor(g, caster, method, centre, shape = getWebArea(centre), area = new ActiveEffectArea(
      "Web",
      shape,
      arSet("difficult terrain", "lightly obscured"),
      "white"
    )) {
      this.g = g;
      this.caster = caster;
      this.method = method;
      this.centre = centre;
      this.shape = shape;
      this.area = area;
      this.onSpellEnd = async () => {
        this.g.removeEffectArea(this.area);
        for (const cleanup of this.subscriptions)
          cleanup();
      };
      g.addEffectArea(area);
      this.affectedThisTurn = /* @__PURE__ */ new Set();
      this.subscriptions = [];
      this.subscriptions.push(
        g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
          this.affectedThisTurn.clear();
          if (g.getInside(shape).includes(who))
            interrupt.add(this.getWebber(who));
        }),
        g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
          if (g.getInside(shape).includes(who))
            interrupt.add(this.getWebber(who));
        })
      );
    }
    getWebber(target) {
      const { g, caster, method } = this;
      return new EvaluateLater(target, Web, async () => {
        if (this.affectedThisTurn.has(target))
          return;
        this.affectedThisTurn.add(target);
        const { outcome } = await g.save({
          source: Web,
          type: this.method.getSaveType(this.caster, Web),
          ability: "dex",
          attacker: caster,
          method,
          spell: Web,
          who: target
        });
        if (outcome === "fail")
          await target.addEffect(Webbed, {
            caster,
            method,
            duration: minutes(1),
            conditions: coSet("Restrained")
          });
      });
    }
  };
  var Web = simpleSpell({
    status: "incomplete",
    name: "Web",
    icon: WebIcon,
    level: 2,
    school: "Conjuration",
    concentration: true,
    v: true,
    s: true,
    m: "a bit of spiderweb",
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `You conjure a mass of thick, sticky webbing at a point of your choice within range. The webs fill a 20-foot cube from that point for the duration. The webs are difficult terrain and lightly obscure their area.

  If the webs aren't anchored between two solid masses (such as walls or trees) or layered across a floor, wall, or ceiling, the conjured web collapses on itself, and the spell ends at the start of your next turn. Webs layered over a flat surface have a depth of 5 feet.

  Each creature that starts its turn in the webs or that enters them during its turn must make a Dexterity saving throw. On a failed save, the creature is restrained as long as it remains in the webs or until it breaks free.

  A creature restrained by the webs can use its action to make a Strength check against your spell save DC. If it succeeds, it is no longer restrained.

  The webs are flammable. Any 5-foot cube of webs exposed to fire burns away in 1 round, dealing 2d4 fire damage to any creature that starts its turn in the fire.`,
    getConfig: (g) => ({ point: new PointResolver(g, 60) }),
    getTargets: () => [],
    getAffectedArea: (g, caster, { point }) => point && [getWebArea(point)],
    async apply(g, caster, method, { point }) {
      const controller = new WebController(g, caster, method, point);
      caster.concentrateOn({
        spell: Web,
        duration: hours(1),
        onSpellEnd: controller.onSpellEnd
      });
    }
  });
  var Web_default = Web;

  // src/items/wands.ts
  var AbstractWand = class extends AbstractWondrous {
    constructor(g, name, rarity, charges, maxCharges, resource, spell, saveDC, method = {
      name,
      getResourceForSpell: () => resource,
      getSaveType: () => ({ type: "flat", dc: saveDC })
    }) {
      super(g, name, 1);
      this.charges = charges;
      this.maxCharges = maxCharges;
      this.resource = resource;
      this.spell = spell;
      this.saveDC = saveDC;
      this.method = method;
      this.attunement = true;
      this.rarity = rarity;
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (isEquipmentAttuned(this, who)) {
          who.initResource(resource, charges, maxCharges);
          actions.push(new CastSpell(g, who, method, spell));
        }
      });
    }
  };
  var WandOfWeb = class extends AbstractWand {
    constructor(g, charges = 7) {
      super(
        g,
        "Wand of Web",
        "Uncommon",
        charges,
        7,
        new DawnResource("charge", 7),
        Web_default,
        15
      );
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

  // src/img/spl/bless.svg
  var bless_default = "./bless-VVWIP7W3.svg";

  // src/spells/level1/Bless.ts
  var BlessIcon = makeIcon(bless_default);
  function applyBless(g, who, bonus) {
    if (who.hasEffect(BlessEffect)) {
      const dr = g.dice.roll({ type: "bless", who });
      bonus.add(dr.value, BlessEffect);
    }
  }
  var BlessEffect = new Effect(
    "Bless",
    "turnEnd",
    (g) => {
      g.events.on(
        "BeforeAttack",
        ({ detail: { bonus, who } }) => applyBless(g, who, bonus)
      );
      g.events.on(
        "BeforeSave",
        ({ detail: { bonus, who } }) => applyBless(g, who, bonus)
      );
    },
    { icon: BlessIcon }
  );
  var Bless = scalingSpell({
    status: "implemented",
    name: "Bless",
    icon: BlessIcon,
    level: 1,
    school: "Enchantment",
    concentration: true,
    v: true,
    s: true,
    m: "a sprinkling of holy water",
    lists: ["Cleric", "Paladin"],
    description: `You bless up to three creatures of your choice within range. Whenever a target makes an attack roll or a saving throw before the spell ends, the target can roll a d4 and add the number rolled to the attack roll or saving throw.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.`,
    getConfig: (g, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g, 1, (slot != null ? slot : 1) + 2, 30, [])
    }),
    getTargets: (g, caster, { targets }) => targets,
    async apply(g, caster, method, { targets }) {
      const duration = minutes(1);
      for (const target of targets)
        await target.addEffect(BlessEffect, { duration }, caster);
      await caster.concentrateOn({
        spell: Bless,
        duration,
        onSpellEnd: async () => {
          for (const target of targets)
            await target.removeEffect(BlessEffect);
        }
      });
    }
  });
  var Bless_default = Bless;

  // src/spells/level1/DivineFavor.ts
  var DivineFavorEffect = new Effect("Divine Favor", "turnEnd", (g) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, critical, map, weapon, interrupt } }) => {
        if (attacker.hasEffect(DivineFavorEffect) && weapon)
          interrupt.add(
            new EvaluateLater(attacker, DivineFavorEffect, async () => {
              map.add(
                "radiant",
                await g.rollDamage(
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
            })
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
    description: `Your prayer empowers you with divine radiance. Until the spell ends, your weapon attacks deal an extra 1d4 radiant damage on a hit.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster) {
      const duration = minutes(1);
      await caster.addEffect(DivineFavorEffect, { duration }, caster);
      await caster.concentrateOn({
        spell: DivineFavor,
        duration,
        async onSpellEnd() {
          await caster.removeEffect(DivineFavorEffect);
        }
      });
    }
  });
  var DivineFavor_default = DivineFavor;

  // src/img/spl/shield-of-faith.svg
  var shield_of_faith_default = "./shield-of-faith-6VIBSZE5.svg";

  // src/spells/level1/ShieldOfFaith.ts
  var ShieldOfFaithIcon = makeIcon(shield_of_faith_default);
  var ShieldOfFaithEffect = new Effect(
    "Shield of Faith",
    "turnStart",
    (g) => {
      g.events.on("GetAC", ({ detail: { who, bonus } }) => {
        if (who.hasEffect(ShieldOfFaithEffect))
          bonus.add(2, ShieldOfFaith);
      });
    },
    { icon: ShieldOfFaithIcon }
  );
  var ShieldOfFaith = simpleSpell({
    status: "implemented",
    name: "Shield of Faith",
    icon: ShieldOfFaithIcon,
    level: 1,
    school: "Abjuration",
    time: "bonus action",
    v: true,
    s: true,
    m: "a small parchment with a bit of holy text written on it",
    lists: ["Cleric", "Paladin"],
    description: `A shimmering field appears and surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 60, []) }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
      await target.addEffect(
        ShieldOfFaithEffect,
        { duration: minutes(10) },
        caster
      );
      caster.concentrateOn({
        spell: ShieldOfFaith,
        duration: minutes(10),
        onSpellEnd: async () => {
          await target.removeEffect(ShieldOfFaithEffect);
        }
      });
    }
  });
  var ShieldOfFaith_default = ShieldOfFaith;

  // src/img/spl/aid.svg
  var aid_default = "./aid-2OQR6NMW.svg";

  // src/spells/level2/Aid.ts
  var AidIcon = makeIcon(aid_default, Heal);
  var AidEffect = new Effect(
    "Aid",
    "turnStart",
    (g) => {
      g.events.on("GetMaxHP", ({ detail: { who, bonus } }) => {
        const config = who.getEffectConfig(AidEffect);
        if (config)
          bonus.add(config.amount, AidEffect);
      });
    },
    { icon: AidIcon }
  );
  var Aid = scalingSpell({
    status: "implemented",
    name: "Aid",
    icon: AidIcon,
    level: 2,
    school: "Abjuration",
    v: true,
    s: true,
    m: "a tiny strip of white cloth",
    lists: ["Artificer", "Cleric", "Paladin"],
    description: `Your spell bolsters your allies with toughness and resolve. Choose up to three creatures within range. Each target's hit point maximum and current hit points increase by 5 for the duration.

  At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, a target's hit points increase by an additional 5 for each slot level above 2nd.`,
    getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 3, 30, []) }),
    getTargets: (g, caster, { targets }) => targets,
    async apply(g, actor, method, { slot, targets }) {
      const amount = (slot - 1) * 5;
      const duration = hours(8);
      for (const target of targets) {
        if (await target.addEffect(AidEffect, { duration, amount }))
          await g.heal(Aid, amount, { actor, target, spell: Aid });
      }
    }
  });
  var Aid_default = Aid;

  // src/img/spl/magic-weapon.svg
  var magic_weapon_default = "./magic-weapon-JOO7KH5L.svg";

  // src/spells/level2/MagicWeapon.ts
  function slotToBonus(slot) {
    if (slot >= 6)
      return 3;
    if (slot >= 4)
      return 2;
    return 1;
  }
  var MagicWeaponController = class {
    constructor(g, caster, slot, item, bonus = slotToBonus(slot)) {
      this.g = g;
      this.caster = caster;
      this.slot = slot;
      this.item = item;
      this.bonus = bonus;
      this.onSpellEnd = async () => {
        this.item.magical = false;
        this.item.name = this.oldName;
        if (this.item.icon)
          this.item.icon.colour = this.oldColour;
        for (const cleanup of this.subscriptions)
          cleanup();
      };
      var _a;
      const handler = getWeaponPlusHandler(item, bonus, MagicWeapon);
      this.subscriptions = [
        g.events.on("BeforeAttack", handler),
        g.events.on("GatherDamage", handler)
      ];
      this.oldName = item.name;
      this.oldColour = (_a = item.icon) == null ? void 0 : _a.colour;
      item.magical = true;
      item.name = `${item.name} (Magic Weapon +${bonus})`;
      if (item.icon)
        item.icon.colour = "purple";
    }
  };
  var MagicWeapon = scalingSpell({
    status: "implemented",
    name: "Magic Weapon",
    icon: makeIcon(magic_weapon_default),
    level: 2,
    school: "Transmutation",
    concentration: true,
    time: "bonus action",
    v: true,
    s: true,
    lists: ["Artificer", "Paladin", "Wizard"],
    description: `You touch a nonmagical weapon. Until the spell ends, that weapon becomes a magic weapon with a +1 bonus to attack rolls and damage rolls.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the bonus increases to +2. When you use a spell slot of 6th level or higher, the bonus increases to +3.`,
    getConfig: (g, caster) => ({
      item: new ChoiceResolver(
        g,
        caster.weapons.filter((w) => !w.magical && w.category !== "natural").map((value) => ({ label: value.name, value }))
      )
    }),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method, { slot, item }) {
      const controller = new MagicWeaponController(g, caster, slot, item);
      caster.concentrateOn({
        duration: hours(1),
        spell: MagicWeapon,
        onSpellEnd: controller.onSpellEnd
      });
    }
  });
  var MagicWeapon_default = MagicWeapon;

  // src/pcs/davies/Galilea.ts
  var Galilea = class extends PC {
    constructor(g) {
      super(g, "Galilea", galilea_default);
      this.toolProficiencies.set("playing card set", 1);
      this.setAbilityScores(13, 10, 15, 11, 11, 13);
      this.setRace(Human_default);
      this.languages.add("Sylvan");
      this.addSubclass(Devotion_default);
      this.addClassLevel(paladin_default2);
      this.addClassLevel(paladin_default2);
      this.addClassLevel(paladin_default2);
      this.addClassLevel(paladin_default2);
      this.addClassLevel(paladin_default2);
      this.addClassLevel(paladin_default2);
      this.addClassLevel(paladin_default2);
      this.setConfig(PaladinFightingStyle, FightingStyleProtection);
      this.setConfig(ASI43, { type: "ability", abilities: ["str", "str"] });
      this.skills.set("Insight", 1);
      this.skills.set("Intimidation", 1);
      this.skills.set("History", 1);
      this.skills.set("Persuasion", 1);
      this.don(new Longsword(g));
      this.don(new Shield(g));
      this.don(new SplintArmor(g));
      this.don(new RingOfAwe(g), true);
      this.don(new SilverShiningAmulet(g), true);
      this.inventory.add(new FigurineOfWondrousPower(g, "Silver Raven"));
      const wand = new WandOfWeb(g);
      this.inventory.add(wand);
      this.attunements.add(wand);
      this.inventory.add(new LightCrossbow(g));
      this.inventory.add(new CrossbowBolt(g, 20));
      this.addPreparedSpells(
        Bless_default,
        DivineFavor_default,
        ShieldOfFaith_default,
        Aid_default,
        MagicWeapon_default
      );
    }
  };

  // src/img/tok/pc/hagrond.png
  var hagrond_default = "./hagrond-SXREGQ37.png";

  // src/img/act/rage.svg
  var rage_default = "./rage-UMTXPIH4.svg";

  // src/img/class/barbarian.svg
  var barbarian_default = "./barbarian-5EZH7XQL.svg";

  // src/classes/barbarian/common.ts
  var BarbarianIcon = makeIcon(barbarian_default, ClassColours.Barbarian);

  // src/classes/barbarian/Rage.ts
  var RageIcon = makeIcon(rage_default, "red");
  var EndRageIcon = makeIcon(rage_default, "silver");
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
  var EndRageAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "End Rage",
        "implemented",
        {},
        {
          icon: EndRageIcon,
          time: "bonus action",
          description: `You can end your rage on your turn as a bonus action.`
        }
      );
      this.subIcon = BarbarianIcon;
    }
    check(config, ec) {
      if (!this.actor.hasEffect(RageEffect))
        ec.add("Not raging", this);
      return super.check(config, ec);
    }
    async apply() {
      await super.apply({});
      await this.actor.removeEffect(RageEffect);
    }
  };
  function isRaging(who) {
    var _a;
    return who.hasEffect(RageEffect) && ((_a = who.armor) == null ? void 0 : _a.category) !== "heavy";
  }
  var DidAttackTag = new Effect("(Attacked)", "turnStart", void 0, {
    quiet: true
  });
  var TookDamageTag = new Effect("(Damaged)", "turnEnd", void 0, {
    quiet: true
  });
  var RageEffect = new Effect(
    "Rage",
    "turnStart",
    (g) => {
      const rageAdvantage = ({
        detail: { who, ability, diceType }
      }) => {
        if (isRaging(who) && ability === "str")
          diceType.add("advantage", RageEffect);
      };
      g.events.on("BeforeCheck", rageAdvantage);
      g.events.on("BeforeSave", rageAdvantage);
      g.events.on(
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
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (isRaging(who) && MundaneDamageTypes.includes(damageType))
            response.add("resist", RageEffect);
        }
      );
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor.hasEffect(RageEffect) && action.isSpell)
          error.add("cannot cast spells", RageEffect);
      });
      g.events.on("EffectAdded", ({ detail: { who, interrupt } }) => {
        if (isRaging(who) && who.conditions.has("Unconscious"))
          interrupt.add(
            new EvaluateLater(who, RageEffect, async () => {
              await who.removeEffect(RageEffect);
            })
          );
      });
      g.events.on("Attack", ({ detail: { pre, interrupt } }) => {
        if (isRaging(pre.who) && pre.who.side !== pre.target.side)
          interrupt.add(
            new EvaluateLater(pre.who, RageEffect, async () => {
              await pre.who.addEffect(DidAttackTag, { duration: Infinity });
            })
          );
      });
      g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
        if (isRaging(who))
          interrupt.add(
            new EvaluateLater(who, RageEffect, async () => {
              await who.addEffect(TookDamageTag, { duration: Infinity });
            })
          );
      });
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(RageEffect)) {
          if (!who.hasEffect(DidAttackTag) && !who.hasEffect(TookDamageTag))
            interrupt.add(
              new EvaluateLater(who, RageEffect, async () => {
                await who.removeEffect(RageEffect);
              })
            );
          else
            interrupt.add(
              new EvaluateLater(who, RageEffect, async () => {
                await who.removeEffect(DidAttackTag);
                await who.removeEffect(TookDamageTag);
              })
            );
        }
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who.hasEffect(RageEffect))
          actions.push(new EndRageAction(g, who));
      });
    },
    { icon: RageIcon }
  );
  var RageAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Rage",
        "implemented",
        {},
        {
          icon: RageIcon,
          time: "bonus action",
          resources: [[RageResource, 1]],
          description: `On your turn, you can enter a rage as a bonus action.

While raging, you gain the following benefits if you aren't wearing heavy armor:

- You have advantage on Strength checks and Strength saving throws.
- When you make a melee weapon attack using Strength, you gain a +2 bonus to the damage roll. This bonus increases as you level.
- You have resistance to bludgeoning, piercing, and slashing damage.

If you are able to cast spells, you can't cast them or concentrate on them while raging.

Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven't attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.`
        }
      );
      this.subIcon = BarbarianIcon;
    }
    async apply() {
      await super.apply({});
      if (await this.actor.addEffect(RageEffect, { duration: minutes(1) }))
        await this.actor.endConcentration();
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
    (g, me) => {
      var _a;
      me.initResource(
        RageResource,
        getRageCount((_a = me.classLevels.get("Barbarian")) != null ? _a : 0)
      );
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me && !me.hasEffect(RageEffect))
          actions.push(new RageAction(g, who));
      });
    }
  );
  var Rage_default = Rage;

  // src/img/act/reckless-attack.svg
  var reckless_attack_default = "./reckless-attack-IKQDCDTX.svg";

  // src/classes/barbarian/RecklessAttack.ts
  var RecklessAttackIcon = makeIcon(reckless_attack_default);
  var RecklessAttackResource = new TurnResource("Reckless Attack", 1);
  function canBeReckless(who, tags, ability) {
    return who.hasEffect(RecklessAttackEffect) && hasAll(tags, ["melee", "weapon"]) && ability === "str";
  }
  var RecklessAttackEffect = new Effect(
    "Reckless Attack",
    "turnStart",
    (g) => {
      g.events.on(
        "BeforeAttack",
        ({ detail: { who, target, diceType, ability, tags } }) => {
          if (canBeReckless(who, tags, ability))
            diceType.add("advantage", RecklessAttackEffect);
          if (target.hasEffect(RecklessAttackEffect))
            diceType.add("advantage", RecklessAttackEffect);
        }
      );
    },
    { icon: RecklessAttackIcon }
  );
  var RecklessAttack = new SimpleFeature(
    "Reckless Attack",
    `Starting at 2nd level, you can throw aside all concern for defense to attack with fierce desperation. When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.`,
    (g, me) => {
      me.initResource(RecklessAttackResource);
      g.events.on(
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
                async () => {
                  await me.addEffect(RecklessAttackEffect, { duration: 1 });
                  if (canBeReckless(who, tags, ability))
                    diceType.add("advantage", RecklessAttackEffect);
                }
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
    (g, me) => {
      g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
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
    (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
        if (who === me && ability === "dex" && !intersects(me.conditions, dangerSenseConditions))
          diceType.add("advantage", DangerSense);
      });
    }
  );
  var PrimalKnowledge = new ConfiguredFeature(
    "Primal Knowledge",
    `When you reach 3rd level and again at 10th level, you gain proficiency in one skill of your choice from the list of skills available to barbarians at 1st level.`,
    (g, me, skills) => {
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
    (g, me) => {
      g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
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
    (g, me) => {
      g.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
        if (who === me)
          diceType.add("advantage", FeralInstinct);
      });
    }
  );
  var InstinctivePounce = new SimpleFeature(
    "Instinctive Pounce",
    `As part of the bonus action you take to enter your rage, you can move up to half your speed.`,
    (g, me) => {
      g.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
        if (action instanceof RageAction && action.actor === me)
          interrupt.add(
            new EvaluateLater(
              me,
              InstinctivePounce,
              async () => g.applyBoundedMove(
                me,
                new BoundedMove(
                  InstinctivePounce,
                  round(me.speed / 2, MapSquareSize)
                )
              )
            )
          );
      });
    }
  );
  var getBrutalDice = (level) => {
    if (level < 13)
      return 1;
    if (level < 17)
      return 2;
    return 3;
  };
  var BrutalCritical = new SimpleFeature(
    "Brutal Critical",
    `Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.

This increases to two additional dice at 13th level and three additional dice at 17th level.`,
    (g, me) => {
      var _a;
      const count = getBrutalDice((_a = me.classLevels.get("Barbarian")) != null ? _a : 9);
      g.events.on(
        "GatherDamage",
        ({
          detail: {
            attacker,
            attack,
            critical,
            interrupt,
            weapon,
            target,
            bonus
          }
        }) => {
          if (attacker === me && (attack == null ? void 0 : attack.pre.tags.has("melee")) && critical) {
            const base = weapon == null ? void 0 : weapon.damage;
            if ((base == null ? void 0 : base.type) === "dice") {
              interrupt.add(
                new EvaluateLater(me, BrutalCritical, async () => {
                  const damage = await g.rollDamage(
                    count,
                    {
                      source: BrutalCritical,
                      attacker: me,
                      damageType: base.damageType,
                      size: base.amount.size,
                      target,
                      weapon
                    },
                    false
                  );
                  bonus.add(damage, BrutalCritical);
                })
              );
            }
          }
        }
      );
    }
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
    (g, me) => {
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
  var barbarian_default2 = Barbarian;

  // src/img/act/frenzy.svg
  var frenzy_default = "./frenzy-XYJEPIJ4.svg";

  // src/classes/barbarian/Berserker/Frenzy.ts
  var FrenzyIcon = makeIcon(frenzy_default);
  var FrenzyAttack = class extends AbstractAction {
    constructor(g, actor, weapon) {
      super(
        g,
        actor,
        `${weapon.name} (Frenzy)`,
        "implemented",
        { target: new TargetResolver(g, actor.reach + weapon.reach, [notSelf]) },
        { icon: weapon.icon, damage: [weapon.damage], time: "bonus action" }
      );
      this.weapon = weapon;
      this.ability = getWeaponAbility(actor, weapon);
      this.subIcon = FrenzyIcon;
    }
    async apply({ target }) {
      await super.apply({ target });
      await doStandardAttack(this.g, {
        ability: this.ability,
        attacker: this.actor,
        source: this,
        target,
        weapon: this.weapon
      });
    }
  };
  var FrenzyEffect = new Effect(
    "Frenzy",
    "turnEnd",
    (g) => {
      g.events.on("GetActions", ({ detail: { who, target, actions } }) => {
        if (who.hasEffect(FrenzyEffect) && who !== target) {
          for (const weapon of who.weapons) {
            if (weapon.rangeCategory === "melee")
              actions.push(new FrenzyAttack(g, who, weapon));
          }
        }
      });
      g.events.on("EffectRemoved", ({ detail: { who, effect, interrupt } }) => {
        if (effect === RageEffect && who.hasEffect(FrenzyEffect)) {
          interrupt.add(
            new EvaluateLater(who, FrenzyEffect, async () => {
              await who.removeEffect(FrenzyEffect);
              await who.changeExhaustion(1);
            })
          );
        }
      });
    },
    { icon: FrenzyIcon }
  );
  var Frenzy = new SimpleFeature(
    "Frenzy",
    `Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.`,
    (g, me) => {
      g.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
        if (action instanceof RageAction && action.actor === me)
          interrupt.add(
            new YesNoChoice(
              me,
              Frenzy,
              "Frenzy",
              `Should ${me.name} enter a Frenzy?`,
              async () => {
                await me.addEffect(FrenzyEffect, { duration: minutes(1) });
              }
            )
          );
      });
    }
  );
  var Frenzy_default = Frenzy;

  // src/classes/barbarian/Berserker/index.ts
  var MindlessRage = new SimpleFeature(
    "Mindless Rage",
    `Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.`,
    (g, me) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who === me && me.hasEffect(RageEffect)) {
          conditions.ignoreValue("Charmed");
          conditions.ignoreValue("Frightened");
        }
      });
      g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
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
      [3, [Frenzy_default]],
      [6, [MindlessRage]],
      [10, [IntimidatingPresence]],
      [14, [Retaliation]]
    ])
  };
  var Berserker_default = Berserker;

  // src/enchantments/darkSun.ts
  var darkSun = {
    name: "dark sun",
    setup(g, item) {
      weaponPlus1.setup(g, item);
      item.name = `${item.weaponType} of the dark sun`;
      item.attunement = true;
      item.rarity = "Rare";
      if (item.icon)
        item.icon.colour = ItemRarityColours.Rare;
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, critical, weapon, map, interrupt } }) => {
          if (weapon === item && attacker.attunements.has(weapon))
            interrupt.add(
              new EvaluateLater(attacker, this, async () => {
                const damageType = "radiant";
                map.add(
                  damageType,
                  await g.rollDamage(
                    1,
                    { source: darkSun, size: 10, attacker, damageType },
                    critical
                  )
                );
              })
            );
        }
      );
    }
  };
  var darkSun_default = darkSun;

  // src/enchantments/ofTheDeep.ts
  var ofTheDeep = {
    name: "of the deep",
    setup(g, item) {
      item.name = `${item.name} of the deep`;
      item.magical = true;
      item.rarity = "Rare";
      if (item.icon)
        item.icon.colour = ItemRarityColours.Rare;
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
    constructor(g, type) {
      super(g, `Potion of ${type} Giant Strength`, 0);
      this.type = type;
      this.rarity = GiantStats[type].rarity;
    }
  };

  // src/races/Halfling.ts
  var Lucky2 = new SimpleFeature(
    "Lucky",
    `When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.`,
    (g, me) => {
      g.events.on("DiceRolled", ({ detail }) => {
        const { otherValues, type: t, value, interrupt } = detail;
        if ((t.type === "attack" || t.type === "check" || t.type === "save") && t.who === me && value === 1)
          interrupt.add(
            new YesNoChoice(
              me,
              Lucky2,
              "Lucky",
              `${me.name} rolled a 1 on a ${t.type} check. Reroll it?`,
              async () => {
                const newRoll = g.dice.roll(t).value;
                otherValues.push(value);
                detail.value = newRoll;
              }
            )
          );
      });
    }
  );
  var Brave = new SimpleFeature(
    "Brave",
    `You have advantage on saving throws against being frightened.`,
    (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, tags, config, diceType } }) => {
        var _a;
        if (who === me && (tags.has("frightened") || ((_a = config == null ? void 0 : config.conditions) == null ? void 0 : _a.has("Frightened"))))
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

  // src/pcs/davies/Hagrond.ts
  var Hagrond = class extends PC {
    constructor(g) {
      super(g, "Hagrond", hagrond_default);
      this.skills.set("Survival", 1);
      this.skills.set("Sleight of Hand", 1);
      this.toolProficiencies.set("vehicles (land)", 1);
      this.toolProficiencies.set("woodcarver's tools", 1);
      this.setAbilityScores(15, 15, 13, 10, 8, 10);
      this.setRace(StoutHalfling);
      this.addSubclass(Berserker_default);
      this.addClassLevel(barbarian_default2);
      this.addClassLevel(barbarian_default2);
      this.addClassLevel(barbarian_default2);
      this.addClassLevel(barbarian_default2);
      this.addClassLevel(barbarian_default2);
      this.addClassLevel(barbarian_default2);
      this.addClassLevel(barbarian_default2);
      this.setConfig(ASI44, { type: "ability", abilities: ["str", "con"] });
      this.setConfig(PrimalKnowledge, ["Perception"]);
      this.skills.set("Intimidation", 1);
      this.skills.set("Animal Handling", 1);
      this.don(enchant(new Spear(g, 1), darkSun_default), true);
      this.don(enchant(new Trident(g, 1), ofTheDeep_default), true);
      this.inventory.add(new Dagger(g, 4));
      this.inventory.add(new Handaxe(g, 1));
      this.inventory.add(new Spear(g, 1));
      this.inventory.add(new PotionOfGiantStrength(g, "Hill"));
    }
  };

  // src/img/tok/pc/salgar.png
  var salgar_default = "./salgar-WLUJXZFZ.png";

  // src/img/class/druid.svg
  var druid_default = "./druid-CV77NMBS.svg";

  // src/classes/druid/common.ts
  var DruidIcon = makeIcon(druid_default, ClassColours.Druid);

  // src/classes/druid/WildShape.ts
  var WildShapeResource = new ShortRestResource("Wild Shape", 2);
  var WildShapeController = class {
    constructor(g, me, form) {
      this.g = g;
      this.me = me;
      this.form = form;
      this.backup = {
        name: me.name,
        img: me.img,
        type: me.type,
        size: me.size,
        hands: me.hands,
        reach: me.reach,
        hp: me.hp,
        baseHpMax: me.baseHpMax,
        movement: me.movement,
        skills: me.skills,
        equipment: me.equipment,
        inventory: me.inventory,
        senses: me.senses,
        naturalWeapons: me.naturalWeapons,
        damageResponses: me.damageResponses
      };
      this.str = me.str.score;
      this.dex = me.dex.score;
      this.con = me.con.score;
      this.removeFeatures = /* @__PURE__ */ new Set();
      for (const [name, feature] of form.features) {
        if (!me.features.has(name))
          this.removeFeatures.add(feature);
      }
      this.subscriptions = [];
    }
    async apply() {
      const { g, me, form } = this;
      me.name = `${form.name} (${me.name})`;
      me.img = form.img;
      me.type = form.type;
      me.size = form.size;
      me.hands = form.hands;
      me.reach = form.reach;
      me.baseHpMax = form.baseHpMax;
      me.hp = form.hpMax;
      me.movement = form.movement;
      me.skills;
      me.equipment = /* @__PURE__ */ new Set();
      me.inventory = /* @__PURE__ */ new Set();
      me.senses = form.senses;
      me.naturalWeapons = form.naturalWeapons;
      me.str.score = form.str.score;
      me.dex.score = form.dex.score;
      me.con.score = form.con.score;
      me.damageResponses = form.damageResponses;
      const cleanup = g.events.tap((cleanup2) => this.subscriptions.push(cleanup2));
      for (const [name, feature] of form.features) {
        me.addFeature(feature);
        feature.setup(g, me, form.getConfig(name));
      }
      cleanup();
      this.subscriptions.push(
        // You can revert to your normal form earlier by using a bonus action on your turn.
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            actions.push(new RevertAction(g, me, this));
        }),
        // TODO You automatically revert if you fall unconscious, drop to 0 hit points, or die.
        g.events.on("CombatantDamaged", ({ detail: { who } }) => {
          if (who === me && me.hp <= 0) {
            const rollover = me.hp;
            this.remove();
            me.hp += rollover;
          }
        }),
        // You can't cast spells
        g.events.on("CheckAction", ({ detail }) => {
          if (detail.action.actor === me && detail.action.isSpell)
            detail.error.add("cannot cast spells", WildShape);
        })
      );
    }
    remove() {
      const { me, backup, str, dex, con, removeFeatures, subscriptions } = this;
      Object.assign(me, backup);
      me.str.score = str;
      me.dex.score = dex;
      me.con.score = con;
      for (const feature of removeFeatures)
        me.features.delete(feature.name);
      for (const cleanup of subscriptions)
        cleanup();
    }
  };
  var RevertAction = class extends AbstractAction {
    constructor(g, actor, controller) {
      super(g, actor, "Revert Form", "implemented", {}, { time: "bonus action" });
      this.controller = controller;
    }
    async apply(config) {
      await super.apply(config);
      this.controller.remove();
    }
  };
  var WildShapeAction = class extends AbstractAction {
    constructor(g, actor, forms) {
      super(
        g,
        actor,
        "Wild Shape",
        "incomplete",
        {
          form: new ChoiceResolver(
            g,
            forms.map((value) => ({ value, label: value.name }))
          )
        },
        { time: "action", resources: [[WildShapeResource, 1]] }
      );
      this.forms = forms;
    }
    async apply({ form }) {
      await super.apply({ form });
      const controller = new WildShapeController(this.g, this.actor, form);
      await controller.apply();
    }
  };
  var WildShape = new ConfiguredFeature(
    "Wild Shape",
    `Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.`,
    (g, me, forms) => {
      console.warn(`[Feature Not Complete] Wild Shape (on ${me.name})`);
      me.initResource(WildShapeResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new WildShapeAction(g, me, forms));
      });
    }
  );
  var WildShape_default = WildShape;

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
    "Druid",
    DruidIcon
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
      [2, [WildShape_default, WildCompanion]],
      [4, [ASI45, CantripVersatility]],
      [8, [ASI85]],
      [12, [ASI125]],
      [16, [ASI165]],
      [18, [TimelessBody, BeastSpells]],
      [19, [ASI195]],
      [20, [Archdruid]]
    ])
  };
  var druid_default2 = Druid;

  // src/spells/level2/Blur.ts
  var BlurEffect = new Effect("Blur", "turnStart", (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
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
    description: `Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster) {
      const duration = minutes(1);
      await caster.addEffect(BlurEffect, { duration }, caster);
      await caster.concentrateOn({
        spell: Blur,
        duration,
        async onSpellEnd() {
          await caster.removeEffect(BlurEffect);
        }
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
    description: `Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it's impossible to track which image is real. You can use your action to dismiss the illusory duplicates.

  Each time a creature targets you with an attack during the spell's duration, roll a d20 to determine whether the attack instead targets one of your duplicates.

  If you have three duplicates, you must roll a 6 or higher to change the attack's target to a duplicate. With two duplicates, you must roll an 8 or higher. With one duplicate, you must roll an 11 or higher.

  A duplicate's AC equals 10 + your Dexterity modifier. If an attack hits a duplicate, the duplicate is destroyed. A duplicate can be destroyed only by an attack that hits it. It ignores all other damage and effects. The spell ends when all three duplicates are destroyed.

  A creature is unaffected by this spell if it can't see, if it relies on senses other than sight, such as blindsight, or if it can perceive illusions as false, as with truesight.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method, config) {
    }
  });
  var MirrorImage_default = MirrorImage;

  // src/spells/level2/MistyStep.ts
  var MistyStep = simpleSpell({
    status: "implemented",
    name: "Misty Step",
    level: 2,
    school: "Conjuration",
    time: "bonus action",
    v: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    description: `Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see.`,
    getConfig: (g) => ({ point: new PointResolver(g, 30) }),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method, { point }) {
      await g.move(caster, point, getTeleportation(30, "Misty Step"));
    }
  });
  var MistyStep_default = MistyStep;

  // src/spells/level2/Silence.ts
  var getSilenceArea = (centre) => ({
    type: "sphere",
    radius: 20,
    centre
  });
  var SilenceController = class {
    constructor(g, centre, shape = getSilenceArea(centre), area = new ActiveEffectArea(
      "Silence",
      shape,
      arSet("silenced"),
      "purple"
    ), squares = resolveArea(shape)) {
      this.g = g;
      this.centre = centre;
      this.shape = shape;
      this.area = area;
      this.squares = squares;
      this.onSpellEnd = async () => {
        this.g.removeEffectArea(this.area);
        for (const cleanup of this.subscriptions)
          cleanup();
      };
      this.subscriptions = [
        g.events.on(
          "GetDamageResponse",
          ({ detail: { damageType, who, response } }) => {
            if (damageType === "thunder" && this.entirelyContains(who))
              response.add("immune", Silence);
          }
        ),
        g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
          if (this.entirelyContains(who))
            conditions.add("Deafened", Silence);
        }),
        g.events.on("CheckAction", ({ detail: { action, error } }) => {
          if (action instanceof CastSpell && action.spell.v)
            error.add("silenced", Silence);
        })
      ];
      g.addEffectArea(area);
    }
    entirelyContains(who) {
      const position = this.g.getState(who).position;
      const squares = getSquares(who, position);
      for (const square of squares) {
        if (!this.squares.has(square))
          return false;
      }
      return true;
    }
  };
  var Silence = simpleSpell({
    status: "implemented",
    name: "Silence",
    level: 2,
    ritual: true,
    school: "Illusion",
    concentration: true,
    v: true,
    s: true,
    lists: ["Bard", "Cleric", "Ranger"],
    description: `For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.`,
    getConfig: (g) => ({ point: new PointResolver(g, 120) }),
    getAffectedArea: (g, caster, { point }) => point && [getSilenceArea(point)],
    getTargets: () => [],
    async apply(g, caster, method, { point }) {
      const controller = new SilenceController(g, point);
      await caster.concentrateOn({
        spell: Silence,
        duration: minutes(10),
        onSpellEnd: controller.onSpellEnd
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
    description: `Until the spell ends, one willing creature you touch gains the ability to move up, down, and across vertical surfaces and upside down along ceilings, while leaving its hands free. The target also gains a climbing speed equal to its walking speed.`,
    getConfig: (g, caster) => ({
      target: new TargetResolver(g, caster.reach, [isAlly])
    }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
    }
  });
  var SpiderClimb_default = SpiderClimb;

  // src/img/spl/spike-growth.svg
  var spike_growth_default = "./spike-growth-CD24K45V.svg";

  // src/spells/level2/SpikeGrowth.ts
  var SpikeGrowth = simpleSpell({
    status: "incomplete",
    name: "Spike Growth",
    icon: makeIcon(spike_growth_default, DamageColours.piercing),
    level: 2,
    school: "Transmutation",
    v: true,
    s: true,
    m: "seven sharp thorns or seven small twigs, each sharpened to a point",
    concentration: true,
    lists: ["Druid", "Ranger"],
    description: `The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.

  The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.`,
    getConfig: (g) => ({ point: new PointResolver(g, 150) }),
    getAffectedArea: (g, caster, { point }) => point && [{ type: "sphere", centre: point, radius: 20 }],
    getTargets: () => [],
    async apply(g, attacker, method, { point }) {
      const area = new ActiveEffectArea(
        "Spike Growth",
        { type: "sphere", centre: point, radius: 20 },
        arSet("difficult terrain", "plants"),
        "green"
      );
      g.addEffectArea(area);
      const spiky = resolveArea(area.shape);
      const unsubscribe = g.events.on(
        "CombatantMoved",
        ({ detail: { who, position, interrupt } }) => {
          const squares = getSquares(who, position);
          if (spiky.overlaps(squares))
            interrupt.add(
              new EvaluateLater(who, SpikeGrowth, async () => {
                const amount = await g.rollDamage(2, {
                  source: SpikeGrowth,
                  attacker,
                  target: who,
                  size: 4,
                  damageType: "piercing",
                  spell: SpikeGrowth,
                  method
                });
                await g.damage(
                  SpikeGrowth,
                  "piercing",
                  { attacker, target: who, spell: SpikeGrowth, method },
                  [["piercing", amount]]
                );
              })
            );
        }
      );
      attacker.concentrateOn({
        spell: SpikeGrowth,
        duration: minutes(10),
        async onSpellEnd() {
          g.removeEffectArea(area);
          unsubscribe();
        }
      });
    }
  });
  var SpikeGrowth_default = SpikeGrowth;

  // src/img/spl/lightning-bolt.svg
  var lightning_bolt_default = "./lightning-bolt-MGFW7XHW.svg";

  // src/spells/level3/LightningBolt.ts
  var getLightningBoltArea = (g, actor, point) => aimLine(g.getState(actor).position, actor.sizeInUnits, point, 100, 5);
  var LightningBolt = scalingSpell({
    status: "implemented",
    name: "Lightning Bolt",
    icon: makeIcon(lightning_bolt_default, DamageColours.lightning),
    level: 3,
    school: "Evocation",
    v: true,
    s: true,
    m: "a bit of fur and a rod of amber, crystal, or glass",
    lists: ["Sorcerer", "Wizard"],
    description: `A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much damage on a successful one.

  The lightning ignites flammable objects in the area that aren't being worn or carried.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.`,
    getConfig: (g) => ({ point: new PointResolver(g, 100) }),
    getDamage: (g, caster, method, { slot }) => [
      _dd((slot != null ? slot : 3) + 5, 6, "lightning")
    ],
    getAffectedArea: (g, caster, { point }) => point && [getLightningBoltArea(g, caster, point)],
    getTargets: (g, caster, { point }) => g.getInside(getLightningBoltArea(g, caster, point)),
    async apply(g, attacker, method, { slot, point }) {
      const damage = await g.rollDamage(5 + slot, {
        source: LightningBolt,
        size: 6,
        spell: LightningBolt,
        method,
        damageType: "lightning",
        attacker
      });
      for (const target of g.getInside(
        getLightningBoltArea(g, attacker, point)
      )) {
        const save = await g.save({
          source: LightningBolt,
          type: method.getSaveType(attacker, LightningBolt, slot),
          attacker,
          ability: "dex",
          spell: LightningBolt,
          method,
          who: target
        });
        await g.damage(
          LightningBolt,
          "lightning",
          { attacker, spell: LightningBolt, method, target },
          [["lightning", damage]],
          save.damageResponse
        );
      }
    }
  });
  var LightningBolt_default = LightningBolt;

  // src/spells/level3/MeldIntoStone.ts
  var MeldIntoStone = simpleSpell({
    name: "Meld into Stone",
    level: 3,
    ritual: true,
    school: "Transmutation",
    v: true,
    s: true,
    lists: ["Cleric", "Druid"],
    description: `You step into a stone object or surface large enough to fully contain your body, melding yourself and all the equipment you carry with the stone for the duration. Using your movement, you step into the stone at a point you can touch. Nothing of your presence remains visible or otherwise detectable by nonmagical senses.

  While merged with the stone, you can't see what occurs outside it, and any Wisdom (Perception) checks you make to hear sounds outside it are made with disadvantage. You remain aware of the passage of time and can cast spells on yourself while merged in the stone. You can use your movement to leave the stone where you entered it, which ends the spell. You otherwise can't move.

  Minor physical damage to the stone doesn't harm you, but its partial destruction or a change in its shape (to the extent that you no longer fit within it) expels you and deals 6d6 bludgeoning damage to you. The stone's complete destruction (or transmutation into a different substance) expels you and deals 50 bludgeoning damage to you. If expelled, you fall prone in an unoccupied space closest to where you first entered.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method, config) {
    }
  });
  var MeldIntoStone_default = MeldIntoStone;

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
    description: `Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused.

  The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.

  If a creature starts its turn in the spell's area and is concentrating on a spell, the creature must make a successful Constitution saving throw against your spell save DC or lose concentration.`,
    getConfig: (g) => ({ point: new PointResolver(g, 150) }),
    getAffectedArea: (g, caster, { point }) => point && [{ type: "cylinder", centre: point, radius: 40, height: 20 }],
    getTargets: () => [],
    async apply(g, caster, method, { point }) {
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
    description: `You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration.

  An affected target's speed is halved, it takes a \u22122 penalty to AC and Dexterity saving throws, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both. Regardless of the creature's abilities or magic items, it can't make more than one melee or ranged attack during its turn.

  If the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until the creature's next turn, and the creature must use its action on that turn to complete the spell. If it can't, the spell is wasted.

  A creature affected by this spell makes another Wisdom saving throw at the end of each of its turns. On a successful save, the effect ends for it.`,
    getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 6, 120, []) }),
    getTargets: (g, caster, { targets }) => targets,
    check(g, config, ec) {
      return ec;
    },
    async apply(g, caster, method, { targets }) {
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
    description: `This spell grants up to ten willing creatures you can see within range the ability to breathe underwater until the spell ends. Affected creatures also retain their normal mode of respiration.`,
    getConfig: (g) => ({
      targets: new MultiTargetResolver(g, 1, 10, 30, [canSee])
    }),
    getTargets: (g, caster, { targets }) => targets,
    async apply(g, caster, method, config) {
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
    description: `This spell grants the ability to move across any liquid surface\u2014such as water, acid, mud, snow, quicksand, or lava\u2014as if it were harmless solid ground (creatures crossing molten lava can still take damage from the heat). Up to ten willing creatures you can see within range gain this ability for the duration.

  If you target a creature submerged in a liquid, the spell carries the target to the surface of the liquid at a rate of 60 feet per round.`,
    getConfig: (g) => ({
      targets: new MultiTargetResolver(g, 1, 10, 30, [canSee])
    }),
    getTargets: (g, caster, { targets }) => targets,
    async apply(g, caster, method, config) {
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
    description: `Until the spell ends, you control any freestanding water inside an area you choose that is a cube up to 100 feet on a side. You can choose from any of the following effects when you cast this spell. As an action on your turn, you can repeat the same effect or choose a different one.

  Flood. You cause the water level of all standing water in the area to rise by as much as 20 feet. If the area includes a shore, the flooding water spills over onto dry land.
  If you choose an area in a large body of water, you instead create a 20-foot tall wave that travels from one side of the area to the other and then crashes down. Any Huge or smaller vehicles in the wave's path are carried with it to the other side. Any Huge or smaller vehicles struck by the wave have a 25 percent chance of capsizing.

  The water level remains elevated until the spell ends or you choose a different effect. If this effect produced a wave, the wave repeats on the start of your next turn while the flood effect lasts.

  Part Water. You cause water in the area to move apart and create a trench. The trench extends across the spell's area, and the separated water forms a wall to either side. The trench remains until the spell ends or you choose a different effect. The water then slowly fills in the trench over the course of the next round until the normal water level is restored.
  Redirect Flow. You cause flowing water in the area to move in a direction you choose, even if the water has to flow over obstacles, up walls, or in other unlikely directions. The water in the area moves as you direct it, but once it moves beyond the spell's area, it resumes its flow based on the terrain conditions. The water continues to move in the direction you chose until the spell ends or you choose a different effect.
  Whirlpool. This effect requires a body of water at least 50 feet square and 25 feet deep. You cause a whirlpool to form in the center of the area. The whirlpool forms a vortex that is 5 feet wide at the base, up to 50 feet wide at the top, and 25 feet tall. Any creature or object in the water and within 25 feet of the vortex is pulled 10 feet toward it. A creature can swim away from the vortex by making a Strength (Athletics) check against your spell save DC.
  When a creature enters the vortex for the first time on a turn or starts its turn there, it must make a Strength saving throw. On a failed save, the creature takes 2d8 bludgeoning damage and is caught in the vortex until the spell ends. On a successful save, the creature takes half damage, and isn't caught in the vortex. A creature caught in the vortex can use its action to try to swim away from the vortex as described above, but has disadvantage on the Strength (Athletics) check to do so.

  The first time each turn that an object enters the vortex, the object takes 2d8 bludgeoning damage; this damage occurs each round it remains in the vortex.`,
    getConfig: () => ({}),
    getTargets: () => [],
    async apply(g, caster, method, config) {
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
    description: `You touch a willing creature. For the duration, the target's movement is unaffected by difficult terrain, and spells and other magical effects can neither reduce the target's speed nor cause the target to be paralyzed or restrained.

  The target can also spend 5 feet of movement to automatically escape from nonmagical restraints, such as manacles or a creature that has it grappled. Finally, being underwater imposes no penalties on the target's movement or attacks.`,
    getConfig: (g, caster) => ({
      target: new TargetResolver(g, caster.reach, [isAlly])
    }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
    }
  });
  var FreedomOfMovement_default = FreedomOfMovement;

  // src/spells/level4/IceStorm.ts
  var getIceStormArea = (centre) => ({
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
    description: `A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.

  Hailstones turn the storm's area of effect into difficult terrain until the end of your next turn.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.`,
    getConfig: (g) => ({ point: new PointResolver(g, 300) }),
    getAffectedArea: (g, caster, { point }) => point && [getIceStormArea(point)],
    getTargets: (g, caster, { point }) => g.getInside(getIceStormArea(point)),
    getDamage: (g, caster, method, { slot }) => [
      _dd((slot != null ? slot : 4) - 2, 8, "bludgeoning"),
      _dd(4, 6, "cold")
    ],
    async apply(g, caster, method, config) {
    }
  });
  var IceStorm_default = IceStorm;

  // src/spells/level4/Stoneskin.ts
  var StoneskinEffect = new Effect("Stoneskin", "turnStart", (g) => {
    g.events.on(
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
    description: `This spell turns the flesh of a willing creature you touch as hard as stone. Until the spell ends, the target has resistance to nonmagical bludgeoning, piercing, and slashing damage.`,
    getConfig: (g, caster) => ({
      target: new TargetResolver(g, caster.reach, [isAlly])
    }),
    getTargets: (g, caster, { target }) => [target],
    async apply(g, caster, method, { target }) {
      const duration = hours(1);
      await target.addEffect(StoneskinEffect, { duration }, caster);
      await caster.concentrateOn({
        spell: Stoneskin,
        duration,
        async onSpellEnd() {
          await target.removeEffect(StoneskinEffect);
        }
      });
    }
  });
  var Stoneskin_default = Stoneskin;

  // src/spells/level5/ConeOfCold.ts
  var getConeOfColdArea = (g, caster, target) => ({
    type: "cone",
    radius: 60,
    centre: g.getState(caster).position,
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
    description: `A blast of cold air erupts from your hands. Each creature in a 60-foot cone must make a Constitution saving throw. A creature takes 8d8 cold damage on a failed save, or half as much damage on a successful one.

  A creature killed by this spell becomes a frozen statue until it thaws.

  At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the damage increases by 1d8 for each slot level above 5th.`,
    getConfig: (g) => ({ point: new PointResolver(g, 60) }),
    getDamage: (g, caster, method, { slot }) => [_dd(3 + (slot != null ? slot : 5), 8, "cold")],
    getAffectedArea: (g, caster, { point }) => point && [getConeOfColdArea(g, caster, point)],
    getTargets: (g, caster, { point }) => g.getInside(getConeOfColdArea(g, caster, point)),
    async apply(g, attacker, method, { slot, point }) {
      const damage = await g.rollDamage(3 + slot, {
        source: ConeOfCold,
        size: 8,
        spell: ConeOfCold,
        method,
        damageType: "cold",
        attacker
      });
      for (const target of g.getInside(getConeOfColdArea(g, attacker, point))) {
        const save = await g.save({
          source: ConeOfCold,
          type: method.getSaveType(attacker, ConeOfCold, slot),
          attacker,
          ability: "con",
          spell: ConeOfCold,
          method,
          who: target
        });
        await g.damage(
          ConeOfCold,
          "cold",
          { attacker, spell: ConeOfCold, method, target },
          [["cold", damage]],
          save.damageResponse
        );
      }
    }
  });
  var ConeOfCold_default = ConeOfCold;

  // src/classes/druid/Land/index.ts
  var BonusCantrip = new ConfiguredFeature(
    "Bonus Cantrip",
    `You learn one additional druid cantrip of your choice. This cantrip doesn't count against the number of druid cantrips you know.`,
    (g, me, spell) => {
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
      // { level: 9, spell: CommuneWithNature },
      { level: 9, spell: ConeOfCold_default }
    ],
    coast: [
      { level: 3, spell: MirrorImage_default },
      { level: 3, spell: MistyStep_default },
      { level: 5, spell: WaterBreathing_default },
      { level: 5, spell: WaterWalk_default },
      { level: 7, spell: ControlWater_default },
      { level: 7, spell: FreedomOfMovement_default }
      // { level: 9, spell: ConjureElemental },
      // { level: 9, spell: Scrying },
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
      { level: 7, spell: FreedomOfMovement_default }
      // { level: 9, spell: CommuneWithNature },
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
      { level: 5, spell: MeldIntoStone_default },
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
      { level: 7, spell: FreedomOfMovement_default }
      // { level: 7, spell: LocateCreature },
      // { level: 9, spell: InsectPlague },
      // { level: 9, spell: Scrying },
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
    (g, me, type) => {
      const feature = bonusSpellsFeatures.get(type);
      feature == null ? void 0 : feature.setup(g, me);
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
    setup(g, item) {
      item.name = `silvered ${item.name}`;
      g.events.on("BeforeAttack", ({ detail: { weapon, ammo, tags } }) => {
        if (weapon === item || ammo === item)
          tags.add("silvered");
      });
    }
  };
  var silvered_default = silvered;

  // src/img/eq/hood.svg
  var hood_default = "./hood-NYMML4K2.svg";

  // src/items/CloakOfElvenkind.ts
  var CloakHoodAction = class extends AbstractAction {
    constructor(g, actor, cloak) {
      super(
        g,
        actor,
        cloak.hoodUp ? "Pull Hood Down" : "Pull Hood Up",
        "incomplete",
        {},
        { icon: cloak.icon, time: "action" }
      );
      this.cloak = cloak;
    }
    async apply() {
      await super.apply({});
      this.cloak.hoodUp = !this.cloak.hoodUp;
    }
  };
  var CloakOfElvenkind = class extends AbstractWondrous {
    constructor(g, hoodUp = true) {
      super(g, "Cloak of Elvenkind", 0, hood_default);
      this.hoodUp = hoodUp;
      this.attunement = true;
      this.rarity = "Uncommon";
      const cloaked = (who) => isEquipmentAttuned(this, who) && this.hoodUp;
      g.events.on(
        "BeforeCheck",
        ({ detail: { who, target, skill, diceType } }) => {
          if (skill === "Perception" && cloaked(target))
            diceType.add("disadvantage", this);
          if (skill === "Stealth" && cloaked(who))
            diceType.add("advantage", this);
        }
      );
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (isEquipmentAttuned(this, who))
          actions.push(new CloakHoodAction(g, who, this));
      });
    }
  };

  // src/items/shields.ts
  var ArrowCatchingShield = class extends Shield {
    constructor(g) {
      super(g);
      this.name = "Arrow-Catching Shield";
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("GetAC", ({ detail: { who, pre, bonus } }) => {
        if (who.equipment.has(this) && (pre == null ? void 0 : pre.tags.has("ranged")))
          bonus.add(2, this);
      });
    }
  };

  // src/img/tok/bat.png
  var bat_default = "./bat-N3PIK5K4.png";

  // src/monsters/Bat.ts
  var Bite = class extends AbstractWeapon {
    constructor(g) {
      super(g, "Bite", "natural", "melee", {
        type: "flat",
        amount: 1,
        damageType: "piercing"
      });
      this.hands = 0;
      this.forceAbilityScore = "dex";
    }
  };
  var Bat = class extends Monster {
    constructor(g) {
      super(g, "bat", 0, "beast", "tiny", bat_default, 1);
      this.movement.set("speed", 5);
      this.movement.set("fly", 30);
      this.setAbilityScores(2, 15, 8, 2, 12, 4);
      this.senses.set("blindsight", 50);
      this.pb = 2;
      this.addFeature(KeenHearing);
      this.naturalWeapons.add(new Bite(g));
    }
  };

  // src/img/tok/giant-badger.png
  var giant_badger_default = "./giant-badger-R3QZK5QP.png";

  // src/monsters/GiantBadger.ts
  var Bite2 = class extends AbstractWeapon {
    constructor(g) {
      super(g, "Bite", "natural", "melee", _dd(1, 6, "piercing"));
      this.hands = 0;
    }
  };
  var Claws = class extends AbstractWeapon {
    constructor(g) {
      super(g, "Claws", "natural", "melee", _dd(2, 4, "slashing"));
      this.hands = 0;
    }
  };
  var GiantBadger = class extends Monster {
    constructor(g) {
      super(g, "giant badger", 0.25, "beast", "medium", giant_badger_default, 13);
      this.movement.set("speed", 30);
      this.movement.set("burrow", 10);
      this.setAbilityScores(13, 10, 15, 2, 12, 5);
      this.senses.set("darkvision", 30);
      this.pb = 2;
      this.addFeature(KeenSmell);
      this.addFeature(
        makeMultiattack(
          "The badger makes two attacks: one with its bite and one with its claws.",
          (me, action) => {
            if (me.attacksSoFar.length >= 2)
              return false;
            const weaponName = action.weapon.name;
            return !me.attacksSoFar.find(
              (a) => a.weapon.name === weaponName
            );
          }
        )
      );
      this.naturalWeapons.add(new Bite2(g));
      this.naturalWeapons.add(new Claws(g));
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
    (g, me) => {
      for (const weapon of ["battleaxe", "handaxe", "light hammer", "warhammer"])
        me.weaponProficiencies.add(weapon);
    }
  );
  var ToolProficiency = new ConfiguredFeature(
    "Tool Proficiency",
    `You gain proficiency with the artisan's tools of your choice: Smith's tools, brewer's supplies, or mason's tools.`,
    (g, me, tool) => {
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
    (g, me) => {
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

  // src/img/spl/magic-stone.svg
  var magic_stone_default = "./magic-stone-255GD6HJ.svg";

  // src/spells/cantrip/MagicStone.ts
  var MagicStoneIcon = makeIcon(magic_stone_default, DamageColours.bludgeoning);
  var MagicStoneResource = new TemporaryResource("Magic Stone", 3);
  var MagicStoneAction = class extends AbstractAttackAction {
    constructor(g, actor, method, unsubscribe) {
      super(
        g,
        actor,
        "Throw Magic Stone",
        "incomplete",
        { target: new TargetResolver(g, 60, [notSelf]) },
        {
          icon: MagicStoneIcon,
          damage: [_dd(1, 6, "bludgeoning")],
          resources: [[MagicStoneResource, 1]]
        }
      );
      this.method = method;
      this.unsubscribe = unsubscribe;
    }
    async apply({ target }) {
      await super.apply({ target });
      const { g, actor, method } = this;
      if (actor.getResource(MagicStoneResource) < 1)
        this.unsubscribe();
      const { attack, critical, hit } = await g.attack({
        who: actor,
        tags: atSet("ranged", "spell", "magical"),
        target,
        ability: method.ability,
        spell: MagicStone,
        method
      });
      if (hit) {
        const amount = await g.rollDamage(
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
        await g.damage(
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
    }
  };
  var MagicStone = simpleSpell({
    status: "incomplete",
    name: "Magic Stone",
    icon: MagicStoneIcon,
    level: 0,
    school: "Transmutation",
    time: "bonus action",
    v: true,
    s: true,
    lists: ["Artificer", "Druid", "Warlock"],
    description: `You touch one to three pebbles and imbue them with magic. You or someone else can make a ranged spell attack with one of the pebbles by throwing it or hurling it with a sling. If thrown, a pebble has a range of 60 feet. If someone else attacks with a pebble, that attacker adds your spellcasting ability modifier, not the attacker's, to the attack roll. On a hit, the target takes bludgeoning damage equal to 1d6 + your spellcasting ability modifier. Whether the attack hits or misses, the spell then ends on the stone.

  If you cast this spell again, the spell ends on any pebbles still affected by your previous casting.`,
    getConfig: () => ({}),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method) {
      caster.initResource(MagicStoneResource);
      const unsubscribe = g.events.on(
        "GetActions",
        ({ detail: { who, actions } }) => {
          if (who === caster && who.hasResource(MagicStoneResource))
            actions.push(new MagicStoneAction(g, who, method, unsubscribe));
        }
      );
    }
  });
  var MagicStone_default = MagicStone;

  // src/img/spl/earth-tremor.svg
  var earth_tremor_default = "./earth-tremor-EZT5PRHJ.svg";

  // src/spells/level1/EarthTremor.ts
  var getEarthTremorArea = (g, caster) => ({
    type: "within",
    radius: 10,
    target: caster,
    position: g.getState(caster).position
  });
  var EarthTremor = scalingSpell({
    status: "incomplete",
    name: "Earth Tremor",
    icon: makeIcon(earth_tremor_default, DamageColours.bludgeoning),
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Bard", "Druid", "Sorcerer", "Wizard"],
    description: `You cause a tremor in the ground within range. Each creature other than you in that area must make a Dexterity saving throw. On a failed save, a creature takes 1d6 bludgeoning damage and is knocked prone. If the ground in that area is loose earth or stone, it becomes difficult terrain until cleared, with each 5-foot-diameter portion requiring at least 1 minute to clear by hand.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,
    getConfig: () => ({}),
    getAffectedArea: (g, caster) => [getEarthTremorArea(g, caster)],
    getDamage: (g, caster, method, { slot }) => [
      _dd(slot != null ? slot : 1, 6, "bludgeoning")
    ],
    getTargets: () => [],
    async apply(g, attacker, method, { slot }) {
      const damage = await g.rollDamage(slot, {
        source: EarthTremor,
        size: 6,
        spell: EarthTremor,
        method,
        damageType: "bludgeoning",
        attacker
      });
      const shape = getEarthTremorArea(g, attacker);
      for (const target of g.getInside(shape, [attacker])) {
        const save = await g.save({
          source: EarthTremor,
          type: method.getSaveType(attacker, EarthTremor, slot),
          attacker,
          ability: "dex",
          spell: EarthTremor,
          method,
          who: target,
          fail: "normal",
          save: "zero"
        });
        if (save.damageResponse !== "zero") {
          await g.damage(
            EarthTremor,
            "bludgeoning",
            { attacker, spell: EarthTremor, method, target },
            [["bludgeoning", damage]],
            save.damageResponse
          );
          await target.addEffect(Prone, { duration: Infinity }, attacker);
        }
      }
      const area = new ActiveEffectArea(
        "Earth Tremor",
        shape,
        arSet("difficult terrain"),
        "brown"
      );
      g.addEffectArea(area);
    }
  });
  var EarthTremor_default = EarthTremor;

  // src/img/spl/moonbeam.svg
  var moonbeam_default = "./moonbeam-2AFBKWN7.svg";

  // src/resolvers/PointToPointResolver.ts
  var PointToPointResolver = class {
    constructor(g, startPoint, maxRange) {
      this.g = g;
      this.startPoint = startPoint;
      this.maxRange = maxRange;
      this.type = "Point";
    }
    get name() {
      if (this.maxRange === Infinity)
        return "any point";
      return `point within ${this.maxRange}' of start point`;
    }
    check(value, action, ec) {
      if (!isPoint(value))
        ec.add("No target", this);
      else {
        if (getDistanceBetween(this.startPoint, 1, value, 1) > this.maxRange)
          ec.add("Out of range", this);
      }
      return ec;
    }
  };

  // src/spells/level2/Moonbeam.ts
  var MoonbeamIcon = makeIcon(moonbeam_default, DamageColours.radiant);
  var getMoonbeamArea = (centre) => ({
    type: "cylinder",
    centre,
    height: 40,
    radius: 5
  });
  var MoveMoonbeamAction = class extends AbstractAction {
    constructor(g, controller) {
      super(
        g,
        controller.caster,
        "Move Moonbeam",
        "implemented",
        { point: new PointToPointResolver(g, controller.centre, 60) },
        {
          icon: MoonbeamIcon,
          time: "action",
          description: `On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.`
        }
      );
      this.controller = controller;
    }
    getAffectedArea({ point }) {
      if (point)
        return [getMoonbeamArea(point)];
    }
    async apply({ point }) {
      await super.apply({ point });
      this.controller.move(point);
    }
  };
  var MoonbeamController = class {
    constructor(g, caster, method, centre, slot) {
      this.g = g;
      this.caster = caster;
      this.method = method;
      this.centre = centre;
      this.slot = slot;
      this.onSpellEnd = async () => {
        this.g.removeEffectArea(this.area);
        for (const cleanup of this.subscriptions)
          cleanup();
      };
      this.shape = getMoonbeamArea(centre);
      this.area = new ActiveEffectArea(
        "Moonbeam",
        this.shape,
        arSet("dim light"),
        "yellow"
      );
      g.addEffectArea(this.area);
      this.hasBeenATurn = false;
      this.hurtThisTurn = /* @__PURE__ */ new Set();
      this.subscriptions = [];
      this.subscriptions.push(
        g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
          this.hurtThisTurn.clear();
          if (who === this.caster)
            this.hasBeenATurn = true;
          if (g.getInside(this.shape).includes(who))
            interrupt.add(this.getDamager(who));
        }),
        g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
          if (g.getInside(this.shape).includes(who))
            interrupt.add(this.getDamager(who));
        })
      );
      this.subscriptions.push(
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === this.caster && this.hasBeenATurn)
            actions.push(new MoveMoonbeamAction(g, this));
        })
      );
    }
    getDamager(target) {
      const { hurtThisTurn, g, slot, caster: attacker, method } = this;
      return new EvaluateLater(target, Moonbeam, async () => {
        if (hurtThisTurn.has(target))
          return;
        hurtThisTurn.add(target);
        const damage = await g.rollDamage(slot, {
          attacker,
          damageType: "radiant",
          method,
          size: 10,
          source: Moonbeam,
          spell: Moonbeam,
          target
        });
        const { damageResponse } = await g.save({
          source: Moonbeam,
          type: method.getSaveType(attacker, Moonbeam),
          ability: "con",
          attacker,
          method,
          spell: Moonbeam,
          who: target
        });
        await g.damage(
          Moonbeam,
          "radiant",
          { attacker, method, spell: Moonbeam, target },
          [["radiant", damage]],
          damageResponse
        );
      });
    }
    move(centre) {
      this.g.removeEffectArea(this.area);
      this.centre = centre;
      this.shape.centre = centre;
      this.g.addEffectArea(this.area);
    }
  };
  var Moonbeam = scalingSpell({
    status: "incomplete",
    name: "Moonbeam",
    icon: MoonbeamIcon,
    level: 2,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "several seeds of any moonseed plant and a piece of opalescent feldspar",
    lists: ["Druid"],
    description: `A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high cylinder centered on a point within range. Until the spell ends, dim light fills the cylinder.

  When a creature enters the spell's area for the first time on a turn or starts its turn there, it is engulfed in ghostly flames that cause searing pain, and it must make a Constitution saving throw. It takes 2d10 radiant damage on a failed save, or half as much damage on a successful one.

  A shapechanger makes its saving throw with disadvantage. If it fails, it also instantly reverts to its original form and can't assume a different form until it leaves the spell's light.

  On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.

  At Higher Levels. When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d10 for each slot level above 2nd.`,
    getConfig: (g) => ({ point: new PointResolver(g, 120) }),
    getAffectedArea: (g, caster, { point }) => point && [getMoonbeamArea(point)],
    getDamage: (g, caster, method, { slot }) => [_dd(slot != null ? slot : 2, 10, "radiant")],
    getTargets: () => [],
    async apply(g, caster, method, { point, slot }) {
      const controller = new MoonbeamController(g, caster, method, point, slot);
      caster.concentrateOn({
        duration: minutes(1),
        spell: Moonbeam,
        onSpellEnd: controller.onSpellEnd
      });
    }
  });
  var Moonbeam_default = Moonbeam;

  // src/img/spl/erupting-earth.svg
  var erupting_earth_default = "./erupting-earth-NCHHCQWD.svg";

  // src/spells/level3/EruptingEarth.ts
  var getEruptingEarthArea = (centre) => ({
    type: "cube",
    length: 20,
    centre
  });
  var EruptingEarth = scalingSpell({
    status: "incomplete",
    name: "Erupting Earth",
    icon: makeIcon(erupting_earth_default, DamageColours.bludgeoning),
    level: 3,
    school: "Evocation",
    v: true,
    s: true,
    m: "a piece of obsidian",
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `Choose a point you can see on the ground within range. A fountain of churned earth and stone erupts in a 20-foot cube centered on that point. Each creature in that area must make a Dexterity saving throw. A creature takes 3d12 bludgeoning damage on a failed save, or half as much damage on a successful one. Additionally, the ground in that area becomes difficult terrain until cleared. Each 5-foot-square portion of the area requires at least 1 minute to clear by hand.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d12 for each slot level above 3rd.`,
    getConfig: (g) => ({ point: new PointResolver(g, 120) }),
    getAffectedArea: (g, caster, { point }) => point && [getEruptingEarthArea(point)],
    getDamage: (g, caster, method, { slot }) => [
      _dd(slot != null ? slot : 3, 12, "bludgeoning")
    ],
    getTargets: () => [],
    async apply(g, attacker, method, { point, slot }) {
      const damage = await g.rollDamage(slot, {
        source: EruptingEarth,
        size: 12,
        spell: EruptingEarth,
        method,
        damageType: "bludgeoning",
        attacker
      });
      const shape = getEruptingEarthArea(point);
      for (const target of g.getInside(shape)) {
        const save = await g.save({
          source: EruptingEarth,
          type: method.getSaveType(attacker, EruptingEarth, slot),
          attacker,
          ability: "dex",
          spell: EruptingEarth,
          method,
          who: target
        });
        await g.damage(
          EruptingEarth,
          "bludgeoning",
          { attacker, spell: EruptingEarth, method, target },
          [["bludgeoning", damage]],
          save.damageResponse
        );
      }
      const area = new ActiveEffectArea(
        "Erupting Earth",
        shape,
        arSet("difficult terrain"),
        "brown"
      );
      g.addEffectArea(area);
    }
  });
  var EruptingEarth_default = EruptingEarth;

  // src/spells/level4/GuardianOfNature.ts
  var PrimalBeast = "Primal Beast";
  var GreatTree = "Great Tree";
  var FormChoices = [
    { label: PrimalBeast, value: PrimalBeast },
    { label: GreatTree, value: GreatTree }
  ];
  var PrimalBeastEffect = new Effect(
    PrimalBeast,
    "turnStart",
    (g) => {
      g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
        if (who.hasEffect(PrimalBeastEffect))
          bonus.add(10, PrimalBeastEffect);
      });
      g.events.on("BeforeAttack", ({ detail: { who, ability, diceType } }) => {
        if (who.hasEffect(PrimalBeastEffect) && ability === "str")
          diceType.add("advantage", PrimalBeastEffect);
      });
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, interrupt, target, critical, map } }) => {
          if (attacker.hasEffect(PrimalBeastEffect) && (attack == null ? void 0 : attack.pre.tags.has("melee")) && attack.pre.tags.has("weapon"))
            interrupt.add(
              new EvaluateLater(attacker, PrimalBeastEffect, async () => {
                const amount = await g.rollDamage(
                  1,
                  {
                    source: PrimalBeastEffect,
                    attacker,
                    target,
                    size: 6,
                    damageType: "force"
                  },
                  critical
                );
                map.add("radiant", amount);
              })
            );
        }
      );
    },
    { tags: ["shapechange"] }
  );
  var GreatTreeEffect = new Effect(
    GreatTree,
    "turnStart",
    (g) => {
      g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
        if (who.hasEffect(GreatTreeEffect) && ability === "con")
          diceType.add("advantage", GreatTreeEffect);
      });
      g.events.on("BeforeAttack", ({ detail: { who, ability, diceType } }) => {
        if (who.hasEffect(GreatTreeEffect) && (ability === "dex" || ability === "wis"))
          diceType.add("advantage", GreatTreeEffect);
      });
    },
    { tags: ["shapechange"] }
  );
  var GuardianOfNature = simpleSpell({
    status: "incomplete",
    name: "Guardian of Nature",
    level: 4,
    school: "Transmutation",
    concentration: true,
    time: "bonus action",
    v: true,
    lists: ["Druid", "Ranger"],
    description: `A nature spirit answers your call and transforms you into a powerful guardian. The transformation lasts until the spell ends. You choose one of the following forms to assume: Primal Beast or Great Tree.

  Primal Beast. Bestial fur covers your body, your facial features become feral, and you gain the following benefits:
  - Your walking speed increases by 10 feet.
  - You gain darkvision with a range of 120 feet.
  - You make Strength-based attack rolls with advantage.
  - Your melee weapon attacks deal an extra 1d6 force damage on a hit.

  Great Tree. Your skin appears barky, leaves sprout from your hair, and you gain the following benefits:
  - You gain 10 temporary hit points.
  - You make Constitution saving throws with advantage.
  - You make Dexterity- and Wisdom-based attack rolls with advantage.
  - While you are on the ground, the ground within 15 feet of you is difficult terrain for your enemies.`,
    getConfig: (g) => ({ form: new ChoiceResolver(g, FormChoices) }),
    getTargets: (g, caster) => [caster],
    async apply(g, caster, method, { form }) {
      const duration = minutes(1);
      let effect = PrimalBeastEffect;
      if (form === GreatTree) {
        effect = GreatTreeEffect;
        await g.giveTemporaryHP(caster, 10, GreatTreeEffect);
      }
      await caster.addEffect(effect, { duration });
      caster.concentrateOn({
        duration,
        spell: GuardianOfNature,
        async onSpellEnd() {
          await caster.removeEffect(effect);
        }
      });
    }
  });
  var GuardianOfNature_default = GuardianOfNature;

  // src/pcs/davies/Salgar.ts
  var Salgar = class extends PC {
    constructor(g) {
      super(g, "Salgar", salgar_default);
      this.skills.set("Arcana", 1);
      this.skills.set("History", 1);
      this.setAbilityScores(10, 8, 14, 14, 15, 10);
      this.setRace(MountainDwarf);
      this.languages.add("Elvish");
      this.languages.add("Giant");
      this.addSubclass(Land_default);
      this.addClassLevel(druid_default2);
      this.addClassLevel(druid_default2);
      this.addClassLevel(druid_default2);
      this.addClassLevel(druid_default2);
      this.addClassLevel(druid_default2);
      this.addClassLevel(druid_default2);
      this.addClassLevel(druid_default2);
      this.setConfig(ToolProficiency, "mason's tools");
      this.setConfig(CircleSpells, "mountain");
      this.setConfig(BonusCantrip, MagicStone_default);
      this.setConfig(ASI45, { type: "ability", abilities: ["cha", "wis"] });
      this.setConfig(WildShape_default, [new Bat(g), new GiantBadger(g)]);
      this.skills.set("Insight", 1);
      this.skills.set("Survival", 1);
      this.don(new ArrowCatchingShield(g), true);
      this.don(new BootsOfTheWinterlands(g), true);
      this.don(new CloakOfElvenkind(g), true);
      this.don(new Spear(g, 1), true);
      this.don(new HideArmor(g));
      this.inventory.add(new Handaxe(g, 1));
      this.inventory.add(enchant(new Shortsword(g), silvered_default));
      this.addPreparedSpells(
        // TODO Druidcraft,
        // TODO Mending,
        // TODO MoldEarth,
        // TODO DetectMagic,
        EarthTremor_default,
        HealingWord_default,
        // TODO SpeakWithAnimals,
        LesserRestoration_default,
        // TODO LocateObject,
        Moonbeam_default,
        EruptingEarth_default,
        // TODO CharmMonster,
        GuardianOfNature_default
      );
    }
  };

  // src/ui/App.tsx
  var import_signals2 = __toESM(require_signals());
  var import_hooks17 = __toESM(require_hooks());

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
  var showSideHP = (0, import_signals.signal)([0]);
  var teleportInfo = (0, import_signals.signal)(void 0);
  var wantsCombatant = (0, import_signals.signal)(void 0);
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
    showSideHP,
    teleportInfo,
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
  var import_hooks7 = __toESM(require_hooks());

  // src/ui/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_1bit5_1",
    "panning": "_panning_1bit5_11"
  };

  // src/ui/BattlefieldEffect.tsx
  var import_hooks3 = __toESM(require_hooks());

  // src/ui/BattlefieldEffect.module.scss
  var BattlefieldEffect_module_default = {
    "main": "_main_1azly_1",
    "top": "_top_1azly_9",
    "square": "_square_1azly_13"
  };

  // src/ui/BattlefieldEffect.tsx
  function getAuraColour(tags) {
    if (tags.has("heavily obscured"))
      return "silver";
    if (tags.has("holy"))
      return "yellow";
    if (tags.has("plants"))
      return "green";
    if (tags.has("dim light"))
      return "skyblue";
  }
  function AffectedSquare({ point, tint, top = false }) {
    const style = (0, import_hooks3.useMemo)(
      () => ({
        left: point.x * scale.value,
        top: point.y * scale.value,
        width: scale.value * MapSquareSize,
        height: scale.value * MapSquareSize,
        backgroundColor: tint
      }),
      [point.x, point.y, tint]
    );
    return /* @__PURE__ */ o(
      "div",
      {
        className: classnames(BattlefieldEffect_module_default.square, { [BattlefieldEffect_module_default.top]: top }),
        style
      }
    );
  }
  function BattlefieldEffect({
    name = "Pending",
    shape,
    tags = /* @__PURE__ */ new Set(),
    top: onTop = false,
    tint = getAuraColour(tags)
  }) {
    const { points, left, top } = (0, import_hooks3.useMemo)(() => {
      const points2 = resolveArea(shape);
      const { x: left2, y: top2 } = points2.average(scale.value);
      return { points: points2, left: left2, top: top2 };
    }, [shape]);
    const squares = Array.from(points, (p, key) => /* @__PURE__ */ o(AffectedSquare, { point: p, tint: tint != null ? tint : "silver", top: onTop }, key));
    return /* @__PURE__ */ o(import_preact3.Fragment, { children: [
      /* @__PURE__ */ o(
        "div",
        {
          className: classnames(BattlefieldEffect_module_default.main, { [BattlefieldEffect_module_default.top]: onTop }),
          style: { left, top },
          children: name
        }
      ),
      squares
    ] });
  }

  // src/ui/hooks/usePanning.ts
  var import_hooks4 = __toESM(require_hooks());
  function usePanning(onPan) {
    const [isPanning, setIsPanning] = (0, import_hooks4.useState)(false);
    const [panStartCoords, setPanStartCoords] = (0, import_hooks4.useState)({ x: 0, y: 0 });
    const onMouseDown = (0, import_hooks4.useCallback)((e) => {
      if (e.button === 2) {
        setIsPanning(true);
        setPanStartCoords({ x: e.clientX, y: e.clientY });
      }
    }, []);
    const onMouseEnter = (0, import_hooks4.useCallback)((e) => {
      if (!e.button)
        setIsPanning(false);
    }, []);
    const onMouseMove = (0, import_hooks4.useCallback)(
      (e) => {
        if (isPanning) {
          const deltaX = e.clientX - panStartCoords.x;
          const deltaY = e.clientY - panStartCoords.y;
          onPan(-deltaX, -deltaY);
          setPanStartCoords({ x: e.clientX, y: e.clientY });
        }
      },
      [isPanning, onPan, panStartCoords.x, panStartCoords.y]
    );
    const onMouseUp = (0, import_hooks4.useCallback)(() => {
      setIsPanning(false);
    }, []);
    return {
      isPanning,
      onMouseDown,
      onMouseEnter,
      onMouseMove,
      onMouseUp
    };
  }

  // src/ui/Unit.tsx
  var import_hooks6 = __toESM(require_hooks());

  // src/ui/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_120hg_1",
    "token": "_token_120hg_11",
    "icons": "_icons_120hg_17"
  };

  // src/img/ui/missing-icon.svg
  var missing_icon_default = "./missing-icon-Y2QNJ6M4.svg";

  // src/ui/UnitEffectIcon.tsx
  function UnitEffectIcon({ effect }) {
    var _a, _b, _c;
    return /* @__PURE__ */ o("div", { title: effect.name, children: /* @__PURE__ */ o(
      SVGIcon,
      {
        src: (_b = (_a = effect.icon) == null ? void 0 : _a.url) != null ? _b : missing_icon_default,
        color: (_c = effect.icon) == null ? void 0 : _c.colour,
        size: 25
      }
    ) });
  }

  // src/ui/UnitHP.module.scss
  var UnitHP_module_default = {
    "hp": "_hp_1j4fd_1",
    "detailed": "_detailed_1j4fd_13",
    "detailedBar": "_detailedBar_1j4fd_17",
    "text": "_text_1j4fd_27",
    "ok": "_ok_1j4fd_35",
    "bloody": "_bloody_1j4fd_39",
    "down": "_down_1j4fd_43",
    "success": "_success_1j4fd_47",
    "failure": "_failure_1j4fd_51"
  };

  // src/ui/UnitHP.tsx
  function UnitDeathSaves({ u }) {
    return /* @__PURE__ */ o("div", { className: classnames(UnitHP_module_default.hp, UnitHP_module_default.down), children: /* @__PURE__ */ o("div", { className: UnitHP_module_default.text, children: [
      "Down: ",
      /* @__PURE__ */ o("span", { className: UnitHP_module_default.success, children: u.deathSaveSuccesses }),
      " /",
      " ",
      /* @__PURE__ */ o("span", { className: UnitHP_module_default.failure, children: u.deathSaveFailures })
    ] }) });
  }
  function UnitStable() {
    return /* @__PURE__ */ o("div", { className: classnames(UnitHP_module_default.hp, UnitHP_module_default.down), children: /* @__PURE__ */ o("span", { className: UnitHP_module_default.text, children: "Stable" }) });
  }
  function UnitDetailedHP({ u }) {
    if (u.effects.find((e) => e.effect === Stable))
      return /* @__PURE__ */ o(UnitStable, {});
    if (u.hp <= 0)
      return /* @__PURE__ */ o(UnitDeathSaves, { u });
    const width = `${u.hp * 100 / u.hpMax}%`;
    return /* @__PURE__ */ o("div", { className: classnames(UnitHP_module_default.hp, UnitHP_module_default.detailed), children: [
      /* @__PURE__ */ o("span", { className: UnitHP_module_default.detailedBar, style: { width } }),
      /* @__PURE__ */ o("span", { className: UnitHP_module_default.text, children: [
        u.hp,
        u.temporaryHP > 0 ? "+" : "",
        " / ",
        u.hpMax
      ] })
    ] });
  }
  var BriefData = {
    OK: "ok",
    Bloody: "bloody",
    Down: "down"
  };
  function UnitBriefHP({ u }) {
    const ratio = u.hp / u.hpMax;
    const status = ratio >= 0.5 ? "OK" : ratio > 0 ? "Bloody" : "Down";
    return /* @__PURE__ */ o(
      "div",
      {
        className: classnames(UnitHP_module_default.hp, UnitHP_module_default.brief, UnitHP_module_default[BriefData[status]]),
        children: /* @__PURE__ */ o("span", { className: UnitHP_module_default.text, children: [
          status,
          u.temporaryHP > 0 ? "+" : ""
        ] })
      }
    );
  }

  // src/img/ui/e.svg
  var e_default = "./e-DATSAPHV.svg";

  // src/img/ui/n.svg
  var n_default = "./n-2BLT76O4.svg";

  // src/img/ui/ne.svg
  var ne_default = "./ne-WAOZPP55.svg";

  // src/img/ui/nw.svg
  var nw_default = "./nw-EMUGHXVG.svg";

  // src/img/ui/s.svg
  var s_default = "./s-4OPBNP4F.svg";

  // src/img/ui/se.svg
  var se_default = "./se-XCDEOBHI.svg";

  // src/img/ui/sw.svg
  var sw_default = "./sw-NWNDSPVE.svg";

  // src/img/ui/w.svg
  var w_default = "./w-IMIMIJNF.svg";

  // src/ui/UnitMoveButton.tsx
  var import_hooks5 = __toESM(require_hooks());

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
    const { className, iconUrl, label } = (0, import_hooks5.useMemo)(
      () => buttonTypes[type],
      [type]
    );
    const clicked = (0, import_hooks5.useCallback)(
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
    const clicked = (0, import_hooks6.useCallback)(
      (e) => onClick(u.who, e),
      [onClick, u]
    );
    const moved = (0, import_hooks6.useCallback)(
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
            ] }),
            showSideHP.value.includes(u.side) ? /* @__PURE__ */ o(UnitDetailedHP, { u }) : /* @__PURE__ */ o(UnitBriefHP, { u }),
            /* @__PURE__ */ o("div", { className: Unit_module_default.icons, children: u.effects.map((effect, i) => /* @__PURE__ */ o(UnitEffectIcon, { effect }, i)) })
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
    const [offset, setOffset] = (0, import_hooks7.useState)({ x: 0, y: 0 });
    const { isPanning, onMouseDown, onMouseEnter, onMouseMove, onMouseUp } = usePanning(
      (dx, dy) => setOffset((old) => ({ x: old.x + dx, y: old.y + dy }))
    );
    const convertCoordinate = (0, import_hooks7.useCallback)((e) => {
      const x = round(Math.floor(e.pageX / scale.value), MapSquareSize);
      const y = round(Math.floor(e.pageY / scale.value), MapSquareSize);
      return { x, y };
    }, []);
    const onClick = (0, import_hooks7.useCallback)(
      (e) => onClickBattlefield(convertCoordinate(e), e),
      [convertCoordinate, onClickBattlefield]
    );
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      /* @__PURE__ */ o(
        "main",
        {
          className: classnames(Battlefield_module_default.main, { [Battlefield_module_default.panning]: isPanning }),
          "aria-label": "Battlefield",
          onClick,
          onMouseDown,
          onMouseEnter,
          onMouseMove,
          onMouseUp,
          onContextMenu: (e) => {
            e.preventDefault();
            return false;
          },
          children: /* @__PURE__ */ o("div", { style: { transform: `translate(${offset.x}px, ${offset.y}px)` }, children: [
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
            allEffects.value.map((effect) => /* @__PURE__ */ o(BattlefieldEffect, { ...effect }, effect.id)),
            ((_a = actionAreas.value) != null ? _a : []).map((shape, i) => /* @__PURE__ */ o(BattlefieldEffect, { shape, top: true }, `temp${i}`)),
            teleportInfo.value && /* @__PURE__ */ o(
              BattlefieldEffect,
              {
                shape: teleportInfo.value,
                top: true,
                name: "Teleport"
              },
              "teleport"
            )
          ] })
        }
      )
    );
  }

  // src/ui/BoundedMovePanel.tsx
  function BoundedMovePanel({ bounds, onFinish }) {
    return /* @__PURE__ */ o("aside", { className: common_module_default.panel, "aria-label": "Bounded Movement", children: [
      /* @__PURE__ */ o(Labelled, { label: bounds.handler.name, children: bounds.who.name }),
      /* @__PURE__ */ o("div", { children: [
        bounds.handler.teleportation ? "Teleport" : "Move",
        " up to",
        " ",
        bounds.handler.maximum,
        " feet."
      ] }),
      /* @__PURE__ */ o("button", { onClick: onFinish, disabled: bounds.handler.mustUseAll, children: "End Movement Early" })
    ] });
  }

  // src/ui/ChooseActionConfigPanel.tsx
  var import_hooks9 = __toESM(require_hooks());

  // src/ui/button.module.scss
  var button_module_default = {
    "active": "_active_10ff1_1"
  };

  // src/ui/ChooseActionConfigPanel.module.scss
  var ChooseActionConfigPanel_module_default = {
    "warning": "_warning_15trd_1",
    "description": "_description_15trd_10",
    "namePanel": "_namePanel_15trd_19",
    "name": "_name_15trd_19",
    "time": "_time_15trd_25"
  };

  // src/ui/CombatantRef.module.scss
  var CombatantRef_module_default = {
    "main": "_main_1rqki_1",
    "spaceBefore": "_spaceBefore_1rqki_5",
    "icon": "_icon_1rqki_9",
    "iconLabel": "_iconLabel_1rqki_15"
  };

  // src/ui/CombatantRef.tsx
  function CombatantRef({ who, spaceBefore = false }) {
    return /* @__PURE__ */ o(
      "div",
      {
        className: classnames(CombatantRef_module_default.main, { [CombatantRef_module_default.spaceBefore]: spaceBefore }),
        children: [
          /* @__PURE__ */ o("img", { className: CombatantRef_module_default.icon, src: who.img, alt: who.name }),
          /* @__PURE__ */ o("span", { className: CombatantRef_module_default.iconLabel, "aria-hidden": "true", children: who.name })
        ]
      }
    );
  }

  // src/ui/RangeInput.tsx
  var import_hooks8 = __toESM(require_hooks());

  // src/ui/RangeInput.module.scss
  var RangeInput_module_default = {
    "main": "_main_1k0vn_1",
    "min": "_min_1k0vn_7",
    "slider": "_slider_1k0vn_11",
    "max": "_max_1k0vn_15",
    "value": "_value_1k0vn_19"
  };

  // src/ui/RangeInput.tsx
  function RangeInput({ value, onChange, min, max }) {
    const changed = (0, import_hooks8.useCallback)(
      (e) => onChange(e.currentTarget.valueAsNumber),
      [onChange]
    );
    return /* @__PURE__ */ o("div", { className: RangeInput_module_default.main, children: [
      /* @__PURE__ */ o("div", { className: RangeInput_module_default.min, children: min }),
      /* @__PURE__ */ o(
        "input",
        {
          className: RangeInput_module_default.slider,
          type: "range",
          min,
          max,
          value,
          onChange: changed
        }
      ),
      /* @__PURE__ */ o("div", { className: RangeInput_module_default.max, children: max }),
      /* @__PURE__ */ o("div", { className: RangeInput_module_default.value, children: value })
    ] });
  }

  // src/ui/ChooseActionConfigPanel.tsx
  function ChooseTarget({ field, value, onChange }) {
    const setTarget = (0, import_hooks9.useCallback)(
      (who) => {
        onChange(field, who);
        wantsCombatant.value = void 0;
      },
      [field, onChange]
    );
    const onClick = (0, import_hooks9.useCallback)(() => {
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
    const addTarget = (0, import_hooks9.useCallback)(
      (who) => {
        if (who && !(value != null ? value : []).includes(who))
          onChange(field, (value != null ? value : []).concat(who));
        wantsCombatant.value = void 0;
      },
      [field, onChange, value]
    );
    const onClick = (0, import_hooks9.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== addTarget ? addTarget : void 0;
    }, [addTarget]);
    const remove = (0, import_hooks9.useCallback)(
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
    const setTarget = (0, import_hooks9.useCallback)(
      (p) => {
        onChange(field, p);
        wantsPoint.value = void 0;
      },
      [field, onChange]
    );
    const onClick = (0, import_hooks9.useCallback)(() => {
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
    const addPoint = (0, import_hooks9.useCallback)(
      (p) => {
        if (p)
          onChange(field, (value != null ? value : []).concat(p));
        wantsPoint.value = void 0;
      },
      [field, onChange, value]
    );
    const onClick = (0, import_hooks9.useCallback)(() => {
      wantsPoint.value = wantsPoint.value !== addPoint ? addPoint : void 0;
    }, [addPoint]);
    const remove = (0, import_hooks9.useCallback)(
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
    const [label, setLabel] = (0, import_hooks9.useState)("NONE");
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
  function ChooseMany({
    field,
    resolver,
    value,
    onChange
  }) {
    const [labels, setLabels] = (0, import_hooks9.useState)([]);
    const add = (0, import_hooks9.useCallback)(
      (ch) => {
        if (!(value != null ? value : []).find((x) => x === ch)) {
          onChange(field, (value != null ? value : []).concat(ch.value));
          setLabels((old) => old.concat(ch.label));
        }
      },
      [field, onChange, value]
    );
    const remove = (0, import_hooks9.useCallback)(
      (ch) => {
        onChange(
          field,
          (value != null ? value : []).filter((x) => x !== ch.value)
        );
        setLabels((old) => old.filter((x) => x !== ch.label));
      },
      [field, onChange, value]
    );
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        "Choice: ",
        labels.length ? labels.join(", ") : "NONE"
      ] }),
      /* @__PURE__ */ o("div", { children: resolver.entries.map((e) => {
        const selected = (value != null ? value : []).includes(e.value);
        const full = (value != null ? value : []).length > resolver.maximum;
        return /* @__PURE__ */ o(
          "button",
          {
            className: classnames({ [button_module_default.active]: selected }),
            "aria-pressed": selected,
            onClick: selected ? () => remove(e) : () => add(e),
            disabled: e.disabled || full,
            children: e.label
          },
          e.label
        );
      }) })
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
      /* @__PURE__ */ o(
        RangeInput,
        {
          min: resolver.min,
          max: resolver.max,
          value: value != null ? value : 0,
          onChange: (value2) => onChange(field, value2)
        }
      )
    ] });
  }
  function ChooseAllocations({
    field,
    resolver,
    value,
    onChange
  }) {
    const addTarget = (0, import_hooks9.useCallback)(
      (who) => {
        if (who && !(value != null ? value : []).find((e) => e.who === who))
          onChange(field, (value != null ? value : []).concat({ amount: 1, who }));
        wantsCombatant.value = void 0;
      },
      [field, onChange, value]
    );
    const onClick = (0, import_hooks9.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== addTarget ? addTarget : void 0;
    }, [addTarget]);
    const remove = (0, import_hooks9.useCallback)(
      (who) => onChange(
        field,
        (value != null ? value : []).filter((x) => x.who !== who)
      ),
      [field, onChange, value]
    );
    return /* @__PURE__ */ o("div", { children: [
      /* @__PURE__ */ o("div", { children: [
        resolver.rangeName,
        " (",
        describeRange(resolver.minimum, resolver.maximum),
        "):",
        (value != null ? value : []).length ? /* @__PURE__ */ o("ul", { children: (value != null ? value : []).map(({ amount, who }) => /* @__PURE__ */ o("li", { children: [
          /* @__PURE__ */ o(CombatantRef, { who }),
          " ",
          /* @__PURE__ */ o("button", { onClick: () => remove(who), children: [
            "remove ",
            who.name
          ] }),
          /* @__PURE__ */ o(
            RangeInput,
            {
              min: 0,
              max: resolver.maximum,
              value: amount,
              onChange: (amount2) => onChange(
                field,
                (value != null ? value : []).map(
                  (x) => x.who === who ? { amount: amount2, who } : x
                )
              )
            }
          )
        ] }, who.id)) }) : "NONE"
      ] }),
      /* @__PURE__ */ o(
        "button",
        {
          className: classnames({
            [button_module_default.active]: wantsCombatant.value === addTarget
          }),
          onClick,
          children: "Add Target"
        }
      )
    ] });
  }
  function getInitialConfig(action, initial) {
    const config = { ...initial };
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
    g,
    action,
    initialConfig = {},
    onCancel,
    onExecute
  }) {
    const [config, setConfig] = (0, import_hooks9.useState)(getInitialConfig(action, initialConfig));
    const patchConfig = (0, import_hooks9.useCallback)(
      (key, value) => setConfig((old) => ({ ...old, [key]: value })),
      []
    );
    (0, import_hooks9.useEffect)(() => {
      actionAreas.value = action.getAffectedArea(config);
    }, [action, activeCombatant.value, config]);
    const errors = (0, import_hooks9.useMemo)(
      () => getConfigErrors(g, action, config).messages,
      [g, action, config]
    );
    const disabled = (0, import_hooks9.useMemo)(() => errors.length > 0, [errors]);
    const damage = (0, import_hooks9.useMemo)(() => action.getDamage(config), [action, config]);
    const description = (0, import_hooks9.useMemo)(
      () => action.getDescription(config),
      [action, config]
    );
    const heal = (0, import_hooks9.useMemo)(() => action.getHeal(config), [action, config]);
    const time = (0, import_hooks9.useMemo)(() => action.getTime(config), [action, config]);
    const isReaction = time === "reaction";
    const execute = (0, import_hooks9.useCallback)(() => {
      if (checkConfig(g, action, config))
        onExecute(action, config);
    }, [g, action, config, onExecute]);
    const elements = (0, import_hooks9.useMemo)(
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
          return /* @__PURE__ */ o(ChooseTarget, { ...subProps });
        else if (resolver instanceof MultiTargetResolver)
          return /* @__PURE__ */ o(ChooseTargets, { ...subProps });
        else if (resolver instanceof PointResolver || resolver instanceof PointToPointResolver)
          return /* @__PURE__ */ o(ChoosePoint, { ...subProps });
        else if (resolver instanceof MultiPointResolver)
          return /* @__PURE__ */ o(ChoosePoints, { ...subProps });
        else if (resolver instanceof SlotResolver)
          return /* @__PURE__ */ o(ChooseSlot, { ...subProps });
        else if (resolver instanceof ChoiceResolver)
          return /* @__PURE__ */ o(ChooseText, { ...subProps });
        else if (resolver instanceof MultiChoiceResolver)
          return /* @__PURE__ */ o(ChooseMany, { ...subProps });
        else if (resolver instanceof NumberRangeResolver)
          return /* @__PURE__ */ o(ChooseNumber, { ...subProps });
        else if (resolver instanceof AllocationResolver)
          return /* @__PURE__ */ o(ChooseAllocations, { ...subProps });
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
      /* @__PURE__ */ o("div", { className: ChooseActionConfigPanel_module_default.namePanel, children: [
        /* @__PURE__ */ o("div", { className: ChooseActionConfigPanel_module_default.name, children: action.name }),
        /* @__PURE__ */ o("div", { className: ChooseActionConfigPanel_module_default.time, children: action.isAttack ? "attack" : time != null ? time : "no cost" })
      ] }),
      statusWarning,
      description && /* @__PURE__ */ o("div", { className: ChooseActionConfigPanel_module_default.description, children: description.split("\n").map((p, i) => /* @__PURE__ */ o("p", { children: p }, i)) }),
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
      !isReaction && /* @__PURE__ */ o(import_preact3.Fragment, { children: [
        /* @__PURE__ */ o("button", { disabled, onClick: execute, children: "Execute" }),
        /* @__PURE__ */ o("button", { onClick: onCancel, children: "Cancel" }),
        /* @__PURE__ */ o("div", { children: elements }),
        errors.length > 0 && /* @__PURE__ */ o(Labelled, { label: "Errors", children: errors.map((msg, i) => /* @__PURE__ */ o("div", { children: msg }, i)) })
      ] })
    ] });
  }

  // src/ui/EventLog.tsx
  var import_hooks11 = __toESM(require_hooks());

  // src/ui/EventLog.module.scss
  var EventLog_module_default = {
    "container": "_container_fnmiq_1",
    "main": "_main_fnmiq_14",
    "messageWrapper": "_messageWrapper_fnmiq_22",
    "message": "_message_fnmiq_22"
  };

  // src/ui/hooks/useTimeout.ts
  var import_hooks10 = __toESM(require_hooks());
  function useTimeout(handler, ms = void 0) {
    const [handle, setHandle] = (0, import_hooks10.useState)();
    const fire = (0, import_hooks10.useCallback)(
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
    const cancel = (0, import_hooks10.useCallback)(
      () => setHandle((old) => {
        if (old)
          clearTimeout(old);
        return void 0;
      }),
      []
    );
    (0, import_hooks10.useEffect)(() => cancel, [cancel]);
    return { cancel, fire, handle };
  }

  // src/ui/utils/messages.tsx
  var msgCombatant = (c, space = false) => ({
    element: /* @__PURE__ */ o(CombatantRef, { who: c, spaceBefore: space }),
    text: c.name
  });
  var msgDiceType = (dt) => dt !== "normal" ? { element: /* @__PURE__ */ o(import_preact3.Fragment, { children: [
    " at ",
    dt
  ] }), text: ` at ${dt}` } : void 0;
  var msgWeapon = (w) => w ? { element: /* @__PURE__ */ o(import_preact3.Fragment, { children: [
    " with ",
    w.name
  ] }), text: ` with ${w.name}` } : void 0;
  var msgSpell = (s) => s ? { element: /* @__PURE__ */ o(import_preact3.Fragment, { children: [
    " with ",
    s.name
  ] }), text: ` with ${s.name}` } : void 0;
  var msgAmmo = (a) => a ? { element: /* @__PURE__ */ o(import_preact3.Fragment, { children: [
    ", firing ",
    a.name
  ] }), text: `, firing ${a.name}` } : void 0;
  var msgUpcast = (spell, level) => level > spell.level ? { element: /* @__PURE__ */ o(import_preact3.Fragment, { children: [
    " at level ",
    level
  ] }), text: ` at level ${level}` } : void 0;
  var msgNonzero = (value, text) => value ? { element: /* @__PURE__ */ o(import_preact3.Fragment, { children: text }), text } : void 0;
  function getDamageEntryText([type, entry]) {
    return `${entry.amount} ${type}${entry.response !== "normal" ? ` ${entry.response}` : ""}`;
  }
  var dmgBreakdown = (breakdown) => ({
    element: /* @__PURE__ */ o(import_preact3.Fragment, { children: [
      "(",
      /* @__PURE__ */ o("div", { className: common_module_default.damageList, children: Array.from(breakdown, ([type, entry]) => /* @__PURE__ */ o("span", { children: getDamageEntryText([type, entry]) }, type)) }),
      ")"
    ] }),
    text: `(${Array.from(breakdown, getDamageEntryText).join(", ")})`
  });
  var getAttackMessage = ({
    pre: { who, target, weapon, ammo, spell },
    roll,
    total,
    ac,
    outcome
  }) => [
    msgCombatant(who),
    outcome === "miss" ? " misses " : outcome === "hit" ? " hits " : " CRITICALLY hits ",
    msgCombatant(target, true),
    msgDiceType(roll.diceType),
    msgWeapon(weapon),
    msgSpell(spell),
    msgAmmo(ammo),
    ` (${total}). (AC ${ac})`
  ];
  var getCastMessage = ({ level, spell, who }) => [
    msgCombatant(who),
    " casts ",
    spell.name,
    msgUpcast(spell, level),
    "."
  ];
  var getDamageMessage = ({
    who,
    total,
    breakdown
  }) => [
    msgCombatant(who),
    ` takes ${total} damage. `,
    dmgBreakdown(breakdown)
  ];
  var getDeathMessage = ({ who }) => [
    msgCombatant(who),
    " dies!"
  ];
  var getEffectAddedMessage = ({ who, effect }) => [
    msgCombatant(who),
    ` gains effect: ${effect.name}.`
  ];
  var getEffectRemovedMessage = ({
    who,
    effect
  }) => [
    msgCombatant(who),
    ` loses effect: ${effect.name}.`
  ];
  var getAbilityCheckMessage = ({
    diceType,
    roll: {
      type: { who, ability, skill }
    },
    total,
    dc
  }) => [
    msgCombatant(who),
    ` gets a ${total}`,
    msgDiceType(diceType),
    " on a ",
    describeAbility(ability),
    skill ? ` (${skill})` : void 0,
    ` ability check. (DC ${dc})`
  ];
  var getInitiativeMessage = ({
    diceType,
    type,
    value
  }) => [
    msgCombatant(type.who),
    ` gets a ${value}`,
    msgDiceType(diceType),
    " for initiative."
  ];
  var getSaveMessage = ({
    diceType,
    roll: {
      type: { who, ability, tags }
    },
    total,
    dc
  }) => [
    msgCombatant(who),
    ` gets a ${total}`,
    msgDiceType(diceType),
    " on a ",
    tags.has("death") ? "death" : ability ? describeAbility(ability) : "",
    ` saving throw. (DC ${dc})`
  ];
  var getHealedMessage = ({
    who,
    amount,
    fullAmount
  }) => [
    msgCombatant(who),
    ` heals for ${amount}`,
    msgNonzero(fullAmount - amount, ` (${fullAmount - amount} wasted)`),
    "."
  ];
  var getExhaustionMessage = ({ who, value }) => [
    msgCombatant(who),
    `now has ${value ? value : "no"} exhaustion.`
  ];

  // src/ui/EventLog.tsx
  function LogMessage({ message }) {
    const text = message.filter(isDefined).map((x) => typeof x === "string" ? x : x.text).join("");
    const children = message.filter(isDefined).map((x) => typeof x === "string" ? x : x.element);
    return /* @__PURE__ */ o("li", { "aria-label": text, className: EventLog_module_default.messageWrapper, children: /* @__PURE__ */ o("div", { "aria-hidden": "true", className: EventLog_module_default.message, children }) });
  }
  function EventLog({ g }) {
    const ref = (0, import_hooks11.useRef)(null);
    const [messages, setMessages] = (0, import_hooks11.useState)([]);
    const { fire } = useTimeout(
      () => {
        var _a, _b;
        return (_b = (_a = ref.current) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, { behavior: "smooth" });
      }
    );
    const addMessage = (0, import_hooks11.useCallback)((el) => {
      setMessages((old) => old.concat(el).slice(-50));
      fire();
    }, []);
    (0, import_hooks11.useEffect)(() => {
      g.events.on(
        "Attack",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getAttackMessage(detail) }))
      );
      g.events.on(
        "CombatantDamaged",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getDamageMessage(detail) }))
      );
      g.events.on(
        "CombatantHealed",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getHealedMessage(detail) }))
      );
      g.events.on(
        "CombatantDied",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getDeathMessage(detail) }))
      );
      g.events.on("EffectAdded", ({ detail }) => {
        if (!detail.effect.quiet)
          addMessage(/* @__PURE__ */ o(LogMessage, { message: getEffectAddedMessage(detail) }));
      });
      g.events.on("EffectRemoved", ({ detail }) => {
        if (!detail.effect.quiet)
          addMessage(/* @__PURE__ */ o(LogMessage, { message: getEffectRemovedMessage(detail) }));
      });
      g.events.on(
        "SpellCast",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getCastMessage(detail) }))
      );
      g.events.on("DiceRolled", ({ detail }) => {
        if (detail.type.type === "initiative")
          addMessage(
            /* @__PURE__ */ o(
              LogMessage,
              {
                message: getInitiativeMessage(
                  detail
                )
              }
            )
          );
      });
      g.events.on(
        "AbilityCheck",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getAbilityCheckMessage(detail) }))
      );
      g.events.on(
        "Save",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getSaveMessage(detail) }))
      );
      g.events.on(
        "Exhaustion",
        ({ detail }) => addMessage(/* @__PURE__ */ o(LogMessage, { message: getExhaustionMessage(detail) }))
      );
    }, [addMessage, g]);
    return /* @__PURE__ */ o("div", { className: EventLog_module_default.container, children: [
      /* @__PURE__ */ o("ul", { className: EventLog_module_default.main, "aria-label": "Event Log", children: messages }),
      /* @__PURE__ */ o("div", { ref })
    ] });
  }

  // src/ui/ListChoiceDialog.tsx
  var import_hooks13 = __toESM(require_hooks());

  // src/ui/Dialog.tsx
  var import_hooks12 = __toESM(require_hooks());

  // src/ui/Dialog.module.scss
  var Dialog_module_default = {
    "main": "_main_1hd4j_1",
    "shade": "_shade_1hd4j_5",
    "react": "_react_1hd4j_18",
    "title": "_title_1hd4j_24"
  };

  // src/ui/Dialog.tsx
  function ReactDialog({ title, text, children }) {
    const titleId = (0, import_hooks12.useId)();
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
    return /* @__PURE__ */ o(ReactDialog, { ...props });
  }

  // src/ui/ListChoiceDialog.tsx
  function ListChoiceDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks13.useCallback)(
      (value) => {
        chooseFromList.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    return /* @__PURE__ */ o(Dialog, { title: interruption.title, text: interruption.text, children: [
      interruption.items.map(({ label, value, disabled }) => /* @__PURE__ */ o("button", { disabled, onClick: () => decide(value), children: label }, label)),
      interruption.allowNone && /* @__PURE__ */ o("button", { onClick: () => decide(), children: "(None)" })
    ] });
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
  var import_hooks15 = __toESM(require_hooks());

  // src/ui/hooks/useList.ts
  var import_hooks14 = __toESM(require_hooks());
  function useList(initialValue = []) {
    const [list, setList] = (0, import_hooks14.useState)(initialValue);
    const toggle = (0, import_hooks14.useCallback)(
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
    const decide = (0, import_hooks15.useCallback)(() => {
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
  var getIconUrl = (item) => item.icon && item.icon.url;
  function getAllIcons(g) {
    return new Set(
      Array.from(g.combatants.keys()).flatMap((who) => [
        ...who.inventory,
        ...who.equipment,
        ...who.knownSpells,
        ...who.preparedSpells,
        ...who.spellcastingMethods
      ]).map(getIconUrl).filter(isDefined)
    );
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
      side,
      hp,
      hpMax,
      temporaryHP,
      deathSaveFailures,
      deathSaveSuccesses,
      effects: effectsMap,
      conditions: conditionsSet
    } = who;
    const effects = [];
    for (const [effect, config] of effectsMap) {
      if (effect.quiet)
        continue;
      effects.push({
        name: effect.name,
        icon: effect.icon,
        duration: config.duration,
        effect,
        config
      });
    }
    const conditions = [];
    for (const condition of conditionsSet)
      conditions.push(condition);
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
      side,
      hp,
      hpMax,
      temporaryHP,
      deathSaveFailures,
      deathSaveSuccesses,
      effects,
      conditions
    };
  }

  // src/ui/utils/UIResponse.ts
  var UISource = { name: "UI" };
  var UIResponse = class {
    constructor(who, apply) {
      this.who = who;
      this.apply = apply;
      this.source = UISource;
      this.priority = 0;
    }
  };

  // src/ui/YesNoDialog.tsx
  var import_hooks16 = __toESM(require_hooks());
  function YesNoDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks16.useCallback)(
      (value) => {
        chooseYesNo.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    const onYes = (0, import_hooks16.useCallback)(() => decide(true), [decide]);
    const onNo = (0, import_hooks16.useCallback)(() => decide(false), [decide]);
    return /* @__PURE__ */ o(Dialog, { title: interruption.title, text: interruption.text, children: [
      /* @__PURE__ */ o("button", { onClick: onYes, children: "Yes" }),
      /* @__PURE__ */ o("button", { onClick: onNo, children: "No" })
    ] });
  }

  // src/ui/App.tsx
  function App({ g, onMount }) {
    const cache2 = (0, import_hooks17.useContext)(SVGCacheContext);
    const [target, setTarget] = (0, import_hooks17.useState)();
    const [action, setAction] = (0, import_hooks17.useState)();
    const [actionMenu, setActionMenu] = (0, import_hooks17.useState)({
      show: false,
      x: NaN,
      y: NaN,
      items: []
    });
    const hideActionMenu = (0, import_hooks17.useCallback)(
      () => setActionMenu({ show: false, x: NaN, y: NaN, items: [] }),
      []
    );
    const refreshUnits = (0, import_hooks17.useCallback)(() => {
      const list = [];
      for (const [who, state] of g.combatants)
        list.push(getUnitData(who, state));
      allCombatants.value = list;
    }, [g]);
    const refreshAreas = (0, import_hooks17.useCallback)(() => {
      allEffects.value = Array.from(g.effects);
    }, [g]);
    const onFinishBoundedMove = (0, import_hooks17.useCallback)(() => {
      if (moveBounds.value) {
        moveBounds.value.detail.resolve();
        moveBounds.value = void 0;
        if (g.activeCombatant) {
          movingCombatantId.value = g.activeCombatant.id;
          moveHandler.value = getDefaultMovement(g.activeCombatant);
        }
      }
    }, [g]);
    const processMove = (0, import_hooks17.useCallback)(
      (mover) => {
        void mover.then((result) => {
          if (result.type === "error")
            console.warn(result.error.messages);
          else if (result.type === "unbind")
            onFinishBoundedMove();
          return result;
        });
      },
      [onFinishBoundedMove]
    );
    (0, import_hooks17.useEffect)(() => {
      const subscriptions = [
        g.events.on("CombatantPlaced", refreshUnits),
        g.events.on("CombatantMoved", refreshUnits),
        g.events.on("CombatantDied", refreshUnits),
        g.events.on("EffectAdded", refreshUnits),
        g.events.on("EffectRemoved", refreshUnits),
        g.events.on("AreaPlaced", refreshAreas),
        g.events.on("AreaRemoved", refreshAreas),
        g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
          interrupt.add(
            new UIResponse(who, async () => {
              activeCombatantId.value = who.id;
              moveHandler.value = getDefaultMovement(who);
              movingCombatantId.value = who.id;
              hideActionMenu();
              refreshUnits();
              allActions.value = g.getActions(who);
            })
          );
        }),
        g.events.on("ListChoice", (e) => chooseFromList.value = e),
        g.events.on("MultiListChoice", (e) => chooseManyFromList.value = e),
        g.events.on("YesNoChoice", (e) => chooseYesNo.value = e),
        g.events.on("BoundedMove", (e) => {
          const { who, handler } = e.detail;
          (0, import_signals2.batch)(() => {
            moveBounds.value = e;
            moveHandler.value = handler;
            movingCombatantId.value = who.id;
            if (handler.teleportation) {
              const shape = {
                type: "within",
                target: who,
                position: g.getState(who).position,
                radius: handler.maximum
              };
              teleportInfo.value = shape;
              const area = resolveArea(shape);
              wantsPoint.value = (p) => {
                if (p && area.has(p)) {
                  processMove(g.move(who, p, handler));
                  (0, import_signals2.batch)(() => {
                    wantsPoint.value = void 0;
                    teleportInfo.value = void 0;
                  });
                }
              };
            }
          });
        })
      ];
      onMount == null ? void 0 : onMount(g);
      for (const iconUrl of getAllIcons(g))
        cache2.get(iconUrl);
      return () => {
        for (const cleanup of subscriptions)
          cleanup();
      };
    }, [
      cache2,
      g,
      hideActionMenu,
      onMount,
      processMove,
      refreshAreas,
      refreshUnits
    ]);
    const onExecuteAction = (0, import_hooks17.useCallback)(
      (action2, config) => {
        setAction(void 0);
        actionAreas.value = void 0;
        void g.act(action2, config).then(() => {
          refreshUnits();
          const actions = g.getActions(action2.actor);
          allActions.value = actions;
          return actions;
        });
      },
      [g, refreshUnits]
    );
    const onClickAction = (0, import_hooks17.useCallback)(
      (action2) => {
        hideActionMenu();
        setAction(void 0);
        const point = target ? g.getState(target).position : void 0;
        const config = { target, point };
        if (checkConfig(g, action2, config)) {
          onExecuteAction(action2, config);
        } else
          console.warn(config, "does not match", action2.getConfig(config));
      },
      [g, hideActionMenu, onExecuteAction, target]
    );
    const onClickBattlefield = (0, import_hooks17.useCallback)(
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
    const onClickCombatant = (0, import_hooks17.useCallback)(
      (who, e) => {
        e.stopPropagation();
        const giveCombatant = wantsCombatant.peek();
        if (giveCombatant) {
          giveCombatant(who);
          return;
        }
        const givePoint = wantsPoint.peek();
        if (givePoint) {
          givePoint(g.getState(who).position);
          return;
        }
        setAction(void 0);
        actionAreas.value = void 0;
        const me = activeCombatant.value;
        if (me && !moveBounds.peek()) {
          setTarget(who);
          const items = allActions.value.map((action2) => {
            const testConfig = { target: who, point: g.getState(who).position };
            const invalidConfig = !checkConfig(g, action2, testConfig);
            const config = action2.getConfig(testConfig);
            const needsTarget = "target" in config || me.who === who;
            const needsPoint = "point" in config;
            const isReaction = action2.getTime(testConfig) === "reaction";
            return {
              label: action2.name,
              value: action2,
              disabled: invalidConfig || isReaction || !needsTarget && !needsPoint
            };
          }).filter((item) => !item.disabled);
          setActionMenu({ show: true, x: e.clientX, y: e.clientY, items });
        }
      },
      [g]
    );
    const onMoveCombatant = (0, import_hooks17.useCallback)(
      (who, dir) => {
        if (moveHandler.value) {
          hideActionMenu();
          processMove(g.moveInDirection(who, dir, moveHandler.value));
        }
      },
      [g, hideActionMenu, processMove]
    );
    const onPass = (0, import_hooks17.useCallback)(() => {
      setAction(void 0);
      actionAreas.value = void 0;
      void g.nextTurn();
    }, [g]);
    const onCancelAction = (0, import_hooks17.useCallback)(() => {
      setAction(void 0);
      actionAreas.value = void 0;
    }, []);
    const onChooseAction = (0, import_hooks17.useCallback)(
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
      actionMenu.show && /* @__PURE__ */ o(Menu, { caption: "Quick Actions", ...actionMenu, onClick: onClickAction }),
      /* @__PURE__ */ o("div", { className: App_module_default.sidePanel, children: moveBounds.value ? /* @__PURE__ */ o(
        BoundedMovePanel,
        {
          bounds: moveBounds.value.detail,
          onFinish: onFinishBoundedMove
        }
      ) : /* @__PURE__ */ o(import_preact3.Fragment, { children: [
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
            g,
            action,
            onCancel: onCancelAction,
            onExecute: onExecuteAction
          }
        )
      ] }) }),
      /* @__PURE__ */ o(EventLog, { g }),
      chooseFromList.value && /* @__PURE__ */ o(ListChoiceDialog, { ...chooseFromList.value.detail }),
      chooseManyFromList.value && /* @__PURE__ */ o(MultiListChoiceDialog, { ...chooseManyFromList.value.detail }),
      chooseYesNo.value && /* @__PURE__ */ o(YesNoDialog, { ...chooseYesNo.value.detail })
    ] });
  }

  // src/index.tsx
  var cache = new FetchCache();
  var gInstance = new Engine();
  window.g = gInstance;
  (0, import_preact4.render)(
    /* @__PURE__ */ o(SVGCacheContext.Provider, { value: cache, children: /* @__PURE__ */ o(
      App,
      {
        g: gInstance,
        onMount: () => {
          const aura = new Aura(gInstance);
          const beldalynn = new Beldalynn(gInstance);
          const galilea = new Galilea(gInstance);
          const salgar = new Salgar(gInstance);
          const hagrond = new Hagrond(gInstance);
          const birnotec = new Birnotec(gInstance);
          const kay = new Kay(gInstance);
          const gonrit = new OGonrit(gInstance);
          const yulash = new Yulash(gInstance);
          const zafron = new Zafron(gInstance);
          gInstance.place(aura, 20, 20);
          gInstance.place(beldalynn, 10, 30);
          gInstance.place(galilea, 5, 0);
          gInstance.place(salgar, 15, 30);
          gInstance.place(hagrond, 0, 5);
          gInstance.place(birnotec, 15, 0);
          gInstance.place(kay, 20, 0);
          gInstance.place(gonrit, 10, 15);
          gInstance.place(yulash, 25, 10);
          gInstance.place(zafron, 10, 5);
          gInstance.start();
        }
      }
    ) }),
    document.body
  );
})();
