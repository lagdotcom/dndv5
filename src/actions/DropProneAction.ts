import ErrorCollector from "../collectors/ErrorCollector";
import { Prone } from "../effects";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import { coSet } from "../types/ConditionName";
import AbstractAction from "./AbstractAction";
import iconUrl from "./icons/prone.svg";

export default class DropProneAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Drop Prone", "implemented", {}, { iconUrl });
  }

  check(config: never, ec: ErrorCollector) {
    if (this.actor.conditions.has("Prone")) ec.add("already prone", this);

    return super.check(config, ec);
  }

  async apply() {
    await super.apply({});

    await this.actor.addEffect(Prone, {
      conditions: coSet("Prone"),
      duration: Infinity,
    });
  }
}
