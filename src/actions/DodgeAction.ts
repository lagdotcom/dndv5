import Effect from "../Effect";
import Engine from "../Engine";
import Combatant from "../types/Combatant";
import AbstractAction from "./AbstractAction";

function canDodge(who: Combatant) {
  return (
    who.hasEffect(DodgeEffect) &&
    who.speed > 0 &&
    !who.conditions.has("Incapacitated")
  );
}

export const DodgeEffect = new Effect("Dodge", "turnStart", (g) => {
  g.events.on("beforeAttack", ({ detail: { target, diceType } }) => {
    // TODO if you can see the attacker
    if (canDodge(target)) diceType.add("disadvantage", DodgeEffect);
  });

  g.events.on("beforeSave", ({ detail: { who, diceType } }) => {
    if (canDodge(who)) diceType.add("advantage", DodgeEffect);
  });
});

export default class DodgeAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Dodge", {}, "action");
  }

  async apply(): Promise<void> {
    super.apply({});
    this.actor.addEffect(DodgeEffect, 1);
  }
}
