import DamageResponseCollector from "./collectors/DamageResponseCollector";
import InterruptionCollector from "./collectors/InterruptionCollector";
import DamageMap from "./DamageMap";
import DiceBag from "./DiceBag";
import DndRules from "./DndRules";
import AreaPlacedEvent from "./events/AreaPlacedEvent";
import AreaRemovedEvent from "./events/AreaRemovedEvent";
import CombatantDamagedEvent from "./events/CombatantDamagedEvent";
import CombatantDiedEvent from "./events/CombatantDiedEvent";
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import CombatantPlacedEvent from "./events/CombatantPlacedEvent";
import DiceRolledEvent from "./events/DiceRolledEvent";
import Dispatcher from "./events/Dispatcher";
import GetACMethodsEvent from "./events/GetACMethodsEvent";
import GetActionsEvent from "./events/GetActionsEvent";
import GetDamageResponseEvent from "./events/GetDamageResponseEvent";
import TurnStartedEvent from "./events/TurnStartedEvent";
import YesNoChoiceEvent from "./events/YesNoChoiceEvent";
import YesNoChoice from "./interruptions/YesNoChoice";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CombatantState from "./types/CombatantState";
import DamageBreakdown from "./types/DamageBreakdown";
import DamageType from "./types/DamageType";
import DiceType from "./types/DiceType";
import EffectArea from "./types/EffectArea";
import RollType, { DamageRoll } from "./types/RollType";
import Source from "./types/Source";
import { orderedKeys } from "./utils/map";
import { modulo } from "./utils/numbers";

export default class Engine {
  combatants: Map<Combatant, CombatantState>;
  effects: Set<EffectArea>;
  private id: number;
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
    this.events.fire(new CombatantPlacedEvent({ who, position }));
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
    this.initiativePosition = isNaN(this.initiativePosition)
      ? 0
      : modulo(this.initiativePosition + 1, this.initiativeOrder.length);
    const who = this.initiativeOrder[this.initiativePosition];
    this.events.fire(new TurnStartedEvent({ who }));
  }

  async move(who: Combatant, dx: number, dy: number) {
    const state = this.combatants.get(who);
    if (!state) return;

    const old = state.position;
    const x = old.x + dx;
    const y = old.y + dy;

    // TODO prevent movement, attacks of opportunity etc.

    state.position = { x, y };
    const e = new CombatantMovedEvent({ who, old, position: state.position });
    this.events.fire(e);
  }

  async damage(
    damage: DamageMap,
    {
      attacker,
      target,
    }: { source: Source; attacker: Combatant; target: Combatant }
  ) {
    let total = 0;

    const breakdown = new Map<DamageType, DamageBreakdown>();

    for (const [damageType, raw] of damage) {
      const collector = new DamageResponseCollector();
      const e = new GetDamageResponseEvent({
        who: target,
        damageType,
        response: collector,
      });
      this.events.fire(e);

      const response = collector.result;
      if (response === "immune") continue;
      // TODO absorb

      let multiplier = 1;
      if (response === "resist") multiplier = 0.5;
      else if (response === "vulnerable") multiplier = 2;

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
        this.combatants.delete(target);
        this.events.fire(new CombatantDiedEvent({ who: target, attacker }));
      } else {
        // TODO
      }
    }
  }

  async act<T extends object>(action: Action<T>, config: T) {
    await action.apply(config);
  }

  async getActions(who: Combatant, target?: Combatant) {
    const e = new GetActionsEvent({ who, target, actions: [] });
    this.events.fire(e);
    return e.detail.actions;
  }

  getAC(who: Combatant) {
    const e = new GetACMethodsEvent({ who, methods: [] });
    this.events.fire(e);
    return e.detail.methods.reduce(
      (best, method) => (method.ac > best ? method.ac : best),
      0
    );
  }

  fire<T>(e: CustomEvent<T>) {
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
          this.events.fire(new YesNoChoiceEvent({ interruption, resolve }))
        );
        if (choice) await interruption.yes?.();
        else await interruption.no?.();
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
    this.events.fire(new AreaPlacedEvent({ area }));
  }

  removeEffectArea(area: EffectArea) {
    this.effects.delete(area);
    this.events.fire(new AreaRemovedEvent({ area }));
  }
}
