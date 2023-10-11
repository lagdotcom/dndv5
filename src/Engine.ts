import { MarkOptional } from "ts-essentials";

import BonusCollector from "./collectors/BonusCollector";
import DamageResponseCollector from "./collectors/DamageResponseCollector";
import DiceTypeCollector from "./collectors/DiceTypeCollector";
import ErrorCollector from "./collectors/ErrorCollector";
import InterruptionCollector from "./collectors/InterruptionCollector";
import MultiplierCollector, {
  MultiplierType,
} from "./collectors/MultiplierCollector";
import SaveDamageResponseCollector from "./collectors/SaveDamageResponseCollector";
import SuccessResponseCollector from "./collectors/SuccessResponseCollector";
import DamageMap, { DamageInitialiser } from "./DamageMap";
import DiceBag from "./DiceBag";
import DndRules from "./DndRules";
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
import CombatantDamagedEvent from "./events/CombatantDamagedEvent";
import CombatantDiedEvent from "./events/CombatantDiedEvent";
import CombatantHealedEvent from "./events/CombatantHealedEvent";
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import CombatantPlacedEvent from "./events/CombatantPlacedEvent";
import DiceRolledEvent from "./events/DiceRolledEvent";
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
import SaveEvent from "./events/SaveEvent";
import TurnEndedEvent from "./events/TurnEndedEvent";
import TurnSkippedEvent from "./events/TurnSkippedEvent";
import TurnStartedEvent from "./events/TurnStartedEvent";
import YesNoChoice from "./interruptions/YesNoChoice";
import { MapSquareSize } from "./MapSquare";
import PointSet from "./PointSet";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CombatantState from "./types/CombatantState";
import DamageBreakdown from "./types/DamageBreakdown";
import DamageResponse from "./types/DamageResponse";
import DamageType from "./types/DamageType";
import DiceType from "./types/DiceType";
import EffectArea, { SpecifiedEffectShape } from "./types/EffectArea";
import MoveDirection from "./types/MoveDirection";
import MoveHandler from "./types/MoveHandler";
import MovementType from "./types/MovementType";
import Point from "./types/Point";
import RollType, {
  AbilityCheck,
  DamageRoll,
  HealRoll,
  SavingThrow,
} from "./types/RollType";
import SaveDamageResponse from "./types/SaveDamageResponse";
import { svSet } from "./types/SaveTag";
import Source from "./types/Source";
import { resolveArea } from "./utils/areas";
import { orderedKeys } from "./utils/map";
import { modulo } from "./utils/numbers";
import { movePoint } from "./utils/points";
import { getSquares } from "./utils/units";

export default class Engine {
  combatants: Map<Combatant, CombatantState>;
  effects: Set<EffectArea>;
  private id: number;
  activeCombatant?: Combatant;
  initiativeOrder: Combatant[];
  initiativePosition: number;
  rules: DndRules;

  constructor(
    public dice = new DiceBag(),
    public events = new Dispatcher(),
  ) {
    this.combatants = new Map();
    this.effects = new Set();
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
      ([, a], [, b]) => b.initiative - a.initiative,
    );

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

    return rolls.reduce((acc, roll) => acc + roll.value, 0);
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
    const gi = await this.resolve(
      new GetInitiativeEvent({
        who,
        bonus: new BonusCollector(),
        diceType: new DiceTypeCollector(),
        interrupt: new InterruptionCollector(),
      }),
    );

    const roll = await this.roll(
      { type: "initiative", who },
      gi.detail.diceType.result,
    );
    return roll.value + gi.detail.bonus.result;
  }

  async savingThrow<T = object>(
    dc: number,
    e: Omit<SavingThrow<T>, "dc" | "type">,
    { save, fail }: { save: SaveDamageResponse; fail: SaveDamageResponse } = {
      save: "half",
      fail: "normal",
    },
  ) {
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
        interrupt: new InterruptionCollector(),
      }),
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

    const outcome = success ? ("success" as const) : ("fail" as const);
    this.fire(
      new SaveEvent({
        pre: pre.detail,
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
    const bonus = new BonusCollector();
    const diceType = new DiceTypeCollector();

    const pre = await this.resolve(
      new BeforeCheckEvent({
        ...e,
        dc,
        bonus,
        diceType,
        successResponse,
        interrupt: new InterruptionCollector(),
      }),
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

    const outcome = success ? ("success" as const) : ("fail" as const);
    this.fire(
      new AbilityCheckEvent({
        pre: pre.detail,
        diceType: diceType.result,
        roll,
        dc,
        outcome,
        total,
        forced,
      }),
    );

    return { outcome, forced };
  }

  async roll<T extends RollType>(type: T, diceType: DiceType = "normal") {
    const roll = this.dice.roll(type, diceType);

    // TODO can a roll be cancelled?
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
    const state = this.getState(who);
    const old = state.position;
    const position = movePoint(old, direction);

    return this.move(who, position, handler, type);
  }

  async move(
    who: Combatant,
    position: Point,
    handler: MoveHandler,
    type: MovementType = "speed",
  ) {
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
        success: new SuccessResponseCollector(),
      }),
    );
    if (pre.detail.success.result === "fail")
      return { type: "prevented" as const };
    if (!error.result) return { type: "error" as const, error };

    const multiplier = new MultiplierCollector();
    this.fire(
      new GetMoveCostEvent({
        who,
        from: old,
        to: position,
        handler,
        type,
        multiplier,
      }),
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
        interrupt: new InterruptionCollector(),
      }),
    );

    if (handlerDone) return { type: "unbind" as const };
    return { type: "ok" as const };
  }

  private async applyDamage(
    damage: DamageMap,
    {
      attack,
      attacker,
      multiplier: baseMultiplier = 1,
      target,
    }: {
      source: Source;
      attack?: AttackDetail;
      attacker: Combatant;
      target: Combatant;
      multiplier?: number;
    },
  ) {
    const { totalDamage, healAmount, damageBreakdown } = this.calculateDamage(
      damage,
      target,
      baseMultiplier,
      attack,
    );

    if (healAmount > 0) {
      await this.applyHeal(target, healAmount, target);
    }

    if (totalDamage < 1) return;

    const { takenByTemporaryHP, afterTemporaryHP } = this.applyTemporaryHP(
      target,
      totalDamage,
    );

    await this.resolve(
      new CombatantDamagedEvent({
        who: target,
        attack,
        attacker,
        total: totalDamage,
        takenByTemporaryHP,
        afterTemporaryHP,
        temporaryHPSource: target.temporaryHPSource,
        breakdown: damageBreakdown,
        interrupt: new InterruptionCollector(),
      }),
    );

    if (target.hp <= 0) {
      await this.handleCombatantDeath(target, attacker);
    } else if (target.concentratingOn.size) {
      await this.handleConcentrationCheck(target, totalDamage);
    }
  }

  private calculateDamage(
    damage: DamageMap,
    target: Combatant,
    baseMultiplier: number,
    attack?: AttackDetail,
  ) {
    let totalDamage = 0;
    let healAmount = 0;
    const damageBreakdown = new Map<DamageType, DamageBreakdown>();

    for (const [damageType, raw] of damage) {
      const collector = this.calculateDamageResponse(
        damageType,
        raw,
        target,
        baseMultiplier,
        attack,
      );

      const { response, amount } = collector;

      if (response === "absorb") {
        healAmount += raw;
      } else {
        totalDamage += amount;
      }

      damageBreakdown.set(damageType, { response, raw, amount });
    }

    return { totalDamage, healAmount, damageBreakdown };
  }

  private calculateDamageResponse(
    damageType: DamageType,
    raw: number,
    target: Combatant,
    baseMultiplier: number,
    attack?: AttackDetail,
  ) {
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
        response: collector,
      }),
    );

    const { response, amount } = this.calculateDamageAmount(
      raw,
      collector.result,
      baseMultiplier,
    );

    return { response, amount };
  }

  private calculateDamageAmount(
    raw: number,
    response: DamageResponse,
    baseMultiplier: number,
  ) {
    let amount = raw;

    if (response === "absorb") {
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

    if (target.temporaryHP <= 0) {
      target.temporaryHPSource = undefined;
    }

    return { takenByTemporaryHP, afterTemporaryHP };
  }

  private async handleCombatantDeath(target: Combatant, attacker: Combatant) {
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
    const result = await this.savingThrow(dc, {
      attacker: target,
      who: target,
      ability: "con",
      tags: svSet("concentration"),
    });

    if (result.outcome === "fail") {
      target.endConcentration();
    }
  }

  async kill(target: Combatant, attacker?: Combatant) {
    this.combatants.delete(target);
    await target.addEffect(Dead, { duration: Infinity });
    this.fire(new CombatantDiedEvent({ who: target, attacker }));
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

  async attack(
    e: Omit<BeforeAttackDetail, "bonus" | "diceType" | "interrupt" | "success">,
  ) {
    const pre = await this.resolve(
      new BeforeAttackEvent({
        ...e,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
        interrupt: new InterruptionCollector(),
        success: new SuccessResponseCollector(),
      }),
    );
    if (pre.detail.success.result === "fail")
      return { outcome: "cancelled", hit: false } as const;

    const ac = await this.getAC(e.target, pre.detail);

    const roll = await this.roll(
      {
        type: "attack",
        who: e.who,
        target: e.target,
        ac,
        ability: e.ability,
      },
      pre.detail.diceType.result,
    );

    const total = roll.value + pre.detail.bonus.result;

    const attack = await this.resolve(
      new AttackEvent({
        pre: pre.detail,
        roll,
        total,
        ac,
        outcome:
          roll.value === 1
            ? "miss"
            : roll.value === 20
            ? "critical"
            : total >= ac
            ? "hit"
            : "miss",
        forced: false, // TODO
        interrupt: new InterruptionCollector(),
      }),
    );
    const { outcome } = attack.detail;
    return {
      outcome,
      attack: attack.detail,
      hit: outcome === "hit" || outcome === "critical",
      critical: outcome === "critical",
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
    // just skip it lol
    if (startingMultiplier === "zero") return;

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
        multiplier,
      }),
    );

    map.add(damageType, gather.detail.bonus.result);
    return this.applyDamage(map, {
      source,
      attack: e.attack,
      attacker: e.attacker,
      target: e.target,
      multiplier: multiplier.result,
    });
  }

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
    if ((e as any).interrupt)
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

    for (const interruption of e.detail.interrupt)
      await interruption.apply(this);

    return e;
  }

  getState(who: Combatant) {
    return (
      this.combatants.get(who) ?? {
        initiative: NaN,
        position: { x: NaN, y: NaN },
      }
    );
  }

  addEffectArea(area: EffectArea) {
    area.id = this.nextId();
    this.effects.add(area);
    this.fire(new AreaPlacedEvent({ area }));
  }

  removeEffectArea(area: EffectArea) {
    this.effects.delete(area);
    this.fire(new AreaRemovedEvent({ area }));
  }

  getInside(area: SpecifiedEffectShape, ignore: Combatant[] = []) {
    const points = resolveArea(area);
    const inside: Combatant[] = [];

    for (const [combatant, state] of this.combatants) {
      if (ignore.includes(combatant)) continue;
      const squares = new PointSet(getSquares(combatant, state.position));

      if (points.overlaps(squares)) inside.push(combatant);
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
        async () => this.setTemporaryHP(who, count, source),
      ).apply(this);

    this.setTemporaryHP(who, count, source);
    return true;
  }

  private setTemporaryHP(who: Combatant, count: number, source?: Source) {
    who.temporaryHP = count;
    who.temporaryHPSource = source;
  }
}

export type EngineMoveResult = ReturnType<Engine["move"]>;
