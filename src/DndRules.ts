import UnarmedStrike from "./actions/UnarmedStrike";
import Engine from "./Engine";

export class CombatantAttackRule {
  constructor(public g: Engine) {
    g.events.on("getActions", ({ detail: { who, target, actions } }) => {
      if (who !== target) actions.push(new UnarmedStrike(who));
    });
  }
}

export default class DndRules {
  constructor(public g: Engine) {
    new CombatantAttackRule(g);
  }
}
