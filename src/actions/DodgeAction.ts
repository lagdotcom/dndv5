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
  g.events.on("BeforeAttack", ({ detail: { target, diceType } }) => {
    // TODO [SIGHT] if you can see the attacker
    if (canDodge(target)) diceType.add("disadvantage", DodgeEffect);
  });

  g.events.on("BeforeSave", ({ detail: { who, diceType } }) => {
    if (canDodge(who)) diceType.add("advantage", DodgeEffect);
  });
});

export default class DodgeAction extends AbstractAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Dodge",
      "incomplete",
      {},
      {
        time: "action",
        description: `When you take the Dodge action, you focus entirely on avoiding attacks. Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated (as explained in the appendix) or if your speed drops to 0.`,
      },
    );
  }

  async apply(): Promise<void> {
    super.apply({});
    await this.actor.addEffect(DodgeEffect, { duration: 1 });
  }
}
