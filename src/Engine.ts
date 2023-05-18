import DamageMap from "./DamageMap";
import DiceBag from "./DiceBag";
import DndRules from "./DndRules";
import CombatantDamagedEvent from "./events/CombatantDamagedEvent";
import CombatantDiedEvent from "./events/CombatantDiedEvent";
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import CombatantPlacedEvent from "./events/CombatantPlacedEvent";
import DiceRolledEvent from "./events/DiceRolledEvent";
import Dispatcher from "./events/Dispatcher";
import GetACMethodsEvent from "./events/GetACMethodsEvent";
import GetActionsEvent from "./events/GetActionsEvent";
import TurnStartedEvent from "./events/TurnStartedEvent";
import Action from "./types/Action";
import Combatant from "./types/Combatant";
import CombatantState from "./types/CombatantState";
import RollType, { DamageRoll } from "./types/RollType";
import Source from "./types/Source";
import UI from "./ui/UI";
import { orderedKeys } from "./utils/map";
import { modulo } from "./utils/numbers";

export default class Engine {
  combatants: Map<Combatant, CombatantState>;
  initiativeOrder: Combatant[];
  initiativePosition: number;
  ui: UI;
  rules: DndRules;

  constructor(
    public container: HTMLElement,
    public dice = new DiceBag(),
    public events = new Dispatcher()
  ) {
    this.combatants = new Map();
    this.initiativeOrder = [];
    this.initiativePosition = NaN;
    this.ui = new UI(this);
    this.rules = new DndRules(this);
  }

  place(who: Combatant, x: number, y: number) {
    this.combatants.set(who, { x, y, initiative: NaN });
    this.events.fire(new CombatantPlacedEvent({ who, x, y }));
  }

  async start() {
    for (const [c, cs] of this.combatants)
      cs.initiative = await this.rollInitiative(c);

    this.initiativeOrder = orderedKeys(
      this.combatants,
      ([, a], [, b]) => b.initiative - a.initiative
    );
    this.nextTurn();
  }

  async rollDamage(count: number, e: Omit<DamageRoll, "type">) {
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = await this.roll(
        Object.assign({ type: "damage" as const }, e)
      );
      total += roll.value;
    }

    return total;
  }

  async rollInitiative(who: Combatant) {
    const roll = await this.roll({ type: "initiative", who });
    return roll.value;
  }

  async roll(type: RollType) {
    const roll = this.dice.roll(type);
    const e = new DiceRolledEvent({ type, size: roll.size, value: roll.value });
    this.events.fire(e);
    return e.detail;
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

    const ox = state.x;
    const oy = state.y;
    const x = ox + dx;
    const y = oy + dy;

    // TODO prevent movement, attacks of opportunity etc.

    state.x = x;
    state.y = y;
    const e = new CombatantMovedEvent({ who, ox, oy, x, y });
    this.events.fire(e);
  }

  async damage(
    damage: DamageMap,
    {
      source,
      attacker,
      target,
    }: { source: Source; attacker: Combatant; target: Combatant }
  ) {
    let total = 0;

    for (const [, amount] of damage) {
      // TODO resist etc.
      total += amount;
    }

    this.events.fire(
      new CombatantDamagedEvent({ who: target, attacker, total })
    );

    target.hp -= total;
    if (target.hp <= 0) {
      if (target.diesAtZero) {
        // TODO
        this.events.fire(new CombatantDiedEvent({ who: target, attacker }));
      } else {
        // TODO
      }
    }
  }

  async act<T extends object>(action: Action<T>, config: T) {
    await action.apply(this, config);
  }

  async getActions(who: Combatant, target: Combatant) {
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
}
