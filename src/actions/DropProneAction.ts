import iconUrl from "@img/act/prone.svg";

import ErrorCollector from "../collectors/ErrorCollector";
import { makeIcon } from "../colours";
import { Prone } from "../effects";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import { coSet } from "../types/ConditionName";
import AbstractAction from "./AbstractAction";

const DropProneIcon = makeIcon(iconUrl);

export default class DropProneAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Drop Prone", "implemented", {}, { icon: DropProneIcon });
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
