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
import { Dead } from "./effects";
import AbilityCheckEvent from "./events/AbilityCheckEvent";
import AfterActionEvent from "./events/AfterActionEvent";
import AreaPlacedEvent from "./events/AreaPlacedEvent";
import AreaRemovedEvent from "./events/AreaRemovedEvent";
import AttackEvent, { AttackEventDetail } from "./events/AttackEvent";
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
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import CombatantPlacedEvent from "./events/CombatantPlacedEvent";
import DiceRolledEvent from "./events/DiceRolledEvent";
import Dispatcher from "./events/Dispatcher";
import GatherDamageEvent, {
  GatherDamageDetail,
} from "./events/GatherDamageEvent";
import GetACMethodsEvent from "./events/GetACMethodsEvent";
import GetActionsEvent from "./events/GetActionsEvent";
import GetDamageResponseEvent from "./events/GetDamageResponseEvent";
import GetInitiativeEvent from "./events/GetInitiativeEvent";
import GetMoveCostEvent from "./events/GetMoveCostEvent";
import SaveEvent from "./events/SaveEvent";
import TurnEndedEvent from "./events/TurnEndedEvent";
import TurnStartedEvent from "./events/TurnStartedEvent";
import { MapSquareSize } from "./MapSquare";
import PointSet from "./PointSet";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CombatantState from "./types/CombatantState";
import DamageBreakdown from "./types/DamageBreakdown";
import DamageType from "./types/DamageType";
import DiceType from "./types/DiceType";
import EffectArea, { SpecifiedEffectShape } from "./types/EffectArea";
import MoveDirection from "./types/MoveDirection";
import MoveHandler from "./types/MoveHandler";
import MovementType from "./types/MovementType";
import RollType, {
  AbilityCheck,
  DamageRoll,
  SavingThrow,
} from "./types/RollType";
import SaveDamageResponse from "./types/SaveDamageResponse";
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

  constructor(public dice = new DiceBag(), public events = new Dispatcher()) {
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
      ([, a], [, b]) => b.initiative - a.initiative
    );
    await this.nextTurn();
  }

  async rollDamage(
    count: number,
    e: Omit<DamageRoll, "type">,
    critical = false
  ) {
    let total = 0;

    for (let i = 0; i < count * (critical ? 2 : 1); i++) {
      const roll = await this.roll({ ...e, type: "damage" });
      total += roll.value;
    }

    return total;
  }

  async rollInitiative(who: Combatant) {
    const gi = await this.resolve(
      new GetInitiativeEvent({
        who,
        bonus: new BonusCollector(),
        diceType: new DiceTypeCollector(),
        interrupt: new InterruptionCollector(),
      })
    );

    const roll = await this.roll(
      { type: "initiative", who },
      gi.detail.diceType.result
    );
    return roll.value + gi.detail.bonus.result;
  }

  async savingThrow(
    dc: number,
    e: Omit<SavingThrow, "dc" | "type">,
    { save, fail }: { save: SaveDamageResponse; fail: SaveDamageResponse } = {
      save: "half",
      fail: "normal",
    }
  ) {
    const successResponse = new SuccessResponseCollector();
    const bonus = new BonusCollector();
    const diceType = new DiceTypeCollector();
    const saveDamageResponse = new SaveDamageResponseCollector(save);
    const failDamageResponse = new SaveDamageResponseCollector(fail);

    const pre = this.fire(
      new BeforeSaveEvent({
        ...e,
        dc,
        bonus,
        diceType,
        successResponse,
        saveDamageResponse,
        failDamageResponse,
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

    const outcome = success ? ("success" as const) : ("fail" as const);
    this.fire(
      new SaveEvent({ pre: pre.detail, roll, dc, outcome, total, forced })
    );

    return {
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

    const pre = this.fire(
      new BeforeCheckEvent({ ...e, dc, bonus, diceType, successResponse })
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
        roll,
        dc,
        outcome,
        total,
        forced,
      })
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
        })
      )
    ).detail;
  }

  async nextTurn() {
    if (this.activeCombatant)
      await this.resolve(
        new TurnEndedEvent({
          who: this.activeCombatant,
          interrupt: new InterruptionCollector(),
        })
      );

    let who = this.initiativeOrder[this.initiativePosition];
    let scan = true;

    while (scan) {
      this.initiativePosition = isNaN(this.initiativePosition)
        ? 0
        : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
      who = this.initiativeOrder[this.initiativePosition];

      if (!who.hasEffect(Dead)) scan = false;
      else {
        who.tickEffects("turnStart");
        who.tickEffects("turnEnd");
      }
    }

    this.activeCombatant = who;
    who.attacksSoFar.clear();
    who.movedSoFar = 0;
    await this.resolve(
      new TurnStartedEvent({ who, interrupt: new InterruptionCollector() })
    );
  }

  async move(
    who: Combatant,
    direction: MoveDirection,
    handler: MoveHandler,
    type: MovementType = "speed"
  ) {
    const state = this.combatants.get(who);
    if (!state) return { type: "invalid" as const };

    const old = state.position;
    const position = movePoint(old, direction);

    const error = new ErrorCollector();
    const pre = await this.resolve(
      new BeforeMoveEvent({
        who,
        from: old,
        direction,
        to: position,
        handler,
        type,
        error,
        interrupt: new InterruptionCollector(),
      })
    );
    if (pre.defaultPrevented) return { type: "prevented" as const };
    if (!error.result) return { type: "error" as const, error };

    const multiplier = new MultiplierCollector();
    this.fire(
      new GetMoveCostEvent({
        who,
        from: old,
        direction,
        to: position,
        handler,
        type,
        multiplier,
      })
    );

    state.position = position;
    await this.resolve(
      new CombatantMovedEvent({
        who,
        direction,
        old,
        position,
        handler,
        type,
        interrupt: new InterruptionCollector(),
      })
    );

    const handlerDone = handler.onMove(who, multiplier.result * MapSquareSize);
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
      attack?: AttackEventDetail;
      attacker: Combatant;
      target: Combatant;
      multiplier?: number;
    }
  ) {
    let total = 0;

    const breakdown = new Map<DamageType, DamageBreakdown>();

    for (const [damageType, raw] of damage) {
      const collector = new DamageResponseCollector();
      this.fire(
        new GetDamageResponseEvent({
          attack,
          who: target,
          damageType,
          response: collector,
        })
      );

      const response = collector.result;
      if (response === "immune") continue;
      // TODO [ABSORB]

      let multiplier = baseMultiplier;
      if (response === "resist") multiplier *= 0.5;
      else if (response === "vulnerable") multiplier *= 2;

      const amount = Math.ceil(raw * multiplier);
      breakdown.set(damageType, { response, raw, amount });
      total += amount;
    }

    if (total < 1) return;

    target.hp -= total;
    await this.resolve(
      new CombatantDamagedEvent({
        who: target,
        attacker,
        total,
        breakdown,
        interrupt: new InterruptionCollector(),
      })
    );

    if (target.hp <= 0) {
      if (target.diesAtZero) {
        this.combatants.delete(target);
        target.addEffect(Dead, { duration: Infinity });
        this.fire(new CombatantDiedEvent({ who: target, attacker }));
      } else {
        // TODO [DYING]
      }
    }
  }

  async attack(
    e: Omit<BeforeAttackDetail, "bonus" | "diceType" | "interrupt">
  ) {
    const pre = await this.resolve(
      new BeforeAttackEvent({
        ...e,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
        interrupt: new InterruptionCollector(),
      })
    );
    if (pre.defaultPrevented)
      return { outcome: "cancelled", hit: false } as const;

    const roll = await this.roll(
      {
        type: "attack",
        who: e.who,
        target: e.target,
        ac: e.target.ac,
        ability: e.ability,
      },
      pre.detail.diceType.result
    );

    const total = roll.value + pre.detail.bonus.result;

    const attack = this.fire(
      new AttackEvent({
        pre: pre.detail,
        roll,
        total,
        ac: e.target.ac,
        outcome:
          roll.value === 1
            ? "miss"
            : roll.value === 20
            ? "critical"
            : total >= e.target.ac
            ? "hit"
            : "miss",
        forced: false, // TODO
      })
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
    startingMultiplier?: MultiplierType
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
      })
    );

    map.add(damageType, gather.detail.bonus.result);
    await this.applyDamage(map, {
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
    return error;
  }

  async act<T extends object>(action: Action<T>, config: T) {
    await action.apply(config);

    return this.resolve(
      new AfterActionEvent({
        action,
        config,
        interrupt: new InterruptionCollector(),
      })
    );
  }

  getActions(who: Combatant, target?: Combatant) {
    return this.fire(new GetActionsEvent({ who, target, actions: [] })).detail
      .actions;
  }

  getAC(who: Combatant) {
    return this.fire(
      new GetACMethodsEvent({ who, methods: [] })
    ).detail.methods.reduce(
      (best, method) => (method.ac > best ? method.ac : best),
      0
    );
  }

  fire<T>(e: CustomEvent<T>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any).interrupt)
      throw new Error(
        `Use Engine.resolve() on an interruptible event type: ${e.type}`
      );

    this.events.fire(e);
    return e;
  }

  async resolve<T extends { interrupt: InterruptionCollector }>(
    e: CustomEvent<T>
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

  getInside(area: SpecifiedEffectShape) {
    const points = resolveArea(area);
    const inside: Combatant[] = [];

    for (const [combatant, state] of this.combatants) {
      const squares = new PointSet(getSquares(combatant, state.position));

      if (points.overlaps(squares)) inside.push(combatant);
    }

    return inside;
  }

  async applyBoundedMove(who: Combatant, handler: MoveHandler) {
    return new Promise<void>((resolve) =>
      this.fire(new StartBoundedMoveEvent({ who, handler, resolve }))
    );
  }
}
