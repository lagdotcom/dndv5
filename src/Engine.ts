import { MarkOptional } from "ts-essentials";

import AttackOutcomeCollector from "./collectors/AttackOutcomeCollector";
import BonusCollector from "./collectors/BonusCollector";
import DamageResponseCollector from "./collectors/DamageResponseCollector";
import DiceTypeCollector from "./collectors/DiceTypeCollector";
import DifficultTerrainCollector from "./collectors/DifficultTerrainCollector";
import ErrorCollector from "./collectors/ErrorCollector";
import InterruptionCollector from "./collectors/InterruptionCollector";
import MultiplierCollector, {
  MultiplierType,
} from "./collectors/MultiplierCollector";
import ProficiencyCollector from "./collectors/ProficiencyCollector";
import SaveDamageResponseCollector from "./collectors/SaveDamageResponseCollector";
import SuccessResponseCollector from "./collectors/SuccessResponseCollector";
import ValueCollector from "./collectors/ValueCollector";
import DamageMap, { DamageInitialiser } from "./DamageMap";
import DiceBag from "./DiceBag";
import DndRules, { DifficultTerrainRule, ProficiencyRule } from "./DndRules";
import Effect from "./Effect";
import { Dead, Dying, Stable } from "./effects";
import AbilityCheckEvent from "./events/AbilityCheckEvent";
import AfterActionEvent from "./events/AfterActionEvent";
import AreaPlacedEvent from "./events/AreaPlacedEvent";
import AreaRemovedEvent from "./events/AreaRemovedEvent";
import AttackEvent, { AttackDetail } from "./events/AttackEvent";
import BattleStartedEvent from "./events/BattleStartedEvent";
import BeforeAttackEvent, {
  BeforeAttackDetail,
} from "./events/BeforeAttackEvent";
import BeforeCheckEvent from "./events/BeforeCheckEvent";
import BeforeMoveEvent from "./events/BeforeMoveEvent";
import BeforeSaveEvent from "./events/BeforeSaveEvent";
import StartBoundedMoveEvent from "./events/BoundedMoveEvent";
import CheckActionEvent from "./events/CheckActionEvent";
import CheckVisionEvent from "./events/CheckVisionEvent";
import CombatantDamagedEvent from "./events/CombatantDamagedEvent";
import CombatantDiedEvent from "./events/CombatantDiedEvent";
import CombatantHealedEvent from "./events/CombatantHealedEvent";
import CombatantInitiativeEvent from "./events/CombatantInitiativeEvent";
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import CombatantPlacedEvent from "./events/CombatantPlacedEvent";
import DiceRolledEvent, { DiceRolledDetail } from "./events/DiceRolledEvent";
import Dispatcher from "./events/Dispatcher";
import GatherDamageEvent, {
  GatherDamageDetail,
} from "./events/GatherDamageEvent";
import GatherHealEvent, { GatherHealDetail } from "./events/GatherHealEvent";
import GetACEvent from "./events/GetACEvent";
import GetACMethodsEvent from "./events/GetACMethodsEvent";
import GetActionsEvent from "./events/GetActionsEvent";
import GetDamageResponseEvent from "./events/GetDamageResponseEvent";
import GetInitiativeEvent from "./events/GetInitiativeEvent";
import GetMoveCostEvent from "./events/GetMoveCostEvent";
import GetSaveDCEvent, { GetSaveDCDetail } from "./events/GetSaveDCEvent";
import GetTerrainEvent from "./events/GetTerrainEvent";
import SaveEvent from "./events/SaveEvent";
import TextEvent from "./events/TextEvent";
import TurnEndedEvent from "./events/TurnEndedEvent";
import TurnSkippedEvent from "./events/TurnSkippedEvent";
import TurnStartedEvent from "./events/TurnStartedEvent";
import YesNoChoice from "./interruptions/YesNoChoice";
import { MapSquareSize } from "./MapSquare";
import MessageBuilder from "./MessageBuilder";
import { BoundedMove } from "./movement";
import PointSet from "./PointSet";
import AbilityName from "./types/AbilityName";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import DamageBreakdown from "./types/DamageBreakdown";
import DamageResponse from "./types/DamageResponse";
import DamageType from "./types/DamageType";
import DiceType from "./types/DiceType";
import EffectArea, { SpecifiedEffectShape } from "./types/EffectArea";
import { EffectConfig } from "./types/EffectType";
import MoveDirection, { MoveDirections } from "./types/MoveDirection";
import MoveHandler from "./types/MoveHandler";
import MovementType from "./types/MovementType";
import Point from "./types/Point";
import Priority from "./types/Priority";
import RollType, {
  AbilityCheck,
  DamageRoll,
  HealRoll,
  SavingThrow,
} from "./types/RollType";
import SaveDamageResponse from "./types/SaveDamageResponse";
import SaveTag, { svSet } from "./types/SaveTag";
import SaveType from "./types/SaveType";
import Source from "./types/Source";
import Spell from "./types/Spell";
import SpellcastingMethod from "./types/SpellcastingMethod";
import { resolveArea } from "./utils/areas";
import { modulo } from "./utils/numbers";
import { getPathAwayFrom, movePoint } from "./utils/points";
import { SetInitialiser } from "./utils/set";
import { getSquares } from "./utils/units";

export default class Engine {
  combatants: Set<Combatant>;
  effects: Set<EffectArea>;
  private id: number;
  activeCombatant?: Combatant;
  initiativeOrder: Combatant[];
  initiativePosition: number;
  rules: DndRules;
  dice: DiceBag;
  events: Dispatcher;

  constructor() {
    this.dice = new DiceBag();
    this.events = new Dispatcher();
    this.combatants = new Set();
    this.activeCombatant = undefined;
    this.effects = new Set();
    this.id = 0;
    this.initiativeOrder = [];
    this.initiativePosition = NaN;
    this.rules = new DndRules(this);
  }

  reset() {
    this.dice = new DiceBag();
    this.events = new Dispatcher();
    this.combatants.clear();
    this.activeCombatant = undefined;
    this.effects.clear();
    this.id = 0;
    this.initiativeOrder = [];
    this.initiativePosition = NaN;
    this.rules = new DndRules(this);
  }

  nextId() {
    return ++this.id;
  }

  place(who: Combatant, x: number, y: number) {
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
      (a, b) => b.initiative - a.initiative,
    );
    if (!this.initiativeOrder.length) return;

    await this.resolve(
      new BattleStartedEvent({ interrupt: new InterruptionCollector() }),
    );
    await this.nextTurn();
  }

  async rollMany(count: number, e: RollType, critical = false) {
    const rolls = await Promise.all(
      Array(count * (critical ? 2 : 1))
        .fill(null)
        .map(async () => await this.roll(e)),
    );

    return rolls.reduce((acc, roll) => acc + roll.values.final, 0);
  }

  async rollDamage(
    count: number,
    e: Omit<DamageRoll, "type">,
    critical = false,
  ) {
    return this.rollMany(count, { ...e, type: "damage" }, critical);
  }

  async rollHeal(count: number, e: Omit<HealRoll, "type">, critical = false) {
    return this.rollMany(count, { ...e, type: "heal" }, critical);
  }

  async rollInitiative(who: Combatant) {
    const pre = (
      await this.resolve(
        new GetInitiativeEvent({
          who,
          bonus: new BonusCollector(),
          diceType: new DiceTypeCollector(),
          interrupt: new InterruptionCollector(),
        }),
      )
    ).detail;

    const diceType = pre.diceType.result;
    const roll = await this.roll({ type: "initiative", who }, diceType);
    const value = roll.values.final + pre.bonus.result;

    this.fire(
      new CombatantInitiativeEvent({ who, diceType, value, pre, roll }),
    );
    return value;
  }

  private addProficiencyBonus(
    who: Combatant,
    proficiency: ProficiencyCollector,
    bonus: BonusCollector,
    pb: BonusCollector,
  ) {
    const result = proficiency.result;
    if (result) {
      const value = Math.floor(result * (who.pb + pb.result));
      bonus.add(value, ProficiencyRule);
    }
  }

  private async savingThrow<T>(
    dc: number,
    e: Omit<SavingThrow<T>, "dc" | "type">,
    {
      diceType: baseDiceType,
      save,
      fail,
    }: {
      diceType?: DiceType;
      save: SaveDamageResponse;
      fail: SaveDamageResponse;
    } = {
      save: "half",
      fail: "normal",
    },
  ) {
    const successResponse = new SuccessResponseCollector();
    const pb = new BonusCollector();
    const proficiency = new ProficiencyCollector();
    const bonus = new BonusCollector();
    const diceType = new DiceTypeCollector();
    const saveDamageResponse = new SaveDamageResponseCollector(save);
    const failDamageResponse = new SaveDamageResponseCollector(fail);

    if (baseDiceType) diceType.add(baseDiceType, { name: "Base" });

    const pre = (
      await this.resolve(
        new BeforeSaveEvent({
          ...e,
          dc,
          pb,
          proficiency,
          bonus,
          diceType,
          successResponse,
          saveDamageResponse,
          failDamageResponse,
          interrupt: new InterruptionCollector(),
        }),
      )
    ).detail;

    this.addProficiencyBonus(e.who, proficiency, bonus, pb);

    let roll: DiceRolledDetail<SavingThrow> = {
      type: { type: "save", ...e },
      diceType: "normal",
      interrupt: new InterruptionCollector(),
      size: 20,
      values: new ValueCollector(NaN),
    };
    let total = NaN;
    let forced = false;
    let success = false;
    if (successResponse.result !== "normal") {
      success = successResponse.result === "success";
      forced = true;
    } else {
      roll = await this.roll({ type: "save", ...e }, diceType.result);
      total = roll.values.final + bonus.result;
      success = total >= dc;
    }

    const outcome = success ? ("success" as const) : ("fail" as const);
    this.fire(
      new SaveEvent({
        pre,
        diceType: diceType.result,
        roll,
        dc,
        outcome,
        total,
        forced,
      }),
    );

    return {
      roll,
      outcome,
      forced,
      damageResponse: success
        ? saveDamageResponse.result
        : failDamageResponse.result,
    };
  }

  async abilityCheck(dc: number, e: Omit<AbilityCheck, "dc" | "type">) {
    const successResponse = new SuccessResponseCollector();
    const pb = new BonusCollector();
    const proficiency = new ProficiencyCollector();
    const bonus = new BonusCollector();
    const diceType = new DiceTypeCollector();

    const pre = (
      await this.resolve(
        new BeforeCheckEvent({
          ...e,
          dc,
          pb,
          proficiency,
          bonus,
          diceType,
          successResponse,
          interrupt: new InterruptionCollector(),
        }),
      )
    ).detail;

    this.addProficiencyBonus(e.who, proficiency, bonus, pb);

    let forced = false;
    let success = false;
    const roll = await this.roll({ type: "check", ...e }, diceType.result);
    const total = roll.values.final + bonus.result;
    if (successResponse.result !== "normal") {
      success = successResponse.result === "success";
      forced = true;
    } else {
      success = total >= dc;
    }

    const outcome = success ? ("success" as const) : ("fail" as const);
    this.fire(
      new AbilityCheckEvent({
        pre,
        diceType: diceType.result,
        roll,
        dc,
        outcome,
        total,
        forced,
      }),
    );

    return { outcome, forced, total };
  }

  async roll<T extends RollType>(type: T, diceType: DiceType = "normal") {
    const roll = this.dice.roll(type, diceType);

    return (
      await this.resolve(
        new DiceRolledEvent({
          type,
          diceType,
          ...roll,
          interrupt: new InterruptionCollector(),
        }),
      )
    ).detail;
  }

  async nextTurn() {
    if (this.activeCombatant)
      await this.resolve(
        new TurnEndedEvent({
          who: this.activeCombatant,
          interrupt: new InterruptionCollector(),
        }),
      );

    let who = this.initiativeOrder[this.initiativePosition];
    let scan = true;

    while (scan) {
      this.initiativePosition = isNaN(this.initiativePosition)
        ? 0
        : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
      who = this.initiativeOrder[this.initiativePosition];

      // TODO this seems a bit dangerous
      if (!who.conditions.has("Unconscious")) scan = false;
      else {
        who.tickEffects("turnStart");
        await this.resolve(
          new TurnSkippedEvent({ who, interrupt: new InterruptionCollector() }),
        );
        who.tickEffects("turnEnd");
      }
    }

    this.activeCombatant = who;
    who.attacksSoFar = [];
    who.spellsSoFar = [];
    who.movedSoFar = 0;
    await this.resolve(
      new TurnStartedEvent({ who, interrupt: new InterruptionCollector() }),
    );
  }

  async moveInDirection(
    who: Combatant,
    direction: MoveDirection,
    handler: MoveHandler,
    type: MovementType = "speed",
  ) {
    const old = who.position;
    const position = movePoint(old, direction);

    return this.move(who, position, handler, type, direction);
  }

  private async beforeMove(
    who: Combatant,
    to: Point,
    handler: MoveHandler,
    type: MovementType = "speed",
    direction?: MoveDirection,
    simulation?: boolean,
  ) {
    const squares = getSquares(who, to);
    const difficult = new DifficultTerrainCollector();
    for (const where of squares) this.getTerrain(where, who, difficult);

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
        difficult,
      }),
    );

    if (difficult.result.size) multiplier.add("double", DifficultTerrainRule);

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
        simulation,
      }),
    );
    handler.check?.(pre);

    return pre.detail;
  }

  async move(
    who: Combatant,
    position: Point,
    handler: MoveHandler,
    type: MovementType = "speed",
    direction?: MoveDirection,
  ) {
    const old = who.position;

    const { success, error, cost } = await this.beforeMove(
      who,
      position,
      handler,
      type,
      direction,
    );

    if (success.result === "fail") return { type: "prevented" as const };
    if (!error.result) return { type: "error" as const, error };

    who.position = position;
    const handlerDone = handler.onMove(who, cost);

    await this.resolve(
      new CombatantMovedEvent({
        who,
        old,
        position,
        handler,
        type,
        interrupt: new InterruptionCollector(),
      }),
    );

    if (handlerDone) return { type: "unbind" as const };
    return { type: "ok" as const };
  }

  private async applyDamage(
    damage: DamageMap,
    data: {
      source: Source;
      spell?: Spell;
      method?: SpellcastingMethod;
      attack?: AttackDetail;
      attacker?: Combatant;
      who: Combatant;
      multiplier: number;
    },
  ) {
    const { total, healAmount, breakdown } = this.calculateDamage(damage, data);

    if (healAmount > 0) {
      await this.applyHeal(data.who, healAmount, data.who);
    }

    if (total < 1) return;

    const { takenByTemporaryHP, afterTemporaryHP, temporaryHPSource } =
      this.applyTemporaryHP(data.who, total);

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
        interrupt: new InterruptionCollector(),
      }),
    );

    if (data.who.hp <= 0) {
      await this.handleCombatantDeath(data.who, data.attacker);
    } else if (data.who.concentratingOn.size) {
      await this.handleConcentrationCheck(data.who, total);
    }
  }

  private calculateDamage(
    damage: DamageMap,
    data: {
      source: Source;
      spell?: Spell;
      method?: SpellcastingMethod;
      who: Combatant;
      multiplier: number;
      attack?: AttackDetail;
    },
  ) {
    let total = 0;
    let healAmount = 0;
    const breakdown = new Map<DamageType, DamageBreakdown>();

    for (const [damageType, raw] of damage) {
      const { response, amount } = this.calculateDamageResponse(
        damageType,
        raw,
        data,
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

  private calculateDamageResponse(
    damageType: DamageType,
    raw: number,
    data: {
      source: Source;
      spell?: Spell;
      method?: SpellcastingMethod;
      who: Combatant;
      multiplier: number;
      attack?: AttackDetail;
    },
  ) {
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
        response: collector,
      }),
    );

    const { response, amount } = this.calculateDamageAmount(
      raw,
      collector.result,
      data.multiplier,
    );

    return { response, amount };
  }

  private calculateDamageAmount(
    raw: number,
    response: DamageResponse,
    baseMultiplier: number,
  ) {
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

  private applyTemporaryHP(target: Combatant, totalDamage: number) {
    const takenByTemporaryHP = Math.min(totalDamage, target.temporaryHP);
    target.temporaryHP -= takenByTemporaryHP;
    const afterTemporaryHP = totalDamage - takenByTemporaryHP;
    target.hp -= afterTemporaryHP;
    const temporaryHPSource = target.temporaryHPSource;

    if (target.temporaryHP <= 0) {
      target.temporaryHPSource = undefined;
    }

    return { takenByTemporaryHP, afterTemporaryHP, temporaryHPSource };
  }

  private async handleCombatantDeath(target: Combatant, attacker?: Combatant) {
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

  private async handleConcentrationCheck(
    target: Combatant,
    totalDamage: number,
  ) {
    const dc = Math.max(10, Math.floor(totalDamage / 2));
    // TODO update to this.save() ?
    const result = await this.savingThrow(dc, {
      attacker: target,
      who: target,
      ability: "con",
      tags: svSet("concentration"),
    });

    if (result.outcome === "fail") {
      await target.endConcentration();
    }
  }

  async kill(target: Combatant, attacker?: Combatant) {
    const result = await target.addEffect(Dead, { duration: Infinity });
    if (result) {
      this.combatants.delete(target);
      this.fire(new CombatantDiedEvent({ who: target, attacker }));
    }

    return result;
  }

  async failDeathSave(who: Combatant, count = 1, attacker?: Combatant) {
    who.deathSaveFailures += count;
    if (who.deathSaveFailures >= 3) await this.kill(who, attacker);
  }

  async succeedDeathSave(who: Combatant) {
    who.deathSaveSuccesses++;
    if (who.deathSaveSuccesses >= 3) {
      await who.removeEffect(Dying);

      who.deathSaveFailures = 0;
      who.deathSaveSuccesses = 0;
      await who.addEffect(Stable, { duration: Infinity });
    }
  }

  getAttackOutcome(ac: number, roll: number, total: number) {
    // If the d20 roll for an attack is a 1, the attack misses regardless of any modifiers or the target's AC.
    return roll === 1
      ? "miss"
      : // If the d20 roll for an attack is a 20, the attack hits regardless of any modifiers or the target's AC.
        roll === 20
        ? "critical"
        : // To make an attack roll, roll a d20 and add the appropriate modifiers. If the total of the roll plus modifiers equals or exceeds the target's Armor Class (AC), the attack hits.
          total >= ac
          ? "hit"
          : "miss";
  }

  async attack(
    e: Omit<
      BeforeAttackDetail,
      "pb" | "proficiency" | "bonus" | "diceType" | "interrupt" | "success"
    >,
    config: { source?: Source; bonus?: number; diceType?: DiceType } = {},
  ) {
    const pb = new BonusCollector();
    const proficiency = new ProficiencyCollector();
    const bonus = new BonusCollector();
    const diceType = new DiceTypeCollector();
    const success = new SuccessResponseCollector();

    if (config.source) {
      if (config.bonus) bonus.add(config.bonus, config.source);
      if (config.diceType) diceType.add(config.diceType, config.source);
    }

    const pre = (
      await this.resolve(
        new BeforeAttackEvent({
          ...e,
          pb,
          proficiency,
          bonus,
          diceType,
          success,
          interrupt: new InterruptionCollector(),
        }),
      )
    ).detail;
    if (success.result === "fail")
      return { outcome: "cancelled", hit: false } as const;

    this.addProficiencyBonus(e.who, proficiency, bonus, pb);

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
      interrupt: new InterruptionCollector(),
    });
    outcomeCollector.setDefaultGetter(() =>
      this.getAttackOutcome(
        event.detail.ac,
        event.detail.roll.values.final,
        event.detail.total,
      ),
    );

    const attack = await this.resolve(event);
    const outcome = outcomeCollector.result;

    return {
      outcome,
      attack: attack.detail,
      hit: outcome === "hit" || outcome === "critical",
      critical: outcome === "critical",
      victim: roll.type.target,
    } as const;
  }

  async damage(
    source: Source,
    damageType: DamageType,
    e: MarkOptional<
      Omit<GatherDamageDetail, "map" | "bonus" | "interrupt" | "multiplier">,
      "critical"
    >,
    damageInitialiser: DamageInitialiser = [],
    startingMultiplier?: MultiplierType,
  ) {
    // TODO should we go through the motions here in case something ignores it?
    if (startingMultiplier === "zero") return;

    const map = new DamageMap(damageInitialiser);
    const multiplier = new MultiplierCollector();
    if (typeof startingMultiplier !== "undefined")
      multiplier.add(startingMultiplier, source);

    const bonus = new BonusCollector();
    await this.resolve(
      new GatherDamageEvent({
        critical: false,
        ...e,
        map,
        bonus,
        multiplier,
        interrupt: new InterruptionCollector(),
      }),
    );

    map.add(damageType, bonus.result);
    return this.applyDamage(map, {
      source,
      spell: e.spell,
      method: e.method,
      attack: e.attack,
      attacker: e.attacker,
      who: e.target,
      multiplier: multiplier.result,
    });
  }

  /** @deprecated use `checkConfig` or `getConfigErrors` instead */
  check<T extends object>(action: Action<T>, config: Partial<T>) {
    const error = new ErrorCollector();
    this.fire(new CheckActionEvent({ action, config, error }));
    action.check(config, error);
    return error;
  }

  async act<T extends object>(action: Action<T>, config: T) {
    await action.apply(config);

    return this.resolve(
      new AfterActionEvent({
        action,
        config,
        interrupt: new InterruptionCollector(),
      }),
    );
  }

  getActions(who: Combatant, target?: Combatant) {
    return this.fire(new GetActionsEvent({ who, target, actions: [] })).detail
      .actions;
  }

  getBestACMethod(who: Combatant) {
    return this.fire(
      new GetACMethodsEvent({
        who,
        methods: [who.baseACMethod],
      }),
    ).detail.methods.reduce(
      (best, method) => (method.ac > best.ac ? method : best),
      who.baseACMethod,
    );
  }

  async getAC(who: Combatant, pre?: BeforeAttackDetail) {
    const method = this.getBestACMethod(who);

    const e = await this.resolve(
      new GetACEvent({
        who,
        method,
        bonus: new BonusCollector(),
        interrupt: new InterruptionCollector(),
        pre,
      }),
    );

    return method.ac + e.detail.bonus.result;
  }

  fire<T>(e: CustomEvent<T>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any).detail.interrupt)
      throw new Error(
        `Use Engine.resolve() on an interruptible event type: ${e.type}`,
      );

    this.events.fire(e);
    return e;
  }

  async resolve<T extends { interrupt: InterruptionCollector }>(
    e: CustomEvent<T>,
  ): Promise<CustomEvent<T>> {
    this.events.fire(e);

    for (const interruption of e.detail.interrupt) {
      if (interruption.isStillValid && !interruption.isStillValid()) continue;

      await interruption.apply(this);
    }

    return e;
  }

  addEffectArea(area: EffectArea) {
    area.id = this.nextId();
    this.effects.add(area);
    this.fire(new AreaPlacedEvent({ area }));

    if (area.handler) this.events.on("GetTerrain", area.handler);
  }

  removeEffectArea(area: EffectArea) {
    this.effects.delete(area);
    this.fire(new AreaRemovedEvent({ area }));

    if (area.handler) this.events.off("GetTerrain", area.handler);
  }

  getInside(area: SpecifiedEffectShape, ignore: Combatant[] = []) {
    const points = resolveArea(area);
    const inside: Combatant[] = [];

    for (const who of this.combatants) {
      if (ignore.includes(who)) continue;
      const squares = new PointSet(getSquares(who, who.position));

      if (points.overlaps(squares)) inside.push(who);
    }

    return inside;
  }

  async applyBoundedMove(who: Combatant, handler: MoveHandler) {
    return new Promise<void>((resolve) =>
      this.fire(new StartBoundedMoveEvent({ who, handler, resolve })),
    );
  }

  async heal(
    source: Source,
    amount: number,
    e: Omit<GatherHealDetail, "bonus" | "interrupt" | "multiplier">,
    startingMultiplier?: MultiplierType,
  ) {
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
        interrupt: new InterruptionCollector(),
      }),
    );

    const total = bonus.result * multiplier.result;
    return this.applyHeal(gather.detail.target, total, gather.detail.actor);
  }

  async applyHeal(who: Combatant, fullAmount: number, actor?: Combatant) {
    if (fullAmount < 1) return;

    const amount = Math.min(fullAmount, who.hpMax - who.hp);
    who.hp += amount;

    return this.resolve(
      new CombatantHealedEvent({
        who,
        actor,
        amount,
        fullAmount,
        interrupt: new InterruptionCollector(),
      }),
    );
  }

  async giveTemporaryHP(who: Combatant, count: number, source: Source) {
    // TODO skip this dialog if it's obvious (same source, more hp?)
    if (who.temporaryHP > 0)
      return new YesNoChoice(
        who,
        source,
        `Replace Temporary HP?`,
        `${who.name} already has ${who.temporaryHP} temporary HP from ${who.temporaryHPSource?.name}. Replace with ${count} temporary HP from ${source.name}?`,
        Priority.Normal,
        async () => this.setTemporaryHP(who, count, source),
      ).apply(this);

    this.setTemporaryHP(who, count, source);
    return true;
  }

  private setTemporaryHP(who: Combatant, count: number, source?: Source) {
    who.temporaryHP = count;
    who.temporaryHPSource = source;
  }

  canSee(who: Combatant, target: Combatant) {
    return this.fire(
      new CheckVisionEvent({ who, target, error: new ErrorCollector() }),
    ).detail.error.result;
  }

  async getSaveDC(e: Omit<GetSaveDCDetail, "bonus" | "interrupt">) {
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
      new GetSaveDCEvent({ ...e, bonus, interrupt }),
    );
    return result.detail;
  }

  async save<E extends object>({
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
    diceType,
  }: EngineSaveConfig<E>) {
    const dcRoll = await this.getSaveDC({
      type,
      source,
      who: attacker,
      target: who,
      ability,
      spell,
      method,
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
        tags: new Set(tags),
      },
      { save, fail, diceType },
    );

    return { ...result, dcRoll };
  }

  text(message: MessageBuilder) {
    this.fire(new TextEvent({ message }));
  }

  async forcePush(
    who: Combatant,
    away: Combatant,
    dist: number,
    source: Source,
  ) {
    const path = getPathAwayFrom(who.position, away.position, dist);
    const handler = new BoundedMove(source, Infinity, { forced: true });
    for (const point of path) {
      const result = await this.move(who, point, handler);
      if (result.type !== "ok") break;
    }
  }

  async getValidMoves(who: Combatant, handler: MoveHandler) {
    const valid: MoveDirection[] = [];

    for (const direction of MoveDirections) {
      const old = who.position;
      const position = movePoint(old, direction);

      const { success, error } = await this.beforeMove(
        who,
        position,
        handler,
        "speed",
        direction,
        true,
      );

      if (success.result !== "fail" && error.result) valid.push(direction);
    }

    return valid;
  }

  getTerrain(
    where: Point,
    who: Combatant,
    difficult = new DifficultTerrainCollector(),
  ) {
    // TODO static terrain entries

    return this.fire(new GetTerrainEvent({ where, who, difficult })).detail;
  }
}

export type EngineAttackResult = ReturnType<Engine["attack"]>;

export type EngineMoveResult = ReturnType<Engine["move"]>;

export interface EngineSaveConfig<E extends object> {
  source: Source;
  type: SaveType;
  attacker?: Combatant;
  who: Combatant;
  ability?: AbilityName;
  spell?: Spell;
  method?: SpellcastingMethod;
  effect?: Effect<E>;
  config?: EffectConfig<E>;
  tags?: SetInitialiser<SaveTag>;
  save?: SaveDamageResponse;
  fail?: SaveDamageResponse;
  diceType?: DiceType;
}
