import iconUrl from "@img/act/stand.svg";

import ErrorCollector from "../collectors/ErrorCollector";
import { makeIcon } from "../colours";
import { Prone } from "../effects";
import Engine from "../Engine";
import { MapSquareSize } from "../MapSquare";
import Combatant from "../types/Combatant";
import { round } from "../utils/numbers";
import AbstractAction from "./AbstractAction";

const StandUpIcon = makeIcon(iconUrl);

export default class StandUpAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Stand Up", "implemented", {}, { icon: StandUpIcon });
  }

  get cost() {
    return round(this.actor.speed / 2, MapSquareSize);
  }

  check(config: never, ec: ErrorCollector) {
    if (!this.actor.conditions.has("Prone")) ec.add("not prone", this);

    const speed = this.actor.speed;
    if (speed <= 0) ec.add("cannot move", this);
    else if (this.actor.movedSoFar > this.cost)
      ec.add("not enough movement", this);

    return super.check(config, ec);
  }

  async apply() {
    await super.apply({});

    this.actor.movedSoFar += this.cost;

    // TODO [MESSAGES] report this somehow
    await this.actor.removeEffect(Prone);
  }
}
