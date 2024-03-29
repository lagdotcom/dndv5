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

  // globalExternal:@preact/signals
  var require_signals = __commonJS({
    "globalExternal:@preact/signals"(exports, module) {
      module.exports = globalThis.preactSignals;
    }
  });

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

  // src/data/templates.ts
  var addPC = (name, x, y, initiative) => ({
    type: "pc",
    name,
    x,
    y,
    initiative
  });
  var addMonster = (name, x, y, config, initiative) => ({
    type: "monster",
    name,
    x,
    y,
    config,
    initiative
  });
  var gleanVsGoblins = {
    combatants: [
      addPC("Marvoril", 15, 30),
      addPC("Shaira", 10, 35),
      addPC("Es'les", 10, 5),
      addPC("Faerfarn", 10, 20),
      addPC("Litt", 5, 15),
      addMonster("goblin", 15, 0, { weapon: "shortbow" }),
      addMonster("goblin", 25, 0, { weapon: "shortbow" }),
      addMonster("goblin", 20, 5),
      addMonster("goblin", 25, 5)
    ],
    images: []
  };
  var daviesVsFiends = {
    combatants: [
      addPC("Aura", 30, 45),
      addPC("Beldalynn", 10, 45),
      addPC("Galilea", 25, 40),
      addPC("Salgar", 20, 45),
      addPC("Hagrond", 15, 40),
      addMonster("Birnotec", 25, 0),
      addMonster("Kay of the Abyss", 35, 0),
      addMonster("O Gonrit", 20, 15),
      addMonster("Yulash", 15, 0),
      addMonster("Zafron Halehart", 25, 15)
    ],
    images: [
      {
        src: "https://lagdotcom.github.io/dndavies-assets/fp/ahnbiral-temple-space.png",
        x: 0,
        y: 0,
        width: 10,
        height: 10
      }
    ]
  };
  var tethVsGoblin = {
    combatants: [addPC("Tethilssethanar", 5, 5), addMonster("goblin", 15, 5)],
    images: []
  };

  // src/collectors/CollectorBase.ts
  var CollectorBase = class {
    constructor(entries, ignoredSources, ignoredValues) {
      this.completelyIgnored = false;
      this.entries = new Set(entries);
      this.ignoredSources = new Set(ignoredSources);
      this.ignoredValues = new Set(ignoredValues);
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
    ignoreAll() {
      this.completelyIgnored = true;
    }
    isInvolved(source) {
      if (this.completelyIgnored)
        return false;
      if (this.ignoredSources.has(source))
        return false;
      for (const entry of this.entries)
        if (entry.source === source && !this.ignoredValues.has(entry.value))
          return true;
      return false;
    }
    isIgnored(entry) {
      return this.completelyIgnored || this.ignoredSources.has(entry.source) || this.ignoredValues.has(entry.value);
    }
    getTaggedEntries() {
      return Array.from(this.entries).map((entry) => ({
        entry,
        ignored: this.isIgnored(entry)
      }));
    }
    getEntries() {
      return Array.from(this.entries).filter((entry) => !this.isIgnored(entry));
    }
    getValues() {
      return this.getEntries().map((entry) => entry.value);
    }
  };
  var AbstractSumCollector = class extends CollectorBase {
    get result() {
      return this.getSum(this.getValues());
    }
  };
  var SetCollector = class extends CollectorBase {
    get result() {
      return new Set(this.getValues());
    }
  };

  // src/collectors/AttackOutcomeCollector.ts
  var AttackOutcomeCollector = class extends AbstractSumCollector {
    setDefaultGetter(getter) {
      this.defaultGet = getter;
      return this;
    }
    getDefaultResult() {
      if (this.defaultGet)
        return this.defaultGet();
      throw new Error("AttackOutcomeCollector.setDefaultGetter() not called");
    }
    getSum(values) {
      if (values.includes("miss"))
        return "miss";
      if (values.includes("critical"))
        return "critical";
      if (values.includes("hit"))
        return "hit";
      let result = this.getDefaultResult();
      if (result === "critical") {
        if (!this.ignoredValues.has("critical"))
          return "critical";
        result = "hit";
      }
      if (result === "hit") {
        if (!this.ignoredValues.has("hit"))
          return "hit";
        result = "miss";
      }
      return result;
    }
    get hits() {
      return this.result !== "miss";
    }
  };

  // src/collectors/BonusCollector.ts
  var BonusCollector = class extends AbstractSumCollector {
    getSum(values) {
      return values.reduce((total, value) => total + value, 0);
    }
  };

  // src/collectors/DamageResponseCollector.ts
  var DamageResponseCollector = class extends AbstractSumCollector {
    getSum(values) {
      if (values.includes("absorb"))
        return "absorb";
      if (values.includes("immune"))
        return "immune";
      if (values.includes("resist") && !values.includes("vulnerable"))
        return "resist";
      if (values.includes("vulnerable"))
        return "vulnerable";
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

  // src/collectors/DifficultTerrainCollector.ts
  var DifficultTerrainCollector = class extends SetCollector {
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
    addMany(messages, source) {
      for (const message of messages)
        this.add(message, source);
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
      for (const interruption of interruptions)
        yield interruption;
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

  // src/collectors/ProficiencyCollector.ts
  var ProficiencyCollector = class extends AbstractSumCollector {
    getSum(values) {
      if (values.includes("expertise"))
        return 2;
      if (values.includes("proficient"))
        return 1;
      if (values.includes("half"))
        return 0.5;
      return 0;
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

  // src/collectors/ValueCollector.ts
  var comparators = {
    higher: (o, n) => n > o,
    lower: (o, n) => n < o
  };
  var ValueCollector = class {
    constructor(final) {
      this.final = final;
      this.others = [];
    }
    add(value, prefer) {
      const comparator = comparators[prefer];
      if (comparator(this.final, value))
        this.replace(value);
      else
        this.others.push(value);
    }
    replace(value) {
      this.others.push(this.final);
      this.final = value;
    }
  };

  // src/DamageMap.ts
  var DamageMap = class extends Map {
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

  // src/utils/objects.ts
  var objectEntries = Object.entries;
  function matches(object, match) {
    for (const [field, value] of objectEntries(match)) {
      if (object[field] !== value)
        return false;
    }
    return true;
  }
  var clone = (object) => ({ ...object });

  // src/DiceBag.ts
  function sizeOfDice(rt) {
    switch (rt.type) {
      case "damage":
      case "heal":
      case "other":
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
      const value = (_a = this.getForcedRoll(rt)) != null ? _a : Math.ceil(Math.random() * size);
      const values = new ValueCollector(value);
      if (dt !== "normal") {
        const second = (_b = this.getForcedRoll(rt)) != null ? _b : Math.ceil(Math.random() * size);
        const prefer = dt === "advantage" ? "higher" : "lower";
        values.add(second, prefer);
      }
      return { size, values };
    }
  };

  // src/events/SpellCastEvent.ts
  var SpellCastEvent = class extends CustomEvent {
    constructor(detail) {
      super("SpellCast", { detail });
    }
  };

  // src/MessageBuilder.ts
  var MessageBuilder = class {
    constructor() {
      this.data = [];
      this.spaceBeforeNext = false;
    }
    co(value, overrideName) {
      this.data.push({
        type: "combatant",
        value,
        overrideName,
        spaceBefore: this.spaceBeforeNext,
        spaceAfter: true
      });
      this.spaceBeforeNext = false;
      return this;
    }
    sp() {
      this.spaceBeforeNext = true;
      return this;
    }
    nosp() {
      const prev = this.data.at(-1);
      if ((prev == null ? void 0 : prev.type) === "combatant")
        prev.spaceAfter = false;
      return this;
    }
    it(value) {
      this.data.push({ type: "item", value });
      return this;
    }
    text(value) {
      this.data.push({ type: "text", value });
      return this;
    }
  };

  // src/types/AttackTag.ts
  var atSet = (...items) => new Set(items);

  // src/spells/MultiSaveEffect.ts
  var MultiSaveEffect = class {
    constructor(g, caster, spell, spellConfig, method, effect, duration, conditions, getSave) {
      this.g = g;
      this.caster = caster;
      this.spell = spell;
      this.spellConfig = spellConfig;
      this.method = method;
      this.effect = effect;
      this.duration = duration;
      this.getSave = getSave;
      this.affected = /* @__PURE__ */ new Set();
      this.conditions = new Set(conditions);
    }
    async apply(extraConfig) {
      const {
        g,
        affected,
        caster,
        method,
        duration,
        conditions,
        effect,
        spell,
        spellConfig,
        getSave
      } = this;
      const targets = spell.getAffected(g, caster, spellConfig);
      for (const target of targets) {
        const config = {
          affected,
          caster,
          method,
          duration,
          conditions,
          ...extraConfig
        };
        const { outcome } = await g.save(getSave(target, config));
        if (outcome === "fail" && await target.addEffect(effect, config))
          affected.add(target);
      }
      return affected.size > 0;
    }
    async concentrate(callback) {
      const { caster, spell, duration, effect, affected } = this;
      await caster.concentrateOn({
        spell,
        duration,
        async onSpellEnd() {
          for (const target of affected)
            await target.removeEffect(effect);
          if (callback)
            await callback(affected);
        }
      });
    }
  };

  // src/spells/SpellHelper.ts
  var SpellHelper = class {
    constructor(g, action, spell, method, config, caster = action.actor) {
      this.g = g;
      this.action = action;
      this.spell = spell;
      this.method = method;
      this.config = config;
      this.caster = caster;
    }
    get affected() {
      return this.spell.getAffected(this.g, this.caster, this.config);
    }
    get affectedArea() {
      var _a;
      return (_a = this.spell.getAffectedArea(this.g, this.caster, this.config)) != null ? _a : [];
    }
    attack({
      target,
      diceType,
      type,
      weapon,
      ammo
    }) {
      const { g, caster: who, method, spell } = this;
      return g.attack(
        {
          who,
          target,
          ability: method.ability,
          tags: atSet(type, "spell", "magical"),
          spell,
          method,
          weapon,
          ammo
        },
        { source: spell, diceType }
      );
    }
    getSaveConfig(e2) {
      var _a;
      const { caster: attacker, spell, method, config: spellConfig } = this;
      const tags = (_a = e2.tags) != null ? _a : ["magic"];
      return {
        source: spell,
        type: method.getSaveType(
          attacker,
          spell,
          spellConfig.slot
        ),
        attacker,
        spell,
        method,
        ...e2,
        tags
      };
    }
    save(e2) {
      return this.g.save(this.getSaveConfig(e2));
    }
    async rollDamage({
      critical,
      damage = this.spell.getDamage(
        this.g,
        this.caster,
        this.method,
        this.config
      ),
      target,
      tags: initialTags = []
    } = {}) {
      const { g, caster: attacker, method, spell } = this;
      const tags = new Set(initialTags).add("magical").add("spell");
      const amounts = [];
      if (damage) {
        for (const { type, amount, damageType } of damage)
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
                method,
                tags
              },
              critical
            );
            amounts.push([damageType, roll]);
          } else
            amounts.push([damageType, amount]);
      }
      return amounts;
    }
    damage({
      ability,
      ammo,
      attack,
      critical,
      target,
      weapon,
      damageType,
      damageInitialiser,
      damageResponse
    }) {
      const { g, caster: attacker, method, spell } = this;
      return g.damage(
        spell,
        damageType,
        {
          ability,
          ammo,
          attack,
          attacker,
          critical,
          method,
          spell,
          target,
          weapon
        },
        damageInitialiser,
        damageResponse
      );
    }
    async rollHeal({
      critical,
      target
    } = {}) {
      const { g, caster: actor, method, spell, config } = this;
      let total = 0;
      const heals = spell.getHeal(g, actor, method, config);
      if (heals) {
        for (const { type, amount } of heals)
          if (type === "dice") {
            const { count, size } = amount;
            const roll = await g.rollHeal(
              count,
              {
                source: spell,
                size,
                spell,
                method,
                actor,
                target
              },
              critical
            );
            total += roll;
          } else
            total += amount;
      }
      return total;
    }
    heal({
      amount,
      startingMultiplier,
      target
    }) {
      const { g, caster: actor, action, spell } = this;
      return g.heal(
        spell,
        amount,
        { action, actor, spell, target },
        startingMultiplier
      );
    }
    getMultiSave({
      duration,
      conditions = [],
      tags = [],
      ...e2
    }) {
      const { g, caster, method, spell, config: spellConfig } = this;
      tags.push("magic");
      return new MultiSaveEffect(
        g,
        caster,
        spell,
        spellConfig,
        method,
        e2.effect,
        duration,
        conditions,
        (who, config) => this.getSaveConfig({ ...e2, tags, who, config })
      );
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
      this.time = spell.time;
      this.icon = spell.icon;
      this.subIcon = method.icon;
      this.tags = /* @__PURE__ */ new Set(["spell"]);
      if (spell.v)
        this.tags.add("vocal");
      if (spell.isHarmful)
        this.tags.add("harmful");
    }
    get status() {
      return this.spell.status;
    }
    generateAttackConfigs(allTargets) {
      const { g, actor: caster, method } = this;
      return this.spell.generateAttackConfigs({ g, caster, method, allTargets });
    }
    generateHealingConfigs(allTargets) {
      const { g, actor: caster, method } = this;
      return this.spell.generateHealingConfigs({ g, caster, method, allTargets });
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
      const slot = this.spell.scaling ? (_a = config.slot) != null ? _a : this.spell.level : this.spell.level;
      const resource = this.method.getResourceForSpell(
        this.spell,
        slot,
        this.actor
      );
      return new Map(resource ? [[resource, 1]] : void 0);
    }
    getTargets(config) {
      return this.spell.getTargets(this.g, this.actor, config);
    }
    getAffected(config) {
      return this.spell.getAffected(this.g, this.actor, config);
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
          affected: new Set(spell.getAffected(g, actor, config)),
          interrupt: new InterruptionCollector(),
          success: new SuccessResponseCollector()
        })
      );
      if (sc.detail.success.result === "fail") {
        return g.text(
          new MessageBuilder().co(actor).text(` fails to cast ${spell.name}.`)
        );
      }
      actor.spellsSoFar.push(spell);
      if (spell.concentration)
        await actor.endConcentration();
      return spell.apply(new SpellHelper(g, this, spell, method, config), config);
    }
  };
  function isCastSpell(a, sp) {
    return a instanceof CastSpell && (!sp || a.spell === sp);
  }
  var getSpellChecker = (sp) => (a) => isCastSpell(a, sp);

  // src/img/act/dash.svg
  var dash_default = "./dash-CNRMKC55.svg";

  // src/colours.ts
  var ClassColours = {
    Artificer: "#a99c80",
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
    thunder: "#1e90ff",
    unpreventable: "#000000"
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
    constructor(name, durationTimer, setup, { quiet = false, icon, tags } = {}) {
      this.name = name;
      this.durationTimer = durationTimer;
      this.quiet = quiet;
      this.icon = icon;
      this.tags = new Set(tags);
      if (setup)
        this.rule = new DndRule(name, setup);
    }
  };

  // src/types/AbilityName.ts
  var PhysicalAbilities = ["str", "dex", "con"];
  var MentalAbilities = ["int", "wis", "cha"];
  var AbilityNames = [...PhysicalAbilities, ...MentalAbilities];
  var abSet = (...items) => new Set(items);

  // src/types/Item.ts
  var WeaponCategories = [
    "natural",
    "simple",
    "martial",
    "improvised"
  ];
  var wcSet = (...items) => new Set(items);
  var ArmorCategories = ["light", "medium", "heavy", "shield"];
  var acSet = (...items) => new Set(items);

  // src/types/ProficiencyType.ts
  var ProficiencyTypes = [
    "none",
    "half",
    "proficient",
    "expertise"
  ];

  // src/types/SkillName.ts
  var SkillNames = [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Persuasion",
    "Religion",
    "Sleight of Hand",
    "Stealth",
    "Survival"
  ];

  // src/types/ToolName.ts
  var ArtisansTools = [
    "alchemist's supplies",
    "brewer's supplies",
    "calligrapher's supplies",
    "carpenter's tools",
    "cartographer's tools",
    "cobbler's tools",
    "cook's utensils",
    "glassblower's tools",
    "jeweler's tools",
    "leatherworker's tools",
    "mason's tools",
    "painter's supplies",
    "potter's tools",
    "smith's tools",
    "tinker's tools",
    "weaver's tools",
    "woodcarver's tools"
  ];
  var GamingSets = [
    "dice set",
    "dragonchess set",
    "playing card set",
    "three-dragon ante set"
  ];
  var Instruments = [
    "bagpipes",
    "birdpipes",
    "drum",
    "dulcimer",
    "flute",
    "glaur",
    "hand drum",
    "horn",
    "longhorn",
    "lute",
    "lyre",
    "pan flute",
    "shawm",
    "songborn",
    "tantan",
    "thelarr",
    "tocken",
    "viol",
    "wargong",
    "yarting",
    "zulkoon"
  ];
  var VehicleTypes = [
    "vehicles (air)",
    "vehicles (land)",
    "vehicles (space)",
    "vehicles (water)"
  ];
  var ToolNames = [
    ...ArtisansTools,
    ...GamingSets,
    ...Instruments,
    ...VehicleTypes,
    "disguise kit",
    "forgery kit",
    "herbalism kit",
    "navigator's tools",
    "poisoner's kit",
    "thieves' tools"
  ];

  // src/types/WeaponType.ts
  var SimpleMeleeWeapons = [
    "club",
    "dagger",
    "greatclub",
    "handaxe",
    "javelin",
    "light hammer",
    "mace",
    "quarterstaff",
    "sickle",
    "spear"
  ];
  var SimpleRangedWeapons = [
    "light crossbow",
    "dart",
    "shortbow",
    "sling"
  ];
  var MartialMeleeWeapons = [
    "battleaxe",
    "flail",
    "glaive",
    "greataxe",
    "greatsword",
    "halberd",
    "lance",
    "longsword",
    "maul",
    "morningstar",
    "pike",
    "rapier",
    "scimitar",
    "shortsword",
    "trident",
    "war pick",
    "warhammer",
    "whip"
  ];
  var MartialRangedWeapons = [
    "blowgun",
    "hand crossbow",
    "heavy crossbow",
    "longbow",
    "net"
  ];
  var WeaponTypes = [
    ...SimpleMeleeWeapons,
    ...SimpleRangedWeapons,
    ...MartialMeleeWeapons,
    ...MartialRangedWeapons,
    "unarmed strike"
  ];
  var wtSet = (...items) => new Set(items);

  // src/Polygon.ts
  var Polygon = class {
    constructor(points) {
      this.points = points;
      const lines = [];
      for (let i2 = 0, j = points.length - 1; i2 < points.length; j = i2++) {
        const a = points[i2];
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

  // src/PointSet.ts
  function asPoint(tag) {
    const [x, y] = tag.split(",").map(Number);
    return { x, y };
  }
  var asTag = ({ x, y }) => `${x},${y}`;
  var PointSet = class {
    constructor(points = []) {
      this.set = new Set(Array.from(points, asTag));
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
        const x = area.who.position.x - area.radius;
        const y = area.who.position.y - area.radius;
        const size = area.who.sizeInUnits + area.radius * 2;
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
    for (let value = min; value <= max; value++)
      values.push(value);
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

  // src/types/SizeCategory.ts
  var SizeCategory = /* @__PURE__ */ ((SizeCategory2) => {
    SizeCategory2[SizeCategory2["Tiny"] = 1] = "Tiny";
    SizeCategory2[SizeCategory2["Small"] = 2] = "Small";
    SizeCategory2[SizeCategory2["Medium"] = 3] = "Medium";
    SizeCategory2[SizeCategory2["Large"] = 4] = "Large";
    SizeCategory2[SizeCategory2["Huge"] = 6] = "Huge";
    SizeCategory2[SizeCategory2["Gargantuan"] = 7] = "Gargantuan";
    return SizeCategory2;
  })(SizeCategory || {});
  var SizeCategory_default = SizeCategory;

  // src/utils/units.ts
  var categoryUnits = {
    [SizeCategory_default.Tiny]: 1,
    [SizeCategory_default.Small]: 1,
    [SizeCategory_default.Medium]: 1,
    [SizeCategory_default.Large]: 2,
    [SizeCategory_default.Huge]: 3,
    [SizeCategory_default.Gargantuan]: 4
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
  function distance(a, b) {
    return getDistanceBetween(
      a.position,
      a.sizeInUnits,
      b.position,
      b.sizeInUnits
    );
  }
  function distanceTo(who, to) {
    return getDistanceBetween(who.position, who.sizeInUnits, to, MapSquareSize);
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
  function getWeaponCategory(wt) {
    if (wt === "unarmed strike")
      return "natural";
    if (isA(wt, SimpleMeleeWeapons) || isA(wt, SimpleRangedWeapons))
      return "simple";
    if (isA(wt, MartialMeleeWeapons) || isA(wt, MartialRangedWeapons))
      return "martial";
    throw new Error(`Unknown weapon type: ${wt}`);
  }
  function getProficiencyType(thing) {
    if (typeof thing === "string") {
      if (isA(thing, AbilityNames))
        return { type: "ability", ability: thing };
      if (isA(thing, ArmorCategories))
        return { type: "armor", category: thing };
      if (isA(thing, WeaponTypes))
        return {
          type: "weapon",
          category: getWeaponCategory(thing),
          weapon: thing
        };
      if (isA(thing, WeaponCategories))
        return { type: "weaponCategory", category: thing };
      if (isA(thing, ToolNames))
        return { type: "tool", tool: thing };
      if (isA(thing, SkillNames))
        return { type: "skill", skill: thing };
      throw new Error(`${thing} has no proficiency`);
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
  function getProficiencyMax(...types) {
    return types.sort(
      (a, b) => ProficiencyTypes.indexOf(b) - ProficiencyTypes.indexOf(a)
    )[0];
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
      if (distance(flanker, target) > 5)
        continue;
      return flanker;
    }
  }
  function getTotalDamage(gather) {
    let total = gather.bonus.result;
    for (const [, amount] of gather.map)
      total += amount;
    total *= gather.multiplier.result;
    return total;
  }

  // src/AbilityScore.ts
  var AbilityScore = class {
    constructor(baseScore = 10, baseMaximum = 20, baseMinimum = 0) {
      this.baseScore = baseScore;
      this.baseMaximum = baseMaximum;
      this.baseMinimum = baseMinimum;
    }
    get score() {
      return clamp(this.baseScore, this.baseMinimum, this.baseMaximum);
    }
    set score(value) {
      this.baseScore = value;
    }
    get maximum() {
      return this.baseMaximum;
    }
    set maximum(value) {
      this.baseMaximum = Math.max(this.baseMaximum, value);
    }
    get minimum() {
      return this.baseMinimum;
    }
    set minimum(value) {
      this.baseMinimum = Math.max(this.baseMinimum, value);
    }
    get modifier() {
      return getAbilityModifier(this.score);
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

  // src/events/CombatantFinalising.ts
  var CombatantFinalisingEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantFinalising", { detail });
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

  // src/resolvers/SlotResolver.ts
  var SlotResolver = class {
    constructor(spell, actor, method) {
      this.spell = spell;
      this.actor = actor;
      this.method = method;
      this.name = "spell slot";
      this.type = "SpellSlot";
    }
    get initialValue() {
      return this.min;
    }
    get min() {
      var _a, _b, _c;
      return (_c = (_b = (_a = this.method).getMinSlot) == null ? void 0 : _b.call(_a, this.spell, this.actor)) != null ? _c : this.spell.level;
    }
    get max() {
      var _a, _b, _c;
      return (_c = (_b = (_a = this.method).getMaxSlot) == null ? void 0 : _b.call(_a, this.spell, this.actor)) != null ? _c : this.spell.level;
    }
    check(value, action, ec) {
      if (typeof value !== "number")
        ec.add("No spell level chosen", this);
      else {
        if (value < this.min)
          ec.add("Too low", this);
        if (value > this.max)
          ec.add("Too high", this);
      }
      return ec;
    }
  };

  // src/types/CreatureType.ts
  var ctSet = (...items) => new Set(items);

  // src/utils/env.ts
  function implementationWarning(type, status, name, who) {
    if (true)
      console.warn(`[${type} ${status}] ${name} (on ${who})`);
  }
  function featureNotComplete(feature, who) {
    implementationWarning("Feature", "Not Complete", feature.name, who.name);
  }

  // src/spells/common.ts
  var cannotHealConventionally = ctSet("undead", "construct");
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
    isHarmful = false,
    apply,
    check = (_g, _config, ec) => ec,
    generateAttackConfigs = () => [],
    generateHealingConfigs = () => [],
    getAffected,
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
    description,
    icon,
    isHarmful,
    apply,
    check,
    generateAttackConfigs,
    generateHealingConfigs,
    getAffected,
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
    description,
    icon,
    isHarmful = false,
    apply,
    check = (_g, _config, ec) => ec,
    generateAttackConfigs,
    generateHealingConfigs,
    getAffected,
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
    description,
    icon,
    isHarmful,
    apply,
    check,
    generateAttackConfigs({ g, allTargets, caster, method }) {
      var _a, _b, _c, _d;
      if (!generateAttackConfigs)
        return [];
      const minSlot = (_b = (_a = method.getMinSlot) == null ? void 0 : _a.call(method, this, caster)) != null ? _b : level;
      const maxSlot = (_d = (_c = method.getMaxSlot) == null ? void 0 : _c.call(method, this, caster)) != null ? _d : level;
      return enumerate(minSlot, maxSlot).flatMap(
        (slot) => generateAttackConfigs({ slot, allTargets, g, caster, method }).map(
          ({ config, positioning }) => ({
            config: { ...config, slot },
            positioning
          })
        )
      );
    },
    generateHealingConfigs({ g, allTargets, caster, method }) {
      var _a, _b, _c, _d;
      if (!generateHealingConfigs)
        return [];
      const minSlot = (_b = (_a = method.getMinSlot) == null ? void 0 : _a.call(method, this, caster)) != null ? _b : level;
      const maxSlot = (_d = (_c = method.getMaxSlot) == null ? void 0 : _c.call(method, this, caster)) != null ? _d : level;
      return enumerate(minSlot, maxSlot).flatMap(
        (slot) => generateHealingConfigs({ slot, allTargets, g, caster, method }).map(
          ({ config, positioning }) => ({
            config: { ...config, slot },
            positioning
          })
        )
      );
    },
    getAffected,
    getAffectedArea,
    getConfig(g, actor, method, config) {
      return {
        ...getConfig(g, actor, method, config),
        slot: new SlotResolver(this, actor, method)
      };
    },
    getDamage,
    getHeal,
    getLevel({ slot }) {
      return slot;
    },
    getTargets
  });
  function spellImplementationWarning(spell, who) {
    const status = spell.status === "incomplete" ? "Not Complete" : spell.status === "missing" ? "Missing" : "";
    if (status)
      implementationWarning("Spell", status, spell.name, who.name);
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
  function getWeaponRange(who, weapon, rangeCategory) {
    if (isDefined(weapon.longRange) && rangeCategory === "ranged")
      return weapon.longRange;
    return who.reach + weapon.reach;
  }
  function getValidAmmunition(who, weapon) {
    return who.ammunition.filter(
      (ammo) => ammo.ammunitionTag === weapon.ammunitionTag
    );
  }
  function isEquipmentAttuned(item, who) {
    return (who == null ? void 0 : who.equipment.has(item)) === true && who.attunements.has(item);
  }

  // src/CombatantBase.ts
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
  var CombatantBase = class {
    constructor(g, name, {
      img,
      side,
      size,
      type,
      diesAtZero = true,
      hands = defaultHandsAmount[type],
      hpMax = 0,
      hp = hpMax,
      level = 0,
      pb = 2,
      cr = NaN,
      reach = MapSquareSize,
      chaScore = 10,
      conScore = 10,
      dexScore = 10,
      intScore = 10,
      strScore = 10,
      wisScore = 10,
      naturalAC = 10,
      rules,
      coefficients,
      groups,
      alignGE,
      alignLC,
      movement = [["speed", 30]],
      tags
    }) {
      this.g = g;
      this.name = name;
      this.id = g.nextId();
      this.position = { x: NaN, y: NaN };
      this.initiative = NaN;
      this.diesAtZero = diesAtZero;
      this.hands = hands;
      this.hp = hp;
      this.baseHpMax = hpMax;
      this.img = img;
      this.level = level;
      this.cr = cr;
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
      this.movement = new Map(movement);
      this.skills = /* @__PURE__ */ new Map();
      this.languages = /* @__PURE__ */ new Set();
      this.equipment = /* @__PURE__ */ new Set();
      this.inventory = /* @__PURE__ */ new Map();
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
      this.spellsSoFar = [];
      this.alignGE = alignGE;
      this.alignLC = alignLC;
      this.tags = new Set(tags);
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
      for (const item of this.inventory.keys()) {
        if (item.itemType === "ammo")
          ammo.push(item);
      }
      return ammo;
    }
    get conditions() {
      return this.getConditions().conditions.result;
    }
    get frightenedBy() {
      return this.getConditions().frightenedBy;
    }
    get grappling() {
      return this.getConditions().grappling;
    }
    get speed() {
      var _a;
      const bonus = new BonusCollector();
      bonus.add((_a = this.movement.get("speed")) != null ? _a : 0, this);
      const e2 = this.g.fire(
        new GetSpeedEvent({
          who: this,
          bonus,
          multiplier: new MultiplierCollector()
        })
      );
      return bonus.result * e2.detail.multiplier.result;
    }
    get hpMax() {
      const bonus = new BonusCollector();
      bonus.add(this.baseHpMax, this);
      const e2 = this.g.fire(
        new GetMaxHPEvent({
          who: this,
          bonus,
          multiplier: new MultiplierCollector()
        })
      );
      return bonus.result * e2.detail.multiplier.result;
    }
    get freeHands() {
      let free = this.hands;
      for (const item of this.equipment)
        free -= item.hands;
      return free;
    }
    getConditions() {
      const conditions = new ConditionCollector();
      for (const condition of this.conditionImmunities)
        conditions.ignoreValue(condition);
      const frightenedBy = /* @__PURE__ */ new Set();
      const grappling = /* @__PURE__ */ new Set();
      this.g.fire(
        new GetConditionsEvent({
          who: this,
          conditions,
          frightenedBy,
          grappling
        })
      );
      for (const condition of conditions.getEntries()) {
        if (condition.value === "Paralyzed" || condition.value === "Petrified" || condition.value === "Stunned" || condition.value === "Unconscious")
          conditions.add("Incapacitated", condition.source);
      }
      if (!conditions.result.has("Frightened"))
        frightenedBy.clear();
      return { conditions, frightenedBy, grappling };
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
      this.str.score = str;
      this.dex.score = dex;
      this.con.score = con;
      this.int.score = int;
      this.wis.score = wis;
      this.cha.score = cha;
    }
    don(item, attune = false) {
      if (item.itemType === "armor") {
        const predicate = isSuitOfArmor(item) ? isSuitOfArmor : isShield;
        for (const o of this.equipment) {
          if (predicate(o))
            this.doff(o);
        }
      }
      this.equipment.add(item);
      this.removeFromInventory(item);
      if (attune)
        this.attunements.add(item);
      return true;
    }
    doff(item) {
      if (this.equipment.delete(item)) {
        this.addToInventory(item);
        return true;
      }
      return false;
    }
    addProficiency(thing, value) {
      var _a, _b;
      const prof = getProficiencyType(thing);
      switch (prof == null ? void 0 : prof.type) {
        case "ability":
          this.saveProficiencies.add(prof.ability);
          return;
        case "armor":
          this.armorProficiencies.add(prof.category);
          return;
        case "skill": {
          const old = (_a = this.skills.get(prof.skill)) != null ? _a : "none";
          this.skills.set(prof.skill, getProficiencyMax(old, value));
          return;
        }
        case "tool": {
          const old = (_b = this.toolProficiencies.get(prof.tool)) != null ? _b : "none";
          this.toolProficiencies.set(prof.tool, getProficiencyMax(old, value));
          return;
        }
        case "weapon":
          if (prof.category !== "natural")
            this.weaponProficiencies.add(prof.weapon);
          return;
        case "weaponCategory":
          this.weaponCategoryProficiencies.add(prof.category);
          return;
      }
    }
    getProficiency(thing) {
      var _a, _b;
      const prof = getProficiencyType(thing);
      switch (prof == null ? void 0 : prof.type) {
        case "ability":
          return this.saveProficiencies.has(prof.ability) ? "proficient" : "none";
        case "armor":
          return this.armorProficiencies.has(prof.category) ? "proficient" : "none";
        case "skill":
          return (_a = this.skills.get(prof.skill)) != null ? _a : "none";
        case "tool":
          return (_b = this.toolProficiencies.get(prof.tool)) != null ? _b : "none";
        case "weapon":
          if (prof.category === "natural")
            return "proficient";
          if (this.weaponCategoryProficiencies.has(prof.category))
            return "proficient";
          if (this.weaponProficiencies.has(prof.weapon))
            return "proficient";
          break;
        case "weaponCategory":
          return this.weaponCategoryProficiencies.has(prof.category) ? "proficient" : "none";
      }
      return "none";
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
    async endConcentration(spell) {
      const removed = /* @__PURE__ */ new Set();
      for (const other of this.concentratingOn) {
        if (spell && other.spell !== spell)
          continue;
        this.g.text(
          new MessageBuilder().co(this).text(` stops concentrating on ${other.spell.name}.`)
        );
        await other.onSpellEnd();
        removed.add(other);
      }
      for (const other of removed)
        this.concentratingOn.delete(other);
    }
    async concentrateOn(entry) {
      await this.endConcentration();
      this.concentratingOn.add(entry);
    }
    finaliseHP() {
      this.hp = this.hpMax;
    }
    finalise() {
      for (const feature of this.features.values())
        feature.setup(this.g, this, this.getConfig(feature.name));
      this.g.fire(new CombatantFinalisingEvent({ who: this }));
      this.finaliseHP();
      for (const spell of this.preparedSpells)
        spellImplementationWarning(spell, this);
    }
    async addEffect(effect, config, attacker) {
      const e2 = await this.g.resolve(
        new BeforeEffectEvent({
          who: this,
          effect,
          config,
          attacker,
          interrupt: new InterruptionCollector(),
          success: new SuccessResponseCollector()
        })
      );
      if (e2.detail.success.result === "fail")
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
      const e2 = new ExhaustionEvent({
        who: this,
        old,
        delta,
        value,
        interrupt: new InterruptionCollector(),
        success: new SuccessResponseCollector()
      });
      await this.g.resolve(e2);
      if (e2.detail.success.result !== "fail")
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
      this.time.add("item interaction");
    }
    regainTime(time) {
      this.time.add(time);
    }
    getCoefficient(co) {
      const values = [this.coefficients.get(co)];
      for (const group of this.groups)
        values.push(group.getCoefficient(co));
      const filtered = values.filter(isDefined);
      return filtered.length ? filtered.reduce((p, c) => p * c, 1) : co.defaultValue;
    }
    addToInventory(item, quantity = 1) {
      var _a;
      const count = (_a = this.inventory.get(item)) != null ? _a : 0;
      this.inventory.set(item, count + quantity);
    }
    removeFromInventory(item, quantity = 1) {
      const count = this.inventory.get(item);
      if (!isDefined(count) || count < quantity)
        return false;
      if (count === quantity)
        this.inventory.delete(item);
      else
        this.inventory.set(item, count - quantity);
      return true;
    }
    isConcentratingOn(spell) {
      for (const entry of this.concentratingOn) {
        if (entry.spell === spell)
          return true;
      }
      return false;
    }
    getClassLevel(name, assume) {
      var _a;
      return (_a = this.classLevels.get(name)) != null ? _a : assume;
    }
  };

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
      if (!(who instanceof CombatantBase))
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

  // src/utils/array.ts
  var sieve = (...items) => items.filter(isDefined);
  var uniq = (items) => Array.from(new Set(items));

  // src/actions/AbstractAction.ts
  var AbstractAction = class {
    constructor(g, actor, name, status, config, {
      area,
      damage,
      description,
      heal,
      icon,
      resources,
      subIcon,
      tags,
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
      this.subIcon = subIcon;
      this.tags = new Set(tags);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateAttackConfigs(targets) {
      return [];
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
    async applyCosts(config) {
      const time = this.getTime(config);
      if (time)
        this.actor.useTime(time);
      for (const [resource, cost] of this.getResources(config))
        this.actor.spendResource(resource, cost);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async apply(config) {
      await this.applyCosts(config);
      await this.applyEffect(config);
    }
  };
  var AbstractSingleTargetAction = class extends AbstractAction {
    getTargets({ target }) {
      return sieve(target);
    }
    getAffected({ target }) {
      return [target];
    }
  };
  var AbstractMultiTargetAction = class extends AbstractAction {
    getTargets({ targets }) {
      return targets != null ? targets : [];
    }
    getAffected({ targets }) {
      return targets;
    }
  };
  var AbstractSelfAction = class extends AbstractAction {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getTargets(config) {
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAffected(config) {
      return [this.actor];
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
  var DashAction = class extends AbstractSelfAction {
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
    async applyEffect() {
      await this.actor.addEffect(DashEffect, { duration: 1 });
    }
  };

  // src/img/act/disengage.svg
  var disengage_default = "./disengage-6XMY6V34.svg";

  // src/img/act/thrown.svg
  var thrown_default = "./thrown-ITAE47P5.svg";

  // src/utils/combinatorics.ts
  function combinations(source, size) {
    const results = [];
    function backtrack(start, current) {
      if (current.length === size) {
        results.push([...current]);
        return;
      }
      for (let i2 = start; i2 < source.length; i2++) {
        current.push(source[i2]);
        backtrack(i2 + 1, current);
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

  // src/filters.ts
  var makeFilter = ({
    name,
    message = name,
    check
  }) => ({
    name,
    message,
    check
  });
  var canBeHeardBy = makeFilter({
    name: "can be heard by",
    message: "not audible",
    check: (g, action, value) => g.canHear(value, action.actor)
  });
  var canSee = makeFilter({
    name: "can see",
    message: "not visible",
    check: (g, action, value) => g.canSee(action.actor, value)
  });
  var capable = makeFilter({
    name: "can act",
    message: "incapacitated",
    check: (g, action, value) => !value.conditions.has("Incapacitated")
  });
  var conscious = makeFilter({
    name: "conscious",
    message: "unconscious",
    check: (g, action, value) => !value.conditions.has("Unconscious")
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
  var hasEffect = (effect, name = effect.name, message = "no effect") => makeFilter({
    name,
    message,
    check: (g, action, value) => value.hasEffect(effect)
  });
  var doesNotHaveEffect = (effect, name = `not ${effect.name}`, message = "affected") => makeFilter({
    name,
    message,
    check: (g, action, value) => !value.hasEffect(effect)
  });
  var hasTime = (time) => makeFilter({
    name: `has ${time}`,
    message: "no time",
    check: (g, action, value) => value.hasTime(time)
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
  var sizeOrLess = (size) => makeFilter({
    name: `up to ${SizeCategory_default[size]}`,
    message: "too big",
    check: (g, action, value) => value.size <= size
  });
  var isGrappledBy = (grappler) => makeFilter({
    name: "grappled",
    message: `not grappled by ${grappler.name}`,
    check: (g, action, value) => grappler.grappling.has(value)
  });
  var withinRangeOfEachOther = (range) => makeFilter({
    name: `within ${range}' of each other`,
    message: `within ${range}' of each other`,
    check: (g, action, value) => !combinations(value, 2).find(([a, b]) => distance(a, b) > range)
  });

  // src/events/YesNoChoiceEvent.ts
  var YesNoChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("YesNoChoice", { detail });
    }
  };

  // src/interruptions/YesNoChoice.ts
  var YesNoChoice = class {
    constructor(who, source, title, text, priority, yes, no, isStillValid) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.priority = priority;
      this.yes = yes;
      this.no = no;
      this.isStillValid = isStillValid;
    }
    setDynamicText(dynamicText) {
      this.dynamicText = dynamicText;
      return this;
    }
    async apply(g) {
      var _a, _b;
      if (this.dynamicText)
        this.text = this.dynamicText();
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
      clauses.push(...this.filters.map((f2) => f2.name));
      return clauses.length ? clauses.join(", ") : "any target";
    }
    check(value, action, ec) {
      if (!(value instanceof CombatantBase)) {
        ec.add("No target", this);
      } else {
        const isOutOfRange = distance(action.actor, value) > this.maxRange;
        const errors = this.filters.filter((filter) => !filter.check(this.g, action, value)).map((filter) => filter.message);
        if (isOutOfRange)
          ec.add("Out of range", this);
        ec.addMany(errors, this);
      }
      return ec;
    }
  };

  // src/types/Priority.ts
  var Priority = /* @__PURE__ */ ((Priority2) => {
    Priority2[Priority2["ChangesTarget"] = 20] = "ChangesTarget";
    Priority2[Priority2["ChangesOutcome"] = 10] = "ChangesOutcome";
    Priority2[Priority2["Normal"] = 0] = "Normal";
    Priority2[Priority2["Late"] = -10] = "Late";
    Priority2[Priority2["UI"] = -100] = "UI";
    return Priority2;
  })(Priority || {});
  var Priority_default = Priority;

  // src/DefaultingMap.ts
  var DefaultingMap = class extends Map {
    constructor(makeDefault, data) {
      super(data);
      this.makeDefault = makeDefault;
    }
    /**
     * @returns {V} Returns the element associated with the specified key. If no element is associated with the specified key, a new one is generated.
     */
    get(key) {
      const value = super.get(key);
      if (typeof value !== "undefined")
        return value;
      const replacement = this.makeDefault(key);
      this.set(key, replacement);
      return replacement;
    }
  };

  // src/utils/config.ts
  function getConfigErrors(g, action, config) {
    const ec = g.check(action, config);
    for (const [key, resolver] of objectEntries(
      action.getConfig(config)
    )) {
      const value = config[key];
      resolver.check(value, action, ec);
    }
    return ec;
  }
  function checkConfig(g, action, config) {
    return getConfigErrors(g, action, config).result;
  }

  // src/utils/ai.ts
  var poSet = (...constraints) => new Set(constraints);
  var poWithin = (range, of) => ({
    type: "within",
    range,
    of
  });

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
  function describeCheck(ability, skill) {
    if (skill)
      return `${describeAbility(ability)} (${skill})`;
    return describeAbility(ability);
  }
  function describeSave(tags, ability) {
    if (tags.has("death"))
      return "death";
    if (ability)
      return describeAbility(ability);
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
  function plural(thing, count) {
    return count === 1 ? thing : thing + "s";
  }

  // src/img/act/dying.svg
  var dying_default = "./dying-YUO2NF73.svg";

  // src/img/act/prone.svg
  var prone_default = "./prone-ZBMZRVQM.svg";

  // src/img/spl/charm-monster.svg
  var charm_monster_default = "./charm-monster-UW5QBALY.svg";

  // src/types/ConditionName.ts
  var coSet = (...items) => new Set(items);

  // src/actions/DropProneAction.ts
  var DropProneIcon = makeIcon(prone_default);
  var DropProneAction = class extends AbstractSelfAction {
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
    async applyEffect() {
      await this.actor.addEffect(Prone, {
        conditions: coSet("Prone"),
        duration: Infinity
      });
    }
  };

  // src/resolvers/ChoiceResolver.ts
  var ChoiceResolver = class {
    constructor(g, name, entries) {
      this.g = g;
      this.name = name;
      this.entries = entries;
      this.type = "Choice";
    }
    check(value, action, ec) {
      if (this.entries.length === 0)
        ec.add("No valid choices", this);
      else if (!value)
        ec.add("No choice made", this);
      else if (!this.entries.find((e2) => e2.value === value))
        ec.add("Invalid choice", this);
      return ec;
    }
  };

  // src/types/CheckTag.ts
  var chSet = (...items) => new Set(items);

  // src/events/ListChoiceEvent.ts
  var ListChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("ListChoice", { detail });
    }
  };

  // src/interruptions/PickFromListChoice.ts
  var makeChoice = (value, label, disabled) => ({ value, label, disabled });
  var makeStringChoice = (value, label = value, disabled) => ({ value, label, disabled });
  var PickFromListChoice = class {
    constructor(who, source, title, text, priority, items, chosen, allowNone = false, isStillValid) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.priority = priority;
      this.items = items;
      this.chosen = chosen;
      this.allowNone = allowNone;
      this.isStillValid = isStillValid;
    }
    async apply(g) {
      var _a;
      if (!this.items.find((choice2) => !choice2.disabled))
        return;
      const choice = await new Promise(
        (resolve) => g.fire(new ListChoiceEvent({ interruption: this, resolve }))
      );
      if (choice)
        return (_a = this.chosen) == null ? void 0 : _a.call(this, choice);
    }
  };

  // src/actions/common.ts
  var GrappleChoices = [
    makeChoice(
      { ability: "str", skill: "Athletics" },
      "Strength (Athletics)"
    ),
    makeChoice(
      { ability: "dex", skill: "Acrobatics" },
      "Dexterity (Acrobatics)"
    )
  ];

  // src/actions/EscapeGrappleAction.ts
  var EscapeGrappleAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Escape a Grapple",
        "implemented",
        { choice: new ChoiceResolver(g, "Skill", GrappleChoices) },
        {
          description: `A grappled creature can use its action to escape. To do so, it must succeed on a Strength (Athletics) or Dexterity (Acrobatics) check contested by your Strength (Athletics) check.`,
          tags: ["escape move prevention"],
          time: "action"
        }
      );
    }
    get grappler() {
      var _a;
      return (_a = this.actor.getEffectConfig(Grappled)) == null ? void 0 : _a.by;
    }
    getAffected() {
      return sieve(this.actor, this.grappler);
    }
    getTargets() {
      return sieve(this.grappler);
    }
    check(config, ec) {
      if (!this.grappler)
        ec.add("not being grappled", this);
      return super.check(config, ec);
    }
    async applyEffect({ choice: { ability, skill } }) {
      const { g, actor, grappler } = this;
      if (!grappler)
        throw new Error("Trying to escape a non-existent grapple");
      const { total: mine } = await g.abilityCheck(NaN, {
        ability,
        skill,
        who: actor,
        attacker: grappler,
        tags: chSet("grapple")
      });
      const { total: theirs } = await g.abilityCheck(NaN, {
        ability: "str",
        skill: "Athletics",
        who: grappler,
        attacker: actor,
        tags: chSet("grapple")
      });
      if (mine > theirs)
        await actor.removeEffect(Grappled);
    }
  };

  // src/actions/StabilizeAction.ts
  var StabilizeAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Stabilize",
        "implemented",
        { target: new TargetResolver(g, actor.reach, [hasEffect(Dying)]) },
        {
          description: `You can use your action to administer first aid to an unconscious creature and attempt to stabilize it, which requires a successful DC 10 Wisdom (Medicine) check.`,
          time: "action"
        }
      );
    }
    async applyEffect({ target }) {
      const { outcome } = await this.g.abilityCheck(10, {
        ability: "wis",
        skill: "Medicine",
        who: this.actor,
        tags: chSet()
      });
      if (outcome === "success") {
        await target.removeEffect(Dying);
        await target.addEffect(Stable, { duration: Infinity });
      }
    }
  };

  // src/img/act/stand.svg
  var stand_default = "./stand-L4X6POXJ.svg";

  // src/actions/StandUpAction.ts
  var StandUpIcon = makeIcon(stand_default);
  var StandUpAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Stand Up",
        "implemented",
        {},
        {
          icon: StandUpIcon,
          description: `Standing up takes more effort; doing so costs an amount of movement equal to half your speed. For example, if your speed is 30 feet, you must spend 15 feet of movement to stand up. You can't stand up if you don't have enough movement left or if your speed is 0.`,
          tags: ["escape move prevention"]
          // makes sense to me
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
    async applyEffect() {
      this.actor.movedSoFar += this.cost;
      await this.actor.removeEffect(Prone);
      this.g.text(new MessageBuilder().co(this.actor).text(" stands up."));
    }
  };

  // src/interruptions/EvaluateLater.ts
  var EvaluateLater = class {
    constructor(who, source, priority, apply, isStillValid) {
      this.who = who;
      this.source = source;
      this.priority = priority;
      this.apply = apply;
      this.isStillValid = isStillValid;
    }
  };

  // src/utils/points.ts
  var _p = (x, y) => ({ x, y });
  function addPoints(a, b) {
    return _p(a.x + b.x, a.y + b.y);
  }
  function mulPoint(z, mul) {
    return _p(z.x * mul, z.y * mul);
  }
  function subPoints(a, b) {
    return _p(a.x - b.x, a.y - b.y);
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
  function supercoverLine(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const nx = Math.abs(dx);
    const ny = Math.abs(dy);
    const moveX = dx > 0 ? MapSquareSize : -MapSquareSize;
    const moveY = dy > 0 ? MapSquareSize : -MapSquareSize;
    const p = _p(a.x, a.y);
    const points = [_p(p.x, p.y)];
    for (let ix = 0, iy = 0; ix < nx || iy < ny; ) {
      const decision = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;
      if (decision === 0) {
        p.x += moveX;
        p.y += moveY;
        ix += MapSquareSize;
        iy += MapSquareSize;
      } else if (decision < 0) {
        p.x += moveX;
        ix += MapSquareSize;
      } else {
        p.y += moveY;
        iy += MapSquareSize;
      }
      points.push(_p(p.x, p.y));
    }
    return points;
  }
  function getPathAwayFrom(p, away, dist) {
    const dy = p.y - away.y;
    const dx = p.x - away.x;
    const angle = Math.atan2(dy, dx);
    const mx = dist * Math.cos(angle);
    const my = dist * Math.sin(angle);
    return supercoverLine(
      p,
      _p(Math.floor(p.x + mx), Math.floor(p.y + my))
    ).slice(1);
  }

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
            new EvaluateLater(who, Dying, Priority_default.ChangesOutcome, async () => {
              const {
                outcome,
                roll: { values }
              } = await g.save({
                source: Dying,
                type: { type: "flat", dc: 10 },
                who,
                tags: ["death"]
              });
              if (values.final === 20)
                await g.heal(Dying, 1, { target: who });
              else if (values.final === 1)
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
            new EvaluateLater(who, Dying, Priority_default.ChangesOutcome, async () => {
              who.deathSaveFailures = 0;
              who.deathSaveSuccesses = 0;
              await who.removeEffect(Dying);
              await who.addEffect(Prone, { duration: Infinity });
            })
          );
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        const dying = Array.from(g.combatants).find(
          (other) => other.hasEffect(Dying)
        );
        if (dying)
          actions.push(new StabilizeAction(g, who));
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
          new EvaluateLater(who, Stable, Priority_default.ChangesOutcome, async () => {
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
      g.events.on("GatherHeal", ({ detail: { target, multiplier } }) => {
        if (target.hasEffect(Dead))
          multiplier.add("zero", Dead);
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
          const d = distance(who, target);
          diceType.add(d <= 5 ? "advantage" : "disadvantage", Prone);
        }
      });
    },
    { icon: makeIcon(prone_default) }
  );
  var Charmed = new Effect(
    "Charmed",
    "turnEnd",
    (g) => {
      g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
        var _a;
        const charm = action.actor.getEffectConfig(Charmed);
        const targets = (_a = action.getTargets(config)) != null ? _a : [];
        if ((charm == null ? void 0 : charm.by) && targets.includes(charm.by) && action.tags.has("harmful"))
          error.add(
            "can't attack the charmer or target the charmer with harmful abilities or magical effects",
            Charmed
          );
      });
      g.events.on(
        "BeforeCheck",
        ({ detail: { target, who, tags, diceType } }) => {
          const charm = target == null ? void 0 : target.getEffectConfig(Charmed);
          if ((charm == null ? void 0 : charm.by) === who && tags.has("social"))
            diceType.add("advantage", Charmed);
        }
      );
    },
    { icon: makeIcon(charm_monster_default), tags: ["magic"] }
  );
  var Grappled = new Effect(
    "Grappled",
    "turnEnd",
    (g) => {
      const grappleRemover = (who) => new EvaluateLater(
        who,
        Grappled,
        Priority_default.Normal,
        () => who.removeEffect(Grappled)
      );
      const grappleMover = (who, grappled, displacement) => new YesNoChoice(
        who,
        Grappled,
        "Grapple",
        `Should ${who.name} drag ${grappled.name} as they move?`,
        Priority_default.ChangesOutcome,
        async () => {
          const destination = addPoints(grappled.position, displacement);
          await g.move(grappled, destination, {
            name: "Drag",
            forced: true,
            maximum: 5,
            mustUseAll: false,
            provokesOpportunityAttacks: false,
            teleportation: false,
            turnMovement: false,
            onMove: () => true
          });
        },
        async () => {
          if (distance(who, grappled) > who.reach)
            await grappled.removeEffect(Grappled);
        }
      );
      g.events.on("GetConditions", ({ detail: { who, grappling } }) => {
        for (const other of g.combatants) {
          const config = other.getEffectConfig(Grappled);
          if ((config == null ? void 0 : config.by) === who)
            grappling.add(other);
        }
      });
      g.events.on("AfterAction", ({ detail: { interrupt } }) => {
        for (const who of g.combatants) {
          const config = who.getEffectConfig(Grappled);
          if (config == null ? void 0 : config.by.conditions.has("Incapacitated"))
            interrupt.add(grappleRemover(who));
        }
      });
      g.events.on(
        "CombatantMoved",
        ({ detail: { who, handler, interrupt, old, position } }) => {
          const config = who.getEffectConfig(Grappled);
          if (config && handler.forced && distance(who, config.by) > config.by.reach)
            interrupt.add(grappleRemover(who));
          const displacement = subPoints(position, old);
          for (const grappled of who.grappling)
            interrupt.add(grappleMover(who, grappled, displacement));
        }
      );
      g.events.on("GetSpeed", ({ detail: { who, multiplier, bonus } }) => {
        if (who.hasEffect(Grappled)) {
          multiplier.add("zero", Grappled);
          bonus.ignoreAll();
          return;
        }
        for (const grappled of who.grappling) {
          if (who.size - grappled.size < 2) {
            multiplier.add("half", Grappled);
            return;
          }
        }
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who.hasEffect(Grappled))
          actions.push(new EscapeGrappleAction(g, who));
      });
    }
  );
  var DouseFireAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Douse Fire",
        "implemented",
        { target: new TargetResolver(g, actor.reach, [hasEffect(OnFire)]) },
        {
          time: "action",
          description: `Until a creature takes an action to douse the fire, the target takes 5 (1d10) fire damage at the start of each of its turns.`
        }
      );
    }
    async applyEffect({ target }) {
      await target.removeEffect(OnFire);
    }
  };
  var OnFire = new Effect(
    "On Fire",
    "turnEnd",
    (g) => {
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(OnFire))
          interrupt.add(
            new EvaluateLater(who, OnFire, Priority_default.ChangesOutcome, async () => {
              const damage = await g.rollDamage(1, {
                size: 10,
                damageType: "fire",
                source: OnFire,
                tags: atSet()
              });
              await g.damage(OnFire, "fire", { target: who }, [["fire", damage]]);
            })
          );
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        for (const other of g.combatants)
          if (other.hasEffect(OnFire)) {
            actions.push(new DouseFireAction(g, who));
            return;
          }
      });
    },
    { tags: ["fire"] }
  );
  var Surprised = new Effect("Surprised", "turnStart");

  // src/actions/AbstractAttackAction.ts
  var AbstractAttackAction = class extends AbstractAction {
    constructor(g, actor, name, status, weaponName, rangeCategory, config, options = {}) {
      super(g, actor, name, status, config, options);
      this.weaponName = weaponName;
      this.rangeCategory = rangeCategory;
      this.tags.add("attack");
      this.tags.add("costs attack");
      this.tags.add("harmful");
    }
    generateHealingConfigs() {
      return [];
    }
    getTime() {
      if (this.tags.has("costs attack") && this.actor.hasEffect(UsedAttackAction))
        return void 0;
      return "action";
    }
    async applyCosts(config) {
      await super.applyCosts(config);
      if (this.tags.has("costs attack")) {
        this.actor.attacksSoFar.push(this);
        await this.actor.addEffect(UsedAttackAction, { duration: 1 });
      }
    }
  };
  var AbstractSingleTargetAttackAction = class extends AbstractAttackAction {
    getTargets({ target }) {
      return sieve(target);
    }
    getAffected({ target }) {
      return [target];
    }
  };

  // src/actions/WeaponAttack.ts
  var thrownIcon = makeIcon(thrown_default);
  function getWeaponAttackName(name, rangeCategory, weapon, ammo) {
    const ammoName = ammo ? ammo.name : weapon.properties.has("thrown") && rangeCategory === "ranged" ? "thrown" : void 0;
    if (ammoName)
      return `${name} (${weapon.name}, ${ammoName})`;
    return `${name} (${weapon.name})`;
  }
  var WeaponAttack = class extends AbstractSingleTargetAttackAction {
    constructor(g, nameBasis, actor, rangeCategory, weapon, ammo, attackTags) {
      super(
        g,
        actor,
        getWeaponAttackName(nameBasis, rangeCategory, weapon, ammo),
        rangeCategory === "ranged" && weapon.properties.has("thrown") ? "incomplete" : "implemented",
        weapon.name,
        rangeCategory,
        {
          target: new TargetResolver(
            g,
            getWeaponRange(actor, weapon, rangeCategory),
            [notSelf]
          )
        },
        { icon: weapon.icon, subIcon: ammo == null ? void 0 : ammo.icon }
      );
      this.weapon = weapon;
      this.ammo = ammo;
      this.attackTags = attackTags;
      this.ability = getWeaponAbility(actor, weapon);
      if (rangeCategory === "ranged" && !ammo)
        this.subIcon = thrownIcon;
    }
    generateAttackConfigs(targets) {
      const ranges = [this.weapon.shortRange, this.weapon.longRange].filter(
        isDefined
      );
      return targets.flatMap(
        (target) => ranges.map((range) => ({
          config: { target },
          positioning: poSet(poWithin(range, target))
        }))
      );
    }
    getDamage() {
      return [this.weapon.damage];
    }
    getDescription() {
      const { actor, weapon, rangeCategory } = this;
      const rangeCategories = [];
      const ranges = [];
      if (rangeCategory === "melee") {
        rangeCategories.push("Melee");
        ranges.push(`reach ${getWeaponRange(actor, weapon, "melee")} ft.`);
      }
      if (rangeCategory === "ranged") {
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
    check(config, ec) {
      if (this.weapon.properties.has("two-handed") && this.actor.freeHands < 1)
        ec.add("need two hands", this);
      return super.check(config, ec);
    }
    async applyEffect({ target }) {
      await doStandardAttack(this.g, {
        ability: this.ability,
        ammo: this.ammo,
        attacker: this.actor,
        source: this,
        target,
        weapon: this.weapon,
        rangeCategory: this.rangeCategory,
        tags: this.attackTags
      });
    }
  };
  var Versatile = { name: "Versatile" };
  async function doStandardAttack(g, {
    ability,
    ammo,
    attacker,
    source,
    target,
    weapon,
    rangeCategory,
    tags: startTags
  }) {
    const tags = new Set(startTags);
    if (rangeCategory === "ranged") {
      tags.add("ranged");
      if (weapon.properties.has("thrown"))
        tags.add("thrown");
    } else {
      tags.add("melee");
    }
    if (weapon.category !== "natural")
      tags.add("weapon");
    if (weapon.magical || (ammo == null ? void 0 : ammo.magical))
      tags.add("magical");
    if (weapon.properties.has("two-handed"))
      tags.add("two hands");
    if (weapon.properties.has("versatile") && attacker.freeHands > 0)
      await new YesNoChoice(
        attacker,
        Versatile,
        "Versatile",
        `Use both hands to attack with ${attacker.name}'s ${weapon.name}?`,
        Priority_default.Normal,
        async () => tags.add("two hands").add("versatile")
      ).apply(g);
    return getAttackResult(
      g,
      source,
      await g.attack({ who: attacker, tags, target, ability, weapon, ammo })
    );
  }
  async function getAttackResult(g, source, e2) {
    if (e2.outcome === "cancelled")
      return { type: "cancelled" };
    const {
      who: attacker,
      target,
      ability,
      weapon,
      ammo,
      tags
    } = e2.attack.roll.type;
    if (ammo)
      attacker.removeFromInventory(ammo, 1);
    if (tags.has("thrown") && weapon) {
      attacker.equipment.delete(weapon);
    }
    if (e2.hit) {
      if (weapon) {
        const { damage } = weapon;
        const baseDamage = [];
        if (damage.type === "dice") {
          let { size } = damage.amount;
          if (e2.attack.roll.type.tags.has("versatile"))
            size += 2;
          const amount = await g.rollDamage(
            damage.amount.count,
            {
              source,
              size,
              damageType: damage.damageType,
              attacker,
              target,
              ability,
              weapon,
              tags
            },
            e2.critical
          );
          baseDamage.push([damage.damageType, amount]);
        } else
          baseDamage.push([damage.damageType, damage.amount]);
        const e22 = await g.damage(
          weapon,
          weapon.damage.damageType,
          {
            attack: e2.attack,
            attacker,
            target,
            ability,
            weapon,
            ammo,
            critical: e2.critical
          },
          baseDamage
        );
        return { type: "hit", attack: e2, damage: e22 };
      }
      return { type: "hit", attack: e2 };
    }
    return { type: "miss", attack: e2 };
  }
  function meleeWeaponAttack(g, actor, weapon, tags) {
    if (weapon.rangeCategory === "ranged")
      throw new Error(`meleeWeaponAttack(${weapon.name})`);
    return new WeaponAttack(g, "Attack", actor, "melee", weapon, void 0, tags);
  }
  function thrownWeaponAttack(g, actor, weapon, tags) {
    if (!weapon.properties.has("thrown"))
      throw new Error(`thrownWeaponAttack(${weapon.name})`);
    return new WeaponAttack(
      g,
      "Attack",
      actor,
      "ranged",
      weapon,
      void 0,
      tags
    );
  }
  function rangedWeaponAttack(g, actor, weapon, ammo, tags) {
    if (weapon.rangeCategory !== "ranged")
      throw new Error(`rangedWeaponAttack(${weapon.name})`);
    return new WeaponAttack(g, "Attack", actor, "ranged", weapon, ammo, tags);
  }

  // src/actions/OpportunityAttack.ts
  var OpportunityAttack = class extends WeaponAttack {
    constructor(g, actor, weapon) {
      super(g, "Opportunity Attack", actor, "melee", weapon, void 0, [
        "opportunity"
      ]);
      this.tags.delete("costs attack");
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
  var DisengageAction = class extends AbstractSelfAction {
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
    async applyEffect() {
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
  var DodgeAction = class extends AbstractSelfAction {
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
    async applyEffect() {
      await this.actor.addEffect(DodgeEffect, { duration: 1 });
    }
  };

  // src/actions/DoffAction.ts
  var DoffAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Doff",
        "implemented",
        {
          item: new ChoiceResolver(
            g,
            "Item",
            Array.from(
              actor.equipment,
              (value) => makeChoice(value, value.name)
            ).filter(({ value }) => value.hands)
          )
        },
        {
          description: `You can interact with one object or feature of the environment for free, during either your move or your action. For example, you could open a door during your move as you stride toward a foe, or you could draw your weapon as part of the same action you use to attack. If you want to interact with a second object, you need to use your action.`
        }
      );
    }
    getTime() {
      if (this.actor.hasTime("item interaction"))
        return "item interaction";
      return "action";
    }
    async applyEffect({ item }) {
      if (this.actor.doff(item))
        this.g.text(
          new MessageBuilder().co(this.actor).text(" doffs their ").it(item).text(".")
        );
    }
  };

  // src/actions/DonAction.ts
  var DonAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Don",
        "implemented",
        {
          item: new ChoiceResolver(
            g,
            "Item",
            Array.from(
              actor.inventory.keys(),
              (value) => makeChoice(value, value.name)
            ).filter(({ value }) => value.hands)
          )
        },
        {
          description: `You can interact with one object or feature of the environment for free, during either your move or your action. For example, you could open a door during your move as you stride toward a foe, or you could draw your weapon as part of the same action you use to attack. If you want to interact with a second object, you need to use your action.`
        }
      );
    }
    check(config, ec) {
      if (config.item && config.item.hands > this.actor.freeHands)
        ec.add("not enough hands", this);
      return super.check(config, ec);
    }
    getTime() {
      if (this.actor.hasTime("item interaction"))
        return "item interaction";
      return "action";
    }
    async applyEffect({ item }) {
      if (this.actor.don(item))
        this.g.text(
          new MessageBuilder().co(this.actor).text(" dons their ").it(item).text(".")
        );
    }
  };

  // src/actions/GrappleAction.ts
  var isNotGrappling = (who) => ({
    name: "not grappling",
    message: "already grappling",
    check: (g, action, value) => !who.grappling.has(value)
  });
  var GrappleAction = class extends AbstractSingleTargetAttackAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Grapple",
        "implemented",
        "grapple",
        "melee",
        {
          target: new TargetResolver(g, actor.reach, [
            sizeOrLess(actor.size + 1),
            isNotGrappling(actor)
          ])
        },
        {
          description: `When you want to grab a creature or wrestle with it, you can use the Attack action to make a special melee attack, a grapple. If you're able to make multiple attacks with the Attack action, this attack replaces one of them. The target of your grapple must be no more than one size larger than you, and it must be within your reach.

    Using at least one free hand, you try to seize the target by making a grapple check, a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is incapacitated. If you succeed, you subject the target to the grappled condition (see the appendix). The condition specifies the things that end it, and you can release the target whenever you like (no action required).`
        }
      );
    }
    check(config, ec) {
      if (this.actor.freeHands < 1)
        ec.add("no free hands", this);
      return super.check(config, ec);
    }
    async applyEffect({ target }) {
      const { actor, g } = this;
      if (target.conditions.has("Incapacitated")) {
        await this.applyGrapple(target);
        return;
      }
      const { total: mine } = await g.abilityCheck(NaN, {
        ability: "str",
        skill: "Athletics",
        who: actor,
        attacker: target,
        tags: chSet("grapple")
      });
      await new PickFromListChoice(
        target,
        this,
        "Grapple",
        `${actor.name} is trying to grapple ${target.name}. Contest with which skill?`,
        Priority_default.Normal,
        GrappleChoices,
        async ({ ability, skill }) => {
          const { total: theirs } = await g.abilityCheck(NaN, {
            ability,
            skill,
            who: target,
            attacker: actor,
            tags: chSet("grapple")
          });
          if (mine > theirs)
            await this.applyGrapple(target);
        }
      ).apply(g);
    }
    // TODO [HANDS]
    async applyGrapple(target) {
      await target.addEffect(
        Grappled,
        { duration: Infinity, by: this.actor },
        this.actor
      );
    }
  };

  // src/actions/ReleaseGrappleAction.ts
  var isGrappling = (who) => ({
    name: "grappling",
    message: "not grappling",
    check: (g, action, value) => who.grappling.has(value)
  });
  var ReleaseGrappleAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Release Grapple",
        "implemented",
        { target: new TargetResolver(g, Infinity, [isGrappling(actor)]) },
        { description: `You can release the target whenever you like.` }
      );
    }
    async applyEffect({ target }) {
      await target.removeEffect(Grappled);
    }
  };

  // src/actions/ShoveAction.ts
  var shoveTypeChoices = [
    makeChoice("prone", "knock prone"),
    makeChoice("push", "push 5 feet away")
  ];
  var ShoveAction = class extends AbstractSingleTargetAttackAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Shove",
        "implemented",
        "shove",
        "melee",
        {
          target: new TargetResolver(g, actor.reach, [
            sizeOrLess(actor.size + 1)
          ]),
          type: new ChoiceResolver(g, "Action", shoveTypeChoices)
        },
        {
          description: `Using the Attack action, you can make a special melee attack to shove a creature, either to knock it prone or push it away from you. If you're able to make multiple attacks with the Attack action, this attack replaces one of them.

    The target of your shove must be no more than one size larger than you, and it must be within your reach. You make a Strength (Athletics) check contested by the target's Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). You succeed automatically if the target is incapacitated. If you succeed, you either knock the target prone or push it 5 feet away from you.`
        }
      );
    }
    async applyEffect({ target, type }) {
      const { g, actor } = this;
      if (target.conditions.has("Incapacitated")) {
        await this.applyShove(target, type);
        return;
      }
      const { total: mine } = await g.abilityCheck(NaN, {
        ability: "str",
        skill: "Athletics",
        who: actor,
        attacker: target,
        tags: chSet("shove")
      });
      await new PickFromListChoice(
        target,
        this,
        "Grapple",
        `${actor.name} is trying to shove ${target.name}. Contest with which skill?`,
        Priority_default.Normal,
        GrappleChoices,
        async ({ ability, skill }) => {
          const { total: theirs } = await g.abilityCheck(NaN, {
            ability,
            skill,
            who: target,
            attacker: actor,
            tags: chSet("shove")
          });
          if (mine > theirs)
            await this.applyShove(target, type);
        }
      ).apply(g);
    }
    async applyShove(target, type) {
      if (type === "prone")
        await target.addEffect(Prone, { duration: Infinity }, this.actor);
      else
        await this.g.forcePush(target, this.actor, 5, this);
    }
  };

  // src/actions/TwoWeaponAttack.ts
  var TwoWeaponAttack = class extends WeaponAttack {
    constructor(g, actor, rangeCategory, weapon) {
      super(g, "Two-Weapon Attack", actor, rangeCategory, weapon, void 0, [
        "two-weapon"
      ]);
      this.tags.delete("costs attack");
    }
    getTime() {
      return "bonus action";
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

  // src/DndRules.ts
  var AbilityScoreRule = new DndRule("Ability Score", (g) => {
    g.events.on("BeforeAttack", ({ detail: { who, ability, bonus, tags } }) => {
      if (ability) {
        const modifier = who[ability].modifier;
        if (modifier < 0 || !tags.has("two-weapon"))
          bonus.add(who[ability].modifier, AbilityScoreRule);
      }
    });
    g.events.on("BeforeCheck", ({ detail: { who, ability, bonus } }) => {
      bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g.events.on("BeforeSave", ({ detail: { who, ability, bonus } }) => {
      if (ability)
        bonus.add(who[ability].modifier, AbilityScoreRule);
    });
    g.events.on("GatherDamage", ({ detail: { attacker, ability, bonus } }) => {
      if (attacker && ability)
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
      methods.push({
        name,
        ac: armorAC + dexMod + shieldAC,
        uses
      });
    });
  });
  var ArmorProficiencyRule = new DndRule("Armor Proficiency", (g) => {
    const lacksArmorProficiency = (who) => !!(who.armor && who.getProficiency(who.armor) !== "proficient");
    g.events.on("BeforeCheck", ({ detail: { who, diceType } }) => {
      if (lacksArmorProficiency(who))
        diceType.add("disadvantage", ArmorProficiencyRule);
    });
    g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
      if (lacksArmorProficiency(who))
        diceType.add("disadvantage", ArmorProficiencyRule);
    });
    g.events.on("BeforeAttack", ({ detail: { who, diceType, ability } }) => {
      if (lacksArmorProficiency(who) && (ability === "str" || ability === "dex"))
        diceType.add("disadvantage", ArmorProficiencyRule);
    });
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.tags.has("spell") && lacksArmorProficiency(action.actor))
        error.add("not proficient", ArmorProficiencyRule);
    });
  });
  var BlindedRule = new DndRule("Blinded", (g) => {
    g.events.on("CheckVision", ({ detail: { who, error } }) => {
      if (who.conditions.has("Blinded"))
        error.add("cannot see", BlindedRule);
    });
    g.events.on("BeforeCheck", ({ detail: { who, tags, successResponse } }) => {
      if (who.conditions.has("Blinded") && tags.has("sight"))
        successResponse.add("fail", BlindedRule);
    });
    g.events.on("BeforeAttack", ({ detail: { who, diceType, target } }) => {
      if (target.conditions.has("Blinded"))
        diceType.add("advantage", BlindedRule);
      if (who.conditions.has("Blinded"))
        diceType.add("disadvantage", BlindedRule);
    });
  });
  var CloseCombatRule = new DndRule("Close Combat", (g) => {
    g.events.on("BeforeAttack", ({ detail: { tags, who, diceType } }) => {
      if (tags.has("ranged")) {
        let threatened = false;
        for (const other of g.combatants) {
          if (other.side !== who.side && distance(who, other) <= 5 && g.canSee(other, who) && !other.conditions.has("Incapacitated")) {
            threatened = true;
            break;
          }
        }
        if (threatened)
          diceType.add("disadvantage", CloseCombatRule);
      }
    });
  });
  var CombatActionsRule = new DndRule("Combat Actions", (g) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      actions.push(new DashAction(g, who));
      actions.push(new DisengageAction(g, who));
      actions.push(new DodgeAction(g, who));
      actions.push(new GrappleAction(g, who));
      if (who.grappling.size)
        actions.push(new ReleaseGrappleAction(g, who));
      actions.push(new ShoveAction(g, who));
      if (who.inventory.size && who.freeHands)
        actions.push(new DonAction(g, who));
      if (who.equipment.size)
        actions.push(new DoffAction(g, who));
    });
  });
  var DeafenedRule = new DndRule("Deafened", (g) => {
    g.events.on("BeforeCheck", ({ detail: { tags, who, successResponse } }) => {
      if (tags.has("hearing") && who.conditions.has("Deafened"))
        successResponse.add("fail", DeafenedRule);
    });
    g.events.on("CheckHearing", ({ detail: { who, error } }) => {
      if (who.conditions.has("Deafened"))
        error.add("deaf", DeafenedRule);
    });
  });
  var DifficultTerrainRule = { name: "Difficult Terrain" };
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
          new EvaluateLater(
            who,
            ExhaustionRule,
            Priority_default.Late,
            () => g.kill(who)
          )
        );
    });
  });
  var FrightenedRule = new DndRule("Frightened", (g) => {
    const checkFrightened = ({
      detail: { who, diceType }
    }) => {
      for (const other of who.frightenedBy)
        if (g.canSee(who, other)) {
          diceType.add("disadvantage", FrightenedRule);
          return;
        }
    };
    g.events.on("BeforeCheck", checkFrightened);
    g.events.on("BeforeAttack", checkFrightened);
    g.events.on("BeforeMove", ({ detail: { who, from, to, error } }) => {
      for (const other of who.frightenedBy) {
        const { oldDistance, newDistance } = compareDistances(
          other,
          other.position,
          who,
          from,
          to
        );
        if (newDistance < oldDistance)
          error.add(`cannot move closer to ${other.name}`, FrightenedRule);
      }
    });
  });
  var HeavyArmorRule = new DndRule("Heavy Armor", (g) => {
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      var _a, _b;
      const minimum = (_b = (_a = who.armor) == null ? void 0 : _a.minimumStrength) != null ? _b : 1;
      if (who.str.score < minimum)
        bonus.add(-10, HeavyArmorRule);
    });
    g.events.on(
      "BeforeCheck",
      ({ detail: { ability, skill, who, diceType } }) => {
        var _a;
        if (ability === "dex" && skill === "Stealth" && ((_a = who.armor) == null ? void 0 : _a.stealthDisadvantage))
          diceType.add("disadvantage", HeavyArmorRule);
      }
    );
  });
  var IncapacitatedRule = new DndRule("Incapacitated", (g) => {
    g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
      if (action.actor.conditions.has("Incapacitated") && (action.tags.has("costs attack") || action.getTime(config)))
        error.add("incapacitated", IncapacitatedRule);
    });
  });
  var LongRangeAttacksRule = new DndRule("Long Range Attacks", (g) => {
    g.events.on(
      "BeforeAttack",
      ({ detail: { who, target, weapon, diceType } }) => {
        if (isDefined(weapon == null ? void 0 : weapon.shortRange) && distance(who, target) > weapon.shortRange)
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
      const squares = getSquares(target, target.position);
      if (isHeavilyObscuredAnywhere(squares))
        diceType.add("disadvantage", ObscuredRule);
    });
    g.events.on("GetConditions", ({ detail: { conditions, who } }) => {
      const squares = getSquares(who, who.position);
      if (isHeavilyObscuredAnywhere(squares))
        conditions.add("Blinded", ObscuredRule);
    });
  });
  var OneAttackPerTurnRule = new DndRule("Attacks per turn", (g) => {
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.tags.has("costs attack") && action.actor.attacksSoFar.length)
        error.add("No attacks left", OneAttackPerTurnRule);
    });
  });
  var OneSpellPerTurnRule = new DndRule("Spells per turn", (g) => {
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (!action.actor.spellsSoFar.length || !isCastSpell(action) || action.spell.time === "reaction")
        return;
      const considering = action.actor.spellsSoFar.concat(action.spell);
      const bonusActionSpell = considering.find(
        (sp) => sp.time === "bonus action"
      );
      const cantripActionSpell = considering.find(
        (sp) => sp.level === 0 && sp.time === "action"
      );
      if (!bonusActionSpell || !cantripActionSpell)
        error.add(
          "can only cast a bonus action spell and an action cantrip in the same turn",
          OneSpellPerTurnRule
        );
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
      const range = getWeaponRange(attacker, weapon, "melee");
      return oldDistance <= range && newDistance > range;
    }).map((weapon) => new OpportunityAttack(g, attacker, weapon)).filter((opportunity) => checkConfig(g, opportunity, { target }));
  }
  var OpportunityAttacksRule = new DndRule(
    "Opportunity Attacks",
    (g) => {
      g.events.on(
        "BeforeMove",
        ({
          detail: {
            handler,
            who,
            from,
            to,
            interrupt,
            simulation,
            success,
            error
          }
        }) => {
          if (!handler.provokesOpportunityAttacks || simulation)
            return;
          for (const attacker of g.combatants) {
            if (attacker.side === who.side)
              continue;
            const validActions = getValidOpportunityAttacks(
              g,
              attacker,
              attacker.position,
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
                  Priority_default.Late,
                  validActions.map((value) => ({
                    label: value.weapon.name,
                    value
                  })),
                  async (opportunity) => {
                    await g.act(opportunity, { target: who });
                  },
                  true,
                  () => success.result !== "fail" && error.result
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
  var autoCrit = (g, condition, rule, maxRange = 5) => ({
    detail: {
      roll: {
        type: { who, target }
      },
      outcome
    }
  }) => {
    if (target.conditions.has(condition) && distance(who, target) <= maxRange)
      outcome.add("critical", rule);
  };
  var ParalyzedRule = new DndRule("Paralyzed", (g) => {
    g.events.on("BeforeMove", ({ detail: { who, error } }) => {
      if (who.conditions.has("Paralyzed"))
        error.add("paralyzed", ParalyzedRule);
    });
    g.events.on("CheckAction", ({ detail: { action, error } }) => {
      if (action.actor.conditions.has("Paralyzed") && action.tags.has("vocal"))
        error.add("paralyzed", ParalyzedRule);
    });
    g.events.on(
      "BeforeSave",
      autoFail("Paralyzed", ParalyzedRule, ["str", "dex"])
    );
    g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
      if (target.conditions.has("Paralyzed"))
        diceType.add("advantage", ParalyzedRule);
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
    g.events.on(
      "BeforeAttack",
      ({ detail: { who, proficiency, spell, weapon } }) => {
        proficiency.add(
          weapon ? who.getProficiency(weapon) : spell ? "proficient" : "none",
          ProficiencyRule
        );
      }
    );
    g.events.on(
      "BeforeCheck",
      ({ detail: { who, skill, tool, proficiency } }) => {
        if (skill)
          proficiency.add(who.getProficiency(skill), ProficiencyRule);
        if (tool)
          proficiency.add(who.getProficiency(tool), ProficiencyRule);
      }
    );
    g.events.on("BeforeSave", ({ detail: { who, ability, proficiency } }) => {
      if (ability)
        proficiency.add(who.getProficiency(ability), ProficiencyRule);
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
    g.events.on("GetSpeed", ({ detail: { who, multiplier, bonus } }) => {
      if (who.conditions.has("Restrained")) {
        multiplier.add("zero", RestrainedRule);
        bonus.ignoreAll();
      }
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
  var SpeedRule = new DndRule("Speed", (g) => {
    g.events.on("BeforeMove", ({ detail: { handler, cost, who, error } }) => {
      if (handler.turnMovement && cost + who.movedSoFar > who.speed)
        error.add("cannot exceed speed", SpeedRule);
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
  var TwoWeaponFightingRule = new DndRule("Two-Weapon Fighting", (g) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      const lightMeleeAttack = who.attacksSoFar.find(
        (atk) => atk instanceof WeaponAttack && atk.weapon.properties.has("light") && atk.weapon.rangeCategory === "melee"
      );
      const otherLightWeapon = lightMeleeAttack && who.weapons.find(
        (w) => w.properties.has("light") && w !== lightMeleeAttack.weapon
      );
      if (otherLightWeapon) {
        actions.push(new TwoWeaponAttack(g, who, "melee", otherLightWeapon));
        if (otherLightWeapon.properties.has("thrown"))
          actions.push(new TwoWeaponAttack(g, who, "ranged", otherLightWeapon));
      }
    });
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
          if (weapon.rangeCategory === "melee") {
            actions.push(meleeWeaponAttack(g, who, weapon));
          } else {
            for (const ammo of getValidAmmunition(who, weapon))
              actions.push(rangedWeaponAttack(g, who, weapon, ammo));
          }
          if (weapon.properties.has("thrown"))
            actions.push(thrownWeaponAttack(g, who, weapon));
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

  // src/events/AfterAttackEvent.ts
  var AfterAttackEvent = class extends CustomEvent {
    constructor(detail) {
      super("AfterAttack", { detail });
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

  // src/events/CheckHearingEvent.ts
  var CheckHearingEvent = class extends CustomEvent {
    constructor(detail) {
      super("CheckHearing", { detail });
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

  // src/events/CombatantInitiativeEvent.ts
  var CombatantInitiativeEvent = class extends CustomEvent {
    constructor(detail) {
      super("CombatantInitiative", { detail });
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

  // src/events/GetTerrainEvent.ts
  var GetTerrainEvent = class extends CustomEvent {
    constructor(detail) {
      super("GetTerrain", { detail });
    }
  };

  // src/events/SaveEvent.ts
  var SaveEvent = class extends CustomEvent {
    constructor(detail) {
      super("Save", { detail });
    }
  };

  // src/events/TextEvent.ts
  var TextEvent = class extends CustomEvent {
    constructor(detail) {
      super("Text", { detail });
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

  // src/movement.ts
  var getDefaultMovement = (who) => ({
    name: "Movement",
    maximum: who.speed,
    forced: false,
    mustUseAll: false,
    provokesOpportunityAttacks: true,
    teleportation: false,
    turnMovement: true,
    onMove(who2, cost) {
      who2.movedSoFar += cost;
      return who2.movedSoFar >= who2.speed;
    }
  });
  var getTeleportation = (maximum, name = "Teleport", turnMovement = false) => ({
    name,
    maximum,
    forced: false,
    mustUseAll: false,
    provokesOpportunityAttacks: false,
    teleportation: true,
    turnMovement,
    onMove: () => true
  });
  var BoundedMove = class {
    constructor(source, maximum, {
      check,
      forced = false,
      mustUseAll = false,
      teleportation = false,
      turnMovement = false,
      provokesOpportunityAttacks = !(forced || teleportation)
    } = {}) {
      this.source = source;
      this.maximum = maximum;
      this.name = source.name;
      this.used = 0;
      this.check = check;
      this.forced = forced;
      this.mustUseAll = mustUseAll;
      this.provokesOpportunityAttacks = provokesOpportunityAttacks;
      this.teleportation = teleportation;
      this.turnMovement = turnMovement;
    }
    onMove(who, cost) {
      this.used += cost;
      return this.used >= this.maximum;
    }
  };

  // src/types/MoveDirection.ts
  var MoveDirections = [
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
    "north",
    "northeast"
  ];

  // src/types/SaveTag.ts
  var svSet = (...items) => new Set(items);

  // src/Engine.ts
  var Engine = class {
    constructor() {
      this.dice = new DiceBag();
      this.events = new Dispatcher();
      this.combatants = /* @__PURE__ */ new Set();
      this.activeCombatant = void 0;
      this.effects = /* @__PURE__ */ new Set();
      this.id = 0;
      this.initiativeOrder = [];
      this.initiativePosition = NaN;
      this.rules = new DndRules(this);
    }
    reset() {
      this.dice = new DiceBag();
      this.events = new Dispatcher();
      this.combatants.clear();
      this.activeCombatant = void 0;
      this.effects.clear();
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
      who.position = position;
      who.initiative = NaN;
      this.combatants.add(who);
      this.fire(new CombatantPlacedEvent({ who, position }));
    }
    async start() {
      for (const who of this.combatants) {
        who.finalise();
        who.initiative = await this.rollInitiative(who);
        const items = [...who.inventory.keys(), ...who.equipment];
        for (const item of items) {
          item.owner = who;
          item.possessor = who;
        }
      }
      this.initiativeOrder = Array.from(this.combatants).sort(
        (a, b) => b.initiative - a.initiative
      );
      if (!this.initiativeOrder.length)
        return;
      await this.resolve(
        new BattleStartedEvent({ interrupt: new InterruptionCollector() })
      );
      await this.nextTurn();
    }
    async rollMany(count, e2, critical = false) {
      const rolls = await Promise.all(
        Array(count * (critical ? 2 : 1)).fill(null).map(async () => await this.roll(e2))
      );
      return rolls.reduce((acc, roll) => acc + roll.values.final, 0);
    }
    async rollDamage(count, e2, critical = false) {
      return this.rollMany(count, { ...e2, type: "damage" }, critical);
    }
    async rollHeal(count, e2, critical = false) {
      return this.rollMany(count, { ...e2, type: "heal" }, critical);
    }
    async rollInitiative(who) {
      const pre = (await this.resolve(
        new GetInitiativeEvent({
          who,
          bonus: new BonusCollector(),
          diceType: new DiceTypeCollector(),
          interrupt: new InterruptionCollector()
        })
      )).detail;
      const diceType = pre.diceType.result;
      const roll = await this.roll({ type: "initiative", who }, diceType);
      const value = roll.values.final + pre.bonus.result;
      this.fire(
        new CombatantInitiativeEvent({ who, diceType, value, pre, roll })
      );
      return value;
    }
    addProficiencyBonus(who, proficiency, bonus, pb) {
      const result = proficiency.result;
      if (result) {
        const value = Math.floor(result * (who.pb + pb.result));
        bonus.add(value, ProficiencyRule);
      }
    }
    async savingThrow(dc, e2, {
      diceType: baseDiceType,
      save,
      fail
    } = {
      save: "half",
      fail: "normal"
    }) {
      const successResponse = new SuccessResponseCollector();
      const pb = new BonusCollector();
      const proficiency = new ProficiencyCollector();
      const bonus = new BonusCollector();
      const diceType = new DiceTypeCollector();
      const saveDamageResponse = new SaveDamageResponseCollector(save);
      const failDamageResponse = new SaveDamageResponseCollector(fail);
      if (baseDiceType)
        diceType.add(baseDiceType, { name: "Base" });
      const pre = (await this.resolve(
        new BeforeSaveEvent({
          ...e2,
          dc,
          pb,
          proficiency,
          bonus,
          diceType,
          successResponse,
          saveDamageResponse,
          failDamageResponse,
          interrupt: new InterruptionCollector()
        })
      )).detail;
      this.addProficiencyBonus(e2.who, proficiency, bonus, pb);
      let roll = {
        type: { type: "save", ...e2 },
        diceType: "normal",
        interrupt: new InterruptionCollector(),
        size: 20,
        values: new ValueCollector(NaN)
      };
      let total = NaN;
      let forced = false;
      let success = false;
      if (successResponse.result !== "normal") {
        success = successResponse.result === "success";
        forced = true;
      } else {
        roll = await this.roll({ type: "save", ...e2 }, diceType.result);
        total = roll.values.final + bonus.result;
        success = total >= dc;
      }
      const outcome = success ? "success" : "fail";
      this.fire(
        new SaveEvent({
          pre,
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
    async abilityCheck(dc, e2) {
      const successResponse = new SuccessResponseCollector();
      const pb = new BonusCollector();
      const proficiency = new ProficiencyCollector();
      const bonus = new BonusCollector();
      const diceType = new DiceTypeCollector();
      const pre = (await this.resolve(
        new BeforeCheckEvent({
          ...e2,
          dc,
          pb,
          proficiency,
          bonus,
          diceType,
          successResponse,
          interrupt: new InterruptionCollector()
        })
      )).detail;
      this.addProficiencyBonus(e2.who, proficiency, bonus, pb);
      let forced = false;
      let success = false;
      const roll = await this.roll({ type: "check", ...e2 }, diceType.result);
      const total = roll.values.final + bonus.result;
      if (successResponse.result !== "normal") {
        success = successResponse.result === "success";
        forced = true;
      } else {
        success = total >= dc;
      }
      const outcome = success ? "success" : "fail";
      this.fire(
        new AbilityCheckEvent({
          pre,
          diceType: diceType.result,
          roll,
          dc,
          outcome,
          total,
          forced
        })
      );
      return { outcome, forced, total };
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
      who.spellsSoFar = [];
      who.movedSoFar = 0;
      await this.resolve(
        new TurnStartedEvent({ who, interrupt: new InterruptionCollector() })
      );
    }
    async moveInDirection(who, direction, handler, type = "speed") {
      const old = who.position;
      const position = movePoint(old, direction);
      return this.move(who, position, handler, type, direction);
    }
    async beforeMove(who, to, handler, type = "speed", direction, simulation) {
      var _a;
      const squares = getSquares(who, to);
      const difficult = new DifficultTerrainCollector();
      for (const where of squares)
        this.getTerrain(where, who, difficult);
      const multiplier = new MultiplierCollector();
      this.fire(
        new GetMoveCostEvent({
          who,
          from: who.position,
          to,
          squares,
          handler,
          type,
          multiplier,
          difficult
        })
      );
      if (difficult.result.size)
        multiplier.add("double", DifficultTerrainRule);
      const cost = multiplier.result * MapSquareSize;
      const error = new ErrorCollector();
      const pre = await this.resolve(
        new BeforeMoveEvent({
          who,
          from: who.position,
          to,
          cost,
          direction,
          handler,
          type,
          error,
          interrupt: new InterruptionCollector(),
          success: new SuccessResponseCollector(),
          simulation
        })
      );
      (_a = handler.check) == null ? void 0 : _a.call(handler, pre);
      return pre.detail;
    }
    async move(who, position, handler, type = "speed", direction) {
      const old = who.position;
      const { success, error, cost } = await this.beforeMove(
        who,
        position,
        handler,
        type,
        direction
      );
      if (success.result === "fail")
        return { type: "prevented" };
      if (!error.result)
        return { type: "error", error };
      who.position = position;
      const handlerDone = handler.onMove(who, cost);
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
    async applyDamage(damage, data) {
      const { total, healAmount, breakdown } = this.calculateDamage(damage, data);
      if (healAmount > 0) {
        await this.applyHeal(data.who, healAmount, data.who);
      }
      if (total < 1)
        return;
      const { takenByTemporaryHP, afterTemporaryHP, temporaryHPSource } = this.applyTemporaryHP(data.who, total);
      await this.resolve(
        new CombatantDamagedEvent({
          who: data.who,
          attack: data.attack,
          attacker: data.attacker,
          total,
          takenByTemporaryHP,
          afterTemporaryHP,
          temporaryHPSource,
          breakdown,
          interrupt: new InterruptionCollector()
        })
      );
      if (data.who.hp <= 0) {
        await this.handleCombatantDeath(data.who, data.attacker);
      } else if (data.who.concentratingOn.size) {
        await this.handleConcentrationCheck(data.who, total);
      }
    }
    calculateDamage(damage, data) {
      let total = 0;
      let healAmount = 0;
      const breakdown = /* @__PURE__ */ new Map();
      for (const [damageType, raw] of damage) {
        const { response, amount } = this.calculateDamageResponse(
          damageType,
          raw,
          data
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
    calculateDamageResponse(damageType, raw, data) {
      const collector = new DamageResponseCollector();
      const innateResponse = data.who.damageResponses.get(damageType);
      if (innateResponse) {
        collector.add(innateResponse, data.who);
      }
      this.fire(
        new GetDamageResponseEvent({
          source: data.source,
          spell: data.spell,
          method: data.method,
          attack: data.attack,
          who: data.who,
          damageType,
          response: collector
        })
      );
      const { response, amount } = this.calculateDamageAmount(
        raw,
        collector.result,
        data.multiplier
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
        await target.endConcentration();
      }
    }
    async kill(target, attacker) {
      const result = await target.addEffect(Dead, { duration: Infinity });
      if (result) {
        this.combatants.delete(target);
        this.fire(new CombatantDiedEvent({ who: target, attacker }));
      }
      return result;
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
      return roll === 1 ? "miss" : (
        // If the d20 roll for an attack is a 20, the attack hits regardless of any modifiers or the target's AC.
        roll === 20 ? "critical" : (
          // To make an attack roll, roll a d20 and add the appropriate modifiers. If the total of the roll plus modifiers equals or exceeds the target's Armor Class (AC), the attack hits.
          total >= ac ? "hit" : "miss"
        )
      );
    }
    async attack(e2, config = {}) {
      const pb = new BonusCollector();
      const proficiency = new ProficiencyCollector();
      const bonus = new BonusCollector();
      const diceType = new DiceTypeCollector();
      const success = new SuccessResponseCollector();
      if (config.source) {
        if (config.bonus)
          bonus.add(config.bonus, config.source);
        if (config.diceType)
          diceType.add(config.diceType, config.source);
      }
      const pre = (await this.resolve(
        new BeforeAttackEvent({
          ...e2,
          pb,
          proficiency,
          bonus,
          diceType,
          success,
          interrupt: new InterruptionCollector()
        })
      )).detail;
      if (success.result === "fail")
        return {
          outcome: "cancelled",
          attack: void 0,
          hit: false,
          critical: false,
          target: pre.target
        };
      this.addProficiencyBonus(e2.who, proficiency, bonus, pb);
      const ac = await this.getAC(pre.target, pre);
      const roll = await this.roll({ type: "attack", ...pre }, diceType.result);
      const total = roll.values.final + bonus.result;
      const outcomeCollector = new AttackOutcomeCollector();
      const event = new AttackEvent({
        pre,
        roll,
        total,
        ac,
        outcome: outcomeCollector,
        interrupt: new InterruptionCollector()
      });
      outcomeCollector.setDefaultGetter(
        () => this.getAttackOutcome(
          event.detail.ac,
          event.detail.roll.values.final,
          event.detail.total
        )
      );
      const attack = await this.resolve(event);
      const outcome = outcomeCollector.result;
      return (await this.resolve(
        new AfterAttackEvent({
          outcome,
          attack: attack.detail,
          hit: outcome === "hit" || outcome === "critical",
          critical: outcome === "critical",
          target: roll.type.target,
          interrupt: new InterruptionCollector()
        })
      )).detail;
    }
    async damage(source, damageType, e2, damageInitialiser = [], startingMultiplier) {
      if (startingMultiplier === "zero")
        return;
      const map = new DamageMap(damageInitialiser);
      const multiplier = new MultiplierCollector();
      if (isDefined(startingMultiplier))
        multiplier.add(startingMultiplier, source);
      const bonus = new BonusCollector();
      await this.resolve(
        new GatherDamageEvent({
          critical: false,
          ...e2,
          map,
          bonus,
          multiplier,
          interrupt: new InterruptionCollector()
        })
      );
      map.add(damageType, bonus.result);
      return this.applyDamage(map, {
        source,
        spell: e2.spell,
        method: e2.method,
        attack: e2.attack,
        attacker: e2.attacker,
        who: e2.target,
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
      const e2 = await this.resolve(
        new GetACEvent({
          who,
          method,
          bonus: new BonusCollector(),
          interrupt: new InterruptionCollector(),
          pre
        })
      );
      return method.ac + e2.detail.bonus.result;
    }
    fire(e2) {
      if (e2.detail.interrupt)
        throw new Error(
          `Use Engine.resolve() on an interruptible event type: ${e2.type}`
        );
      this.events.fire(e2);
      return e2;
    }
    async resolve(e2) {
      this.events.fire(e2);
      for (const interruption of e2.detail.interrupt) {
        if (interruption.isStillValid && !interruption.isStillValid())
          continue;
        await interruption.apply(this);
      }
      return e2;
    }
    addEffectArea(area) {
      area.id = this.nextId();
      this.effects.add(area);
      this.fire(new AreaPlacedEvent({ area }));
      if (area.handler)
        this.events.on("GetTerrain", area.handler);
    }
    removeEffectArea(area) {
      this.effects.delete(area);
      this.fire(new AreaRemovedEvent({ area }));
      if (area.handler)
        this.events.off("GetTerrain", area.handler);
    }
    getInside(area, ignore = []) {
      const points = resolveArea(area);
      const inside = [];
      for (const who of this.combatants) {
        if (ignore.includes(who))
          continue;
        const squares = new PointSet(getSquares(who, who.position));
        if (points.overlaps(squares))
          inside.push(who);
      }
      return inside;
    }
    async applyBoundedMove(who, handler) {
      return new Promise(
        (resolve) => this.fire(new BoundedMoveEvent({ who, handler, resolve }))
      );
    }
    async heal(source, amount, e2, startingMultiplier) {
      const bonus = new BonusCollector();
      bonus.add(amount, source);
      const multiplier = new MultiplierCollector();
      if (isDefined(startingMultiplier))
        multiplier.add(startingMultiplier, source);
      const gather = await this.resolve(
        new GatherHealEvent({
          ...e2,
          bonus,
          multiplier,
          interrupt: new InterruptionCollector()
        })
      );
      const total = bonus.result * multiplier.result;
      return this.applyHeal(gather.detail.target, total, gather.detail.actor);
    }
    async applyHeal(who, fullAmount, actor) {
      if (fullAmount < 1)
        return;
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
          Priority_default.Normal,
          async () => this.setTemporaryHP(who, count, source)
        ).apply(this);
      this.setTemporaryHP(who, count, source);
      return true;
    }
    setTemporaryHP(who, count, source) {
      who.temporaryHP = count;
      who.temporaryHPSource = source;
    }
    canHear(who, target) {
      return this.fire(
        new CheckHearingEvent({ who, target, error: new ErrorCollector() })
      ).detail.error.result;
    }
    canSee(who, target) {
      return this.fire(
        new CheckVisionEvent({ who, target, error: new ErrorCollector() })
      ).detail.error.result;
    }
    async getSaveDC(e2) {
      const bonus = new BonusCollector();
      const interrupt = new InterruptionCollector();
      switch (e2.type.type) {
        case "ability":
          bonus.add(8, e2.source);
          break;
        case "flat":
          bonus.add(e2.type.dc, e2.source);
          break;
      }
      const result = await this.resolve(
        new GetSaveDCEvent({ ...e2, bonus, interrupt })
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
      fail = "normal",
      diceType
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
        { save, fail, diceType }
      );
      return { ...result, dcRoll };
    }
    text(message) {
      this.fire(new TextEvent({ message }));
    }
    async forcePush(who, pusher, dist, source, pushToward = false) {
      const path = getPathAwayFrom(
        who.position,
        pusher.position,
        pushToward ? -dist : dist
      );
      const handler = new BoundedMove(source, Infinity, { forced: true });
      for (const point of path) {
        const result = await this.move(who, point, handler);
        if (result.type !== "ok")
          break;
      }
    }
    async getValidMoves(who, handler) {
      const valid = [];
      for (const direction of MoveDirections) {
        const old = who.position;
        const position = movePoint(old, direction);
        const { success, error } = await this.beforeMove(
          who,
          position,
          handler,
          "speed",
          direction,
          true
        );
        if (success.result !== "fail" && error.result)
          valid.push(direction);
      }
      return valid;
    }
    getTerrain(where, who, difficult = new DifficultTerrainCollector()) {
      return this.fire(new GetTerrainEvent({ where, who, difficult })).detail;
    }
  };

  // src/ui/lib.ts
  var import_signals = __toESM(require_signals());
  var import_preact = __toESM(require_preact());
  var import_hooks = __toESM(require_hooks());

  // src/ui/hooks/useBool.ts
  function useBool(defaultValue = false) {
    const [value, setValue] = (0, import_hooks.useState)(defaultValue);
    const setTrue = () => setValue(true);
    const setFalse = () => setValue(false);
    const toggle = () => setValue((old) => !old);
    return [value, setTrue, setFalse, toggle];
  }

  // src/utils/immutable.ts
  var producer = (patcher) => (old) => {
    const newObj = clone(old);
    patcher(newObj);
    return newObj;
  };

  // src/ui/hooks/usePatcher.ts
  function usePatcher(initialState) {
    const [state, setState] = (0, import_hooks.useState)(initialState);
    const patchState = (patcher) => setState(producer(patcher));
    return [state, patchState];
  }

  // src/ui/components/App.module.scss
  var App_module_default = {
    "modeSwitch": "_modeSwitch_1o9av_5"
  };

  // src/img/act/eldritch-burst.svg
  var eldritch_burst_default = "./eldritch-burst-CNPKMEMY.svg";

  // src/img/spl/counterspell.svg
  var counterspell_default = "./counterspell-XBGTQHAN.svg";

  // src/img/spl/hellish-rebuke.svg
  var hellish_rebuke_default = "./hellish-rebuke-2F7LGW6H.svg";

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

  // src/spells/InnateSpellcasting.ts
  var InnateSpellcasting = class {
    constructor(name, ability, getResourceForSpell = () => void 0, icon) {
      this.name = name;
      this.ability = ability;
      this.getResourceForSpell = getResourceForSpell;
      this.icon = icon;
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
  var armor_of_agathys_default = "./armor-of-agathys-V2ZDSJZ3.svg";

  // src/utils/time.ts
  var TURNS_PER_MINUTE = 10;
  var minutes = (n) => n * TURNS_PER_MINUTE;
  var hours = (n) => minutes(n * 60);

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

  // src/resolvers/MultiTargetResolver.ts
  var MultiTargetResolver = class {
    constructor(g, minimum, maximum, maxRange, filters, allFilters = []) {
      this.g = g;
      this.minimum = minimum;
      this.maximum = maximum;
      this.maxRange = maxRange;
      this.filters = filters;
      this.allFilters = allFilters;
      this.type = "Combatants";
    }
    get name() {
      let name = `${describeRange(this.minimum, this.maximum)} targets${this.maxRange < Infinity ? ` within ${this.maxRange}'` : ""}`;
      for (const filter of this.filters)
        name += `, ${filter.name}`;
      return name;
    }
    check(rawValue, action, ec) {
      const getErrors = (filters, v) => filters.filter((filter) => !filter.check(this.g, action, v)).map((filter) => filter.message);
      const value = isCombatantArray(rawValue) ? rawValue : [];
      if (value.length < this.minimum)
        ec.add(`At least ${this.minimum} targets`, this);
      if (value.length > this.maximum)
        ec.add(`At most ${this.maximum} targets`, this);
      for (const who of value) {
        const isOutOfRange = distance(action.actor, who) > this.maxRange;
        const errors = getErrors(this.filters, who).map(
          (error) => `${who.name}: ${error}`
        );
        if (isOutOfRange)
          ec.add(`${who.name}: Out of range`, this);
        ec.addMany(errors, this);
      }
      ec.addMany(getErrors(this.allFilters, value), this);
      return ec;
    }
  };

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
        if (distanceTo(action.actor, value) > this.maxRange)
          ec.add("Out of range", this);
      }
      return ec;
    }
  };

  // src/utils/dice.ts
  var _fd = (amount, damageType) => ({
    type: "flat",
    amount,
    damageType
  });
  var _dd = (count, size, damageType) => ({ type: "dice", amount: { count, size }, damageType });
  function getDefaultHPRoll(level, hitDieSize) {
    if (level === 1)
      return hitDieSize;
    return Math.ceil(getDiceAverage(1, hitDieSize));
  }

  // src/spells/helpers.ts
  var doesCantripDamage = (size, damageType) => ({
    isHarmful: true,
    getDamage: (g, caster) => [_dd(getCantripDice(caster), size, damageType)]
  });
  var doesScalingDamage = (level, diceMinusSlot, size, damageType) => ({
    isHarmful: true,
    getDamage: (g, caster, method, { slot }) => [
      _dd((slot != null ? slot : level) + diceMinusSlot, size, damageType)
    ]
  });
  var requiresSave = (ability) => ({});
  var isSpellAttack = (category) => ({});
  var affectsSelf = {
    getConfig: () => ({}),
    getTargets: () => [],
    getAffected: (g, caster) => [caster]
  };
  var targetsByTouch = (filters) => ({
    getConfig: (g, caster) => ({
      target: new TargetResolver(g, caster.reach, filters)
    }),
    getTargets: (g, caster, { target }) => sieve(target),
    getAffected: (g, caster, { target }) => [target]
  });
  var targetsOne = (range, filters) => ({
    getConfig: (g) => ({ target: new TargetResolver(g, range, filters) }),
    getTargets: (g, caster, { target }) => sieve(target),
    getAffected: (g, caster, { target }) => [target]
  });
  var targetsMany = (min, max, range, filters, allFilters) => ({
    getConfig: (g) => ({
      targets: new MultiTargetResolver(g, min, max, range, filters, allFilters)
    }),
    getTargets: (g, caster, { targets }) => targets != null ? targets : [],
    getAffected: (g, caster, { targets }) => targets
  });
  var affectsStaticArea = (getArea, ignoreCaster = true) => ({
    getConfig: () => ({}),
    getTargets: () => [],
    getAffectedArea: (g, caster) => [getArea(caster)],
    getAffected: (g, caster) => g.getInside(getArea(caster), ignoreCaster ? [caster] : void 0)
  });
  var affectsCone = (range, ignoreCaster = true, getArea = (caster, point) => aimCone(caster.position, caster.sizeInUnits, point, range)) => ({
    getConfig: (g) => ({ point: new PointResolver(g, range) }),
    getTargets: () => [],
    getAffectedArea: (g, caster, { point }) => point && [getArea(caster, point)],
    getAffected: (g, caster, { point }) => g.getInside(getArea(caster, point), ignoreCaster ? [caster] : void 0)
  });
  var affectsLine = (length, width, ignoreCaster = true, getArea = (caster, point) => aimLine(caster.position, caster.sizeInUnits, point, length, width)) => ({
    getConfig: (g) => ({ point: new PointResolver(g, length) }),
    getTargets: () => [],
    getAffectedArea: (g, caster, { point }) => point && [getArea(caster, point)],
    getAffected: (g, caster, { point }) => g.getInside(getArea(caster, point), ignoreCaster ? [caster] : void 0)
  });
  var affectsByPoint = (range, getArea, ignoreCaster = true) => ({
    getConfig: (g) => ({ point: new PointResolver(g, range) }),
    getTargets: () => [],
    getAffectedArea: (g, caster, { point }) => point && [getArea(point)],
    getAffected: (g, caster, { point }) => g.getInside(getArea(point), ignoreCaster ? [caster] : void 0)
  });
  var aiTargetsOne = (range) => ({ allTargets }) => allTargets.map((target) => ({
    config: { target },
    positioning: poSet(poWithin(range, target))
  }));
  var aiTargetsByTouch = ({
    allTargets,
    caster
  }) => allTargets.map((target) => ({
    config: { target },
    positioning: poSet(poWithin(caster.reach, target))
  }));

  // src/spells/level1/ArmorOfAgathys.ts
  var ArmorOfAgathysIcon = makeIcon(armor_of_agathys_default, DamageColours.cold);
  var ArmorOfAgathysEffect = new Effect(
    "Armor of Agathys",
    "turnStart",
    (g) => {
      g.events.on(
        "Attack",
        ({
          detail: {
            roll: {
              type: { target, tags, who }
            },
            interrupt
          }
        }) => {
          const config = target.getEffectConfig(ArmorOfAgathysEffect);
          if (config && target.temporaryHPSource === ArmorOfAgathysEffect && tags.has("melee"))
            interrupt.add(
              new EvaluateLater(
                who,
                ArmorOfAgathysEffect,
                Priority_default.Normal,
                async () => g.damage(
                  ArmorOfAgathysEffect,
                  "cold",
                  { attacker: target, target: who },
                  [["cold", config.count]]
                )
              )
            );
        }
      );
      g.events.on(
        "CombatantDamaged",
        ({ detail: { who, temporaryHPSource, interrupt } }) => {
          if (temporaryHPSource === ArmorOfAgathysEffect && who.temporaryHP <= 0)
            interrupt.add(
              new EvaluateLater(
                who,
                ArmorOfAgathysEffect,
                Priority_default.Normal,
                () => who.removeEffect(ArmorOfAgathysEffect)
              )
            );
        }
      );
    },
    { icon: ArmorOfAgathysIcon, tags: ["magic"] }
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
    ...affectsSelf,
    async apply({ g, caster }, { slot }) {
      const count = slot * 5;
      if (await g.giveTemporaryHP(caster, count, ArmorOfAgathysEffect)) {
        const duration = hours(1);
        await caster.addEffect(ArmorOfAgathysEffect, { count, duration }, caster);
      }
    }
  });
  var ArmorOfAgathys_default = ArmorOfAgathys;

  // src/monsters/fiendishParty/Birnotec.ts
  var getEldritchBurstArea = (who) => ({
    type: "within",
    radius: 5,
    who
  });
  var BurstIcon = makeIcon(eldritch_burst_default, DamageColours.force);
  var burstMainDamage = _dd(2, 10, "force");
  var burstMinorDamage = _dd(1, 10, "force");
  var EldritchBurstSpell = simpleSpell({
    status: "implemented",
    name: "Eldritch Burst",
    icon: BurstIcon,
    level: 0,
    school: "Evocation",
    lists: ["Warlock"],
    description: `Make a ranged spell attack against the target. On a hit, the target takes 2d10 force damage. All other creatures within 5 ft. must make a Dexterity save or take 1d10 force damage.`,
    getConfig: (g) => ({ target: new TargetResolver(g, 120, [isEnemy]) }),
    getAffectedArea: (g, caster, { target }) => target && [getEldritchBurstArea(target)],
    getDamage: () => [burstMainDamage],
    getTargets: (g, caster, { target }) => sieve(target),
    getAffected: (g, caster, { target }) => g.getInside(getEldritchBurstArea(target)),
    async apply(sh) {
      const { outcome, attack, hit, critical, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (outcome === "cancelled")
        return;
      if (hit) {
        const hitDamage = await sh.rollDamage({ critical, target });
        await sh.damage({
          attack,
          critical,
          damageInitialiser: hitDamage,
          damageType: "force",
          target
        });
      }
      const damageInitialiser = await sh.rollDamage({
        critical,
        damage: [burstMinorDamage]
      });
      for (const who of sh.affected.filter((other) => other !== target)) {
        const { damageResponse } = await sh.save({
          who,
          ability: "dex",
          save: "zero"
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser,
          damageResponse,
          damageType: "force",
          target: who
        });
      }
    }
  });
  var BirnotecSpellcasting = new InnateSpellcasting("Spellcasting", "cha");
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
          new EvaluateLater(me, ArmorOfAgathys2, Priority_default.Normal, async () => {
            const action = new CastSpell(
              g,
              me,
              BirnotecSpellcasting,
              ArmorOfAgathys_default
            );
            const config = { slot: 3 };
            await action.spell.apply(
              new SpellHelper(g, action, action.spell, action.method, config),
              config
            );
          })
        );
      });
    }
  );
  var AntimagicIcon = makeIcon(counterspell_default);
  var AntimagicProdigyAction = class extends AbstractSingleTargetAction {
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
    async applyEffect({ target }) {
      const { g, actor, dc, success } = this;
      const save = await g.abilityCheck(dc, {
        who: target,
        attacker: actor,
        skill: "Arcana",
        ability: "int",
        tags: chSet("counterspell")
      });
      if (save.outcome === "fail") {
        success.add("fail", AntimagicProdigy);
        g.text(new MessageBuilder().co(actor).text(" counters the spell."));
      }
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
                Priority_default.ChangesOutcome,
                () => g.act(action, config)
              )
            );
        }
      );
    }
  );
  var RebukeIcon = makeIcon(hellish_rebuke_default, DamageColours.fire);
  var HellishRebukeAction = class extends AbstractSingleTargetAction {
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
          description: `When an enemy damages Birnotec, they must make a DC 15 Dexterity save or take 11 (2d10) fire damage, or half on a success.`,
          tags: ["harmful", "spell"]
        }
      );
      this.dc = dc;
    }
    generateAttackConfigs(targets) {
      return targets.map((target) => ({
        config: { target },
        positioning: poSet()
      }));
    }
    getDamage() {
      return [_dd(2, 10, "fire")];
    }
    async applyEffect({ target }) {
      const { g, actor: attacker, dc } = this;
      const damage = await g.rollDamage(2, {
        source: HellishRebuke,
        size: 10,
        attacker,
        target,
        damageType: "fire",
        tags: atSet("magical", "spell")
      });
      const { damageResponse } = await g.save({
        source: HellishRebuke,
        type: { type: "flat", dc },
        who: target,
        attacker,
        ability: "dex",
        tags: ["magic"]
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
          if (who === me && attacker) {
            const action = new HellishRebukeAction(g, me, 15);
            const config = { target: attacker };
            if (checkConfig(g, action, config))
              interrupt.add(
                new YesNoChoice(
                  me,
                  HellishRebuke,
                  "Hellish Rebuke",
                  `Use ${me.name}'s reaction to retaliate for 2d10 fire damage?`,
                  Priority_default.Late,
                  () => g.act(action, config)
                )
              );
          }
        }
      );
    }
  );
  var Birnotec = {
    name: "Birnotec",
    cr: 5,
    type: "humanoid",
    tokenUrl: birnotec_default,
    hpMax: 35,
    align: ["Lawful", "Evil"],
    makesDeathSaves: true,
    abilities: [6, 15, 8, 12, 13, 20],
    pb: 3,
    proficiency: {
      wis: "proficient",
      cha: "proficient",
      Arcana: "proficient",
      Nature: "proficient"
    },
    damage: { poison: "immune" },
    immunities: ["Poisoned"],
    languages: ["Common", "Abyssal"],
    features: [ArmorOfAgathys2, EldritchBurst, AntimagicProdigy, HellishRebuke]
  };
  var Birnotec_default = Birnotec;

  // src/img/act/wreathed-in-shadow.svg
  var wreathed_in_shadow_default = "./wreathed-in-shadow-DXCZM5CC.svg";

  // src/img/tok/boss/kay.png
  var kay_default = "./kay-LUSXSSD5.png";

  // src/features/Evasion.ts
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

  // src/types/DamageType.ts
  var MundaneDamageTypes = [
    "bludgeoning",
    "piercing",
    "slashing"
  ];
  var MagicDamageTypes = [
    "acid",
    "cold",
    "fire",
    "force",
    "lightning",
    "necrotic",
    "poison",
    "psychic",
    "radiant",
    "thunder"
  ];
  var DamageTypes = [
    ...MundaneDamageTypes,
    ...MagicDamageTypes,
    "unpreventable"
  ];

  // src/monsters/multiattack.ts
  function getAttackSpec(action) {
    if (!(action instanceof AbstractSingleTargetAttackAction))
      throw new Error(`getAttackSpec(${action.name})`);
    return { weapon: action.weaponName, range: action.rangeCategory };
  }
  function containsAllSpecs(matchers, specs) {
    const bag = matchers.slice();
    for (const spec of specs) {
      const index = bag.findIndex((match) => matches(spec, match));
      if (index < 0)
        return false;
      bag.splice(index, 1);
    }
    return true;
  }
  function makeBagMultiattack(text, ...matchersList) {
    return makeMultiattack(text, (me, action) => {
      const specs = me.attacksSoFar.concat(action).map(getAttackSpec);
      return !!matchersList.find((matchers) => containsAllSpecs(matchers, specs));
    });
  }
  function makeMultiattack(text, canStillAttack) {
    const feature = new SimpleFeature("Multiattack", text, (g, me) => {
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor === me) {
          if (action.tags.has("costs attack") && canStillAttack(me, action))
            error.ignore(OneAttackPerTurnRule);
          if (action instanceof TwoWeaponAttack)
            error.add("use Multiattack", feature);
        }
      });
    });
    return feature;
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
          if (attacker === me && (attack == null ? void 0 : attack.roll.type.tags.has("weapon")))
            interrupt.add(
              new EvaluateLater(
                me,
                ScreamingInside,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(
                    1,
                    {
                      source: ScreamingInside,
                      attacker,
                      target,
                      size: 6,
                      damageType: "psychic",
                      tags: atSet("magical")
                    },
                    critical
                  );
                  map.add("psychic", amount);
                }
              )
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
            new EvaluateLater(
              who,
              WreathedInShadowEffect,
              Priority_default.Late,
              async () => {
                await who.removeEffect(WreathedInShadowEffect);
                who.name = realName;
              }
            )
          );
      });
    },
    { icon: makeIcon(wreathed_in_shadow_default) }
  );
  var WreathedInShadow = new SimpleFeature(
    "Wreathed in Shadow",
    "Kay's appearance is hidden from view by a thick black fog that whirls about him. Only a DC 22 Perception check can reveal his identity. All attacks against him are at disadvantage. This effect is dispelled until the beginning of his next turn if he takes more than 10 damage in one hit.",
    (g, me) => {
      const wreathe = new EvaluateLater(
        me,
        WreathedInShadow,
        Priority_default.Normal,
        async () => {
          await me.addEffect(WreathedInShadowEffect, { duration: Infinity });
          me.name = hiddenName;
        }
      );
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
          if (who === me && !(attack == null ? void 0 : attack.roll.type.tags.has("magical")) && isA(damageType, MundaneDamageTypes))
            response.add("resist", SmoulderingRage);
        }
      );
    }
  );
  var KayMultiattack = makeBagMultiattack(
    "Kay attacks twice with his Spear or Longbow.",
    [{ weapon: "spear" }, { weapon: "spear" }],
    [{ weapon: "longbow" }, { weapon: "longbow" }]
  );
  var Kay = {
    name: realName,
    cr: 6,
    type: "humanoid",
    tokenUrl: kay_default,
    hpMax: 75,
    align: ["Chaotic", "Neutral"],
    makesDeathSaves: true,
    abilities: [14, 18, 16, 10, 8, 14],
    pb: 3,
    proficiency: {
      str: "proficient",
      dex: "proficient",
      Athletics: "proficient",
      Stealth: "expertise"
    },
    immunities: ["Frightened"],
    languages: ["Common", "Orc", "Abyssal"],
    features: [
      ScreamingInside,
      WreathedInShadow,
      KayMultiattack,
      Evasion_default,
      SmoulderingRage
    ],
    items: [
      { name: "studded leather armor", equip: true },
      { name: "longbow", equip: true },
      { name: "spear" },
      { name: "arrow", quantity: 20 }
    ]
  };
  var Kay_default = Kay;

  // src/img/act/shield-bash.svg
  var shield_bash_default = "./shield-bash-EXQG5NNW.svg";

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
  var DamageEnemies = makeAICo("DamageEnemies");
  var OverKillEnemies = makeAICo("OverKillEnemies", -0.25);
  var DamageAllies = makeAICo("DamageAllies", -1);
  var StayNearAllies = makeAICo("StayNearAllies");

  // src/collectors/EvaluationCollector.ts
  var EvaluationCollector = class _EvaluationCollector extends BonusCollector {
    addEval(c, value, co) {
      this.add(value * c.getCoefficient(co), co);
    }
    copy() {
      return new _EvaluationCollector(
        this.entries,
        this.ignoredSources,
        this.ignoredValues
      );
    }
  };

  // src/ai/DamageRule.ts
  var DamageRule = class {
    evaluateActions(g, me, actions) {
      const enemies = Array.from(g.combatants.keys()).filter(
        (who) => who.side !== me.side
      );
      return actions.flatMap(
        (action) => action.generateAttackConfigs(enemies).map(({ config, positioning }) => {
          const amounts = action.getDamage(config);
          if (!amounts)
            return;
          const targets = action.getAffected(config);
          if (!targets)
            return;
          const { average } = describeDice(amounts);
          const score = new EvaluationCollector();
          let effective = 0;
          let overKill = 0;
          let friendlyFire = 0;
          for (const target of targets) {
            const remaining = target.hp;
            const damage = Math.min(average, remaining);
            if (target.side === me.side)
              friendlyFire += damage;
            else
              effective += damage;
            overKill += Math.max(average - remaining, 0);
          }
          score.addEval(me, effective, DamageEnemies);
          score.addEval(me, overKill, OverKillEnemies);
          score.addEval(me, friendlyFire, DamageAllies);
          return { action, config, positioning, score };
        }).filter(isDefined)
      );
    }
  };

  // src/ai/HealingRule.ts
  var HealingRule = class {
    evaluateActions(g, me, actions) {
      const allies = Array.from(g.combatants.keys()).filter(
        (who) => who.side === me.side
      );
      return actions.flatMap(
        (action) => action.generateHealingConfigs(allies).map(({ config, positioning }) => {
          const amounts = action.getHeal(config);
          if (!amounts)
            return;
          const targets = action.getAffected(config);
          if (!targets)
            return;
          const { average } = describeDice(amounts);
          const score = new EvaluationCollector();
          let effectiveSelf = 0;
          let effective = 0;
          let overHeal = 0;
          for (const target of targets) {
            const missing = target.hpMax - target.hp;
            const heal = Math.min(average, missing);
            if (target === me)
              effectiveSelf += heal;
            else
              effective += heal;
            overHeal += Math.max(average - missing, 0);
          }
          if (effective + effectiveSelf <= 0)
            return;
          score.addEval(me, effectiveSelf, HealSelf);
          score.addEval(me, effective, HealAllies);
          score.addEval(me, overHeal, OverHealAllies);
          return { action, config, positioning, score };
        }).filter(isDefined)
      );
    }
  };

  // src/ai/StayNearAlliesRule.ts
  var StayNearAlliesRule = class {
    constructor(range) {
      this.range = range;
    }
    evaluatePosition(g, me, score, position) {
      const near = Array.from(g.combatants).filter(
        (them) => them !== me && them.side === me.side && getDistanceBetween(
          position,
          me.sizeInUnits,
          them.position,
          them.sizeInUnits
        ) <= this.range
      );
      score.addEval(me, near.length, StayNearAllies);
    }
  };

  // src/ActiveEffectArea.ts
  var ActiveEffectArea = class {
    constructor(name, shape, tags, tint, handler) {
      this.name = name;
      this.shape = shape;
      this.tags = tags;
      this.tint = tint;
      this.handler = handler;
      this.id = NaN;
      this.points = resolveArea(shape);
    }
  };

  // src/SubscriptionBag.ts
  var SubscriptionBag = class {
    constructor(...items) {
      this.set = new Set(items);
    }
    add(...items) {
      for (const item of items)
        this.set.add(item);
      return this;
    }
    cleanup() {
      for (const cleanup of this.set)
        cleanup();
      this.set.clear();
      return this;
    }
  };

  // src/AuraController.ts
  var AuraController = class {
    constructor(g, name, who, radius, tags = [], tint, handler, shouldBeActive = () => true) {
      this.g = g;
      this.name = name;
      this.who = who;
      this.radius = radius;
      this.tint = tint;
      this.handler = handler;
      this.shouldBeActive = shouldBeActive;
      this.tags = new Set(tags);
      this.update();
      const onEvent = this.onEvent.bind(this);
      this.bag = new SubscriptionBag(
        g.events.on("CombatantMoved", onEvent),
        g.events.on("EffectAdded", onEvent),
        g.events.on("EffectRemoved", onEvent)
      );
    }
    get active() {
      return isDefined(this.area);
    }
    setActiveChecker(shouldBeActive) {
      this.shouldBeActive = shouldBeActive;
      return this;
    }
    onEvent({
      detail: { who }
    }) {
      if (who === this.who) {
        if (this.shouldBeActive(who))
          this.update();
        else
          this.remove();
      }
    }
    update() {
      this.remove();
      const { g, name, radius, who, tags, tint, handler } = this;
      this.area = new ActiveEffectArea(
        name,
        { type: "within", radius, who },
        tags,
        tint,
        handler
      );
      g.addEffectArea(this.area);
    }
    remove() {
      if (this.area) {
        this.g.removeEffectArea(this.area);
        this.area = void 0;
      }
    }
    isAffecting(other) {
      return this.active && distance(this.who, other) <= this.radius;
    }
    destroy() {
      this.remove();
      this.bag.cleanup();
    }
  };

  // src/features/ConfiguredFeature.ts
  var ConfiguredFeature = class {
    constructor(name, text, apply) {
      this.name = name;
      this.text = text;
      this.apply = apply;
    }
    setup(g, who) {
      const config = who.getConfig(this.name);
      if (!isDefined(config)) {
        console.error(`${who.name} has no config for ${this.name}`);
        return;
      }
      this.apply(g, who, config);
    }
  };

  // src/spells/level1/CureWounds.ts
  var CureWounds = scalingSpell({
    status: "implemented",
    name: "Cure Wounds",
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],
    description: `A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. This spell has no effect on undead or constructs.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.`,
    ...targetsByTouch([notOfCreatureType("undead", "construct")]),
    generateHealingConfigs: aiTargetsByTouch,
    getHeal: (g, caster, method, { slot }) => [
      { type: "dice", amount: { count: slot != null ? slot : 1, size: 8 } },
      {
        type: "flat",
        amount: method.ability ? caster[method.ability].modifier : 0
      }
    ],
    async apply(sh, { target }) {
      if (cannotHealConventionally.has(target.type))
        return;
      const amount = await sh.rollHeal({ target });
      await sh.heal({ amount, target });
    }
  });
  var CureWounds_default = CureWounds;

  // src/feats/DragonGifts.ts
  var ProtectiveWingsResource = new LongRestResource("Protective Wings", 2);
  var ProtectiveWings = class extends AbstractSingleTargetAction {
    constructor(g, actor, detail) {
      super(
        g,
        actor,
        "Protective Wings",
        "implemented",
        { target: new TargetResolver(g, 5, [canSee]) },
        {
          description: `You can manifest protective wings that can shield you or others. When you or another creature you can see within 5 feet of you is hit by an attack roll, you can use your reaction to manifest spectral wings from your back for a moment. You grant a bonus to the target's AC equal to your proficiency bonus against that attack roll, potentially causing it to miss. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
          resources: [[ProtectiveWingsResource, 1]],
          time: "reaction"
        }
      );
      this.detail = detail;
    }
    async applyEffect({ target }) {
      const { g, actor, detail } = this;
      if (!detail)
        throw new Error(`ProtectiveWings.apply() without AttackDetail`);
      g.text(
        new MessageBuilder().co(actor).text(" uses Protective Wings on ").sp().co(target)
      );
      detail.ac += actor.pb;
    }
  };
  var GiftOfTheMetallicDragonResource = new LongRestResource(
    "Gift of the Metallic Dragon",
    1
  );
  var GiftOfTheMetallicDragon = new ConfiguredFeature(
    "Gift of the Metallic Dragon",
    `You've manifested some of the power of metallic dragons, granting you the following benefits:
- Draconic Healing. You learn the cure wounds spell. You can cast this spell without expending a spell slot. Once you cast this spell in this way, you can't do so again until you finish a long rest. You can also cast this spell using spell slots you have. The spell's spellcasting ability is Intelligence, Wisdom, or Charisma when you cast it with this feat (choose when you gain the feat).
- Protective Wings. You can manifest protective wings that can shield you or others. When you or another creature you can see within 5 feet of you is hit by an attack roll, you can use your reaction to manifest spectral wings from your back for a moment. You grant a bonus to the target's AC equal to your proficiency bonus against that attack roll, potentially causing it to miss. You can use this reaction a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
    (g, me, ability) => {
      me.initResource(GiftOfTheMetallicDragonResource);
      const giftMethod = new InnateSpellcasting(
        "Gift of the Metallic Dragon",
        ability,
        () => GiftOfTheMetallicDragonResource
      );
      me.spellcastingMethods.add(giftMethod);
      me.preparedSpells.add(CureWounds_default);
      me.knownSpells.add(CureWounds_default);
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        var _a;
        if (who === me)
          for (const method of me.spellcastingMethods)
            (_a = method.addCastableSpell) == null ? void 0 : _a.call(method, CureWounds_default, me);
      });
      me.initResource(ProtectiveWingsResource, me.pb);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new CastSpell(g, me, giftMethod, CureWounds_default),
            new ProtectiveWings(g, me)
          );
      });
      g.events.on("Attack", ({ detail }) => {
        const { target, who } = detail.pre;
        const action = new ProtectiveWings(g, me, detail);
        if (checkConfig(g, action, { target }))
          detail.interrupt.add(
            new YesNoChoice(
              me,
              GiftOfTheMetallicDragon,
              "Protective Wings",
              `${who.name} hit ${target.name} with an attack. Use Protective Wings to grant +${me.pb} AC?`,
              Priority_default.Late,
              () => action.apply({ target }),
              void 0,
              () => detail.outcome.hits
            )
          );
      });
    }
  );

  // src/feats/Lucky.ts
  var LuckPoint = new LongRestResource("Luck Point", 3);
  function addLuckyOpportunity(g, who, message, interrupt, callback) {
    interrupt.add(
      new YesNoChoice(who, Lucky, "Lucky", message, Priority_default.Late, async () => {
        who.spendResource(LuckPoint);
        const nr = await g.roll({ type: "luck", who });
        callback(nr.values.final);
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
      g.events.on("DiceRolled", ({ detail: { type, interrupt, values } }) => {
        if ((type.type === "attack" || type.type === "check" || type.type === "save") && type.who === me && me.hasResource(LuckPoint))
          addLuckyOpportunity(
            g,
            me,
            `${me.name} got ${values.final} on a ${type.type} roll. Use a Luck point to re-roll?`,
            interrupt,
            (roll) => values.add(roll, "higher")
          );
        if (type.type === "attack" && type.target === me && me.hasResource(LuckPoint))
          addLuckyOpportunity(
            g,
            me,
            `${type.who.name} got ${values.final} on an attack roll against ${me.name}. Use a Luck point to re-roll?`,
            interrupt,
            (roll) => values.add(roll, "lower")
          );
      });
    }
  );
  var Lucky_default = Lucky;

  // src/feats/Sentinel.ts
  var SentinelEffect = new Effect("Sentinel", "turnEnd", (g) => {
    g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
      if (who.hasEffect(SentinelEffect))
        multiplier.add("zero", SentinelEffect);
    });
  });
  var SentinelRetaliation = class extends OpportunityAttack {
    constructor(g, actor, weapon) {
      super(g, actor, weapon);
      this.attackTags = [];
    }
  };
  var Sentinel = new SimpleFeature(
    "Sentinel",
    `You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits:
- When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn.
- Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.
- When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature.`,
    (g, me) => {
      g.events.on("AfterAttack", ({ detail: { attack, interrupt, hit } }) => {
        const { who, tags, target } = attack.roll.type;
        if (who === me && tags.has("opportunity") && hit)
          interrupt.add(
            new EvaluateLater(
              me,
              Sentinel,
              Priority_default.Normal,
              () => target.addEffect(SentinelEffect, { duration: 1 })
            )
          );
      });
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action instanceof OpportunityAttack && action.actor === me)
          error.ignore(DisengageEffect);
      });
      g.events.on("AfterAttack", ({ detail: { attack, interrupt } }) => {
        const { who: attacker, target } = attack.roll.type;
        const inRange = distance(attacker, me) <= 5;
        const notAgainstMe = target !== me;
        const notSentinel = !target.features.has(Sentinel.name);
        if (inRange && notAgainstMe && notSentinel) {
          const config = { target: attacker };
          const choices = me.weapons.filter((weapon) => weapon.rangeCategory === "melee").map((weapon) => new SentinelRetaliation(g, me, weapon)).map(
            (action) => makeChoice(
              action,
              `attack with ${action.weaponName}`,
              !checkConfig(g, action, config)
            )
          );
          interrupt.add(
            new PickFromListChoice(
              me,
              Sentinel,
              "Sentinel",
              `${attacker.name} made an attack against ${target.name}. Use ${me.name}'s reaction to retaliate?`,
              Priority_default.Normal,
              choices,
              (action) => action.apply(config),
              true
            )
          );
        }
      });
    }
  );
  var Sentinel_default = Sentinel;

  // src/feats/Telekinetic.ts
  var telekineticShoveChoices = [
    makeStringChoice("toward"),
    makeStringChoice("away")
  ];
  var TelekineticShove = class extends AbstractAction {
    constructor(g, actor, ability) {
      super(
        g,
        actor,
        "Telekinetic Shove",
        "incomplete",
        {
          target: new TargetResolver(g, 30, [canSee]),
          type: new ChoiceResolver(g, "Direction", telekineticShoveChoices)
        },
        {
          description: `As a bonus action, you can try to telekinetically shove one creature you can see within 30 feet of you. When you do so, the target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + the ability modifier of the score increased by this feat) or be moved 5 feet toward you or away from you. A creature can willingly fail this save.`,
          time: "bonus action"
        }
      );
      this.ability = ability;
    }
    getTargets({ target }) {
      return sieve(target);
    }
    getAffected({ target }) {
      return [target];
    }
    async applyEffect({ target, type }) {
      const { g, ability, actor } = this;
      const { outcome } = await g.save({
        source: this,
        type: { type: "ability", ability },
        ability: "str",
        attacker: actor,
        save: "zero",
        tags: ["forced movement"],
        who: target
      });
      if (outcome === "fail") {
        g.text(
          new MessageBuilder().co(actor).text(" telekinetically shoves ").sp().co(target).text(type === "toward" ? " toward them." : " away from them.")
        );
        await g.forcePush(target, actor, 5, this, type === "toward");
      }
    }
  };
  var Telekinetic = new ConfiguredFeature(
    "Telekinetic",
    `You learn to move things with your mind, granting you the following benefits:
- Increase your Intelligence, Wisdom, or Charisma by 1, to a maximum of 20.
- You learn the mage hand cantrip. You can cast it without verbal or somatic components, and you can make the spectral hand invisible. If you already know this spell, its range increases by 30 feet when you cast it. Its spellcasting ability is the ability increased by this feat.
- As a bonus action, you can try to telekinetically shove one creature you can see within 30 feet of you. When you do so, the target must succeed on a Strength saving throw (DC 8 + your proficiency bonus + the ability modifier of the score increased by this feat) or be moved 5 feet toward you or away from you. A creature can willingly fail this save.`,
    (g, me, ability) => {
      me[ability].score++;
      implementationWarning("Feat", "Not Complete", Telekinetic.name, me.name);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new TelekineticShove(g, me, ability));
      });
    }
  );
  var Telekinetic_default = Telekinetic;

  // src/img/act/hiss.svg
  var hiss_default = "./hiss-4J2EPM5H.svg";

  // src/features/boons.ts
  var HissResource = new ShortRestResource("Hiss (Boon of Vassetri)", 1);
  var HissFleeAction = class extends AbstractSelfAction {
    constructor(g, actor, other) {
      super(g, actor, "Flee from Hiss", "implemented", {}, { time: "reaction" });
      this.other = other;
    }
    async applyEffect() {
      const { g, actor, other } = this;
      await g.applyBoundedMove(
        actor,
        new BoundedMove(this, round(actor.speed / 2, MapSquareSize), {
          mustUseAll: true,
          forced: true,
          check: ({ detail: { from, to, error } }) => {
            const { oldDistance, newDistance } = compareDistances(
              other,
              other.position,
              actor,
              from,
              to
            );
            if (newDistance < oldDistance)
              error.add(`cannot move closer to ${other.name}`, this);
          }
        })
      );
    }
  };
  var HissAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Hiss (Boon of Vassetri)",
        "implemented",
        { target: new TargetResolver(g, 5, [isEnemy, hasTime("reaction")]) },
        {
          icon: makeIcon(hiss_default),
          time: "bonus action",
          resources: [[HissResource, 1]],
          tags: ["harmful"]
        }
      );
    }
    async applyEffect({ target }) {
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
      featureNotComplete(BoonOfVassetri, me);
      me.initResource(HissResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new HissAction(g, me));
      });
    }
  );

  // src/features/fightingStyles/Archery.ts
  var FightingStyleArchery = new SimpleFeature(
    "Fighting Style: Archery",
    `You gain a +2 bonus to attack rolls you make with ranged weapons.`,
    (g, me) => {
      g.events.on("BeforeAttack", ({ detail: { who, weapon, bonus } }) => {
        if (who === me && (weapon == null ? void 0 : weapon.rangeCategory) === "ranged")
          bonus.add(2, FightingStyleArchery);
      });
    }
  );
  var Archery_default = FightingStyleArchery;

  // src/features/fightingStyles/BlindFighting.ts
  var FightingStyleBlindFighting = new SimpleFeature(
    "Blind Fighting",
    `You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total cover, even if you're blinded or in darkness. Moreover, you can see an invisible creature within that range, unless the creature successfully hides from you.`,
    (g, me) => {
      me.senses.set("blindsight", 10);
    }
  );
  var BlindFighting_default = FightingStyleBlindFighting;

  // src/features/fightingStyles/Defense.ts
  var FightingStyleDefense = new SimpleFeature(
    "Fighting Style: Defense",
    `While you are wearing armor, you gain a +1 bonus to AC.`,
    (g, me) => {
      g.events.on("GetAC", ({ detail: { who, bonus } }) => {
        if (who === me && me.armor)
          bonus.add(1, FightingStyleDefense);
      });
    }
  );
  var Defense_default = FightingStyleDefense;

  // src/features/fightingStyles/Dueling.ts
  var FightingStyleDueling = new SimpleFeature(
    "Fighting Style: Dueling",
    `When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.`,
    (g, me) => {
      g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
        if (attacker === me && weapon && weapon.hands === 1 && me.weapons.length === 1 && me.weapons[0] === weapon)
          bonus.add(2, FightingStyleDueling);
      });
    }
  );
  var Dueling_default = FightingStyleDueling;

  // src/utils/set.ts
  function hasAll(set, query) {
    if (!set)
      return false;
    for (const item of query)
      if (!set.has(item))
        return false;
    return true;
  }
  function hasAny(set, query) {
    if (!set)
      return false;
    for (const item of query)
      if (set.has(item))
        return true;
    return false;
  }
  function intersects(a, b) {
    for (const item of a)
      if (b.has(item))
        return true;
    return false;
  }
  function mergeSets(destination, source) {
    if (source)
      for (const item of source)
        destination.add(item);
  }

  // src/features/fightingStyles/GreatWeaponFighting.ts
  var FightingStyleGreatWeaponFighting = new SimpleFeature(
    "Fighting Style: Great Weapon Fighting",
    `When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.`,
    (g, me) => {
      g.events.on(
        "DiceRolled",
        ({ detail: { type, values, interrupt, size } }) => {
          if (type.type === "damage" && type.attacker === me && hasAll(type.tags, ["melee", "weapon", "two hands"]) && values.final <= 2)
            interrupt.add(
              new EvaluateLater(
                me,
                FightingStyleGreatWeaponFighting,
                Priority_default.ChangesOutcome,
                async () => {
                  const newRoll = await g.roll({
                    type: "other",
                    source: FightingStyleGreatWeaponFighting,
                    who: me,
                    size
                  });
                  values.replace(newRoll.values.final);
                }
              )
            );
        }
      );
    }
  );
  var GreatWeaponFighting_default = FightingStyleGreatWeaponFighting;

  // src/img/act/protection.svg
  var protection_default = "./protection-NGWVG7SN.svg";

  // src/features/fightingStyles/Protection.ts
  var ProtectionIcon = makeIcon(protection_default);
  var ProtectionAction = class extends AbstractSingleTargetAction {
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
    async applyEffect() {
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
                Priority_default.ChangesOutcome,
                () => g.act(action, config)
              )
            );
        }
      );
    }
  );
  var Protection_default = FightingStyleProtection;

  // src/data/allFeatures.ts
  var allFeatures = {
    "Boon of Vassetri": BoonOfVassetri,
    "Fighting Style: Archery": Archery_default,
    "Fighting Style: Blind Fighting": BlindFighting_default,
    "Fighting Style: Defense": Defense_default,
    "Fighting Style: Dueling": Dueling_default,
    "Fighting Style: Great Weapon Fighting": GreatWeaponFighting_default,
    "Fighting Style: Protection": Protection_default,
    "Gift of the Metallic Dragon": GiftOfTheMetallicDragon,
    Lucky: Lucky_default,
    Sentinel: Sentinel_default,
    Telekinetic: Telekinetic_default
  };
  var allFeatures_default = allFeatures;

  // src/img/spl/acid-splash.svg
  var acid_splash_default = "./acid-splash-55N3773S.svg";

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
    generateAttackConfigs: ({ caster, allTargets }) => combinationsMulti(
      allTargets.filter((co) => co.side !== caster.side),
      1,
      2
    ).map((targets) => ({
      config: { targets },
      positioning: new Set(targets.map((target) => poWithin(60, target)))
    })),
    ...doesCantripDamage(5, "acid"),
    ...requiresSave("dex"),
    ...targetsMany(1, 2, 60, [canSee], [withinRangeOfEachOther(5)]),
    async apply(sh, { targets }) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of targets) {
        const { damageResponse } = await sh.save({
          who: target,
          ability: "dex",
          save: "zero"
        });
        await sh.damage({
          target,
          damageType: "acid",
          damageInitialiser,
          damageResponse
        });
      }
    }
  });
  var AcidSplash_default = AcidSplash;

  // src/spells/cantrip/BladeWard.ts
  var BladeWardEffect = new Effect(
    "Blade Ward",
    "turnStart",
    (g) => {
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, attack, damageType, response } }) => {
          if (who.hasEffect(BladeWardEffect) && (attack == null ? void 0 : attack.roll.type.weapon) && isA(damageType, MundaneDamageTypes))
            response.add("resist", BladeWardEffect);
        }
      );
    },
    { tags: ["magic"] }
  );
  var BladeWard = simpleSpell({
    status: "implemented",
    name: "Blade Ward",
    level: 0,
    school: "Abjuration",
    v: true,
    s: true,
    lists: ["Bard", "Sorcerer", "Warlock", "Wizard"],
    description: `You extend your hand and trace a sigil of warding in the air. Until the end of your next turn, you have resistance against bludgeoning, piercing, and slashing damage dealt by weapon attacks.`,
    ...affectsSelf,
    async apply({ caster }) {
      await caster.addEffect(BladeWardEffect, { duration: 1 });
    }
  });
  var BladeWard_default = BladeWard;

  // src/spells/cantrip/ChillTouch.ts
  var ChillTouchEffect = new Effect(
    "Chill Touch",
    "turnStart",
    (g) => {
      g.events.on("GatherHeal", ({ detail: { target, multiplier } }) => {
        if (target.hasEffect(ChillTouchEffect))
          multiplier.add("zero", ChillTouchEffect);
      });
      g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        const config = who.getEffectConfig(ChillTouchEffect);
        if (who.type === "undead" && config && target === config.caster)
          diceType.add("disadvantage", ChillTouchEffect);
      });
    },
    { tags: ["magic"] }
  );
  var ChillTouch = simpleSpell({
    status: "implemented",
    name: "Chill Touch",
    level: 0,
    school: "Necromancy",
    v: true,
    s: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    description: `You create a ghostly, skeletal hand in the space of a creature within range. Make a ranged spell attack against the creature to assail it with the chill of the grave. On a hit, the target takes 1d8 necrotic damage, and it can't regain hit points until the start of your next turn. Until then, the hand clings to the target.

  If you hit an undead target, it also has disadvantage on attack rolls against you until the end of your next turn.
  
  This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
    ...targetsOne(120, []),
    ...isSpellAttack("ranged"),
    ...doesCantripDamage(8, "necrotic"),
    generateAttackConfigs: aiTargetsOne(120),
    async apply(sh) {
      const { caster, method } = sh;
      const { attack, critical, hit, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["ranged"]
        });
        await sh.damage({
          attack,
          target,
          damageType: "necrotic",
          damageInitialiser
        });
        await target.addEffect(
          ChillTouchEffect,
          { duration: 2, caster, method },
          caster
        );
      }
    }
  });
  var ChillTouch_default = ChillTouch;

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
          const isOutOfRange = distance(action.actor, who) > this.maxRange;
          const errors = this.filters.filter((filter) => !filter.check(this.g, action, who)).map((filter) => `${who.name}: ${filter.message}`);
          if (isOutOfRange)
            ec.add(`${who.name}: Out of range`, this);
          ec.addMany(errors, this);
        }
      }
      return ec;
    }
  };

  // src/spells/cantrip/EldritchBlast.ts
  var getEldritchBlastDamage = (beams) => [_dd(beams, 10, "force")];
  var EldritchBlast = simpleSpell({
    status: "implemented",
    name: "Eldritch Blast",
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Warlock"],
    description: `A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.

The spell creates more than one beam when you reach higher levels: two beams at 5th level, three beams at 11th level, and four beams at 17th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.`,
    ...isSpellAttack("ranged"),
    ...doesCantripDamage(10, "force"),
    getConfig: (g, caster) => ({
      targets: new AllocationResolver(
        g,
        "Beams",
        getCantripDice(caster),
        getCantripDice(caster),
        120,
        []
      )
    }),
    getTargets: (g, caster, { targets }) => {
      var _a;
      return (_a = targets == null ? void 0 : targets.map((e2) => e2.who)) != null ? _a : [];
    },
    getAffected: (g, caster, { targets }) => targets.map((e2) => e2.who),
    async apply(sh, { targets }) {
      const damage = getEldritchBlastDamage(1);
      for (const { amount, who } of targets)
        for (let i2 = 0; i2 < amount; i2++) {
          const { attack, hit, critical, target } = await sh.attack({
            target: who,
            type: "ranged"
          });
          if (hit) {
            const damageInitialiser = await sh.rollDamage({
              critical,
              damage,
              target,
              tags: ["ranged"]
            });
            await sh.damage({
              attack,
              critical,
              damageInitialiser,
              damageType: "force",
              target
            });
          }
        }
    }
  });
  var EldritchBlast_default = EldritchBlast;

  // src/img/spl/fire-bolt.svg
  var fire_bolt_default = "./fire-bolt-OQ6JULT4.svg";

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
    ...targetsOne(60, [notSelf]),
    ...isSpellAttack("ranged"),
    ...doesCantripDamage(10, "fire"),
    generateAttackConfigs: aiTargetsOne(60),
    async apply(sh) {
      const { critical, hit, attack, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["ranged"]
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser,
          damageType: "fire",
          target
        });
      }
    }
  });
  var FireBolt_default = FireBolt;

  // src/spells/cantrip/Guidance.ts
  var GuidanceEffect = new Effect(
    "Guidance",
    "turnStart",
    (g) => {
      g.events.on("BeforeCheck", ({ detail: { who, interrupt, bonus } }) => {
        const config = who.getEffectConfig(GuidanceEffect);
        if (config)
          interrupt.add(
            new YesNoChoice(
              who,
              GuidanceEffect,
              "Guidance",
              `${who.name} is making an ability check. Use Guidance to gain a d4?`,
              Priority_default.Normal,
              async () => {
                const value = await g.roll({
                  type: "other",
                  source: GuidanceEffect,
                  size: 4,
                  who
                });
                bonus.add(value.values.final, GuidanceEffect);
                await who.removeEffect(GuidanceEffect);
                config.affecting.delete(who);
                if (!config.affecting.size)
                  await config.caster.endConcentration(Guidance);
              }
            )
          );
      });
    },
    { tags: ["magic"] }
  );
  var Guidance = simpleSpell({
    status: "incomplete",
    name: "Guidance",
    level: 0,
    school: "Divination",
    concentration: true,
    v: true,
    s: true,
    lists: ["Artificer", "Cleric", "Druid"],
    description: `You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.`,
    ...targetsByTouch([isAlly]),
    async apply({ affected, caster }) {
      const affecting = /* @__PURE__ */ new Set();
      for (const target of affected)
        if (await target.addEffect(
          GuidanceEffect,
          { duration: Infinity, caster, affecting },
          caster
        ))
          affecting.add(target);
      if (affecting.size)
        caster.concentrateOn({
          duration: minutes(1),
          spell: Guidance,
          async onSpellEnd() {
            for (const who of affecting)
              await who.removeEffect(GuidanceEffect);
          }
        });
    }
  });
  var Guidance_default = Guidance;

  // src/spells/cantrip/Gust.ts
  var Gust = simpleSpell({
    status: "incomplete",
    name: "Gust",
    level: 0,
    school: "Transmutation",
    v: true,
    s: true,
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `You seize the air and compel it to create one of the following effects at a point you can see within range:

  - One Medium or smaller creature that you choose must succeed on a Strength saving throw or be pushed up to 5 feet away from you.
  - You create a small blast of air capable of moving one object that is neither held nor carried and that weighs no more than 5 pounds. The object is pushed up to 10 feet away from you. It isn't pushed with enough force to cause damage.
  - You create a harmless sensory effect using air, such as causing leaves to rustle, wind to slam shutters closed, or your clothing to ripple in a breeze.`,
    ...targetsOne(30, [sizeOrLess(SizeCategory_default.Medium)]),
    async apply(sh, { target }) {
      const { outcome } = await sh.save({
        who: target,
        ability: "str",
        tags: ["forced movement"]
      });
      if (outcome === "fail")
        await sh.g.forcePush(target, sh.caster, 5, Gust);
    }
  });
  var Gust_default = Gust;

  // src/img/spl/magic-stone.svg
  var magic_stone_default = "./magic-stone-WVSVVWF5.svg";

  // src/spells/cantrip/MagicStone.ts
  var MagicStoneIcon = makeIcon(magic_stone_default, DamageColours.bludgeoning);
  var MagicStoneResource = new TemporaryResource("Magic Stone", 3);
  var MagicStoneAction = class extends AbstractSingleTargetAttackAction {
    constructor(g, actor, method, unsubscribe) {
      super(
        g,
        actor,
        "Throw Magic Stone",
        "incomplete",
        "magic stone",
        "ranged",
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
    generateAttackConfigs(targets) {
      return targets.map((target) => ({
        config: { target },
        positioning: poSet(poWithin(60, target))
      }));
    }
    async applyEffect({ target }) {
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
            target: attack.roll.type.target,
            ability: attack.roll.type.ability,
            spell: MagicStone,
            method: attack.roll.type.method,
            tags: attack.roll.type.tags
          },
          critical
        );
        await g.damage(
          this,
          "bludgeoning",
          {
            attack,
            attacker: actor,
            target: attack.roll.type.target,
            ability: attack.roll.type.ability,
            critical,
            spell: MagicStone,
            method: attack.roll.type.method
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
    ...affectsSelf,
    async apply({ g, caster, method }) {
      caster.initResource(MagicStoneResource);
      g.text(
        new MessageBuilder().co(caster).text(` creates ${MagicStoneResource.maximum} magic stones.`)
      );
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

  // src/spells/cantrip/MindSliver.ts
  var MindSliverEffect = new Effect(
    "Mind Sliver",
    "turnStart",
    (g) => {
      g.events.on("BeforeSave", ({ detail: { who, bonus, interrupt } }) => {
        if (who.hasEffect(MindSliverEffect)) {
          const { values } = g.dice.roll({ type: "bane", who });
          bonus.add(-values.final, MindSliver);
          interrupt.add(
            new EvaluateLater(
              who,
              MindSliverEffect,
              Priority_default.Normal,
              () => who.removeEffect(MindSliverEffect)
            )
          );
        }
      });
    },
    { tags: ["magic"] }
  );
  var MindSliver = simpleSpell({
    status: "implemented",
    name: "Mind Sliver",
    level: 0,
    school: "Enchantment",
    v: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    description: `You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. The target must succeed on an Intelligence saving throw or take 1d6 psychic damage and subtract 1d4 from the next saving throw it makes before the end of your next turn.

  This spell's damage increases by 1d6 when you reach certain levels: 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
    ...targetsOne(60, [canSee, notSelf]),
    ...requiresSave("int"),
    ...doesCantripDamage(6, "psychic"),
    generateAttackConfigs: aiTargetsOne(60),
    async apply(sh, { target }) {
      const { damageResponse, outcome } = await sh.save({
        who: target,
        ability: "int",
        save: "zero"
      });
      const damageInitialiser = await sh.rollDamage({ target });
      await sh.damage({
        damageInitialiser,
        damageType: "psychic",
        damageResponse,
        target
      });
      if (outcome === "fail") {
        let endCounter = 2;
        const removeTurnTracker = sh.g.events.on(
          "TurnEnded",
          ({ detail: { who, interrupt } }) => {
            if (who === sh.caster && endCounter-- <= 0) {
              removeTurnTracker();
              interrupt.add(
                new EvaluateLater(
                  who,
                  MindSliver,
                  Priority_default.Normal,
                  () => target.removeEffect(MindSliverEffect)
                )
              );
            }
          }
        );
        await target.addEffect(MindSliverEffect, { duration: 2 }, sh.caster);
      }
    }
  });
  var MindSliver_default = MindSliver;

  // src/spells/cantrip/PoisonSpray.ts
  var PoisonSpray = simpleSpell({
    status: "implemented",
    name: "Poison Spray",
    level: 0,
    school: "Conjuration",
    v: true,
    s: true,
    lists: ["Artificer", "Druid", "Sorcerer", "Warlock", "Wizard"],
    description: `You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a Constitution saving throw or take 1d12 poison damage.

  This spell's damage increases by 1d12 when you reach 5th level (2d12), 11th level (3d12), and 17th level (4d12).`,
    ...targetsOne(10, [canSee]),
    ...requiresSave("con"),
    ...doesCantripDamage(6, "acid"),
    generateAttackConfigs: aiTargetsOne(10),
    async apply(sh, { target }) {
      const { damageResponse } = await sh.save({
        who: target,
        ability: "con",
        save: "zero",
        tags: ["magic", "poison"]
      });
      const damageInitialiser = await sh.rollDamage({ target });
      await sh.damage({
        target,
        damageType: "poison",
        damageInitialiser,
        damageResponse
      });
    }
  });
  var PoisonSpray_default = PoisonSpray;

  // src/spells/cantrip/PrimalSavagery.ts
  var PrimalSavagery = simpleSpell({
    status: "implemented",
    name: "Primal Savagery",
    level: 0,
    school: "Transmutation",
    s: true,
    lists: ["Druid"],
    description: `You channel primal magic to cause your teeth or fingernails to sharpen, ready to deliver a corrosive attack. Make a melee spell attack against one creature within 5 feet of you. On a hit, the target takes 1d10 acid damage. After you make the attack, your teeth or fingernails return to normal.

  The spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).`,
    ...targetsOne(5, [notSelf]),
    ...isSpellAttack("melee"),
    ...doesCantripDamage(10, "acid"),
    generateAttackConfigs: aiTargetsOne(5),
    async apply(sh) {
      const { attack, critical, hit, target } = await sh.attack({
        target: sh.config.target,
        type: "melee"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["melee"]
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser,
          damageType: "acid",
          target
        });
      }
    }
  });
  var PrimalSavagery_default = PrimalSavagery;

  // src/spells/cantrip/ProduceFlame.ts
  var ProduceFlame = simpleSpell({
    status: "incomplete",
    name: "Produce Flame",
    level: 0,
    school: "Conjuration",
    v: true,
    s: true,
    lists: ["Druid"],
    description: `A flickering flame appears in your hand. The flame remains there for the duration and harms neither you nor your equipment. The flame sheds bright light in a 10-foot radius and dim light for an additional 10 feet. The spell ends if you dismiss it as an action or if you cast it again.

  You can also attack with the flame, although doing so ends the spell. When you cast this spell, or as an action on a later turn, you can hurl the flame at a creature within 30 feet of you. Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.
  
  This spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
    ...targetsOne(30, []),
    ...isSpellAttack("ranged"),
    ...doesCantripDamage(8, "fire"),
    generateAttackConfigs: aiTargetsOne(30),
    async apply(sh) {
      const { attack, critical, hit, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["ranged"]
        });
        await sh.damage({
          attack,
          critical,
          target,
          damageInitialiser,
          damageType: "fire"
        });
      }
    }
  });
  var ProduceFlame_default = ProduceFlame;

  // src/img/spl/ray-of-frost.svg
  var ray_of_frost_default = "./ray-of-frost-5EAHUBPB.svg";

  // src/spells/cantrip/RayOfFrost.ts
  var RayOfFrostIcon = makeIcon(ray_of_frost_default, DamageColours.cold);
  var RayOfFrostEffect = new Effect(
    "Ray of Frost",
    "turnStart",
    (g) => {
      g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
        if (who.hasEffect(RayOfFrostEffect))
          bonus.add(-10, RayOfFrostEffect);
      });
    },
    { icon: RayOfFrostIcon, tags: ["magic"] }
  );
  var RayOfFrost = simpleSpell({
    status: "implemented",
    name: "Ray of Frost",
    icon: RayOfFrostIcon,
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
    ...targetsOne(60, []),
    ...isSpellAttack("ranged"),
    ...doesCantripDamage(8, "cold"),
    generateAttackConfigs: aiTargetsOne(60),
    async apply(sh) {
      const { attack, critical, hit, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["ranged"]
        });
        await sh.damage({
          attack,
          critical,
          target,
          damageInitialiser,
          damageType: "cold"
        });
        await target.addEffect(RayOfFrostEffect, { duration: 2 }, sh.caster);
      }
    }
  });
  var RayOfFrost_default = RayOfFrost;

  // src/spells/cantrip/Resistance.ts
  var ResistanceEffect = new Effect(
    "Resistance",
    "turnStart",
    (g) => {
      g.events.on("BeforeSave", ({ detail: { who, interrupt, bonus } }) => {
        const config = who.getEffectConfig(ResistanceEffect);
        if (config)
          interrupt.add(
            new YesNoChoice(
              who,
              ResistanceEffect,
              "Resistance",
              `${who.name} is making a saving throw. Use Resistance to gain a d4?`,
              Priority_default.Normal,
              async () => {
                const value = await g.roll({
                  type: "other",
                  source: ResistanceEffect,
                  size: 4,
                  who
                });
                bonus.add(value.values.final, ResistanceEffect);
                await who.removeEffect(ResistanceEffect);
                config.affecting.delete(who);
                if (!config.affecting.size)
                  await config.caster.endConcentration(Resistance);
              }
            )
          );
      });
    },
    { tags: ["magic"] }
  );
  var Resistance = simpleSpell({
    status: "implemented",
    name: "Resistance",
    level: 0,
    school: "Abjuration",
    concentration: true,
    v: true,
    s: true,
    m: "a miniature cloak",
    lists: ["Artificer", "Cleric", "Druid"],
    description: `You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one saving throw of its choice. It can roll the die before or after making the saving throw. The spell then ends.`,
    ...targetsByTouch([isAlly]),
    async apply({ affected, caster }) {
      const affecting = /* @__PURE__ */ new Set();
      for (const target of affected)
        if (await target.addEffect(
          ResistanceEffect,
          { duration: Infinity, caster, affecting },
          caster
        ))
          affecting.add(target);
      if (affecting.size)
        caster.concentrateOn({
          duration: minutes(1),
          spell: Resistance,
          async onSpellEnd() {
            for (const who of affecting)
              await who.removeEffect(ResistanceEffect);
          }
        });
    }
  });
  var Resistance_default = Resistance;

  // src/img/spl/sacred-flame.svg
  var sacred_flame_default = "./sacred-flame-NBJ5YTKD.svg";

  // src/spells/cantrip/SacredFlame.ts
  var SacredFlame = simpleSpell({
    status: "incomplete",
    name: "Sacred Flame",
    icon: makeIcon(sacred_flame_default, DamageColours.fire),
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Cleric"],
    description: `Flame-like radiance descends on a creature that you can see within range. The target must succeed on a Dexterity saving throw or take 1d8 radiant damage. The target gains no benefit from cover for this saving throw.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
    ...targetsOne(60, [canSee]),
    ...requiresSave("dex"),
    ...doesCantripDamage(8, "radiant"),
    generateAttackConfigs: aiTargetsOne(60),
    async apply(sh, { target }) {
      const damageInitialiser = await sh.rollDamage({ target });
      const { damageResponse } = await sh.save({
        who: target,
        ability: "dex",
        save: "zero"
      });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "radiant",
        target
      });
    }
  });
  var SacredFlame_default = SacredFlame;

  // src/spells/cantrip/Shillelagh.ts
  var shillelaghWeapons = /* @__PURE__ */ new Set(["club", "quarterstaff"]);
  var ShillelaghEffect = new Effect(
    "Shillelagh",
    "turnStart",
    (g) => {
      g.events.on("EffectRemoved", ({ detail: { effect, config } }) => {
        if (effect === ShillelaghEffect) {
          const { item, name, magical, damage, forceAbilityScore, versatile } = config;
          item.name = name;
          item.magical = magical;
          item.damage = damage;
          item.forceAbilityScore = forceAbilityScore;
          if (versatile)
            item.properties.add("versatile");
        }
      });
    },
    { tags: ["magic"] }
  );
  var Shillelagh = simpleSpell({
    status: "implemented",
    name: "Shillelagh",
    level: 0,
    school: "Transmutation",
    time: "bonus action",
    v: true,
    s: true,
    m: "mistletoe, a shamrock leaf, and a club or quarterstaff",
    lists: ["Druid"],
    description: `The wood of a club or quarterstaff you are holding is imbued with nature's power. For the duration, you can use your spellcasting ability instead of Strength for the attack and damage rolls of melee attacks using that weapon, and the weapon's damage die becomes a d8. The weapon also becomes magical, if it isn't already. The spell ends if you cast it again or if you let go of the weapon.`,
    ...affectsSelf,
    getConfig: (g, caster) => ({
      item: new ChoiceResolver(
        g,
        "Weapon",
        Array.from(caster.weapons).filter((it) => shillelaghWeapons.has(it.weaponType)).map((value) => makeChoice(value, value.name))
      )
    }),
    async apply({ g, caster, method }, { item }) {
      const { name, magical, damage, forceAbilityScore } = item;
      const versatile = item.properties.has("versatile");
      g.text(
        new MessageBuilder().co(caster).text(" transforms their ").it(item).text(" into a shillelagh.")
      );
      item.name = `shillelagh (${item.name})`;
      item.magical = true;
      item.damage = _dd(1, 8, "bludgeoning");
      item.forceAbilityScore = method.ability;
      item.properties.delete("versatile");
      await caster.addEffect(ShillelaghEffect, {
        duration: minutes(1),
        item,
        name,
        magical,
        damage,
        forceAbilityScore,
        versatile
      });
    }
  });
  var Shillelagh_default = Shillelagh;

  // src/img/spl/shocking-grasp.svg
  var shocking_grasp_default = "./shocking-grasp-EP6ADEH3.svg";

  // src/spells/cantrip/ShockingGrasp.ts
  var ShockingGraspIcon = makeIcon(shocking_grasp_default, DamageColours.lightning);
  var ShockingGraspEffect = new Effect(
    "Shocking Grasp",
    "turnStart",
    (g) => {
      g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
        if (action.actor.hasEffect(ShockingGraspEffect) && action.getTime(config) == "reaction")
          error.add("can't take reactions", ShockingGraspEffect);
      });
    },
    { icon: ShockingGraspIcon, tags: ["magic"] }
  );
  var ShockingGrasp = simpleSpell({
    status: "implemented",
    name: "Shocking Grasp",
    icon: ShockingGraspIcon,
    level: 0,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `Lightning springs from your hand to deliver a shock to a creature you try to touch. Make a melee spell attack against the target. You have advantage on the attack roll if the target is wearing armor made of metal. On a hit, the target takes 1d8 lightning damage, and it can't take reactions until the start of its next turn.

  The spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).`,
    ...targetsByTouch([]),
    ...isSpellAttack("melee"),
    ...doesCantripDamage(8, "lightning"),
    generateAttackConfigs: aiTargetsByTouch,
    async apply(sh, { target: originalTarget }) {
      var _a;
      const { attack, critical, hit, target } = await sh.attack({
        target: originalTarget,
        diceType: ((_a = originalTarget.armor) == null ? void 0 : _a.metal) ? "advantage" : void 0,
        type: "melee"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["melee"]
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser,
          damageType: "lightning",
          target
        });
        await target.addEffect(ShockingGraspEffect, { duration: 1 }, sh.caster);
      }
    }
  });
  var ShockingGrasp_default = ShockingGrasp;

  // src/spells/cantrip/SpareTheDying.ts
  var SpareTheDying = simpleSpell({
    status: "implemented",
    name: "Spare the Dying",
    level: 0,
    school: "Necromancy",
    v: true,
    s: true,
    lists: ["Artificer", "Cleric"],
    description: `You touch a living creature that has 0 hit points. The creature becomes stable. This spell has no effect on undead or constructs.`,
    ...targetsByTouch([
      doesNotHaveEffect(Dead),
      hasEffect(Dying),
      notOfCreatureType("undead", "construct")
    ]),
    async apply(sh) {
      for (const target of sh.affected) {
        await target.removeEffect(Dying);
        await target.addEffect(Stable, { duration: Infinity });
      }
    }
  });
  var SpareTheDying_default = SpareTheDying;

  // src/spells/cantrip/Thaumaturgy.ts
  var Thaumaturgy = simpleSpell({
    name: "Thaumaturgy",
    level: 0,
    school: "Transmutation",
    v: true,
    lists: ["Cleric"],
    description: `You manifest a minor wonder, a sign of supernatural power, within range. You create one of the following magical effects within range:
  - Your voice booms up to three times as loud as normal for 1 minute.
  - You cause flames to flicker, brighten, dim, or change color for 1 minute.
  - You cause harmless tremors in the ground for 1 minute.
  - You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.
  - You instantaneously cause an unlocked door or window to fly open or slam shut.
  - You alter the appearance of your eyes for 1 minute.

  If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time, and you can dismiss such an effect as an action.`,
    getConfig: () => ({}),
    getTargets: () => [],
    getAffected: () => [],
    async apply() {
    }
  });
  var Thaumaturgy_default = Thaumaturgy;

  // src/spells/cantrip/Thunderclap.ts
  var Thunderclap = simpleSpell({
    status: "implemented",
    name: "Thunderclap",
    level: 0,
    school: "Evocation",
    s: true,
    lists: ["Artificer", "Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
    description: `You create a burst of thunderous sound that can be heard up to 100 feet away. Each creature within range, other than you, must make a Constitution saving throw or take 1d6 thunder damage.

The spell's damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).`,
    ...requiresSave("con"),
    ...doesCantripDamage(6, "thunder"),
    ...affectsStaticArea((who) => ({ type: "within", who, radius: 5 })),
    generateAttackConfigs: () => [{ config: {}, positioning: poSet() }],
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { outcome, damageResponse } = await sh.save({
          who: target,
          ability: "con",
          save: "zero"
        });
        if (outcome === "fail")
          await sh.damage({
            damageInitialiser,
            damageResponse,
            damageType: "thunder",
            target
          });
      }
    }
  });
  var Thunderclap_default = Thunderclap;

  // src/spells/cantrip/ViciousMockery.ts
  var ViciousMockeryEffect = new Effect(
    "Vicious Mockery",
    "turnEnd",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { who, interrupt, diceType } }) => {
        if (who.hasEffect(ViciousMockeryEffect))
          interrupt.add(
            new EvaluateLater(
              who,
              ViciousMockeryEffect,
              Priority_default.ChangesOutcome,
              async () => {
                await who.removeEffect(ViciousMockeryEffect);
                diceType.add("disadvantage", ViciousMockeryEffect);
              }
            )
          );
      });
    },
    { tags: ["magic"] }
  );
  var ViciousMockery = simpleSpell({
    status: "implemented",
    name: "Vicious Mockery",
    level: 0,
    school: "Enchantment",
    v: true,
    lists: ["Bard"],
    description: `You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a Wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.

This spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).`,
    ...targetsOne(60, [canSee, canBeHeardBy]),
    ...requiresSave("wis"),
    ...doesCantripDamage(4, "psychic"),
    generateAttackConfigs: aiTargetsOne(60),
    async apply(sh, { target }) {
      const config = { duration: 1 };
      const { outcome, damageResponse } = await sh.save({
        who: target,
        ability: "wis",
        effect: ViciousMockeryEffect,
        config,
        save: "zero"
      });
      const damageInitialiser = await sh.rollDamage({ target });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "psychic",
        target
      });
      if (outcome === "fail")
        await target.addEffect(ViciousMockeryEffect, config, sh.caster);
    }
  });
  var ViciousMockery_default = ViciousMockery;

  // src/img/spl/bless.svg
  var bless_default = "./bless-VVWIP7W3.svg";

  // src/spells/level1/Bless.ts
  var BlessIcon = makeIcon(bless_default);
  function applyBless(g, who, bonus) {
    if (who.hasEffect(BlessEffect)) {
      const { values } = g.dice.roll({ type: "bless", who });
      bonus.add(values.final, BlessEffect);
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
    { icon: BlessIcon, tags: ["magic"] }
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
    ...targetsMany(1, 3, 30, []),
    getConfig: (g, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g, 1, (slot != null ? slot : 1) + 2, 30, [])
    }),
    async apply({ caster }, { targets }) {
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

  // src/spells/level1/BurningHands.ts
  var BurningHands = scalingSpell({
    status: "incomplete",
    name: "Burning Hands",
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Sorcerer", "Wizard"],
    description: `As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a Dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.

  The fire ignites any flammable objects in the area that aren't being worn or carried.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d6 for each slot level above 1st.`,
    ...affectsCone(15),
    ...doesScalingDamage(1, 2, 6, "fire"),
    // TODO generateAttackConfigs,
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { damageResponse } = await sh.save({
          who: target,
          ability: "dex"
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "fire",
          target
        });
      }
    }
  });
  var BurningHands_default = BurningHands;

  // src/spells/level1/CharmPerson.ts
  var CharmPerson = scalingSpell({
    name: "Charm Person",
    level: 1,
    school: "Enchantment",
    v: true,
    lists: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
    description: `You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature regards you as a friendly acquaintance. When the spell ends, the creature knows it was charmed by you.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.`,
    isHarmful: true,
    ...targetsMany(1, 1, 60, [canSee]),
    getConfig: (g, actor, method, { slot }) => ({
      targets: new MultiTargetResolver(
        g,
        1,
        slot != null ? slot : 1,
        60,
        [canSee],
        [withinRangeOfEachOther(30)]
      )
    }),
    // TODO generateAttackConfigs,
    async apply() {
    }
  });
  var CharmPerson_default = CharmPerson;

  // src/spells/level1/Command.ts
  var Command = scalingSpell({
    name: "Command",
    level: 1,
    school: "Enchantment",
    v: true,
    lists: ["Cleric", "Paladin"],
    description: `You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.

  Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.
  
  Approach. The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.
  Drop. The target drops whatever it is holding and then ends its turn.
  Flee. The target spends its turn moving away from you by the fastest available means.
  Grovel. The target falls prone and then ends its turn.
  Halt. The target doesn't move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can affect one additional creature for each slot level above 1st. The creatures must be within 30 feet of each other when you target them.`,
    isHarmful: true,
    getConfig: (g, actor, method, { slot }) => ({
      targets: new MultiTargetResolver(
        g,
        1,
        slot != null ? slot : 1,
        60,
        [canSee, canBeHeardBy, notOfCreatureType("undead")],
        // TODO if it doesn't understand your language
        [withinRangeOfEachOther(30)]
      )
    }),
    generateAttackConfigs: ({ slot, allTargets }) => combinationsMulti(allTargets, 1, slot).map((targets) => ({
      config: { targets },
      positioning: poSet(...targets.map((target) => poWithin(60, target)))
    })),
    getTargets: (g, caster, { targets }) => targets != null ? targets : [],
    getAffected: (g, caster, { targets }) => targets,
    async apply() {
    }
  });
  var Command_default = Command;

  // src/spells/level1/DivineFavor.ts
  var DivineFavorEffect = new Effect(
    "Divine Favor",
    "turnEnd",
    (g) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, critical, map, weapon, interrupt } }) => {
          if ((attacker == null ? void 0 : attacker.hasEffect(DivineFavorEffect)) && weapon)
            interrupt.add(
              new EvaluateLater(
                attacker,
                DivineFavorEffect,
                Priority_default.Normal,
                async () => {
                  map.add(
                    "radiant",
                    await g.rollDamage(
                      1,
                      {
                        source: DivineFavor,
                        size: 4,
                        attacker,
                        damageType: "radiant",
                        tags: atSet("magical")
                      },
                      critical
                    )
                  );
                }
              )
            );
        }
      );
    },
    { tags: ["magic"] }
  );
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
    ...affectsSelf,
    async apply({ caster }) {
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

  // src/img/spl/earth-tremor.svg
  var earth_tremor_default = "./earth-tremor-4O2WIJW4.svg";

  // src/types/EffectArea.ts
  var arSet = (...items) => new Set(items);

  // src/spells/level1/EarthTremor.ts
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
    generateAttackConfigs: () => [{ config: {}, positioning: poSet() }],
    ...affectsStaticArea((who) => ({ type: "within", radius: 10, who })),
    ...requiresSave("dex"),
    ...doesScalingDamage(1, 0, 6, "bludgeoning"),
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const config = { duration: Infinity };
        const { damageResponse, outcome } = await sh.save({
          ability: "dex",
          who: target,
          save: "zero",
          effect: Prone,
          config
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "bludgeoning",
          target
        });
        if (outcome === "fail")
          await target.addEffect(Prone, config, sh.caster);
      }
      for (const shape of sh.affectedArea) {
        const area = new ActiveEffectArea(
          "Earth Tremor",
          shape,
          arSet("difficult terrain"),
          "brown"
        );
        sh.g.addEffectArea(area);
      }
    }
  });
  var EarthTremor_default = EarthTremor;

  // src/spells/level1/Entangle.ts
  var BreakFreeFromEntangleAction = class extends AbstractSelfAction {
    constructor(g, actor, caster, method) {
      super(
        g,
        actor,
        "Break Free from Entangle",
        "implemented",
        {},
        {
          time: "action",
          description: `Make a Strength check to break free of the plants.`,
          tags: ["escape move prevention"]
        }
      );
      this.caster = caster;
      this.method = method;
    }
    async applyEffect() {
      const type = this.method.getSaveType(this.caster, Entangle);
      const dc = await this.g.getSaveDC({ source: Entangle, type });
      const result = await this.g.abilityCheck(dc.bonus.result, {
        ability: "str",
        who: this.actor,
        tags: chSet()
      });
      if (result.outcome === "success")
        await this.actor.removeEffect(EntangleEffect);
    }
  };
  var EntangleEffect = new Effect(
    "Entangle",
    "turnEnd",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(EntangleEffect))
          conditions.add("Restrained", EntangleEffect);
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        const config = who.getEffectConfig(EntangleEffect);
        if (config)
          actions.push(
            new BreakFreeFromEntangleAction(g, who, config.caster, config.method)
          );
      });
    },
    { tags: ["magic"] }
  );
  var Entangle = simpleSpell({
    status: "implemented",
    name: "Entangle",
    level: 1,
    school: "Conjuration",
    concentration: true,
    v: true,
    s: true,
    lists: ["Druid"],
    description: `Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain.

  A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself.
  
  When the spell ends, the conjured plants wilt away.`,
    // TODO this should be 'square' on the ground...
    ...affectsByPoint(90, (centre) => ({ type: "cube", centre, length: 20 })),
    ...requiresSave("str"),
    async apply(sh) {
      const areas = /* @__PURE__ */ new Set();
      for (const shape of sh.affectedArea) {
        const area = new ActiveEffectArea(
          "Entangle",
          shape,
          arSet("difficult terrain", "plants"),
          "green",
          ({ detail: { where, difficult } }) => {
            if (area.points.has(where))
              difficult.add("magical plants", Entangle);
          }
        );
        areas.add(area);
        sh.g.addEffectArea(area);
      }
      const mse = sh.getMultiSave({
        ability: "wis",
        effect: EntangleEffect,
        duration: minutes(1),
        conditions: ["Restrained"],
        tags: ["impedes movement", "plant"]
      });
      if (await mse.apply({}))
        await mse.concentrate(async () => {
          for (const area of areas)
            sh.g.removeEffectArea(area);
        });
    }
  });
  var Entangle_default = Entangle;

  // src/spells/level1/FaerieFire.ts
  var FaerieFireEffect = new Effect(
    "Faerie Fire",
    "turnEnd",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        if (target.hasEffect(FaerieFireEffect) && g.canSee(who, target))
          diceType.add("advantage", FaerieFireEffect);
      });
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(FaerieFireEffect))
          conditions.ignoreValue("Invisible");
      });
    },
    { tags: ["magic"] }
  );
  var FaerieFire = simpleSpell({
    status: "implemented",
    name: "Faerie Fire",
    level: 1,
    school: "Evocation",
    concentration: true,
    v: true,
    lists: ["Artificer", "Bard", "Druid"],
    description: `Each object in a 20-foot cube within range is outlined in blue, green, or violet light (your choice). Any creature in the area when the spell is cast is also outlined in light if it fails a Dexterity saving throw. For the duration, objects and affected creatures shed dim light in a 10-foot radius.

  Any attack roll against an affected creature or object has advantage if the attacker can see it, and the affected creature or object can't benefit from being invisible.`,
    isHarmful: true,
    ...affectsByPoint(60, (centre) => ({ type: "cube", centre, length: 20 })),
    ...requiresSave("dex"),
    async apply(sh) {
      const mse = sh.getMultiSave({
        ability: "wis",
        effect: FaerieFireEffect,
        duration: minutes(1)
      });
      if (await mse.apply({}))
        await mse.concentrate();
    }
  });
  var FaerieFire_default = FaerieFire;

  // src/spells/level1/FogCloud.ts
  var FogCloud = scalingSpell({
    status: "incomplete",
    name: "Fog Cloud",
    level: 1,
    school: "Conjuration",
    concentration: true,
    v: true,
    s: true,
    lists: ["Druid", "Ranger", "Sorcerer", "Wizard"],
    description: `You create a 20-foot-radius sphere of fog centered on a point within range. The sphere spreads around corners, and its area is heavily obscured. It lasts for the duration or until a wind of moderate or greater speed (at least 10 miles per hour) disperses it.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the radius of the fog increases by 20 feet for each slot level above 1st.`,
    ...affectsByPoint(120, (centre) => ({ type: "sphere", radius: 20, centre })),
    getAffectedArea: (g, caster, { point, slot }) => point && [{ type: "sphere", radius: 20 * (slot != null ? slot : 1), centre: point }],
    async apply({ g, affectedArea, caster }) {
      const areas = /* @__PURE__ */ new Set();
      for (const shape of affectedArea) {
        const area = new ActiveEffectArea(
          "Fog Cloud",
          shape,
          arSet("heavily obscured"),
          "grey"
        );
        areas.add(area);
        g.addEffectArea(area);
      }
      await caster.concentrateOn({
        spell: FogCloud,
        duration: hours(1),
        onSpellEnd: async () => {
          for (const area of areas)
            g.removeEffectArea(area);
        }
      });
    }
  });
  var FogCloud_default = FogCloud;

  // src/spells/level1/GuidingBolt.ts
  var GuidingBoltEffect = new Effect(
    "Guiding Bolt",
    "turnEnd",
    (g) => {
      g.events.on(
        "BeforeAttack",
        ({ detail: { target, diceType, interrupt } }) => {
          if (target.hasEffect(GuidingBoltEffect)) {
            diceType.add("advantage", GuidingBoltEffect);
            interrupt.add(
              new EvaluateLater(
                target,
                GuidingBoltEffect,
                Priority_default.Normal,
                () => target.removeEffect(GuidingBoltEffect)
              )
            );
          }
        }
      );
    },
    { tags: ["magic"] }
  );
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
    ...targetsOne(120, [notSelf]),
    ...isSpellAttack("ranged"),
    ...doesScalingDamage(1, 3, 6, "radiant"),
    generateAttackConfigs: aiTargetsOne(120),
    async apply(sh) {
      const { attack, critical, hit, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["ranged"]
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser,
          damageType: "radiant",
          target
        });
        await target.addEffect(GuidingBoltEffect, { duration: 2 }, sh.caster);
      }
    }
  });
  var GuidingBolt_default = GuidingBolt;

  // src/spells/level1/HealingWord.ts
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
    ...targetsOne(60, [canSee, notOfCreatureType("undead", "construct")]),
    generateHealingConfigs: aiTargetsOne(60),
    getHeal: (g, caster, method, { slot }) => [
      { type: "dice", amount: { count: slot != null ? slot : 1, size: 4 } },
      {
        type: "flat",
        amount: method.ability ? caster[method.ability].modifier : 0
      }
    ],
    check(g, { target }, ec) {
      if (target && cannotHealConventionally.has(target.type))
        ec.add(`Cannot heal a ${target.type}`, HealingWord);
      return ec;
    },
    async apply(sh, { target }) {
      if (cannotHealConventionally.has(target.type))
        return;
      const amount = await sh.rollHeal({ target });
      await sh.heal({ amount, target });
    }
  });
  var HealingWord_default = HealingWord;

  // src/spells/level1/HellishRebuke.ts
  new DndRule("Hellish Rebuke", (g) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { who, attacker, interrupt } }) => {
        if (!attacker)
          return;
        const rebuke = g.getActions(who).flatMap((action) => {
          var _a, _b, _c, _d, _e, _f;
          if (!isCastSpell(action, HellishRebuke2))
            return [];
          const minSlot = (_c = (_b = (_a = action.method).getMinSlot) == null ? void 0 : _b.call(_a, HellishRebuke2, who)) != null ? _c : HellishRebuke2.level;
          const maxSlot = (_f = (_e = (_d = action.method).getMaxSlot) == null ? void 0 : _e.call(_d, HellishRebuke2, who)) != null ? _f : HellishRebuke2.level;
          return enumerate(minSlot, maxSlot).map((slot) => ({
            action,
            config: { target: attacker, slot }
          })).filter(({ action: action2, config }) => checkConfig(g, action2, config));
        });
        if (!rebuke.length)
          return;
        interrupt.add(
          new PickFromListChoice(
            who,
            HellishRebuke2,
            "Hellish Rebuke",
            `${attacker.name} damaged ${who.name}. Respond by casting Hellish Rebuke?`,
            Priority_default.Late,
            rebuke.map((value) => ({ value, label: value.action.name })),
            async ({ action, config }) => {
              await g.act(action, config);
            },
            true
          )
        );
      }
    );
  });
  var HellishRebuke2 = scalingSpell({
    status: "implemented",
    name: "Hellish Rebuke",
    level: 1,
    school: "Evocation",
    time: "reaction",
    v: true,
    s: true,
    lists: ["Warlock"],
    description: `You point your finger, and the creature that damaged you is momentarily surrounded by hellish flames. The creature must make a Dexterity saving throw. It takes 2d10 fire damage on a failed save, or half as much damage on a successful one.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.`,
    icon: makeIcon(hellish_rebuke_default, DamageColours.fire),
    ...targetsOne(60, []),
    ...doesScalingDamage(1, 1, 10, "fire"),
    generateAttackConfigs: aiTargetsOne(60),
    async apply(sh, { target }) {
      const damageInitialiser = await sh.rollDamage({ target, tags: ["ranged"] });
      const { damageResponse } = await sh.save({ who: target, ability: "dex" });
      await sh.damage({
        damageInitialiser,
        damageResponse,
        damageType: "fire",
        target
      });
    }
  });
  var HellishRebuke_default = HellishRebuke2;

  // src/spells/level1/HideousLaughter.ts
  var getHideousLaughterSave = (who, config, diceType = "normal") => ({
    source: HideousLaughter,
    type: config.method.getSaveType(config.caster, HideousLaughter),
    who,
    ability: "wis",
    attacker: config.caster,
    effect: LaughterEffect,
    config,
    diceType,
    spell: HideousLaughter,
    method: config.method
  });
  var LaughterEffect = new Effect(
    "Hideous Laughter",
    "turnStart",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(LaughterEffect))
          conditions.add("Incapacitated", LaughterEffect);
      });
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor.hasEffect(LaughterEffect) && action instanceof StandUpAction)
          error.add("laughing too hard", LaughterEffect);
      });
      const resave = (i2, who, config, diceType = "normal") => i2.add(
        new EvaluateLater(who, LaughterEffect, Priority_default.Normal, async () => {
          const { outcome } = await g.save(
            getHideousLaughterSave(who, config, diceType)
          );
          if (outcome === "success")
            await config.caster.endConcentration(HideousLaughter);
        })
      );
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        const config = who.getEffectConfig(LaughterEffect);
        if (config)
          resave(interrupt, who, config);
      });
      g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
        const config = who.getEffectConfig(LaughterEffect);
        if (config)
          resave(interrupt, who, config, "advantage");
      });
    },
    { tags: ["magic"] }
  );
  var HideousLaughter = simpleSpell({
    status: "implemented",
    name: "Hideous Laughter",
    level: 1,
    school: "Enchantment",
    concentration: true,
    v: true,
    s: true,
    m: "tiny tarts and a feather that is waved in the air",
    lists: ["Bard", "Wizard"],
    description: `A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn't affected.

At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it's triggered by damage. On a success, the spell ends.`,
    isHarmful: true,
    ...targetsOne(30, [canSee]),
    ...requiresSave("wis"),
    generateAttackConfigs: aiTargetsOne(30),
    async apply({ g, caster, method }, { target }) {
      if (target.int.score <= 4) {
        g.text(
          new MessageBuilder().co(target).text(" is too dumb for the joke.")
        );
        return;
      }
      const effect = LaughterEffect;
      const config = {
        caster,
        method,
        conditions: coSet("Incapacitated"),
        duration: minutes(1)
      };
      const { outcome } = await g.save(getHideousLaughterSave(target, config));
      if (outcome === "fail") {
        const success = await target.addEffect(effect, config, caster);
        if (success) {
          await target.addEffect(Prone, { duration: Infinity }, caster);
          caster.concentrateOn({
            spell: HideousLaughter,
            duration: minutes(1),
            async onSpellEnd() {
              await target.removeEffect(effect);
            }
          });
        }
      }
    }
  });
  var HideousLaughter_default = HideousLaughter;

  // src/img/spl/ice-knife.svg
  var ice_knife_default = "./ice-knife-RO2OKB56.svg";

  // src/spells/level1/IceKnife.ts
  var getIceKnifeArea = (who) => ({
    type: "within",
    who,
    radius: 5
  });
  var piercingRoll = _dd(1, 10, "piercing");
  var getColdRoll = (slot) => _dd(1 + slot, 6, "cold");
  var IceKnife = scalingSpell({
    status: "implemented",
    name: "Ice Knife",
    icon: makeIcon(ice_knife_default, DamageColours.cold),
    level: 1,
    school: "Conjuration",
    s: true,
    m: "a drop of water or piece of ice",
    lists: ["Druid", "Sorcerer", "Wizard"],
    isHarmful: true,
    description: `You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 piercing damage. Hit or miss, the shard then explodes. The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 cold damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the cold damage increases by 1d6 for each slot level above 1st.`,
    ...targetsOne(60, [notSelf]),
    generateAttackConfigs: aiTargetsOne(60),
    getAffectedArea: (g, caster, { target }) => target && [getIceKnifeArea(target)],
    getDamage: (g, caster, method, { slot }) => [
      piercingRoll,
      getColdRoll(slot != null ? slot : 1)
    ],
    getAffected: (g, caster, { target }) => g.getInside(getIceKnifeArea(target)),
    async apply(sh, { slot }) {
      const { attack, hit, critical, target } = await sh.attack({
        target: sh.config.target,
        type: "ranged"
      });
      if (hit) {
        const damageInitialiser2 = await sh.rollDamage({
          critical,
          damage: [piercingRoll],
          target,
          tags: ["ranged"]
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser: damageInitialiser2,
          damageType: piercingRoll.damageType,
          target
        });
      }
      const coldDamage = getColdRoll(slot);
      const damageInitialiser = await sh.rollDamage({ damage: [coldDamage] });
      for (const who of sh.affected) {
        const { damageResponse } = await sh.save({
          ability: "dex",
          who,
          save: "zero"
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: coldDamage.damageType,
          target: who
        });
      }
    }
  });
  var IceKnife_default = IceKnife;

  // src/img/spl/inflict-wounds.svg
  var inflict_wounds_default = "./inflict-wounds-BSUJIYPK.svg";

  // src/spells/level1/InflictWounds.ts
  var InflictWounds = scalingSpell({
    status: "implemented",
    name: "Inflict Wounds",
    icon: makeIcon(inflict_wounds_default, DamageColours.necrotic),
    level: 1,
    school: "Necromancy",
    v: true,
    s: true,
    lists: ["Cleric"],
    description: `Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.`,
    ...targetsByTouch([]),
    ...isSpellAttack("melee"),
    ...doesScalingDamage(1, 2, 10, "necrotic"),
    generateAttackConfigs: aiTargetsByTouch,
    async apply(sh) {
      const { attack, critical, hit, target } = await sh.attack({
        target: sh.config.target,
        type: "melee"
      });
      if (hit) {
        const damageInitialiser = await sh.rollDamage({
          critical,
          target,
          tags: ["melee"]
        });
        await sh.damage({
          attack,
          critical,
          damageInitialiser,
          damageType: "necrotic",
          target
        });
      }
    }
  });
  var InflictWounds_default = InflictWounds;

  // src/spells/level1/Longstrider.ts
  var LongstriderEffect = new Effect(
    "Longstrider",
    "turnStart",
    (g) => {
      g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
        if (who.hasEffect(LongstriderEffect))
          bonus.add(10, LongstriderEffect);
      });
    },
    { tags: ["magic"] }
  );
  var Longstrider = scalingSpell({
    status: "implemented",
    name: "Longstrider",
    level: 1,
    school: "Transmutation",
    v: true,
    s: true,
    m: "a pinch of dirt",
    lists: ["Artificer", "Bard", "Druid", "Ranger", "Wizard"],
    description: `You touch a creature. The target's speed increases by 10 feet until the spell ends.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, you can target one additional creature for each slot level above 1st.`,
    ...targetsMany(1, 1, 5, []),
    getConfig: (g, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(g, 1, slot != null ? slot : 1, caster.reach, [])
    }),
    async apply(sh, { targets }) {
      for (const target of targets)
        await target.addEffect(
          LongstriderEffect,
          { duration: hours(1) },
          sh.caster
        );
    }
  });
  var Longstrider_default = Longstrider;

  // src/spells/level1/MageArmor.ts
  var MageArmorEffect = new Effect(
    "Mage Armor",
    "turnStart",
    (g) => {
      g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
        if (who.hasEffect(MageArmorEffect) && !who.armor) {
          const uses = /* @__PURE__ */ new Set();
          let ac = 13 + who.dex.modifier;
          if (who.shield) {
            uses.add(who.shield);
            ac += who.shield.ac;
          }
          methods.push({ name: "Mage Armor", ac, uses });
        }
      });
    },
    { tags: ["magic"] }
  );
  var notWearingArmor = {
    name: "no armor",
    message: "wearing armor",
    check: (g, action, value) => !value.armor
  };
  var MageArmor = simpleSpell({
    status: "implemented",
    name: "Mage Armor",
    level: 1,
    school: "Abjuration",
    concentration: true,
    v: true,
    s: true,
    m: "a piece of cured leather",
    lists: ["Sorcerer", "Wizard"],
    description: `You touch a willing creature who isn't wearing armor, and a protective magical force surrounds it until the spell ends. The target's base AC becomes 13 + its Dexterity modifier. The spell ends if the target dons armor or if you dismiss the spell as an action.`,
    ...targetsByTouch([notWearingArmor]),
    async apply({ caster, method }, { target }) {
      await target.addEffect(MageArmorEffect, {
        duration: hours(8),
        caster,
        method
      });
    }
  });
  var MageArmor_default = MageArmor;

  // src/img/spl/magic-missile.svg
  var magic_missile_default = "./magic-missile-SXB2PGXZ.svg";

  // src/spells/level1/MagicMissile.ts
  var getMagicMissileDamage = (slot) => [
    _dd(slot + 2, 4, "force"),
    _fd(slot + 2, "force")
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
    isHarmful: true,
    description: `You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. A dart deals 1d4 + 1 force damage to its target. The darts all strike simultaneously, and you can direct them to hit one creature or several.

  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.`,
    // TODO: generateAttackConfigs
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
    getDamage: (g, caster, method, { slot }) => getMagicMissileDamage(slot != null ? slot : 1),
    getTargets: (g, caster, { targets }) => {
      var _a;
      return (_a = targets == null ? void 0 : targets.map((e2) => e2.who)) != null ? _a : [];
    },
    getAffected: (g, caster, { targets }) => targets.map((e2) => e2.who),
    async apply({ g, method, caster: attacker }, { targets }) {
      const perBolt = await g.rollDamage(1, {
        source: MagicMissile,
        spell: MagicMissile,
        method,
        attacker,
        damageType: "force",
        size: 4,
        tags: atSet("magical", "spell")
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

  // src/img/spl/protection-evil-good.svg
  var protection_evil_good_default = "./protection-evil-good-MRHA6REQ.svg";

  // src/spells/level1/ProtectionFromEvilAndGood.ts
  var ProtectionEvilGoodIcon = makeIcon(protection_evil_good_default);
  var evilAndGoodCreatureTypes = ctSet(
    "aberration",
    "celestial",
    "elemental",
    "fey",
    "fiend",
    "undead"
  );
  var isAffected = (attacker) => attacker && evilAndGoodCreatureTypes.has(attacker.type);
  var isValidEffect = (effect, config) => (effect == null ? void 0 : effect.tags.has("possession")) || hasAny(config == null ? void 0 : config.conditions, ["Charmed", "Frightened"]);
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
    { icon: ProtectionEvilGoodIcon, tags: ["magic"] }
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
    ...targetsByTouch([isAlly]),
    async apply({ caster }, { target }) {
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
  var sanctuaryEffects = new DefaultingMap(
    () => /* @__PURE__ */ new Set()
  );
  var SanctuaryEffect = new Effect(
    "Sanctuary",
    "turnStart",
    (g) => {
      g.events.on("BattleStarted", () => {
        sanctuaryEffects.clear();
      });
      g.events.on(
        "TurnStarted",
        ({ detail: { who } }) => sanctuaryEffects.get(who.id).clear()
      );
      g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
        var _a, _b;
        if (!action.tags.has("harmful"))
          return;
        const effects = sanctuaryEffects.get(action.actor.id);
        const targets = (_b = (_a = action.getTargets(config)) == null ? void 0 : _a.filter((who) => who.hasEffect(SanctuaryEffect))) != null ? _b : [];
        for (const target of targets) {
          if (effects.has(target.id))
            error.add("in Sanctuary", SanctuaryEffect);
        }
      });
      g.events.on("BeforeAttack", ({ detail: { target, interrupt, who } }) => {
        const config = target.getEffectConfig(SanctuaryEffect);
        if (config)
          interrupt.add(
            new EvaluateLater(
              who,
              SanctuaryEffect,
              Priority_default.ChangesOutcome,
              async () => {
                const { outcome } = await g.save({
                  source: SanctuaryEffect,
                  type: config.method.getSaveType(config.caster, Sanctuary),
                  who,
                  ability: "wis",
                  tags: ["charm", "magic"]
                });
                if (outcome === "fail") {
                  g.text(
                    new MessageBuilder().co(who).text(" fails to break ").co(target).nosp().text("'s Sanctuary.")
                  );
                  sanctuaryEffects.get(who.id).add(target.id);
                }
              }
            )
          );
      });
      const getRemover = (who) => new EvaluateLater(
        who,
        SanctuaryEffect,
        Priority_default.Normal,
        () => who.removeEffect(SanctuaryEffect)
      );
      g.events.on("Attack", ({ detail: { roll, interrupt } }) => {
        if (roll.type.who.hasEffect(SanctuaryEffect))
          interrupt.add(getRemover(roll.type.who));
      });
      g.events.on("SpellCast", ({ detail: { who, affected, interrupt } }) => {
        if (who.hasEffect(SanctuaryEffect))
          for (const target of affected) {
            if (target.side !== who.side) {
              interrupt.add(getRemover(target));
              return;
            }
          }
      });
      g.events.on("CombatantDamaged", ({ detail: { attacker, interrupt } }) => {
        if (attacker == null ? void 0 : attacker.hasEffect(SanctuaryEffect))
          interrupt.add(getRemover(attacker));
      });
    },
    { tags: ["magic"] }
  );
  var Sanctuary = simpleSpell({
    status: "incomplete",
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
    ...targetsOne(30, []),
    async apply({ caster, method }, { target }) {
      await target.addEffect(
        SanctuaryEffect,
        { caster, method, duration: minutes(1) },
        caster
      );
    }
  });
  var Sanctuary_default = Sanctuary;

  // src/img/spl/shield.svg
  var shield_default = "./shield-6WKZRKVU.svg";

  // src/spells/level1/Shield.ts
  var ShieldIcon = makeIcon(shield_default);
  var ShieldEffect = new Effect(
    "Shield",
    "turnStart",
    (g) => {
      const check = (message, who, interrupt, after, isStillValid) => {
        const shield = g.getActions(who).filter((a) => isCastSpell(a, Shield) && checkConfig(g, a, {}));
        if (!shield.length)
          return;
        interrupt.add(
          new PickFromListChoice(
            who,
            Shield,
            "Shield",
            `${message} Cast Shield as a reaction?`,
            Priority_default.Late,
            shield.map((value) => ({ value, label: value.name })),
            async (action) => {
              await g.act(action, {});
              if (after)
                await after();
            },
            true,
            isStillValid
          )
        );
      };
      g.events.on("Attack", ({ detail }) => {
        const { target, who } = detail.pre;
        if (!target.hasEffect(ShieldEffect))
          check(
            `${who.name} hit ${target.name} with an attack.`,
            target,
            detail.interrupt,
            async () => {
              const ac = await g.getAC(target, detail.pre);
              detail.ac = ac;
            },
            () => detail.outcome.hits
          );
      });
      g.events.on(
        "SpellCast",
        ({ detail: { who, spell, affected, interrupt } }) => {
          if (spell !== MagicMissile_default)
            return;
          for (const target of affected) {
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
    { icon: ShieldIcon, tags: ["magic"] }
  );
  var Shield = simpleSpell({
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
    ...affectsSelf,
    async apply({ caster }) {
      await caster.addEffect(ShieldEffect, { duration: 1 });
    }
  });
  var Shield_default = Shield;

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
    { icon: ShieldOfFaithIcon, tags: ["magic"] }
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
    ...targetsOne(60, []),
    async apply({ caster }, { target }) {
      await target.addEffect(
        ShieldOfFaithEffect,
        { duration: minutes(10) },
        caster
      );
      caster.concentrateOn({
        spell: ShieldOfFaith,
        duration: minutes(10),
        onSpellEnd: () => target.removeEffect(ShieldOfFaithEffect)
      });
    }
  });
  var ShieldOfFaith_default = ShieldOfFaith;

  // src/spells/level1/Sleep.ts
  var SlapAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Shake/Slap Awake",
        "implemented",
        {
          target: new TargetResolver(g, actor.reach, [
            hasEffect(SleepEffect, "sleeping", "not sleeping")
          ])
        },
        {
          description: `Shaking or slapping the sleeper will awaken them.`,
          time: "action"
        }
      );
    }
    async applyEffect({ target }) {
      await target.removeEffect(SleepEffect);
    }
  };
  var SleepEffect = new Effect(
    "Sleep",
    "turnStart",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(SleepEffect))
          conditions.add("Unconscious", SleepEffect);
      });
      g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(SleepEffect))
          interrupt.add(
            new EvaluateLater(
              who,
              SleepEffect,
              Priority_default.Normal,
              () => who.removeEffect(SleepEffect)
            )
          );
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        for (const target of g.combatants) {
          if (!target.hasEffect(SleepEffect))
            continue;
          if (distance(who, target) <= 5) {
            actions.push(new SlapAction(g, who));
            return;
          }
        }
      });
    },
    { tags: ["magic", "sleep"] }
  );
  var getSleepArea = (centre) => ({
    type: "sphere",
    centre,
    radius: 20
  });
  var Sleep = scalingSpell({
    status: "implemented",
    name: "Sleep",
    level: 1,
    school: "Enchantment",
    v: true,
    s: true,
    m: "a pinch of fine sand, rose petals, or a cricket",
    lists: ["Bard", "Sorcerer", "Wizard"],
    description: `This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. Creatures within 20 feet of a point you choose within range are affected in ascending order of their current hit points (ignoring unconscious creatures).

  Starting with the creature that has the lowest current hit points, each creature affected by this spell falls unconscious until the spell ends, the sleeper takes damage, or someone uses an action to shake or slap the sleeper awake. Subtract each creature's hit points from the total before moving on to the creature with the next lowest hit points. A creature's hit points must be equal to or less than the remaining total for that creature to be affected.
  
  Undead and creatures immune to being charmed aren't affected by this spell.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, roll an additional 2d8 for each slot level above 1st.`,
    isHarmful: true,
    ...affectsByPoint(90, getSleepArea),
    getAffected: (g, caster, { point }) => g.getInside(getSleepArea(point)).filter((co) => !co.conditions.has("Unconscious")),
    async apply({ g, caster, affected }, { slot }) {
      const dice = 3 + slot * 2;
      let affectedHp = await g.rollMany(dice, {
        type: "other",
        source: Sleep,
        who: caster,
        size: 8
      });
      for (const target of affected.sort((a, b) => a.hp - b.hp)) {
        if (target.hp > affectedHp)
          return;
        if (target.type === "undead") {
          g.text(
            new MessageBuilder().co(target).text(" is immune to sleep effects.")
          );
          continue;
        }
        affectedHp -= target.hp;
        const success = await target.addEffect(
          SleepEffect,
          { conditions: coSet("Charmed", "Unconscious"), duration: minutes(1) },
          caster
        );
        if (success)
          await target.addEffect(Prone, { duration: Infinity }, caster);
      }
    }
  });
  var Sleep_default = Sleep;

  // src/spells/level1/Thunderwave.ts
  var Thunderwave = scalingSpell({
    status: "implemented",
    name: "Thunderwave",
    level: 1,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Bard", "Druid", "Sorcerer", "Wizard"],
    description: `A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed.

  In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet.
  
  At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.`,
    // TODO the spell says cube, but this makes no sense...
    ...affectsStaticArea((who) => ({ type: "within", who, radius: 5 })),
    ...requiresSave("con"),
    ...doesScalingDamage(1, 1, 8, "thunder"),
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { outcome, damageResponse } = await sh.save({
          who: target,
          ability: "con",
          tags: ["forced movement", "magic"]
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "thunder",
          target
        });
        if (outcome === "fail")
          await sh.g.forcePush(target, sh.caster, 10, Thunderwave);
      }
    }
  });
  var Thunderwave_default = Thunderwave;

  // src/img/spl/aid.svg
  var aid_default = "./aid-VU2LN2V3.svg";

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
    { icon: AidIcon, tags: ["magic"] }
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
    ...targetsMany(1, 3, 30, []),
    getConfig: (g) => ({ targets: new MultiTargetResolver(g, 1, 3, 30, []) }),
    async apply({ g, caster: actor }, { slot, targets }) {
      const amount = (slot - 1) * 5;
      const duration = hours(8);
      for (const target of targets) {
        if (await target.addEffect(AidEffect, { duration, amount }))
          await g.heal(Aid, amount, { actor, target, spell: Aid });
      }
    }
  });
  var Aid_default = Aid;

  // src/spells/level2/Barkskin.ts
  var BarkskinEffect = new Effect(
    "Barkskin",
    "turnEnd",
    (g) => {
      g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
        if (who.hasEffect(BarkskinEffect))
          methods.push({ name: "Barkskin", uses: /* @__PURE__ */ new Set(), ac: 16 });
      });
    },
    { tags: ["magic"] }
  );
  var Barkskin = simpleSpell({
    status: "implemented",
    name: "Barkskin",
    level: 2,
    school: "Transmutation",
    concentration: true,
    v: true,
    s: true,
    m: "a handful of oak bark",
    lists: ["Druid", "Ranger"],
    description: `You touch a willing creature. Until the spell ends, the target's skin has a rough, bark-like appearance, and the target's AC can't be less than 16, regardless of what kind of armor it is wearing.`,
    ...targetsByTouch([isAlly]),
    async apply({ caster }, { target }) {
      const duration = hours(1);
      if (await target.addEffect(BarkskinEffect, { duration }, caster))
        caster.concentrateOn({
          spell: Barkskin,
          duration,
          onSpellEnd: () => target.removeEffect(BarkskinEffect)
        });
    }
  });
  var Barkskin_default = Barkskin;

  // src/spells/level2/Blur.ts
  var BlurEffect = new Effect(
    "Blur",
    "turnStart",
    (g) => {
      g.events.on("BeforeAttack", ({ detail: { who, diceType } }) => {
        if (who.hasEffect(BlurEffect))
          diceType.add("disadvantage", BlurEffect);
      });
    },
    { tags: ["magic"] }
  );
  var Blur = simpleSpell({
    status: "incomplete",
    name: "Blur",
    level: 2,
    school: "Illusion",
    concentration: true,
    v: true,
    lists: ["Artificer", "Sorcerer", "Wizard"],
    description: `Your body becomes blurred, shifting and wavering to all who can see you. For the duration, any creature has disadvantage on attack rolls against you. An attacker is immune to this effect if it doesn't rely on sight, as with blindsight, or can see through illusions, as with truesight.`,
    ...affectsSelf,
    async apply({ caster }) {
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

  // src/spells/level2/Darkness.ts
  var Darkness = simpleSpell({
    name: "Darkness",
    level: 2,
    school: "Evocation",
    concentration: true,
    v: true,
    m: "bat fur and a drop of pitch or piece of coal",
    lists: ["Sorcerer", "Warlock", "Wizard"],
    description: `Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it.

  If the point you choose is on an object you are holding or one that isn't being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness.
  
  If any of this spell's area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.`,
    ...affectsByPoint(60, (centre) => ({ type: "sphere", centre, radius: 15 })),
    async apply() {
    }
  });
  var Darkness_default = Darkness;

  // src/spells/level2/EnlargeReduce.ts
  var EnlargeEffect = new Effect(
    "Enlarge",
    "turnStart",
    (g) => {
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
          if ((attacker == null ? void 0 : attacker.hasEffect(EnlargeEffect)) && weapon)
            interrupt.add(
              new EvaluateLater(
                attacker,
                EnlargeEffect,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(
                    1,
                    {
                      source: EnlargeEffect,
                      attacker,
                      size: 4,
                      tags: atSet("magical")
                    },
                    critical
                  );
                  bonus.add(amount, EnlargeEffect);
                }
              )
            );
        }
      );
    },
    { tags: ["magic"] }
  );
  var ReduceEffect = new Effect(
    "Reduce",
    "turnStart",
    (g) => {
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
          if ((attacker == null ? void 0 : attacker.hasEffect(ReduceEffect)) && weapon)
            interrupt.add(
              new EvaluateLater(
                attacker,
                ReduceEffect,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(
                    1,
                    {
                      source: ReduceEffect,
                      attacker,
                      size: 4,
                      tags: atSet("magical")
                    },
                    critical
                  );
                  bonus.add(-amount, ReduceEffect);
                }
              )
            );
        }
      );
    },
    { tags: ["magic"] }
  );
  function applySizeChange(size, change) {
    const newCategory = size + change;
    if (SizeCategory_default[newCategory])
      return newCategory;
    return void 0;
  }
  var EnlargeReduceController = class {
    constructor(caster, effect, config, target, sizeChange = effect === EnlargeEffect ? 1 : -1) {
      this.caster = caster;
      this.effect = effect;
      this.config = config;
      this.target = target;
      this.sizeChange = sizeChange;
      this.applied = false;
    }
    async apply() {
      const { effect, config, target, sizeChange } = this;
      if (!await target.addEffect(effect, config))
        return;
      const newSize = applySizeChange(target.size, sizeChange);
      if (newSize) {
        this.applied = true;
        target.size = newSize;
      }
      this.caster.concentrateOn({
        duration: config.duration,
        spell: EnlargeReduce,
        onSpellEnd: this.remove.bind(this)
      });
    }
    async remove() {
      if (this.applied) {
        const oldSize = applySizeChange(this.target.size, -this.sizeChange);
        if (oldSize)
          this.target.size = oldSize;
      }
      await this.target.removeEffect(this.effect);
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
    isHarmful: true,
    // TODO could be either
    description: `You cause a creature or an object you can see within range to grow larger or smaller for the duration. Choose either a creature or an object that is neither worn nor carried. If the target is unwilling, it can make a Constitution saving throw. On a success, the spell has no effect.

  If the target is a creature, everything it is wearing and carrying changes size with it. Any item dropped by an affected creature returns to normal size at once.

  - Enlarge. The target's size doubles in all dimensions, and its weight is multiplied by eight. This growth increases its size by one category\u2014from Medium to Large, for example. If there isn't enough room for the target to double its size, the creature or object attains the maximum possible size in the space available. Until the spell ends, the target also has advantage on Strength checks and Strength saving throws. The target's weapons also grow to match its new size. While these weapons are enlarged, the target's attacks with them deal 1d4 extra damage.
  - Reduce. The target's size is halved in all dimensions, and its weight is reduced to one-eighth of normal. This reduction decreases its size by one category\u2014from Medium to Small, for example. Until the spell ends, the target also has disadvantage on Strength checks and Strength saving throws. The target's weapons also shrink to match its new size. While these weapons are reduced, the target's attacks with them deal 1d4 less damage (this can't reduce the damage below 1).`,
    ...targetsOne(30, [canSee]),
    getConfig: (g) => ({
      target: new TargetResolver(g, 30, [canSee]),
      mode: new ChoiceResolver(g, "Effect", [
        makeStringChoice("enlarge"),
        makeStringChoice("reduce")
      ])
    }),
    async apply({ g, caster, method }, { mode, target }) {
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
          config,
          tags: ["magic"]
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

  // src/spells/level2/GustOfWind.ts
  var GustOfWind = simpleSpell({
    name: "Gust of Wind",
    level: 2,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "a legume seed",
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `A line of strong wind 60 feet long and 10 feet wide blasts from you in a direction you choose for the spell's duration. Each creature that starts its turn in the line must succeed on a Strength saving throw or be pushed 15 feet away from you in a direction following the line.

  Any creature in the line must spend 2 feet of movement for every 1 foot it moves when moving closer to you.

  The gust disperses gas or vapor, and it extinguishes candles, torches, and similar unprotected flames in the area. It causes protected flames, such as those of lanterns, to dance wildly and has a 50 percent chance to extinguish them.

  As a bonus action on each of your turns before the spell ends, you can change the direction in which the line blasts from you.`,
    ...affectsLine(60, 10),
    async apply() {
    }
  });
  var GustOfWind_default = GustOfWind;

  // src/spells/level2/HoldPerson.ts
  var getHoldPersonSave = (who, config) => ({
    source: HoldPersonEffect,
    type: config.method.getSaveType(config.caster, HoldPerson),
    who,
    attacker: config.caster,
    ability: "wis",
    spell: HoldPerson,
    effect: HoldPersonEffect,
    config,
    tags: ["magic", "impedes movement"]
  });
  var HoldPersonEffect = new Effect(
    "Hold Person",
    "turnStart",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(HoldPersonEffect))
          conditions.add("Paralyzed", HoldPersonEffect);
      });
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        const config = who.getEffectConfig(HoldPersonEffect);
        if (config) {
          interrupt.add(
            new EvaluateLater(
              who,
              HoldPersonEffect,
              Priority_default.Normal,
              async () => {
                const { outcome } = await g.save(getHoldPersonSave(who, config));
                if (outcome === "success")
                  await who.removeEffect(HoldPersonEffect);
              }
            )
          );
        }
      });
      g.events.on(
        "EffectRemoved",
        ({ detail: { effect, config, who, interrupt } }) => {
          if (effect === HoldPersonEffect) {
            const { affected, caster } = config;
            affected.delete(who);
            if (affected.size < 1)
              interrupt.add(
                new EvaluateLater(
                  caster,
                  HoldPerson,
                  Priority_default.Normal,
                  () => caster.endConcentration(HoldPerson)
                )
              );
          }
        }
      );
    },
    { tags: ["magic"] }
  );
  var HoldPerson = scalingSpell({
    status: "implemented",
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
    ...targetsMany(1, 1, 60, [canSee, ofCreatureType("humanoid")]),
    ...requiresSave("wis"),
    getConfig: (g, actor, method, { slot }) => ({
      targets: new MultiTargetResolver(
        g,
        1,
        (slot != null ? slot : 2) - 1,
        60,
        [canSee, ofCreatureType("humanoid")],
        [withinRangeOfEachOther(30)]
      )
    }),
    async apply(sh) {
      const mse = sh.getMultiSave({
        ability: "wis",
        effect: HoldPersonEffect,
        duration: minutes(1),
        tags: ["impedes movement"]
      });
      if (await mse.apply({}))
        await mse.concentrate();
    }
  });
  var HoldPerson_default = HoldPerson;

  // src/spells/level2/LesserRestoration.ts
  var validConditions = coSet("Blinded", "Deafened", "Paralyzed", "Poisoned");
  var LesserRestoration = simpleSpell({
    status: "implemented",
    name: "Lesser Restoration",
    level: 2,
    school: "Abjuration",
    v: true,
    s: true,
    lists: ["Artificer", "Bard", "Cleric", "Druid", "Paladin", "Ranger"],
    description: `You touch a creature and can end either one disease or one condition afflicting it. The condition can be blinded, deafened, paralyzed, or poisoned.`,
    ...targetsByTouch([]),
    getConfig: (g, caster, method, { target }) => ({
      target: new TargetResolver(g, caster.reach, []),
      effect: new ChoiceResolver(
        g,
        "Effect",
        (target == null ? void 0 : target.effects) ? Array.from(target.effects).filter(
          ([type, config]) => type.tags.has("disease") || config.conditions && intersects(config.conditions, validConditions)
        ).map(([value]) => makeChoice(value, value.name)) : []
      )
    }),
    check(g, { effect, target }, ec) {
      if (target && effect && !target.hasEffect(effect))
        ec.add("target does not have chosen effect", LesserRestoration);
      return ec;
    },
    async apply(sh, { target, effect }) {
      await target.removeEffect(effect);
    }
  });
  var LesserRestoration_default = LesserRestoration;

  // src/img/spl/levitate.svg
  var levitate_default = "./levitate-D7OCXBJW.svg";

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
    ...targetsOne(60, [canSee]),
    ...requiresSave("con"),
    async apply() {
    }
  });
  var Levitate_default = Levitate;

  // src/img/spl/magic-weapon.svg
  var magic_weapon_default = "./magic-weapon-BBCY6MMC.svg";

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
        const { item, oldName, oldColour, bag } = this;
        item.magical = false;
        item.name = oldName;
        if (item.icon)
          item.icon.colour = oldColour;
        bag.cleanup();
        const msg = new MessageBuilder();
        if (item.possessor)
          msg.co(item.possessor).nosp().text("'s ");
        this.g.text(msg.it(this.item).text(" loses its shine."));
      };
      var _a;
      const handler = getWeaponPlusHandler(item, bonus, MagicWeapon);
      this.bag = new SubscriptionBag(
        g.events.on("BeforeAttack", handler),
        g.events.on("GatherDamage", handler)
      );
      this.oldName = item.name;
      this.oldColour = (_a = item.icon) == null ? void 0 : _a.colour;
      item.magical = true;
      item.name = `${item.name} (Magic Weapon +${bonus})`;
      if (item.icon)
        item.icon.colour = "purple";
      g.text(
        new MessageBuilder().co(caster).nosp().text("'s ").it(item).text(" shines with magical light.")
      );
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
    ...affectsSelf,
    getConfig: (g, caster) => ({
      item: new ChoiceResolver(
        g,
        "Weapon",
        caster.weapons.filter((w) => !w.magical && w.category !== "natural").map((value) => makeChoice(value, value.name))
      )
    }),
    async apply({ g, caster }, { slot, item }) {
      const controller = new MagicWeaponController(g, caster, slot, item);
      caster.concentrateOn({
        duration: hours(1),
        spell: MagicWeapon,
        onSpellEnd: controller.onSpellEnd
      });
    }
  });
  var MagicWeapon_default = MagicWeapon;

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
    ...affectsSelf,
    async apply() {
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
    ...affectsSelf,
    getConfig: (g) => ({ point: new PointResolver(g, 30) }),
    async apply({ g, caster }, { point }) {
      await g.move(caster, point, getTeleportation(30, "Misty Step"));
    }
  });
  var MistyStep_default = MistyStep;

  // src/img/spl/moonbeam.svg
  var moonbeam_default = "./moonbeam-6R5LN2M5.svg";

  // src/OncePerTurnController.ts
  var OncePerTurnController = class {
    constructor(g) {
      this.g = g;
      this.affected = /* @__PURE__ */ new Set();
      g.events.on("TurnStarted", () => this.affected.clear());
    }
    canBeAffected(who) {
      return !this.affected.has(who);
    }
    affect(who) {
      this.affected.add(who);
    }
  };

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
  var getMoonbeamDamage = (slot) => _dd(slot, 10, "radiant");
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
          description: `On each of your turns after you cast this spell, you can use an action to move the beam up to 60 feet in any direction.`,
          tags: ["harmful"]
          // TODO spell?
        }
      );
      this.controller = controller;
    }
    // TODO generateAttackConfigs
    getAffectedArea({ point }) {
      if (point)
        return [getMoonbeamArea(point)];
    }
    getDamage({ point }) {
      return point && [getMoonbeamDamage(this.controller.slot)];
    }
    getTargets() {
      return [];
    }
    getAffected({ point }) {
      return this.g.getInside(getMoonbeamArea(point));
    }
    async applyEffect({ point }) {
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
        this.bag.cleanup();
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
      this.opt = new OncePerTurnController(g);
      this.bag = new SubscriptionBag(
        g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
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
      this.bag.add(
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === this.caster && this.hasBeenATurn)
            actions.push(new MoveMoonbeamAction(g, this));
        })
      );
    }
    getDamager(target) {
      const { opt, g, slot, caster: attacker, method } = this;
      return new EvaluateLater(target, Moonbeam, Priority_default.Normal, async () => {
        if (!opt.canBeAffected(target))
          return;
        opt.affect(target);
        const {
          amount: { count, size },
          damageType
        } = getMoonbeamDamage(slot);
        const damage = await g.rollDamage(count, {
          attacker,
          damageType,
          method,
          size,
          source: Moonbeam,
          spell: Moonbeam,
          target,
          tags: atSet("magical", "spell")
        });
        const { damageResponse } = await g.save({
          source: Moonbeam,
          type: method.getSaveType(attacker, Moonbeam),
          ability: "con",
          attacker,
          method,
          spell: Moonbeam,
          who: target,
          tags: ["magic"],
          diceType: target.tags.has("shapechanger") ? "disadvantage" : "normal"
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
    // TODO: generateAttackConfigs
    ...affectsByPoint(120, getMoonbeamArea, false),
    ...requiresSave("con"),
    ...doesScalingDamage(2, 0, 10, "radiant"),
    async apply({ g, caster, method }, { point, slot }) {
      const controller = new MoonbeamController(g, caster, method, point, slot);
      caster.concentrateOn({
        duration: minutes(1),
        spell: Moonbeam,
        onSpellEnd: controller.onSpellEnd
      });
    }
  });
  var Moonbeam_default = Moonbeam;

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
        this.bag.cleanup();
      };
      this.bag = new SubscriptionBag(
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
          if (isCastSpell(action) && action.spell.v)
            error.add("silenced", Silence);
        })
      );
      g.addEffectArea(area);
    }
    entirelyContains(who) {
      const squares = getSquares(who, who.position);
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
    isHarmful: true,
    // TODO is it?
    description: `For the duration, no sound can be created within or pass through a 20-foot-radius sphere centered on a point you choose within range. Any creature or object entirely inside the sphere is immune to thunder damage, and creatures are deafened while entirely inside it. Casting a spell that includes a verbal component is impossible there.`,
    ...affectsByPoint(120, getSilenceArea),
    async apply({ g, caster }, { point }) {
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
    ...targetsByTouch([isAlly]),
    async apply() {
    }
  });
  var SpiderClimb_default = SpiderClimb;

  // src/img/spl/spike-growth.svg
  var spike_growth_default = "./spike-growth-DJJYBBWC.svg";

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
    isHarmful: true,
    description: `The ground in a 20-foot radius centered on a point within range twists and sprouts hard spikes and thorns. The area becomes difficult terrain for the duration. When a creature moves into or within the area, it takes 2d4 piercing damage for every 5 feet it travels.

  The transformation of the ground is camouflaged to look natural. Any creature that can't see the area at the time the spell is cast must make a Wisdom (Perception) check against your spell save DC to recognize the terrain as hazardous before entering it.`,
    ...affectsByPoint(150, (centre) => ({ type: "sphere", centre, radius: 20 })),
    async apply({ g, caster: attacker, method, affectedArea }) {
      const area = new ActiveEffectArea(
        "Spike Growth",
        affectedArea[0],
        arSet("difficult terrain", "plants"),
        "green",
        ({ detail: { where, difficult } }) => {
          if (area.points.has(where))
            difficult.add("magical plants", SpikeGrowth);
        }
      );
      g.addEffectArea(area);
      const unsubscribe = g.events.on(
        "CombatantMoved",
        ({ detail: { who, position, interrupt } }) => {
          const squares = getSquares(who, position);
          if (area.points.overlaps(squares))
            interrupt.add(
              new EvaluateLater(who, SpikeGrowth, Priority_default.Late, async () => {
                const amount = await g.rollDamage(2, {
                  source: SpikeGrowth,
                  attacker,
                  target: who,
                  size: 4,
                  damageType: "piercing",
                  spell: SpikeGrowth,
                  method,
                  tags: atSet("magical", "spell")
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

  // src/img/spl/web.svg
  var web_default = "./web-NVOWX3M5.svg";

  // src/spells/level2/Web.ts
  var WebIcon = makeIcon(web_default);
  var BreakFreeFromWebAction = class extends AbstractSelfAction {
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
          description: `Make a Strength check to break free of the webs.`,
          tags: ["escape move prevention"]
        }
      );
      this.caster = caster;
      this.method = method;
    }
    async applyEffect() {
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
    { icon: WebIcon, tags: ["magic"] }
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
      "white",
      ({ detail: { where, difficult } }) => {
        if (area.points.has(where))
          difficult.add("magical webs", Web);
      }
    )) {
      this.g = g;
      this.caster = caster;
      this.method = method;
      this.centre = centre;
      this.shape = shape;
      this.area = area;
      this.onSpellEnd = async () => {
        this.g.removeEffectArea(this.area);
        this.bag.cleanup();
        for (const who of this.g.combatants) {
          if (who.hasEffect(Webbed))
            await who.removeEffect(Webbed);
        }
      };
      g.addEffectArea(area);
      this.affectedThisTurn = /* @__PURE__ */ new Set();
      this.bag = new SubscriptionBag(
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
      return new EvaluateLater(target, Web, Priority_default.Late, async () => {
        if (this.affectedThisTurn.has(target))
          return;
        this.affectedThisTurn.add(target);
        const effect = Webbed;
        const config = {
          caster,
          method,
          duration: minutes(1),
          conditions: coSet("Restrained")
        };
        const { outcome } = await g.save({
          source: Web,
          type: this.method.getSaveType(this.caster, Web),
          ability: "dex",
          attacker: caster,
          method,
          spell: Web,
          effect,
          config,
          who: target,
          tags: ["magic", "impedes movement"]
        });
        if (outcome === "fail")
          await target.addEffect(effect, config);
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
    ...affectsByPoint(60, getWebArea),
    ...requiresSave("dex"),
    async apply({ g, caster, method }, { point }) {
      const controller = new WebController(g, caster, method, point);
      caster.concentrateOn({
        spell: Web,
        duration: hours(1),
        onSpellEnd: controller.onSpellEnd
      });
    }
  });
  var Web_default = Web;

  // src/resolvers/FakeResolver.ts
  var FakeResolver = class {
    constructor(name) {
      this.name = name;
      this.type = "FAKE";
    }
    check(value, action, ec) {
      if (!value)
        ec.add("blank", this);
      return ec;
    }
  };

  // src/spells/level3/Counterspell.ts
  var CounterspellIcon = makeIcon(counterspell_default);
  var Counterspell = scalingSpell({
    status: "implemented",
    name: "Counterspell",
    icon: CounterspellIcon,
    level: 3,
    school: "Abjuration",
    time: "reaction",
    s: true,
    lists: ["Sorcerer", "Warlock", "Wizard"],
    description: `You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect.

At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is less than or equal to the level of the spell slot you used.`,
    ...targetsOne(60, [canSee]),
    getConfig: (g) => ({
      target: new TargetResolver(g, 60, [canSee]),
      spell: new FakeResolver("spell"),
      success: new FakeResolver("success")
    }),
    async apply({ g, caster: who, method }, { slot, spell, success }) {
      var _a;
      if (spell.level > slot) {
        const { outcome } = await g.abilityCheck(10 + spell.level, {
          who,
          ability: (_a = method.ability) != null ? _a : "int",
          tags: chSet("counterspell")
        });
        if (outcome === "fail")
          return;
      }
      success.add("fail", Counterspell);
    }
  });
  var Counterspell_default = Counterspell;
  var isCounterspell = getSpellChecker(Counterspell);
  new DndRule("Counterspell", (g) => {
    g.events.on(
      "SpellCast",
      ({ detail: { who: caster, success, interrupt, spell } }) => {
        const others = Array.from(g.combatants).filter(
          (other) => other !== caster && other.hasTime("reaction")
        );
        for (const who of others) {
          const choices = g.getActions(who).filter(isCounterspell).flatMap(
            (action) => {
              var _a, _b, _c, _d, _e, _f;
              return enumerate(
                (_c = (_b = (_a = action.method).getMinSlot) == null ? void 0 : _b.call(_a, Counterspell, caster)) != null ? _c : 3,
                (_f = (_e = (_d = action.method).getMaxSlot) == null ? void 0 : _e.call(_d, Counterspell, caster)) != null ? _f : 3
              ).map((slot) => ({ slot, target: caster, success, spell })).map(
                (config) => makeChoice(
                  { action, config },
                  `cast Counterspell at level ${config.slot}`,
                  !checkConfig(g, action, config)
                )
              );
            }
          );
          if (choices.length)
            interrupt.add(
              new PickFromListChoice(
                who,
                Counterspell,
                "Counterspell",
                `${caster.name} is casting a spell. Should ${who.name} cast Counterspell as a reaction?`,
                Priority_default.ChangesOutcome,
                choices,
                async ({ action, config }) => g.act(action, config),
                true
              )
            );
        }
      }
    );
  });

  // src/img/spl/erupting-earth.svg
  var erupting_earth_default = "./erupting-earth-NXLBYZTL.svg";

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
    // TODO: generateAttackConfigs
    ...affectsByPoint(120, (centre) => ({ type: "cube", centre, length: 20 })),
    ...requiresSave("dex"),
    ...doesScalingDamage(3, 0, 12, "bludgeoning"),
    async apply(sh, { point }) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { damageResponse } = await sh.save({
          ability: "dex",
          who: target
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "bludgeoning",
          target
        });
      }
      const area = new ActiveEffectArea(
        "Erupting Earth",
        getEruptingEarthArea(point),
        arSet("difficult terrain"),
        "brown",
        ({ detail: { where, difficult } }) => {
          if (area.points.has(where))
            difficult.add("rubble", EruptingEarth);
        }
      );
      sh.g.addEffectArea(area);
    }
  });
  var EruptingEarth_default = EruptingEarth;

  // src/img/spl/fireball.svg
  var fireball_default = "./fireball-PYMKNPCJ.svg";

  // src/spells/level3/Fireball.ts
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
    // TODO: generateAttackConfigs
    ...affectsByPoint(150, (centre) => ({ type: "sphere", centre, radius: 20 })),
    ...requiresSave("dex"),
    ...doesScalingDamage(3, 5, 6, "fire"),
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { damageResponse } = await sh.save({
          ability: "dex",
          who: target
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "fire",
          target
        });
      }
    }
  });
  var Fireball_default = Fireball;

  // src/spells/level3/IntellectFortress.ts
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
        if (who.hasEffect(IntellectFortressEffect) && isA(ability, MentalAbilities))
          diceType.add("advantage", IntellectFortressEffect);
      });
    },
    { tags: ["magic"] }
  );
  var IntellectFortress = scalingSpell({
    status: "implemented",
    name: "Intellect Fortress",
    level: 3,
    school: "Abjuration",
    concentration: true,
    v: true,
    lists: ["Artificer", "Bard", "Sorcerer", "Warlock", "Wizard"],
    description: `For the duration, you or one willing creature you can see within range has resistance to psychic damage, as well as advantage on Intelligence, Wisdom, and Charisma saving throws.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, you can target one additional creature for each slot level above 3rd. The creatures must be within 30 feet of each other when you target them.`,
    ...targetsMany(1, 1, 30, [canSee]),
    getConfig: (g, caster, method, { slot }) => ({
      targets: new MultiTargetResolver(
        g,
        1,
        (slot != null ? slot : 3) - 2,
        30,
        [canSee],
        [withinRangeOfEachOther(30)]
      )
    }),
    async apply({ caster }, { targets }) {
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

  // src/img/spl/lightning-bolt.svg
  var lightning_bolt_default = "./lightning-bolt-OXAGJ6WI.svg";

  // src/spells/level3/LightningBolt.ts
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
    // TODO: generateAttackConfigs
    ...affectsLine(100, 5),
    ...requiresSave("dex"),
    ...doesScalingDamage(3, 5, 6, "lightning"),
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { damageResponse } = await sh.save({
          ability: "dex",
          who: target
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "lightning",
          target
        });
      }
    }
  });
  var LightningBolt_default = LightningBolt;

  // src/spells/level3/MassHealingWord.ts
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
    ...targetsMany(1, 6, 60, [canSee, notOfCreatureType("undead", "construct")]),
    generateHealingConfigs: ({ allTargets, caster }) => combinationsMulti(
      allTargets.filter((co) => co.side === caster.side),
      1,
      6
    ).map((targets) => ({
      config: { targets },
      positioning: new Set(targets.map((target) => poWithin(60, target)))
    })),
    getHeal: (g, caster, method, { slot }) => [
      { type: "dice", amount: { count: (slot != null ? slot : 3) - 2, size: 4 } },
      {
        type: "flat",
        amount: method.ability ? caster[method.ability].modifier : 0
      }
    ],
    async apply(sh, { targets }) {
      const amount = await sh.rollHeal();
      for (const target of targets) {
        if (cannotHealConventionally.has(target.type))
          continue;
        await sh.heal({ amount, target });
      }
    }
  });
  var MassHealingWord_default = MassHealingWord;

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
    getTargets: () => [],
    getAffected: (g, caster) => [caster],
    async apply() {
    }
  });
  var MeldIntoStone_default = MeldIntoStone;

  // src/img/spl/melfs-minute-meteors.svg
  var melfs_minute_meteors_default = "./melfs-minute-meteors-CBOYR77A.svg";

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
          if (distanceTo(action.actor, point) > this.maxRange)
            ec.add(`(${describePoint(point)}): Out of range`, this);
        }
      }
      return ec;
    }
  };

  // src/spells/level3/MelfsMinuteMeteors.ts
  var MMMIcon = makeIcon(melfs_minute_meteors_default, DamageColours.fire);
  var MMMResource = new TemporaryResource("Melf's Minute Meteors", 6);
  async function fireMeteors(g, attacker, method, points, spendMeteors = true) {
    if (spendMeteors)
      attacker.spendResource(MMMResource, points.length);
    const damage = await g.rollDamage(2, {
      source: MelfsMinuteMeteors,
      attacker,
      size: 6,
      spell: MelfsMinuteMeteors,
      method,
      damageType: "fire",
      tags: atSet("magical", "spell")
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
          who: target,
          tags: ["magic"]
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
    if (spendMeteors && attacker.getResource(MMMResource) <= 0)
      await attacker.endConcentration(MelfsMinuteMeteors);
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
            Math.min(2, (_a = actor.resources.get(MMMResource.name)) != null ? _a : 2),
            120
          )
        },
        {
          icon: MMMIcon,
          time: "bonus action",
          damage: [_dd(2, 6, "fire")],
          description: `You can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.`,
          tags: ["harmful"]
          // TODO spell?
        }
      );
      this.method = method;
    }
    // TODO: generateAttackConfigs
    getAffectedArea({ points }) {
      if (points)
        return points.map(
          (centre) => ({ type: "sphere", centre, radius: 5 })
        );
    }
    getDamage() {
      return [_dd(2, 6, "fire")];
    }
    getResources({ points }) {
      var _a;
      return /* @__PURE__ */ new Map([[MMMResource, (_a = points == null ? void 0 : points.length) != null ? _a : 1]]);
    }
    getTargets() {
      return [];
    }
    getAffected(config) {
      var _a, _b;
      return (_b = (_a = this.getAffectedArea(config)) == null ? void 0 : _a.flatMap((area) => this.g.getInside(area))) != null ? _b : [];
    }
    async applyEffect({ points }) {
      return fireMeteors(this.g, this.actor, this.method, points, false);
    }
  };
  var MelfsMinuteMeteors = scalingSpell({
    status: "implemented",
    name: "Melf's Minute Meteors",
    icon: MMMIcon,
    level: 3,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "niter, sulfur, and pine tar formed into a bead",
    lists: ["Sorcerer", "Wizard"],
    description: `You create six tiny meteors in your space. They float in the air and orbit you for the spell's duration. When you cast the spell\u2014and as a bonus action on each of your turns thereafter\u2014you can expend one or two of the meteors, sending them streaking toward a point or points you choose within 120 feet of you. Once a meteor reaches its destination or impacts against a solid surface, the meteor explodes. Each creature within 5 feet of the point where the meteor explodes must make a Dexterity saving throw. A creature takes 2d6 fire damage on a failed save, or half as much damage on a successful one.

  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the number of meteors created increases by two for each slot level above 3rd.`,
    // TODO: generateAttackConfigs
    getConfig: (g) => ({
      points: new MultiPointResolver(g, 1, 2, 120)
    }),
    getAffectedArea: (g, caster, { points }) => points && points.map((centre) => ({ type: "sphere", centre, radius: 5 })),
    getTargets: () => [],
    getAffected: (g, caster, { points }) => points.flatMap(
      (centre) => g.getInside({ type: "sphere", centre, radius: 5 })
    ),
    getDamage: () => [_dd(2, 6, "fire")],
    async apply({ g, caster, method }, { points, slot }) {
      const meteors = slot * 2;
      caster.initResource(MMMResource, meteors);
      g.text(
        new MessageBuilder().co(caster).text(` summons ${meteors} tiny meteors.`)
      );
      await fireMeteors(g, caster, method, points);
      let meteorActionEnabled = false;
      const removeMeteorAction = g.events.on(
        "GetActions",
        ({ detail: { who, actions } }) => {
          if (who === caster && meteorActionEnabled)
            actions.push(new FireMeteorsAction(g, caster, method));
        }
      );
      const removeTurnListener = g.events.on(
        "TurnEnded",
        ({ detail: { who } }) => {
          if (who === caster) {
            meteorActionEnabled = true;
            removeTurnListener();
          }
        }
      );
      await caster.concentrateOn({
        spell: MelfsMinuteMeteors,
        duration: minutes(10),
        async onSpellEnd() {
          removeMeteorAction();
          removeTurnListener();
          caster.removeResource(MMMResource);
        }
      });
    }
  });
  var MelfsMinuteMeteors_default = MelfsMinuteMeteors;

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
    isHarmful: true,
    description: `Until the spell ends, freezing rain and sleet fall in a 20-foot-tall cylinder with a 40-foot radius centered on a point you choose within range. The area is heavily obscured, and exposed flames in the area are doused.

  The ground in the area is covered with slick ice, making it difficult terrain. When a creature enters the spell's area for the first time on a turn or starts its turn there, it must make a Dexterity saving throw. On a failed save, it falls prone.

  If a creature starts its turn in the spell's area and is concentrating on a spell, the creature must make a successful Constitution saving throw against your spell save DC or lose concentration.`,
    ...affectsByPoint(150, (centre) => ({
      type: "cylinder",
      centre,
      radius: 40,
      height: 20
    })),
    ...requiresSave("dex"),
    // TODO: generateAttackConfigs
    async apply() {
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
    isHarmful: true,
    description: `You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must succeed on a Wisdom saving throw or be affected by this spell for the duration.

  An affected target's speed is halved, it takes a \u22122 penalty to AC and Dexterity saving throws, and it can't use reactions. On its turn, it can use either an action or a bonus action, not both. Regardless of the creature's abilities or magic items, it can't make more than one melee or ranged attack during its turn.

  If the creature attempts to cast a spell with a casting time of 1 action, roll a d20. On an 11 or higher, the spell doesn't take effect until the creature's next turn, and the creature must use its action on that turn to complete the spell. If it can't, the spell is wasted.

  A creature affected by this spell makes another Wisdom saving throw at the end of each of its turns. On a successful save, the effect ends for it.`,
    ...targetsMany(1, 6, 120, []),
    ...requiresSave("wis"),
    check(g, config, ec) {
      return ec;
    },
    async apply() {
    }
  });
  var Slow_default = Slow;

  // src/spells/level3/SpiritGuardians.ts
  var getSpiritGuardiansArea = (who) => ({
    type: "within",
    who,
    radius: 15
  });
  var isEvil = (who) => who.alignGE === "Evil";
  var getSpiritGuardiansDamage = (caster, slot) => _dd(slot, 8, isEvil(caster) ? "necrotic" : "radiant");
  function* getSpiritGuardianAuras(g, who) {
    for (const other of g.combatants) {
      const config = other.getEffectConfig(SpiritGuardiansEffect);
      if (config && !config.immune.has(who) && other !== who && // not strictly true, but...
      config.aura.isAffecting(who) && config.opt.canBeAffected(who))
        yield config;
    }
  }
  var SpiritGuardiansEffect = new Effect(
    "Spirit Guardians",
    "turnStart",
    (g) => {
      g.events.on("GetSpeed", ({ detail: { who, multiplier } }) => {
        for (const _ of getSpiritGuardianAuras(g, who))
          multiplier.add("half", SpiritGuardiansEffect);
      });
      g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
        for (const config of getSpiritGuardianAuras(g, who)) {
          interrupt.add(getAuraDamager(who, config));
        }
      });
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        for (const config of getSpiritGuardianAuras(g, who)) {
          interrupt.add(getAuraDamager(who, config));
        }
      });
      const getAuraDamager = (target, { opt, slot, caster: attacker, method }) => new EvaluateLater(
        target,
        SpiritGuardiansEffect,
        Priority_default.Normal,
        async () => {
          opt.affect(target);
          const {
            amount: { count, size },
            damageType
          } = getSpiritGuardiansDamage(attacker, slot);
          const damage = await g.rollDamage(count, {
            attacker,
            damageType,
            method,
            size,
            source: SpiritGuardiansEffect,
            spell: SpiritGuardians,
            tags: atSet("magical", "spell"),
            target
          });
          const { damageResponse } = await g.save({
            source: SpiritGuardiansEffect,
            type: method.getSaveType(attacker, SpiritGuardians, slot),
            attacker,
            who: target,
            ability: "con",
            spell: SpiritGuardians,
            method,
            tags: ["magic"]
          });
          await g.damage(
            SpiritGuardiansEffect,
            damageType,
            { attacker, spell: SpiritGuardians, method, target },
            [[damageType, damage]],
            damageResponse
          );
        }
      );
    },
    { tags: ["magic"] }
  );
  var SpiritGuardians = scalingSpell({
    status: "implemented",
    name: "Spirit Guardians",
    level: 3,
    school: "Conjuration",
    concentration: true,
    v: true,
    s: true,
    m: "a holy symbol",
    lists: ["Cleric"],
    description: `You call forth spirits to protect you. They flit around you to a distance of 15 feet for the duration. If you are good or neutral, their spectral form appears angelic or fey (your choice). If you are evil, they appear fiendish.

  When you cast this spell, you can designate any number of creatures you can see to be unaffected by it. An affected creature's speed is halved in the area, and when the creature enters the area for the first time on a turn or starts its turn there, it must make a Wisdom saving throw. On a failed save, the creature takes 3d8 radiant damage (if you are good or neutral) or 3d8 necrotic damage (if you are evil). On a successful save, the creature takes half as much damage.
  
  At Higher Levels. When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d8 for each slot level above 3rd.`,
    isHarmful: true,
    getConfig: (g) => ({
      targets: new MultiTargetResolver(g, 0, Infinity, Infinity, [canSee])
    }),
    getTargets: () => [],
    getAffectedArea: (_g, caster) => [getSpiritGuardiansArea(caster)],
    getAffected: (g, caster, { targets }) => g.getInside(getSpiritGuardiansArea(caster), targets),
    getDamage: (_g, caster, _method, { slot }) => [
      getSpiritGuardiansDamage(caster, slot != null ? slot : 3)
    ],
    async apply({ g, caster, method }, { slot, targets }) {
      const aura = new AuraController(
        g,
        "Spirit Guardians",
        caster,
        15,
        [isEvil(caster) ? "profane" : "holy"],
        isEvil(caster) ? "purple" : "yellow"
      ).setActiveChecker(
        (who) => who.hasEffect(SpiritGuardiansEffect) && who.isConcentratingOn(SpiritGuardians)
      );
      const duration = minutes(10);
      await caster.addEffect(SpiritGuardiansEffect, {
        aura,
        opt: new OncePerTurnController(g),
        duration,
        slot,
        caster,
        method,
        immune: new Set(targets)
      });
      await caster.concentrateOn({
        spell: SpiritGuardians,
        duration,
        async onSpellEnd() {
          await caster.removeEffect(SpiritGuardiansEffect);
          aura.destroy();
        }
      });
      aura.update();
    }
  });
  var SpiritGuardians_default = SpiritGuardians;

  // src/spells/level3/WallOfWater.ts
  var shapeChoices = [
    makeStringChoice("line"),
    makeStringChoice("ring")
  ];
  var WallOfWater = simpleSpell({
    name: "Wall of Water",
    level: 3,
    school: "Evocation",
    concentration: true,
    v: true,
    s: true,
    m: "a drop of water",
    lists: ["Druid", "Sorcerer", "Wizard"],
    description: `You create a wall of water on the ground at a point you can see within range. You can make the wall up to 30 feet long, 10 feet high, and 1 foot thick, or you can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall vanishes when the spell ends. The wall's space is difficult terrain.

  Any ranged weapon attack that enters the wall's space has disadvantage on the attack roll, and fire damage is halved if the fire effect passes through the wall to reach its target. Spells that deal cold damage that pass through the wall cause the area of the wall they pass through to freeze solid (at least a 5-foot-square section is frozen). Each 5-foot-square frozen section has AC 5 and 15 hit points. Reducing a frozen section to 0 hit points destroys it. When a section is destroyed, the wall's water doesn't fill it.`,
    getConfig: (g) => ({
      point: new PointResolver(g, 60),
      shape: new ChoiceResolver(g, "Shape", shapeChoices)
    }),
    getTargets: () => [],
    getAffected: () => [],
    async apply() {
    }
  });
  var WallOfWater_default = WallOfWater;

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
    ...targetsMany(1, 10, 30, [canSee]),
    async apply() {
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
    ...targetsMany(1, 10, 30, [canSee]),
    async apply() {
    }
  });
  var WaterWalk_default = WaterWalk;

  // src/spells/level4/CharmMonster.ts
  var CharmMonster = scalingSpell({
    status: "implemented",
    name: "Charm Monster",
    level: 4,
    icon: makeIcon(charm_monster_default),
    school: "Enchantment",
    v: true,
    s: true,
    lists: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
    isHarmful: true,
    description: `You attempt to charm a creature you can see within range. It must make a Wisdom saving throw, and it does so with advantage if you or your companions are fighting it. If it fails the saving throw, it is charmed by you until the spell ends or until you or your companions do anything harmful to it. The charmed creature is friendly to you. When the spell ends, the creature knows it was charmed by you.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, you can target one additional creature for each slot level above 4th. The creatures must be within 30 feet of each other when you target them.`,
    ...targetsMany(1, 1, 30, [canSee]),
    ...requiresSave("wis"),
    getConfig: (g, actor, method, { slot }) => ({
      targets: new MultiTargetResolver(
        g,
        1,
        (slot != null ? slot : 4) - 3,
        30,
        [canSee],
        [withinRangeOfEachOther(30)]
      )
    }),
    async apply({ g, caster, method }, { slot, targets }) {
      for (const target of targets) {
        const config = {
          conditions: coSet("Charmed"),
          duration: hours(1),
          by: caster
        };
        const { outcome } = await g.save({
          source: CharmMonster,
          type: method.getSaveType(caster, CharmMonster, slot),
          who: target,
          ability: "wis",
          attacker: caster,
          effect: Charmed,
          config,
          tags: ["charm", "magic"]
        });
        if (outcome === "fail")
          await target.addEffect(Charmed, config, caster);
      }
    }
  });
  var CharmMonster_default = CharmMonster;

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
    getAffected: () => [],
    async apply() {
    }
  });
  var ControlWater_default = ControlWater;

  // src/img/spl/fire-shield.svg
  var fire_shield_default = "./fire-shield-AE25WO5X.svg";

  // src/spells/level4/FireShield.ts
  var fireShieldTypeChoices = [
    makeStringChoice("warm"),
    makeStringChoice("chill")
  ];
  var DismissFireShield = class extends AbstractSelfAction {
    constructor(g, actor, effect) {
      super(
        g,
        actor,
        `Dismiss ${effect.name}`,
        "implemented",
        {},
        {
          icon: makeIcon(fire_shield_default, "silver"),
          time: "action",
          description: `You can dismiss the fire shield early as an action.`
        }
      );
      this.effect = effect;
    }
    async applyEffect() {
      await this.actor.removeEffect(this.effect);
    }
  };
  var makeFireShieldEffect = (type, resist, retaliate) => {
    const source = new Effect(
      `Fire Shield (${type})`,
      "turnStart",
      (g) => {
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who.hasEffect(source))
            actions.push(new DismissFireShield(g, who, source));
        });
        g.events.on(
          "GetDamageResponse",
          ({ detail: { who, damageType, response } }) => {
            const config = who.getEffectConfig(source);
            if (config && damageType === resist)
              response.add("resist", source);
          }
        );
        g.events.on("AfterAttack", ({ detail: { attack, interrupt, hit } }) => {
          const { tags, target, who } = attack.roll.type;
          const config = target.hasEffect(source);
          const inRange = distance(who, target) <= 5;
          const isMelee = tags.has("melee");
          if (config && inRange && isMelee && hit)
            interrupt.add(
              new EvaluateLater(target, source, Priority_default.Late, async () => {
                const rollDamage = await g.rollDamage(2, {
                  attacker: target,
                  damageType: retaliate,
                  size: 8,
                  source,
                  spell: FireShield,
                  tags: atSet("magical")
                });
                await g.damage(
                  source,
                  retaliate,
                  { attacker: target, spell: FireShield, target: who },
                  [[retaliate, rollDamage]]
                );
              })
            );
        });
      },
      { tags: ["magic"], icon: makeIcon(fire_shield_default, DamageColours[retaliate]) }
    );
    return source;
  };
  var WarmFireShieldEffect = makeFireShieldEffect("warm", "cold", "fire");
  var ChillFireShieldEffect = makeFireShieldEffect("chill", "fire", "cold");
  var FireShield = simpleSpell({
    status: "incomplete",
    name: "Fire Shield",
    level: 4,
    school: "Evocation",
    v: true,
    s: true,
    m: "a bit of phosphorus or a firefly",
    lists: ["Wizard"],
    description: `Thin and wispy flames wreathe your body for the duration, shedding bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell early by using an action to dismiss it.

The flames provide you with a warm shield or a chill shield, as you choose. The warm shield grants you resistance to cold damage, and the chill shield grants you resistance to fire damage.

In addition, whenever a creature within 5 feet of you hits you with a melee attack, the shield erupts with flame. The attacker takes 2d8 fire damage from a warm shield, or 2d8 cold damage from a cold shield.`,
    icon: makeIcon(fire_shield_default),
    ...affectsSelf,
    getConfig: (g) => ({
      type: new ChoiceResolver(g, "Type", fireShieldTypeChoices)
    }),
    async apply({ caster }, { type }) {
      await caster.addEffect(
        type === "chill" ? ChillFireShieldEffect : WarmFireShieldEffect,
        { duration: minutes(10) }
      );
    }
  });
  var FireShield_default = FireShield;

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
    ...targetsByTouch([isAlly]),
    async apply() {
    }
  });
  var FreedomOfMovement_default = FreedomOfMovement;

  // src/spells/level4/GuardianOfNature.ts
  var PrimalBeast = "Primal Beast";
  var GreatTree = "Great Tree";
  var FormChoices = [
    makeStringChoice(PrimalBeast),
    makeStringChoice(GreatTree)
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
          if ((attacker == null ? void 0 : attacker.hasEffect(PrimalBeastEffect)) && hasAll(attack == null ? void 0 : attack.roll.type.tags, ["melee", "weapon"]))
            interrupt.add(
              new EvaluateLater(
                attacker,
                PrimalBeastEffect,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(
                    1,
                    {
                      source: PrimalBeastEffect,
                      attacker,
                      target,
                      size: 6,
                      damageType: "force",
                      tags: atSet("magical")
                    },
                    critical
                  );
                  map.add("radiant", amount);
                }
              )
            );
        }
      );
    },
    { tags: ["magic", "shapechange"] }
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
      g.events.on("GetTerrain", ({ detail: { who, where, difficult } }) => {
        const trees = Array.from(g.combatants).filter(
          (other) => other.hasEffect(GreatTreeEffect)
        );
        for (const tree of trees) {
          if (who.side !== tree.side && distanceTo(tree, where) <= 15)
            difficult.add("magical plants", GreatTreeEffect);
        }
      });
    },
    { tags: ["magic", "shapechange"] }
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
    ...affectsSelf,
    getConfig: (g) => ({ form: new ChoiceResolver(g, "Form", FormChoices) }),
    async apply({ g, caster }, { form }) {
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

  // src/spells/level4/IceStorm.ts
  var IceStorm = scalingSpell({
    name: "Ice Storm",
    level: 4,
    school: "Evocation",
    v: true,
    s: true,
    m: "a pinch of dust and a few drops of water",
    lists: ["Druid", "Sorcerer", "Wizard"],
    isHarmful: true,
    description: `A hail of rock-hard ice pounds to the ground in a 20-foot-radius, 40-foot-high cylinder centered on a point within range. Each creature in the cylinder must make a Dexterity saving throw. A creature takes 2d8 bludgeoning damage and 4d6 cold damage on a failed save, or half as much damage on a successful one.

  Hailstones turn the storm's area of effect into difficult terrain until the end of your next turn.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the bludgeoning damage increases by 1d8 for each slot level above 4th.`,
    ...affectsByPoint(300, (centre) => ({
      type: "cylinder",
      centre,
      radius: 20,
      height: 40
    })),
    ...requiresSave("dex"),
    // TODO: generateAttackConfigs
    getDamage: (g, caster, method, { slot }) => [
      _dd((slot != null ? slot : 4) - 2, 8, "bludgeoning"),
      _dd(4, 6, "cold")
    ],
    async apply() {
    }
  });
  var IceStorm_default = IceStorm;

  // src/spells/level4/Stoneskin.ts
  var StoneskinEffect = new Effect(
    "Stoneskin",
    "turnStart",
    (g) => {
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response, attack } }) => {
          if (who.hasEffect(StoneskinEffect) && !(attack == null ? void 0 : attack.roll.type.tags.has("magical")) && isA(damageType, MundaneDamageTypes))
            response.add("resist", StoneskinEffect);
        }
      );
    },
    { tags: ["magic"] }
  );
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
    ...targetsByTouch([isAlly]),
    async apply({ caster }, { target }) {
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

  // src/img/spl/fire-wall.svg
  var fire_wall_default = "./fire-wall-4N3WP5XV.svg";

  // src/spells/level4/WallOfFire.ts
  var shapeChoices2 = [
    makeStringChoice("line"),
    makeStringChoice("ring")
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
    isHarmful: true,
    description: `You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.

  When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.

  One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet of that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.

  At Higher Levels. When you cast this spell using a spell slot of 5th level or higher, the damage increases by 1d8 for each slot level above 4th.`,
    // TODO: generateAttackConfigs
    // TODO choose dimensions of line wall
    getConfig: (g) => ({
      point: new PointResolver(g, 120),
      shape: new ChoiceResolver(g, "Shape", shapeChoices2)
    }),
    getTargets: () => [],
    getAffected: () => [],
    getDamage: (g, caster, method, { slot }) => [_dd((slot != null ? slot : 4) + 1, 8, "fire")],
    async apply() {
    }
  });
  var WallOfFire_default = WallOfFire;

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
    description: `You briefly become one with nature and gain knowledge of the surrounding territory. In the outdoors, the spell gives you knowledge of the land within 3 miles of you. In caves and other natural underground settings, the radius is limited to 300 feet. The spell doesn't function where nature has been replaced by construction, such as in dungeons and towns.

  You instantly gain knowledge of up to three facts of your choice about any of the following subjects as they relate to the area:
  - terrain and bodies of water
  - prevalent plants, minerals, animals, or peoples
  - powerful celestials, fey, fiends, elementals, or undead
  - influence from other planes of existence
  - buildings

  For example, you could determine the location of powerful undead in the area, the location of major sources of safe drinking water, and the location of any nearby towns.`,
    ...affectsSelf,
    getConfig: () => ({}),
    async apply() {
    }
  });
  var CommuneWithNature_default = CommuneWithNature;

  // src/spells/level5/ConeOfCold.ts
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
    ...affectsCone(60),
    ...requiresSave("con"),
    ...doesScalingDamage(5, 3, 8, "cold"),
    // TODO: generateAttackConfigs
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { damageResponse } = await sh.save({
          ability: "con",
          who: target
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "cold",
          target
        });
      }
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
    description: `You call forth an elemental servant. Choose an area of air, earth, fire, or water that fills a 10-foot cube within range. An elemental of challenge rating 5 or lower appropriate to the area you chose appears in an unoccupied space within 10 feet of it. For example, a fire elemental emerges from a bonfire, and an earth elemental rises up from the ground. The elemental disappears when it drops to 0 hit points or when the spell ends.

  The elemental is friendly to you and your companions for the duration. Roll initiative for the elemental, which has its own turns. It obeys any verbal commands that you issue to it (no action required by you). If you don't issue any commands to the elemental, it defends itself from hostile creatures but otherwise takes no actions.
  
  If your concentration is broken, the elemental doesn't disappear. Instead, you lose control of the elemental, it becomes hostile toward you and your companions, and it might attack. An uncontrolled elemental can't be dismissed by you, and it disappears 1 hour after you summoned it.
  
  The DM has the elemental's statistics.
  
  At Higher Levels. When you cast this spell using a spell slot of 6th level or higher, the challenge rating increases by 1 for each slot level above 5th.`,
    getConfig: (g) => ({
      point: new PointResolver(g, 90),
      type: new ChoiceResolver(g, "Element", [
        makeStringChoice("air"),
        makeStringChoice("earth"),
        makeStringChoice("fire"),
        makeStringChoice("water")
      ])
    }),
    getTargets: () => [],
    getAffected: () => [],
    async apply() {
    }
  });
  var ConjureElemental_default = ConjureElemental;

  // src/img/spl/meteor-swarm.svg
  var meteor_swarm_default = "./meteor-swarm-XN7NNB53.svg";

  // src/utils/distance.ts
  var FEET_PER_MILE = 5280;
  var miles = (n) => n * FEET_PER_MILE;

  // src/spells/level9/MeteorSwarm.ts
  var getMeteorSwarmArea = (centre) => ({
    type: "sphere",
    centre,
    radius: 40
  });
  var MeteorSwarm = simpleSpell({
    status: "implemented",
    name: "Meteor Swarm",
    icon: makeIcon(meteor_swarm_default, DamageColours.fire),
    level: 9,
    school: "Evocation",
    v: true,
    s: true,
    lists: ["Sorcerer", "Wizard"],
    description: `Blazing orbs of fire plummet to the ground at four different points you can see within range. Each creature in a 40-foot-radius sphere centered on each point you choose must make a Dexterity saving throw. The sphere spreads around corners. A creature takes 20d6 fire damage and 20d6 bludgeoning damage on a failed save, or half as much damage on a successful one. A creature in the area of more than one fiery burst is affected only once.

  The spell damages objects in the area and ignites flammable objects that aren't being worn or carried.`,
    isHarmful: true,
    getConfig: (g) => ({ points: new MultiPointResolver(g, 4, 4, miles(1)) }),
    getTargets: () => [],
    getAffectedArea: (g, caster, { points }) => points && points.map(getMeteorSwarmArea),
    getAffected: (g, caster, { points }) => uniq(points.flatMap((point) => g.getInside(getMeteorSwarmArea(point)))),
    getDamage: () => [_dd(20, 6, "fire"), _dd(20, 6, "bludgeoning")],
    async apply(sh) {
      const damageInitialiser = await sh.rollDamage();
      for (const target of sh.affected) {
        const { damageResponse } = await sh.save({
          ability: "dex",
          who: target
        });
        await sh.damage({
          damageInitialiser,
          damageResponse,
          damageType: "fire",
          target
        });
      }
    }
  });
  var MeteorSwarm_default = MeteorSwarm;

  // src/data/allSpells.ts
  var allSpells = {
    "acid splash": AcidSplash_default,
    "blade ward": BladeWard_default,
    "chill touch": ChillTouch_default,
    "eldritch blast": EldritchBlast_default,
    "fire bolt": FireBolt_default,
    guidance: Guidance_default,
    gust: Gust_default,
    "magic stone": MagicStone_default,
    "mind sliver": MindSliver_default,
    "poison spray": PoisonSpray_default,
    "primal savagery": PrimalSavagery_default,
    "produce flame": ProduceFlame_default,
    "ray of frost": RayOfFrost_default,
    resistance: Resistance_default,
    "sacred flame": SacredFlame_default,
    shillelagh: Shillelagh_default,
    "shocking grasp": ShockingGrasp_default,
    "spare the dying": SpareTheDying_default,
    thaumaturgy: Thaumaturgy_default,
    thunderclap: Thunderclap_default,
    "vicious mockery": ViciousMockery_default,
    "armor of Agathys": ArmorOfAgathys_default,
    bless: Bless_default,
    "burning hands": BurningHands_default,
    "charm person": CharmPerson_default,
    command: Command_default,
    "cure wounds": CureWounds_default,
    "divine favor": DivineFavor_default,
    "earth tremor": EarthTremor_default,
    entangle: Entangle_default,
    "faerie fire": FaerieFire_default,
    "fog cloud": FogCloud_default,
    "guiding bolt": GuidingBolt_default,
    "healing word": HealingWord_default,
    "hellish rebuke": HellishRebuke_default,
    "hideous laughter": HideousLaughter_default,
    "ice knife": IceKnife_default,
    "inflict wounds": InflictWounds_default,
    longstrider: Longstrider_default,
    "mage armor": MageArmor_default,
    "magic missile": MagicMissile_default,
    "protection from evil and good": ProtectionFromEvilAndGood_default,
    sanctuary: Sanctuary_default,
    shield: Shield_default,
    "shield of faith": ShieldOfFaith_default,
    sleep: Sleep_default,
    thunderwave: Thunderwave_default,
    aid: Aid_default,
    barkskin: Barkskin_default,
    blur: Blur_default,
    darkness: Darkness_default,
    "enlarge/reduce": EnlargeReduce_default,
    "gust of wind": GustOfWind_default,
    "hold person": HoldPerson_default,
    "lesser restoration": LesserRestoration_default,
    levitate: Levitate_default,
    "magic weapon": MagicWeapon_default,
    "mirror image": MirrorImage_default,
    "misty step": MistyStep_default,
    moonbeam: Moonbeam_default,
    silence: Silence_default,
    "spider climb": SpiderClimb_default,
    "spike growth": SpikeGrowth_default,
    web: Web_default,
    counterspell: Counterspell_default,
    "erupting earth": EruptingEarth_default,
    fireball: Fireball_default,
    "intellect fortress": IntellectFortress_default,
    "lightning bolt": LightningBolt_default,
    "mass healing word": MassHealingWord_default,
    "meld into stone": MeldIntoStone_default,
    "Melf's minute meteors": MelfsMinuteMeteors_default,
    "sleet storm": SleetStorm_default,
    slow: Slow_default,
    "spirit guardians": SpiritGuardians_default,
    "wall of water": WallOfWater_default,
    "water breathing": WaterBreathing_default,
    "water walk": WaterWalk_default,
    "charm monster": CharmMonster_default,
    "control water": ControlWater_default,
    "fire shield": FireShield_default,
    "freedom of movement": FreedomOfMovement_default,
    "guardian of nature": GuardianOfNature_default,
    "ice storm": IceStorm_default,
    stoneskin: Stoneskin_default,
    "wall of fire": WallOfFire_default,
    "commune with nature": CommuneWithNature_default,
    "cone of cold": ConeOfCold_default,
    "conjure elemental": ConjureElemental_default,
    "meteor swarm": MeteorSwarm_default
  };
  var allSpells_default = allSpells;

  // src/features/common.ts
  var Amphibious = notImplementedFeature(
    "Amphibious",
    `You can breathe air and water.`
  );
  var bonusSpellResourceFinder = (entries) => (spell) => {
    var _a;
    return (_a = entries.find((entry) => entry.spell === spell.name)) == null ? void 0 : _a.resource;
  };
  function bonusSpellsFeature(name, text, levelType, method, entries, addAsList, additionalSetup) {
    return new SimpleFeature(name, text, (g, me) => {
      var _a;
      const casterLevel = levelType === "level" ? me.level : me.getClassLevel(levelType, 1);
      const activeEntries = entries.filter((entry) => entry.level <= casterLevel);
      const spells = /* @__PURE__ */ new Set();
      for (const { resource, spell: name2 } of activeEntries) {
        if (resource)
          me.initResource(resource);
        const spell = allSpells_default[name2];
        spellImplementationWarning(spell != null ? spell : { name: name2, status: "missing" }, me);
        if (!spell)
          continue;
        if (addAsList) {
          me.preparedSpells.add(spell);
          (_a = method.addCastableSpell) == null ? void 0 : _a.call(method, spell, me);
        } else
          spells.add(spell);
      }
      me.spellcastingMethods.add(method);
      if (spells.size)
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            for (const spell of spells)
              actions.push(new CastSpell(g, me, method, spell));
        });
      additionalSetup == null ? void 0 : additionalSetup(g, me);
    });
  }
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
  function darkvisionFeature(range = 60) {
    return new SimpleFeature(
      "Darkvision",
      `You can see in dim light within ${range} feet of you as if it were bright light and in darkness as if it were dim light. You can\u2019t discern color in darkness, only shades of gray.`,
      (g, me) => {
        me.senses.set("darkvision", range);
      }
    );
  }
  var Darkvision60 = darkvisionFeature(60);
  var Darkvision120 = darkvisionFeature(120);
  function nonCombatFeature(name, text) {
    return new SimpleFeature(name, text, () => {
    });
  }
  function notImplementedFeature(name, text) {
    return new SimpleFeature(name, text, (g, me) => {
      implementationWarning("Feature", "Missing", name, me.name);
    });
  }
  function wrapperFeature(name, text) {
    return new ConfiguredFeature(name, text, (g, me, feature) => {
      me.addFeature(allFeatures_default[feature]);
    });
  }

  // src/monsters/fiendishParty/common.ts
  var FiendishParty = {
    name: "Fiendish Party",
    getCoefficient: () => void 0
  };

  // src/monsters/fiendishParty/OGonrit.ts
  var FiendishMantleRange = 30;
  var FiendishMantle = new SimpleFeature(
    "Fiendish Mantle",
    `As long as he is conscious, whenever any ally within ${FiendishMantleRange} ft. of O Gonrit deals damage with a weapon attack, they deal an extra 2 (1d4) necrotic damage.`,
    (g, me) => {
      const aura = new AuraController(
        g,
        "Fiendish Mantle",
        me,
        FiendishMantleRange,
        ["profane"],
        "purple"
      ).setActiveChecker((who) => !who.conditions.has("Unconscious"));
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, critical, interrupt, map } }) => {
          if ((attacker == null ? void 0 : attacker.side) === me.side && attacker !== me && (attack == null ? void 0 : attack.roll.type.tags.has("weapon")) && aura.isAffecting(attacker))
            interrupt.add(
              new EvaluateLater(
                attacker,
                FiendishMantle,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(
                    1,
                    {
                      attacker,
                      source: FiendishMantle,
                      damageType: "necrotic",
                      size: 4,
                      tags: atSet("magical")
                    },
                    critical
                  );
                  map.add("necrotic", amount);
                }
              )
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
  var ShieldBashAction = class extends AbstractSingleTargetAction {
    constructor(g, actor, ability) {
      super(
        g,
        actor,
        "Shield Bash",
        "implemented",
        { target: new TargetResolver(g, actor.reach, [isEnemy]) },
        { icon: ShieldBashIcon, time: "action", tags: ["harmful"] }
      );
      this.ability = ability;
    }
    async applyEffect({ target }) {
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
  var SpellcastingMethod = new InnateSpellcasting("Spellcasting", "wis");
  var Spellcasting = bonusSpellsFeature(
    "Spellcasting",
    "O Gonrit can cast guiding bolt and mass healing word at will.",
    "level",
    SpellcastingMethod,
    [
      { level: 1, spell: "guiding bolt" },
      { level: 5, spell: "mass healing word" }
    ]
  );
  var OGonrit = {
    name: "O Gonrit",
    cr: 5,
    type: "fiend",
    tokenUrl: o_gonrit_default,
    hpMax: 65,
    aiRules: [
      new HealingRule(),
      new DamageRule(),
      new StayNearAlliesRule(FiendishMantleRange)
    ],
    aiCoefficients: /* @__PURE__ */ new Map([[HealAllies, 1.2]]),
    aiGroups: [FiendishParty],
    align: ["Neutral", "Evil"],
    makesDeathSaves: true,
    abilities: [15, 8, 14, 10, 18, 13],
    pb: 3,
    levels: { Cleric: 5 },
    proficiency: {
      wis: "proficient",
      cha: "proficient",
      Insight: "proficient",
      Persuasion: "proficient"
    },
    damage: { fire: "resist", poison: "resist" },
    immunities: ["Poisoned"],
    languages: ["Abyssal", "Common"],
    features: [FiendishMantle, ShieldBash, Spellcasting, Protection_default],
    items: [
      { name: "splint armor", equip: true },
      { name: "shield", equip: true },
      { name: "mace", equip: true }
    ]
  };
  var OGonrit_default = OGonrit;

  // src/img/act/song.svg
  var song_default = "./song-BE5ZE7S7.svg";

  // src/img/tok/boss/yulash.png
  var yulash_default = "./yulash-YXCZ3ZVJ.png";

  // src/monsters/fiendishParty/Yulash.ts
  function getMeleeAttackOptions(g, attacker, filter) {
    const options = [];
    for (const weapon of attacker.weapons) {
      if (weapon.rangeCategory !== "melee")
        continue;
      for (const target of g.combatants) {
        if (target === attacker || !filter(target, weapon))
          continue;
        const reach = getWeaponRange(attacker, weapon, "melee");
        if (reach >= distance(attacker, target))
          options.push({ target, weapon });
      }
    }
    return options;
  }
  var cheerIcon = makeIcon(song_default, "green");
  var discordIcon = makeIcon(song_default, "red");
  var irritationIcon = makeIcon(song_default, "purple");
  var CheerAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Cheer",
        "implemented",
        { target: new TargetResolver(g, 30, [isAlly, capable, conscious]) },
        {
          time: "action",
          icon: cheerIcon,
          description: `One ally within 30 ft. may make a melee attack against an enemy in range.`,
          tags: ["vocal"]
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
    async applyEffect({ target }) {
      const attacks = this.getValidAttacks(target);
      const choice = new PickFromListChoice(
        target,
        this,
        "Cheer",
        `Pick an attack to make.`,
        Priority_default.Normal,
        attacks.map((value) => ({
          value,
          label: `attack ${value.target.name} with ${value.weapon.name}`
        })),
        async ({ target: target2, weapon }) => {
          await doStandardAttack(this.g, {
            source: this,
            ability: getWeaponAbility(target2, weapon),
            attacker: target2,
            rangeCategory: "melee",
            target: target2,
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
  var DiscordAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Discord",
        "implemented",
        { target: new TargetResolver(g, 30, [isEnemy, capable, conscious]) },
        {
          time: "action",
          icon: discordIcon,
          description: `One enemy within 30 ft. must make a Charisma save or use its reaction to make one melee attack against an ally in range.`,
          tags: ["harmful", "vocal"]
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
    async applyEffect({ target }) {
      const { outcome } = await this.g.save({
        source: this,
        type: { type: "ability", ability: "cha" },
        attacker: this.actor,
        who: target,
        ability: "cha",
        tags: ["charm", "magic"]
      });
      if (outcome === "success")
        return;
      const attacks = this.getValidAttacks(target);
      const choice = new PickFromListChoice(
        target,
        this,
        "Discord",
        `Pick an attack to make.`,
        Priority_default.Normal,
        attacks.map((value) => ({
          value,
          label: `attack ${value.target.name} with ${value.weapon.name}`
        })),
        async ({ target: target2, weapon }) => {
          await doStandardAttack(this.g, {
            source: this,
            ability: getWeaponAbility(target2, weapon),
            attacker: target2,
            rangeCategory: "melee",
            target: target2,
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
  var IrritationAction = class extends AbstractSingleTargetAction {
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
          description: `One enemy within 30ft. must make a Constitution check or lose concentration.`,
          tags: ["harmful", "vocal"]
        }
      );
    }
    async applyEffect({ target }) {
      const { outcome } = await this.g.save({
        source: this,
        type: { type: "ability", ability: "cha" },
        attacker: this.actor,
        who: target,
        ability: "con",
        tags: ["concentration", "magic"]
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
  var YulashSpellcastingMethod = new InnateSpellcasting("Spellcasting", "cha");
  var YulashSpellcasting = bonusSpellsFeature(
    "Spellcasting",
    "Yulash can cast healing word at will.",
    "level",
    YulashSpellcastingMethod,
    [{ level: 1, spell: "healing word" }]
  );
  var DancingStepAction = class extends AbstractSelfAction {
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
    async applyEffect() {
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
              Priority_default.Normal,
              () => g.act(step, config)
            )
          );
      });
    }
  );
  var Yulash = {
    name: "Yulash",
    cr: 5,
    type: "monstrosity",
    tokenUrl: yulash_default,
    hpMax: 65,
    align: ["Chaotic", "Evil"],
    makesDeathSaves: true,
    abilities: [8, 16, 14, 12, 13, 18],
    pb: 3,
    levels: { Bard: 5 },
    proficiency: {
      dex: "proficient",
      cha: "proficient",
      Deception: "proficient",
      Perception: "proficient"
    },
    damage: { poison: "immune" },
    immunities: ["Poisoned"],
    languages: ["Common", "Abyssal"],
    features: [Cheer, Discord, Irritation, YulashSpellcasting, DancingStep],
    items: [
      { name: "leather armor", equip: true },
      { name: "rapier", equip: true }
    ]
  };
  var Yulash_default = Yulash;

  // src/img/act/bull-rush.svg
  var bull_rush_default = "./bull-rush-C6PSXUHN.svg";

  // src/img/tok/boss/zafron.png
  var zafron_default = "./zafron-HS5HC4BR.png";

  // src/monsters/fiendishParty/Zafron.ts
  var LustForBattle = new ConfiguredFeature(
    "Lust for Battle",
    "When Zafron hits with his Greataxe, he gains 5 temporary hit points.",
    (g, me, weapon) => {
      g.events.on(
        "CombatantDamaged",
        ({ detail: { attack, attacker, interrupt } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.roll.type.weapon) === weapon)
            interrupt.add(
              new EvaluateLater(me, LustForBattle, Priority_default.Normal, async () => {
                if (await g.giveTemporaryHP(me, 5, LustForBattle))
                  g.text(
                    new MessageBuilder().co(me).text(" pulses with dark energy.")
                  );
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
          if (who.hasEffect(BullRushEffect) && isA(damageType, MundaneDamageTypes))
            response.add("resist", BullRushEffect);
        }
      );
    },
    { icon: BullRushIcon }
  );
  var BullRushAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Bull Rush",
        "implemented",
        {},
        {
          icon: BullRushIcon,
          time: "action",
          description: `Until the beginning of your next turn, gain resistance to bludgeoning, piercing and slashing damage. Then, move up to your speed in a single direction. All enemies that you pass through must make a Dexterity save or be knocked prone.`,
          tags: ["harmful"]
        }
      );
    }
    check(config, ec) {
      if (this.actor.speed <= 0)
        ec.add("cannot move", this);
      return super.check(config, ec);
    }
    async applyEffect() {
      const { g, actor } = this;
      const affected = [actor];
      const promises = [];
      await actor.addEffect(BullRushEffect, { duration: 1 });
      const maximum = actor.speed;
      let used = 0;
      let rushDirection;
      await g.applyBoundedMove(actor, {
        name: "Bull Rush",
        maximum,
        turnMovement: false,
        forced: false,
        provokesOpportunityAttacks: true,
        mustUseAll: false,
        teleportation: false,
        onMove: (who, cost) => {
          for (const hit of g.getInside(
            { type: "within", who, radius: 0 },
            affected
          )) {
            g.text(
              new MessageBuilder().co(actor).text(" barrels into").sp().co(hit).text(".")
            );
            affected.push(hit);
            promises.push(this.knockOver(hit));
          }
          used += cost;
          return used >= maximum;
        },
        check: ({ detail: { direction, error } }) => {
          if (!rushDirection)
            rushDirection = direction;
          else if (rushDirection !== direction)
            error.add("must move in same direction", this);
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
              Priority_default.ChangesOutcome,
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
        if (activated && !me.conditions.has("Unconscious")) {
          activated = false;
          interrupt.add(
            new EvaluateLater(
              me,
              SurvivalReflex,
              Priority_default.Late,
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
  var ZafronMultiattack = makeBagMultiattack(
    "Zafron attacks twice with his Greataxe.",
    [{ weapon: "greataxe" }, { weapon: "greataxe" }]
  );
  var Zafron = {
    name: "Zafron Halehart",
    cr: 5,
    type: "fiend",
    tokenUrl: zafron_default,
    hpMax: 105,
    align: ["Chaotic", "Evil"],
    makesDeathSaves: true,
    abilities: [18, 14, 20, 7, 10, 13],
    pb: 3,
    proficiency: {
      str: "proficient",
      con: "proficient",
      Acrobatics: "proficient",
      Intimidation: "proficient"
    },
    damage: { fire: "resist", poison: "resist" },
    immunities: ["Poisoned"],
    languages: ["Abyssal"],
    features: [LustForBattle, ZafronMultiattack, BullRush, SurvivalReflex],
    items: [{ name: "scale mail", equip: true }, { name: "greataxe" }],
    setup() {
      const axe = this.getInventoryItem("greataxe");
      this.don(axe);
      this.setConfig(LustForBattle, axe);
    }
  };
  var Zafron_default = Zafron;

  // src/img/tok/chuul.png
  var chuul_default = "./chuul-VYYM7NAD.png";

  // src/monsters/poisons.ts
  var ParalyzingPoisonEffect = new Effect(
    "Paralyzing Poison",
    "turnEnd",
    (g) => {
      g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
        if (who.hasEffect(ParalyzingPoisonEffect)) {
          conditions.add("Poisoned", ParalyzingPoisonEffect);
          conditions.add("Paralyzed", ParalyzingPoisonEffect);
        }
      });
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        const config = who.getEffectConfig(ParalyzingPoisonEffect);
        if (config)
          interrupt.add(
            new EvaluateLater(
              who,
              ParalyzingPoisonEffect,
              Priority_default.Normal,
              async () => {
                const { outcome } = await g.save({
                  source: ParalyzingPoisonEffect,
                  type: config.type,
                  ability: config.ability,
                  who,
                  effect: ParalyzingPoisonEffect,
                  config,
                  tags: ["poison"]
                });
                if (outcome === "success")
                  await who.removeEffect(ParalyzingPoisonEffect);
              }
            )
          );
      });
    },
    { tags: ["poison"] }
  );

  // src/monsters/srd/aberration.ts
  var TentaclesAction = class extends AbstractSingleTargetAttackAction {
    constructor(g, actor, dc = 13) {
      super(
        g,
        actor,
        "Tentacles",
        "implemented",
        "tentacles",
        "melee",
        { target: new TargetResolver(g, actor.reach, [isGrappledBy(actor)]) },
        {
          description: `One creature grappled by the chuul must succeed on a DC ${dc} Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.`
        }
      );
      this.dc = dc;
    }
    async applyEffect({ target }) {
      const { g, actor, dc } = this;
      const type = { type: "flat", dc };
      const ability = "con";
      const effect = ParalyzingPoisonEffect;
      const config = {
        conditions: coSet("Poisoned", "Paralyzed"),
        duration: minutes(1),
        type,
        ability
      };
      const { outcome } = await g.save({
        source: this,
        who: target,
        type,
        ability,
        attacker: actor,
        effect,
        config,
        tags: ["poison"]
      });
      if (outcome === "fail")
        await target.addEffect(effect, config, actor);
    }
  };
  var TentaclesFeature = new SimpleFeature("Tentacles", "", (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(new TentaclesAction(g, me));
    });
  });
  var Pincer = {
    name: "pincer",
    toHit: "str",
    damage: _dd(2, 6, "bludgeoning"),
    async onHit(target, me) {
      if (me.grappling.size < 2 && target.size <= me.size && !me.grappling.has(target))
        await target.addEffect(Grappled, {
          by: me,
          duration: Infinity
        });
    }
  };
  var ChuulMultiattack = makeBagMultiattack(
    `The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once.`,
    [{ weapon: Pincer.name }, { weapon: Pincer.name }, { weapon: "tentacles" }]
  );
  var SenseMagic = notImplementedFeature(
    "Sense Magic",
    `The chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn't itself magical.`
  );
  var Chuul = {
    name: "chuul",
    tokenUrl: chuul_default,
    cr: 4,
    type: "aberration",
    size: SizeCategory_default.Large,
    reach: 10,
    hpMax: 93,
    align: ["Chaotic", "Evil"],
    naturalAC: 16,
    movement: { swim: 30 },
    abilities: [19, 10, 16, 5, 11, 5],
    proficiency: { Perception: "expertise" },
    damage: { poison: "immune" },
    immunities: ["Poisoned"],
    senses: { darkvision: 60 },
    naturalWeapons: [Pincer],
    features: [Amphibious, SenseMagic, ChuulMultiattack, TentaclesFeature]
  };

  // src/img/tok/badger.png
  var badger_default = "./badger-53MEBA7R.png";

  // src/img/tok/bat.png
  var bat_default = "./bat-N3PIK5K4.png";

  // src/img/tok/giant-badger.png
  var giant_badger_default = "./giant-badger-R3QZK5QP.png";

  // src/monsters/common.ts
  var Brute = new SimpleFeature(
    "Brute",
    `A melee weapon deals one extra die of its damage when you hit with it.`,
    (g, me) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, weapon, interrupt, bonus } }) => {
          if (attacker === me && (attack == null ? void 0 : attack.roll.type.tags.has("melee")) && (weapon == null ? void 0 : weapon.damage.type) === "dice") {
            const { size } = weapon.damage.amount;
            interrupt.add(
              new EvaluateLater(me, Brute, Priority_default.Normal, async () => {
                const extra = await g.rollDamage(1, {
                  size,
                  source: Brute,
                  attacker: me,
                  tags: attack.roll.type.tags
                });
                bonus.add(extra, Brute);
              })
            );
          }
        }
      );
    }
  );
  var ExhaustionImmunity = new SimpleFeature(
    "Exhaustion Immunity",
    `You are immune to exhaustion.`,
    (g, me) => {
      g.events.on("Exhaustion", ({ detail: { who, delta, success } }) => {
        if (who === me && delta > 0)
          success.add("fail", ExhaustionImmunity);
      });
    }
  );
  var KeenHearing = new SimpleFeature(
    "Keen Hearing",
    `You have advantage on Wisdom (Perception) checks that rely on hearing.`,
    (g, me) => {
      g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("hearing"))
          diceType.add("advantage", KeenHearing);
      });
    }
  );
  var KeenHearingAndSight = new SimpleFeature(
    "Keen Hearing and Sight",
    `You have advantage on Wisdom (Perception) checks that rely on hearing or sight.`,
    (g, me) => {
      g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
        if (who === me && hasAny(tags, ["hearing", "sight"]))
          diceType.add("advantage", KeenHearingAndSight);
      });
    }
  );
  var KeenSmell = new SimpleFeature(
    "Keen Smell",
    `You have advantage on Wisdom (Perception) checks that rely on smell.`,
    (g, me) => {
      g.events.on("BeforeCheck", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("smell"))
          diceType.add("advantage", KeenSmell);
      });
    }
  );
  var MagicResistance = new SimpleFeature(
    "Magic Resistance",
    `You have advantage on saving throws against spells and other magical effects.`,
    (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, tags, diceType } }) => {
        if (who === me && tags.has("magic"))
          diceType.add("advantage", MagicResistance);
      });
    }
  );
  var MundaneDamageResistance = new SimpleFeature(
    "Mundane Damage Resistance",
    "You resist bludgeoning, piercing, and slashing damage from nonmagical attacks.",
    (g, me) => {
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, attack, response } }) => {
          if (who === me && !(attack == null ? void 0 : attack.roll.type.tags.has("magical")) && isA(damageType, MundaneDamageTypes))
            response.add("resist", MundaneDamageResistance);
        }
      );
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
  var SpellDamageResistance = new SimpleFeature(
    "Spell Damage Resistance",
    `You resist damage from spells.`,
    (g, me) => {
      g.events.on("GetDamageResponse", ({ detail: { who, spell, response } }) => {
        if (who === me && spell)
          response.add("resist", SpellDamageResistance);
      });
    }
  );

  // src/monsters/srd/beast.ts
  var Badger = {
    name: "badger",
    tokenUrl: badger_default,
    cr: 0,
    type: "beast",
    size: SizeCategory_default.Tiny,
    hpMax: 3,
    abilities: [4, 11, 12, 2, 12, 5],
    movement: { speed: 20, burrow: 5 },
    senses: { darkvision: 30 },
    features: [KeenSmell],
    naturalWeapons: [{ name: "bite", toHit: "dex", damage: _fd(1, "piercing") }]
  };
  var Echolocation = notImplementedFeature(
    "Echolocation",
    `The bat can't use its blindsight while deafened.`
  );
  var Bat = {
    name: "bat",
    tokenUrl: bat_default,
    cr: 0,
    type: "beast",
    size: SizeCategory_default.Tiny,
    hpMax: 1,
    abilities: [2, 15, 8, 2, 12, 4],
    movement: { speed: 5, fly: 30 },
    senses: { blindsight: 60 },
    features: [Echolocation, KeenHearing],
    naturalWeapons: [{ name: "bite", toHit: 0, damage: _fd(1, "piercing") }]
  };
  var GiantBadgerMultiattack = makeBagMultiattack(
    "The badger makes two attacks: one with its bite and one with its claws.",
    [{ weapon: "bite" }, { weapon: "claws" }]
  );
  var GiantBadger = {
    name: "giant badger",
    tokenUrl: giant_badger_default,
    cr: 0.25,
    type: "beast",
    hpMax: 13,
    abilities: [13, 10, 15, 2, 12, 5],
    movement: { burrow: 10 },
    senses: { darkvision: 30 },
    features: [KeenSmell, GiantBadgerMultiattack],
    naturalWeapons: [
      { name: "bite", toHit: "str", damage: _dd(1, 6, "piercing") },
      { name: "claws", toHit: "str", damage: _dd(2, 4, "slashing") }
    ]
  };

  // src/img/tok/air-elemental.png
  var air_elemental_default = "./air-elemental-CX7UP465.png";

  // src/img/tok/earth-elemental.png
  var earth_elemental_default = "./earth-elemental-ZK5UMGLZ.png";

  // src/img/tok/fire-elemental.png
  var fire_elemental_default = "./fire-elemental-Z2K4OGUS.png";

  // src/img/tok/water-elemental.png
  var water_elemental_default = "./water-elemental-6HXVIUWU.png";

  // src/monsters/srd/elemental.ts
  var DoubleAttack = makeMultiattack(
    `The elemental makes two attacks.`,
    (me) => me.attacksSoFar.length < 2
  );
  var elementalBase = {
    name: "(elemental)",
    tokenUrl: "",
    cr: 5,
    pb: 3,
    type: "elemental",
    size: SizeCategory_default.Large,
    align: ["Neutral", "Neutral"],
    features: [MundaneDamageResistance, ExhaustionImmunity, DoubleAttack],
    damage: { poison: "immune" },
    immunities: ["Paralyzed", "Petrified", "Poisoned", "Unconscious"],
    senses: { darkvision: 60 }
  };
  var AirForm = notImplementedFeature(
    "Air Form",
    `The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.`
  );
  var Whirlwind = notImplementedFeature(
    "Whirlwind",
    `Whirlwind (Recharge 4\u20136). Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone.
If the saving throw is successful, the target takes half the bludgeoning damage and isn't flung away or knocked prone.`
  );
  var AirElemental = {
    base: elementalBase,
    name: "air elemental",
    tokenUrl: air_elemental_default,
    hpMax: 90,
    movement: { speed: 0, fly: 90 },
    abilities: [14, 20, 14, 6, 10, 6],
    damage: { lightning: "resist", thunder: "resist" },
    immunities: ["Grappled", "Prone", "Restrained"],
    languages: ["Auran"],
    features: [AirForm, Whirlwind],
    naturalWeapons: [
      { name: "slam", toHit: "dex", damage: _dd(2, 8, "bludgeoning") }
    ]
  };
  var EarthGlide = notImplementedFeature(
    "Earth Glide",
    `The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.`
  );
  var SiegeMonster = notImplementedFeature(
    "Siege Monster",
    `The elemental deals double damage to objects and structures.`
  );
  var EarthElemental = {
    base: elementalBase,
    name: "earth elemental",
    tokenUrl: earth_elemental_default,
    hpMax: 126,
    naturalAC: 18,
    movement: { burrow: 30 },
    abilities: [20, 8, 20, 5, 10, 5],
    damage: { thunder: "vulnerable" },
    senses: { tremorsense: 60 },
    languages: ["Terran"],
    features: [EarthGlide, SiegeMonster],
    naturalWeapons: [
      { name: "slam", toHit: "str", damage: _dd(2, 8, "bludgeoning") }
    ]
  };
  var FireForm = new SimpleFeature(
    "Fire Form",
    `The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns.`,
    (g, me) => {
      const applyFireDamage = async (target) => {
        const damage = await g.rollDamage(1, {
          size: 10,
          damageType: "fire",
          attacker: me,
          source: FireForm,
          tags: atSet(),
          target
        });
        await g.damage(FireForm, "fire", { attacker: me, target }, [
          ["fire", damage]
        ]);
      };
      g.events.on(
        "Attack",
        ({
          detail: {
            roll: {
              type: { target, tags, who: attacker }
            },
            outcome,
            interrupt
          }
        }) => {
          if (target === me && outcome.hits && tags.has("melee") && distance(attacker, me) <= 5)
            interrupt.add(
              new EvaluateLater(me, FireForm, Priority_default.Late, async () => {
                if (outcome.hits)
                  await applyFireDamage(attacker);
              })
            );
        }
      );
      const area = { type: "within", who: me, radius: 0 };
      const opt = new OncePerTurnController(g);
      g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
        if (who === me)
          for (const target of g.getInside(area, [me]).filter(opt.canBeAffected)) {
            opt.affect(target);
            interrupt.add(
              new EvaluateLater(me, FireForm, Priority_default.Normal, async () => {
                await applyFireDamage(target);
                await target.addEffect(OnFire, { duration: Infinity }, me);
              })
            );
          }
      });
    }
  );
  var Illumination = notImplementedFeature(
    "Illumination",
    `The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 feet.`
  );
  var WaterSusceptibility = notImplementedFeature(
    "Water Susceptibility",
    `For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.`
  );
  var FireElemental = {
    base: elementalBase,
    name: "fire elemental",
    tokenUrl: fire_elemental_default,
    hpMax: 102,
    movement: { speed: 50 },
    abilities: [10, 17, 16, 6, 10, 7],
    damage: { fire: "immune" },
    immunities: ["Grappled", "Prone", "Restrained"],
    languages: ["Ignan"],
    features: [FireForm, Illumination, WaterSusceptibility],
    naturalWeapons: [
      {
        name: "touch",
        toHit: "dex",
        damage: _dd(2, 6, "fire"),
        async onHit(target, me) {
          await target.addEffect(OnFire, { duration: Infinity }, me);
        }
      }
    ]
  };
  var Whelm = notImplementedFeature(
    "Whelm",
    `Whelm (Recharge 4\u20136). Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental's space.
The elemental can grapple one Large creature or up to two Medium or smaller creatures at one time. At the start of each of the elemental's turns, each target grappled by it takes 13 (2d8 + 4) bludgeoning damage. A creature within 5 feet of the elemental can pull a creature or object out of it by taking an action to make a DC 14 Strength check and succeeding.`
  );
  var WaterElemental = {
    base: elementalBase,
    name: "water elemental",
    tokenUrl: water_elemental_default,
    hpMax: 114,
    naturalAC: 12,
    movement: { swim: 90 },
    abilities: [18, 14, 18, 5, 10, 8],
    damage: { acid: "resist" },
    immunities: ["Grappled", "Prone", "Restrained"],
    languages: ["Aquan"],
    features: [Whelm],
    naturalWeapons: [
      { name: "slam", toHit: "str", damage: _dd(2, 8, "bludgeoning") }
    ]
  };

  // src/img/tok/goblin.png
  var goblin_default = "./goblin-KBFKWGXU.png";

  // src/monsters/srd/goblinoid.ts
  var NimbleEscape = new SimpleFeature(
    "Nimble Escape",
    `The goblin can take the Disengage or Hide action as a bonus action on each of its turns.`,
    (g, me) => {
      featureNotComplete(NimbleEscape, me);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          const cunning = [new DisengageAction(g, who)];
          for (const action of cunning) {
            action.name += " (Nimble Escape)";
            action.time = "bonus action";
          }
          actions.push(...cunning);
        }
      });
    }
  );
  var Goblin = {
    name: "goblin",
    cr: 0.25,
    type: "humanoid",
    size: SizeCategory_default.Small,
    tokenUrl: goblin_default,
    hpMax: 7,
    align: ["Neutral", "Evil"],
    proficiency: { Stealth: "expertise" },
    senses: { darkvision: 60 },
    languages: ["Common", "Goblin"],
    features: [NimbleEscape],
    items: [
      { name: "shield" },
      { name: "scimitar" },
      { name: "shortbow" },
      { name: "arrow", quantity: 20 }
    ],
    config: {
      initial: { weapon: "scimitar" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("scimitar", "scimitar/shield"),
          makeStringChoice("shortbow")
        ])
      }),
      apply({ weapon }) {
        if (weapon === "shortbow")
          this.don(this.getInventoryItem("shortbow"));
        else {
          this.don(this.getInventoryItem("scimitar"));
          this.don(this.getInventoryItem("shield"));
        }
      }
    }
  };

  // src/img/tok/acolyte.png
  var acolyte_default = "./acolyte-NHEPO7JS.png";

  // src/img/tok/archmage.png
  var archmage_default = "./archmage-GY7LGUEC.png";

  // src/img/tok/assassin.png
  var assassin_default = "./assassin-VUIPCSEA.png";

  // src/img/tok/bandit.png
  var bandit_default = "./bandit-K6YACKTJ.png";

  // src/img/tok/bandit-captain.png
  var bandit_captain_default = "./bandit-captain-QYE5N5W6.png";

  // src/img/tok/berserker.png
  var berserker_default = "./berserker-K5B6XQHW.png";

  // src/img/tok/commoner.png
  var commoner_default = "./commoner-2HXCLW3R.png";

  // src/img/tok/cult-fanatic.png
  var cult_fanatic_default = "./cult-fanatic-ZZSFTMQY.png";

  // src/img/tok/cultist.png
  var cultist_default = "./cultist-BRM5GI34.png";

  // src/img/tok/druid.png
  var druid_default = "./druid-F7KWIUWQ.png";

  // src/img/tok/gladiator.png
  var gladiator_default = "./gladiator-EQ65KNFM.png";

  // src/img/tok/guard.png
  var guard_default = "./guard-BNOKTBDO.png";

  // src/img/tok/knight.png
  var knight_default = "./knight-Z7KHLCJG.png";

  // src/img/tok/mage.png
  var mage_default = "./mage-KCDH25D3.png";

  // src/img/tok/noble.png
  var noble_default = "./noble-STVR2UAW.png";

  // src/img/tok/priest.png
  var priest_default = "./priest-NOIMCM2G.png";

  // src/img/tok/scout.png
  var scout_default = "./scout-X3GWHQBK.png";

  // src/img/tok/spy.png
  var spy_default = "./spy-NXL4YX7V.png";

  // src/img/tok/thug.png
  var thug_default = "./thug-IXRM6PKF.png";

  // src/img/tok/tribal-warrior.png
  var tribal_warrior_default = "./tribal-warrior-4QD4L34K.png";

  // src/img/tok/veteran.png
  var veteran_default = "./veteran-LZVEQ5RC.png";

  // src/img/act/reckless-attack.svg
  var reckless_attack_default = "./reckless-attack-MI6SJ5UC.svg";

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
                Priority_default.ChangesOutcome,
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
  var getSpellSlotResourceName = (slot) => `Spell Slot (${slot})`;
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
    constructor(name, text, ability, strength, className, spellList, icon) {
      this.name = name;
      this.text = text;
      this.ability = ability;
      this.strength = strength;
      this.className = className;
      this.spellList = spellList;
      this.icon = icon;
      this.entries = /* @__PURE__ */ new Map();
      this.feature = new SimpleFeature(
        `Spellcasting (${name})`,
        text,
        (g, me) => {
          this.initialise(me, me.getClassLevel(className, 1));
          me.spellcastingMethods.add(this);
          g.events.on("GetActions", ({ detail: { who, actions } }) => {
            if (who === me) {
              for (const spell of me.preparedSpells) {
                if (this.canCast(spell, who))
                  actions.push(new CastSpell(g, me, this, spell));
              }
            }
          });
        }
      );
    }
    getEntry(who) {
      const entry = this.entries.get(who.id);
      if (!entry)
        throw new Error(
          `${who.name} has not initialised their ${this.name} spellcasting method.`
        );
      return entry;
    }
    canCast(spell, caster) {
      const { spells } = this.getEntry(caster);
      return spell.lists.includes(this.spellList) || spells.has(spell);
    }
    addCastableSpell(spell, caster) {
      const { spells } = this.getEntry(caster);
      spells.add(spell);
    }
    initialise(who, casterLevel) {
      const slots = SpellSlots[this.strength][casterLevel - 1];
      const resources = [];
      for (let i2 = 0; i2 < slots.length; i2++) {
        const resource = SpellSlotResources[i2 + 1];
        who.initResource(resource, slots[i2]);
        resources.push(resource);
      }
      this.entries.set(who.id, { resources, spells: /* @__PURE__ */ new Set() });
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
    getResourceForSpell(spell, slot, who) {
      const { resources } = this.getEntry(who);
      return resources[slot - 1];
    }
    getSaveType() {
      return { type: "ability", ability: this.ability };
    }
  };

  // src/utils/gain.ts
  function gains(fixed, amount, set) {
    const result = fixed.map((value) => ({ type: "static", value }));
    if (amount && set)
      result.push({ type: "choice", amount, set: new Set(set) });
    return result;
  }

  // src/types/DifficultTerrainType.ts
  var MundaneDifficultTerrainTypes = [
    "ice",
    "plants",
    "rubble",
    "snow",
    "webs"
  ];
  var MagicalDifficultTerrainTypes = [
    "magical ice",
    "magical plants",
    "magical rubble",
    // ???
    "magical snow",
    "magical webs"
  ];
  var DifficultTerrainTypes = [
    ...MundaneDifficultTerrainTypes,
    ...MagicalDifficultTerrainTypes
  ];

  // src/classes/common.ts
  function asiSetup(g, me, config) {
    if (config.type === "ability")
      for (const ability of config.abilities)
        me[ability].score++;
    else {
      const feat = allFeatures_default[config.feat];
      if (!feat)
        implementationWarning("Feat", "Missing", config.feat, me.name);
      else
        me.addFeature(feat);
    }
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
        if (action.tags.has("costs attack") && action.actor === me && action.actor.attacksSoFar.length <= extra)
          error.ignore(OneAttackPerTurnRule);
      });
    });
  }
  function makeLandsStride(text) {
    const feature = new SimpleFeature("Land's Stride", text, (g, me) => {
      featureNotComplete(feature, me);
      g.events.on("GetMoveCost", ({ detail: { who, difficult } }) => {
        if (who === me) {
          for (const type of MundaneDifficultTerrainTypes)
            difficult.ignoreValue(type);
        }
      });
      g.events.on("BeforeSave", ({ detail: { who, tags, diceType } }) => {
        if (who === me && hasAll(tags, ["plant", "magic", "impedes movement"]))
          diceType.add("advantage", feature);
      });
    });
    return feature;
  }
  var ChannelDivinityResource = new ShortRestResource(
    "Channel Divinity",
    1
  );

  // src/classes/cleric/ChannelDivinity.ts
  function getChannelCount(level) {
    if (level < 6)
      return 1;
    if (level < 18)
      return 2;
    return 3;
  }
  var ChannelDivinity = new SimpleFeature(
    "Channel Divinity",
    `Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.
When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.`,
    (g, me) => {
      me.initResource(
        ChannelDivinityResource,
        getChannelCount(me.getClassLevel("Cleric", 1))
      );
    }
  );
  var ChannelDivinity_default = ChannelDivinity;

  // src/classes/cleric/HarnessDivinePower.ts
  var HarnessDivinePowerResource = new LongRestResource(
    "Harness Divine Power",
    1
  );
  var HarnessDivinePowerAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Harness Divine Power",
        "implemented",
        {
          slot: new ChoiceResolver(
            g,
            "Slot",
            enumerate(1, 9).filter(
              (slot) => actor.resources.has(getSpellSlotResourceName(slot))
            ).map((value) => {
              const resource = SpellSlotResources[value];
              return makeChoice(
                value,
                ordinal(value),
                actor.getResourceMax(resource) <= actor.getResource(resource)
              );
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
    }
    check({ slot }, ec) {
      if (slot) {
        const resource = SpellSlotResources[slot];
        if (this.actor.getResource(resource) >= this.actor.getResourceMax(resource))
          ec.add(`full on ${resource.name}`, this);
      }
      return super.check({ slot }, ec);
    }
    async applyEffect({ slot }) {
      this.actor.giveResource(SpellSlotResources[slot], 1);
    }
  };
  function getHarnessCount(level) {
    if (level < 6)
      return 1;
    if (level < 18)
      return 2;
    return 3;
  }
  var HarnessDivinePower = new SimpleFeature(
    "Channel Divinity: Harness Divine Power",
    `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`,
    (g, me) => {
      me.initResource(
        HarnessDivinePowerResource,
        getHarnessCount(me.getClassLevel("Cleric", 2))
      );
      g.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(new HarnessDivinePowerAction(g, me));
      });
    }
  );
  var HarnessDivinePower_default = HarnessDivinePower;

  // src/classes/turned.ts
  var TurnedEffect = new Effect(
    "Turned",
    "turnEnd",
    (g) => {
      g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(TurnedEffect))
          interrupt.add(
            new EvaluateLater(who, TurnedEffect, Priority_default.Normal, async () => {
              await who.removeEffect(TurnedEffect);
            })
          );
      });
      g.events.on(
        "BeforeMove",
        ({ detail: { who, handler, from, to, error } }) => {
          const config = who.getEffectConfig(TurnedEffect);
          if (config && !handler.forced) {
            const { oldDistance, newDistance } = compareDistances(
              config.turner,
              config.turner.position,
              who,
              from,
              to
            );
            if (newDistance > oldDistance)
              return;
            if (newDistance <= 30)
              error.add(
                `cannot willingly move within 30' of ${config.turner.name}`,
                TurnedEffect
              );
            else
              error.add(
                `must move away from ${config.turner.name}`,
                TurnedEffect
              );
          }
        }
      );
      g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
        if (!action.actor.hasEffect(TurnedEffect))
          return;
        if (action.getTime(config) === "reaction")
          error.add("cannot take reactions", TurnedEffect);
        else {
          if (action.tags.has("escape move prevention"))
            return;
          if (action instanceof DashAction)
            return;
          if (action instanceof DodgeAction)
            return;
          error.add(
            "must Dash or escape an effect that prevents movement",
            TurnedEffect
          );
        }
      });
    }
  );

  // src/classes/cleric/TurnUndead.ts
  function getDestroyUndeadCR(level) {
    if (level < 5)
      return -Infinity;
    if (level < 8)
      return 0.5;
    if (level < 11)
      return 1;
    if (level < 14)
      return 2;
    if (level < 17)
      return 3;
    return 4;
  }
  var getTurnUndeadArea = (who) => ({
    type: "within",
    who,
    radius: 30
  });
  var TurnUndeadAction = class extends AbstractAction {
    constructor(g, actor, affectsTypes, method, destroyCR = -Infinity) {
      super(
        g,
        actor,
        "Turn Undead",
        "incomplete",
        {},
        {
          area: [getTurnUndeadArea(actor)],
          resources: [[ChannelDivinityResource, 1]],
          tags: ["harmful"],
          time: "action",
          description: `As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.

        A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`
        }
      );
      this.affectsTypes = affectsTypes;
      this.method = method;
      this.destroyCR = destroyCR;
    }
    getAffected() {
      return this.g.getInside(getTurnUndeadArea(this.actor)).filter((who) => this.affectsTypes.includes(who.type));
    }
    getTargets() {
      return [];
    }
    async applyEffect() {
      const { g, actor: attacker, method, destroyCR } = this;
      const type = method.getSaveType(attacker);
      for (const who of this.getAffected()) {
        const effect = TurnedEffect;
        const config = {
          turner: attacker,
          duration: minutes(1)
        };
        const { outcome } = await g.save({
          source: this,
          type,
          attacker,
          who,
          ability: "wis",
          method,
          effect,
          config,
          tags: ["frightened"]
        });
        if (outcome === "fail") {
          if (who.cr < destroyCR && await g.kill(who, attacker))
            return;
          await who.addEffect(effect, config, attacker);
        }
      }
    }
  };
  var TurnUndead = new SimpleFeature(
    "Turn Undead",
    `As an action, you present your holy symbol and speak a prayer censuring the undead. Each undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
    (g, me) => {
      const destroyCr = getDestroyUndeadCR(me.getClassLevel("Cleric", 2));
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new TurnUndeadAction(
              g,
              who,
              ["undead"],
              ClericSpellcasting,
              destroyCr
            )
          );
      });
    }
  );
  var TurnUndead_default = TurnUndead;

  // src/classes/cleric/index.ts
  var ClericSpellcasting = new NormalSpellcasting(
    "Cleric",
    `As a conduit for divine power, you can cast cleric spells.`,
    "wis",
    "full",
    "Cleric",
    "Cleric"
  );
  var CantripVersatility = nonCombatFeature(
    "Cantrip Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the cleric spell list.`
  );
  var DivineIntervention = notImplementedFeature(
    "Divine Intervention",
    `Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great.

Imploring your deity's aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The DM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate. If your deity intervenes, you can't use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.

At 20th level, your call for intervention succeeds automatically, no roll required.`
  );
  var ASI4 = makeASI("Cleric", 4);
  var ASI8 = makeASI("Cleric", 8);
  var ASI12 = makeASI("Cleric", 12);
  var ASI16 = makeASI("Cleric", 16);
  var ASI19 = makeASI("Cleric", 19);
  var Cleric = {
    name: "Cleric",
    hitDieSize: 8,
    armor: acSet("light", "medium", "shield"),
    weaponCategory: wcSet("simple"),
    save: abSet("wis", "cha"),
    skill: gains([], 2, [
      "History",
      "Insight",
      "Medicine",
      "Persuasion",
      "Religion"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([["wis", 13]]),
      armor: acSet("light", "medium", "shield")
    },
    features: /* @__PURE__ */ new Map([
      [1, [ClericSpellcasting.feature]],
      [2, [ChannelDivinity_default, TurnUndead_default, HarnessDivinePower_default]],
      [4, [ASI4, CantripVersatility]],
      [8, [ASI8]],
      [10, [DivineIntervention]],
      [12, [ASI12]],
      [16, [ASI16]],
      [19, [ASI19]]
    ])
  };
  var cleric_default = Cleric;

  // src/img/class/druid.svg
  var druid_default2 = "./druid-V7AHPEVM.svg";

  // src/classes/druid/common.ts
  var DruidIcon = makeIcon(druid_default2, ClassColours.Druid);

  // src/ai/data.ts
  var defaultAIRules = [new HealingRule(), new DamageRule()];

  // src/Monster.ts
  var Monster = class extends CombatantBase {
    constructor(g, name, cr, type, size, img, hpMax, rules = defaultAIRules) {
      super(g, name, {
        type,
        size,
        img,
        side: 1,
        cr,
        hpMax,
        rules
      });
    }
    don(item, giveProficiency = false) {
      if (giveProficiency)
        this.addProficiency(item, "proficient");
      return super.don(item);
    }
    give(item, quantity = 1, giveProficiency = false) {
      if (giveProficiency)
        this.addProficiency(item, "proficient");
      return this.addToInventory(item, quantity);
    }
    getInventoryItem(name) {
      for (const [item] of this.inventory) {
        if (item.name === name)
          return item;
      }
      throw new Error(`${this.name} does not have ${name} in inventory`);
    }
  };

  // src/items/ItemBase.ts
  var ItemBase = class {
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
    addEnchantment(e2) {
      this.enchantments.add(e2);
      e2.setup(this.g, this);
      return this;
    }
  };

  // src/items/WeaponBase.ts
  var WeaponBase = class extends ItemBase {
    constructor(g, name, category, rangeCategory, damage, properties, iconUrl, shortRange, longRange, weaponType = name) {
      super(g, "weapon", name, 1, iconUrl);
      this.g = g;
      this.category = category;
      this.rangeCategory = rangeCategory;
      this.damage = damage;
      this.shortRange = shortRange;
      this.longRange = longRange;
      this.weaponType = weaponType;
      this.properties = new Set(properties);
    }
    get reach() {
      return this.properties.has("reach") ? 5 : 0;
    }
  };

  // src/monsters/NaturalWeapon.ts
  var NaturalWeapon = class extends WeaponBase {
    constructor(g, name, toHit, damage, { onHit } = {}) {
      super(g, name, "natural", "melee", damage);
      if (typeof toHit === "string")
        this.forceAbilityScore = toHit;
      else {
        console.warn(`Natural Weapon "{name}" is modifier-based`);
      }
      if (onHit)
        g.events.on(
          "CombatantDamaged",
          ({ detail: { attack, interrupt, who } }) => {
            if ((attack == null ? void 0 : attack.roll.type.weapon) === this)
              interrupt.add(
                new EvaluateLater(
                  attack.roll.type.who,
                  this,
                  Priority_default.Normal,
                  async () => onHit(who, attack.roll.type.who)
                )
              );
          }
        );
    }
  };

  // src/enchantments/adamantine.ts
  var adamantine = {
    name: "adamantine",
    setup(g, item) {
      item.name = `adamantine ${item.name}`;
      item.rarity = "Uncommon";
      g.events.on("Attack", ({ detail: { roll, outcome } }) => {
        if (roll.type.target.armor === item)
          outcome.ignoreValue("critical");
      });
    }
  };
  var adamantine_default = adamantine;

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
          if (weapon === item && (attacker == null ? void 0 : attacker.attunements.has(weapon)))
            interrupt.add(
              new EvaluateLater(attacker, this, Priority_default.Normal, async () => {
                const damageType = "radiant";
                map.add(
                  damageType,
                  await g.rollDamage(
                    1,
                    {
                      source: darkSun,
                      size: 10,
                      attacker,
                      damageType,
                      tags: atSet("magical")
                    },
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
    name: "weapon of the deep",
    setup(g, item) {
      item.name = `${item.name} of the deep`;
      item.magical = true;
      item.rarity = "Rare";
      if (item.icon)
        item.icon.colour = ItemRarityColours.Rare;
      let charges = 1;
      g.events.on(
        "Attack",
        ({
          detail: {
            interrupt,
            roll: {
              type: { weapon, who: attacker, target }
            }
          }
        }) => {
          if (charges && weapon === item)
            interrupt.add(
              new YesNoChoice(
                attacker,
                ofTheDeep,
                item.name,
                "Speak the command word and emit a spray of acid?",
                Priority_default.Late,
                async () => {
                  charges--;
                  const damage = await g.rollDamage(4, {
                    attacker,
                    damageType: "acid",
                    size: 6,
                    source: ofTheDeep,
                    tags: atSet("magical")
                  });
                  const targets = g.getInside(
                    { type: "within", radius: 10, who: target },
                    [attacker]
                  );
                  for (const target2 of targets) {
                    const { damageResponse } = await g.save({
                      source: ofTheDeep,
                      type: { type: "flat", dc: 13 },
                      attacker,
                      who: target2,
                      ability: "dex",
                      tags: ["magic"]
                    });
                    await g.damage(
                      ofTheDeep,
                      "acid",
                      { attacker, target: target2 },
                      [["acid", damage]],
                      damageResponse
                    );
                  }
                }
              )
            );
        }
      );
    }
  };
  var ofTheDeep_default = ofTheDeep;

  // src/enchantments/resistantArmor.ts
  var resistanceTo = (type) => ({
    name: `${type} resistance`,
    setup(g, item) {
      item.name = `${item.name} of resistance to ${type}`;
      item.rarity = "Rare";
      item.attunement = true;
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (isEquipmentAttuned(item, who) && damageType === type)
            response.add("resist", this);
        }
      );
    }
  });
  var acidResistance = resistanceTo("acid");
  var coldResistance = resistanceTo("cold");
  var fireResistance = resistanceTo("fire");
  var forceResistance = resistanceTo("force");
  var lightningResistance = resistanceTo("lightning");
  var necroticResistance = resistanceTo("necrotic");
  var poisonResistance = resistanceTo("poison");
  var psychicResistance = resistanceTo("psychic");
  var radiantResistance = resistanceTo("radiant");
  var thunderResistance = resistanceTo("thunder");
  var vulnerability = (type) => ({
    name: `vulnerability (${type})`,
    setup(g, item) {
      item.name = `${item.name} of vulnerability (${type})`;
      item.rarity = "Rare";
      item.attunement = true;
      item.cursed = true;
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who.attunements.has(item) && isA(damageType, MundaneDamageTypes))
            response.add(damageType === type ? "resist" : "vulnerable", this);
        }
      );
    }
  });
  var vulnerabilityBludgeoning = vulnerability("bludgeoning");
  var vulnerabilityPiercing = vulnerability("piercing");
  var vulnerabilitySlashing = vulnerability("slashing");

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
  var getOptionFromRoll = (roll) => makeStringChoice(chaoticBurstTypes[roll - 1]);
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
              size: 8,
              tags: atSet("magical")
            }).values.final;
            const b = g.dice.roll({
              source: chaoticBurst,
              type: "damage",
              attacker,
              size: 8,
              tags: atSet("magical")
            }).values.final;
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
                  Priority_default.Normal,
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
        if (weapon === item && (attack == null ? void 0 : attack.roll.values.final) === 20)
          bonus.add(7, vicious);
      });
    }
  };

  // src/data/allEnchantments.ts
  var allEnchantments = {
    // armor
    adamantine: adamantine_default,
    "+1 armor": armorPlus1,
    "+2 armor": armorPlus2,
    "+3 armor": armorPlus3,
    "acid resistance": acidResistance,
    "cold resistance": coldResistance,
    "fire resistance": fireResistance,
    "force resistance": forceResistance,
    "lightning resistance": lightningResistance,
    "necrotic resistance": necroticResistance,
    "poison resistance": poisonResistance,
    "psychic resistance": psychicResistance,
    "radiant resistance": radiantResistance,
    "thunder resistance": thunderResistance,
    "vulnerability (bludgeoning)": vulnerabilityBludgeoning,
    "vulnerability (piercing)": vulnerabilityPiercing,
    "vulnerability (slashing)": vulnerabilitySlashing,
    // weapon
    "+1 weapon": weaponPlus1,
    "+2 weapon": weaponPlus2,
    "+3 weapon": weaponPlus3,
    "chaotic burst": chaoticBurst,
    silvered: silvered_default,
    vicious,
    // homebrew
    "dark sun": darkSun_default,
    "of the deep": ofTheDeep_default
  };
  var allEnchantments_default = allEnchantments;

  // src/img/eq/arrow.svg
  var arrow_default = "./arrow-RG5OYDZ5.svg";

  // src/img/eq/bolt.svg
  var bolt_default = "./bolt-RV5OQWXW.svg";

  // src/items/AmmoBase.ts
  var AmmoBase = class extends ItemBase {
    constructor(g, name, ammunitionTag, iconUrl) {
      super(g, "ammo", name, 0, iconUrl);
      this.ammunitionTag = ammunitionTag;
    }
  };

  // src/items/ammunition.ts
  var Arrow = class extends AmmoBase {
    constructor(g) {
      super(g, "arrow", "bow", arrow_default);
    }
  };
  var BlowgunNeedle = class extends AmmoBase {
    constructor(g) {
      super(g, "blowgun needle", "blowgun");
    }
  };
  var CrossbowBolt = class extends AmmoBase {
    constructor(g) {
      super(g, "crossbow bolt", "crossbow", bolt_default);
    }
  };
  var SlingBullet = class extends AmmoBase {
    constructor(g) {
      super(g, "sling bullet", "sling");
    }
  };

  // src/items/ArmorBase.ts
  var ArmorBase = class extends ItemBase {
    constructor(g, name, category, ac, metal, stealthDisadvantage = false, minimumStrength = 0, iconUrl) {
      super(g, "armor", name, 0, iconUrl);
      this.category = category;
      this.ac = ac;
      this.metal = metal;
      this.stealthDisadvantage = stealthDisadvantage;
      this.minimumStrength = minimumStrength;
    }
  };

  // src/items/armor.ts
  var PaddedArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "padded armor", "light", 11, false, true);
    }
  };
  var LeatherArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "leather armor", "light", 11, false);
    }
  };
  var StuddedLeatherArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "studded leather armor", "light", 12, false);
    }
  };
  var HideArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "hide armor", "medium", 12, false);
    }
  };
  var ChainShirtArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "chain shirt armor", "medium", 13, true);
    }
  };
  var ScaleMailArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "scale mail armor", "medium", 14, true, true);
    }
  };
  var BreastplateArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "breastplate armor", "medium", 14, true);
    }
  };
  var HalfPlateArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "half plate armor", "medium", 15, true, true);
    }
  };
  var RingMailArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "ring mail armor", "heavy", 14, true, true);
    }
  };
  var ChainMailArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "chain mail armor", "heavy", 16, true, true, 13);
    }
  };
  var SplintArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "splint armor", "heavy", 17, true, true, 15);
    }
  };
  var PlateArmor = class extends ArmorBase {
    constructor(g) {
      super(g, "plate armor", "heavy", 18, true, true, 15);
    }
  };
  var Shield2 = class extends ArmorBase {
    constructor(g, iconUrl) {
      super(g, "shield", "shield", 2, true, false, void 0, iconUrl);
      this.hands = 1;
    }
  };

  // src/resolvers/MultiChoiceResolver.ts
  var MultiChoiceResolver = class {
    constructor(g, name, entries, minimum, maximum) {
      this.g = g;
      this.name = name;
      this.entries = entries;
      this.minimum = minimum;
      this.maximum = maximum;
      this.type = "Choices";
    }
    check(value, action, ec) {
      if (this.entries.length === 0)
        ec.add("No valid choices", this);
      else if (!Array.isArray(value))
        ec.add("No choices", this);
      else {
        if (value.length < this.minimum)
          ec.add(
            `At least ${this.minimum} ${plural("choice", this.minimum)}`,
            this
          );
        if (value.length > this.maximum)
          ec.add(
            `At most ${this.maximum} ${plural("choice", this.maximum)}`,
            this
          );
      }
      return ec;
    }
  };

  // src/items/WondrousItemBase.ts
  var WondrousItemBase = class extends ItemBase {
    constructor(g, name, hands = 0, iconUrl) {
      super(g, "wondrous", name, hands, iconUrl);
    }
  };

  // src/items/bgdia.ts
  var GauntletsOfFlamingFuryEffect = new Effect(
    "Gauntlets of Flaming Fury",
    "turnEnd",
    (g) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, target, weapon, interrupt, map } }) => {
          const config = attacker == null ? void 0 : attacker.getEffectConfig(GauntletsOfFlamingFuryEffect);
          if (attacker && weapon && (config == null ? void 0 : config.weapons.has(weapon)))
            interrupt.add(
              new EvaluateLater(
                attacker,
                config.gauntlet,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(1, {
                    size: 6,
                    attacker,
                    damageType: "fire",
                    source: config.gauntlet,
                    tags: atSet("magical"),
                    target
                  });
                  map.add("fire", amount);
                }
              )
            );
        }
      );
    },
    { tags: ["magic"] }
  );
  var GauntletsOfFlamingFuryResource = new DawnResource(
    "Gauntlets of Flaming Fury",
    1
  );
  var GauntletsOfFlamingFuryAction = class extends AbstractSelfAction {
    constructor(g, actor, gauntlet) {
      super(
        g,
        actor,
        "Gauntlets of Flaming Fury",
        "implemented",
        {
          weapons: new MultiChoiceResolver(
            g,
            "Weapons",
            actor.weapons.filter(
              (w) => w.category !== "natural" && w.rangeCategory === "melee"
            ).map((value) => ({ label: value.name, value })),
            1,
            2
          )
        },
        {
          description: `As a bonus action, you can use the gauntlets to cause magical flames to envelop one or two melee weapons in your grasp. Each flaming weapon deals an extra 1d6 fire damage on a hit. The flames last until you sheath or let go of either weapon. Once used, this property can't be used again until the next dawn.`,
          resources: [[GauntletsOfFlamingFuryResource, 1]],
          time: "bonus action"
        }
      );
      this.gauntlet = gauntlet;
    }
    async applyEffect({ weapons }) {
      const { gauntlet, actor } = this;
      await actor.addEffect(GauntletsOfFlamingFuryEffect, {
        duration: Infinity,
        gauntlet,
        weapons: new Set(weapons)
      });
    }
  };
  var GauntletsOfFlamingFury = class extends WondrousItemBase {
    constructor(g) {
      super(g, "gauntlets of flaming fury");
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("BeforeAttack", ({ detail: { who, weapon, tags } }) => {
        if (isEquipmentAttuned(this, who) && (weapon == null ? void 0 : weapon.category) !== "natural")
          tags.add("magical");
      });
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who))
          who.initResource(GauntletsOfFlamingFuryResource);
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (isEquipmentAttuned(this, who))
          actions.push(new GauntletsOfFlamingFuryAction(g, who, this));
      });
    }
  };

  // src/items/ggr.ts
  var PariahsShieldAction = class extends AbstractSingleTargetAction {
    constructor(g, actor, gather) {
      super(
        g,
        actor,
        "Pariah's Shield",
        "implemented",
        { target: new TargetResolver(g, 5, [canSee, notSelf]) },
        {
          description: `When a creature you can see within 5 feet of you takes damage, you can use your reaction to take that damage, instead of the creature taking it. When you do so, the damage type changes to force.`,
          time: "reaction"
        }
      );
      this.gather = gather;
    }
    async applyEffect() {
      const { g, actor, gather } = this;
      if (!gather)
        throw new Error(`PariahsShield.apply() without GatherDamage`);
      const total = getTotalDamage(gather);
      if (total > 0) {
        gather.multiplier.add("zero", this);
        await g.damage(this, "force", { target: actor }, [["force", total]]);
      }
    }
  };
  var PariahsShield = class extends Shield2 {
    constructor(g) {
      super(g);
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("GetAC", ({ detail: { who, bonus } }) => {
        if (isEquipmentAttuned(this, who)) {
          const allies = Array.from(g.combatants).filter(
            (other) => other.side === who.side && other !== who && distance(who, other) <= 5
          ).length;
          const value = clamp(Math.floor(allies / 2), 0, 3);
          if (value)
            bonus.add(value, this);
        }
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (isEquipmentAttuned(this, who))
          actions.push(new PariahsShieldAction(g, who));
      });
      g.events.on("GatherDamage", ({ detail }) => {
        for (const who of g.combatants) {
          if (isEquipmentAttuned(this, who)) {
            const action = new PariahsShieldAction(g, who, detail);
            const config = { target: detail.target };
            if (checkConfig(g, action, config))
              detail.interrupt.add(
                new YesNoChoice(
                  who,
                  this,
                  "Pariah's Shield",
                  "...",
                  Priority_default.Late,
                  () => g.act(action, config),
                  void 0,
                  () => getTotalDamage(detail) > 0
                ).setDynamicText(
                  () => `${detail.target.name} is about to take ${getTotalDamage(detail)} damage. Should ${action.actor.name} use their reaction to take it for them as force damage?`
                )
              );
          }
        }
      });
    }
  };

  // src/items/srd/armor.ts
  var ElvenChain = class extends ChainShirtArmor {
    constructor(g) {
      super(g);
      this.rarity = "Rare";
      this.ac++;
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (who.armor === this)
          who.armorProficiencies.add(this.category);
      });
    }
  };

  // src/items/AbstractPotion.ts
  var DrinkAction = class extends AbstractSelfAction {
    constructor(g, actor, item) {
      super(
        g,
        actor,
        `Drink (${item.name})`,
        item.status,
        {},
        { time: "action", description: item.description }
      );
      this.item = item;
    }
    async applyEffect() {
      this.actor.removeFromInventory(this.item);
      await this.item.apply(this.actor, this);
    }
  };
  var AbstractPotion = class extends ItemBase {
    constructor(g, name, rarity, status = "missing", description, iconUrl) {
      super(g, "potion", name, 0, iconUrl);
      this.rarity = rarity;
      this.status = status;
      this.description = description;
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who.inventory.has(this))
          actions.push(this.getDrinkAction(who));
      });
    }
    getDrinkAction(actor) {
      return new DrinkAction(this.g, actor, this);
    }
  };

  // src/items/srd/common.ts
  var GiantStats = {
    Hill: { str: 21, potionRarity: "Uncommon", beltRarity: "Rare" },
    Stone: { str: 23, potionRarity: "Rare", beltRarity: "Very Rare" },
    Frost: { str: 23, potionRarity: "Rare", beltRarity: "Very Rare" },
    Fire: { str: 25, potionRarity: "Rare", beltRarity: "Very Rare" },
    Cloud: { str: 27, potionRarity: "Very Rare", beltRarity: "Legendary" },
    Storm: { str: 29, potionRarity: "Legendary", beltRarity: "Legendary" }
  };

  // src/items/srd/potions.ts
  var PotionOfGiantStrength = class extends AbstractPotion {
    constructor(g, type) {
      super(
        g,
        `Potion of ${type} Giant Strength`,
        GiantStats[type].potionRarity,
        "missing",
        `When you drink this potion, your Strength score changes to ${GiantStats[type].str} for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.`
      );
      this.type = type;
    }
    async apply() {
    }
  };
  var HealingPotionData = {
    standard: { name: "Potion of Healing", rarity: "Common", dice: 2, bonus: 2 },
    greater: {
      name: "Potion of Greater Healing",
      rarity: "Uncommon",
      dice: 4,
      bonus: 4
    },
    superior: {
      name: "Potion of Superior Healing",
      rarity: "Rare",
      dice: 8,
      bonus: 8
    },
    supreme: {
      name: "Potion of Supreme Healing",
      rarity: "Very Rare",
      dice: 10,
      bonus: 20
    }
  };
  var PotionOfHealing = class extends AbstractPotion {
    constructor(g, type) {
      super(
        g,
        HealingPotionData[type].name,
        HealingPotionData[type].rarity,
        "implemented"
      );
      this.type = type;
      const { dice, bonus } = HealingPotionData[type];
      this.description = `You regain ${dice}d4 + ${bonus} hit points when you drink this potion. The potion's red liquid glimmers when agitated.`;
    }
    async apply(actor, action) {
      const { dice, bonus } = HealingPotionData[this.type];
      const rolled = await this.g.rollHeal(dice, {
        size: 4,
        source: this,
        actor,
        target: actor
      });
      await this.g.heal(this, rolled + bonus, {
        action,
        actor,
        target: actor
      });
    }
    getDrinkAction(actor) {
      const action = super.getDrinkAction(actor);
      action.time = "bonus action";
      return action;
    }
  };

  // src/img/eq/arrow-catching-shield.svg
  var arrow_catching_shield_default = "./arrow-catching-shield-KQXUUCHG.svg";

  // src/items/srd/shields.ts
  var acsIcon = makeIcon(arrow_catching_shield_default, ItemRarityColours.Rare);
  var ArrowCatchingShieldAction = class extends AbstractSingleTargetAction {
    constructor(g, actor, attack) {
      super(
        g,
        actor,
        "Arrow-Catching Shield",
        "implemented",
        { target: new TargetResolver(g, 5, [notSelf]) },
        // TODO isAlly?
        {
          time: "reaction",
          icon: acsIcon,
          description: `Whenever an attacker makes a ranged attack against a target within 5 feet of you, you can use your reaction to become the target of the attack instead.`
        }
      );
      this.attack = attack;
    }
    async applyEffect() {
      if (!this.attack)
        throw new Error(`No attack to modify.`);
      this.g.text(
        new MessageBuilder().co(this.actor).text(" redirects the attack on").sp().co(this.attack.target).text(" to themselves.")
      );
      this.attack.target = this.actor;
    }
  };
  var ArrowCatchingShield = class extends Shield2 {
    constructor(g) {
      super(g, arrow_catching_shield_default);
      this.name = "Arrow-Catching Shield";
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("GetAC", ({ detail: { who, pre, bonus } }) => {
        if (isEquipmentAttuned(this, who) && (pre == null ? void 0 : pre.tags.has("ranged")))
          bonus.add(2, this);
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (isEquipmentAttuned(this, who))
          actions.push(new ArrowCatchingShieldAction(g, who));
      });
      g.events.on("BeforeAttack", ({ detail }) => {
        if (isEquipmentAttuned(this, this.possessor) && detail.tags.has("ranged")) {
          const config = { target: detail.target };
          const action = new ArrowCatchingShieldAction(g, this.possessor, detail);
          if (checkConfig(g, action, config))
            detail.interrupt.add(
              new YesNoChoice(
                this.possessor,
                this,
                this.name,
                `${detail.who.name} is attacking ${detail.target.name} at range. Use ${this.possessor.name}'s reaction to become the target of the attack instead?`,
                Priority_default.ChangesTarget,
                () => g.act(action, config)
              )
            );
        }
      });
    }
  };

  // src/types/CombatantTag.ts
  var cmSet = (...items) => new Set(items);

  // src/types/LanguageName.ts
  var StandardLanguages = [
    "Common",
    "Dwarvish",
    "Elvish",
    "Giant",
    "Gnomish",
    "Goblin",
    "Halfling",
    "Orc"
  ];
  var ExoticLanguages = [
    "Abyssal",
    "Celestial",
    "Draconic",
    "Deep Speech",
    "Gith",
    "Infernal",
    "Primordial",
    "Sylvan",
    "Undercommon"
  ];
  var PrimordialDialects = [
    "Aquan",
    "Auran",
    "Ignan",
    "Terran"
  ];
  var LanguageNames = [
    ...StandardLanguages,
    ...ExoticLanguages,
    ...PrimordialDialects,
    "Druidic",
    "Thieves' Cant"
  ];
  var laSet = (...items) => new Set(items);

  // src/races/common.ts
  function poisonResistanceFeature(name, text) {
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
  var ExtraLanguage = new ConfiguredFeature(
    "Extra Language",
    `You can speak, read, and write one extra language of your choice.`,
    (g, me, language) => {
      me.languages.add(language);
    }
  );
  var FeyAncestry = new SimpleFeature(
    "Fey Ancestry",
    `You have advantage on saving throws against being charmed, and magic can't put you to sleep.`,
    (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
        var _a;
        if (who === me && ((_a = config == null ? void 0 : config.conditions) == null ? void 0 : _a.has("Charmed")))
          diceType.add("advantage", FeyAncestry);
      });
      g.events.on("BeforeEffect", ({ detail: { who, effect, success } }) => {
        if (who === me && effect.tags.has("magic") && effect.tags.has("sleep"))
          success.add("fail", FeyAncestry);
      });
    }
  );

  // src/races/Dwarf.ts
  var DwarvenResilience = poisonResistanceFeature(
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
      me.addProficiency(tool, "proficient");
    }
  );
  var Stonecunning = nonCombatFeature(
    "Stonecunning",
    `Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.`
  );
  var Dwarf = {
    name: "Dwarf",
    abilities: /* @__PURE__ */ new Map([["con", 2]]),
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 25]]),
    features: /* @__PURE__ */ new Set([
      Darkvision60,
      DwarvenResilience,
      DwarvenCombatTraining,
      ToolProficiency,
      Stonecunning
    ]),
    languages: laSet("Common", "Dwarvish"),
    tags: cmSet("dwarf")
  };
  var DwarvenToughness = new SimpleFeature(
    "Dwarven Toughness",
    `Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.`,
    (g, me) => {
      me.baseHpMax += me.level;
    }
  );
  var HillDwarf = {
    parent: Dwarf,
    name: "Hill Dwarf",
    abilities: /* @__PURE__ */ new Map([["wis", 1]]),
    size: SizeCategory_default.Medium,
    features: /* @__PURE__ */ new Set([DwarvenToughness])
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
    size: SizeCategory_default.Medium,
    features: /* @__PURE__ */ new Set([DwarvenArmorTraining])
  };

  // src/items/srd/wondrous/BeltOfDwarvenkind.ts
  var BeltOfDwarvenkind = class extends WondrousItemBase {
    constructor(g) {
      super(g, "belt of dwarvenkind");
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who)) {
          who.con.score += 2;
          if (!who.tags.has("dwarf")) {
            who.addFeature(DwarvenResilience);
            who.addFeature(Darkvision60);
            who.languages.add("Dwarvish");
          }
        }
      });
      g.events.on(
        "BeforeCheck",
        ({ detail: { skill, ability, who, diceType, target } }) => {
          if (isEquipmentAttuned(this, who) && skill === "Persuasion" && ability === "cha" && (target == null ? void 0 : target.tags.has("dwarf")))
            diceType.add("advantage", this);
        }
      );
    }
  };

  // src/items/srd/wondrous/BootsOfTheWinterlands.ts
  var BootsOfTheWinterlands = class extends WondrousItemBase {
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

  // src/items/srd/wondrous/BracersOfArchery.ts
  var BracersOfArchery = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Bracers of Archery");
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who)) {
          who.weaponProficiencies.add("longbow");
          who.weaponProficiencies.add("shortbow");
        }
      });
      g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
        if (isEquipmentAttuned(this, attacker) && (weapon == null ? void 0 : weapon.ammunitionTag) === "bow")
          bonus.add(2, this);
      });
    }
  };

  // src/items/srd/wondrous/BracersOfDefense.ts
  var BracersOfDefense = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Bracers of Defense");
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("GetAC", ({ detail: { who, bonus } }) => {
        if (isEquipmentAttuned(this, who) && !who.armor && !who.shield)
          bonus.add(2, this);
      });
    }
  };

  // src/items/srd/wondrous/BroochOfShielding.ts
  var BroochOfShielding = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Brooch of Shielding");
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, source, damageType, response } }) => {
          if (isEquipmentAttuned(this, who)) {
            if (source === MagicMissile_default)
              response.add("immune", this);
            else if (damageType === "force")
              response.add("resist", this);
          }
        }
      );
    }
  };

  // src/img/eq/hood.svg
  var hood_default = "./hood-7E4VG7WM.svg";

  // src/items/srd/wondrous/CloakOfElvenkind.ts
  var CloakHoodAction = class extends AbstractSelfAction {
    constructor(g, actor, cloak) {
      super(
        g,
        actor,
        cloak.hoodUp ? "Pull Hood Down" : "Pull Hood Up",
        "incomplete",
        {},
        {
          icon: cloak.icon,
          time: "action",
          description: `While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you.`
        }
      );
      this.cloak = cloak;
    }
    async applyEffect() {
      this.cloak.hoodUp = !this.cloak.hoodUp;
      this.g.text(
        new MessageBuilder().co(this.actor).text(
          this.cloak.hoodUp ? " pulls the hood of their cloak up." : " pulls the hood of their cloak down."
        )
      );
    }
  };
  var CloakOfElvenkind = class extends WondrousItemBase {
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

  // src/items/srd/wondrous/CloakOfProtection.ts
  var CloakOfProtection = class extends WondrousItemBase {
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

  // src/items/srd/wondrous/DimensionalShackles.ts
  var DimensionalShackles = class extends WondrousItemBase {
    constructor(g) {
      super(g, "dimensional shackles");
      this.rarity = "Rare";
    }
  };

  // src/items/srd/wondrous/FigurineOfWondrousPower.ts
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
  var FigurineOfWondrousPower = class extends WondrousItemBase {
    constructor(g, type) {
      super(g, `Figurine of Wondrous Power, ${type}`, 0);
      this.type = type;
      this.rarity = FigurineData[type].rarity;
    }
  };

  // src/items/srd/wondrous/iounStones.ts
  var AbilityIounStone = class extends WondrousItemBase {
    constructor(g, name, ability) {
      super(g, `Ioun stone of ${name}`);
      this.attunement = true;
      this.rarity = "Very Rare";
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who))
          who[ability].score += 2;
      });
    }
  };
  var iounStoneOfAgility = (g) => new AbilityIounStone(g, "Agility", "dex");
  var iounStoneOfFortitude = (g) => new AbilityIounStone(g, "Fortitude", "con");
  var iounStoneOfInsight = (g) => new AbilityIounStone(g, "Insight", "wis");
  var iounStoneOfIntellect = (g) => new AbilityIounStone(g, "Intellect", "int");
  var iounStoneOfLeadership = (g) => new AbilityIounStone(g, "Leadership", "cha");
  var iounStoneOfStrength = (g) => new AbilityIounStone(g, "Strength", "str");
  var IounStoneOfMastery = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Ioun stone of mastery");
      this.attunement = true;
      this.rarity = "Legendary";
      const handler = ({
        detail
      }) => {
        if (isEquipmentAttuned(this, detail.who))
          detail.pb.add(1, this);
      };
      g.events.on("BeforeAttack", handler);
      g.events.on("BeforeCheck", handler);
      g.events.on("BeforeSave", handler);
    }
  };
  var IounStoneOfProtection = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Ioun stone of protection");
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("GetAC", ({ detail: { who, bonus } }) => {
        if (isEquipmentAttuned(this, who))
          bonus.add(1, this);
      });
    }
  };

  // src/items/srd/wondrous/minimumScoreItems.ts
  var BaseStatItem = class extends WondrousItemBase {
    constructor(g, name, ability, score, rarity = "Rare") {
      super(g, name);
      this.attunement = true;
      this.rarity = rarity;
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who))
          who[ability].minimum = score;
      });
    }
  };
  var AmuletOfHealth = class extends BaseStatItem {
    constructor(g) {
      super(g, "Amulet of Health", "con", 19);
    }
  };
  var BeltOfGiantStrength = class extends BaseStatItem {
    constructor(g, type) {
      super(
        g,
        `Belt of ${type} Giant Strength`,
        "str",
        GiantStats[type].str,
        GiantStats[type].beltRarity
      );
      this.type = type;
    }
  };
  var GauntletsOfOgrePower = class extends BaseStatItem {
    constructor(g) {
      super(g, "Gauntlets of Ogre Power", "str", 19);
    }
  };
  var HeadbandOfIntellect = class extends BaseStatItem {
    constructor(g) {
      super(g, "Headband of Intellect", "int", 19);
    }
  };

  // src/items/WandBase.ts
  var WandBase = class extends WondrousItemBase {
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

  // src/items/srd/wondrous/wands.ts
  var WandOfWeb = class extends WandBase {
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

  // src/img/eq/club.svg
  var club_default = "./club-RZOLCPSS.svg";

  // src/img/eq/dagger.svg
  var dagger_default = "./dagger-MXNNR43U.svg";

  // src/img/eq/greataxe.svg
  var greataxe_default = "./greataxe-D7DZHVBT.svg";

  // src/img/eq/light-crossbow.svg
  var light_crossbow_default = "./light-crossbow-PIY5SWC5.svg";

  // src/img/eq/longbow.svg
  var longbow_default = "./longbow-2S2OQHMY.svg";

  // src/img/eq/longsword.svg
  var longsword_default = "./longsword-B4PZKYLG.svg";

  // src/img/eq/mace.svg
  var mace_default = "./mace-VW7F6EMI.svg";

  // src/img/eq/quarterstaff.svg
  var quarterstaff_default = "./quarterstaff-EMYY63PI.svg";

  // src/img/eq/rapier.svg
  var rapier_default = "./rapier-ZROPHPFJ.svg";

  // src/img/eq/spear.svg
  var spear_default = "./spear-JE22DTMJ.svg";

  // src/img/eq/trident.svg
  var trident_default = "./trident-XL6WP2YY.svg";

  // src/items/weapons.ts
  var Club = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "club",
        "simple",
        "melee",
        _dd(1, 4, "bludgeoning"),
        ["light"],
        club_default
      );
    }
  };
  var Dagger = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "dagger",
        "simple",
        "melee",
        _dd(1, 4, "piercing"),
        ["finesse", "light", "thrown"],
        dagger_default,
        20,
        60
      );
    }
  };
  var Greatclub = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "greatclub",
        "simple",
        "melee",
        _dd(1, 8, "bludgeoning"),
        ["two-handed"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Handaxe = class extends WeaponBase {
    constructor(g) {
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
    }
  };
  var Javelin = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "javelin",
        "simple",
        "melee",
        _dd(1, 6, "piercing"),
        ["thrown"],
        void 0,
        // TODO [ICON]
        30,
        120
      );
    }
  };
  var LightHammer = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "light hammer",
        "simple",
        "melee",
        _dd(1, 4, "bludgeoning"),
        ["light", "thrown"],
        void 0,
        // TODO [ICON]
        20,
        60
      );
    }
  };
  var Mace = class extends WeaponBase {
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
  var Quarterstaff = class extends WeaponBase {
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
  var Sickle = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "sickle",
        "simple",
        "melee",
        _dd(1, 4, "slashing"),
        ["light"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Spear = class extends WeaponBase {
    constructor(g) {
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
    }
  };
  var LightCrossbow = class extends WeaponBase {
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
  var Dart = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "dart",
        "simple",
        "ranged",
        _dd(1, 4, "piercing"),
        ["finesse", "thrown"],
        void 0,
        // TODO [ICON]
        20,
        60
      );
    }
  };
  var Shortbow = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "shortbow",
        "simple",
        "ranged",
        _dd(1, 6, "piercing"),
        ["ammunition", "two-handed"],
        void 0,
        // TODO [ICON]
        80,
        320
      );
      this.ammunitionTag = "bow";
    }
  };
  var Sling = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "sling",
        "simple",
        "ranged",
        _dd(1, 4, "bludgeoning"),
        ["ammunition"],
        void 0,
        // TODO [ICON]
        30,
        120
      );
      this.ammunitionTag = "sling";
    }
  };
  var Battleaxe = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "battleaxe",
        "martial",
        "melee",
        _dd(1, 8, "slashing"),
        ["versatile"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Flail = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "flail",
        "martial",
        "melee",
        _dd(1, 8, "bludgeoning"),
        void 0
        // TODO [ICON]
      );
    }
  };
  var Glaive = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "glaive",
        "martial",
        "melee",
        _dd(1, 10, "slashing"),
        ["heavy", "reach", "two-handed"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Greataxe = class extends WeaponBase {
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
  var Greatsword = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "greatsword",
        "martial",
        "melee",
        _dd(2, 6, "slashing"),
        ["heavy", "two-handed"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Halberd = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "halberd",
        "martial",
        "melee",
        _dd(1, 10, "slashing"),
        ["heavy", "reach", "two-handed"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Lance = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "lance",
        "martial",
        "melee",
        _dd(1, 12, "piercing"),
        ["reach"],
        void 0
        // TODO [ICON]
      );
      g.events.on(
        "BeforeAttack",
        ({ detail: { weapon, who, target, diceType } }) => {
          if (weapon === this && distance(who, target) <= 5)
            diceType.add("disadvantage", this);
        }
      );
    }
  };
  var Longsword = class extends WeaponBase {
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
  var Maul = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "maul",
        "martial",
        "melee",
        _dd(2, 6, "bludgeoning"),
        ["heavy", "two-handed"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Morningstar = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "morningstar",
        "martial",
        "melee",
        _dd(1, 8, "piercing"),
        void 0,
        void 0
        // TODO [ICON]
      );
    }
  };
  var Pike = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "pike",
        "martial",
        "melee",
        _dd(1, 10, "piercing"),
        ["heavy", "reach", "two-handed"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Rapier = class extends WeaponBase {
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
  var Scimitar = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "scimitar",
        "martial",
        "melee",
        _dd(1, 6, "slashing"),
        ["finesse", "light"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Shortsword = class extends WeaponBase {
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
  var Trident = class extends WeaponBase {
    constructor(g) {
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
    }
  };
  var WarPick = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "war pick",
        "martial",
        "melee",
        _dd(1, 8, "piercing"),
        void 0,
        void 0
        // TODO [ICON]
      );
    }
  };
  var Warhammer = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "warhammer",
        "martial",
        "melee",
        _dd(1, 8, "bludgeoning"),
        ["versatile"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Whip = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "whip",
        "martial",
        "melee",
        _dd(1, 4, "slashing"),
        ["finesse", "reach"],
        void 0
        // TODO [ICON]
      );
    }
  };
  var Blowgun = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "blowgun",
        "martial",
        "ranged",
        _fd(1, "piercing"),
        ["ammunition", "loading"],
        void 0,
        // TODO [ICON]
        25,
        100
      );
      this.ammunitionTag = "blowgun";
    }
  };
  var HandCrossbow = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "hand crossbow",
        "martial",
        "ranged",
        _dd(1, 6, "piercing"),
        ["ammunition", "light", "loading"],
        void 0,
        // TODO [ICON]
        30,
        120
      );
      this.ammunitionTag = "crossbow";
    }
  };
  var HeavyCrossbow = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "heavy crossbow",
        "martial",
        "ranged",
        _dd(1, 10, "piercing"),
        ["ammunition", "heavy", "loading", "two-handed"],
        void 0,
        // TODO [ICON]
        100,
        400
      );
      this.ammunitionTag = "crossbow";
    }
  };
  var Longbow = class extends WeaponBase {
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
  var Net = class extends WeaponBase {
    constructor(g) {
      super(
        g,
        "net",
        "martial",
        "ranged",
        _fd(0, "bludgeoning"),
        ["thrown"],
        void 0,
        // TODO [ICON]
        5,
        15
      );
    }
  };
  var ImprovisedWeapon = class extends WeaponBase {
    constructor(g, item, damageDice = 4) {
      var _a;
      super(
        g,
        item.name,
        "improvised",
        "melee",
        _dd(1, damageDice, "bludgeoning"),
        void 0,
        (_a = item.icon) == null ? void 0 : _a.url
      );
      this.item = item;
    }
  };

  // src/items/wondrous/BracersOfTheArbalest.ts
  var BracersOfTheArbalest = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Bracers of the Arbalest");
      this.attunement = true;
      this.rarity = "Uncommon";
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who)) {
          who.weaponProficiencies.add("hand crossbow");
          who.weaponProficiencies.add("light crossbow");
          who.weaponProficiencies.add("heavy crossbow");
        }
      });
      g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
        if (isEquipmentAttuned(this, attacker) && (weapon == null ? void 0 : weapon.ammunitionTag) === "crossbow")
          bonus.add(2, this);
      });
    }
  };

  // src/items/wondrous/DragonTouchedFocus.ts
  var DragonTouchedFocus = class extends WondrousItemBase {
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

  // src/items/wondrous/RingOfAwe.ts
  var RingOfAweResource = new DawnResource("Ring of Awe", 1);
  var getRingOfAweSave = (who, attacker, dc, config) => ({
    source: RingOfAweEffect,
    type: { type: "flat", dc },
    attacker,
    who,
    ability: "wis",
    effect: RingOfAweEffect,
    config,
    tags: ["charm", "magic"]
  });
  var RingOfAweEffect = new Effect(
    "Ring of Awe",
    "turnStart",
    (g) => {
      g.events.on(
        "GetConditions",
        ({ detail: { who, conditions, frightenedBy } }) => {
          const config = who.getEffectConfig(RingOfAweEffect);
          if (config) {
            conditions.add("Frightened", RingOfAweEffect);
            frightenedBy.add(config.actor);
          }
        }
      );
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        const config = who.getEffectConfig(RingOfAweEffect);
        if (config)
          interrupt.add(
            new EvaluateLater(who, RingOfAweEffect, Priority_default.Normal, async () => {
              const { outcome } = await g.save(
                getRingOfAweSave(who, config.actor, config.dc, config)
              );
              if (outcome === "success")
                await who.removeEffect(RingOfAweEffect);
            })
          );
      });
    },
    { tags: ["magic"] }
  );
  var RingOfAweAction = class extends AbstractAction {
    constructor(g, actor, item, dc = 13) {
      super(
        g,
        actor,
        item.name,
        "implemented",
        {},
        {
          area: [{ type: "within", radius: 15, who: actor }],
          tags: ["harmful"],
          time: "action",
          resources: /* @__PURE__ */ new Map([[RingOfAweResource, 1]]),
          description: `By holding the ring aloft and speaking a command word, you project a field of awe around you. Each creature of your choice in a 15-foot sphere centred on you must succeed on a DC ${dc} Wisdom save or become frightened for 1 minute. On each affected creature's turn, it may repeat the Wisdom saving throw. On a successful save, the effect ends for that creature.`
        }
      );
      this.dc = dc;
    }
    getAffected() {
      return this.g.getInside({ type: "within", radius: 15, who: this.actor }).filter((co) => co.side !== this.actor.side);
    }
    getTargets() {
      return [];
    }
    async applyEffect() {
      const { g, actor, dc } = this;
      for (const who of this.getAffected()) {
        const effect = RingOfAweEffect;
        const config = {
          conditions: coSet("Frightened"),
          duration: minutes(1),
          actor,
          dc
        };
        const { outcome } = await g.save(
          getRingOfAweSave(who, actor, dc, config)
        );
        if (outcome === "fail")
          await who.addEffect(effect, config, actor);
      }
    }
  };
  var RingOfAwe = class extends WondrousItemBase {
    constructor(g) {
      super(g, "Ring of Awe", 0);
      this.attunement = true;
      this.rarity = "Rare";
      g.events.on("CombatantFinalising", ({ detail: { who } }) => {
        if (isEquipmentAttuned(this, who)) {
          who.cha.score++;
          who.initResource(RingOfAweResource);
        }
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (isEquipmentAttuned(this, who))
          actions.push(new RingOfAweAction(g, who, this));
      });
    }
  };

  // src/items/wondrous/SilverShiningAmulet.ts
  var SilverShiningAmulet = class extends WondrousItemBase {
    constructor(g, charged = true) {
      super(g, "Silver Shining Amulet", 0);
      this.charged = charged;
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
      g.events.on("AfterAction", ({ detail: { action, config } }) => {
        var _a;
        const isAttuned = isEquipmentAttuned(this, action.actor);
        const isChannel = (_a = action.getResources(config).get(ChannelDivinityResource)) != null ? _a : 0;
        if (isAttuned && isChannel && this.charged) {
          this.charged = false;
          action.actor.giveResource(ChannelDivinityResource, 1);
          g.text(
            new MessageBuilder().co(action.actor).nosp().text("'s amulet shines briefly with divine light.")
          );
        }
      });
    }
  };

  // src/data/allItems.ts
  var srdItems = {
    // armor
    "padded armor": (g) => new PaddedArmor(g),
    "leather armor": (g) => new LeatherArmor(g),
    "studded leather armor": (g) => new StuddedLeatherArmor(g),
    "hide armor": (g) => new HideArmor(g),
    "chain shirt": (g) => new ChainShirtArmor(g),
    "scale mail": (g) => new ScaleMailArmor(g),
    breastplate: (g) => new BreastplateArmor(g),
    "half plate armor": (g) => new HalfPlateArmor(g),
    "ring mail": (g) => new RingMailArmor(g),
    "chain mail": (g) => new ChainMailArmor(g),
    "splint armor": (g) => new SplintArmor(g),
    "plate armor": (g) => new PlateArmor(g),
    shield: (g) => new Shield2(g),
    // simple melee
    club: (g) => new Club(g),
    dagger: (g) => new Dagger(g),
    greatclub: (g) => new Greatclub(g),
    handaxe: (g) => new Handaxe(g),
    javelin: (g) => new Javelin(g),
    "light hammer": (g) => new LightHammer(g),
    mace: (g) => new Mace(g),
    quarterstaff: (g) => new Quarterstaff(g),
    sickle: (g) => new Sickle(g),
    spear: (g) => new Spear(g),
    // simple ranged
    dart: (g) => new Dart(g),
    "light crossbow": (g) => new LightCrossbow(g),
    sling: (g) => new Sling(g),
    shortbow: (g) => new Shortbow(g),
    // martial melee
    battleaxe: (g) => new Battleaxe(g),
    flail: (g) => new Flail(g),
    glaive: (g) => new Glaive(g),
    greataxe: (g) => new Greataxe(g),
    greatsword: (g) => new Greatsword(g),
    halberd: (g) => new Halberd(g),
    lance: (g) => new Lance(g),
    longsword: (g) => new Longsword(g),
    maul: (g) => new Maul(g),
    morningstar: (g) => new Morningstar(g),
    pike: (g) => new Pike(g),
    rapier: (g) => new Rapier(g),
    scimitar: (g) => new Scimitar(g),
    shortsword: (g) => new Shortsword(g),
    trident: (g) => new Trident(g),
    warhammer: (g) => new Warhammer(g),
    "war pick": (g) => new WarPick(g),
    whip: (g) => new Whip(g),
    // martial ranged
    blowgun: (g) => new Blowgun(g),
    "hand crossbow": (g) => new HandCrossbow(g),
    "heavy crossbow": (g) => new HeavyCrossbow(g),
    longbow: (g) => new Longbow(g),
    net: (g) => new Net(g),
    // ammunition
    arrow: (g) => new Arrow(g),
    "blowgun needle": (g) => new BlowgunNeedle(g),
    "crossbow bolt": (g) => new CrossbowBolt(g),
    "sling bullet": (g) => new SlingBullet(g),
    // potions
    "potion of healing": (g) => new PotionOfHealing(g, "standard"),
    "potion of greater healing": (g) => new PotionOfHealing(g, "greater"),
    "potion of superior healing": (g) => new PotionOfHealing(g, "superior"),
    "potion of supreme healing": (g) => new PotionOfHealing(g, "supreme"),
    "potion of hill giant strength": (g) => new PotionOfGiantStrength(g, "Hill"),
    "potion of stone giant strength": (g) => new PotionOfGiantStrength(g, "Stone"),
    "potion of frost giant strength": (g) => new PotionOfGiantStrength(g, "Frost"),
    "potion of fire giant strength": (g) => new PotionOfGiantStrength(g, "Fire"),
    "potion of cloud giant strength": (g) => new PotionOfGiantStrength(g, "Cloud"),
    "potion of storm giant strength": (g) => new PotionOfGiantStrength(g, "Storm"),
    // shields
    "arrow-catching shield": (g) => new ArrowCatchingShield(g),
    // wands
    "wand of web": (g) => new WandOfWeb(g),
    // wondrous
    "amulet of health": (g) => new AmuletOfHealth(g),
    "belt of dwarvenkind": (g) => new BeltOfDwarvenkind(g),
    "belt of hill giant strength": (g) => new BeltOfGiantStrength(g, "Hill"),
    "belt of stone giant strength": (g) => new BeltOfGiantStrength(g, "Stone"),
    "belt of frost giant strength": (g) => new BeltOfGiantStrength(g, "Frost"),
    "belt of fire giant strength": (g) => new BeltOfGiantStrength(g, "Fire"),
    "belt of cloud giant strength": (g) => new BeltOfGiantStrength(g, "Cloud"),
    "belt of storm giant strength": (g) => new BeltOfGiantStrength(g, "Storm"),
    "boots of the winterlands": (g) => new BootsOfTheWinterlands(g),
    "bracers of archery": (g) => new BracersOfArchery(g),
    "bracers of defense": (g) => new BracersOfDefense(g),
    "brooch of shielding": (g) => new BroochOfShielding(g),
    "cloak of elvenkind": (g) => new CloakOfElvenkind(g),
    "cloak of protection": (g) => new CloakOfProtection(g),
    "dimensional shackles": (g) => new DimensionalShackles(g),
    "elven chain": (g) => new ElvenChain(g),
    "figurine of wondrous power, bronze griffin": (g) => new FigurineOfWondrousPower(g, "Bronze Griffin"),
    "figurine of wondrous power, ebony fly": (g) => new FigurineOfWondrousPower(g, "Ebony Fly"),
    "figurine of wondrous power, golden lions": (g) => new FigurineOfWondrousPower(g, "Golden Lions"),
    "figurine of wondrous power, ivory goats": (g) => new FigurineOfWondrousPower(g, "Ivory Goats"),
    "figurine of wondrous power, marble elephant": (g) => new FigurineOfWondrousPower(g, "Marble Elephant"),
    "figurine of wondrous power, obsidian steed": (g) => new FigurineOfWondrousPower(g, "Obsidian Steed"),
    "figurine of wondrous power, onyx dog": (g) => new FigurineOfWondrousPower(g, "Onyx Dog"),
    "figurine of wondrous power, serpentine owl": (g) => new FigurineOfWondrousPower(g, "Serpentine Owl"),
    "figurine of wondrous power, silver raven": (g) => new FigurineOfWondrousPower(g, "Silver Raven"),
    "gauntlets of ogre power": (g) => new GauntletsOfOgrePower(g),
    "Ioun stone of agility": iounStoneOfAgility,
    "Ioun stone of fortitude": iounStoneOfFortitude,
    "Ioun stone of insight": iounStoneOfInsight,
    "Ioun stone of intellect": iounStoneOfIntellect,
    "Ioun stone of leadership": iounStoneOfLeadership,
    "Ioun stone of mastery": (g) => new IounStoneOfMastery(g),
    "Ioun stone of protection": (g) => new IounStoneOfProtection(g),
    "Ioun stone of strength": iounStoneOfStrength,
    "headband of intellect": (g) => new HeadbandOfIntellect(g)
  };
  var allItems = {
    ...srdItems,
    // BGDIA
    "gauntlets of flaming fury": (g) => new GauntletsOfFlamingFury(g),
    // GGR
    "pariah's shield": (g) => new PariahsShield(g),
    // TCE
    "dragon-touched focus (slumbering)": (g) => new DragonTouchedFocus(g, "Slumbering"),
    "dragon-touched focus (stirring)": (g) => new DragonTouchedFocus(g, "Stirring"),
    "dragon-touched focus (wakened)": (g) => new DragonTouchedFocus(g, "Wakened"),
    "dragon-touched focus (ascendant)": (g) => new DragonTouchedFocus(g, "Ascendant"),
    // homebrew
    "bracers of the arbalest": (g) => new BracersOfTheArbalest(g),
    "ring of awe": (g) => new RingOfAwe(g),
    "silver shining amulet": (g) => new SilverShiningAmulet(g)
  };
  var allItems_default = allItems;

  // src/data/initialiseMonster.ts
  function applyMonsterTemplate(g, m, t, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p2;
    if (t.base)
      applyMonsterTemplate(g, m, t.base);
    if (t.name)
      m.name = t.name;
    if (t.tokenUrl)
      m.img = t.tokenUrl;
    if (isDefined(t.cr))
      m.cr = t.cr;
    if (t.type)
      m.type = t.type;
    if (t.size)
      m.size = t.size;
    if (t.reach)
      m.reach = t.reach;
    if (t.hpMax)
      m.baseHpMax = t.hpMax;
    if (isDefined(t.makesDeathSaves))
      m.diesAtZero = !t.makesDeathSaves;
    if (t.pb)
      m.pb = t.pb;
    if (t.abilities)
      m.setAbilityScores(...t.abilities);
    if (t.align) {
      m.alignLC = t.align[0];
      m.alignGE = t.align[1];
    }
    if (t.naturalAC)
      m.naturalAC = t.naturalAC;
    for (const [type, distance2] of objectEntries((_a = t.movement) != null ? _a : {}))
      m.movement.set(type, distance2);
    for (const [name, level] of objectEntries((_b = t.levels) != null ? _b : {})) {
      m.level += level;
      m.classLevels.set(name, level);
    }
    for (const [thing, type] of objectEntries((_c = t.proficiency) != null ? _c : {}))
      m.addProficiency(thing, type);
    for (const [type, response] of objectEntries((_d = t.damage) != null ? _d : {}))
      m.damageResponses.set(type, response);
    for (const name of (_e = t.immunities) != null ? _e : [])
      m.conditionImmunities.add(name);
    for (const language of (_f = t.languages) != null ? _f : [])
      m.languages.add(language);
    for (const { name, equip, attune, enchantments, quantity } of (_g = t.items) != null ? _g : []) {
      const item = allItems_default[name](g);
      if (attune)
        m.attunements.add(item);
      if (enchantments)
        for (const name2 of enchantments) {
          const enchantment = allEnchantments_default[name2];
          item.addEnchantment(enchantment);
        }
      if (equip)
        m.don(item, true);
      else
        m.give(item, quantity, true);
    }
    for (const [sense, distance2] of objectEntries((_h = t.senses) != null ? _h : {}))
      m.senses.set(sense, distance2);
    for (const name of (_i = t.spells) != null ? _i : []) {
      const spell = allSpells_default[name];
      if (!spell) {
        spellImplementationWarning({ name, status: "missing" }, m);
        continue;
      }
      m.knownSpells.add(spell);
      m.preparedSpells.add(spell);
    }
    for (const w of (_j = t.naturalWeapons) != null ? _j : [])
      m.naturalWeapons.add(new NaturalWeapon(g, w.name, w.toHit, w.damage, w));
    for (const feature of (_k = t.features) != null ? _k : [])
      m.addFeature(feature);
    for (const rule of (_l = t.aiRules) != null ? _l : [])
      m.rules.add(rule);
    for (const [rule, value] of (_m = t.aiCoefficients) != null ? _m : [])
      m.coefficients.set(rule, value);
    for (const group of (_n = t.aiGroups) != null ? _n : [])
      m.groups.add(group);
    for (const tag of (_o = t.tags) != null ? _o : [])
      m.tags.add(tag);
    if (t.config)
      t.config.apply.apply(m, [config != null ? config : t.config.initial]);
    (_p2 = t.setup) == null ? void 0 : _p2.apply(m);
  }
  function initialiseMonster(g, t, config) {
    var _a, _b, _c, _d;
    const m = new Monster(
      g,
      t.name,
      (_a = t.cr) != null ? _a : 0,
      (_b = t.type) != null ? _b : "beast",
      (_c = t.size) != null ? _c : SizeCategory_default.Medium,
      (_d = t.tokenUrl) != null ? _d : "",
      t.hpMax
    );
    applyMonsterTemplate(g, m, t, config);
    return m;
  }

  // src/classes/druid/WildShape.ts
  var WildShapeResource = new ShortRestResource("Wild Shape", 2);
  var WildShapeController = class {
    constructor(g, me, formName, form = initialiseMonster(
      g,
      allMonsters_default[formName],
      {}
    )) {
      this.g = g;
      this.me = me;
      this.formName = formName;
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
      this.bag = new SubscriptionBag();
    }
    async apply() {
      const { g, me, form } = this;
      this.g.text(
        new MessageBuilder().co(me, me.name).text(` transforms into a ${form.name}.`)
      );
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
      me.inventory = /* @__PURE__ */ new Map();
      me.senses = form.senses;
      me.naturalWeapons = form.naturalWeapons;
      me.str.score = form.str.score;
      me.dex.score = form.dex.score;
      me.con.score = form.con.score;
      me.damageResponses = form.damageResponses;
      const closeTap = g.events.tap((cleanup) => this.bag.add(cleanup));
      for (const [name, feature] of form.features) {
        me.addFeature(feature);
        feature.setup(g, me, form.getConfig(name));
      }
      closeTap();
      this.bag.add(
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
        g.events.on("CheckAction", ({ detail: { action, error } }) => {
          if (action.actor === me && action.tags.has("spell"))
            error.add("cannot cast spells", WildShape);
        })
      );
    }
    remove() {
      const { me, backup, str, dex, con, removeFeatures, bag, g } = this;
      Object.assign(me, backup);
      me.str.score = str;
      me.dex.score = dex;
      me.con.score = con;
      for (const feature of removeFeatures)
        me.features.delete(feature.name);
      bag.cleanup();
      g.text(new MessageBuilder().co(me).text(" returns to their normal form."));
    }
  };
  var RevertAction = class extends AbstractSelfAction {
    constructor(g, actor, controller) {
      super(g, actor, "Revert Form", "implemented", {}, { time: "bonus action" });
      this.controller = controller;
    }
    async applyEffect() {
      this.controller.remove();
    }
  };
  var WildShapeAction = class extends AbstractSelfAction {
    constructor(g, actor, forms) {
      super(
        g,
        actor,
        "Wild Shape",
        "incomplete",
        {
          form: new ChoiceResolver(
            g,
            "Form",
            forms.map(
              (value) => makeStringChoice(value, value, !allMonsters_default[value])
            )
          )
        },
        {
          description: `You can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.`,
          time: "action",
          resources: [[WildShapeResource, 1]]
        }
      );
      this.forms = forms;
    }
    async applyEffect({ form }) {
      const controller = new WildShapeController(this.g, this.actor, form);
      await controller.apply();
    }
  };
  var WildShape = new ConfiguredFeature(
    "Wild Shape",
    `Starting at 2nd level, you can use your action to magically assume the shape of a beast that you have seen before. You can use this feature twice. You regain expended uses when you finish a short or long rest.`,
    (g, me, forms) => {
      featureNotComplete(WildShape, me);
      me.initResource(WildShapeResource);
      for (const form of forms)
        if (!allMonsters_default[form])
          implementationWarning("Monster", "Missing", form, me.name);
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
  var CantripVersatility2 = nonCombatFeature(
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
  var ASI42 = makeASI("Druid", 4);
  var ASI82 = makeASI("Druid", 8);
  var ASI122 = makeASI("Druid", 12);
  var ASI162 = makeASI("Druid", 16);
  var ASI192 = makeASI("Druid", 19);
  var Druid = {
    name: "Druid",
    hitDieSize: 8,
    // TODO druids will not wear armor or use shields made of metal
    armor: acSet("light", "medium", "shield"),
    weapon: wtSet(
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
    ),
    tool: gains(["herbalism kit"]),
    save: abSet("int", "wis"),
    skill: gains([], 2, [
      "Arcana",
      "Animal Handling",
      "Insight",
      "Medicine",
      "Nature",
      "Perception",
      "Religion",
      "Survival"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([["wis", 13]]),
      // TODO druids will not wear armor or use shields made of metal
      armor: acSet("light", "medium", "shield")
    },
    features: /* @__PURE__ */ new Map([
      [1, [Druidic, DruidSpellcasting.feature]],
      [2, [WildShape_default, WildCompanion]],
      [4, [ASI42, CantripVersatility2]],
      [8, [ASI82]],
      [12, [ASI122]],
      [16, [ASI162]],
      [18, [TimelessBody, BeastSpells]],
      [19, [ASI192]],
      [20, [Archdruid]]
    ])
  };
  var druid_default3 = Druid;

  // src/img/class/rogue.svg
  var rogue_default = "./rogue-FWYYNDZ5.svg";

  // src/classes/rogue/common.ts
  var RogueIcon = makeIcon(rogue_default, ClassColours.Rogue);

  // src/classes/rogue/SneakAttack.ts
  function getSneakAttackDice(level) {
    return Math.ceil(level / 2);
  }
  var sneakAttackMethods = new DefaultingMap(() => /* @__PURE__ */ new Set());
  new DndRule("Sneak Attack", () => {
    sneakAttackMethods.clear();
  });
  function addSneakAttackMethod(who, method) {
    sneakAttackMethods.get(who.id).add(method);
  }
  var SneakAttackResource = new TurnResource("Sneak Attack", 1);
  var SneakAttack = new SimpleFeature(
    "Sneak Attack",
    `Beginning at 1st level, you know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.

You don't need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll.

The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.`,
    (g, me) => {
      const count = getSneakAttackDice(me.getClassLevel("Rogue", 1));
      me.initResource(SneakAttackResource);
      addSneakAttackMethod(me, (g2, target, attack) => {
        const noDisadvantage = !attack.pre.diceType.getValues().includes("disadvantage");
        return !!getFlanker(g2, me, target) && noDisadvantage;
      });
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
            const methods = Array.from(sneakAttackMethods.get(me.id));
            if (isFinesseOrRangedWeapon && (advantage || methods.find((method) => method(g, target, attack)))) {
              interrupt.add(
                new YesNoChoice(
                  attacker,
                  SneakAttack,
                  "Sneak Attack",
                  `Do ${count * (critical ? 2 : 1)}d6 bonus damage on this hit?`,
                  Priority_default.Normal,
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
                        ability,
                        tags: atSet()
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
            new EvaluateLater(
              pre.who,
              SteadyAimAdvantageEffect,
              Priority_default.Normal,
              () => pre.who.removeEffect(SteadyAimAdvantageEffect)
            )
          );
      });
    },
    { icon: SteadyAimIcon }
  );
  var SteadyAimAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Steady Aim",
        "implemented",
        {},
        {
          icon: SteadyAimIcon,
          subIcon: RogueIcon,
          time: "bonus action",
          description: `As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.`
        }
      );
    }
    check(config, ec) {
      if (this.actor.movedSoFar)
        ec.add("Already moved this turn", this);
      return super.check(config, ec);
    }
    async applyEffect() {
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
      for (const entry of config)
        me.addProficiency(entry, "expertise");
    }
  );
  var ThievesCant = new SimpleFeature(
    "Thieves' Cant",
    `During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.

In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.`,
    (g, me) => {
      me.languages.add("Thieves' Cant");
    }
  );
  var CunningAction = new SimpleFeature(
    "Cunning Action",
    `Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.`,
    (g, me) => {
      featureNotComplete(CunningAction, me);
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
  var UncannyDodgeAction = class extends AbstractSelfAction {
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
    async applyEffect() {
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
          if (attacker && attack && target === me) {
            const action = new UncannyDodgeAction(g, me, multiplier);
            const config = { target: attacker };
            if (checkConfig(g, action, config))
              interrupt.add(
                new YesNoChoice(
                  me,
                  UncannyDodge,
                  "Uncanny Dodge",
                  `Use Uncanny Dodge to halve the incoming damage on ${me.name}?`,
                  Priority_default.ChangesOutcome,
                  () => g.act(action, config)
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
  var ASI43 = makeASI("Rogue", 4);
  var ASI83 = makeASI("Rogue", 8);
  var ASI10 = makeASI("Rogue", 10);
  var ASI123 = makeASI("Rogue", 12);
  var ASI163 = makeASI("Rogue", 16);
  var ASI193 = makeASI("Rogue", 19);
  var Rogue = {
    name: "Rogue",
    hitDieSize: 8,
    armor: acSet("light"),
    weaponCategory: wcSet("simple"),
    weapon: wtSet("hand crossbow", "longsword", "rapier", "shortsword"),
    tool: gains(["thieves' tools"]),
    save: abSet("dex", "int"),
    skill: gains([], 4, [
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
    multi: {
      requirements: /* @__PURE__ */ new Map([["dex", 13]]),
      armor: acSet("light"),
      tool: gains(["thieves' tools"]),
      skill: gains([], 1, [
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
      ])
    },
    features: /* @__PURE__ */ new Map([
      [1, [Expertise, SneakAttack_default, ThievesCant]],
      [2, [CunningAction]],
      [3, [SteadyAim_default]],
      [4, [ASI43]],
      [5, [UncannyDodge]],
      [7, [Evasion_default]],
      [8, [ASI83]],
      [10, [ASI10]],
      [11, [ReliableTalent]],
      [12, [ASI123]],
      [14, [Blindsense]],
      [15, [SlipperyMind]],
      [16, [ASI163]],
      [18, [Elusive]],
      [19, [ASI193]],
      [20, [StrokeOfLuck]]
    ])
  };
  var rogue_default2 = Rogue;

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
  var ASI44 = makeASI("Wizard", 4);
  var ASI84 = makeASI("Wizard", 8);
  var ASI124 = makeASI("Wizard", 12);
  var ASI164 = makeASI("Wizard", 16);
  var ASI194 = makeASI("Wizard", 19);
  var Wizard = {
    name: "Wizard",
    hitDieSize: 6,
    weapon: wtSet("dagger", "dart", "sling", "quarterstaff", "light crossbow"),
    save: abSet("int", "wis"),
    skill: gains([], 2, [
      "Arcana",
      "History",
      "Insight",
      "Investigation",
      "Medicine",
      "Religion"
    ]),
    multi: { requirements: /* @__PURE__ */ new Map([["int", 13]]) },
    features: /* @__PURE__ */ new Map([
      [1, [ArcaneRecovery, WizardSpellcasting.feature]],
      [3, [CantripFormulas]],
      [4, [ASI44]],
      [8, [ASI84]],
      [12, [ASI124]],
      [16, [ASI164]],
      [18, [SpellMastery]],
      [19, [ASI194]],
      [20, [SignatureSpells]]
    ])
  };
  var wizard_default2 = Wizard;

  // src/monsters/Parry.ts
  var ParryAction = class extends AbstractAction {
    constructor(g, actor, detail) {
      super(
        g,
        actor,
        "Parry",
        "implemented",
        {
          target: new TargetResolver(g, Infinity, [
            canSee,
            {
              name: "wielding a melee weapon",
              message: "no melee weapon",
              check: (g2, action, value) => !!value.weapons.find((w) => w.rangeCategory === "melee")
            }
          ])
        },
        {
          description: `You add ${actor.pb} to your AC against one melee attack that would hit you. To do so, you must see the attacker and be wielding a melee weapon.`,
          time: "reaction"
        }
      );
      this.detail = detail;
    }
    check(config, ec) {
      const melee = this.actor.weapons.find((w) => w.rangeCategory === "melee");
      if (!melee)
        ec.add("not wielding a melee weapon", this);
      return super.check(config, ec);
    }
    getTargets({ target }) {
      return sieve(target);
    }
    getAffected() {
      return [this.actor];
    }
    async applyEffect() {
      if (!this.detail)
        throw new Error(`Parry.apply() without AttackDetail`);
      this.detail.ac += this.actor.pb;
    }
  };
  var Parry = new SimpleFeature(
    "Parry",
    `Reaction: You add your proficiency bonus to your AC against one melee attack that would hit you. To do so, you must see the attacker and be wielding a melee weapon.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new ParryAction(g, me));
      });
      g.events.on("Attack", ({ detail }) => {
        const { target, who } = detail.pre;
        const parry = new ParryAction(g, me, detail);
        const config = { target: who };
        if (target === me && detail.roll.type.tags.has("melee") && detail.outcome.hits && checkConfig(g, parry, config))
          detail.interrupt.add(
            new YesNoChoice(
              me,
              Parry,
              "Parry",
              `${who.name} is about to hit ${target.name} in melee (${detail.total} vs. AC ${detail.ac}). Should they use Parry to add ${who.pb} AC for this attack?`,
              Priority_default.ChangesOutcome,
              async () => {
                await g.act(parry, config);
              }
            )
          );
      });
    }
  );
  var Parry_default = Parry;

  // src/monsters/srd/humanoid.ts
  var Acolyte = {
    name: "acolyte",
    cr: 0.25,
    type: "humanoid",
    tokenUrl: acolyte_default,
    hpMax: 9,
    abilities: [10, 10, 10, 10, 14, 11],
    proficiency: { Medicine: "proficient", Religion: "proficient" },
    languages: ["Common"],
    // TODO any one language (usually Common)
    levels: { Cleric: 1 },
    features: [ClericSpellcasting.feature],
    spells: [
      "light",
      "sacred flame",
      "thaumaturgy",
      "bless",
      "cure wounds",
      "sanctuary"
    ],
    items: [{ name: "club", equip: true }]
  };
  var ArchmageSpellcastingMethod = new InnateSpellcasting(
    "Archmage Innate Spells",
    "int"
  );
  var ArchmageSpellcasting = bonusSpellsFeature(
    "Archmage Spellcasting",
    `The archmage can cast disguise self and invisibility at will.`,
    "Wizard",
    ArchmageSpellcastingMethod,
    [
      { level: 0, spell: "disguise self" },
      { level: 0, spell: "invisibility" }
    ]
  );
  var Archmage = {
    name: "archmage",
    cr: 12,
    type: "humanoid",
    tokenUrl: archmage_default,
    hpMax: 99,
    abilities: [10, 14, 12, 20, 15, 16],
    proficiency: {
      int: "proficient",
      wis: "proficient",
      Arcana: "expertise",
      History: "expertise"
    },
    languages: ["Common"],
    // TODO any six languages
    pb: 4,
    levels: { Wizard: 18 },
    features: [
      SpellDamageResistance,
      MagicResistance,
      ArchmageSpellcasting,
      WizardSpellcasting.feature
    ],
    spells: [
      "fire bolt",
      "light",
      "mage hand",
      "prestidigitation",
      "shocking grasp",
      "detect magic",
      "identify",
      "mage armor",
      "magic missile",
      "detect thoughts",
      "mirror image",
      "misty step",
      "counterspell",
      "fly",
      "lightning bolt",
      "banishment",
      "fire shield",
      "stoneskin",
      "cone of cold",
      "scrying",
      "wall of force",
      "globe of invulnerability",
      "teleport",
      "mind blank",
      "time stop"
    ],
    // TODO precast spells: mage armor, stoneskin, mind blank
    items: [{ name: "dagger", equip: true }]
  };
  var Assassinate = new SimpleFeature(
    "Assassinate",
    `During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.`,
    (g, me) => {
      const hasTakenTurn = /* @__PURE__ */ new Set();
      let hasEndedTurn = false;
      g.events.on("TurnStarted", ({ detail: { who } }) => hasTakenTurn.add(who));
      g.events.on("TurnEnded", ({ detail: { who } }) => {
        if (who === me)
          hasEndedTurn = true;
      });
      g.events.on("BeforeAttack", ({ detail: { who, target, diceType } }) => {
        if (who === me && !hasEndedTurn && !hasTakenTurn.has(target))
          diceType.add("advantage", Assassinate);
      });
      g.events.on(
        "Attack",
        ({
          detail: {
            roll: {
              type: { who, target }
            },
            outcome
          }
        }) => {
          if (who === me && target.hasEffect(Surprised) && outcome.hits)
            outcome.add("critical", Assassinate);
        }
      );
    }
  );
  var AssassinMultiattack = makeBagMultiattack(
    `The assassin makes two shortsword attacks.`,
    [{ weapon: "shortsword" }, { weapon: "shortsword" }]
  );
  var Assassin = {
    name: "assassin",
    cr: 8,
    type: "humanoid",
    tokenUrl: assassin_default,
    hpMax: 78,
    // TODO any non-good alignment
    abilities: [11, 16, 14, 13, 11, 10],
    proficiency: {
      dex: "proficient",
      int: "proficient",
      Acrobatics: "proficient",
      Deception: "proficient",
      Perception: "proficient",
      Stealth: "expertise"
    },
    damage: { poison: "resist" },
    languages: ["Thieves' Cant"],
    // TODO Thieves' cant plus any two languages
    pb: 3,
    items: [
      { name: "studded leather armor", equip: true },
      { name: "shortsword" },
      { name: "light crossbow" },
      { name: "crossbow bolt", quantity: 20 }
    ],
    levels: { Rogue: 8 },
    features: [Assassinate, Evasion_default, SneakAttack_default, AssassinMultiattack],
    config: {
      initial: { weapon: "shortsword" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("shortsword"),
          makeStringChoice("light crossbow")
        ])
      }),
      apply({ weapon }) {
        this.don(this.getInventoryItem(weapon));
      }
    }
  };
  var Bandit = {
    name: "bandit",
    cr: 0.125,
    type: "humanoid",
    tokenUrl: bandit_default,
    hpMax: 11,
    // TODO any non-lawful alignment
    abilities: [11, 12, 12, 10, 10, 10],
    languages: ["Common"],
    // any one language (usually Common)
    items: [
      { name: "leather armor", equip: true },
      { name: "scimitar" },
      { name: "light crossbow" },
      { name: "crossbow bolt", quantity: 20 }
    ],
    config: {
      initial: { weapon: "light crossbow" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("scimitar"),
          makeStringChoice("light crossbow")
        ])
      }),
      apply({ weapon }) {
        this.don(this.getInventoryItem(weapon));
      }
    }
  };
  var BanditCaptainMultiattack = makeBagMultiattack(
    `The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers.`,
    [
      { weapon: "scimitar", range: "melee" },
      { weapon: "scimitar", range: "melee" },
      { weapon: "dagger", range: "melee" }
    ],
    [
      { weapon: "dagger", range: "ranged" },
      { weapon: "dagger", range: "ranged" }
    ]
  );
  var BanditCaptain = {
    name: "bandit captain",
    cr: 2,
    type: "humanoid",
    tokenUrl: bandit_captain_default,
    hpMax: 65,
    // TODO any non-lawful alignment
    abilities: [15, 16, 14, 14, 11, 14],
    proficiency: {
      str: "proficient",
      dex: "proficient",
      wis: "proficient",
      Athletics: "proficient",
      Deception: "proficient"
    },
    languages: ["Common"],
    // any two languages
    features: [BanditCaptainMultiattack, Parry_default],
    items: [
      { name: "studded leather armor", equip: true },
      { name: "scimitar", equip: true },
      { name: "dagger", equip: true, quantity: 10 }
      // TODO how many
    ]
  };
  var Berserker = {
    name: "berserker",
    cr: 2,
    type: "humanoid",
    tokenUrl: berserker_default,
    hpMax: 67,
    // TODO any Chaotic
    abilities: [16, 12, 17, 9, 11, 9],
    languages: ["Common"],
    features: [RecklessAttack],
    items: [
      { name: "hide armor", equip: true },
      { name: "greataxe", equip: true }
    ]
  };
  var Commoner = {
    name: "commoner",
    type: "humanoid",
    tokenUrl: commoner_default,
    hpMax: 4,
    languages: ["Common"],
    // any one language (usually Common)
    items: [{ name: "club", equip: true }]
  };
  var DarkDevotion = new SimpleFeature(
    "Dark Devotion",
    `The cultist has advantage on saving throws against being charmed or frightened.`,
    (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
        var _a, _b;
        if (who === me && (((_a = config == null ? void 0 : config.conditions) == null ? void 0 : _a.has("Charmed")) || ((_b = config == null ? void 0 : config.conditions) == null ? void 0 : _b.has("Frightened"))))
          diceType.add("advantage", DarkDevotion);
      });
    }
  );
  var Cultist = {
    name: "cultist",
    cr: 0.125,
    type: "humanoid",
    tokenUrl: cultist_default,
    hpMax: 9,
    // TODO any non-good alignment
    abilities: [11, 12, 10, 10, 11, 10],
    proficiency: { Deception: "proficient", Religion: "proficient" },
    languages: ["Common"],
    // any one language (usually Common)
    features: [DarkDevotion],
    items: [
      { name: "leather armor", equip: true },
      { name: "scimitar", equip: true }
    ]
  };
  var CultFanaticMultiattack = makeBagMultiattack(
    `The fanatic makes two melee attacks.`,
    [{ range: "melee" }, { range: "melee" }]
  );
  var CultFanatic = {
    name: "cult fanatic",
    cr: 2,
    type: "humanoid",
    tokenUrl: cult_fanatic_default,
    hpMax: 33,
    // TODO any non-good alignment
    abilities: [11, 14, 12, 10, 13, 14],
    proficiency: {
      Deception: "proficient",
      Perception: "proficient",
      Religion: "proficient"
    },
    languages: ["Common"],
    // any one language (usually Common)
    levels: { Cleric: 4 },
    features: [DarkDevotion, ClericSpellcasting.feature, CultFanaticMultiattack],
    spells: [
      "light",
      "sacred flame",
      "thaumaturgy",
      "command",
      "inflict wounds",
      "shield of faith",
      "hold person",
      "spiritual weapon"
    ],
    items: [
      { name: "leather armor", equip: true },
      { name: "dagger", equip: true }
    ]
  };
  var Druid2 = {
    name: "druid",
    cr: 2,
    type: "humanoid",
    tokenUrl: druid_default,
    hpMax: 27,
    abilities: [10, 12, 13, 12, 15, 11],
    proficiency: {
      Medicine: "proficient",
      Nature: "proficient",
      Perception: "proficient"
    },
    languages: ["Druidic"],
    // TODO Druidic plus any two languages
    levels: { Druid: 4 },
    features: [DruidSpellcasting.feature],
    spells: [
      "druidcraft",
      "produce flame",
      "shillelagh",
      "entangle",
      "longstrider",
      "speak with animals",
      "thunderwave",
      "animal messenger",
      "barkskin"
    ],
    items: [{ name: "quarterstaff", equip: true }]
  };
  var GladiatorMultiattack = makeBagMultiattack(
    `The gladiator makes three melee attacks or two ranged attacks.`,
    [{ range: "melee" }, { range: "melee" }, { range: "melee" }],
    [{ range: "ranged" }, { range: "ranged" }]
  );
  var ShieldBashAction2 = class extends WeaponAttack {
    constructor(g, actor, item) {
      super(g, "Shield Bash", actor, "melee", new ImprovisedWeapon(g, item));
      this.item = item;
    }
    async applyEffect({ target }) {
      const { g, ability, actor, weapon } = this;
      const { attack } = await doStandardAttack(g, {
        ability,
        attacker: actor,
        source: this,
        target,
        weapon,
        rangeCategory: "melee"
      });
      if ((attack == null ? void 0 : attack.hit) && target.size <= SizeCategory_default.Medium) {
        const dc = 8 + attack.attack.pre.bonus.result;
        const config = { duration: Infinity, conditions: coSet("Prone") };
        const { outcome } = await g.save({
          who: target,
          source: this,
          type: { type: "flat", dc },
          ability: "str",
          attacker: actor,
          effect: Prone,
          config
        });
        if (outcome === "fail")
          await target.addEffect(Prone, config, actor);
      }
    }
  };
  var ShieldBash2 = new SimpleFeature(
    "Shield Bash",
    `You can use your shield as a melee weapon.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me && me.shield)
          actions.push(new ShieldBashAction2(g, me, me.shield));
      });
    }
  );
  var Gladiator = {
    name: "gladiator",
    cr: 5,
    type: "humanoid",
    tokenUrl: gladiator_default,
    hpMax: 112,
    abilities: [18, 15, 16, 10, 12, 15],
    proficiency: {
      str: "proficient",
      dex: "proficient",
      con: "proficient",
      Athletics: "expertise",
      Intimidation: "proficient",
      improvised: "proficient"
      // for Shield Bash
    },
    languages: ["Common"],
    // any one language (usually Common)
    pb: 3,
    features: [Brave, Brute, GladiatorMultiattack, ShieldBash2, Parry_default],
    items: [
      { name: "studded leather armor", equip: true },
      { name: "shield", equip: true },
      { name: "spear", equip: true, quantity: 10 }
      // TODO how many
    ]
  };
  var Guard = {
    name: "guard",
    cr: 0.125,
    type: "humanoid",
    tokenUrl: guard_default,
    hpMax: 11,
    abilities: [13, 12, 12, 10, 11, 10],
    proficiency: { Perception: "proficient" },
    languages: ["Common"],
    // any one language (usually Common)
    items: [
      { name: "chain shirt", equip: true },
      { name: "shield", equip: true },
      { name: "spear", equip: true }
    ]
  };
  var KnightMultiattack = makeBagMultiattack(
    `The knight makes two melee attacks.`,
    [{ range: "melee" }, { range: "melee" }]
  );
  var Leadership = notImplementedFeature(
    "Leadership",
    `(Recharges after a Short or Long Rest). For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 feet of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated.`
  );
  var Knight = {
    name: "knight",
    cr: 3,
    type: "humanoid",
    tokenUrl: knight_default,
    hpMax: 52,
    abilities: [16, 11, 14, 11, 11, 15],
    proficiency: { con: "proficient", wis: "proficient" },
    languages: ["Common"],
    // any one language (usually Common)
    features: [Brave, KnightMultiattack, Leadership, Parry_default],
    items: [
      { name: "plate armor", equip: true },
      { name: "greatsword" },
      { name: "heavy crossbow" },
      { name: "crossbow bolt", quantity: 20 }
    ],
    config: {
      initial: { weapon: "greatsword" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("greatsword"),
          makeStringChoice("heavy crossbow")
        ])
      }),
      apply({ weapon }) {
        this.don(this.getInventoryItem(weapon));
      }
    }
  };
  var Mage = {
    name: "mage",
    cr: 6,
    type: "humanoid",
    tokenUrl: mage_default,
    hpMax: 40,
    abilities: [9, 14, 11, 17, 12, 11],
    proficiency: {
      int: "proficient",
      wis: "proficient",
      Arcana: "proficient",
      History: "proficient"
    },
    languages: ["Common"],
    // TODO any four languages
    pb: 3,
    levels: { Wizard: 9 },
    features: [WizardSpellcasting.feature],
    items: [{ name: "dagger", equip: true }],
    spells: [
      "fire bolt",
      "light",
      "mage hand",
      "prestidigitation",
      "detect magic",
      "mage armor",
      "magic missile",
      "shield",
      "misty step",
      "suggestion",
      "counterspell",
      "fireball",
      "fly",
      "greater invisibility",
      "ice storm",
      "cone of cold"
    ]
  };
  var Noble = {
    name: "noble",
    cr: 0.125,
    type: "humanoid",
    tokenUrl: noble_default,
    hpMax: 9,
    abilities: [11, 12, 11, 12, 14, 16],
    proficiency: {
      Deception: "proficient",
      Insight: "proficient",
      Persuasion: "proficient"
    },
    languages: ["Common"],
    // TODO any two languages
    items: [
      { name: "breastplate", equip: true },
      { name: "rapier", equip: true }
    ]
  };
  var DivineEminence = notImplementedFeature(
    "Divine Eminence",
    `As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.`
  );
  var Priest = {
    name: "priest",
    cr: 2,
    type: "humanoid",
    tokenUrl: priest_default,
    hpMax: 27,
    abilities: [10, 10, 12, 13, 16, 13],
    proficiency: {
      Medicine: "expertise",
      Persuasion: "proficient",
      Religion: "proficient"
    },
    languages: ["Common"],
    // TODO any two languages
    levels: { Cleric: 5 },
    features: [DivineEminence, ClericSpellcasting.feature],
    items: [
      { name: "chain shirt", equip: true },
      { name: "mace", equip: true }
    ],
    spells: [
      "light",
      "sacred flame",
      "thaumaturgy",
      "cure wounds",
      "guiding bolt",
      "sanctuary",
      "lesser restoration",
      "spiritual weapon",
      "dispel magic",
      "spirit guardians"
    ]
  };
  var ScoutMultiattack = makeBagMultiattack(
    `The scout makes two melee attacks or two ranged attacks.`,
    [{ range: "melee" }, { range: "melee" }],
    [{ range: "ranged" }, { range: "ranged" }]
  );
  var Scout = {
    name: "scout",
    cr: 0.5,
    type: "humanoid",
    tokenUrl: scout_default,
    hpMax: 16,
    abilities: [11, 14, 12, 11, 13, 11],
    proficiency: {
      Nature: "expertise",
      Perception: "expertise",
      Stealth: "expertise",
      Survival: "expertise"
    },
    languages: ["Common"],
    // TODO any one language (usually Common)
    features: [KeenHearingAndSight, ScoutMultiattack],
    items: [
      { name: "leather armor", equip: true },
      { name: "shortsword" },
      { name: "longbow" },
      { name: "arrow", quantity: 20 }
    ],
    config: {
      initial: { weapon: "longbow" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("shortsword"),
          makeStringChoice("longbow")
        ])
      }),
      apply({ weapon }) {
        this.don(this.getInventoryItem(weapon));
      }
    }
  };
  var SpyMultiattack = makeBagMultiattack("The spy makes two melee attacks.", [
    { range: "melee" },
    { range: "melee" }
  ]);
  var Spy = {
    name: "spy",
    cr: 1,
    type: "humanoid",
    tokenUrl: spy_default,
    hpMax: 27,
    abilities: [10, 15, 10, 12, 14, 16],
    proficiency: {
      Deception: "proficient",
      Insight: "proficient",
      Perception: "expertise",
      Persuasion: "proficient",
      "Sleight of Hand": "proficient",
      Stealth: "proficient"
    },
    languages: ["Common"],
    // TODO any two languages
    levels: { Rogue: 3 },
    features: [CunningAction, SneakAttack_default, SpyMultiattack],
    items: [
      { name: "shortsword" },
      { name: "hand crossbow" },
      { name: "crossbow bolt", quantity: 20 }
    ],
    config: {
      initial: { weapon: "hand crossbow" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("shortsword"),
          makeStringChoice("hand crossbow")
        ])
      }),
      apply({ weapon }) {
        this.don(this.getInventoryItem(weapon));
      }
    }
  };
  var ThugMultiattack = makeBagMultiattack(
    "The thug makes two melee attacks.",
    [{ range: "melee" }, { range: "melee" }]
  );
  var Thug = {
    name: "thug",
    cr: 0.5,
    type: "humanoid",
    tokenUrl: thug_default,
    hpMax: 32,
    abilities: [15, 11, 14, 10, 10, 11],
    proficiency: { Intimidation: "proficient" },
    languages: ["Common"],
    // TODO any one language (usually Common)
    features: [PackTactics, ThugMultiattack],
    items: [
      { name: "leather armor", equip: true },
      { name: "mace" },
      { name: "heavy crossbow" },
      { name: "crossbow bolt", quantity: 20 }
    ],
    config: {
      initial: { weapon: "mace" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("mace"),
          makeStringChoice("heavy crossbow")
        ])
      }),
      apply({ weapon }) {
        this.don(this.getInventoryItem(weapon));
      }
    }
  };
  var TribalWarrior = {
    name: "tribal warrior",
    cr: 0.125,
    type: "humanoid",
    tokenUrl: tribal_warrior_default,
    hpMax: 11,
    abilities: [13, 11, 12, 8, 11, 8],
    languages: ["Common"],
    features: [PackTactics],
    items: [
      { name: "hide armor", equip: true },
      { name: "spear", equip: true }
    ]
  };
  var VeteranMultiattack = makeBagMultiattack(
    `The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.`,
    [{ weapon: "longsword" }, { weapon: "longsword" }, { weapon: "shortsword" }]
  );
  var Veteran = {
    name: "veteran",
    cr: 3,
    type: "humanoid",
    tokenUrl: veteran_default,
    hpMax: 58,
    abilities: [16, 13, 14, 10, 11, 10],
    proficiency: { Athletics: "proficient", Perception: "proficient" },
    languages: ["Common"],
    // TODO any one language (usually Common)
    features: [VeteranMultiattack],
    items: [
      { name: "splint armor", equip: true },
      { name: "longsword" },
      { name: "shortsword" },
      { name: "heavy crossbow" },
      { name: "crossbow bolt", quantity: 20 }
    ],
    config: {
      initial: { weapon: "swords" },
      get: (g) => ({
        weapon: new ChoiceResolver(g, "Weapon", [
          makeStringChoice("swords", "longsword/shortsword"),
          makeStringChoice("heavy crossbow")
        ])
      }),
      apply({ weapon }) {
        if (weapon === "heavy crossbow")
          this.don(this.getInventoryItem(weapon));
        else {
          this.don(this.getInventoryItem("longsword"));
          this.don(this.getInventoryItem("shortsword"));
        }
      }
    }
  };

  // src/data/allMonsters.ts
  var allMonsters = {
    chuul: Chuul,
    badger: Badger,
    bat: Bat,
    "giant badger": GiantBadger,
    "air elemental": AirElemental,
    "earth elemental": EarthElemental,
    "fire elemental": FireElemental,
    "water elemental": WaterElemental,
    goblin: Goblin,
    acolyte: Acolyte,
    archmage: Archmage,
    assassin: Assassin,
    bandit: Bandit,
    "bandit captain": BanditCaptain,
    berserker: Berserker,
    commoner: Commoner,
    cultist: Cultist,
    "cult fanatic": CultFanatic,
    druid: Druid2,
    gladiator: Gladiator,
    guard: Guard,
    knight: Knight,
    mage: Mage,
    noble: Noble,
    priest: Priest,
    scout: Scout,
    spy: Spy,
    thug: Thug,
    "tribal warrior": TribalWarrior,
    veteran: Veteran,
    Birnotec: Birnotec_default,
    "Kay of the Abyss": Kay_default,
    "O Gonrit": OGonrit_default,
    Yulash: Yulash_default,
    "Zafron Halehart": Zafron_default
  };
  var allMonsters_default = allMonsters;

  // src/img/tok/pc/aura.png
  var aura_default = "./aura-PXXTYCUY.png";

  // src/pcs/davies/Aura.ts
  var Aura = {
    name: "Aura",
    tokenUrl: aura_default,
    abilities: [8, 15, 11, 14, 9, 14],
    race: { name: "Air Genasi" },
    alignment: ["Chaotic", "Neutral"],
    background: {
      name: "Criminal",
      proficiencies: ["Medicine", "Athletics", "dice set", "horn"]
    },
    levels: [
      {
        class: "Rogue",
        proficiencies: ["Acrobatics", "Deception", "Investigation", "Stealth"],
        configs: {
          Expertise: ["Acrobatics", "thieves' tools", "Stealth", "Investigation"]
        }
      },
      { class: "Rogue" },
      { class: "Rogue", subclass: "Scout" },
      {
        class: "Rogue",
        configs: {
          "Ability Score Improvement (Rogue 4)": { type: "feat", feat: "Lucky" }
        }
      },
      { class: "Rogue" },
      { class: "Rogue" },
      { class: "Rogue" },
      {
        class: "Rogue",
        configs: {
          "Ability Score Improvement (Rogue 8)": {
            type: "ability",
            abilities: ["dex", "dex"]
          }
        }
      }
    ],
    feats: ["Boon of Vassetri"],
    items: [
      { name: "light crossbow", equip: true, enchantments: ["vicious"] },
      { name: "leather armor", equip: true },
      { name: "bracers of the arbalest", equip: true, attune: true },
      { name: "cloak of elvenkind", equip: true, attune: true },
      { name: "rapier" },
      { name: "crossbow bolt", quantity: 20 },
      { name: "crossbow bolt", enchantments: ["+1 weapon"], quantity: 15 }
      // TODO { name: "bag of 1,000 ball bearings" },
      // TODO { name: "flask of oil", quantity: 2 },
      // TODO { name: "thieves' tools" },
    ]
  };
  var Aura_default = Aura;

  // src/img/tok/pc/beldalynn.png
  var beldalynn_default = "./beldalynn-B47TNTON.png";

  // src/pcs/davies/Beldalynn.ts
  var Beldalynn = {
    name: "Beldalynn",
    tokenUrl: beldalynn_default,
    abilities: [11, 13, 13, 15, 13, 8],
    race: {
      name: "Bronze Dragonborn",
      abilities: ["dex", "con", "str"],
      languages: ["Draconic"]
    },
    alignment: ["Lawful", "Neutral"],
    background: {
      name: "Sage",
      proficiencies: ["Perception"],
      languages: ["Elvish", "Infernal"]
    },
    levels: [
      { class: "Wizard", proficiencies: ["Arcana", "Investigation"] },
      { class: "Wizard", subclass: "Evocation" },
      { class: "Wizard" },
      {
        class: "Wizard",
        configs: {
          "Ability Score Improvement (Wizard 4)": {
            type: "ability",
            abilities: ["int", "wis"]
          }
        }
      },
      { class: "Wizard" },
      { class: "Wizard" },
      { class: "Wizard" },
      {
        class: "Wizard",
        configs: {
          "Ability Score Improvement (Wizard 8)": {
            type: "feat",
            feat: "Gift of the Metallic Dragon"
          },
          "Gift of the Metallic Dragon": "int"
        }
      }
    ],
    items: [
      { name: "cloak of protection", equip: true, attune: true },
      { name: "quarterstaff", enchantments: ["chaotic burst"], equip: true },
      { name: "dragon-touched focus (slumbering)", equip: true, attune: true },
      { name: "dagger" }
      // { name: "clockwork mouse" },
      // { name: "dust of dryness" },
      // { name: "dust of obeisance" },
      // TODO { name: "scroll of bestow curse" },
      // TODO { name: "scroll of dispel magic" },
      // TODO { name: "potion of clairvoyance" },
      // TODO { name: "potion of water breathing" },
      // TODO { name: "Keoghtom's ointment", quantity: 4 },
    ],
    prepared: [
      "acid splash",
      "fire bolt",
      "message",
      "ray of frost",
      "ice knife",
      "magic missile",
      "shield",
      "enlarge/reduce",
      "hold person",
      "fireball",
      "intellect fortress",
      "Leomund's tiny hut",
      "Melf's minute meteors",
      "summon aberration",
      "wall of fire"
    ],
    known: ["comprehend languages", "find familiar", "floating disk", "identify"]
  };
  var Beldalynn_default = Beldalynn;

  // src/img/tok/pc/galilea.png
  var galilea_default = "./galilea-D4XX5FIV.png";

  // src/pcs/davies/Galilea.ts
  var Galilea = {
    name: "Galilea",
    tokenUrl: galilea_default,
    abilities: [13, 10, 15, 11, 11, 13],
    race: {
      name: "Human",
      configs: { "Extra Language": "Sylvan" }
    },
    alignment: ["Lawful", "Neutral"],
    background: {
      name: "Noble",
      proficiencies: ["playing card set"],
      languages: ["Orc"]
    },
    levels: [
      { class: "Paladin" },
      {
        class: "Paladin",
        subclass: "Devotion",
        configs: { "Fighting Style (Paladin)": "Fighting Style: Protection" }
      },
      { class: "Paladin" },
      {
        class: "Paladin",
        configs: {
          "Ability Score Improvement (Paladin 4)": {
            type: "ability",
            abilities: ["str", "str"]
          }
        }
      },
      { class: "Paladin" },
      { class: "Paladin" },
      { class: "Paladin" },
      {
        class: "Paladin",
        configs: {
          "Ability Score Improvement (Paladin 8)": {
            type: "feat",
            feat: "Sentinel"
          }
        }
      }
    ],
    items: [
      { name: "longsword", equip: true },
      { name: "shield", equip: true },
      { name: "splint armor", equip: true },
      { name: "ring of awe", equip: true, attune: true },
      { name: "silver shining amulet", equip: true, attune: true },
      { name: "figurine of wondrous power, silver raven" },
      { name: "wand of web", attune: true },
      { name: "light crossbow" },
      { name: "crossbow bolt", quantity: 20 },
      { name: "light hammer" },
      { name: "greatsword" }
    ],
    prepared: [
      "bless",
      "ceremony",
      "divine favor",
      "shield of faith",
      "aid",
      "magic weapon"
    ]
  };
  var Galilea_default = Galilea;

  // src/img/tok/pc/hagrond.png
  var hagrond_default = "./hagrond-SXREGQ37.png";

  // src/pcs/davies/Hagrond.ts
  var Hagrond = {
    name: "Hagrond",
    tokenUrl: hagrond_default,
    abilities: [15, 15, 13, 10, 8, 10],
    race: { name: "Stout Halfling" },
    alignment: ["Chaotic", "Good"],
    background: {
      name: "Folk Hero",
      proficiencies: ["Sleight of Hand", "woodcarver's tools"]
    },
    levels: [
      { class: "Barbarian", proficiencies: ["Intimidation", "Animal Handling"] },
      { class: "Barbarian" },
      {
        class: "Barbarian",
        subclass: "Berserker",
        configs: { "Primal Knowledge": ["Perception"] }
      },
      {
        class: "Barbarian",
        configs: {
          "Ability Score Improvement (Barbarian 4)": {
            type: "ability",
            abilities: ["str", "con"]
          }
        }
      },
      { class: "Barbarian" },
      { class: "Barbarian" },
      { class: "Barbarian" },
      {
        class: "Barbarian",
        configs: {
          "Ability Score Improvement (Barbarian 8)": {
            type: "ability",
            abilities: ["str", "str"]
          }
        }
      }
    ],
    items: [
      { name: "spear", enchantments: ["dark sun"], equip: true, attune: true },
      {
        name: "trident",
        enchantments: ["of the deep"],
        equip: true,
        attune: true
      },
      { name: "dagger", quantity: 4 },
      { name: "handaxe" },
      { name: "longsword" },
      { name: "spear" },
      { name: "potion of hill giant strength" },
      { name: "longsword" },
      { name: "potion of healing" }
      // TODO { name: "thieves' tools" },
      // TODO { name: "woodcarver's tools" },
    ]
  };
  var Hagrond_default = Hagrond;

  // src/img/tok/pc/salgar.png
  var salgar_default = "./salgar-WLUJXZFZ.png";

  // src/pcs/davies/Salgar.ts
  var Salgar = {
    name: "Salgar",
    tokenUrl: salgar_default,
    abilities: [10, 8, 14, 14, 15, 10],
    race: {
      name: "Mountain Dwarf",
      configs: { "Tool Proficiency": "mason's tools" }
    },
    alignment: ["Neutral", "Good"],
    background: { name: "Sage", languages: ["Elvish", "Giant"] },
    levels: [
      { class: "Druid", proficiencies: ["Insight", "Survival"] },
      {
        class: "Druid",
        subclass: "Land",
        configs: {
          "Wild Shape": [
            "bat",
            "cat",
            "constrictor snake",
            "crab",
            "dolphin",
            "giant badger",
            "giant goat",
            "giant wolf spider",
            "warhorse"
          ],
          "Circle Spells": "mountain",
          "Bonus Cantrip": "magic stone"
        }
      },
      { class: "Druid" },
      {
        class: "Druid",
        configs: {
          "Ability Score Improvement (Druid 4)": {
            type: "ability",
            abilities: ["cha", "wis"]
          }
        }
      },
      { class: "Druid" },
      { class: "Druid" },
      { class: "Druid" },
      {
        class: "Druid",
        configs: {
          "Ability Score Improvement (Druid 8)": {
            type: "feat",
            feat: "Telekinetic"
          },
          Telekinetic: "cha"
        }
      }
    ],
    items: [
      { name: "arrow-catching shield", equip: true, attune: true },
      { name: "boots of the winterlands", equip: true, attune: true },
      { name: "spear", equip: true },
      { name: "hide armor", equip: true },
      { name: "handaxe" },
      { name: "shortsword", enchantments: ["silvered"] }
      // TODO { name: "Ioun stone of reserve", equip: true, attune: true, config: 'fly' },
      // TODO { name: "potion of speed" },
      // TODO { name: "pale mushroom poison", quantity: 4 },
      // TODO { name: "potion of necrotic resistance" },
    ],
    prepared: [
      "druidcraft",
      "mending",
      "mold earth",
      "cure wounds",
      "detect magic",
      "earth tremor",
      "purify food and drink",
      "speak with animals",
      "lesser restoration",
      "locate object",
      "moonbeam",
      "protection from poison",
      "dispel magic",
      "guardian of nature",
      "stoneskin"
    ]
  };
  var Salgar_default = Salgar;

  // src/img/tok/pc/esles.png
  var esles_default = "./esles-DH2ROBMH.png";

  // src/pcs/glean/Es'les.ts
  var Esles = {
    name: "Es'les",
    tokenUrl: esles_default,
    abilities: [8, 13, 14, 10, 12, 15],
    race: { name: "Tiefling (Asmodeus)" },
    alignment: ["Lawful", "Evil"],
    background: { name: "Sage", languages: ["Abyssal", "Celestial"] },
    levels: [
      {
        class: "Warlock",
        subclass: "Fiend",
        proficiencies: ["Deception", "Nature"]
      }
    ],
    items: [
      { name: "quarterstaff", equip: true },
      { name: "leather armor", equip: true },
      { name: "crossbow bolt", quantity: 20 },
      { name: "light crossbow" },
      { name: "dagger", quantity: 2 }
    ],
    prepared: ["minor illusion", "charm person", "command"]
  };
  var Es_les_default = Esles;

  // src/img/tok/pc/faerfarn.png
  var faerfarn_default = "./faerfarn-XU3HLPJI.png";

  // src/pcs/glean/Faerfarn.ts
  var Faerfarn = {
    name: "Faefarn Alruuth",
    tokenUrl: faerfarn_default,
    abilities: [15, 14, 12, 10, 13, 8],
    race: { name: "Gold Dragonborn" },
    alignment: ["Neutral", "Neutral"],
    background: { name: "Soldier", proficiencies: ["dragonchess set"] },
    levels: [
      {
        class: "Fighter",
        proficiencies: ["Acrobatics", "Survival"],
        configs: {
          "Fighting Style (Fighter)": "Fighting Style: Great Weapon Fighting"
        }
      },
      { class: "Fighter" }
    ],
    items: [
      { name: "longsword", equip: true },
      { name: "leather armor", equip: true },
      { name: "light crossbow" },
      { name: "longbow" },
      { name: "arrow", quantity: 20 },
      { name: "crossbow bolt", quantity: 20 }
    ]
  };
  var Faerfarn_default = Faerfarn;

  // src/img/tok/pc/litt.png
  var litt_default = "./litt-OO7HQERP.png";

  // src/pcs/glean/Litt.ts
  var Litt = {
    name: "Litt",
    tokenUrl: litt_default,
    abilities: [8, 10, 14, 12, 15, 13],
    race: { name: "Fire Genasi" },
    alignment: ["Chaotic", "Good"],
    background: {
      name: "Outlander",
      proficiencies: ["pan flute"],
      languages: ["Infernal"]
    },
    levels: [{ class: "Druid", proficiencies: ["Animal Handling", "Insight"] }],
    items: [
      { name: "leather armor", equip: true },
      { name: "quarterstaff", equip: true },
      { name: "dagger" }
    ],
    prepared: [
      "gust",
      "poison spray",
      "animal friendship",
      "faerie fire",
      "speak with animals"
    ]
  };
  var Litt_default = Litt;

  // src/img/tok/pc/marvoril.png
  var marvoril_default = "./marvoril-LEL3VCQJ.png";

  // src/pcs/glean/Marvoril.ts
  var Marvoril = {
    name: "Marvoril",
    tokenUrl: marvoril_default,
    abilities: [15, 8, 13, 12, 10, 14],
    race: {
      name: "Half-Elf",
      configs: {
        "Ability Score Bonus": ["str", "con"],
        "Skill Versatility": ["Athletics", "Persuasion"],
        "Extra Language": "Dwarvish"
      }
    },
    alignment: ["Lawful", "Neutral"],
    background: {
      name: "Acolyte",
      proficiencies: ["Survival", "Investigation"],
      languages: ["Primordial", "Infernal"]
    },
    levels: [
      { class: "Paladin", proficiencies: ["Insight", "Religion"] },
      { class: "Paladin" }
    ],
    items: [
      { name: "chain mail", equip: true },
      { name: "morningstar", equip: true },
      { name: "shield", equip: true }
    ],
    prepared: ["command", "cure wounds", "detect magic", "divine favor"]
  };
  var Marvoril_default = Marvoril;

  // src/img/tok/pc/shaira.png
  var shaira_default = "./shaira-FCUEHDNM.png";

  // src/pcs/glean/Shaira.ts
  var Shaira = {
    name: "Shaira",
    tokenUrl: shaira_default,
    abilities: [13, 10, 8, 14, 15, 12],
    race: {
      name: "Half-Elf",
      configs: {
        "Ability Score Bonus": ["int", "wis"],
        "Skill Versatility": ["Persuasion", "History"],
        "Extra Language": ["Dwarvish"]
      }
    },
    alignment: ["Chaotic", "Good"],
    background: { name: "Criminal", proficiencies: ["playing card set"] },
    levels: [
      {
        class: "Bard",
        proficiencies: [
          "birdpipes",
          "glaur",
          "tocken",
          "Investigation",
          "Medicine",
          "Survival"
        ]
      },
      { class: "Bard" }
    ],
    items: [
      { name: "leather armor", equip: true },
      { name: "rapier", equip: true },
      { name: "dagger" }
    ],
    prepared: [
      "dancing lights",
      "thunderclap",
      "comprehend languages",
      "healing word",
      "hideous laughter",
      "illusory script",
      "sleep"
    ]
  };
  var Shaira_default = Shaira;

  // src/img/tok/pc/dandelion.png
  var dandelion_default = "./dandelion-VCFEFB2F.png";

  // src/pcs/kythera/Dandelion.ts
  var Dandelion = {
    name: "Dandelion",
    tokenUrl: dandelion_default,
    abilities: [13, 16, 14, 8, 9, 15],
    race: { name: "Protector Aasimar" },
    alignment: ["Lawful", "Neutral"],
    background: {
      name: "Outlander",
      proficiencies: ["horn"],
      languages: ["Gith"]
    },
    levels: [
      {
        class: "Rogue",
        proficiencies: ["Persuasion", "Performance", "Insight", "Perception"],
        configs: { Expertise: ["Persuasion", "Insight"] }
      },
      { class: "Rogue", hpRoll: 7 },
      { class: "Rogue", hpRoll: 1, subclass: "Swashbuckler" },
      { class: "Paladin", hpRoll: 9 },
      {
        class: "Paladin",
        hpRoll: 1,
        configs: { "Fighting Style (Paladin)": "Fighting Style: Defense" }
      },
      { class: "Paladin", hpRoll: 9, subclass: "Crown" },
      {
        class: "Paladin",
        hpRoll: 9,
        configs: {
          "Ability Score Improvement (Paladin 4)": {
            type: "feat",
            feat: "War Caster"
          }
        }
      },
      { class: "Paladin", hpRoll: 9 },
      { class: "Paladin", hpRoll: 9 }
    ],
    items: [
      // TODO { name: "Colonel Marsoc Mcflucky" },
      { name: "belt of dwarvenkind", equip: true, attune: true },
      // TODO { name: "Francis Scott Lockpick" },
      { name: "gauntlets of flaming fury", equip: true, attune: true },
      { name: "pariah's shield", equip: true, attune: true },
      { name: "rapier", enchantments: ["+2 weapon"], equip: true },
      { name: "potion of greater healing", quantity: 2 },
      { name: "dagger", quantity: 2 },
      { name: "half plate armor", equip: true },
      { name: "shortbow" },
      { name: "dimensional shackles" },
      // { name: "calligrapher's supplies" },
      // TODO { name: "hunting trap" },
      // { name: "thieves' tools" },
      { name: "arrow", quantity: 28 }
    ],
    prepared: [
      "bless",
      "divine favor",
      "protection from evil and good",
      "aid",
      "find steed",
      "prayer of healing"
    ]
  };
  var Dandelion_default = Dandelion;

  // src/img/tok/pc/moya.png
  var moya_default = "./moya-2LYCOCKR.png";

  // src/pcs/kythera/Moya.ts
  var Moya = {
    name: "Moya",
    tokenUrl: moya_default,
    abilities: [11, 7, 15, 15, 17, 9],
    race: { name: "Water Genasi" },
    alignment: ["Neutral", "Good"],
    background: {
      name: "Hermit",
      proficiencies: ["brewer's supplies"],
      languages: ["Deep Speech"]
    },
    levels: [
      { class: "Druid", proficiencies: ["Nature", "Animal Handling"] },
      {
        class: "Druid",
        hpRoll: 8,
        subclass: "Shepherd",
        configs: {
          "Wild Shape": [
            "ape",
            "badger",
            "black bear",
            "cat",
            "constrictor snake",
            "cow",
            "crab",
            "crocodile",
            "deer",
            "dolphin",
            "draft horse",
            "elk",
            "giant crab",
            "giant frog",
            "giant lizard",
            "giant poisonous snake",
            "giant sea horse",
            "giant wolf spider",
            "goat",
            "lizard",
            "mastiff",
            "mule",
            "octopus",
            "ox",
            "quipper",
            "reef shark",
            "riding horse",
            "sea horse",
            "spider",
            "warhorse",
            "wolf"
          ]
        }
      },
      { class: "Druid", hpRoll: 8 },
      {
        class: "Druid",
        hpRoll: 5,
        configs: {
          "Ability Score Improvement (Druid 4)": {
            type: "feat",
            feat: "Ritual Caster"
          },
          "Ritual Caster": {
            list: "Wizard",
            spells: ["comprehend languages", "identify", "unseen servant"]
          }
        }
      },
      { class: "Druid", hpRoll: 2 },
      { class: "Druid", hpRoll: 8 }
    ],
    items: [
      // TODO { name: "horseshoes of speed" },
      // TODO { name: "tempest staff", equip: true, attune: true },
      { name: "breastplate", equip: true },
      // { name: "cloak of billowing", equip: true },
      // TODO { name: "lamannian oak focus", equip: true, attune: true },
      { name: "shield", equip: true },
      { name: "sickle" },
      { name: "potion of healing", quantity: 3 }
      // { name: "brewer's supplies" },
      // { name: "herbalism kit" },
    ],
    prepared: [
      "mending",
      "primal savagery",
      "thorn whip",
      "absorb elements",
      "cure wounds",
      "healing word",
      "thunderwave",
      "darkvision",
      "lesser restoration",
      "summon beast",
      "conjure animals",
      "dispel magic",
      "tidal wave"
    ]
  };
  var Moya_default = Moya;

  // src/img/tok/pc/tethilssethanar.png
  var tethilssethanar_default = "./tethilssethanar-7GNDRUAR.png";

  // src/pcs/wizards/Tethilssethanar.ts
  var Tethilssethanar = {
    name: "Tethilssethanar",
    tokenUrl: tethilssethanar_default,
    abilities: [9, 14, 13, 8, 15, 13],
    race: { name: "Triton" },
    alignment: ["Lawful", "Neutral"],
    background: {
      name: "Knight",
      proficiencies: ["playing card set"],
      languages: ["Deep Speech"]
    },
    levels: [{ class: "Monk", proficiencies: ["Athletics", "Insight"] }],
    items: [
      { name: "sickle", equip: true },
      { name: "dart", quantity: 10, equip: true },
      { name: "sling" },
      { name: "sling bullet", quantity: 40 }
    ]
  };
  var Tethilssethanar_default = Tethilssethanar;

  // src/data/allPCs.ts
  var allPCs = {
    Aura: Aura_default,
    Beldalynn: Beldalynn_default,
    Galilea: Galilea_default,
    Hagrond: Hagrond_default,
    Salgar: Salgar_default,
    Tethilssethanar: Tethilssethanar_default,
    "Es'les": Es_les_default,
    Faerfarn: Faerfarn_default,
    Litt: Litt_default,
    Marvoril: Marvoril_default,
    Shaira: Shaira_default,
    Dandelion: Dandelion_default,
    Moya: Moya_default
  };
  var allPCs_default = allPCs;

  // src/img/eq/punch.svg
  var punch_default = "./punch-TEM63CHE.svg";

  // src/PC.ts
  var UnarmedStrike = class extends WeaponBase {
    constructor(g, owner) {
      super(
        g,
        "unarmed strike",
        "natural",
        "melee",
        _fd(1, "bludgeoning"),
        void 0,
        punch_default
      );
      this.owner = owner;
    }
  };
  var PC = class extends CombatantBase {
    constructor(g, name, img, rules = defaultAIRules) {
      super(g, name, {
        type: "humanoid",
        size: SizeCategory_default.Medium,
        img,
        side: 0,
        diesAtZero: false,
        level: 0,
        rules
      });
      this.subclasses = /* @__PURE__ */ new Map();
      this.naturalWeapons.add(new UnarmedStrike(g, this));
    }
    gainLanguages(list = []) {
      for (const gain of list)
        if (gain.type === "static")
          this.languages.add(gain.value);
    }
    gainProficiencies(...list) {
      for (const gain of list)
        if (gain.type === "static")
          this.addProficiency(gain.value, "proficient");
    }
    setRace(race) {
      var _a, _b, _c, _d, _e;
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
      for (const tag of (_e = race == null ? void 0 : race.tags) != null ? _e : [])
        this.tags.add(tag);
    }
    setBackground(bg) {
      var _a;
      this.background = bg;
      this.gainLanguages(bg.languages);
      this.gainProficiencies(...bg.skills, ...(_a = bg.tools) != null ? _a : []);
    }
    addClassLevel(cls, hpRoll) {
      var _a, _b;
      const level = this.getClassLevel(cls.name, 0) + 1;
      this.classLevels.set(cls.name, level);
      this.level++;
      this.pb = getProficiencyBonusByLevel(this.level);
      this.baseHpMax += hpRoll != null ? hpRoll : getDefaultHPRoll(this.level, cls.hitDieSize);
      if (level === 1) {
        const data = this.level === 1 ? cls : cls.multi;
        mergeSets(this.armorProficiencies, data.armor);
        mergeSets(this.saveProficiencies, data.save);
        mergeSets(this.weaponCategoryProficiencies, data.weaponCategory);
        mergeSets(this.weaponProficiencies, data.weapon);
        this.gainProficiencies(...(_a = data.skill) != null ? _a : [], ...(_b = data.tool) != null ? _b : []);
      }
      this.addFeatures(cls.features.get(level));
      const sub = this.subclasses.get(cls.name);
      this.addFeatures(sub == null ? void 0 : sub.features.get(level));
    }
    addSubclass(sub) {
      this.subclasses.set(sub.className, sub);
    }
    finaliseHP() {
      this.baseHpMax += this.level * this.con.modifier;
      super.finaliseHP();
    }
  };

  // src/backgrounds/Acolyte.ts
  var Acolyte2 = {
    name: "Acolyte",
    description: `You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshipers into the presence of the divine. You are not necessarily a cleric\u2014performing sacred rites is not the same thing as channeling divine power. Choose a god, a pantheon of gods, or some other quasi-divine being from among those listed in "Fantasy-Historical Pantheons" or those specified by your GM, and work with your GM to detail the nature of your religious service. Were you a lesser functionary in a temple, raised from childhood to assist the priests in the sacred rites? Or were you a high priest who suddenly experienced a call to serve your god in a different way? Perhaps you were the leader of a small cult outside of any established temple structure, or even an occult group that served a fiendish master that you now deny.`,
    feature: {
      name: "Shelter of the Faithful",
      description: `As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle. You might also have ties to a specific temple dedicated to your chosen deity or pantheon, and you have a residence there. This could be the temple where you used to serve, if you remain on good terms with it, or a temple where you have found a new home. While near your temple, you can call upon the priests for assistance, provided the assistance you ask for is not hazardous and you remain in good standing with your temple.`
    },
    skills: gains(["Insight", "Religion"]),
    languages: gains([], 2, LanguageNames)
  };
  var Acolyte_default = Acolyte2;

  // src/backgrounds/Criminal.ts
  var Criminal = {
    name: "Criminal",
    description: `You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld. You\u2019re far closer than most people to the world of murder, theft, and violence that pervades the underbelly of civilization, and you have survived up to this point by flouting the rules and regulations of society.`,
    feature: {
      name: "Criminal Contact",
      description: `You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.`
    },
    skills: gains(["Deception", "Stealth"]),
    tools: gains(["thieves' tools"], 1, GamingSets)
  };
  var Criminal_default = Criminal;

  // src/backgrounds/FolkHero.ts
  var FolkHero = {
    name: "Folk Hero",
    description: `You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere.`,
    feature: {
      name: "Rustic Hospitality",
      description: `Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.`
    },
    skills: gains(["Animal Handling", "Survival"]),
    tools: gains(["vehicles (land)"], 1, ArtisansTools)
  };
  var FolkHero_default = FolkHero;

  // src/backgrounds/Hermit.ts
  var Hermit = {
    name: "Hermit",
    description: `You lived in seclusion\u2013either in a sheltered community such as a monastery, or entirely alone\u2013for a formative part of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for.`,
    feature: {
      name: "Discovery",
      description: `The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen. You might have uncovered a fact that has long been forgotten, or unearthed some relic of the past that could rewrite history. It might be information that would be damaging to the people who or consigned you to exile, and hence the reason for your return to society.

    Work with your DM to determine the details of your discovery and its impact on the campaign.`
    },
    skills: gains(["Medicine", "Religion"]),
    tools: gains(["herbalism kit"]),
    languages: gains([], 1, LanguageNames)
  };
  var Hermit_default = Hermit;

  // src/backgrounds/Knight.ts
  var Knight2 = {
    name: "Knight",
    description: `
  A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature (see the sidebar) instead of the Position of Privilege feature. One of your commoner retainers is replaced by a noble who serves as your squire, aiding you in exchange for training on his or her own path to knighthood. Your two remaining retainers might include a groom to care for your horse and a servant who polishes your armor (and even helps you put it on).
  
  As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart\u2014in a chaste sort of devotion. (This person could be your bond.)`,
    feature: {
      name: "Retainers",
      description: `A knighthood is among the lowest noble titles in most societies, but it can be a path to higher status. If you wish to be a knight, choose the Retainers feature instead of the Position of Privilege feature.

  As an emblem of chivalry and the ideals of courtly love, you might include among your equipment a banner or other token from a noble lord or lady to whom you have given your heart-in a chaste sort of devotion.`
    },
    skills: gains(["History", "Persuasion"]),
    tools: gains([], 1, GamingSets),
    languages: gains([], 1, LanguageNames)
  };
  var Knight_default = Knight2;

  // src/backgrounds/Noble.ts
  var Noble2 = {
    name: "Noble",
    description: `You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence. You might be a pampered aristocrat unfamiliar with work or discomfort, a former merchant just elevated to the nobility, or a disinherited scoundrel with a disproportionate sense of entitlement. Or you could be an honest, hard-working landowner who cares deeply about the people who live and work on your land, keenly aware of your responsibility to them.

  Work with your DM to come up with an appropriate title and determine how much authority that title carries. A noble title doesn\u2019t stand on its own\u2014it\u2019s connected to an entire family, and whatever title you hold, you will pass it down to your own children. Not only do you need to determine your noble title, but you should also work with the DM to describe your family and their influence on you.
  
  Is your family old and established, or was your title only recently bestowed? How much influence do they wield, and over what area? What kind of reputation does your family have among the other aristocrats of the region? How do the common people regard them?
  
  What\u2019s your position in the family? Are you the heir to the head of the family? Have you already inherited the title? How do you feel about that responsibility? Or are you so far down the line of inheritance that no one cares what you do, as long as you don\u2019t embarrass the family? How does the head of your family feel about your adventuring career? Are you in your family\u2019s good graces, or shunned by the rest of your family?
  
  Does your family have a coat of arms? An insignia you might wear on a signet ring? Particular colors you wear all the time? An animal you regard as a symbol of your line or even a spiritual member of the family?
  
  These details help establish your family and your title as features of the world of the campaign.`,
    feature: {
      name: "Position of Privilege",
      description: `Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere. You can secure an audience with a local noble if you need to.`
    },
    skills: gains(["History", "Persuasion"]),
    tools: gains([], 1, GamingSets),
    languages: gains([], 1, LanguageNames)
  };
  var Noble_default = Noble2;

  // src/backgrounds/Outlander.ts
  var Outlander = {
    name: "Outlander",
    description: `You grew up in the wilds, far from civilization and the comforts of town and technology. You've witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction. The wilds are in your blood, whether you were a nomad, an explorer, a recluse, a hunter-gatherer, or even a marauder. Even in places where you don't know the specific features of the terrain, you know the ways of the wild.`,
    feature: {
      name: "Wanderer",
      description: `You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.`
    },
    skills: gains(["Athletics", "Survival"]),
    tools: gains([], 1, Instruments),
    languages: gains([], 1, LanguageNames)
  };
  var Outlander_default = Outlander;

  // src/backgrounds/Sage.ts
  var Sage = {
    name: "Sage",
    description: `You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study.`,
    feature: {
      name: "Researcher",
      description: `When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found. Unearthing the deepest secrets of the multiverse can require an adventure or even a whole campaign.`
    },
    skills: gains(["Arcana", "History"]),
    languages: gains([], 2, LanguageNames)
  };
  var Sage_default = Sage;

  // src/backgrounds/Soldier.ts
  var Soldier = {
    name: "Soldier",
    description: `War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield. You might have been part of a standing national army or a mercenary company, or perhaps a member of a local militia who rose to prominence during a recent war.

  When you choose this background, work with your DM to determine which military organization you were a part of, how far through its ranks you progressed, and what kind of experiences you had during your military career. Was it a standing army, a town guard, or a village militia? Or it might have been a noble's or merchant's private army, or a mercenary company.`,
    feature: {
      name: "Military Rank",
      description: `You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use. You can also usually gain access to friendly military encampments and fortresses where your rank is recognized.`
    },
    skills: gains(["Athletics", "Intimidation"]),
    tools: gains(["vehicles (land)"], 1, GamingSets)
  };
  var Soldier_default = Soldier;

  // src/data/allBackgrounds.ts
  var allBackgrounds = {
    Acolyte: Acolyte_default,
    Criminal: Criminal_default,
    "Folk Hero": FolkHero_default,
    Hermit: Hermit_default,
    Knight: Knight_default,
    Noble: Noble_default,
    Outlander: Outlander_default,
    Sage: Sage_default,
    Soldier: Soldier_default
  };
  var allBackgrounds_default = allBackgrounds;

  // src/classes/artificer/FlashOfGenius.ts
  var FlashOfGeniusResource = new LongRestResource("Flash of Genius", 1);
  var FlashOfGeniusAction = class extends AbstractSingleTargetAction {
    constructor(g, actor, bonus) {
      super(
        g,
        actor,
        "Flash of Genius",
        "implemented",
        { target: new TargetResolver(g, 30, [canSee]) },
        {
          time: "reaction",
          resources: [[FlashOfGeniusResource, 1]],
          description: `When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll.`
        }
      );
      this.bonus = bonus;
    }
    async applyEffect() {
      this.bonus.add(this.actor.int.modifier, FlashOfGenius);
    }
  };
  var FlashOfGenius = new SimpleFeature(
    "Flash of Genius",
    `Starting at 7th level, you gain the ability to come up with solutions under pressure. When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll.

You can use this feature a number of times equal to your Intelligence modifier (minimum of once). You regain all expended uses when you finish a long rest.`,
    (g, me) => {
      const charges = Math.max(1, me.int.modifier);
      me.initResource(FlashOfGeniusResource, charges);
      const doFlash = (description, target, interrupt, bonus) => {
        const action = new FlashOfGeniusAction(g, me, bonus);
        const config = { target };
        if (checkConfig(g, action, config))
          interrupt.add(
            new YesNoChoice(
              me,
              FlashOfGenius,
              "Flash of Genius",
              `Use ${me.name}'s reaction to give +${me.int.modifier} to ${description}?`,
              Priority_default.ChangesOutcome,
              () => g.act(action, config)
            )
          );
      };
      g.events.on(
        "BeforeCheck",
        ({ detail: { who, ability, skill, interrupt, bonus } }) => doFlash(
          `${who.name}'s ${describeCheck(ability, skill)} check`,
          who,
          interrupt,
          bonus
        )
      );
      g.events.on(
        "BeforeSave",
        ({ detail: { who, tags, ability, interrupt, bonus } }) => doFlash(
          `${who.name}'s ${describeSave(tags, ability)} save`,
          who,
          interrupt,
          bonus
        )
      );
    }
  );
  var FlashOfGenius_default = FlashOfGenius;

  // src/classes/artificer/index.ts
  var ArtificerSpellcasting = new NormalSpellcasting(
    "Artificer",
    `You have studied the workings of magic and how to channel it through objects. As a result, you have gained the ability to cast spells. To observers, you don't appear to be casting spells in a conventional way; you look as if you're producing wonders using mundane items or outlandish inventions.`,
    "int",
    "half",
    "Artificer",
    "Artificer"
  );
  var MagicalTinkering = nonCombatFeature(
    "Magical Tinkering",
    `At 1st level, you learn how to invest a spark of magic into mundane objects. To use this ability, you must have thieves' tools or artisan's tools in hand. You then touch a Tiny nonmagical object as an action and give it one of the following magical properties of your choice:
- The object sheds bright light in a 5-foot radius and dim light for an additional 5 feet.
- Whenever tapped by a creature, the object emits a recorded message that can be heard up to 10 feet away. You utter the message when you bestow this property on the object, and the recording can be no more than 6 seconds long.
- The object continuously emits your choice of an odor or a nonverbal sound (wind, waves, chirping, or the like). The chosen phenomenon is perceivable up to 10 feet away.
- A static visual effect appears on one of the object's surfaces. This effect can be a picture, up to 25 words of text, lines and shapes, or a mixture of these elements, as you like.

The chosen property lasts indefinitely. As an action, you can touch the object and end the property early.
You can bestow magic on multiple objects, touching one object each time you use this feature, though a single object can only bear one property at a time. The maximum number of objects you can affect with this feature at one time is equal to your Intelligence modifier (minimum of one object). If you try to exceed your maximum, the oldest property immediately ends, and then the new property applies.`
  );
  var InfuseItem = nonCombatFeature(
    "Infuse Item",
    `At 2nd level, you gain the ability to imbue mundane items with certain magical infusions. The magic items you create with this feature are effectively prototypes of permanent items.`
  );
  var TheRightToolForTheJob = nonCombatFeature(
    "The Right Tool for the Job",
    `At 3rd level, you learn how to produce exactly the tool you need: with thieves' tools or artisan's tools in hand, you can magically create one set of artisan's tools in an unoccupied space within 5 feet of you. This creation requires 1 hour of uninterrupted work, which can coincide with a short or long rest. Though the product of magic, the tools are nonmagical, and they vanish when you use this feature again.`
  );
  var ToolExpertise = new SimpleFeature(
    "Tool Expertise",
    `Starting at 6th level, your proficiency bonus is doubled for any ability check you make that uses your proficiency with a tool.`,
    (g, me) => {
      g.events.on("BeforeCheck", ({ detail: { who, tool, proficiency } }) => {
        if (who === me && tool)
          proficiency.add("expertise", ToolExpertise);
      });
    }
  );
  var MagicItemAdept = nonCombatFeature(
    "Magic Item Adept",
    `When you reach 10th level, you achieve a profound understanding of how to use and make magic items:
- You can attune to up to four magic items at once.
- If you craft a magic item with a rarity of common or uncommon, it takes you a quarter of the normal time, and it costs you half as much of the usual gold.`
  );
  var SpellStoringItem = nonCombatFeature(
    "Spell-Storing Item",
    `At 11th level, you learn how to store a spell in an object. Whenever you finish a long rest, you can touch one simple or martial weapon or one item that you can use as a spellcasting focus, and you store a spell in it, choosing a 1st- or 2nd-level spell from the artificer spell list that requires 1 action to cast (you needn't have it prepared).

While holding the object, a creature can take an action to produce the spell's effect from it, using your spellcasting ability modifier. If the spell requires concentration, the creature must concentrate. The spell stays in the object until it's been used a number of times equal to twice your Intelligence modifier (minimum of twice) or until you use this feature again to store a spell in an object.`
  );
  var MagicItemSavant = nonCombatFeature(
    "Magic Item Savant",
    `At 14th level, your skill with magic items deepens more:
- You can attune to up to five magic items at once.
- You ignore all class, race, spell, and level requirements on attuning to or using a magic item.`
  );
  var MagicItemMaster = nonCombatFeature(
    "Magic Item Master",
    `Starting at 18th level, you can attune to up to six magic items at once.`
  );
  var SoulOfArtifice = notImplementedFeature(
    "Soul of Artifice",
    `At 20th level, you develop a mystical connection to your magic items, which you can draw on for protection:
- You gain a +1 bonus to all saving throws per magic item you are currently attuned to.
- If you're reduced to 0 hit points but not killed outright, you can use your reaction to end one of your artificer infusions, causing you to drop to 1 hit point instead of 0.`
  );
  var ASI45 = makeASI("Artificer", 4);
  var ASI85 = makeASI("Artificer", 8);
  var ASI125 = makeASI("Artificer", 12);
  var ASI165 = makeASI("Artificer", 16);
  var ASI195 = makeASI("Artificer", 19);
  var Artificer = {
    name: "Artificer",
    hitDieSize: 8,
    armor: acSet("light", "medium", "shield"),
    weaponCategory: wcSet("simple"),
    tool: gains(["thieves' tools", "tinker's tools"], 1, ArtisansTools),
    save: abSet("con", "int"),
    skill: gains([], 2, [
      "Arcana",
      "History",
      "Investigation",
      "Medicine",
      "Nature",
      "Perception",
      "Sleight of Hand"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([["int", 13]]),
      armor: acSet("light", "medium", "shield"),
      tool: gains(["thieves' tools", "tinker's tools"])
    },
    features: /* @__PURE__ */ new Map([
      [1, [MagicalTinkering, ArtificerSpellcasting.feature]],
      [2, [InfuseItem]],
      [3, [TheRightToolForTheJob]],
      [4, [ASI45]],
      [6, [ToolExpertise]],
      [7, [FlashOfGenius_default]],
      [8, [ASI85]],
      [10, [MagicItemAdept]],
      [11, [SpellStoringItem]],
      [12, [ASI125]],
      [14, [MagicItemSavant]],
      [16, [ASI165]],
      [18, [MagicItemMaster]],
      [19, [ASI195]],
      [20, [SoulOfArtifice]]
    ])
  };
  var artificer_default = Artificer;

  // src/img/act/rage.svg
  var rage_default = "./rage-EKMK4HCH.svg";

  // src/img/class/barbarian.svg
  var barbarian_default = "./barbarian-JECLGVUM.svg";

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
  var EndRageAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "End Rage",
        "implemented",
        {},
        {
          icon: EndRageIcon,
          subIcon: BarbarianIcon,
          time: "bonus action",
          description: `You can end your rage on your turn as a bonus action.`
        }
      );
    }
    check(config, ec) {
      if (!this.actor.hasEffect(RageEffect))
        ec.add("Not raging", this);
      return super.check(config, ec);
    }
    async applyEffect() {
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
          if (attacker && isRaging(attacker) && hasAll(attack == null ? void 0 : attack.roll.type.tags, ["melee", "weapon"]) && ability === "str")
            bonus.add(
              getRageBonus(attacker.getClassLevel("Barbarian", 0)),
              RageEffect
            );
        }
      );
      g.events.on(
        "GetDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (isRaging(who) && isA(damageType, MundaneDamageTypes))
            response.add("resist", RageEffect);
        }
      );
      g.events.on("CheckAction", ({ detail: { action, error } }) => {
        if (action.actor.hasEffect(RageEffect) && action.tags.has("spell"))
          error.add("cannot cast spells", RageEffect);
      });
      g.events.on("EffectAdded", ({ detail: { who, interrupt } }) => {
        if (isRaging(who) && who.conditions.has("Unconscious"))
          interrupt.add(
            new EvaluateLater(
              who,
              RageEffect,
              Priority_default.Normal,
              () => who.removeEffect(RageEffect)
            )
          );
      });
      g.events.on("AfterAction", ({ detail: { action, config, interrupt } }) => {
        var _a;
        if (isRaging(action.actor) && action.tags.has("attack") && ((_a = action.getTargets(config)) == null ? void 0 : _a.find((who) => who.side !== action.actor.side)))
          interrupt.add(
            new EvaluateLater(
              action.actor,
              RageEffect,
              Priority_default.Normal,
              () => action.actor.addEffect(DidAttackTag, { duration: Infinity })
            )
          );
      });
      g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
        if (isRaging(who))
          interrupt.add(
            new EvaluateLater(
              who,
              RageEffect,
              Priority_default.Normal,
              () => who.addEffect(TookDamageTag, { duration: Infinity })
            )
          );
      });
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        if (who.hasEffect(RageEffect)) {
          if (!who.hasEffect(DidAttackTag) && !who.hasEffect(TookDamageTag))
            interrupt.add(
              new EvaluateLater(
                who,
                RageEffect,
                Priority_default.Normal,
                () => who.removeEffect(RageEffect)
              )
            );
          else
            interrupt.add(
              new EvaluateLater(who, RageEffect, Priority_default.Normal, async () => {
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
  var RageAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Rage",
        "implemented",
        {},
        {
          icon: RageIcon,
          subIcon: BarbarianIcon,
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
    }
    async applyEffect() {
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
      me.initResource(
        RageResource,
        getRageCount(me.getClassLevel("Barbarian", 0))
      );
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me && !me.hasEffect(RageEffect))
          actions.push(new RageAction(g, who));
      });
    }
  );
  var Rage_default = Rage;

  // src/classes/barbarian/RelentlessRage.ts
  var RelentlessRageResource = new ShortRestResource(
    "Relentless Rage DC",
    Infinity
  );
  var RelentlessRage = new SimpleFeature(
    "Relentless Rage",
    `Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.

Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.`,
    (g, me) => {
      me.initResource(RelentlessRageResource, 10, Infinity);
      g.events.on("CombatantDamaged", ({ detail: { who, interrupt } }) => {
        if (who === me && me.hasEffect(RageEffect) && !me.hasEffect(Dead) && me.hp <= 0)
          interrupt.add(
            new YesNoChoice(
              me,
              RelentlessRage,
              "Relentless Rage",
              `${me.name} is about to fall unconscious. Try to stay conscious with Relentless Rage?`,
              Priority_default.ChangesOutcome,
              async () => {
                var _a;
                const dc = (_a = me.getResource(RelentlessRageResource)) != null ? _a : 10;
                who.giveResource(RelentlessRageResource, 5);
                const { outcome } = await g.save({
                  source: RelentlessRage,
                  type: { type: "flat", dc },
                  who,
                  ability: "con"
                });
                if (outcome === "success") {
                  g.text(
                    new MessageBuilder().co(who).text(" refuses to fall unconscious!")
                  );
                  who.hp = 1;
                }
              }
            )
          );
      });
    }
  );
  var RelentlessRage_default = RelentlessRage;

  // src/classes/barbarian/index.ts
  var BarbarianUnarmoredDefense = new SimpleFeature(
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
          methods.push({
            name: "Unarmored Defense",
            ac,
            uses
          });
        }
      });
    }
  );
  var dangerSenseConditions = coSet("Blinded", "Deafened", "Incapacitated");
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
        me.addProficiency(skill, "proficient");
    }
  );
  var ExtraAttack = makeExtraAttack(
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
              Priority_default.Late,
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
      const count = getBrutalDice(me.getClassLevel("Barbarian", 9));
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
          if (attacker === me && (attack == null ? void 0 : attack.roll.type.tags.has("melee")) && critical) {
            const base = weapon == null ? void 0 : weapon.damage;
            if ((base == null ? void 0 : base.type) === "dice") {
              interrupt.add(
                new EvaluateLater(
                  me,
                  BrutalCritical,
                  Priority_default.Normal,
                  async () => {
                    const damage = await g.rollDamage(
                      count,
                      {
                        source: BrutalCritical,
                        attacker: me,
                        damageType: base.damageType,
                        size: base.amount.size,
                        target,
                        weapon,
                        tags: attack.roll.type.tags
                      },
                      false
                    );
                    bonus.add(damage, BrutalCritical);
                  }
                )
              );
            }
          }
        }
      );
    }
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
      me.str.maximum = 24;
      me.con.maximum = 24;
      me.str.score += 4;
      me.con.score += 4;
    }
  );
  var ASI46 = makeASI("Barbarian", 4);
  var ASI86 = makeASI("Barbarian", 8);
  var ASI126 = makeASI("Barbarian", 12);
  var ASI166 = makeASI("Barbarian", 16);
  var ASI196 = makeASI("Barbarian", 19);
  var Barbarian = {
    name: "Barbarian",
    hitDieSize: 12,
    armor: acSet("light", "medium", "shield"),
    weaponCategory: wcSet("simple", "martial"),
    save: abSet("str", "con"),
    skill: gains([], 2, [
      "Animal Handling",
      "Athletics",
      "Intimidation",
      "Nature",
      "Perception",
      "Survival"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([["str", 13]]),
      armor: acSet("shield"),
      weaponCategory: wcSet("simple", "martial")
    },
    features: /* @__PURE__ */ new Map([
      [1, [Rage_default, BarbarianUnarmoredDefense]],
      [2, [DangerSense, RecklessAttack]],
      [3, [PrimalKnowledge]],
      [4, [ASI46]],
      [5, [ExtraAttack, FastMovement]],
      [7, [FeralInstinct, InstinctivePounce]],
      [8, [ASI86]],
      [9, [BrutalCritical]],
      [11, [RelentlessRage_default]],
      [12, [ASI126]],
      [15, [PersistentRage]],
      [16, [ASI166]],
      [18, [IndomitableMight]],
      [19, [ASI196]],
      [20, [PrimalChampion]]
    ])
  };
  var barbarian_default2 = Barbarian;

  // src/classes/bard/BardicInspiration.ts
  var BardicInspirationResource = new LongRestResource(
    "Bardic Inspiration",
    1
  );
  var BardicInspiration = notImplementedFeature(
    "Bardic Inspiration",
    `You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.

Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.

You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.

Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.`
  );
  var BardicInspiration_default = BardicInspiration;

  // src/classes/bard/index.ts
  var BardSpellcasting = new NormalSpellcasting(
    "Bard",
    `You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations.`,
    "cha",
    "full",
    "Bard",
    "Bard"
  );
  var JackOfAllTrades = new SimpleFeature(
    "Jack of All Trades",
    `Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.`,
    (g, me) => {
      const gain = Math.floor(me.pb / 2);
      g.events.on("BeforeCheck", ({ detail: { who, bonus } }) => {
        if (who === me && !bonus.isInvolved(ProficiencyRule))
          bonus.add(gain, JackOfAllTrades);
      });
    }
  );
  var SongOfRest = nonCombatFeature(
    "Song of Rest",
    `Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.

The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.`
  );
  var MagicalInspiration = notImplementedFeature(
    "Magical Inspiration",
    `If a creature has a Bardic Inspiration die from you and casts a spell that restores hit points or deals damage, the creature can roll that die and choose a target affected by the spell. Add the number rolled as a bonus to the hit points regained or the damage dealt. The Bardic Inspiration die is then lost.`
  );
  var Expertise2 = new ConfiguredFeature(
    "Expertise",
    `At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.

  At 10th level, you can choose another two skill proficiencies to gain this benefit.`,
    (g, me, config) => {
      for (const entry of config)
        me.addProficiency(entry, "expertise");
    }
  );
  var BardicVersatility = nonCombatFeature(
    "Bardic Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing a change in focus as you use your skills and magic:

Replace one of the skills you chose for the Expertise feature with one of your other skill proficiencies that isn't benefiting from Expertise.
Replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the bard spell list.`
  );
  var FontOfInspiration = nonCombatFeature(
    "Font of Inspiration",
    `Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.`
  );
  var Countercharm = notImplementedFeature(
    "Countercharm",
    `At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).`
  );
  var MagicalSecrets = new ConfiguredFeature(
    "Magical Secrets",
    `By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.

The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.

You learn two additional spells from any classes at 14th level and again at 18th level.`,
    (g, me, spells) => {
      for (const name of spells) {
        const spell = allSpells_default[name];
        me.knownSpells.add(spell);
        BardSpellcasting.addCastableSpell(spell, me);
      }
    }
  );
  var SuperiorInspiration = new SimpleFeature(
    "Superior Inspiration",
    `At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.`,
    (g, me) => {
      g.events.on("GetInitiative", ({ detail: { who } }) => {
        if (who === me && me.getResource(BardicInspirationResource) < 1) {
          g.text(
            new MessageBuilder().co(me).text("recovers a use of Bardic Inspiration.")
          );
          me.giveResource(BardicInspirationResource, 1);
        }
      });
    }
  );
  var ASI47 = makeASI("Bard", 4);
  var ASI87 = makeASI("Bard", 8);
  var ASI127 = makeASI("Bard", 12);
  var ASI167 = makeASI("Bard", 16);
  var ASI197 = makeASI("Bard", 19);
  var Bard = {
    name: "Bard",
    hitDieSize: 8,
    armor: acSet("light"),
    weaponCategory: wcSet("simple"),
    weapon: wtSet("hand crossbow", "longsword", "rapier", "shortsword"),
    tool: gains([], 3, Instruments),
    save: abSet("dex", "cha"),
    skill: gains([], 3, SkillNames),
    multi: {
      requirements: /* @__PURE__ */ new Map([["cha", 13]]),
      armor: acSet("light"),
      tool: gains([], 1, Instruments),
      skill: gains([], 1, SkillNames)
    },
    features: /* @__PURE__ */ new Map([
      [1, [BardicInspiration_default, BardSpellcasting.feature]],
      [2, [JackOfAllTrades, SongOfRest, MagicalInspiration]],
      [3, [Expertise2]],
      [4, [ASI47, BardicVersatility]],
      [5, [FontOfInspiration]],
      [6, [Countercharm]],
      [8, [ASI87]],
      [10, [MagicalSecrets]],
      [12, [ASI127]],
      [16, [ASI167]],
      [19, [ASI197]],
      [20, [SuperiorInspiration]]
    ])
  };
  var bard_default = Bard;

  // src/classes/fighter/ActionSurge.ts
  var ActionSurgeResource = new ShortRestResource("Action Surge", 1);
  function getActionSurgeCount(level) {
    return level < 17 ? 1 : 2;
  }
  var UsedActionSurgeThisTurn = new Effect(
    "Action Surged",
    "turnEnd",
    void 0,
    { quiet: true }
  );
  var ActionSurgeAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Action Surge",
        "incomplete",
        {},
        {
          description: `On your turn, you can take one additional action.`,
          resources: /* @__PURE__ */ new Map([[ActionSurgeResource, 1]])
        }
      );
    }
    check(config, ec) {
      if (this.actor.hasEffect(UsedActionSurgeThisTurn))
        ec.add("already used this turn", this);
      if (this.actor.hasTime("action"))
        ec.add("still has action", this);
      return super.check({}, ec);
    }
    async applyEffect() {
      this.actor.regainTime("action");
      await this.actor.addEffect(UsedActionSurgeThisTurn, {
        duration: 1
      });
    }
  };
  var ActionSurge = new SimpleFeature(
    "Action Surge",
    `Starting at 2nd level, you can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action.

Once you use this feature, you must finish a short or long rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.`,
    (g, me) => {
      const charges = getActionSurgeCount(me.getClassLevel("Fighter", 2));
      me.initResource(ActionSurgeResource, charges);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new ActionSurgeAction(g, me));
      });
    }
  );
  var ActionSurge_default = ActionSurge;

  // src/classes/fighter/Indomitable.ts
  var IndomitableResource = new LongRestResource("Indomitable", 1);
  var Indomitable = notImplementedFeature(
    "Indomitable",
    `Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a long rest.

You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.`
  );
  var Indomitable_default = Indomitable;

  // src/classes/fighter/SecondWind.ts
  var SecondWindResource = new ShortRestResource("Second Wind", 1);
  var SecondWindAction = class extends AbstractSelfAction {
    constructor(g, actor, bonus) {
      super(
        g,
        actor,
        "Second Wind",
        "implemented",
        {},
        {
          time: "bonus action",
          resources: /* @__PURE__ */ new Map([[SecondWindResource, 1]]),
          heal: [
            { type: "dice", amount: { count: 1, size: 10 } },
            { type: "flat", amount: bonus }
          ],
          description: `You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.`
        }
      );
      this.bonus = bonus;
    }
    async applyEffect() {
      const { g, actor, bonus } = this;
      const roll = await g.rollHeal(1, { actor, size: 10, source: this });
      await g.heal(this, roll + bonus, { actor, target: actor });
    }
  };
  var SecondWind = new SimpleFeature(
    "Second Wind",
    `You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level.

Once you use this feature, you must finish a short or long rest before you can use it again.`,
    (g, me) => {
      const bonus = me.getClassLevel("Fighter", 1);
      me.initResource(SecondWindResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new SecondWindAction(g, me, bonus));
      });
    }
  );
  var SecondWind_default = SecondWind;

  // src/classes/fighter/index.ts
  var FighterFightingStyle = wrapperFeature(
    "Fighting Style (Fighter)",
    `You adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take the same Fighting Style option more than once, even if you get to choose again.`
  );
  var ExtraAttack2 = makeExtraAttack(
    "Extra Attack",
    `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
  );
  var ExtraAttack22 = makeExtraAttack(
    "Extra Attack (2)",
    `At 11th level, you can attack three times whenever you take the Attack action on your turn.`,
    2
  );
  var ExtraAttack3 = makeExtraAttack(
    "Extra Attack (3)",
    `At 20th level, you can attack four times whenever you take the Attack action on your turn.`,
    3
  );
  var MartialVersatility = nonCombatFeature(
    "Martial Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, as you shift the focus of your martial practice:
- Replace a fighting style you know with another fighting style available to fighters.
- If you know any maneuvers from the Battle Master archetype, you can replace one maneuver you know with a different maneuver.`
  );
  var ASI48 = makeASI("Fighter", 4);
  var ASI6 = makeASI("Fighter", 6);
  var ASI88 = makeASI("Fighter", 8);
  var ASI128 = makeASI("Fighter", 12);
  var ASI14 = makeASI("Fighter", 14);
  var ASI168 = makeASI("Fighter", 16);
  var ASI198 = makeASI("Fighter", 19);
  var Fighter = {
    name: "Fighter",
    hitDieSize: 10,
    armor: acSet("light", "medium", "heavy", "shield"),
    weaponCategory: wcSet("simple", "martial"),
    save: abSet("str", "con"),
    skill: gains([], 2, [
      "Acrobatics",
      "Animal Handling",
      "Athletics",
      "History",
      "Insight",
      "Intimidation",
      "Perception",
      "Survival"
    ]),
    multi: {
      // TODO Strength 13 or Dexterity 13
      requirements: /* @__PURE__ */ new Map([["str", 13]]),
      armor: acSet("light", "medium", "shield"),
      weaponCategory: wcSet("simple", "martial")
    },
    features: /* @__PURE__ */ new Map([
      [1, [FighterFightingStyle, SecondWind_default]],
      [2, [ActionSurge_default]],
      [4, [ASI48, MartialVersatility]],
      [5, [ExtraAttack2]],
      [6, [ASI6]],
      [8, [ASI88]],
      [9, [Indomitable_default]],
      [11, [ExtraAttack22]],
      [12, [ASI128]],
      [14, [ASI14]],
      [16, [ASI168]],
      [19, [ASI198]],
      [20, [ExtraAttack3]]
    ])
  };
  var fighter_default = Fighter;

  // src/classes/monk/MartialArts.ts
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
  function canUseMartialArts(who) {
    if (who.armor || who.shield)
      return false;
    for (const item of who.equipment) {
      if (item.itemType === "weapon" && !isMonkWeapon(item))
        return false;
    }
    return true;
  }
  var MonkWeaponWrapper = class extends WeaponBase {
    constructor(g, weapon, size) {
      super(
        g,
        weapon.name,
        weapon.category,
        weapon.rangeCategory,
        _dd(1, size, weapon.damage.damageType),
        weapon.properties,
        void 0,
        weapon.shortRange,
        weapon.longRange
      );
      this.weapon = weapon;
    }
    get icon() {
      return this.weapon.icon;
    }
  };
  var HasBonusAttackThisTurn = new Effect(
    "Martial Arts",
    "turnEnd",
    void 0,
    { quiet: true }
  );
  var MartialArtsBonusAttack = class extends WeaponAttack {
    constructor(g, actor, weapon) {
      super(g, "Martial Arts", actor, "melee", weapon);
      this.tags.delete("costs attack");
    }
    getTime() {
      return "bonus action";
    }
  };
  function getMonkUnarmedWeapon(g, who) {
    const weapon = who.weapons.find((w) => w.weaponType === "unarmed strike");
    if (weapon) {
      const diceSize = getMartialArtsDie(who.getClassLevel("Monk", 0));
      return canUpgradeDamage(weapon.damage, diceSize) ? new MonkWeaponWrapper(g, weapon, diceSize) : weapon;
    }
  }
  var MartialArts = new SimpleFeature(
    "Martial Arts",
    `Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don't have the two-handed or heavy property.

You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield.

- You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
- You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.
- When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn.

Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama).`,
    (g, me) => {
      const diceSize = getMartialArtsDie(me.getClassLevel("Monk", 0));
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who !== me || !canUseMartialArts(me))
          return;
        for (const wa of actions.filter(isMonkWeaponAttack)) {
          if (me.dex.score > me.str.score)
            wa.ability = "dex";
          if (canUpgradeDamage(wa.weapon.damage, diceSize))
            wa.weapon = new MonkWeaponWrapper(g, wa.weapon, diceSize);
        }
      });
      g.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
        if (action.actor === me && isMonkWeaponAttack(action) && canUseMartialArts(me))
          interrupt.add(
            new EvaluateLater(
              action.actor,
              MartialArts,
              Priority_default.Normal,
              () => action.actor.addEffect(HasBonusAttackThisTurn, { duration: 1 })
            )
          );
      });
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who.hasEffect(HasBonusAttackThisTurn) && canUseMartialArts(who)) {
          const weapon = getMonkUnarmedWeapon(g, who);
          if (weapon)
            actions.push(new MartialArtsBonusAttack(g, who, weapon));
        }
      });
    }
  );
  var MartialArts_default = MartialArts;

  // src/classes/monk/Ki.ts
  var KiResource = new ShortRestResource("Ki", 2);
  var FlurryOfBlows = class extends AbstractSingleTargetAction {
    constructor(g, actor, weapon, available, ability = getWeaponAbility(actor, weapon)) {
      super(
        g,
        actor,
        "Flurry of Blows",
        "implemented",
        {
          target: new TargetResolver(
            g,
            getWeaponRange(actor, weapon, "melee"),
            []
          )
        },
        {
          resources: [[KiResource, 1]],
          time: "bonus action",
          description: `Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.`,
          tags: ["attack", "harmful"]
        }
      );
      this.weapon = weapon;
      this.available = available;
      this.ability = ability;
    }
    check({ target }, ec) {
      if (!this.available)
        ec.add("must use immediately after Attack action", this);
      return super.check({ target }, ec);
    }
    async applyEffect({ target }) {
      const { g, actor: attacker, weapon, ability } = this;
      await doStandardAttack(g, {
        ability,
        attacker,
        source: this,
        rangeCategory: "melee",
        target,
        weapon
      });
      await doStandardAttack(g, {
        ability,
        attacker,
        source: this,
        rangeCategory: "melee",
        target,
        weapon
      });
    }
  };
  var PatientDefense = class extends DodgeAction {
    constructor(g, actor) {
      super(g, actor);
      this.name += " (Patient Defense)";
      this.time = "bonus action";
      this.resources.set(KiResource, 1);
    }
  };
  var StepDisengage = class extends DisengageAction {
    constructor(g, actor) {
      super(g, actor);
      this.name += " (Step of the Wind)";
      this.time = "bonus action";
      this.resources.set(KiResource, 1);
    }
  };
  var StepDash = class extends DashAction {
    constructor(g, actor) {
      super(g, actor);
      this.status = "incomplete";
      this.name += " (Step of the Wind)";
      this.time = "bonus action";
      this.resources.set(KiResource, 1);
    }
  };
  var Ki = new SimpleFeature(
    "Ki",
    `Starting at 2nd level, your training allows you to harness the mystic energy of ki. Your access to this energy is represented by a number of ki points. Your monk level determines the number of points you have, as shown in the Ki Points column of the Monk table.

You can spend these points to fuel various ki features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind. You learn more ki features as you gain levels in this class.

When you spend a ki point, it is unavailable until you finish a short or long rest, at the end of which you draw all of your expended ki back into yourself. You must spend at least 30 minutes of the rest meditating to regain your ki points.

Some of your ki features require your target to make a saving throw to resist the feature's effects. The saving throw DC is calculated as follows:

Ki save DC = 8 + your proficiency bonus + your Wisdom modifier`,
    (g, me) => {
      const charges = me.getClassLevel("Monk", 2);
      me.initResource(KiResource, charges);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          const weapon = getMonkUnarmedWeapon(g, me);
          if (weapon)
            actions.push(new FlurryOfBlows(g, me, weapon, false));
          actions.push(
            new PatientDefense(g, me),
            new StepDisengage(g, me),
            new StepDash(g, me)
          );
        }
      });
      g.events.on("AfterAction", ({ detail: { action, config, interrupt } }) => {
        if (action.actor === me && action.tags.has("costs attack")) {
          const target = config.target;
          const weapon = getMonkUnarmedWeapon(g, me);
          if (target && weapon) {
            const action2 = new FlurryOfBlows(g, me, weapon, true);
            const config2 = { target };
            if (checkConfig(g, action2, config2))
              interrupt.add(
                new YesNoChoice(
                  me,
                  Ki,
                  "Flurry of Blows",
                  `Spend 1 ki to activate Flurry of Blows?`,
                  Priority_default.Normal,
                  () => g.act(action2, config2)
                )
              );
          }
        }
      });
    }
  );
  var Ki_default = Ki;

  // src/classes/monk/QuickenedHealing.ts
  var QuickenedHealingAction = class extends AbstractSelfAction {
    constructor(g, actor, size) {
      super(
        g,
        actor,
        "Quickened Healing",
        "implemented",
        {},
        {
          description: `As an action, you can spend 2 ki points and roll a Martial Arts die. You regain a number of hit points equal to the number rolled plus your proficiency bonus.`,
          heal: [
            { type: "dice", amount: { count: 1, size } },
            { type: "flat", amount: actor.pb }
          ],
          resources: [[KiResource, 2]],
          time: "action"
        }
      );
      this.size = size;
    }
    async applyEffect() {
      const { g, actor, size } = this;
      const amount = await g.rollHeal(1, {
        source: this,
        actor,
        size,
        target: actor
      });
      await g.heal(this, amount + actor.pb, {
        action: this,
        actor,
        target: actor
      });
    }
  };
  var QuickenedHealing = new SimpleFeature(
    "Quickened Healing",
    `As an action, you can spend 2 ki points and roll a Martial Arts die. You regain a number of hit points equal to the number rolled plus your proficiency bonus.`,
    (g, me) => {
      const size = getMartialArtsDie(me.getClassLevel("Monk", 4));
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new QuickenedHealingAction(g, me, size));
      });
    }
  );
  var QuickenedHealing_default = QuickenedHealing;

  // src/classes/monk/UnarmoredMovement.ts
  function getUnarmoredMovementBonus(level) {
    if (level < 6)
      return 10;
    if (level < 10)
      return 15;
    if (level < 14)
      return 20;
    if (level < 18)
      return 25;
    return 30;
  }
  var UnarmoredMovement = new SimpleFeature(
    "Unarmored Movement",
    `Starting at 2nd level, your speed increases by 10 feet while you are not wearing armor or wielding a shield. This bonus increases when you reach certain monk levels, as shown in the Monk table.

At 9th level, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move.`,
    (g, me) => {
      const level = me.getClassLevel("Monk", 2);
      if (level >= 9)
        featureNotComplete(UnarmoredMovement, me);
      const speed = getUnarmoredMovementBonus(level);
      g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
        if (who === me && !me.armor && !me.shield)
          bonus.add(speed, UnarmoredMovement);
      });
    }
  );
  var UnarmoredMovement_default = UnarmoredMovement;

  // src/classes/monk/index.ts
  var MonkUnarmoredDefense = new SimpleFeature(
    "Unarmored Defense",
    `Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.`,
    (g, me) => {
      g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
        if (who === me && !me.armor && !me.shield)
          methods.push({
            name: "Unarmored Defense",
            ac: 10 + me.dex.modifier + me.wis.modifier,
            uses: /* @__PURE__ */ new Set()
          });
      });
    }
  );
  var DedicatedWeapon = notImplementedFeature(
    "Dedicated Weapon",
    `You train yourself to use a variety of weapons as monk weapons, not just simple melee weapons and shortswords. Whenever you finish a short or long rest, you can touch one weapon, focus your ki on it, and then count that weapon as a monk weapon until you use this feature again.

The chosen weapon must meet these criteria:
- The weapon must be a simple or martial weapon.
- You must be proficient with it.
- It must lack the heavy and special properties.`
  );
  var DeflectMissiles = notImplementedFeature(
    "Deflect Missiles",
    `Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.

If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack (range 20/60 feet) with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack.`
  );
  var KiFueledAttack = notImplementedFeature(
    "Ki-Fueled Attack",
    `If you spend 1 ki point or more as part of your action on your turn, you can make one attack with an unarmed strike or a monk weapon as a bonus action before the end of the turn.`
  );
  var SlowFall = notImplementedFeature(
    "Slow Fall",
    `Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.`
  );
  var ExtraAttack4 = makeExtraAttack(
    "Extra Attack",
    `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
  );
  var FocusedAim = notImplementedFeature(
    "Focused Aim",
    `When you miss with an attack roll, you can spend 1 to 3 ki points to increase your attack roll by 2 for each of these ki points you spend, potentially turning the miss into a hit.`
  );
  var StunningStrike = notImplementedFeature(
    "Stunning Strike",
    `Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.`
  );
  var KiEmpoweredStrikes = new SimpleFeature(
    "Ki-Empowered Strikes",
    `Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.`,
    (g, me) => {
      g.events.on("BeforeAttack", ({ detail: { who, weapon, tags } }) => {
        if (who === me && (weapon == null ? void 0 : weapon.weaponType) === "unarmed strike")
          tags.add("magical");
      });
    }
  );
  var StillnessOfMind = notImplementedFeature(
    "Stillness of Mind",
    `Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.`
  );
  var PurityOfBody = notImplementedFeature(
    "Purity of Body",
    `At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.`
  );
  var TongueOfTheSunAndMoon = notImplementedFeature(
    "Tongue of the Sun and Moon",
    `Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.`
  );
  var DiamondSoul = notImplementedFeature(
    "Diamond Soul",
    `Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.

Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.`
  );
  var TimelessBody2 = nonCombatFeature(
    "Timeless Body",
    `At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. In addition, you no longer need food or water.`
  );
  var EmptyBody = notImplementedFeature(
    "Empty Body",
    `Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.

Additionally, you can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can't take any other creatures with you.`
  );
  var PerfectSelf = new SimpleFeature(
    "Perfect Self",
    `At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.`,
    (g, me) => {
      g.events.on("GetInitiative", ({ detail: { who } }) => {
        if (who === me && me.getResource(KiResource) < 1) {
          g.text(new MessageBuilder().co(me).text("recovers 4 ki points."));
          me.giveResource(KiResource, 4);
        }
      });
    }
  );
  var ASI49 = makeASI("Monk", 4);
  var ASI89 = makeASI("Monk", 8);
  var ASI129 = makeASI("Monk", 12);
  var ASI169 = makeASI("Monk", 16);
  var ASI199 = makeASI("Monk", 19);
  var Monk = {
    name: "Monk",
    hitDieSize: 8,
    weaponCategory: wcSet("simple"),
    weapon: wtSet("shortsword"),
    save: abSet("str", "dex"),
    skill: gains([], 2, [
      "Acrobatics",
      "Athletics",
      "History",
      "Insight",
      "Religion",
      "Stealth"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([
        ["dex", 13],
        ["wis", 13]
      ]),
      weaponCategory: wcSet("simple"),
      weapon: wtSet("shortsword")
    },
    features: /* @__PURE__ */ new Map([
      [1, [MonkUnarmoredDefense, MartialArts_default]],
      [2, [Ki_default, DedicatedWeapon, UnarmoredMovement_default]],
      [3, [DeflectMissiles, KiFueledAttack]],
      [4, [ASI49, SlowFall, QuickenedHealing_default]],
      [5, [ExtraAttack4, StunningStrike, FocusedAim]],
      [6, [KiEmpoweredStrikes]],
      [7, [Evasion_default, StillnessOfMind]],
      [8, [ASI89]],
      [10, [PurityOfBody]],
      [12, [ASI129]],
      [13, [TongueOfTheSunAndMoon]],
      [14, [DiamondSoul]],
      [15, [TimelessBody2]],
      [16, [ASI169]],
      [18, [EmptyBody]],
      [19, [ASI199]],
      [20, [PerfectSelf]]
    ])
  };
  var monk_default = Monk;

  // src/classes/paladin/AuraOfProtection.ts
  var aurasOfProtection = /* @__PURE__ */ new Map();
  new DndRule("Paladin Auras", () => aurasOfProtection.clear());
  function getAuraOfProtection(who) {
    return aurasOfProtection.get(who);
  }
  function getPaladinAuraRadius(level) {
    if (level < 18)
      return 10;
    return 30;
  }
  var AuraOfProtection = new SimpleFeature(
    "Aura of Protection",
    `Starting at 6th level, whenever you or a friendly creature within 10 feet of you must make a saving throw, the creature gains a bonus to the saving throw equal to your Charisma modifier (with a minimum bonus of +1). You must be conscious to grant this bonus.

At 18th level, the range of this aura increases to 30 feet.`,
    (g, me) => {
      const radius = getPaladinAuraRadius(me.getClassLevel("Paladin", 6));
      const aura = new AuraController(
        g,
        `Paladin Aura (${me.name})`,
        me,
        radius,
        ["holy"],
        "yellow"
      ).setActiveChecker((who) => !who.conditions.has("Unconscious"));
      aurasOfProtection.set(me, aura);
      g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
        if (who.side === me.side && aura.isAffecting(who))
          bonus.add(Math.max(1, me.cha.modifier), AuraOfProtection);
      });
    }
  );
  var AuraOfProtection_default = AuraOfProtection;

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

  // src/classes/paladin/HarnessDivinePower.ts
  var HarnessDivinePowerResource2 = new LongRestResource(
    "Harness Divine Power",
    1
  );
  var HarnessDivinePowerAction2 = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Harness Divine Power",
        "implemented",
        {
          slot: new ChoiceResolver(
            g,
            "Slot",
            enumerate(1, 9).filter(
              (slot) => actor.resources.has(getSpellSlotResourceName(slot))
            ).map((value) => {
              const resource = SpellSlotResources[value];
              return makeChoice(
                value,
                ordinal(value),
                actor.getResourceMax(resource) <= actor.getResource(resource)
              );
            })
          )
        },
        {
          subIcon: PaladinIcon,
          time: "bonus action",
          resources: [
            [ChannelDivinityResource, 1],
            [HarnessDivinePowerResource2, 1]
          ],
          description: `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`
        }
      );
    }
    check({ slot }, ec) {
      if (slot) {
        const resource = SpellSlotResources[slot];
        if (this.actor.getResource(resource) >= this.actor.getResourceMax(resource))
          ec.add(`full on ${resource.name}`, this);
      }
      return super.check({ slot }, ec);
    }
    async applyEffect({ slot }) {
      this.actor.giveResource(SpellSlotResources[slot], 1);
    }
  };
  function getHarnessCount2(level) {
    if (level < 7)
      return 1;
    if (level < 15)
      return 2;
    return 3;
  }
  var HarnessDivinePower2 = new SimpleFeature(
    "Channel Divinity: Harness Divine Power",
    `You can expend a use of your Channel Divinity to fuel your spells. As a bonus action, you touch your holy symbol, utter a prayer, and regain one expended spell slot, the level of which can be no higher than half your proficiency bonus (rounded up). The number of times you can use this feature is based on the level you've reached in this class: 3rd level, once; 7th level, twice; and 15th level, thrice. You regain all expended uses when you finish a long rest.`,
    (g, me) => {
      me.initResource(
        HarnessDivinePowerResource2,
        getHarnessCount2(me.getClassLevel("Paladin", 3))
      );
      g.events.on("GetActions", ({ detail: { actions, who } }) => {
        if (who === me)
          actions.push(new HarnessDivinePowerAction2(g, me));
      });
    }
  );
  var HarnessDivinePower_default2 = HarnessDivinePower2;

  // src/img/act/lay-on-hands.svg
  var lay_on_hands_default = "./lay-on-hands-F5ZGB5B6.svg";

  // src/resolvers/NumberRangeResolver.ts
  var NumberRangeResolver = class {
    constructor(g, rangeName, min, max) {
      this.g = g;
      this.rangeName = rangeName;
      this.min = min;
      this.max = max;
      this.type = "NumberRange";
    }
    get initialValue() {
      return this.min;
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
        {
          icon: LayOnHandsHealIcon,
          subIcon: PaladinIcon,
          time: "action",
          description: `As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.`
        }
      );
    }
    getAffected({ target }) {
      return [target];
    }
    getTargets({ target }) {
      return sieve(target);
    }
    generateHealingConfigs(targets) {
      const resourceMax = this.actor.getResource(LayOnHandsResource);
      return targets.flatMap(
        (target) => enumerate(1, resourceMax).map((cost) => ({
          config: { cost, target },
          positioning: poSet(poWithin(this.actor.reach, target))
        }))
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
    async applyEffect({ cost, target }) {
      await this.g.heal(this, cost, {
        action: this,
        target,
        actor: this.actor
      });
    }
  };
  function isCurable(e2) {
    return hasAny(e2.tags, ["disease", "poison"]);
  }
  var getCurableEffects = (who) => Array.from(who.effects.keys()).map(
    (effect) => makeChoice(effect, effect.name, !isCurable(effect))
  );
  var LayOnHandsCureAction = class extends AbstractAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Lay on Hands (Cure)",
        "implemented",
        {
          target: new TargetResolver(g, actor.reach, [isHealable]),
          effects: new MultiChoiceResolver(g, "Effects", [], 1, Infinity)
        },
        {
          icon: LayOnHandsCureIcon,
          subIcon: PaladinIcon,
          time: "action",
          description: `As an action, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.`
        }
      );
    }
    getAffected({ target }) {
      return [target];
    }
    getTargets({ target }) {
      return sieve(target);
    }
    getConfig({ target }) {
      const valid = target ? getCurableEffects(target) : [];
      return {
        target: new TargetResolver(this.g, this.actor.reach, [isHealable]),
        effects: new MultiChoiceResolver(this.g, "Effects", valid, 1, Infinity)
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
    async applyEffect({ target, effects }) {
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
      const max = me.getClassLevel("Paladin", 1) * 5;
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
  var extraSmiteDiceTypes = ctSet("undead", "fiend");
  var DivineSmite = new SimpleFeature(
    "Divine Smite",
    `Starting at 2nd level, when you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage to the target, in addition to the weapon's damage. The extra damage is 2d8 for a 1st-level spell slot, plus 1d8 for each spell level higher than 1st, to a maximum of 5d8. The damage increases by 1d8 if the target is an undead or a fiend, to a maximum of 6d8.`,
    (g, me) => {
      g.events.on(
        "GatherDamage",
        ({ detail: { attacker, attack, critical, interrupt, map, target } }) => {
          if (attacker === me && hasAll(attack == null ? void 0 : attack.roll.type.tags, ["melee", "weapon"]))
            interrupt.add(
              new PickFromListChoice(
                attacker,
                DivineSmite,
                "Divine Smite",
                "Choose a spell slot to use.",
                Priority_default.Normal,
                enumerate(1, getMaxSpellSlotAvailable(me)).map((value) => ({
                  label: ordinal(value),
                  value,
                  disabled: me.getResource(SpellSlotResources[value]) < 1
                })),
                async (slot) => {
                  me.spendResource(SpellSlotResources[slot], 1);
                  const count = Math.min(5, slot + 1);
                  const extra = extraSmiteDiceTypes.has(target.type) ? 1 : 0;
                  const damage = await g.rollDamage(
                    count + extra,
                    {
                      source: DivineSmite,
                      attacker,
                      size: 8,
                      tags: atSet("magical")
                    },
                    critical
                  );
                  map.add("radiant", damage);
                },
                true
              )
            );
        }
      );
    }
  );
  var PaladinFightingStyle = wrapperFeature(
    "Fighting Style (Paladin)",
    `At 2nd level, you adopt a particular style of fighting as your specialty. You can't take the same Fighting Style option more than once, even if you get to choose again.`
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
  var ChannelDivinity2 = new SimpleFeature(
    "Channel Divinity",
    `Your oath allows you to channel divine energy to fuel magical effects. Each Channel Divinity option provided by your oath explains how to use it.
When you use your Channel Divinity, you choose which option to use. You must then finish a short or long rest to use your Channel Divinity again.
Some Channel Divinity effects require saving throws. When you use such an effect from this class, the DC equals your paladin spell save DC.`,
    (g, me) => {
      me.initResource(ChannelDivinityResource, 1);
    }
  );
  var MartialVersatility2 = nonCombatFeature(
    "Martial Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to paladins. This replacement represents a shift of focus in your martial practice.`
  );
  var ExtraAttack5 = makeExtraAttack(
    "Extra Attack",
    `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
  );
  var AuraOfCourage = new SimpleFeature(
    "Aura of Courage",
    `Starting at 10th level, you and friendly creatures within 10 feet of you can't be frightened while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`,
    (g, me) => {
      const aura = getAuraOfProtection(me);
      if (!aura)
        return;
      g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
        var _a;
        if (((_a = config.conditions) == null ? void 0 : _a.has("Frightened")) && who.side === me.side && aura.isAffecting(who))
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
          if (attacker === me && hasAll(attack == null ? void 0 : attack.roll.type.tags, ["melee", "weapon"]))
            interrupt.add(
              new EvaluateLater(
                attacker,
                ImprovedDivineSmite,
                Priority_default.Normal,
                async () => {
                  const amount = await g.rollDamage(
                    1,
                    {
                      source: ImprovedDivineSmite,
                      attacker,
                      target,
                      size: 8,
                      damageType: "radiant",
                      tags: atSet("magical")
                    },
                    critical
                  );
                  map.add("radiant", amount);
                }
              )
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
  var ASI410 = makeASI("Paladin", 4);
  var ASI810 = makeASI("Paladin", 8);
  var ASI1210 = makeASI("Paladin", 12);
  var ASI1610 = makeASI("Paladin", 16);
  var ASI1910 = makeASI("Paladin", 19);
  var Paladin = {
    name: "Paladin",
    hitDieSize: 10,
    armor: acSet("light", "medium", "heavy", "shield"),
    weaponCategory: wcSet("simple", "martial"),
    save: abSet("wis", "cha"),
    skill: gains([], 2, [
      "Athletics",
      "Insight",
      "Intimidation",
      "Medicine",
      "Persuasion",
      "Religion"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([
        ["str", 13],
        ["cha", 13]
      ]),
      armor: acSet("light", "medium", "shield"),
      weaponCategory: wcSet("simple", "martial")
    },
    features: /* @__PURE__ */ new Map([
      [1, [DivineSense, LayOnHands_default]],
      [2, [DivineSmite, PaladinFightingStyle, PaladinSpellcasting.feature]],
      [3, [DivineHealth, ChannelDivinity2, HarnessDivinePower_default2]],
      [4, [ASI410, MartialVersatility2]],
      [5, [ExtraAttack5]],
      [6, [AuraOfProtection_default]],
      [8, [ASI810]],
      [10, [AuraOfCourage]],
      [11, [ImprovedDivineSmite]],
      [12, [ASI1210]],
      [14, [CleansingTouch]],
      [16, [ASI1610]],
      [19, [ASI1910]]
    ])
  };
  var paladin_default2 = Paladin;

  // src/classes/ranger/index.ts
  var Favored = wrapperFeature(
    "Favored Enemy/Foe",
    `Choose either Favored Enemy or Favored Foe.`
  );
  var FavoredEnemy = notImplementedFeature(
    "Favored Enemy",
    `Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.

Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.

You have advantage on Wisdom (Survival) checks to track your favored enemies, as well as on Intelligence checks to recall information about them.

When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.

You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.`
  );
  var FavoredFoe = notImplementedFeature(
    "Favored Foe",
    `When you hit a creature with an attack roll, you can call on your mystical bond with nature to mark the target as your favored enemy for 1 minute or until you lose your concentration (as if you were concentrating on a spell).

The first time on each of your turns that you hit the favored enemy and deal damage to it, including when you mark it, you can increase that damage by 1d4.

You can use this feature to mark a favored enemy a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.

This feature's extra damage increases when you reach certain levels in this class: to 1d6 at 6th level and to 1d8 at 14th level.`
  );
  var Explorer = wrapperFeature(
    "Natural/Deft Explorer",
    `Choose either Natural Explorer or Deft Explorer.`
  );
  var NaturalExplorer = notImplementedFeature(
    "Natural Explorer",
    `You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, swamp, or the Underdark. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you're proficient in.

While traveling for an hour or more in your favored terrain, you gain the following benefits:
- Difficult terrain doesn't slow your group's travel.
- Your group can't become lost except by magical means.
- Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.
- If you are traveling alone, you can move stealthily at a normal pace.
- When you forage, you find twice as much food as you normally would.
- While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.

You choose additional favored terrain types at 6th and 10th level.`
  );
  var DeftExplorer = new SimpleFeature(
    "Deft Explorer",
    `You are an unsurpassed explorer and survivor, both in the wilderness and in dealing with others on your travels. You gain the Canny benefit below, and you gain an additional benefit below when you reach 6th level and 10th level in this class.`,
    (g, me) => {
      me.addFeature(Canny);
      const level = me.getClassLevel("Ranger", 1);
      if (level >= 6)
        me.addFeature(Roving);
      if (level >= 10)
        me.addFeature(Tireless);
    }
  );
  var Canny = notImplementedFeature(
    "Canny",
    `Choose one of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses the chosen skill.

You can also speak, read, and write two additional languages of your choice.`
  );
  var RangerFightingStyle = wrapperFeature(
    "Fighting Style (Ranger)",
    `At 2nd level, you adopt a particular style of fighting as your specialty. Choose one of the following options. You can't take a Fighting Style option more than once, even if you later get to choose again.`
  );
  var RangerSpellcasting = new NormalSpellcasting(
    "Ranger",
    `By the time you reach 2nd level, you have learned to use the magical essence of nature to cast spells, much as a druid does.`,
    "wis",
    "half",
    "Ranger",
    "Ranger"
  );
  var SpellcastingFocus = notImplementedFeature(
    "Spellcasting Focus",
    `You can use a druidic focus as a spellcasting focus for your ranger spells. A druidic focus might be a sprig of mistletoe or holly, a wand or rod made of yew or another special wood, a staff drawn whole from a living tree, or an object incorporating feathers, fur, bones, and teeth from sacred animals.`
  );
  var Awareness = wrapperFeature(
    "Primeval/Primal Awareness",
    `Choose either Primeval Awareness or Primal Awareness.`
  );
  var PrimevalAwareness = nonCombatFeature(
    "Primeval Awareness",
    `Beginning at 3rd level, you can use your action and expend one ranger spell slot to focus your awareness on the region around you. For 1 minute per level of the spell slot you expend, you can sense whether the following types of creatures are present within 1 mile of you (or within up to 6 miles if you are in your favored terrain): aberrations, celestials, dragons, elementals, fey, fiends, and undead. This feature doesn't reveal the creatures' location or number.`
  );
  var PrimalAwareness = notImplementedFeature(
    "Primal Awareness",
    `You can focus your awareness through the interconnections of nature: you learn additional spells when you reach certain levels in this class if you don't already know them, as shown in the Primal Awareness Spells table. These spells don't count against the number of ranger spells you know.

Primal Awareness Spells:
  3rd	speak with animals
  5th	beast sense
  9th	speak with plants
  13th	locate creature
  17th	commune with nature

You can cast each of these spells once without expending a spell slot. Once you cast a spell in this way, you can't do so again until you finish a long rest.`
  );
  var MartialVersatility3 = nonCombatFeature(
    "Martial Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace a fighting style you know with another fighting style available to rangers. This replacement represents a shift of focus in your martial practice.`
  );
  var ExtraAttack6 = makeExtraAttack(
    "Extra Attack",
    `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`
  );
  var Roving = notImplementedFeature(
    "Roving",
    `Your walking speed increases by 5, and you gain a climbing speed and a swimming speed equal to your walking speed.`
  );
  var RangerLandsStride = makeLandsStride(
    `Starting at 8th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.

In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.`
  );
  var HideVeil = wrapperFeature(
    "Hide in Plain Sight/Nature's Veil",
    `Choose either Hide in Plain Sight or Nature's Veil.`
  );
  var HideInPlainSight = nonCombatFeature(
    "Hide in Plain Sight",
    `Starting at 10th level, you can spend 1 minute creating camouflage for yourself. You must have access to fresh mud, dirt, plants, soot, and other naturally occurring materials with which to create your camouflage.

Once you are camouflaged in this way, you can try to hide by pressing yourself up against a solid surface, such as a tree or wall, that is at least as tall and wide as you are. You gain a +10 bonus to Dexterity (Stealth) checks as long as you remain there without moving or taking actions. Once you move or take an action or a reaction, you must camouflage yourself again to gain this benefit.`
  );
  var NaturesVeil = notImplementedFeature(
    "Nature's Veil",
    `You draw on the powers of nature to hide yourself from view briefly. As a bonus action, you can magically become invisible, along with any equipment you are wearing or carrying, until the start of your next turn.

You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`
  );
  var Tireless = notImplementedFeature(
    "Tireless",
    `As an action, you can give yourself a number of temporary hit points equal to 1d8 + your Wisdom modifier (minimum of 1 temporary hit point). You can use this action a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.

In addition, whenever you finish a short rest, your exhaustion level, if any, is decreased by 1.`
  );
  var Vanish = notImplementedFeature(
    "Vanish",
    `Starting at 14th level, you can use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means, unless you choose to leave a trail.`
  );
  var FeralSenses = notImplementedFeature(
    "Feral Senses",
    `At 18th level, you gain preternatural senses that help you fight creatures you can't see. When you attack a creature you can't see, your inability to see it doesn't impose disadvantage on your attack rolls against it. You are also aware of the location of any invisible creature within 30 feet of you, provided that the creature isn't hidden from you and you aren't blinded or deafened.`
  );
  var FoeSlayer = notImplementedFeature(
    "Foe Slayer",
    `At 20th level, you become an unparalleled hunter of your enemies. Once on each of your turns, you can add your Wisdom modifier to the attack roll or the damage roll of an attack you make against one of your favored enemies. You can choose to use this feature before or after the roll, but before any effects of the roll are applied.`
  );
  var ASI411 = makeASI("Ranger", 4);
  var ASI811 = makeASI("Ranger", 8);
  var ASI1211 = makeASI("Ranger", 12);
  var ASI1611 = makeASI("Ranger", 16);
  var ASI1911 = makeASI("Ranger", 19);
  var Ranger = {
    name: "Ranger",
    hitDieSize: 10,
    armor: acSet("light", "medium", "shield"),
    weaponCategory: wcSet("simple", "martial"),
    save: abSet("str", "dex"),
    skill: gains([], 3, [
      "Animal Handling",
      "Athletics",
      "Insight",
      "Investigation",
      "Nature",
      "Perception",
      "Stealth",
      "Survival"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([
        ["dex", 13],
        ["wis", 13]
      ]),
      armor: acSet("light", "medium", "shield"),
      weaponCategory: wcSet("simple", "martial"),
      skill: gains([], 1, [
        "Animal Handling",
        "Athletics",
        "Insight",
        "Investigation",
        "Nature",
        "Perception",
        "Stealth",
        "Survival"
      ])
    },
    features: /* @__PURE__ */ new Map([
      [1, [Favored, Explorer]],
      [2, [RangerFightingStyle, RangerSpellcasting.feature, SpellcastingFocus]],
      [3, [Awareness]],
      [4, [ASI411, MartialVersatility3]],
      [5, [ExtraAttack6]],
      [8, [ASI811, RangerLandsStride]],
      [10, [HideVeil]],
      [12, [ASI1211]],
      [14, [Vanish]],
      [16, [ASI1611]],
      [18, [FeralSenses]],
      [19, [ASI1911]],
      [20, [FoeSlayer]]
    ])
  };
  var ranger_default = Ranger;

  // src/classes/sorcerer/index.ts
  var ASI412 = makeASI("Sorcerer", 4);
  var ASI812 = makeASI("Sorcerer", 8);
  var ASI1212 = makeASI("Sorcerer", 12);
  var ASI1612 = makeASI("Sorcerer", 16);
  var ASI1912 = makeASI("Sorcerer", 19);
  var SorcererSpellcasting = new NormalSpellcasting(
    "Sorcerer",
    `An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells.`,
    "cha",
    "full",
    "Sorcerer",
    "Sorcerer"
  );
  var FontOfMagic = notImplementedFeature(
    "Font of Magic",
    `At 2nd level, you tap into a deep wellspring of magic within yourself. This wellspring is represented by sorcery points, which allow you to create a variety of magical effects.

Sorcery Points
You have 2 sorcery points, and you gain one additional point every time you level up, to a maximum of 20 at level 20. You can never have more sorcery points than shown on the table for your level. You regain all spent sorcery points when you finish a long rest.

Flexible Casting
You can use your sorcery points to gain additional spell slots, or sacrifice spell slots to gain additional sorcery points. You learn other ways to use your sorcery points as you reach higher levels.

Creating Spell Slots: You can transform unexpended sorcery points into one spell slot as a bonus action on your turn. The created spell slots vanish at the end of a long rest. The Creating Spell Slots table shows the cost of creating a spell slot of a given level. You can create spell slots no higher in level than 5th.
-  1st	2
-  2nd	3
-  3rd	5
-  4th	6
-  5th	7
Converting a Spell Slot to Sorcery Points: As a bonus action on your turn, you can expend one spell slot and gain a number of sorcery points equal to the slot's level.`
  );
  var Metamagic = notImplementedFeature(
    "Metamagic",
    `At 3rd level, you gain the ability to twist your spells to suit your needs. You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.

You can use only one Metamagic option on a spell when you cast it, unless otherwise noted.`
  );
  var SorcerousVersatility = nonCombatFeature(
    "Sorcerous Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing the magic within you flowing in new ways:
- Replace one of the options you chose for the Metamagic feature with a different Metamagic option available to you.
- Replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the sorcerer spell list.`
  );
  var MagicalGuidance = notImplementedFeature(
    "Magical Guidance",
    `You can tap into your inner wellspring of magic to try to conjure success from failure. When you make an ability check that fails, you can spend 1 sorcery point to reroll the d20, and you must use the new roll, potentially turning the failure into a success.`
  );
  var SorcerousRestoration = nonCombatFeature(
    "Sorcerous Restoration",
    `At 20th level, you regain 4 expended sorcery points whenever you finish a short rest.`
  );
  var Sorcerer = {
    name: "Sorcerer",
    hitDieSize: 6,
    weapon: wtSet("dagger", "dart", "sling", "quarterstaff", "light crossbow"),
    save: abSet("con", "cha"),
    skill: gains([], 2, [
      "Arcana",
      "Deception",
      "Insight",
      "Intimidation",
      "Persuasion",
      "Religion"
    ]),
    multi: { requirements: /* @__PURE__ */ new Map([["cha", 13]]) },
    features: /* @__PURE__ */ new Map([
      [1, [SorcererSpellcasting.feature]],
      [2, [FontOfMagic]],
      [3, [Metamagic]],
      [4, [ASI412, SorcerousVersatility]],
      [5, [MagicalGuidance]],
      [8, [ASI812]],
      [12, [ASI1212]],
      [16, [ASI1612]],
      [19, [ASI1912]],
      [20, [SorcerousRestoration]]
    ])
  };
  var sorcerer_default = Sorcerer;

  // src/classes/warlock/PactMagic.ts
  function getPactMagicLevel(level) {
    if (level < 3)
      return 1;
    if (level < 5)
      return 2;
    if (level < 7)
      return 3;
    if (level < 9)
      return 4;
    return 5;
  }
  function getPactMagicSlots(level) {
    if (level < 2)
      return 1;
    if (level < 11)
      return 2;
    if (level < 17)
      return 3;
    return 4;
  }
  var PactMagicResource = new ShortRestResource("Pact Magic", 1);
  var PactMagic = class {
    constructor(name, text, ability, className, spellList, icon) {
      this.name = name;
      this.text = text;
      this.ability = ability;
      this.className = className;
      this.spellList = spellList;
      this.icon = icon;
      this.entries = /* @__PURE__ */ new Map();
      this.feature = new SimpleFeature(`Pact Magic ${name}`, text, (g, me) => {
        this.initialise(me, me.getClassLevel(className, 1));
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
      const entry = this.entries.get(who.id);
      if (!entry)
        throw new Error(
          `${who.name} has not initialised their ${this.name} spellcasting method.`
        );
      return entry;
    }
    canCast(spell, caster) {
      const { spells } = this.getEntry(caster);
      return spell.lists.includes(this.spellList) || spells.has(spell);
    }
    addCastableSpell(spell, caster) {
      const { spells } = this.getEntry(caster);
      spells.add(spell);
    }
    initialise(who, casterLevel) {
      const level = getPactMagicLevel(casterLevel);
      const slots = getPactMagicSlots(casterLevel);
      who.initResource(PactMagicResource, slots);
      this.entries.set(who.id, { level, spells: /* @__PURE__ */ new Set() });
    }
    getMinSlot(spell, caster) {
      if (spell.level === 0)
        return 0;
      return this.getEntry(caster).level;
    }
    getMaxSlot(spell, caster) {
      if (spell.level === 0)
        return 0;
      return this.getEntry(caster).level;
    }
    getResourceForSpell(spell, slot) {
      if (slot > 0)
        return PactMagicResource;
    }
    getSaveType() {
      return { type: "ability", ability: this.ability };
    }
  };

  // src/classes/warlock/index.ts
  var WarlockPactMagic = new PactMagic(
    "Warlock",
    `Your arcane research and the magic bestowed on you by your patron have given you facility with spells.`,
    "cha",
    "Warlock",
    "Warlock"
  );
  var EldritchInvocations = notImplementedFeature(
    "Eldritch Invocation",
    `In your study of occult lore, you have unearthed eldritch invocations, fragments of forbidden knowledge that imbue you with an abiding magical ability.

At 2nd level, you gain two eldritch invocations of your choice. A list of the available options can be found on the Optional Features page. When you gain certain warlock levels, you gain additional invocations of your choice, as shown in the Invocations Known column of the Warlock table.

Additionally, when you gain a level in this class, you can choose one of the invocations you know and replace it with another invocation that you could learn at that level.

If an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class.`
  );
  var PactBoon = wrapperFeature(
    "Pact Boon",
    `At 3rd level, your otherworldly patron bestows a gift upon you for your loyal service. You gain one of the following features of your choice.`
  );
  var PactOfTheBlade = notImplementedFeature(
    "Pact of the Blade",
    `You can use your action to create a pact weapon in your empty hand. You can choose the form that this melee weapon takes each time you create it (see chapter 5 for weapon options). You are proficient with it while you wield it. This weapon counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.

Your pact weapon disappears if it is more than 5 feet away from you for 1 minute or more. It also disappears if you use this feature again, if you dismiss the weapon (no action required), or if you die.

You can transform one magic weapon into your pact weapon by performing a special ritual while you hold the weapon. You perform the ritual over the course of 1 hour, which can be done during a short rest. You can then dismiss the weapon, shunting it into an extradimensional space, and it appears whenever you create your pact weapon thereafter. You can't affect an artifact or a sentient weapon in this way. The weapon ceases being your pact weapon if you die, if you perform the 1-hour ritual on a different weapon, or if you use a 1-hour ritual to break your bond to it. The weapon appears at your feet if it is in the extradimensional space when the bond breaks.`
  );
  var PactOfTheChain = notImplementedFeature(
    "Pact of the Chain",
    `You learn the find familiar spell and can cast it as a ritual. The spell doesn't count against your number of spells known.

When you cast the spell, you can choose one of the normal forms for your familiar or one of the following special forms: imp, pseudodragon, quasit, or sprite.

Additionally, when you take the Attack action, you can forgo one of your own attacks to allow your familiar to use its reaction to make one attack of its own.`
  );
  var PactOfTheTalisman = notImplementedFeature(
    "Pact of the Talisman",
    `Your patron gives you an amulet, a talisman that can aid the wearer when the need is great. When the wearer fails an ability check, they can add a d4 to the roll, potentially turning the roll into a success. This benefit can be used a number of times equal to your proficiency bonus, and all expended uses are restored when you finish a long rest.

If you lose the talisman, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous amulet. The talisman turns to ash when you die.`
  );
  var PactOfTheTome = notImplementedFeature(
    "Pact of the Tome",
    `Your patron gives you a grimoire called a Book of Shadows. When you gain this feature, choose three cantrips from any class's spell list. The cantrips do not need to be from the same spell list. While the book is on your person, you can cast those cantrips at will. They don't count against your number of cantrips known. Any cantrip you cast with this feature is considered a warlock cantrip for you. If you lose your Book of Shadows, you can perform a 1-hour ceremony to receive a replacement from your patron. This ceremony can be performed during a short or long rest, and it destroys the previous book. The book turns to ash when you die.`
  );
  var EldritchVersatility = nonCombatFeature(
    "Eldritch Versatility",
    `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing a change of focus in your occult studies:
- Replace one cantrip you learned from this class's Pact Magic feature with another cantrip from the warlock spell list.
- Replace the option you chose for the Pact Boon feature with one of that feature's other options.
- If you're 12th level or higher, replace one spell from your Mystic Arcanum feature with another warlock spell of the same level.

If this change makes you ineligible for any of your Eldritch Invocations, you must also replace them now, choosing invocations for which you qualify.`
  );
  var MysticArcanum = notImplementedFeature(
    "Mystic Arcanum",
    `At 11th level, your patron bestows upon you a magical secret called an arcanum. Choose one 6th-level spell from the warlock spell list as this arcanum.

You can cast your arcanum spell once without expending a spell slot. You must finish a long rest before you can do so again.

At higher levels, you gain more warlock spells of your choice that can be cast in this way: one 7th-level spell at 13th level, one 8th-level spell at 15th level, and one 9th-level spell at 17th level. You regain all uses of your Mystic Arcanum when you finish a long rest.`
  );
  var EldritchMaster = nonCombatFeature(
    "Eldritch Master",
    `At 20th level, you can draw on your inner reserve of mystical power while entreating your patron to regain expended spell slots. You can spend 1 minute entreating your patron for aid to regain all your expended spell slots from your Pact Magic feature. Once you regain spell slots with this feature, you must finish a long rest before you can do so again.`
  );
  var ASI413 = makeASI("Warlock", 4);
  var ASI813 = makeASI("Warlock", 8);
  var ASI1213 = makeASI("Warlock", 12);
  var ASI1613 = makeASI("Warlock", 16);
  var ASI1913 = makeASI("Warlock", 19);
  var Warlock = {
    name: "Warlock",
    hitDieSize: 8,
    armor: acSet("light"),
    weaponCategory: wcSet("simple"),
    save: abSet("wis", "cha"),
    skill: gains([], 2, [
      "Arcana",
      "Deception",
      "History",
      "Intimidation",
      "Investigation",
      "Nature",
      "Religion"
    ]),
    multi: {
      requirements: /* @__PURE__ */ new Map([["cha", 13]]),
      armor: acSet("light"),
      weaponCategory: wcSet("simple")
    },
    features: /* @__PURE__ */ new Map([
      [1, [WarlockPactMagic.feature]],
      [2, [EldritchInvocations]],
      [3, [PactBoon]],
      [4, [ASI413, EldritchVersatility]],
      [8, [ASI813]],
      [11, [MysticArcanum]],
      [12, [ASI1213]],
      [16, [ASI1613]],
      [19, [ASI1913]],
      [20, [EldritchMaster]]
    ])
  };
  var warlock_default = Warlock;

  // src/data/allPCClasses.ts
  var allPCClasses = {
    Artificer: artificer_default,
    Barbarian: barbarian_default2,
    Bard: bard_default,
    Cleric: cleric_default,
    Druid: druid_default3,
    Fighter: fighter_default,
    Monk: monk_default,
    Paladin: paladin_default2,
    Ranger: ranger_default,
    Rogue: rogue_default2,
    Sorcerer: sorcerer_default,
    Warlock: warlock_default,
    Wizard: wizard_default2
  };
  var allPCClasses_default = allPCClasses;

  // src/races/Aasimar_VGM.ts
  var CelestialResistance = resistanceFeature(
    "Celestial Resistance",
    `You have resistance to necrotic damage and radiant damage.`,
    ["necrotic", "radiant"]
  );
  var HealingHandsResource = new LongRestResource("Healing Hands", 1);
  var HealingHandsAction = class extends AbstractSingleTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Healing Hands",
        "implemented",
        { target: new TargetResolver(g, actor.reach, []) },
        {
          heal: [{ type: "flat", amount: actor.level }],
          resources: [[HealingHandsResource, 1]],
          time: "action",
          description: `As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest.`
        }
      );
    }
    async applyEffect({ target }) {
      const { g, actor } = this;
      await g.heal(HealingHands, actor.level, { action: this, actor, target });
    }
  };
  var HealingHands = new SimpleFeature(
    "Healing Hands",
    `As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest.`,
    (g, me) => {
      me.initResource(HealingHandsResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new HealingHandsAction(g, me));
      });
    }
  );
  var LightBearerMethod = new InnateSpellcasting("Light Bearer", "cha");
  var LightBearer = bonusSpellsFeature(
    "Light Bearer",
    `You know the light cantrip. Charisma is your spellcasting ability for it.`,
    "level",
    LightBearerMethod,
    [{ level: 1, spell: "light" }]
  );
  var Aasimar = {
    name: "Aasimar",
    abilities: /* @__PURE__ */ new Map([["cha", 2]]),
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    features: /* @__PURE__ */ new Set([
      Darkvision60,
      CelestialResistance,
      HealingHands,
      LightBearer
    ]),
    languages: /* @__PURE__ */ new Set(["Common", "Celestial"])
  };
  var AasimarTransformationResource = new LongRestResource(
    "Aasimar Transformation",
    1
  );
  var NecroticShroud = notImplementedFeature(
    "Necrotic Shroud",
    `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn.
Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level.

Once you use this trait, you can't use it again until you finish a long rest.`
  );
  var FallenAasimar = {
    parent: Aasimar,
    name: "Fallen Aasimar",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["str", 1]]),
    features: /* @__PURE__ */ new Set([NecroticShroud])
  };
  var EndRadiantSoulAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "End Transformation",
        "implemented",
        {},
        {
          time: "bonus action",
          description: `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.
      Your transformation lasts for 1 minute or until you end it as a bonus action.`
        }
      );
    }
    async applyEffect() {
      await this.actor.removeEffect(RadiantSoulEffect);
    }
  };
  var RadiantSoulEffect = new Effect("Radiant Soul", "turnStart", (g) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.hasEffect(RadiantSoulEffect))
        actions.push(new EndRadiantSoulAction(g, who));
    });
    const opt = new OncePerTurnController(g);
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, attack, spell, interrupt, map } }) => {
        if ((attacker == null ? void 0 : attacker.hasEffect(RadiantSoulEffect)) && (attack || spell) && opt.canBeAffected(attacker)) {
          const amount = attacker.level;
          interrupt.add(
            new YesNoChoice(
              attacker,
              RadiantSoul,
              "Radiant Soul",
              `Add ${amount} bonus radiant damage to this attack or spell?`,
              Priority_default.Normal,
              async () => {
                opt.affect(attacker);
                map.add("radiant", amount);
              }
            )
          );
        }
      }
    );
  });
  var RadiantSoulAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Radiant Soul",
        "implemented",
        {},
        {
          resources: [[AasimarTransformationResource, 1]],
          time: "action",
          description: `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.
        Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.
        
        Once you use this trait, you can't use it again until you finish a long rest.`
        }
      );
    }
    async applyEffect() {
      await this.actor.addEffect(RadiantSoulEffect, { duration: minutes(1) });
    }
  };
  var RadiantSoul = new SimpleFeature(
    "Radiant Soul",
    `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.
Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.

Once you use this trait, you can't use it again until you finish a long rest.`,
    (g, me) => {
      if (me.level >= 3) {
        me.initResource(AasimarTransformationResource);
        g.events.on("GetActions", ({ detail: { who, actions } }) => {
          if (who === me)
            actions.push(new RadiantSoulAction(g, me));
        });
      }
    }
  );
  var ProtectorAasimar = {
    parent: Aasimar,
    name: "Protector Aasimar",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["wis", 1]]),
    features: /* @__PURE__ */ new Set([RadiantSoul])
  };
  var RadiantConsumption = notImplementedFeature(
    "Radiant Consumption",
    `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you.
Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.

Once you use this trait, you can't use it again until you finish a long rest.`
  );
  var ScourgeAasimar = {
    parent: Aasimar,
    name: "Scourge Aasimar",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["con", 1]]),
    features: /* @__PURE__ */ new Set([RadiantConsumption])
  };

  // src/img/act/breath.svg
  var breath_default = "./breath-5T2EAE3T.svg";

  // src/img/act/special-breath.svg
  var special_breath_default = "./special-breath-PGWJ2QD5.svg";

  // src/races/Dragonborn_FTD.ts
  var MetallicDragonborn = {
    name: "Dragonborn (Metallic)",
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    languages: laSet("Common")
  };
  var BreathWeaponResource = new LongRestResource("Breath Weapon", 2);
  var MetallicBreathWeaponResource = new LongRestResource(
    "Metallic Breath Weapon",
    1
  );
  function getBreathArea(me, point) {
    const size = me.sizeInUnits;
    return aimCone(me.position, size, point, 15);
  }
  var BreathAction = class extends AbstractAttackAction {
    getAffectedArea({ point }) {
      if (point)
        return [getBreathArea(this.actor, point)];
    }
    getAffected({ point }) {
      return this.g.getInside(getBreathArea(this.actor, point), [this.actor]);
    }
    getTargets() {
      return [];
    }
  };
  var BreathWeaponAction = class extends BreathAction {
    constructor(g, actor, damageType, damageDice) {
      super(
        g,
        actor,
        "Breath Weapon",
        "implemented",
        "breath weapon",
        "ranged",
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
    async applyEffect({ point }) {
      const { actor: attacker, g, damageDice, damageType } = this;
      const damage = await g.rollDamage(damageDice, {
        source: this,
        attacker,
        size: 10,
        damageType,
        tags: atSet("breath weapon")
      });
      for (const target of g.getInside(getBreathArea(attacker, point))) {
        const { damageResponse } = await g.save({
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
          damageResponse
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
  var MetallicBreathAction = class extends BreathAction {
    constructor(g, actor, name, status = "missing", description, iconColour) {
      super(
        g,
        actor,
        name,
        status,
        "metallic breath weapon",
        "ranged",
        { point: new PointResolver(g, 15) },
        {
          resources: [[MetallicBreathWeaponResource, 1]],
          description,
          icon: makeIcon(special_breath_default, iconColour)
        }
      );
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
    async applyEffect({ point }) {
      const { g, actor } = this;
      const config = { conditions: coSet("Incapacitated"), duration: 2 };
      for (const target of g.getInside(getBreathArea(actor, point))) {
        const { outcome } = await g.save({
          source: this,
          type: { type: "ability", ability: "con" },
          attacker: actor,
          ability: "con",
          who: target,
          effect: EnervatingBreathEffect,
          config
        });
        if (outcome === "fail")
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
        "implemented",
        `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus.
      Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.`
      );
    }
    async applyEffect({ point }) {
      const { g, actor } = this;
      for (const target of g.getInside(getBreathArea(actor, point))) {
        const config = { duration: Infinity };
        const { outcome } = await g.save({
          source: this,
          type: { type: "ability", ability: "con" },
          attacker: actor,
          ability: "str",
          who: target,
          effect: Prone,
          config
        });
        if (outcome === "fail") {
          await g.forcePush(target, actor, 20, this);
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
      size: SizeCategory_default.Medium,
      features: /* @__PURE__ */ new Set([breathWeapon, draconicResistance, metallicBreathWeapon])
    };
  }
  var BronzeDragonborn = makeAncestry("Bronze", "lightning");
  var GoldDragonborn = makeAncestry("Gold", "fire");

  // src/races/Elf.ts
  var KeenSenses = new SimpleFeature(
    "Keen Senses",
    `You have proficiency in the Perception skill.`,
    (g, me) => {
      me.addProficiency("Perception", "proficient");
    }
  );
  var Trance = nonCombatFeature(
    "Trance",
    `Elves don\u2019t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is \u201Ctrance.\u201D) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.`
  );
  var Elf = {
    name: "Elf",
    abilities: /* @__PURE__ */ new Map([["dex", 2]]),
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    features: /* @__PURE__ */ new Set([Darkvision60, KeenSenses, FeyAncestry, Trance]),
    languages: laSet("Common", "Elvish")
  };
  var ElfWeaponTraining = new SimpleFeature(
    "Elf Weapon Training",
    ``,
    (g, me) => {
      for (const weapon of [
        "longsword",
        "shortsword",
        "shortbow",
        "longbow"
      ])
        me.addProficiency(weapon, "proficient");
    }
  );
  var CantripMethod = new InnateSpellcasting("Cantrip", "int");
  var Cantrip = new ConfiguredFeature(
    "Cantrip",
    `You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.`,
    (g, me, cantrip) => {
      if (cantrip.level !== 0 || cantrip.lists.includes("Wizard"))
        throw new Error(
          `${cantrip.name} is not a valid choice for Cantrip (Elf).`
        );
      me.knownSpells.add(cantrip);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new CastSpell(g, me, CantripMethod, cantrip));
      });
    }
  );
  var HighElf = {
    parent: Elf,
    name: "High Elf",
    abilities: /* @__PURE__ */ new Map([["int", 1]]),
    size: SizeCategory_default.Medium,
    features: /* @__PURE__ */ new Set([ElfWeaponTraining, Cantrip, ExtraLanguage])
  };

  // src/races/Genasi_EEPC.ts
  var Genasi = {
    name: "Genasi",
    size: SizeCategory_default.Medium,
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
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["dex", 1]]),
    features: /* @__PURE__ */ new Set([UnendingBreath, MingleWithTheWind])
  };
  var FireResistance = resistanceFeature(
    "Fire Resistance",
    `You have resistance to fire damage.`,
    ["fire"]
  );
  var ReachToTheBlazeResource = new LongRestResource("Reach to the Blaze", 1);
  var ReachToTheBlazeSpells = [
    { level: 1, spell: "produce flame" },
    { level: 3, spell: "burning hands", resource: ReachToTheBlazeResource }
  ];
  var ReachToTheBlazeMethod = new InnateSpellcasting(
    "Reach to the Blaze",
    "con",
    bonusSpellResourceFinder(ReachToTheBlazeSpells)
  );
  var ReachToTheBlaze = bonusSpellsFeature(
    "Reach to the Blaze",
    `You know the produce flame cantrip. Once you reach 3rd level, you can cast the burning hands spell once with this trait as a 1st-level spell, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.`,
    "level",
    ReachToTheBlazeMethod,
    ReachToTheBlazeSpells,
    void 0,
    (g, me) => {
      me.knownSpells.add(ProduceFlame_default);
      me.preparedSpells.add(ProduceFlame_default);
    }
  );
  var FireGenasi = {
    parent: Genasi,
    name: "Fire Genasi",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["int", 1]]),
    features: /* @__PURE__ */ new Set([Darkvision60, FireResistance, ReachToTheBlaze])
  };
  var AcidResistance = resistanceFeature(
    "Acid Resistance",
    `You have resistance to acid damage.`,
    ["acid"]
  );
  var CallToTheWaveResource = new LongRestResource("Call to the Wave", 1);
  var CallToTheWaveSpells = [
    { level: 1, spell: "shape water" },
    {
      level: 3,
      spell: "create or destroy water",
      resource: CallToTheWaveResource
    }
  ];
  var CallToTheWaveMethod = new InnateSpellcasting(
    "Call to the Wave",
    "con",
    bonusSpellResourceFinder(CallToTheWaveSpells)
  );
  var CallToTheWave = bonusSpellsFeature(
    "Call to the Wave",
    `You know the shape water cantrip. When you reach 3rd level, you can cast the create or destroy water spell as a 2nd-level spell once with this trait, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.`,
    "level",
    CallToTheWaveMethod,
    CallToTheWaveSpells,
    void 0,
    () => {
    }
  );
  var Swim = new SimpleFeature(
    "Swim",
    `You have a swimming speed of 30 feet.`,
    (g, me) => {
      var _a;
      const swimSpeed = Math.max((_a = me.movement.get("swim")) != null ? _a : 0, 30);
      me.movement.set("swim", swimSpeed);
    }
  );
  var WaterGenasi = {
    parent: Genasi,
    name: "Water Genasi",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["wis", 1]]),
    features: /* @__PURE__ */ new Set([AcidResistance, Amphibious, Swim, CallToTheWave])
  };

  // src/races/Gnome.ts
  var GnomeCunning = new SimpleFeature(
    "Gnome Cunning",
    `You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.`,
    (g, me) => {
      g.events.on(
        "BeforeSave",
        ({ detail: { who, tags, ability, diceType } }) => {
          if (who === me && tags.has("magic") && isA(ability, MentalAbilities))
            diceType.add("advantage", GnomeCunning);
        }
      );
    }
  );
  var Gnome = {
    name: "Gnome",
    abilities: /* @__PURE__ */ new Map([["int", 2]]),
    size: SizeCategory_default.Small,
    movement: /* @__PURE__ */ new Map([["speed", 25]]),
    features: /* @__PURE__ */ new Set([Darkvision60, GnomeCunning]),
    languages: laSet("Common", "Gnomish")
  };
  var ArtificersLore = notImplementedFeature(
    "Artificer's Lore",
    `Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.`
  );
  var Tinker = notImplementedFeature(
    "Tinker",
    `You have proficiency with artisan\u2019s tools (tinker\u2019s tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours (unless you spend 1 hour repairing it to keep the device functioning), or when you use your action to dismantle it; at that time, you can reclaim the materials used to create it. You can have up to three such devices active at a time.
When you create a device, choose one of the following options:
- Clockwork Toy. This toy is a clockwork animal, monster, or person, such as a frog, mouse, bird, dragon, or soldier. When placed on the ground, the toy moves 5 feet across the ground on each of your turns in a random direction. It makes noises as appropriate to the creature it represents.
- Fire Starter. The device produces a miniature flame, which you can use to light a candle, torch, or campfire. Using the device requires your action.
- Music Box. When opened, this music box plays a single song at a moderate volume. The box stops playing when it reaches the song\u2019s end or when it is closed.`
  );
  var RockGnome = {
    parent: Gnome,
    name: "Rock Gnome",
    abilities: /* @__PURE__ */ new Map([["con", 1]]),
    size: SizeCategory_default.Small,
    features: /* @__PURE__ */ new Set([ArtificersLore, Tinker])
  };

  // src/races/HalfElf.ts
  var SkillVersatility = new ConfiguredFeature(
    "Skill Versatility",
    `You gain proficiency in two skills of your choice.`,
    (g, me, skills) => {
      for (const skill of skills)
        me.addProficiency(skill, "proficient");
    }
  );
  var AbilityScoreBonus = new ConfiguredFeature(
    "Ability Score Bonus",
    ``,
    (g, me, abilities) => {
      for (const ability of abilities)
        me[ability].score++;
    }
  );
  var HalfElf = {
    name: "Half-Elf",
    abilities: /* @__PURE__ */ new Map([["cha", 2]]),
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    features: /* @__PURE__ */ new Set([
      Darkvision60,
      FeyAncestry,
      SkillVersatility,
      AbilityScoreBonus,
      ExtraLanguage
    ]),
    languages: laSet("Common", "Elvish")
  };

  // src/races/Halfling.ts
  var Lucky2 = new SimpleFeature(
    "Lucky",
    `When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.`,
    (g, me) => {
      g.events.on("DiceRolled", ({ detail: { type: t, values, interrupt } }) => {
        if ((t.type === "attack" || t.type === "check" || t.type === "save") && t.who === me && values.final === 1)
          interrupt.add(
            new YesNoChoice(
              me,
              Lucky2,
              "Lucky",
              `${me.name} rolled a 1 on a ${t.type} check. Reroll it?`,
              Priority_default.ChangesOutcome,
              async () => {
                const newRoll = g.dice.roll(t).values.final;
                values.add(newRoll, "higher");
              }
            )
          );
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
    size: SizeCategory_default.Small,
    movement: /* @__PURE__ */ new Map([["speed", 25]]),
    features: /* @__PURE__ */ new Set([Lucky2, Brave, HalflingNimbleness]),
    languages: laSet("Common", "Halfling")
  };
  var NaturallyStealthy = notImplementedFeature(
    "Naturally Stealthy",
    `You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.`
  );
  var LightfootHalfling = {
    parent: Halfling,
    name: "Lightfoot Halfling",
    abilities: /* @__PURE__ */ new Map([["cha", 1]]),
    size: SizeCategory_default.Small,
    features: /* @__PURE__ */ new Set([NaturallyStealthy])
  };
  var StoutResilience = poisonResistanceFeature(
    "Stout Resilience",
    `You have advantage on saving throws against poison, and you have resistance against poison damage.`
  );
  var StoutHalfling = {
    parent: Halfling,
    name: "Stout Halfling",
    abilities: /* @__PURE__ */ new Map([["con", 1]]),
    size: SizeCategory_default.Small,
    features: /* @__PURE__ */ new Set([StoutResilience])
  };

  // src/races/HalfOrc.ts
  var Menacing = new SimpleFeature(
    "Menacing",
    `You gain proficiency in the Intimidation skill.`,
    (g, me) => {
      me.addProficiency("Intimidation", "proficient");
    }
  );
  var RelentlessEndurance = notImplementedFeature(
    "Relentless Endurance",
    `When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can\u2019t use this feature again until you finish a long rest.`
  );
  var SavageAttacks = new SimpleFeature(
    "Brutal Critical",
    `When you score a critical hit with a melee weapon attack, you can roll one of the weapon\u2019s damage dice one additional time and add it to the extra damage of the critical hit.`,
    (g, me) => {
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
          if (attacker === me && (attack == null ? void 0 : attack.roll.type.tags.has("melee")) && critical) {
            const base = weapon == null ? void 0 : weapon.damage;
            if ((base == null ? void 0 : base.type) === "dice") {
              interrupt.add(
                new EvaluateLater(
                  me,
                  SavageAttacks,
                  Priority_default.Normal,
                  async () => {
                    const damage = await g.rollDamage(
                      1,
                      {
                        source: SavageAttacks,
                        attacker: me,
                        damageType: base.damageType,
                        size: base.amount.size,
                        target,
                        weapon,
                        tags: attack.roll.type.tags
                      },
                      false
                    );
                    bonus.add(damage, SavageAttacks);
                  }
                )
              );
            }
          }
        }
      );
    }
  );
  var HalfOrc = {
    name: "Half-Orc",
    abilities: /* @__PURE__ */ new Map([
      ["str", 2],
      ["con", 1]
    ]),
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    features: /* @__PURE__ */ new Set([
      Darkvision60,
      Menacing,
      RelentlessEndurance,
      SavageAttacks
    ]),
    languages: laSet("Common", "Orc")
  };

  // src/races/Human.ts
  var Human = {
    name: "Human",
    abilities: /* @__PURE__ */ new Map([
      ["str", 1],
      ["dex", 1],
      ["con", 1],
      ["int", 1],
      ["wis", 1],
      ["cha", 1]
    ]),
    size: SizeCategory_default.Medium,
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    languages: laSet("Common"),
    features: /* @__PURE__ */ new Set([ExtraLanguage])
  };
  var Human_default = Human;

  // src/races/Tiefling.ts
  var HellishResistance = resistanceFeature(
    "Hellish Resistance",
    `You have resistance to fire damage.`,
    ["fire"]
  );
  var Tiefling = {
    name: "Tiefling",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["cha", 2]]),
    movement: /* @__PURE__ */ new Map([["speed", 30]]),
    features: /* @__PURE__ */ new Set([Darkvision60, HellishResistance]),
    languages: laSet("Common", "Infernal")
  };
  var HellishRebukeResource = new LongRestResource(
    "Infernal Legacy: Hellish Rebuke",
    1
  );
  var DarknessResource = new LongRestResource("Infernal Legacy: Darkness", 1);
  var InfernalLegacySpells = [
    { level: 1, spell: "thaumaturgy" },
    { level: 3, spell: "hellish rebuke", resource: HellishRebukeResource },
    { level: 5, spell: "darkness", resource: DarknessResource }
  ];
  var InfernalLegacyMethod = new InnateSpellcasting(
    "Infernal Legacy",
    "cha",
    bonusSpellResourceFinder(InfernalLegacySpells)
  );
  var InfernalLegacy = bonusSpellsFeature(
    "Infernal Legacy",
    `You know the thaumaturgy cantrip. Once you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell with this trait; you regain the ability to cast it when you finish a long rest. Once you reach 5th level, you can also cast the darkness spell once per day with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells.`,
    "level",
    InfernalLegacyMethod,
    InfernalLegacySpells
  );
  var Asmodeus = {
    parent: Tiefling,
    name: "Tiefling (Asmodeus)",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([["int", 1]]),
    features: /* @__PURE__ */ new Set([InfernalLegacy])
  };

  // src/races/Triton.ts
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
    { level: 1, spell: "fog cloud", resource: FogCloudResource },
    { level: 3, spell: "gust of wind", resource: GustOfWindResource },
    { level: 5, spell: "wall of water", resource: WallOfWaterResource }
  ];
  var ControlAirAndWaterMethod = new InnateSpellcasting(
    "Control Air and Water",
    "cha",
    bonusSpellResourceFinder(ControlAirAndWaterSpells)
  );
  var ControlAirAndWater = bonusSpellsFeature(
    "Control Air and Water",
    `You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can\u2019t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.`,
    "level",
    ControlAirAndWaterMethod,
    ControlAirAndWaterSpells
  );
  var EmissaryOfTheSea = nonCombatFeature(
    "Emissary of the Sea",
    `Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.`
  );
  var GuardiansOfTheDepths = resistanceFeature(
    "Guardians of the Depths",
    `Adapted to even the most extreme ocean depths, you have resistance to cold damage.`,
    ["cold"]
  );
  var Triton = {
    name: "Triton",
    size: SizeCategory_default.Medium,
    abilities: /* @__PURE__ */ new Map([
      ["str", 1],
      ["con", 1],
      ["cha", 1]
    ]),
    movement: /* @__PURE__ */ new Map([
      ["speed", 30],
      ["swim", 30]
    ]),
    languages: laSet("Common", "Primordial"),
    features: /* @__PURE__ */ new Set([
      Amphibious,
      ControlAirAndWater,
      Darkvision60,
      EmissaryOfTheSea,
      GuardiansOfTheDepths
    ])
  };
  var Triton_default = Triton;

  // src/data/allPCRaces.ts
  var allPCRaces = {
    "Fallen Aasimar": FallenAasimar,
    "Protector Aasimar": ProtectorAasimar,
    "Scourge Aasimar": ScourgeAasimar,
    "Bronze Dragonborn": BronzeDragonborn,
    "Gold Dragonborn": GoldDragonborn,
    "Hill Dwarf": HillDwarf,
    "Mountain Dwarf": MountainDwarf,
    "High Elf": HighElf,
    "Air Genasi": AirGenasi,
    "Fire Genasi": FireGenasi,
    "Water Genasi": WaterGenasi,
    "Rock Gnome": RockGnome,
    "Half-Elf": HalfElf,
    "Lightfoot Halfling": LightfootHalfling,
    "Stout Halfling": StoutHalfling,
    "Half-Orc": HalfOrc,
    Human: Human_default,
    "Tiefling (Asmodeus)": Asmodeus,
    Triton: Triton_default
  };
  var allPCRaces_default = allPCRaces;

  // src/img/act/frenzy.svg
  var frenzy_default = "./frenzy-XYJEPIJ4.svg";

  // src/classes/barbarian/Berserker/Frenzy.ts
  var FrenzyIcon = makeIcon(frenzy_default);
  var FrenzyAttack = class extends WeaponAttack {
    constructor(g, actor, weapon) {
      super(g, "Frenzy", actor, "melee", weapon);
      this.weapon = weapon;
      this.subIcon = FrenzyIcon;
      this.tags.delete("costs attack");
    }
    getTime() {
      return "bonus action";
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
            new EvaluateLater(who, FrenzyEffect, Priority_default.Normal, async () => {
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
              Priority_default.Normal,
              () => me.addEffect(FrenzyEffect, { duration: minutes(1) })
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
  var Berserker2 = {
    className: "Barbarian",
    name: "Path of the Berserker",
    features: /* @__PURE__ */ new Map([
      [3, [Frenzy_default]],
      [6, [MindlessRage]],
      [10, [IntimidatingPresence]],
      [14, [Retaliation]]
    ])
  };
  var Berserker_default = Berserker2;

  // src/classes/druid/Land/index.ts
  var BonusCantrip = new ConfiguredFeature(
    "Bonus Cantrip",
    `You learn one additional druid cantrip of your choice. This cantrip doesn't count against the number of druid cantrips you know.`,
    (g, me, spell) => {
      me.preparedSpells.add(allSpells_default[spell]);
    }
  );
  var NaturalRecovery = nonCombatFeature(
    "Natural Recovery",
    `Starting at 2nd level, you can regain some of your magical energy by sitting in meditation and communing with nature. During a short rest, you choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your druid level (rounded up), and none of the slots can be 6th level or higher. You can't use this feature again until you finish a long rest.

For example, when you are a 4th-level druid, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level slot or two 1st-level slots.`
  );
  var bonusSpells = {
    arctic: [
      { level: 3, spell: "hold person" },
      { level: 3, spell: "spike growth" },
      { level: 5, spell: "sleet storm" },
      { level: 5, spell: "slow" },
      { level: 7, spell: "freedom of movement" },
      { level: 7, spell: "ice storm" },
      { level: 9, spell: "commune with nature" },
      { level: 9, spell: "cone of cold" }
    ],
    coast: [
      { level: 3, spell: "mirror image" },
      { level: 3, spell: "misty step" },
      { level: 5, spell: "water breathing" },
      { level: 5, spell: "water walk" },
      { level: 7, spell: "control water" },
      { level: 7, spell: "freedom of movement" },
      { level: 9, spell: "conjure elemental" },
      { level: 9, spell: "scrying" }
    ],
    desert: [
      { level: 3, spell: "blur" },
      { level: 3, spell: "silence" },
      { level: 5, spell: "create food and water" },
      { level: 5, spell: "protection from energy" },
      { level: 7, spell: "blight" },
      { level: 7, spell: "hallucinatory terrain" },
      { level: 9, spell: "insect plague" },
      { level: 9, spell: "wall of stone" }
    ],
    forest: [
      { level: 3, spell: "barkskin" },
      { level: 3, spell: "spider climb" },
      { level: 5, spell: "call lightning" },
      { level: 5, spell: "plant growth" },
      { level: 7, spell: "divination" },
      { level: 7, spell: "freedom of movement" },
      { level: 9, spell: "commune with nature" },
      { level: 9, spell: "tree stride" }
    ],
    grassland: [
      { level: 3, spell: "invisibility" },
      { level: 3, spell: "pass without trace" },
      { level: 5, spell: "daylight" },
      { level: 5, spell: "haste" },
      { level: 7, spell: "divination" },
      { level: 7, spell: "freedom of movement" },
      { level: 9, spell: "dream" },
      { level: 9, spell: "insect plague" }
    ],
    mountain: [
      { level: 3, spell: "spider climb" },
      { level: 3, spell: "spike growth" },
      { level: 5, spell: "lightning bolt" },
      { level: 5, spell: "meld into stone" },
      { level: 7, spell: "stone shape" },
      { level: 7, spell: "stoneskin" },
      { level: 9, spell: "passwall" },
      { level: 9, spell: "wall of stone" }
    ],
    swamp: [
      { level: 3, spell: "darkness" },
      { level: 3, spell: "melf's acid arrow" },
      { level: 5, spell: "water walk" },
      { level: 5, spell: "stinking cloud" },
      { level: 7, spell: "freedom of movement" },
      { level: 7, spell: "locate creature" },
      { level: 9, spell: "insect plague" },
      { level: 9, spell: "scrying" }
    ],
    Underdark: [
      { level: 3, spell: "spider climb" },
      { level: 3, spell: "web" },
      { level: 5, spell: "gaseous form" },
      { level: 5, spell: "stinking cloud" },
      { level: 7, spell: "greater invisibility" },
      { level: 7, spell: "stoneshape" },
      { level: 9, spell: "cloudkill" },
      { level: 9, spell: "insect plague" }
    ]
  };
  var bonusSpellsFeatures = new Map(
    objectEntries(bonusSpells).map(([type, entries]) => [
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
  var DruidLandsStride = makeLandsStride(
    `Starting at 6th level, moving through nonmagical difficult terrain costs you no extra movement. You can also pass through nonmagical plants without being slowed by them and without taking damage from them if they have thorns, spines, or a similar hazard.

In addition, you have advantage on saving throws against plants that are magically created or manipulated to impede movement, such as those created by the entangle spell.`
  );
  var wardTypes = ctSet("elemental", "fey");
  var NaturesWard = new SimpleFeature(
    "Nature's Ward",
    `When you reach 10th level, you can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.`,
    (g, me) => {
      g.events.on(
        "BeforeEffect",
        ({ detail: { config, effect, attacker, who, success } }) => {
          var _a;
          const isPoisonOrDisease = ((_a = config.conditions) == null ? void 0 : _a.has("Poisoned")) || hasAny(effect.tags, ["poison", "disease"]);
          const isCharmOrFrighten = hasAny(config.conditions, [
            "Charmed",
            "Frightened"
          ]);
          const isElementalOrFey = attacker && wardTypes.has(attacker.type);
          if (who === me && (isElementalOrFey && isCharmOrFrighten || isPoisonOrDisease))
            success.add("fail", NaturesWard);
        }
      );
    }
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
      [6, [DruidLandsStride]],
      [10, [NaturesWard]],
      [14, [NaturesSanctuary]]
    ])
  };
  var Land_default = Land;

  // src/classes/druid/Shepherd/index.ts
  var SpeechOfTheWoods = notImplementedFeature(
    "Speech of the Woods",
    `At 2nd level, you gain the ability to converse with beasts and many fey.

You learn to speak, read, and write Sylvan. In addition, beasts can understand your speech, and you gain the ability to decipher their noises and motions. Most beasts lack the intelligence to convey or understand sophisticated concepts, but a friendly beast could relay what it has seen or heard in the recent past. This ability doesn't grant you friendship with beasts, though you can combine this ability with gifts to curry favor with them as you would with any nonplayer character.`
  );
  var SpiritTotem = notImplementedFeature(
    "Spirit Totem",
    `Starting at 2nd level, you can call forth nature spirits to influence the world around you. As a bonus action, you can magically summon an incorporeal spirit to a point you can see within 60 feet of you. The spirit creates an aura in a 30-foot radius around that point. It counts as neither a creature nor an object, though it has the spectral appearance of the creature it represents.

As a bonus action, you can move the spirit up to 60 feet to a point you can see.

The spirit persists for 1 minute or until you're incapacitated. Once you use this feature, you can't use it again until you finish a short or long rest.

The effect of the spirit's aura depends on the type of spirit you summon from the options below.

- Bear Spirit. The bear spirit grants you and your allies its might and endurance. Each creature of your choice in the aura when the spirit appears gains temporary hit points equal to 5 + your druid level. In addition, you and your allies gain advantage on Strength checks and Strength saving throws while in the aura.
- Hawk Spirit. The hawk spirit is a consummate hunter, aiding you and your allies with its keen sight. When a creature makes an attack roll against a target in the spirit's aura, you can use your reaction to grant advantage to that attack roll. In addition, you and your allies have advantage on Wisdom (Perception) checks while in the aura.
- Unicorn Spirit. The unicorn spirit lends its protection to those nearby. You and your allies gain advantage on all ability checks made to detect creatures in the spirit's aura. In addition, if you cast a spell using a spell slot that restores hit points to any creature inside or outside the aura, each creature of your choice in the aura also regains hit points equal to your druid level.`
  );
  var MightySummoner = notImplementedFeature(
    "Mighty Summoner",
    `Starting at 6th level, beasts and fey that you conjure are more resilient than normal. Any beast or fey summoned or created by a spell that you cast gains the following benefits:

The creature appears with more hit points than normal: 2 extra hit points per Hit Die it has.
The damage from its natural weapons is considered magical for the purpose of overcoming immunity and resistance to nonmagical attacks and damage.`
  );
  var GuardianSpirit = notImplementedFeature(
    "Guardian Spirit",
    `Beginning at 10th level, your Spirit Totem safeguards the beasts and fey that you call forth with your magic. When a beast or fey that you summoned or created with a spell ends its turn in your Spirit Totem aura, that creature regains a number of hit points equal to half your druid level.`
  );
  var FaithfulSummons = notImplementedFeature(
    "Faithful Summons",
    `Starting at 14th level, the nature spirits you commune with protect you when you are the most defenseless. If you are reduced to 0 hit points or are incapacitated against your will, you can immediately gain the benefits of conjure animals as if it were cast using a 9th-level spell slot. It summons four beasts of your choice that are challenge rating 2 or lower. The conjured beasts appear within 20 feet of you. If they receive no commands from you, they protect you from harm and attack your foes. The spell lasts for 1 hour, requiring no concentration, or until you dismiss it (no action required).

Once you use this feature, you can't use it again until you finish a long rest.`
  );
  var Shepherd = {
    className: "Druid",
    name: "Circle of the Shepherd",
    features: /* @__PURE__ */ new Map([
      [2, [SpeechOfTheWoods, SpiritTotem]],
      [6, [MightySummoner]],
      [10, [GuardianSpirit]],
      [14, [FaithfulSummons]]
    ])
  };
  var Shepherd_default = Shepherd;

  // src/classes/paladin/Crown/index.ts
  var CrownOathSpellsList = [
    { level: 3, spell: "command" },
    { level: 3, spell: "compelled duel" },
    { level: 5, spell: "warding bond" },
    { level: 5, spell: "zone of truth" },
    { level: 9, spell: "aura of vitality" },
    { level: 9, spell: "spirit guardians" },
    { level: 13, spell: "banishment" },
    { level: 13, spell: "guardian of faith" },
    { level: 17, spell: "circle of power" },
    { level: 17, spell: "geas" }
  ];
  var CrownOathSpells = bonusSpellsFeature(
    "Oath Spells",
    `You gain oath spells at the paladin levels listed.`,
    "Paladin",
    PaladinSpellcasting,
    CrownOathSpellsList,
    "Paladin"
  );
  var ChampionChallengeEffect = new Effect(
    "Champion Challenge",
    "turnStart",
    (g) => {
      g.events.on("BeforeMove", ({ detail: { who, from, to, error } }) => {
        const efConfig = who.getEffectConfig(ChampionChallengeEffect);
        if (!efConfig)
          return;
        const { oldDistance, newDistance } = compareDistances(
          efConfig.inflictor,
          efConfig.inflictor.position,
          who,
          from,
          to
        );
        if (oldDistance <= 30 && newDistance > 30)
          error.add(
            `must stay near ${efConfig.inflictor.name}`,
            ChampionChallengeEffect
          );
      });
      const cleanup = ({
        detail: { interrupt }
      }) => {
        for (const who of g.combatants) {
          const efConfig = who.getEffectConfig(ChampionChallengeEffect);
          if (!efConfig)
            continue;
          if (efConfig.inflictor.conditions.has("Incapacitated") || distance(efConfig.inflictor, who) > 30)
            interrupt.add(
              new EvaluateLater(
                who,
                ChampionChallengeEffect,
                Priority_default.Normal,
                () => who.removeEffect(ChampionChallengeEffect)
              )
            );
        }
      };
      g.events.on("AfterAction", cleanup);
      g.events.on("CombatantMoved", cleanup);
    }
  );
  var ChampionChallengeAction = class extends AbstractMultiTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Channel Divinity: Champion Challenge",
        "implemented",
        { targets: new MultiTargetResolver(g, 1, Infinity, 30, [canSee]) },
        {
          description: `As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.`,
          resources: [[ChannelDivinityResource, 1]],
          subIcon: PaladinIcon,
          time: "bonus action"
        }
      );
    }
    async applyEffect(actionConfig) {
      const { g, actor } = this;
      for (const who of this.getAffected(actionConfig)) {
        const effect = ChampionChallengeEffect;
        const config = {
          inflictor: actor,
          duration: Infinity
        };
        const result = await g.save({
          source: this,
          type: PaladinSpellcasting.getSaveType(),
          attacker: actor,
          who,
          ability: "wis",
          effect,
          config,
          tags: ["charm"]
        });
        if (result.outcome === "fail")
          await who.addEffect(effect, config, actor);
      }
    }
  };
  var ChampionChallenge = new SimpleFeature(
    "Channel Divinity: Champion Challenge",
    `As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new ChampionChallengeAction(g, me));
      });
    }
  );
  var noMoreThanHalfHitPoints = {
    name: "no more than half hit points",
    message: "too healthy",
    check(g, action, value) {
      const ratio = value.hp / value.hpMax;
      return ratio <= 0.5;
    }
  };
  var TurnTheTideAction = class extends AbstractMultiTargetAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Channel Divinity: Turn the Tide",
        "implemented",
        {
          targets: new MultiTargetResolver(g, 1, Infinity, 30, [
            canBeHeardBy,
            noMoreThanHalfHitPoints
          ])
        },
        {
          heal: [
            { type: "dice", amount: { count: 1, size: 6 } },
            { type: "flat", amount: Math.max(1, actor.cha.modifier) }
          ],
          resources: [[ChannelDivinityResource, 1]],
          subIcon: PaladinIcon,
          tags: ["vocal"],
          time: "bonus action",
          description: `As a bonus action, you can bolster injured creatures with your Channel Divinity. Each creature of your choice that can hear you within 30 feet of you regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half of its hit points.`
        }
      );
    }
    async applyEffect({ targets }) {
      const { g, actor } = this;
      const heal = Math.max(1, actor.cha.modifier) + await g.rollHeal(1, { size: 6, actor, source: this });
      for (const target of targets)
        await g.heal(this, heal, { action: this, actor, target });
    }
  };
  var TurnTheTide = new SimpleFeature(
    "Channel Divinity: Turn the Tide",
    `As a bonus action, you can bolster injured creatures with your Channel Divinity. Each creature of your choice that can hear you within 30 feet of you regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half of its hit points.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new TurnTheTideAction(g, me));
      });
    }
  );
  var DivineAllegianceAction = class extends AbstractSingleTargetAction {
    constructor(g, actor, gather) {
      super(
        g,
        actor,
        "Divine Allegiance",
        "implemented",
        { target: new TargetResolver(g, 5, [canSee, notSelf]) },
        {
          description: `When a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.`,
          time: "reaction"
        }
      );
      this.gather = gather;
    }
    async applyEffect() {
      const { g, actor, gather } = this;
      if (!gather)
        throw new Error(`DivineAllegiance.apply() without GatherDamage`);
      const total = getTotalDamage(gather);
      if (total > 0) {
        gather.multiplier.add("zero", this);
        await g.damage(this, "unpreventable", { target: actor }, [
          ["unpreventable", total]
        ]);
      }
    }
  };
  var DivineAllegiance = new SimpleFeature(
    "Divine Allegiance",
    `Starting at 7th level, when a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new DivineAllegianceAction(g, who));
      });
      g.events.on("GatherDamage", ({ detail }) => {
        const action = new DivineAllegianceAction(g, me, detail);
        const config = { target: detail.target };
        if (checkConfig(g, action, config))
          detail.interrupt.add(
            new YesNoChoice(
              me,
              DivineAllegiance,
              "Divine Allegiance",
              "...",
              Priority_default.Late,
              () => g.act(action, config),
              void 0,
              () => getTotalDamage(detail) > 0
            ).setDynamicText(
              () => `${detail.target.name} is about to take ${getTotalDamage(detail)} damage. Should ${action.actor.name} use their reaction to take it for them?`
            )
          );
      });
    }
  );
  var unyieldingSpiritConditions = coSet("Paralyzed", "Stunned");
  var UnyieldingSpirit = new SimpleFeature(
    "Unyielding Spirit",
    `Starting at 15th level, you have advantage on saving throws to avoid becoming paralyzed or stunned.`,
    (g, me) => {
      g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
        if (who === me && (config == null ? void 0 : config.conditions) && intersects(config.conditions, unyieldingSpiritConditions))
          diceType.add("advantage", UnyieldingSpirit);
      });
    }
  );
  var ExaltedChampion = notImplementedFeature(
    "Exalted Champion",
    `At 20th level, your presence on the field of battle is an inspiration to those dedicated to your cause. You can use your action to gain the following benefits for 1 hour:
- You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.
- Your allies have advantage on death saving throws while within 30 feet of you.
- You have advantage on Wisdom saving throws, as do your allies within 30 feet of you.

This effect ends early if you are incapacitated or die. Once you use this feature, you can't use it again until you finish a long rest.`
  );
  var Crown = {
    className: "Paladin",
    name: "Oath of the Crown",
    features: /* @__PURE__ */ new Map([
      [3, [CrownOathSpells, ChampionChallenge, TurnTheTide]],
      [7, [DivineAllegiance]],
      [15, [UnyieldingSpirit]],
      [20, [ExaltedChampion]]
    ])
  };
  var Crown_default = Crown;

  // src/img/act/sacred-weapon.svg
  var sacred_weapon_default = "./sacred-weapon-FZX73WYV.svg";

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
  var SacredWeaponAction = class extends AbstractSelfAction {
    constructor(g, actor) {
      super(
        g,
        actor,
        "Channel Divinity: Sacred Weapon",
        "implemented",
        {
          weapon: new ChoiceResolver(
            g,
            "Weapon",
            actor.weapons.filter((weapon) => weapon.category !== "natural").map((value) => makeChoice(value, value.name))
          )
        },
        {
          time: "action",
          resources: [[ChannelDivinityResource, 1]],
          icon: SacredWeaponIcon,
          subIcon: PaladinIcon,
          description: `As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.
      You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.`
        }
      );
    }
    check(config, ec) {
      if (this.actor.hasEffect(SacredWeaponEffect))
        ec.add("already active", this);
      return super.check(config, ec);
    }
    async applyEffect({ weapon }) {
      this.g.text(
        new MessageBuilder().co(this.actor).nosp().text("'s ").it(weapon).text(" glows with holy light.")
      );
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
  var TurnTheUnholyAction = class extends TurnUndeadAction {
    constructor(g, actor) {
      super(g, actor, ["fiend", "undead"], PaladinSpellcasting);
      this.name = "Turn the Unholy";
      this.subIcon = PaladinIcon;
      this.description = `As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.

    A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`;
    }
  };
  var TurnTheUnholy = new SimpleFeature(
    "Channel Divinity: Turn the Unholy",
    `As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
    (g, me) => {
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(new TurnTheUnholyAction(g, me));
      });
    }
  );
  var AuraOfDevotion = new SimpleFeature(
    "Aura of Devotion",
    `Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`,
    (g, me) => {
      const aura = getAuraOfProtection(me);
      if (!aura)
        return;
      g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
        var _a;
        if (who.side === me.side && ((_a = config == null ? void 0 : config.conditions) == null ? void 0 : _a.has("Charmed")) && aura.isAffecting(who))
          success.add("fail", AuraOfDevotion);
      });
    }
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
  var DevotionOathSpellsList = [
    { level: 3, spell: "protection from evil and good" },
    { level: 3, spell: "sanctuary" },
    { level: 5, spell: "lesser restoration" },
    { level: 5, spell: "zone of truth" },
    { level: 9, spell: "beacon of hope" },
    { level: 9, spell: "dispel magic" },
    { level: 13, spell: "freedom of movement" },
    { level: 13, spell: "guardian of faith" },
    { level: 17, spell: "commune" },
    { level: 17, spell: "flame strike" }
  ];
  var DevotionOathSpells = bonusSpellsFeature(
    "Oath Spells",
    `You gain oath spells at the paladin levels listed.`,
    "Paladin",
    PaladinSpellcasting,
    DevotionOathSpellsList,
    "Paladin"
  );
  var Devotion = {
    className: "Paladin",
    name: "Oath of Devotion",
    features: /* @__PURE__ */ new Map([
      [3, [DevotionOathSpells, SacredWeapon_default, TurnTheUnholy]],
      [7, [AuraOfDevotion]],
      [15, [PurityOfSpirit]],
      [20, [HolyNimbus]]
    ])
  };
  var Devotion_default = Devotion;

  // src/classes/rogue/Scout/index.ts
  var SkirmisherAction = class extends AbstractSelfAction {
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
    async applyEffect() {
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
              Priority_default.Late,
              () => g.act(action, config)
            )
          );
      });
    }
  );
  var Survivalist = new SimpleFeature(
    "Survivalist",
    `When you choose this archetype at 3rd level, you gain proficiency in the Nature and Survival skills if you don't already have it. Your proficiency bonus is doubled for any ability check you make that uses either of those proficiencies.`,
    (g, me) => {
      me.addProficiency("Nature", "expertise");
      me.addProficiency("Survival", "expertise");
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
  var Scout2 = {
    name: "Scout",
    className: "Rogue",
    features: /* @__PURE__ */ new Map([
      [3, [Skirmisher, Survivalist]],
      [9, [SuperiorMobility]],
      [13, [AmbushMaster]],
      [17, [SuddenStrike]]
    ])
  };
  var Scout_default = Scout2;

  // src/classes/rogue/Swashbuckler/index.ts
  var FancyFootworkEffect = new Effect(
    "Fancy Footwork",
    "turnStart",
    (g) => {
      g.events.on("CheckAction", ({ detail: { action, config, error } }) => {
        const ffConfig = action.actor.getEffectConfig(FancyFootworkEffect);
        if (action instanceof OpportunityAttack && ffConfig && config.target === (ffConfig == null ? void 0 : ffConfig.target))
          error.add("unable", FancyFootworkEffect);
      });
    }
  );
  var FancyFootwork = new SimpleFeature(
    "Fancy Footwork",
    `When you choose this archetype at 3rd level, you learn how to land a strike and then slip away without reprisal. During your turn, if you make a melee attack against a creature, that creature can't make opportunity attacks against you for the rest of your turn.`,
    (g, me) => {
      g.events.on("AfterAttack", ({ detail: { attack, interrupt, target } }) => {
        if (attack.roll.type.who === me && attack.roll.type.tags.has("melee"))
          interrupt.add(
            new EvaluateLater(
              me,
              FancyFootwork,
              Priority_default.Normal,
              () => target.addEffect(
                FancyFootworkEffect,
                { duration: 1, target: me },
                me
              )
            )
          );
      });
      g.events.on("TurnEnded", ({ detail: { who, interrupt } }) => {
        var _a;
        if (who === me) {
          for (const other of g.combatants)
            if (((_a = other.getEffectConfig(FancyFootworkEffect)) == null ? void 0 : _a.target) === me)
              interrupt.add(
                new EvaluateLater(
                  me,
                  FancyFootwork,
                  Priority_default.Normal,
                  () => other.removeEffect(FancyFootworkEffect)
                )
              );
        }
      });
    }
  );
  var RakishAudacity = new SimpleFeature(
    "Rakish Audacity",
    `Starting at 3rd level, your confidence propels you into battle. You can give yourself a bonus to your initiative rolls equal to your Charisma modifier.

You also gain an additional way to use your Sneak Attack; you don't need advantage on your attack roll to use Sneak Attack against a creature if you are within 5 feet of it, no other creatures are within 5 feet of you, and you don't have disadvantage on the attack roll. All the other rules for Sneak Attack still apply to you.`,
    (g, me) => {
      g.events.on("GetInitiative", ({ detail: { who, bonus } }) => {
        if (who === me && me.cha.modifier > 0)
          bonus.add(me.cha.modifier, RakishAudacity);
      });
      addSneakAttackMethod(me, (g2, target, attack) => {
        const inRange = distance(me, target) <= 5;
        const justUs = Array.from(g2.combatants).filter((other) => distance(me, other) <= 5).length === 2;
        const noDisadvantage = !attack.pre.diceType.getValues().includes("disadvantage");
        return inRange && justUs && noDisadvantage;
      });
    }
  );
  var Panache = notImplementedFeature(
    "Panache",
    `At 9th level, your charm becomes extraordinarily beguiling. As an action, you can make a Charisma (Persuasion) check contested by a creature's Wisdom (Insight) check. The creature must be able to hear you, and the two of you must share a language.

If you succeed on the check and the creature is hostile to you, it has disadvantage on attack rolls against targets other than you and can't make opportunity attacks against targets other than you. This effect lasts for 1 minute, until one of your companions attacks the target or affects it with a spell, or until you and the target are more than 60 feet apart.

If you succeed on the check and the creature isn't hostile to you, it is charmed by you for 1 minute. While charmed, it regards you as a friendly acquaintance. This effect ends immediately if you or your companions do anything harmful to it.`
  );
  var ElegantManeuver = notImplementedFeature(
    "Elegant Maneuver",
    `Starting at 13th level, you can use a bonus action on your turn to gain advantage on the next Dexterity (Acrobatics) or Strength (Athletics) check you make during the same turn.`
  );
  var MasterDuelist = notImplementedFeature(
    "Master Duelist",
    `Beginning at 17th level, your mastery of the blade lets you turn failure into success in combat. If you miss with an attack roll, you can roll it again with advantage. Once you do so, you can't use this feature again until you finish a short or long rest.`
  );
  var Swashbuckler = {
    name: "Swashbuckler",
    className: "Rogue",
    features: /* @__PURE__ */ new Map([
      [3, [FancyFootwork, RakishAudacity]],
      [9, [Panache]],
      [13, [ElegantManeuver]],
      [17, [MasterDuelist]]
    ])
  };
  var Swashbuckler_default = Swashbuckler;

  // src/classes/warlock/Fiend/index.ts
  var FiendExpandedSpellList = [
    { level: 1, spell: "burning hands" },
    { level: 1, spell: "command" },
    { level: 2, spell: "blindness/deafness" },
    { level: 2, spell: "scorching ray" },
    { level: 3, spell: "fireball" },
    { level: 3, spell: "stinking cloud" },
    { level: 4, spell: "fire shield" },
    { level: 4, spell: "wall of fire" },
    { level: 5, spell: "flame strike" },
    { level: 5, spell: "hallow" }
  ];
  var ExpandedSpellList = bonusSpellsFeature(
    "Expanded Spell List",
    `The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you.`,
    "Warlock",
    WarlockPactMagic,
    FiendExpandedSpellList,
    "Warlock"
  );
  var DarkOnesBlessing = new SimpleFeature(
    "Dark One's Blessing",
    `Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).`,
    (g, me) => {
      g.events.on(
        "CombatantDamaged",
        ({ detail: { attacker, who, interrupt } }) => {
          if (attacker === me && who.side !== me.side && who.hp < 1)
            interrupt.add(
              new EvaluateLater(me, DarkOnesBlessing, Priority_default.Late, async () => {
                if (who.hp < 1) {
                  const amount = Math.max(
                    1,
                    me.cha.modifier + me.getClassLevel("Warlock", 1)
                  );
                  await g.giveTemporaryHP(me, amount, DarkOnesBlessing);
                }
              })
            );
        }
      );
    }
  );
  var DarkOnesOwnLuck = notImplementedFeature(
    "Dark One's Own Luck",
    `Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur.

Once you use this feature, you can't use it again until you finish a short or long rest.`
  );
  var FiendishResilience = notImplementedFeature(
    "Fiendish Resilience",
    `Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.`
  );
  var HurlThroughHell = notImplementedFeature(
    "Hurl Through Hell",
    `Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape.

At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience.

Once you use this feature, you can't use it again until you finish a long rest.`
  );
  var Fiend = {
    name: "The Fiend",
    className: "Warlock",
    features: /* @__PURE__ */ new Map([
      [1, [ExpandedSpellList, DarkOnesBlessing]],
      [6, [DarkOnesOwnLuck]],
      [10, [FiendishResilience]],
      [14, [HurlThroughHell]]
    ])
  };
  var Fiend_default = Fiend;

  // src/events/MultiListChoiceEvent.ts
  var MultiListChoiceEvent = class extends CustomEvent {
    constructor(detail) {
      super("MultiListChoice", { detail });
    }
  };

  // src/interruptions/MultiListChoice.ts
  var MultiListChoice = class {
    constructor(who, source, title, text, priority, items, minimum, maximum = items.length, chosen) {
      this.who = who;
      this.source = source;
      this.title = title;
      this.text = text;
      this.priority = priority;
      this.items = items;
      this.minimum = minimum;
      this.maximum = maximum;
      this.chosen = chosen;
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
        ({ detail: { who, spell, level, affected, interrupt } }) => {
          if (who === me && spell.school === "Evocation")
            interrupt.add(
              new MultiListChoice(
                me,
                SculptSpells,
                "Sculpt Spells",
                `Pick combatants who will be somewhat protected from your spell.`,
                Priority_default.Normal,
                Array.from(affected, (value) => ({
                  value,
                  label: value.name
                })).filter((choice) => g.canSee(me, choice.value)),
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

  // src/data/allPCSubclasses.ts
  var allPCSubclasses = {
    // Barbarian
    Berserker: Berserker_default,
    // Druid
    Land: Land_default,
    Shepherd: Shepherd_default,
    // Paladin
    Crown: Crown_default,
    Devotion: Devotion_default,
    // Rogue
    Swashbuckler: Swashbuckler_default,
    Scout: Scout_default,
    // Warlock
    Fiend: Fiend_default,
    // Wizard
    Evocation: Evocation_default
  };
  var allPCSubclasses_default = allPCSubclasses;

  // src/data/initialisePC.ts
  function initialisePC(g, t) {
    var _a, _b, _c, _d;
    const pc = new PC(g, t.name, t.tokenUrl);
    const addConfigs = (list = {}) => objectEntries(list).forEach(([key, value]) => pc.configs.set(key, value));
    const addLanguages = (list = []) => list.forEach((lang) => pc.languages.add(lang));
    const addProfs = (list = []) => list.forEach((prof) => pc.addProficiency(prof, "proficient"));
    pc.setAbilityScores(...t.abilities);
    pc.setRace(allPCRaces_default[t.race.name]);
    for (const ability of (_a = t.race.abilities) != null ? _a : [])
      pc[ability].score++;
    addConfigs(t.race.configs);
    addLanguages(t.race.languages);
    pc.setBackground(allBackgrounds_default[t.background.name]);
    addLanguages(t.background.languages);
    addProfs(t.background.proficiencies);
    for (const {
      class: cl,
      subclass,
      configs,
      hpRoll,
      proficiencies
    } of t.levels) {
      if (subclass) {
        const sub = allPCSubclasses_default[subclass];
        if (sub.className !== cl)
          throw new Error(`Invalid subclass ${subclass} on class ${cl}`);
        pc.addSubclass(sub);
      }
      pc.addClassLevel(allPCClasses_default[cl], hpRoll);
      addProfs(proficiencies);
      addConfigs(configs);
    }
    addProfs(t.proficiencies);
    for (const feat of (_b = t.feats) != null ? _b : [])
      pc.addFeature(allFeatures_default[feat]);
    addConfigs(t.configs);
    addLanguages(t.languages);
    for (const { name, equip, attune, enchantments, quantity } of t.items) {
      const item = allItems_default[name](g);
      if (attune)
        pc.attunements.add(item);
      for (const name2 of enchantments != null ? enchantments : []) {
        const enchantment = allEnchantments_default[name2];
        item.addEnchantment(enchantment);
      }
      pc.addToInventory(item, quantity);
      if (equip)
        pc.don(item);
    }
    const getSpell = (name) => ({ name, spell: allSpells_default[name] });
    for (const { name, spell } of ((_c = t.known) != null ? _c : []).map(getSpell)) {
      if (!spell)
        spellImplementationWarning({ name, status: "missing" }, pc);
      else
        pc.knownSpells.add(spell);
    }
    for (const { name, spell } of ((_d = t.prepared) != null ? _d : []).map(getSpell)) {
      if (!spell) {
        spellImplementationWarning({ name, status: "missing" }, pc);
        continue;
      }
      pc.knownSpells.add(spell);
      pc.preparedSpells.add(spell);
    }
    return pc;
  }

  // src/data/BattleTemplate.ts
  function initialiseFromTemplate(g, { combatants }) {
    for (const {
      type,
      name,
      side,
      x,
      y,
      initiative,
      alignment,
      config
    } of combatants) {
      const who = type === "pc" ? initialisePC(g, allPCs_default[name]) : initialiseMonster(
        g,
        allMonsters_default[name],
        config
      );
      if (typeof side === "number")
        who.side = side;
      g.place(who, x, y);
      if (typeof initiative === "number") {
        g.dice.force(initiative, { type: "initiative", who });
        g.dice.force(initiative, { type: "initiative", who });
      }
      if (alignment) {
        const [lc, ge] = alignment;
        who.alignLC = lc;
        who.alignGE = ge;
      }
    }
    return g.start();
  }

  // src/ui/hooks/useMenu.ts
  function useMenu(caption, clicked) {
    const [isShown, showMenu, hideMenu] = useBool(false);
    const [, setContext] = (0, import_hooks.useState)();
    const hide = (0, import_hooks.useCallback)(() => {
      setContext(void 0);
      hideMenu();
    }, [hideMenu]);
    const onClick = (0, import_hooks.useCallback)(
      (item) => {
        hideMenu();
        setContext((context) => {
          clicked(item, context);
          return void 0;
        });
      },
      [clicked, hideMenu]
    );
    const [props, setProps] = (0, import_hooks.useState)({
      x: NaN,
      y: NaN,
      items: [],
      caption,
      onClick
    });
    const show = (0, import_hooks.useCallback)(
      (e2, items, ctx) => {
        showMenu();
        setProps({ x: e2.clientX, y: e2.clientY, items, caption, onClick });
        setContext(ctx);
      },
      [caption, onClick, showMenu]
    );
    return {
      isShown,
      props,
      show,
      hide
    };
  }

  // src/ui/utils/icons.ts
  var getIconUrl = (item) => item.icon && item.icon.url;
  function getAllIcons(g) {
    return new Set(
      Array.from(g.combatants.keys()).flatMap((who) => [
        ...who.inventory.keys(),
        ...who.equipment,
        ...who.knownSpells,
        ...who.preparedSpells,
        ...who.spellcastingMethods
      ]).map(getIconUrl).filter(isDefined)
    );
  }

  // src/ui/utils/state.ts
  var actionAreas = (0, import_signals.signal)(
    void 0
  );
  var activeCombatantId = (0, import_signals.signal)(NaN);
  var activeCombatant = (0, import_signals.computed)(
    () => allCombatants.value.find((u2) => u2.id === activeCombatantId.value)
  );
  var aiEvaluation = (0, import_signals.signal)(void 0);
  var allActions = (0, import_signals.signal)([]);
  var allCombatants = (0, import_signals.signal)([]);
  var allEffects = (0, import_signals.signal)([]);
  var canDragUnits = (0, import_signals.signal)(false);
  var canMoveDirections = (0, import_signals.signal)([]);
  var chooseFromList = (0, import_signals.signal)(void 0);
  var chooseManyFromList = (0, import_signals.signal)(
    void 0
  );
  var chooseYesNo = (0, import_signals.signal)(void 0);
  var moveBounds = (0, import_signals.signal)(void 0);
  var moveHandler = (0, import_signals.signal)(void 0);
  var movingCombatantId = (0, import_signals.signal)(NaN);
  var movingCombatant = (0, import_signals.computed)(
    () => allCombatants.value.find((u2) => u2.id === movingCombatantId.value)
  );
  var scale = (0, import_signals.signal)(20);
  var showSideHP = (0, import_signals.signal)([0]);
  var showSideUnderlay = (0, import_signals.signal)(false);
  var teleportInfo = (0, import_signals.signal)(void 0);
  var wantsCombatant = (0, import_signals.signal)(void 0);
  var wantsPoint = (0, import_signals.signal)(void 0);
  var uiState = {
    actionAreas,
    activeCombatantId,
    activeCombatant,
    aiEvaluation,
    allActions,
    allCombatants,
    allEffects,
    canDragUnits,
    canMoveDirections,
    chooseFromList,
    chooseManyFromList,
    chooseYesNo,
    moveBounds,
    moveHandler,
    movingCombatantId,
    movingCombatant,
    scale,
    showSideHP,
    showSideUnderlay,
    teleportInfo,
    wantsCombatant,
    wantsPoint
  };
  if (true)
    window.state = uiState;
  var resetAllState = (continuation) => (0, import_signals.batch)(() => {
    actionAreas.value = [];
    activeCombatantId.value = NaN;
    aiEvaluation.value = void 0;
    allActions.value = [];
    allCombatants.value = [];
    allEffects.value = [];
    canDragUnits.value = false;
    chooseFromList.value = void 0;
    chooseManyFromList.value = void 0;
    chooseYesNo.value = void 0;
    moveBounds.value = void 0;
    moveHandler.value = void 0;
    movingCombatantId.value = NaN;
    showSideHP.value = [0];
    showSideUnderlay.value = false;
    teleportInfo.value = void 0;
    wantsCombatant.value = void 0;
    wantsPoint.value = void 0;
    continuation == null ? void 0 : continuation();
  });

  // src/ui/utils/SVGCache.ts
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

  // src/ui/utils/types.ts
  function getUnitData(who) {
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
      position: who.position,
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
      this.priority = Priority_default.UI;
    }
  };

  // src/ui/components/common.module.scss
  var common_module_default = {
    "damageList": "_damageList_f4xy4_1",
    "healList": "_healList_f4xy4_8",
    "panel": "_panel_f4xy4_15"
  };

  // src/ui/components/IconButton.module.scss
  var IconButton_module_default = {
    "main": "_main_13fqt_1",
    "image": "_image_13fqt_8",
    "sub": "_sub_13fqt_9"
  };

  // node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
  var import_preact2 = __toESM(require_preact());
  var import_preact3 = __toESM(require_preact());
  var f = 0;
  var i = Array.isArray;
  function u(e2, t, n, o, i2, u2) {
    var a, c, p = {};
    for (c in t)
      "ref" == c ? a = t[c] : p[c] = t[c];
    var l = { type: e2, props: p, key: n, ref: a, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a = e2.defaultProps))
      for (c in a)
        void 0 === p[c] && (p[c] = a[c]);
    return import_preact2.options.vnode && import_preact2.options.vnode(l), l;
  }

  // src/ui/components/SVGIcon.tsx
  function SVGIcon({ className, color, size, src }) {
    const cache = (0, import_hooks.useContext)(SVGCacheContext);
    const ref = (0, import_hooks.useRef)(null);
    (0, import_hooks.useEffect)(() => {
      void cache.get(src).then((html) => {
        if (ref.current)
          ref.current.innerHTML = html;
        return html;
      });
    }, [cache, src]);
    return /* @__PURE__ */ u(
      "div",
      {
        ref,
        className,
        "aria-hidden": true,
        style: { color, width: size, height: size }
      }
    );
  }

  // src/ui/components/IconButton.tsx
  function IconButton({
    onClick,
    alt,
    disabled,
    icon,
    size = 48,
    sub,
    subSize = 24
  }) {
    return /* @__PURE__ */ u(
      "button",
      {
        className: IconButton_module_default.main,
        disabled,
        style: { width: size, height: size },
        onClick,
        title: alt,
        "aria-label": alt,
        children: [
          /* @__PURE__ */ u(
            SVGIcon,
            {
              className: IconButton_module_default.image,
              src: icon.url,
              size,
              color: icon.colour
            }
          ),
          sub && /* @__PURE__ */ u(
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

  // src/ui/utils/classnames.ts
  function classnames(...items) {
    const names = [];
    for (const item of items) {
      if (!isDefined(item))
        continue;
      else if (typeof item === "string")
        names.push(item);
      else {
        for (const [key, value] of objectEntries(item)) {
          if (value)
            names.push(key);
        }
      }
    }
    return names.join(" ");
  }

  // src/ui/components/Labelled.module.scss
  var Labelled_module_default = {
    "label": "_label_ehxn3_1"
  };

  // src/ui/components/Labelled.tsx
  function Labelled({
    children,
    label,
    labelClass,
    contentsClass,
    role = "group"
  }) {
    const labelId = (0, import_hooks.useId)();
    return /* @__PURE__ */ u("div", { className: Labelled_module_default.main, role, "aria-labelledby": labelId, children: [
      /* @__PURE__ */ u(
        "div",
        {
          id: labelId,
          className: classnames(Labelled_module_default.label, labelClass),
          "aria-hidden": "true",
          children: label
        }
      ),
      /* @__PURE__ */ u("div", { className: classnames(Labelled_module_default.contents, contentsClass), children })
    ] });
  }

  // src/ui/components/ActiveUnitPanel.tsx
  var ActionTypes = [
    "Attacks",
    "Actions",
    "Bonus Actions",
    "Other Actions",
    "Reactions",
    "Out of Combat Actions",
    "Item Interactions"
  ];
  var niceTime = {
    action: "Actions",
    "bonus action": "Bonus Actions",
    long: "Out of Combat Actions",
    reaction: "Reactions",
    "item interaction": "Item Interactions"
  };
  function splitActions(actionList) {
    var _a;
    const categories = /* @__PURE__ */ new Map();
    for (const action of actionList) {
      const time = action.getTime({});
      const label = action.tags.has("costs attack") ? "Attacks" : time ? niceTime[time] : "Other Actions";
      const category = (_a = categories.get(label)) != null ? _a : [];
      category.push(action);
      if (!categories.has(label))
        categories.set(label, category);
    }
    return Array.from(categories, ([label, actions]) => ({
      label,
      actions
    })).sort(
      (a, b) => ActionTypes.indexOf(a.label) - ActionTypes.indexOf(b.label)
    );
  }
  function ActiveUnitPanel({
    onChooseAction,
    onPass,
    who
  }) {
    const actionCategories = splitActions(allActions.value);
    return /* @__PURE__ */ u("aside", { className: common_module_default.panel, "aria-label": "Active Unit", children: [
      /* @__PURE__ */ u(Labelled, { label: "Current Turn", children: who.name }),
      /* @__PURE__ */ u("button", { onClick: onPass, children: "End Turn" }),
      /* @__PURE__ */ u("hr", {}),
      actionCategories.map(({ label, actions }) => /* @__PURE__ */ u(Labelled, { label, children: actions.map(
        (action) => action.icon ? /* @__PURE__ */ u(
          IconButton,
          {
            onClick: () => onChooseAction(action),
            icon: action.icon,
            sub: action.subIcon,
            alt: action.name
          },
          action.name
        ) : /* @__PURE__ */ u(
          "button",
          {
            onClick: () => onChooseAction(action),
            disabled: action.status === "missing",
            style: {
              borderColor: action.status === "incomplete" ? "red" : void 0
            },
            children: action.name
          },
          action.name
        )
      ) }, label))
    ] });
  }

  // src/ui/hooks/usePanning.ts
  function usePanning(onPan, onHover) {
    const [isPanning, setIsPanning] = (0, import_hooks.useState)(false);
    const [panStartCoords, setPanStartCoords] = (0, import_hooks.useState)({ x: 0, y: 0 });
    const onMouseDown = (0, import_hooks.useCallback)((e2) => {
      if (e2.button === 2) {
        setIsPanning(true);
        setPanStartCoords({ x: e2.clientX, y: e2.clientY });
      }
    }, []);
    const onMouseEnter = (0, import_hooks.useCallback)((e2) => {
      if (!e2.button)
        setIsPanning(false);
    }, []);
    const onMouseMove = (0, import_hooks.useCallback)(
      (e2) => {
        if (isPanning) {
          const deltaX = e2.clientX - panStartCoords.x;
          const deltaY = e2.clientY - panStartCoords.y;
          onPan(-deltaX, -deltaY);
          setPanStartCoords({ x: e2.clientX, y: e2.clientY });
        } else
          onHover == null ? void 0 : onHover(e2);
      },
      [isPanning, onHover, onPan, panStartCoords.x, panStartCoords.y]
    );
    const onMouseUp = (0, import_hooks.useCallback)(() => {
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

  // src/ui/components/BackgroundImage.module.scss
  var BackgroundImage_module_default = {
    "image": "_image_kmb56_1"
  };

  // src/ui/components/BackgroundImage.tsx
  function BackgroundImage({
    image: { src, x, y, width, height, zIndex },
    scaleValue
  }) {
    const style = (0, import_hooks.useMemo)(
      () => ({
        left: x * scaleValue,
        top: y * scaleValue,
        width: width ? width * MapSquareSize * scaleValue : void 0,
        height: height ? height * MapSquareSize * scaleValue : void 0,
        zIndex
      }),
      [height, scaleValue, width, x, y, zIndex]
    );
    return /* @__PURE__ */ u(
      "img",
      {
        alt: "",
        role: "presentation",
        src,
        className: BackgroundImage_module_default.image,
        style
      }
    );
  }

  // src/ui/components/Battlefield.module.scss
  var Battlefield_module_default = {
    "main": "_main_1bit5_1",
    "panning": "_panning_1bit5_11"
  };

  // src/ui/components/BattlefieldEffect.module.scss
  var BattlefieldEffect_module_default = {
    "main": "_main_1azly_1",
    "top": "_top_1azly_9",
    "square": "_square_1azly_13"
  };

  // src/ui/components/BattlefieldEffect.tsx
  function getAuraColour(tags) {
    if (tags.has("heavily obscured"))
      return "silver";
    if (tags.has("holy"))
      return "yellow";
    if (tags.has("plants"))
      return "green";
    if (tags.has("profane"))
      return "purple";
    if (tags.has("dim light"))
      return "skyblue";
  }
  function AffectedSquare({
    point,
    scaleValue,
    tint,
    top = false
  }) {
    const style = (0, import_hooks.useMemo)(
      () => ({
        left: point.x * scaleValue,
        top: point.y * scaleValue,
        width: scaleValue * MapSquareSize,
        height: scaleValue * MapSquareSize,
        backgroundColor: tint
      }),
      [point.x, point.y, scaleValue, tint]
    );
    return /* @__PURE__ */ u(
      "div",
      {
        className: classnames(BattlefieldEffect_module_default.square, { [BattlefieldEffect_module_default.top]: top }),
        style
      }
    );
  }
  function BattlefieldEffect({
    name = "Pending",
    scaleValue,
    shape,
    tags = /* @__PURE__ */ new Set(),
    top: onTop = false,
    tint = getAuraColour(tags)
  }) {
    const { points, left, top } = (0, import_hooks.useMemo)(() => {
      const points2 = resolveArea(shape);
      const { x: left2, y: top2 } = points2.average(scaleValue);
      return { points: points2, left: left2, top: top2 };
    }, [scaleValue, shape]);
    const squares = Array.from(points, (p, key) => /* @__PURE__ */ u(
      AffectedSquare,
      {
        point: p,
        tint: tint != null ? tint : "silver",
        top: onTop,
        scaleValue
      },
      key
    ));
    return /* @__PURE__ */ u(import_preact3.Fragment, { children: [
      /* @__PURE__ */ u(
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

  // src/ui/components/Unit.module.scss
  var Unit_module_default = {
    "main": "_main_15bsq_1",
    "moving": "_moving_15bsq_11",
    "token": "_token_15bsq_15",
    "icons": "_icons_15bsq_21"
  };

  // src/img/ui/missing-icon.svg
  var missing_icon_default = "./missing-icon-Y2QNJ6M4.svg";

  // src/ui/components/UnitEffectIcon.tsx
  function UnitEffectIcon({ effect }) {
    var _a, _b, _c;
    return /* @__PURE__ */ u("div", { title: effect.name, children: /* @__PURE__ */ u(
      SVGIcon,
      {
        src: (_b = (_a = effect.icon) == null ? void 0 : _a.url) != null ? _b : missing_icon_default,
        color: (_c = effect.icon) == null ? void 0 : _c.colour,
        size: 25
      }
    ) });
  }

  // src/ui/components/UnitHP.module.scss
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

  // src/ui/components/UnitHP.tsx
  function UnitDeathSaves({ u: u2 }) {
    return /* @__PURE__ */ u("div", { className: classnames(UnitHP_module_default.hp, UnitHP_module_default.down), children: /* @__PURE__ */ u("div", { className: UnitHP_module_default.text, children: [
      "Down: ",
      /* @__PURE__ */ u("span", { className: UnitHP_module_default.success, children: u2.deathSaveSuccesses }),
      " /",
      " ",
      /* @__PURE__ */ u("span", { className: UnitHP_module_default.failure, children: u2.deathSaveFailures })
    ] }) });
  }
  function UnitStable() {
    return /* @__PURE__ */ u("div", { className: classnames(UnitHP_module_default.hp, UnitHP_module_default.down), children: /* @__PURE__ */ u("span", { className: UnitHP_module_default.text, children: "Stable" }) });
  }
  function UnitDetailedHP({ u: u2 }) {
    if (u2.effects.find((e2) => e2.effect === Stable))
      return /* @__PURE__ */ u(UnitStable, {});
    if (u2.hp <= 0)
      return /* @__PURE__ */ u(UnitDeathSaves, { u: u2 });
    const width = `${u2.hp * 100 / u2.hpMax}%`;
    return /* @__PURE__ */ u("div", { className: classnames(UnitHP_module_default.hp, UnitHP_module_default.detailed), children: [
      /* @__PURE__ */ u("span", { className: UnitHP_module_default.detailedBar, style: { width } }),
      /* @__PURE__ */ u("span", { className: UnitHP_module_default.text, children: [
        u2.hp,
        u2.temporaryHP > 0 ? "+" : "",
        " / ",
        u2.hpMax
      ] })
    ] });
  }
  var BriefData = {
    OK: "ok",
    Bloody: "bloody",
    Down: "down"
  };
  function UnitBriefHP({ u: u2 }) {
    const ratio = u2.hp / u2.hpMax;
    const status = ratio >= 0.5 ? "OK" : ratio > 0 ? "Bloody" : "Down";
    return /* @__PURE__ */ u(
      "div",
      {
        className: classnames(UnitHP_module_default.hp, UnitHP_module_default.brief, UnitHP_module_default[BriefData[status]]),
        children: /* @__PURE__ */ u("span", { className: UnitHP_module_default.text, children: [
          status,
          u2.temporaryHP > 0 ? "+" : ""
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

  // src/ui/components/UnitMoveButton.module.scss
  var UnitMoveButton_module_default = {
    "main": "_main_1gd19_5",
    "moveE": "_moveE_1gd19_21",
    "moveSE": "_moveSE_1gd19_27",
    "moveS": "_moveS_1gd19_27",
    "moveSW": "_moveSW_1gd19_38",
    "moveW": "_moveW_1gd19_43",
    "moveNW": "_moveNW_1gd19_49",
    "moveN": "_moveN_1gd19_49",
    "moveNE": "_moveNE_1gd19_60"
  };

  // src/ui/components/UnitMoveButton.tsx
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
  function UnitMoveButton({ onClick, type }) {
    const { className, iconUrl, label } = (0, import_hooks.useMemo)(
      () => buttonTypes[type],
      [type]
    );
    const clicked = (0, import_hooks.useCallback)(
      (e2) => {
        e2.stopPropagation();
        onClick(type);
      },
      [type, onClick]
    );
    return /* @__PURE__ */ u(
      "button",
      {
        disabled: !canMoveDirections.value.includes(type),
        className: classnames(UnitMoveButton_module_default.main, className),
        onClick: clicked,
        "aria-label": label,
        children: /* @__PURE__ */ u(SVGIcon, { src: iconUrl, size: 26 })
      }
    );
  }

  // src/ui/components/Unit.tsx
  var allyBg = "rgba(0, 0, 255, 0.25)";
  var enemyBg = "rgba(255, 0, 0, 0.25)";
  var otherBg = "rgba(0, 255, 0, 0.25)";
  function Unit({ isMoving, onClick, onMove, u: u2 }) {
    const containerStyle = {
      left: u2.position.x * scale.value,
      top: u2.position.y * scale.value,
      width: u2.sizeInUnits * scale.value,
      height: u2.sizeInUnits * scale.value
    };
    const tokenStyle = {
      width: u2.sizeInUnits * scale.value,
      height: u2.sizeInUnits * scale.value,
      backgroundColor: showSideUnderlay.value ? u2.side === 0 ? allyBg : u2.side === 1 ? enemyBg : otherBg : void 0
    };
    const clicked = (0, import_hooks.useCallback)(
      (e2) => onClick == null ? void 0 : onClick(u2.who, e2),
      [onClick, u2]
    );
    const moved = (0, import_hooks.useCallback)(
      (dir) => onMove == null ? void 0 : onMove(u2.who, dir),
      [onMove, u2]
    );
    const onDragStart = (0, import_hooks.useCallback)(
      (e2) => {
        var _a;
        (_a = e2.dataTransfer) == null ? void 0 : _a.setData("unit/id", String(u2.id));
      },
      [u2.id]
    );
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      /* @__PURE__ */ u(
        "div",
        {
          className: classnames(Unit_module_default.main, { [Unit_module_default.moving]: isMoving }),
          style: containerStyle,
          title: u2.name,
          onClick: clicked,
          draggable: canDragUnits.value,
          onDragStart: canDragUnits.value ? onDragStart : void 0,
          children: [
            /* @__PURE__ */ u(
              "img",
              {
                className: Unit_module_default.token,
                style: tokenStyle,
                alt: u2.name,
                src: u2.img
              }
            ),
            isMoving && /* @__PURE__ */ u(import_preact3.Fragment, { children: [
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "east" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "southeast" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "south" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "southwest" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "west" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "northwest" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "north" }),
              /* @__PURE__ */ u(UnitMoveButton, { onClick: moved, type: "northeast" })
            ] }),
            showSideHP.value.includes(u2.side) ? /* @__PURE__ */ u(UnitDetailedHP, { u: u2 }) : /* @__PURE__ */ u(UnitBriefHP, { u: u2 }),
            /* @__PURE__ */ u("div", { className: Unit_module_default.icons, children: u2.effects.map((effect, key) => /* @__PURE__ */ u(UnitEffectIcon, { effect }, key)) })
          ]
        }
      )
    );
  }

  // src/ui/components/Battlefield.tsx
  function Battlefield({
    onClickBattlefield,
    onClickCombatant,
    onDragCombatant,
    onMoveCombatant,
    showHoveredTile,
    images = []
  }) {
    var _a;
    const [offset, setOffset] = (0, import_hooks.useState)({ x: 0, y: 0 });
    const [hover, setHover] = (0, import_hooks.useState)();
    const convertCoordinate = (0, import_hooks.useCallback)(
      (e2) => {
        const x = round(
          Math.floor((e2.pageX - offset.x) / scale.value),
          MapSquareSize
        );
        const y = round(
          Math.floor((e2.pageY - offset.y) / scale.value),
          MapSquareSize
        );
        return { x, y };
      },
      [offset.x, offset.y]
    );
    const { isPanning, onMouseDown, onMouseEnter, onMouseMove, onMouseUp } = usePanning(
      (dx, dy) => setOffset((old) => ({ x: old.x + dx, y: old.y + dy })),
      (e2) => setHover(convertCoordinate(e2))
    );
    const onMouseOut = () => setHover(void 0);
    const onClick = (0, import_hooks.useCallback)(
      (e2) => onClickBattlefield == null ? void 0 : onClickBattlefield(convertCoordinate(e2), e2),
      [convertCoordinate, onClickBattlefield]
    );
    const onDragOver = (0, import_hooks.useCallback)((e2) => {
      e2.preventDefault();
      if (e2.dataTransfer)
        e2.dataTransfer.dropEffect = "move";
    }, []);
    const onDrop = (0, import_hooks.useCallback)(
      (e2) => {
        var _a2;
        const p = convertCoordinate(e2);
        const id = Number((_a2 = e2.dataTransfer) == null ? void 0 : _a2.getData("unit/id"));
        const u2 = allCombatants.peek()[id - 1];
        if (u2)
          onDragCombatant == null ? void 0 : onDragCombatant(u2.who, p);
      },
      [convertCoordinate, onDragCombatant]
    );
    const onWheel = (0, import_hooks.useCallback)((e2) => {
      const change = e2.deltaY < 0 ? 2 : -2;
      scale.value = clamp(scale.value + change, 4, 30);
    }, []);
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
      /* @__PURE__ */ u(
        "main",
        {
          className: classnames(Battlefield_module_default.main, { [Battlefield_module_default.panning]: isPanning }),
          "aria-label": "Battlefield",
          onClick,
          onMouseDown,
          onMouseEnter,
          onMouseMove,
          onMouseUp,
          onMouseLeave: onMouseOut,
          onWheel,
          onContextMenu: (e2) => {
            e2.preventDefault();
            return false;
          },
          onDragOver: canDragUnits.value ? onDragOver : void 0,
          onDrop: canDragUnits.value ? onDrop : void 0,
          children: /* @__PURE__ */ u("div", { style: { transform: `translate(${offset.x}px, ${offset.y}px)` }, children: [
            allCombatants.value.map((unit) => /* @__PURE__ */ u(
              Unit,
              {
                isMoving: movingCombatantId.value === unit.id,
                u: unit,
                onClick: onClickCombatant,
                onMove: onMoveCombatant
              },
              unit.id
            )),
            allEffects.value.map((effect) => /* @__PURE__ */ u(
              BattlefieldEffect,
              {
                scaleValue: scale.value,
                ...effect
              },
              effect.id
            )),
            ((_a = actionAreas.value) != null ? _a : []).map((shape, key) => /* @__PURE__ */ u(
              BattlefieldEffect,
              {
                scaleValue: scale.value,
                shape,
                top: true
              },
              `temp${key}`
            )),
            teleportInfo.value && /* @__PURE__ */ u(
              BattlefieldEffect,
              {
                scaleValue: scale.value,
                shape: teleportInfo.value,
                top: true,
                name: "Teleport"
              },
              "teleport"
            ),
            showHoveredTile && hover && /* @__PURE__ */ u(
              AffectedSquare,
              {
                scaleValue: scale.value,
                point: hover,
                tint: "silver"
              }
            ),
            images.map((image, key) => /* @__PURE__ */ u(
              BackgroundImage,
              {
                image,
                scaleValue: scale.value
              },
              `bg${key}`
            ))
          ] })
        }
      )
    );
  }

  // src/ui/components/BoundedMovePanel.tsx
  function BoundedMovePanel({ bounds, onFinish }) {
    return /* @__PURE__ */ u("aside", { className: common_module_default.panel, "aria-label": "Bounded Movement", children: [
      /* @__PURE__ */ u(Labelled, { label: bounds.handler.name, children: bounds.who.name }),
      /* @__PURE__ */ u("div", { children: [
        bounds.handler.teleportation ? "Teleport" : "Move",
        " up to",
        " ",
        bounds.handler.maximum,
        " feet."
      ] }),
      /* @__PURE__ */ u("button", { onClick: onFinish, disabled: bounds.handler.mustUseAll, children: "End Movement Early" })
    ] });
  }

  // src/ui/components/ChooseActionConfigPanel.module.scss
  var ChooseActionConfigPanel_module_default = {
    "warning": "_warning_15trd_1",
    "description": "_description_15trd_10",
    "namePanel": "_namePanel_15trd_19",
    "name": "_name_15trd_19",
    "time": "_time_15trd_25"
  };

  // src/ui/components/button.module.scss
  var button_module_default = {
    "active": "_active_rcghq_1",
    "danger": "_danger_rcghq_5"
  };

  // src/ui/components/CombatantRef.module.scss
  var CombatantRef_module_default = {
    "main": "_main_g12vt_1",
    "spaceBefore": "_spaceBefore_g12vt_5",
    "spaceAfter": "_spaceAfter_g12vt_8",
    "icon": "_icon_g12vt_12"
  };

  // src/ui/components/CombatantRef.tsx
  function CombatantRef({
    who,
    spaceBefore = false,
    spaceAfter = true
  }) {
    return /* @__PURE__ */ u(
      "div",
      {
        className: classnames(CombatantRef_module_default.main, {
          [CombatantRef_module_default.spaceBefore]: spaceBefore,
          [CombatantRef_module_default.spaceAfter]: spaceAfter
        }),
        children: [
          /* @__PURE__ */ u("img", { className: CombatantRef_module_default.icon, src: who.img, alt: who.name }),
          /* @__PURE__ */ u("span", { className: CombatantRef_module_default.iconLabel, "aria-hidden": "true", children: who.name })
        ]
      }
    );
  }

  // src/ui/components/RangeInput.module.scss
  var RangeInput_module_default = {
    "main": "_main_1k0vn_1",
    "min": "_min_1k0vn_7",
    "slider": "_slider_1k0vn_11",
    "max": "_max_1k0vn_15",
    "value": "_value_1k0vn_19"
  };

  // src/ui/components/RangeInput.tsx
  function RangeInput({ value, onChange, min, max }) {
    const changed = (0, import_hooks.useCallback)(
      (e2) => onChange(e2.currentTarget.valueAsNumber),
      [onChange]
    );
    return /* @__PURE__ */ u("div", { className: RangeInput_module_default.main, children: [
      /* @__PURE__ */ u("div", { className: RangeInput_module_default.min, children: min }),
      /* @__PURE__ */ u(
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
      /* @__PURE__ */ u("div", { className: RangeInput_module_default.max, children: max }),
      /* @__PURE__ */ u("div", { className: RangeInput_module_default.value, children: value })
    ] });
  }

  // src/ui/components/ConfigComponents.tsx
  function ChooseTarget({ value, onChange }) {
    const setTarget = (0, import_hooks.useCallback)(
      (who) => {
        onChange(who);
        wantsCombatant.value = void 0;
      },
      [onChange]
    );
    const onClick = (0, import_hooks.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== setTarget ? setTarget : void 0;
    }, [setTarget]);
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        "Target: ",
        value ? /* @__PURE__ */ u(CombatantRef, { who: value }) : "NONE"
      ] }),
      /* @__PURE__ */ u(
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
    resolver,
    value,
    onChange
  }) {
    var _a;
    const addTarget = (0, import_hooks.useCallback)(
      (who) => {
        if (who && !(value != null ? value : []).includes(who))
          onChange((value != null ? value : []).concat(who));
        wantsCombatant.value = void 0;
      },
      [onChange, value]
    );
    const onClick = (0, import_hooks.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== addTarget ? addTarget : void 0;
    }, [addTarget]);
    const remove = (0, import_hooks.useCallback)(
      (who) => onChange((value != null ? value : []).filter((x) => x !== who)),
      [onChange, value]
    );
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        "Targets (",
        describeRange(resolver.minimum, resolver.maximum),
        "):",
        (value != null ? value : []).length ? /* @__PURE__ */ u("ul", { children: (value != null ? value : []).map((who) => /* @__PURE__ */ u("li", { children: [
          /* @__PURE__ */ u(CombatantRef, { who }),
          " ",
          /* @__PURE__ */ u("button", { onClick: () => remove(who), children: [
            "remove ",
            who.name
          ] })
        ] }, who.id)) }) : ` NONE`
      ] }),
      /* @__PURE__ */ u(
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
  function ChoosePoint({ value, onChange }) {
    const setTarget = (0, import_hooks.useCallback)(
      (p) => {
        onChange(p);
        wantsPoint.value = void 0;
      },
      [onChange]
    );
    const onClick = (0, import_hooks.useCallback)(() => {
      wantsPoint.value = wantsPoint.value !== setTarget ? setTarget : void 0;
    }, [setTarget]);
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        "Point: ",
        describePoint(value)
      ] }),
      /* @__PURE__ */ u(
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
    resolver,
    value,
    onChange
  }) {
    const addPoint = (0, import_hooks.useCallback)(
      (p) => {
        if (p)
          onChange((value != null ? value : []).concat(p));
        wantsPoint.value = void 0;
      },
      [onChange, value]
    );
    const onClick = (0, import_hooks.useCallback)(() => {
      wantsPoint.value = wantsPoint.value !== addPoint ? addPoint : void 0;
    }, [addPoint]);
    const remove = (0, import_hooks.useCallback)(
      (p) => onChange((value != null ? value : []).filter((x) => x !== p)),
      [onChange, value]
    );
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        "Points (",
        describeRange(resolver.minimum, resolver.maximum),
        "):",
        (value != null ? value : []).length ? /* @__PURE__ */ u("ul", { children: (value != null ? value : []).map((p, key) => /* @__PURE__ */ u("li", { children: [
          describePoint(p),
          /* @__PURE__ */ u("button", { onClick: () => remove(p), children: [
            "remove ",
            describePoint(p)
          ] })
        ] }, key)) }) : ` NONE`
      ] }),
      /* @__PURE__ */ u(
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
    resolver,
    value,
    onChange
  }) {
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        "Spell Slot: ",
        value != null ? value : "NONE"
      ] }),
      /* @__PURE__ */ u("div", { children: enumerate(resolver.min, resolver.max).map((slot) => /* @__PURE__ */ u(
        "button",
        {
          className: classnames({ [button_module_default.active]: value === slot }),
          "aria-pressed": value === slot,
          onClick: () => onChange(slot),
          children: slot
        },
        slot
      )) })
    ] });
  }
  function ChooseText({
    resolver,
    value,
    onChange
  }) {
    var _a, _b;
    const [label, setLabel] = (0, import_hooks.useState)(
      (_b = (_a = resolver.entries.find((e2) => e2.value === value)) == null ? void 0 : _a.label) != null ? _b : "NONE"
    );
    const choose = (e2) => () => {
      if (e2.value === value) {
        onChange(void 0);
        setLabel("NONE");
        return;
      }
      onChange(e2.value);
      setLabel(e2.label);
    };
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        resolver.name,
        ": ",
        label
      ] }),
      /* @__PURE__ */ u("div", { children: resolver.entries.map((e2) => /* @__PURE__ */ u(
        "button",
        {
          className: classnames({ [button_module_default.active]: value === e2.value }),
          "aria-pressed": value === e2.value,
          onClick: choose(e2),
          disabled: e2.disabled,
          children: e2.label
        },
        e2.label
      )) })
    ] });
  }
  function ChooseMany({
    resolver,
    value,
    onChange
  }) {
    const [labels, setLabels] = (0, import_hooks.useState)([]);
    const add = (0, import_hooks.useCallback)(
      (ch) => {
        if (!(value != null ? value : []).find((x) => x === ch)) {
          onChange((value != null ? value : []).concat(ch.value));
          setLabels((old) => old.concat(ch.label));
        }
      },
      [onChange, value]
    );
    const remove = (0, import_hooks.useCallback)(
      (ch) => {
        onChange((value != null ? value : []).filter((x) => x !== ch.value));
        setLabels((old) => old.filter((x) => x !== ch.label));
      },
      [onChange, value]
    );
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        resolver.name,
        ": ",
        labels.length ? labels.join(", ") : "NONE"
      ] }),
      /* @__PURE__ */ u("div", { children: resolver.entries.map((e2) => {
        const selected = (value != null ? value : []).includes(e2.value);
        const full = (value != null ? value : []).length > resolver.maximum;
        return /* @__PURE__ */ u(
          "button",
          {
            className: classnames({ [button_module_default.active]: selected }),
            "aria-pressed": selected,
            onClick: selected ? () => remove(e2) : () => add(e2),
            disabled: e2.disabled || full,
            children: e2.label
          },
          e2.label
        );
      }) })
    ] });
  }
  function ChooseNumber({
    resolver,
    value,
    onChange
  }) {
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        resolver.rangeName,
        " Choice: ",
        value != null ? value : "NONE"
      ] }),
      /* @__PURE__ */ u(
        RangeInput,
        {
          min: resolver.min,
          max: resolver.max,
          value: value != null ? value : 0,
          onChange
        }
      )
    ] });
  }
  function ChooseAllocations({
    resolver,
    value,
    onChange
  }) {
    const addTarget = (0, import_hooks.useCallback)(
      (who) => {
        if (who && !(value != null ? value : []).find((e2) => e2.who === who))
          onChange((value != null ? value : []).concat({ amount: 1, who }));
        wantsCombatant.value = void 0;
      },
      [onChange, value]
    );
    const onClick = (0, import_hooks.useCallback)(() => {
      wantsCombatant.value = wantsCombatant.value !== addTarget ? addTarget : void 0;
    }, [addTarget]);
    const remove = (0, import_hooks.useCallback)(
      (who) => onChange((value != null ? value : []).filter((x) => x.who !== who)),
      [onChange, value]
    );
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u("div", { children: [
        resolver.rangeName,
        " (",
        describeRange(resolver.minimum, resolver.maximum),
        "):",
        (value != null ? value : []).length ? /* @__PURE__ */ u("ul", { children: (value != null ? value : []).map(({ amount, who }) => /* @__PURE__ */ u("li", { children: [
          /* @__PURE__ */ u(CombatantRef, { who }),
          " ",
          /* @__PURE__ */ u("button", { onClick: () => remove(who), children: [
            "remove ",
            who.name
          ] }),
          /* @__PURE__ */ u(
            RangeInput,
            {
              min: 0,
              max: resolver.maximum,
              value: amount,
              onChange: (amount2) => onChange(
                (value != null ? value : []).map(
                  (x) => x.who === who ? { amount: amount2, who } : x
                )
              )
            }
          )
        ] }, who.id)) }) : "NONE"
      ] }),
      /* @__PURE__ */ u(
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
  function ConfigComponents({
    config,
    getConfig,
    patchConfig
  }) {
    const elements = (0, import_hooks.useMemo)(
      () => objectEntries(getConfig(config)).map(
        ([key, resolver]) => {
          const subProps = {
            key,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resolver,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange: (value) => patchConfig((old) => old[key] = value),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: config[key]
          };
          if (resolver instanceof TargetResolver)
            return /* @__PURE__ */ u(ChooseTarget, { ...subProps });
          else if (resolver instanceof MultiTargetResolver)
            return /* @__PURE__ */ u(ChooseTargets, { ...subProps });
          else if (resolver instanceof PointResolver || resolver instanceof PointToPointResolver)
            return /* @__PURE__ */ u(ChoosePoint, { ...subProps });
          else if (resolver instanceof MultiPointResolver)
            return /* @__PURE__ */ u(ChoosePoints, { ...subProps });
          else if (resolver instanceof SlotResolver)
            return /* @__PURE__ */ u(ChooseSlot, { ...subProps });
          else if (resolver instanceof ChoiceResolver)
            return /* @__PURE__ */ u(ChooseText, { ...subProps });
          else if (resolver instanceof MultiChoiceResolver)
            return /* @__PURE__ */ u(ChooseMany, { ...subProps });
          else if (resolver instanceof NumberRangeResolver)
            return /* @__PURE__ */ u(ChooseNumber, { ...subProps });
          else if (resolver instanceof AllocationResolver)
            return /* @__PURE__ */ u(ChooseAllocations, { ...subProps });
          else
            return /* @__PURE__ */ u("div", { children: [
              "(no frontend for resolver type [",
              subProps.resolver.type,
              "] yet)"
            ] });
        }
      ),
      [config, getConfig, patchConfig]
    );
    return /* @__PURE__ */ u("div", { children: elements });
  }

  // src/ui/components/ChooseActionConfigPanel.tsx
  function getInitialConfig(getConfig, initial) {
    const config = { ...initial };
    for (const [key, resolver] of objectEntries(
      getConfig(config)
    ))
      if (isDefined(resolver.initialValue))
        config[key] = resolver.initialValue;
    return config;
  }
  function AmountElement({ a, type }) {
    return /* @__PURE__ */ u("span", { children: [
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
    active,
    initialConfig = {},
    onCancel,
    onExecute
  }) {
    const getConfig = (0, import_hooks.useMemo)(() => action.getConfig.bind(action), [action]);
    const [config, patchConfig] = usePatcher(
      getInitialConfig(getConfig, initialConfig)
    );
    (0, import_hooks.useEffect)(() => {
      actionAreas.value = action.getAffectedArea(config);
    }, [action, active, config]);
    const {
      name,
      errors,
      disabled,
      damage,
      description,
      heal,
      isReaction,
      time
    } = (0, import_hooks.useMemo)(() => {
      const name2 = action.name;
      const errors2 = getConfigErrors(g, action, config).messages;
      const disabled2 = errors2.length > 0;
      const damage2 = action.getDamage(config);
      const description2 = action.getDescription(config);
      const heal2 = action.getHeal(config);
      const rawTime = action.getTime(config);
      const time2 = action.tags.has("costs attack") ? "attack" : rawTime != null ? rawTime : "no cost";
      const isReaction2 = rawTime === "reaction";
      return {
        name: name2,
        errors: errors2,
        disabled: disabled2,
        damage: damage2,
        description: description2,
        heal: heal2,
        time: time2,
        isReaction: isReaction2
      };
    }, [action, config, g]);
    const execute = (0, import_hooks.useCallback)(() => {
      if (checkConfig(g, action, config))
        onExecute(action, config);
    }, [g, action, config, onExecute]);
    const statusWarning = (0, import_hooks.useMemo)(
      () => action.status === "incomplete" ? /* @__PURE__ */ u("div", { className: ChooseActionConfigPanel_module_default.warning, children: "Incomplete implementation" }) : action.status === "missing" ? /* @__PURE__ */ u("div", { className: ChooseActionConfigPanel_module_default.warning, children: "Not implemented" }) : null,
      [action.status]
    );
    return /* @__PURE__ */ u("aside", { className: common_module_default.panel, "aria-label": "Action Options", children: [
      /* @__PURE__ */ u("div", { className: ChooseActionConfigPanel_module_default.namePanel, children: [
        /* @__PURE__ */ u("div", { className: ChooseActionConfigPanel_module_default.name, children: name }),
        /* @__PURE__ */ u("div", { className: ChooseActionConfigPanel_module_default.time, children: time })
      ] }),
      statusWarning,
      description && /* @__PURE__ */ u("div", { className: ChooseActionConfigPanel_module_default.description, children: description.split("\n").map((p, key) => /* @__PURE__ */ u("p", { children: p }, key)) }),
      damage && /* @__PURE__ */ u("div", { children: [
        "Damage:",
        " ",
        /* @__PURE__ */ u("div", { className: common_module_default.damageList, children: [
          damage.map((a, key) => /* @__PURE__ */ u(AmountElement, { a, type: a.damageType }, key)),
          " ",
          "(",
          Math.ceil(damage.reduce(amountReducer, 0)),
          ")"
        ] })
      ] }),
      heal && /* @__PURE__ */ u("div", { children: [
        "Heal:",
        " ",
        /* @__PURE__ */ u("div", { className: common_module_default.healList, children: [
          heal.map((a, key) => /* @__PURE__ */ u(AmountElement, { a }, key)),
          " ",
          "(",
          Math.ceil(heal.reduce(amountReducer, 0)),
          ")"
        ] })
      ] }),
      !isReaction && /* @__PURE__ */ u(import_preact3.Fragment, { children: [
        /* @__PURE__ */ u("button", { disabled, onClick: execute, children: "Execute" }),
        /* @__PURE__ */ u("button", { onClick: onCancel, children: "Cancel" }),
        /* @__PURE__ */ u(
          ConfigComponents,
          {
            config,
            getConfig,
            patchConfig
          }
        ),
        errors.length > 0 && /* @__PURE__ */ u(Labelled, { label: "Errors", children: errors.map((msg, key) => /* @__PURE__ */ u("div", { children: msg }, key)) })
      ] })
    ] });
  }

  // src/ui/components/CombatUI.module.scss
  var CombatUI_module_default = {
    "sidePanel": "_sidePanel_4415i_1"
  };

  // src/ui/hooks/useTimeout.ts
  function useTimeout(handler, ms = void 0) {
    const [handle, setHandle] = (0, import_hooks.useState)();
    const fire = (0, import_hooks.useCallback)(
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
    const cancel = (0, import_hooks.useCallback)(
      () => setHandle((old) => {
        if (old)
          clearTimeout(old);
        return void 0;
      }),
      []
    );
    (0, import_hooks.useEffect)(() => cancel, [cancel]);
    return { cancel, fire, handle };
  }

  // src/ui/utils/messages.tsx
  var msgCombatant = (c, spaceBefore = false, spaceAfter = true) => ({
    element: /* @__PURE__ */ u(CombatantRef, { who: c, spaceBefore, spaceAfter }),
    text: c.name
  });
  var msgDiceType = (dt) => dt !== "normal" ? { element: /* @__PURE__ */ u(import_preact3.Fragment, { children: [
    " at ",
    dt
  ] }), text: ` at ${dt}` } : void 0;
  var msgWeapon = (w) => w ? { element: /* @__PURE__ */ u(import_preact3.Fragment, { children: [
    " with ",
    w.name
  ] }), text: ` with ${w.name}` } : void 0;
  var msgSpell = (s) => s ? { element: /* @__PURE__ */ u(import_preact3.Fragment, { children: [
    " with ",
    s.name
  ] }), text: ` with ${s.name}` } : void 0;
  var msgAmmo = (a) => a ? { element: /* @__PURE__ */ u(import_preact3.Fragment, { children: [
    ", firing ",
    a.name
  ] }), text: `, firing ${a.name}` } : void 0;
  var msgUpcast = (spell, slot) => slot > spell.level ? { element: /* @__PURE__ */ u(import_preact3.Fragment, { children: [
    " at level ",
    slot
  ] }), text: ` at level ${slot}` } : void 0;
  var msgNonzero = (value, text) => value ? { element: /* @__PURE__ */ u(import_preact3.Fragment, { children: text }), text } : void 0;
  function getDamageEntryText([type, entry]) {
    return `${entry.amount} ${type}${entry.response !== "normal" ? ` ${entry.response}` : ""}`;
  }
  var dmgBreakdown = (breakdown) => ({
    element: /* @__PURE__ */ u(import_preact3.Fragment, { children: [
      "(",
      /* @__PURE__ */ u("div", { className: common_module_default.damageList, children: Array.from(breakdown, ([type, entry]) => /* @__PURE__ */ u("span", { children: getDamageEntryText([type, entry]) }, type)) }),
      ")"
    ] }),
    text: `(${Array.from(breakdown, getDamageEntryText).join(", ")})`
  });
  var getAttackMessage = ({
    attack: {
      ac,
      total,
      roll: {
        diceType,
        type: { who, target, weapon, spell, ammo }
      }
    },
    outcome
  }) => [
    msgCombatant(who),
    outcome === "miss" ? " misses " : outcome === "hit" ? " hits " : " CRITICALLY hits ",
    msgCombatant(target, true),
    msgDiceType(diceType),
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
    " ability check.",
    !isNaN(dc) ? `  (DC ${dc})` : ""
  ];
  var getInitiativeMessage = ({
    diceType,
    who,
    value
  }) => [
    msgCombatant(who),
    ` gets a ${value}`,
    msgDiceType(diceType),
    " for initiative."
  ];
  var getSaveMessage = ({
    diceType,
    roll: {
      type: { who, ability, tags }
    },
    forced,
    outcome,
    total,
    dc
  }) => [
    msgCombatant(who),
    ...forced ? [" automatically ", outcome === "success" ? "succeeds" : "fails"] : [` gets a ${total}`, msgDiceType(diceType)],
    " on a ",
    describeSave(tags, ability),
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
  var getBuilderMessage = ({ data }) => data.map((part) => {
    switch (part.type) {
      case "combatant":
        return msgCombatant(part.value, part.spaceBefore, part.spaceAfter);
      case "item":
        return part.value.name;
      case "text":
        return part.value;
    }
  });
  var modAmount = (n) => n < 0 ? `${n}` : `+${n}`;
  var getTextLines = (co) => {
    const lines = co.getTaggedEntries().map(
      ({ entry, ignored }) => `${entry.source.name}: ${entry.value}${ignored ? " XXX" : ""}`
    );
    return lines.length ? lines.join("\n") : void 0;
  };
  var getBonusLines = (co) => {
    const lines = co.getTaggedEntries().map(
      ({ entry, ignored }) => `${entry.source.name}: ${modAmount(entry.value)}${ignored ? " XXX" : ""}`
    );
    return lines.length ? lines.join("\n") : void 0;
  };
  var getRollLine = (co) => isNaN(co.final) ? void 0 : `Roll: ${co.final}${co.others.length ? ` (${co.others.map(String).join(" ")})` : ""}`;
  var getInitiativeInfo = ({ pre, roll }) => [
    getTextLines(pre.diceType),
    getBonusLines(pre.bonus),
    getRollLine(roll.values)
  ].filter(isDefined).join("\n");
  var getAttackInfo = ({ attack: { pre, roll } }) => [
    getTextLines(pre.success),
    getTextLines(pre.diceType),
    getBonusLines(pre.bonus),
    getRollLine(roll.values)
  ].filter(isDefined).join("\n");
  var getSaveInfo = ({ pre, roll }) => [
    getTextLines(pre.successResponse),
    getTextLines(pre.diceType),
    getBonusLines(pre.bonus),
    getRollLine(roll.values)
  ].filter(isDefined).join("\n");

  // src/ui/components/EventLog.module.scss
  var EventLog_module_default = {
    "container": "_container_1qiuq_1",
    "main": "_main_1qiuq_14",
    "messageWrapper": "_messageWrapper_1qiuq_22",
    "message": "_message_1qiuq_22",
    "info": "_info_1qiuq_34"
  };

  // src/ui/components/EventLog.tsx
  function LogMessage({
    message,
    info
  }) {
    const text = message.filter(isDefined).map((x) => typeof x === "string" ? x : x.text).join("");
    const children = message.filter(isDefined).map((x) => typeof x === "string" ? x : x.element);
    return /* @__PURE__ */ u("li", { "aria-label": text, className: EventLog_module_default.messageWrapper, children: [
      /* @__PURE__ */ u("div", { "aria-hidden": "true", className: EventLog_module_default.message, children }),
      info && /* @__PURE__ */ u("div", { className: EventLog_module_default.info, title: info, children: "..." })
    ] });
  }
  function EventLog({ g }) {
    const ref = (0, import_hooks.useRef)(null);
    const [messages, setMessages] = (0, import_hooks.useState)([]);
    const { fire } = useTimeout(
      () => {
        var _a, _b;
        return (_b = (_a = ref.current) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, { behavior: "smooth" });
      }
    );
    const addMessage = (0, import_hooks.useCallback)((el) => {
      setMessages((old) => old.concat(el).slice(-50));
      fire();
    }, []);
    (0, import_hooks.useEffect)(() => {
      g.events.on(
        "AfterAttack",
        ({ detail }) => detail.interrupt.add(
          new UIResponse(
            detail.attack.roll.type.who,
            async () => addMessage(
              /* @__PURE__ */ u(
                LogMessage,
                {
                  message: getAttackMessage(detail),
                  info: getAttackInfo(detail)
                }
              )
            )
          )
        )
      );
      g.events.on(
        "CombatantDamaged",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getDamageMessage(detail) }))
      );
      g.events.on(
        "CombatantHealed",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getHealedMessage(detail) }))
      );
      g.events.on(
        "CombatantDied",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getDeathMessage(detail) }))
      );
      g.events.on("EffectAdded", ({ detail }) => {
        if (!detail.effect.quiet)
          addMessage(/* @__PURE__ */ u(LogMessage, { message: getEffectAddedMessage(detail) }));
      });
      g.events.on("EffectRemoved", ({ detail }) => {
        if (!detail.effect.quiet)
          addMessage(/* @__PURE__ */ u(LogMessage, { message: getEffectRemovedMessage(detail) }));
      });
      g.events.on(
        "SpellCast",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getCastMessage(detail) }))
      );
      g.events.on("CombatantInitiative", ({ detail }) => {
        addMessage(
          /* @__PURE__ */ u(
            LogMessage,
            {
              message: getInitiativeMessage(detail),
              info: getInitiativeInfo(detail)
            }
          )
        );
      });
      g.events.on(
        "AbilityCheck",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getAbilityCheckMessage(detail) }))
      );
      g.events.on(
        "Save",
        ({ detail }) => addMessage(
          /* @__PURE__ */ u(
            LogMessage,
            {
              message: getSaveMessage(detail),
              info: getSaveInfo(detail)
            }
          )
        )
      );
      g.events.on(
        "Exhaustion",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getExhaustionMessage(detail) }))
      );
      g.events.on(
        "Text",
        ({ detail }) => addMessage(/* @__PURE__ */ u(LogMessage, { message: getBuilderMessage(detail.message) }))
      );
    }, [addMessage, g]);
    return /* @__PURE__ */ u("div", { className: EventLog_module_default.container, children: [
      /* @__PURE__ */ u("ul", { className: EventLog_module_default.main, "aria-label": "Event Log", children: messages }),
      /* @__PURE__ */ u("div", { ref })
    ] });
  }

  // src/ui/components/Dialog.module.scss
  var Dialog_module_default = {
    "main": "_main_1hd4j_1",
    "shade": "_shade_1hd4j_5",
    "react": "_react_1hd4j_18",
    "title": "_title_1hd4j_24"
  };

  // src/ui/components/Dialog.tsx
  function ReactDialog({ title, text, children }) {
    const titleId = (0, import_hooks.useId)();
    return /* @__PURE__ */ u("div", { className: Dialog_module_default.shade, children: /* @__PURE__ */ u(
      "div",
      {
        role: "dialog",
        "aria-labelledby": titleId,
        "aria-modal": "true",
        className: classnames(Dialog_module_default.main, Dialog_module_default.react),
        children: [
          /* @__PURE__ */ u("div", { id: titleId, className: Dialog_module_default.title, children: title }),
          text && /* @__PURE__ */ u("p", { className: Dialog_module_default.text, children: text }),
          children
        ]
      }
    ) });
  }
  function Dialog(props) {
    return /* @__PURE__ */ u(ReactDialog, { ...props });
  }

  // src/ui/components/ListChoiceDialog.tsx
  function ListChoiceDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks.useCallback)(
      (value) => {
        chooseFromList.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    return /* @__PURE__ */ u(Dialog, { title: interruption.title, text: interruption.text, children: [
      interruption.items.map(({ label, value, disabled }) => /* @__PURE__ */ u("button", { disabled, onClick: () => decide(value), children: label }, label)),
      interruption.allowNone && /* @__PURE__ */ u("button", { onClick: () => decide(), children: "(None)" })
    ] });
  }

  // src/ui/components/Menu.module.scss
  var Menu_module_default = {
    "main": "_main_1j00q_1",
    "sub": "_sub_1j00q_14"
  };

  // src/ui/components/Menu.tsx
  function Menu({
    caption,
    items,
    onClick,
    x,
    y
  }) {
    return /* @__PURE__ */ u("menu", { className: Menu_module_default.main, style: { left: x, top: y }, children: /* @__PURE__ */ u(Labelled, { label: caption, contentsClass: Menu_module_default.sub, children: items.length === 0 ? /* @__PURE__ */ u("div", { children: "(empty)" }) : items.map(({ label, value, disabled, className }) => /* @__PURE__ */ u(
      "button",
      {
        role: "menuitem",
        disabled,
        className,
        onClick: () => onClick(value),
        children: label
      },
      label
    )) }) });
  }

  // src/ui/hooks/useList.ts
  function useList(initialValue = []) {
    const [list, setList] = (0, import_hooks.useState)(initialValue);
    const toggle = (0, import_hooks.useCallback)(
      (item) => setList(
        (old) => old.includes(item) ? old.filter((x) => x !== item) : old.concat(item)
      ),
      []
    );
    return { list, setList, toggle };
  }

  // src/ui/components/MultiListChoiceDialog.tsx
  function MultiListChoiceDialog({
    interruption,
    resolve
  }) {
    const { list, toggle } = useList();
    const invalidSelection = list.length < interruption.minimum || list.length > interruption.maximum;
    const decide = (0, import_hooks.useCallback)(() => {
      chooseManyFromList.value = void 0;
      resolve(list);
    }, [list, resolve]);
    return /* @__PURE__ */ u(Dialog, { title: interruption.title, text: interruption.text, children: [
      /* @__PURE__ */ u("div", { children: [
        "Choose between ",
        interruption.minimum,
        " and ",
        interruption.maximum,
        " ",
        "inclusive."
      ] }),
      interruption.items.map(({ label, value, disabled }) => /* @__PURE__ */ u(
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
      /* @__PURE__ */ u("button", { disabled: invalidSelection, onClick: decide, children: "OK" })
    ] });
  }

  // src/ui/components/YesNoDialog.tsx
  function YesNoDialog({
    interruption,
    resolve
  }) {
    const decide = (0, import_hooks.useCallback)(
      (value) => {
        chooseYesNo.value = void 0;
        resolve(value);
      },
      [resolve]
    );
    const onYes = (0, import_hooks.useCallback)(() => decide(true), [decide]);
    const onNo = (0, import_hooks.useCallback)(() => decide(false), [decide]);
    return /* @__PURE__ */ u(Dialog, { title: interruption.title, text: interruption.text, children: [
      /* @__PURE__ */ u("button", { onClick: onYes, children: "Yes" }),
      /* @__PURE__ */ u("button", { onClick: onNo, children: "No" })
    ] });
  }

  // src/ui/components/CombatUI.tsx
  function CombatUI({ g, template }) {
    const cache = (0, import_hooks.useContext)(SVGCacheContext);
    const [action, setAction] = (0, import_hooks.useState)();
    const refreshMoveDirections = (0, import_hooks.useCallback)(() => {
      const unit = activeCombatant.value;
      const handler = moveHandler.value;
      if (unit && handler) {
        canMoveDirections.value = [];
        return g.getValidMoves(unit.who, handler).then((valid) => canMoveDirections.value = valid);
      }
    }, [g]);
    const refreshUnits = (0, import_hooks.useCallback)(() => {
      allCombatants.value = Array.from(g.combatants, getUnitData);
      refreshMoveDirections();
    }, [g, refreshMoveDirections]);
    const refreshAreas = (0, import_hooks.useCallback)(() => {
      allEffects.value = Array.from(g.effects);
    }, [g]);
    const onFinishBoundedMove = (0, import_hooks.useCallback)(() => {
      if (moveBounds.value) {
        moveBounds.value.detail.resolve();
        moveBounds.value = void 0;
        if (g.activeCombatant) {
          movingCombatantId.value = g.activeCombatant.id;
          moveHandler.value = getDefaultMovement(g.activeCombatant);
        }
      }
    }, [g]);
    const processMove = (0, import_hooks.useCallback)(
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
    const onExecuteAction = (0, import_hooks.useCallback)(
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
    const menu = useMenu("Quick Actions", (choice, target) => {
      setAction(void 0);
      const point = target.position;
      const config = { target, point };
      if (checkConfig(g, choice, config)) {
        onExecuteAction(choice, config);
      } else
        console.warn(config, "does not match", choice.getConfig(config));
    });
    (0, import_hooks.useEffect)(() => {
      resetAllState(() => {
        showSideHP.value = [0];
        showSideUnderlay.value = false;
      });
      g.events.on("CombatantPlaced", refreshUnits);
      g.events.on("CombatantMoved", refreshUnits);
      g.events.on("CombatantDied", refreshUnits);
      g.events.on("EffectAdded", refreshUnits);
      g.events.on("EffectRemoved", refreshUnits);
      g.events.on("AreaPlaced", refreshAreas);
      g.events.on("AreaRemoved", refreshAreas);
      g.events.on("TurnStarted", ({ detail: { who, interrupt } }) => {
        interrupt.add(
          new UIResponse(who, async () => {
            (0, import_signals.batch)(() => {
              activeCombatantId.value = who.id;
              moveHandler.value = getDefaultMovement(who);
              movingCombatantId.value = who.id;
              menu.hide();
              refreshUnits();
              allActions.value = g.getActions(who);
            });
          })
        );
      });
      g.events.on("ListChoice", (e2) => chooseFromList.value = e2);
      g.events.on("MultiListChoice", (e2) => chooseManyFromList.value = e2);
      g.events.on("YesNoChoice", (e2) => chooseYesNo.value = e2);
      g.events.on("BoundedMove", (e2) => {
        const { who, handler } = e2.detail;
        (0, import_signals.batch)(() => {
          moveBounds.value = e2;
          moveHandler.value = handler;
          movingCombatantId.value = who.id;
          if (handler.teleportation) {
            const shape = {
              type: "within",
              who,
              radius: handler.maximum
            };
            teleportInfo.value = shape;
            const area = resolveArea(shape);
            wantsPoint.value = (p) => {
              if (p && area.has(p)) {
                processMove(g.move(who, p, handler));
                (0, import_signals.batch)(() => {
                  wantsPoint.value = void 0;
                  teleportInfo.value = void 0;
                });
              }
            };
          }
        });
      });
      if (template)
        void initialiseFromTemplate(g, template).then((arg) => {
          for (const iconUrl of getAllIcons(g))
            cache.get(iconUrl);
          return arg;
        });
      return g.reset.bind(g);
    }, [cache, g, processMove, refreshAreas, refreshUnits, template]);
    const onClickBattlefield = (0, import_hooks.useCallback)(
      (p) => {
        const givePoint = wantsPoint.peek();
        if (givePoint) {
          givePoint(p);
          return;
        }
        menu.hide();
        actionAreas.value = void 0;
      },
      [menu]
    );
    const onClickCombatant = (0, import_hooks.useCallback)(
      (who, e2) => {
        e2.stopPropagation();
        const giveCombatant = wantsCombatant.peek();
        if (giveCombatant) {
          giveCombatant(who);
          return;
        }
        const givePoint = wantsPoint.peek();
        if (givePoint) {
          givePoint(who.position);
          return;
        }
        setAction(void 0);
        actionAreas.value = void 0;
        const me = activeCombatant.value;
        if (me && !moveBounds.peek()) {
          menu.show(
            e2,
            allActions.value.map((action2) => {
              const testConfig = { target: who, point: who.position };
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
            }).filter((item) => !item.disabled),
            who
          );
        }
      },
      [g, menu]
    );
    const onMoveCombatant = (0, import_hooks.useCallback)(
      (who, dir) => {
        if (moveHandler.value) {
          menu.hide();
          processMove(g.moveInDirection(who, dir, moveHandler.value));
        }
      },
      [g, menu, processMove]
    );
    const onPass = (0, import_hooks.useCallback)(() => {
      setAction(void 0);
      actionAreas.value = void 0;
      void g.nextTurn();
    }, [g]);
    const onCancelAction = (0, import_hooks.useCallback)(() => {
      setAction(void 0);
      actionAreas.value = void 0;
    }, []);
    const onChooseAction = (0, import_hooks.useCallback)(
      (action2) => {
        menu.hide();
        setAction(action2);
      },
      [menu]
    );
    return /* @__PURE__ */ u("div", { className: CombatUI_module_default.main, children: [
      /* @__PURE__ */ u(
        Battlefield,
        {
          onClickBattlefield,
          onClickCombatant,
          onMoveCombatant,
          images: template == null ? void 0 : template.images
        }
      ),
      menu.isShown && /* @__PURE__ */ u(Menu, { ...menu.props }),
      /* @__PURE__ */ u("div", { className: CombatUI_module_default.sidePanel, children: moveBounds.value ? /* @__PURE__ */ u(
        BoundedMovePanel,
        {
          bounds: moveBounds.value.detail,
          onFinish: onFinishBoundedMove
        }
      ) : /* @__PURE__ */ u(import_preact3.Fragment, { children: [
        activeCombatant.value && /* @__PURE__ */ u(
          ActiveUnitPanel,
          {
            who: activeCombatant.value,
            onPass,
            onChooseAction
          }
        ),
        action && /* @__PURE__ */ u(
          ChooseActionConfigPanel,
          {
            g,
            action,
            active: activeCombatant.value,
            onCancel: onCancelAction,
            onExecute: onExecuteAction
          }
        )
      ] }) }),
      /* @__PURE__ */ u(EventLog, { g }),
      chooseFromList.value && /* @__PURE__ */ u(ListChoiceDialog, { ...chooseFromList.value.detail }),
      chooseManyFromList.value && /* @__PURE__ */ u(MultiListChoiceDialog, { ...chooseManyFromList.value.detail }),
      chooseYesNo.value && /* @__PURE__ */ u(YesNoDialog, { ...chooseYesNo.value.detail })
    ] });
  }

  // src/ui/components/CombatantTile.module.scss
  var CombatantTile_module_default = {
    "tile": "_tile_17318_1",
    "image": "_image_17318_8",
    "caption": "_caption_17318_12"
  };

  // src/ui/components/CombatantTile.tsx
  function CombatantTile({ name, tokenUrl }) {
    return /* @__PURE__ */ u("figure", { className: CombatantTile_module_default.tile, children: [
      /* @__PURE__ */ u("img", { className: CombatantTile_module_default.image, src: tokenUrl, alt: name }),
      /* @__PURE__ */ u("figcaption", { className: CombatantTile_module_default.caption, children: name })
    ] });
  }

  // src/ui/components/SearchableList.module.scss
  var SearchableList_module_default = {
    "list": "_list_1f595_1"
  };

  // src/ui/components/SearchableList.tsx
  function SearchableList({
    items,
    value,
    setValue,
    maxResults = 40
  }) {
    const [search, setSearch] = (0, import_hooks.useState)("");
    const { matches: matches2, message } = (0, import_hooks.useMemo)(() => {
      const found = search ? items.filter((x) => x.value.includes(search)) : items;
      const matches3 = found.slice(0, maxResults);
      const message2 = matches3.length < found.length ? `...and ${found.length - matches3.length} more...` : void 0;
      return { matches: matches3, message: message2 };
    }, [items, maxResults, search]);
    return /* @__PURE__ */ u("div", { children: [
      /* @__PURE__ */ u(
        "input",
        {
          type: "search",
          value: search,
          onInput: (e2) => setSearch(e2.currentTarget.value)
        }
      ),
      /* @__PURE__ */ u("ul", { className: SearchableList_module_default.list, children: matches2.map((item) => /* @__PURE__ */ u("li", { children: /* @__PURE__ */ u(
        "button",
        {
          className: classnames({
            [button_module_default.active]: item.value === value
          }),
          onClick: () => setValue(item.value),
          children: item.component
        }
      ) }, item.value)) }),
      message && /* @__PURE__ */ u("div", { children: message })
    ] });
  }

  // src/ui/components/AddMonsterDialog.tsx
  var monsterNames = objectEntries(allMonsters_default).sort(([, a], [, b]) => a.name.localeCompare(b.name)).map(([value, t]) => ({
    value,
    component: /* @__PURE__ */ u(CombatantTile, { name: t.name, tokenUrl: t.tokenUrl })
  }));
  function AddMonsterDialog({ onCancel, onChoose }) {
    return /* @__PURE__ */ u(Dialog, { title: "Add Monster", children: [
      /* @__PURE__ */ u(SearchableList, { items: monsterNames, setValue: onChoose }),
      /* @__PURE__ */ u("button", { onClick: onCancel, children: "Cancel" })
    ] });
  }

  // src/ui/components/AddPCDialog.tsx
  var pcItems = objectEntries(allPCs_default).sort(([, a], [, b]) => a.name.localeCompare(b.name)).map(([value, t]) => ({
    value,
    component: /* @__PURE__ */ u(CombatantTile, { name: t.name, tokenUrl: t.tokenUrl })
  }));
  function AddPCDialog({ onCancel, onChoose }) {
    return /* @__PURE__ */ u(Dialog, { title: "Add Monster", children: [
      /* @__PURE__ */ u(SearchableList, { items: pcItems, setValue: onChoose }),
      /* @__PURE__ */ u("button", { onClick: onCancel, children: "Cancel" })
    ] });
  }

  // src/ui/components/ConfigureMonsterDialog.tsx
  function ConfigureMonsterDialog({
    g,
    name,
    config,
    onFinished,
    patchConfig
  }) {
    const getConfig = (0, import_hooks.useMemo)(() => {
      const t = allMonsters_default[name];
      if (!t.config)
        throw new Error(`Monster ${name} has no config`);
      return t.config.get;
    }, [name]);
    return /* @__PURE__ */ u(Dialog, { title: "Configure Monster", children: [
      /* @__PURE__ */ u(
        ConfigComponents,
        {
          config,
          getConfig: (partial) => getConfig(g, partial),
          patchConfig
        }
      ),
      /* @__PURE__ */ u("button", { onClick: onFinished, children: "OK" })
    ] });
  }

  // src/ui/components/EditUI.tsx
  var sideItem = (side, current) => ({
    label: side === 0 ? "Ally" : side === 1 ? "Enemy" : `Side #${side}`,
    value: { type: "side", side },
    disabled: side === current
  });
  var isConfigurable = (entry) => entry.type === "monster" && isDefined(allMonsters_default[entry.name].config);
  function useConfiguring(template, onUpdate) {
    const [index, select] = (0, import_hooks.useState)();
    const finish = () => select(void 0);
    const entry = (0, import_hooks.useMemo)(() => {
      if (index) {
        const e2 = template.combatants[index];
        if (e2.type === "monster")
          return e2;
      }
    }, [index, template.combatants]);
    const patch = (0, import_hooks.useCallback)(
      (patcher) => {
        if (isDefined(index))
          onUpdate((t) => {
            var _a;
            const config = (_a = t.combatants[index].config) != null ? _a : {};
            patcher(config);
          });
      },
      [index, onUpdate]
    );
    return { entry, select, patch, finish };
  }
  function EditUI({ g, template, onUpdate }) {
    var _a;
    (0, import_hooks.useEffect)(() => {
      void initialiseFromTemplate(g, template).then((arg) => {
        resetAllState(() => {
          allCombatants.value = Array.from(g.combatants, getUnitData);
          canDragUnits.value = true;
          showSideHP.value = enumerate(0, 9);
          showSideUnderlay.value = true;
        });
        return arg;
      });
      return g.reset.bind(g);
    }, [g, template]);
    const [destination, setDestination] = (0, import_hooks.useState)({ x: NaN, y: NaN });
    const [add, setAdd] = (0, import_hooks.useState)();
    const onCancelAdd = () => setAdd(void 0);
    const onAddMonster = (name) => {
      setAdd(void 0);
      onUpdate(
        (t) => {
          var _a2;
          return t.combatants.push({
            type: "monster",
            name,
            x: destination.x,
            y: destination.y,
            config: (_a2 = allMonsters_default[name].config) == null ? void 0 : _a2.initial
          });
        }
      );
    };
    const onAddPC = (name) => {
      setAdd(void 0);
      onUpdate(
        (t) => t.combatants.push({
          type: "pc",
          name,
          x: destination.x,
          y: destination.y
        })
      );
    };
    const {
      select: configure,
      entry: configuring,
      finish: onFinishConfig,
      patch: onPatchConfig
    } = useConfiguring(template, onUpdate);
    const menu = useMenu(
      "Unit Actions",
      (0, import_hooks.useCallback)(
        (action, index) => {
          switch (action.type) {
            case "side":
              return onUpdate((t) => t.combatants[index].side = action.side);
            case "remove":
              return onUpdate((t) => t.combatants.splice(index, 1));
            case "monster":
            case "pc":
              setDestination(action.pos);
              setAdd(action.type);
              return;
            case "configure":
              configure(index);
              return;
          }
        },
        [onUpdate, configure]
      )
    );
    const onClickCombatant = (0, import_hooks.useCallback)(
      (who, e2) => {
        e2.stopPropagation();
        const index = who.id - 1;
        menu.show(
          e2,
          [
            sideItem(0, who.side),
            sideItem(1, who.side),
            sideItem(2, who.side),
            {
              label: "Configure...",
              value: { type: "configure" },
              disabled: !isConfigurable(template.combatants[index])
            },
            {
              label: "Remove",
              value: { type: "remove" },
              className: button_module_default.danger
            }
          ],
          index
        );
      },
      [menu, template.combatants]
    );
    const onDragCombatant = (0, import_hooks.useCallback)(
      (who, { x, y }) => onUpdate((t) => {
        t.combatants[who.id - 1].x = x;
        t.combatants[who.id - 1].y = y;
      }),
      [onUpdate]
    );
    const onClickBattlefield = (0, import_hooks.useCallback)(
      (pos, e2) => {
        if (menu.isShown)
          menu.hide();
        else
          menu.show(e2, [
            { label: "Add PC", value: { type: "pc", pos } },
            { label: "Add Monster", value: { type: "monster", pos } }
          ]);
      },
      [menu]
    );
    return /* @__PURE__ */ u(import_preact3.Fragment, { children: [
      /* @__PURE__ */ u(
        Battlefield,
        {
          showHoveredTile: true,
          onClickBattlefield,
          onClickCombatant,
          onDragCombatant,
          images: template.images
        }
      ),
      menu.isShown && /* @__PURE__ */ u(Menu, { ...menu.props }),
      add === "monster" && /* @__PURE__ */ u(AddMonsterDialog, { onChoose: onAddMonster, onCancel: onCancelAdd }),
      add === "pc" && /* @__PURE__ */ u(AddPCDialog, { onChoose: onAddPC, onCancel: onCancelAdd }),
      configuring && /* @__PURE__ */ u(
        ConfigureMonsterDialog,
        {
          g,
          name: configuring.name,
          config: (_a = configuring.config) != null ? _a : {},
          onFinished: onFinishConfig,
          patchConfig: onPatchConfig
        }
      )
    ] });
  }

  // src/ui/components/App.tsx
  function App() {
    const g = (0, import_hooks.useMemo)(() => {
      const engine = new Engine();
      window.g = engine;
      return engine;
    }, []);
    const [editing, , , toggleMode] = useBool(true);
    const [template, onUpdate] = usePatcher(daviesVsFiends);
    return /* @__PURE__ */ u("main", { className: App_module_default.container, children: [
      editing ? /* @__PURE__ */ u(EditUI, { g, template, onUpdate }) : /* @__PURE__ */ u(CombatUI, { g, template }),
      /* @__PURE__ */ u(
        "button",
        {
          onClick: toggleMode,
          className: App_module_default.modeSwitch,
          disabled: template.combatants.length < 1,
          children: editing ? "Play" : "Edit"
        }
      )
    ] });
  }

  // src/index.tsx
  var svgCache = new FetchCache();
  (0, import_preact.render)(
    /* @__PURE__ */ u(SVGCacheContext.Provider, { value: svgCache, children: /* @__PURE__ */ u(App, {}) }),
    document.body
  );
})();
