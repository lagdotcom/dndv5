import { MarkOptional } from "ts-essentials";

import BonusCollector from "./collectors/BonusCollector";
import DamageResponseCollector from "./collectors/DamageResponseCollector";
import DiceTypeCollector from "./collectors/DiceTypeCollector";
import InterruptionCollector from "./collectors/InterruptionCollector";
import MultiplierCollector from "./collectors/MultiplierCollector";
import DamageMap, { DamageInitialiser } from "./DamageMap";
import DiceBag from "./DiceBag";
import DndRules from "./DndRules";
import { Dead } from "./effects";
import AreaPlacedEvent from "./events/AreaPlacedEvent";
import AreaRemovedEvent from "./events/AreaRemovedEvent";
import AttackEvent from "./events/AttackEvent";
import BeforeAttackEvent from "./events/BeforeAttackEvent";
import BeforeSaveEvent from "./events/BeforeSaveEvent";
import CombatantDamagedEvent from "./events/CombatantDamagedEvent";
import CombatantDiedEvent from "./events/CombatantDiedEvent";
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import CombatantPlacedEvent from "./events/CombatantPlacedEvent";
import DiceRolledEvent from "./events/DiceRolledEvent";
import Dispatcher from "./events/Dispatcher";
import EventData from "./events/EventData";
import GatherDamageEvent from "./events/GatherDamageEvent";
import GetACMethodsEvent from "./events/GetACMethodsEvent";
import GetActionsEvent from "./events/GetActionsEvent";
import GetDamageResponseEvent from "./events/GetDamageResponseEvent";
import ListChoiceEvent from "./events/ListChoiceEvent";
import TurnEndedEvent from "./events/TurnEndedEvent";
import TurnStartedEvent from "./events/TurnStartedEvent";
import YesNoChoiceEvent from "./events/YesNoChoiceEvent";
import PickFromListChoice from "./interruptions/PickFromListChoice";
import YesNoChoice from "./interruptions/YesNoChoice";
import PointSet from "./PointSet";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CombatantState from "./types/CombatantState";
import DamageBreakdown from "./types/DamageBreakdown";
import DamageType from "./types/DamageType";
import DiceType from "./types/DiceType";
import EffectArea, { SpecifiedEffectShape } from "./types/EffectArea";
import RollType, { DamageRoll, SavingThrow } from "./types/RollType";
import Source from "./types/Source";
import { resolveArea } from "./utils/areas";
import { orderedKeys } from "./utils/map";
import { modulo } from "./utils/numbers";
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
    this.nextTurn();
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
    // TODO get initiative roll type
    const roll = await this.roll({ type: "initiative", who });
    return roll.value + who.dex;
  }

  async savingThrow(dc: number, e: Omit<SavingThrow, "type">) {
    const pre = this.fire(
      new BeforeSaveEvent({
        ...e,
        bonus: new BonusCollector(),
        diceType: new DiceTypeCollector(),
      })
    );

    const roll = await this.roll(
      { type: "save", ...e },
      pre.detail.diceType.result
    );

    return roll.value >= dc;
  }

  async roll(type: RollType, diceType: DiceType = "normal") {
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

  nextTurn() {
    if (this.activeCombatant)
      this.fire(new TurnEndedEvent({ who: this.activeCombatant }));

    let who = this.initiativeOrder[this.initiativePosition];
    let scan = true;

    while (scan) {
      this.initiativePosition = isNaN(this.initiativePosition)
        ? 0
        : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
      who = this.initiativeOrder[this.initiativePosition];

      if (!who.hasEffect(Dead)) scan = false;
    }

    this.activeCombatant = who;
    who.movedSoFar = 0;
    this.fire(new TurnStartedEvent({ who }));
  }

  async move(who: Combatant, dx: number, dy: number, track = true) {
    const state = this.combatants.get(who);
    if (!state) return;

    const old = state.position;
    const x = old.x + dx;
    const y = old.y + dy;

    if (track) who.movedSoFar += Math.max(Math.abs(dx), Math.abs(dy));

    // TODO prevent movement, attacks of opportunity etc.

    state.position = { x, y };
    this.fire(new CombatantMovedEvent({ who, old, position: state.position }));
  }

  private async applyDamage(
    damage: DamageMap,
    {
      attacker,
      multiplier: baseMultiplier = 1,
      target,
    }: {
      source: Source;
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
          who: target,
          damageType,
          response: collector,
        })
      );

      const response = collector.result;
      if (response === "immune") continue;
      // TODO absorb

      let multiplier = baseMultiplier;
      if (response === "resist") multiplier *= 0.5;
      else if (response === "vulnerable") multiplier *= 2;

      const amount = Math.ceil(raw * multiplier);
      breakdown.set(damageType, { response, raw, amount });
      total += amount;
    }

    this.fire(
      new CombatantDamagedEvent({ who: target, attacker, total, breakdown })
    );

    target.hp -= total;
    if (target.hp <= 0) {
      if (target.diesAtZero) {
        this.combatants.delete(target);
        target.addEffect(Dead, Infinity);
        this.fire(new CombatantDiedEvent({ who: target, attacker }));
      } else {
        // TODO
      }
    }
  }

  async attack(e: Omit<EventData["beforeAttack"], "bonus" | "diceType">) {
    const pre = this.fire(
      new BeforeAttackEvent({
        ...e,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
      })
    );
    if (pre.defaultPrevented)
      return { outcome: "cancelled", hit: false } as const;

    const roll = await this.roll(
      { type: "attack", who: e.who, target: e.target, ability: e.ability },
      pre.detail.diceType.result
    );

    const total = roll.value + pre.detail.bonus.result;

    const attack = this.fire(
      new AttackEvent({
        pre: pre.detail,
        roll,
        total,
        outcome:
          roll.value === 1
            ? "miss"
            : roll.value === 20
            ? "critical"
            : total >= e.target.ac
            ? "hit"
            : "miss",
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
      Omit<
        EventData["gatherDamage"],
        "map" | "bonus" | "interrupt" | "multiplier"
      >,
      "critical"
    >,
    damageInitialiser: DamageInitialiser = [],
    startingMultiplier?: number
  ) {
    const map = new DamageMap(damageInitialiser);
    const multiplier = new MultiplierCollector();
    if (typeof startingMultiplier === "number")
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
      attacker: e.attacker,
      target: e.target,
      multiplier: multiplier.value,
    });
  }

  async act<T extends object>(action: Action<T>, config: T) {
    await action.apply(config);
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

    for (const interruption of e.detail.interrupt) {
      if (interruption instanceof YesNoChoice) {
        const choice = await new Promise<boolean>((resolve) =>
          this.fire(new YesNoChoiceEvent({ interruption, resolve }))
        );
        if (choice) await interruption.yes?.();
        else await interruption.no?.();
      } else if (interruption instanceof PickFromListChoice) {
        const choice = await new Promise((resolve) =>
          this.fire(new ListChoiceEvent({ interruption, resolve }))
        );
        await interruption.chosen(choice);
      } else {
        console.error(interruption);
        throw new Error("Unknown interruption type");
      }
    }

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
    const points = new PointSet(resolveArea(area));
    const inside: Combatant[] = [];

    for (const [combatant, state] of this.combatants) {
      const squares = new PointSet(getSquares(combatant, state.position));

      if (points.overlaps(squares)) inside.push(combatant);
    }

    return inside;
  }
}
