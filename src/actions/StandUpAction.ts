import iconUrl from "@img/act/stand.svg";

import ErrorCollector from "../collectors/ErrorCollector";
import { makeIcon } from "../colours";
import { Prone } from "../effects";
import Engine from "../Engine";
import { MapSquareSize } from "../MapSquare";
import MessageBuilder from "../MessageBuilder";
import Combatant from "../types/Combatant";
import Empty from "../types/Empty";
import { round } from "../utils/numbers";
import AbstractAction from "./AbstractAction";

const StandUpIcon = makeIcon(iconUrl);

export default class StandUpAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Stand Up",
      "implemented",
      {},
      {
        icon: StandUpIcon,
        description: `Standing up takes more effort; doing so costs an amount of movement equal to half your speed. For example, if your speed is 30 feet, you must spend 15 feet of movement to stand up. You can't stand up if you don't have enough movement left or if your speed is 0.`,
        tags: ["escape move prevention"], // makes sense to me
      },
    );
  }

  get cost() {
    return round(this.actor.speed / 2, MapSquareSize);
  }

  getAffected() {
    return [this.actor];
  }
  getTargets() {
    return [];
  }

  check(config: Empty, ec: ErrorCollector) {
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

    await this.actor.removeEffect(Prone);
    this.g.text(new MessageBuilder().co(this.actor).text(" stands up."));
  }
}
