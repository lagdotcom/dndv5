import Engine from "./Engine";
import Combatant from "./types/Combatant";

export default class OncePerTurnController {
  affected: Set<Combatant>;

  constructor(public g: Engine) {
    this.affected = new Set();

    g.events.on("TurnStarted", () => this.affected.clear());
  }

  canBeAffected(who: Combatant) {
    return !this.affected.has(who);
  }

  affect(who: Combatant) {
    this.affected.add(who);
  }
}
