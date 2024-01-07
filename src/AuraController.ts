import ActiveEffectArea, { ActiveEffectAreaHandler } from "./ActiveEffectArea";
import Engine from "./Engine";
import CombatantMovedEvent from "./events/CombatantMovedEvent";
import EffectAddedEvent from "./events/EffectAddedEvent";
import EffectRemovedEvent from "./events/EffectRemovedEvent";
import Combatant from "./types/Combatant";
import { AreaTag } from "./types/EffectArea";
import { SetInitialiser } from "./utils/set";
import { distance } from "./utils/units";

export type AuraActiveChecker = (who: Combatant) => boolean;

export default class AuraController {
  area?: ActiveEffectArea;
  tags: Set<AreaTag>;

  constructor(
    public g: Engine,
    public name: string,
    public who: Combatant,
    public radius: number,
    tags: SetInitialiser<AreaTag> = [],
    public tint: string,
    public handler?: ActiveEffectAreaHandler,
    public shouldBeActive: AuraActiveChecker = () => true,
  ) {
    this.tags = new Set(tags);
    this.update();

    const onEvent = this.onEvent.bind(this);
    g.events.on("CombatantMoved", onEvent);
    g.events.on("EffectAdded", onEvent);
    g.events.on("EffectRemoved", onEvent);
  }

  get active() {
    return typeof this.area !== "undefined";
  }

  setActiveChecker(shouldBeActive: AuraActiveChecker) {
    this.shouldBeActive = shouldBeActive;
    return this;
  }

  onEvent({
    detail: { who },
  }: CombatantMovedEvent | EffectAddedEvent | EffectRemovedEvent) {
    if (who === this.who) {
      if (this.shouldBeActive(who)) this.update();
      else this.remove();
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
      handler,
    );
    g.addEffectArea(this.area);
  }

  remove() {
    if (this.area) {
      this.g.removeEffectArea(this.area);
      this.area = undefined;
    }
  }

  isAffecting(other: Combatant) {
    return this.active && distance(this.who, other) <= this.radius;
  }
}
