import DamageMap from "../DamageMap";
import Engine from "../Engine";
import TargetResolver from "../resolvers/TargetResolver";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";

type HasTarget = { target: Combatant };

export default class UnarmedStrike implements Action<HasTarget> {
  config: ActionConfig<HasTarget>;
  name: string;

  constructor(public who: Combatant) {
    this.config = { target: new TargetResolver(5) };
    this.name = "Unarmed Strike";
  }

  async apply(g: Engine, { target }: HasTarget) {
    const { who } = this;
    const attack = await g.roll({ type: "attack", who, target });
    const bonus = who.str;

    if (attack.value + bonus >= target.ac) {
      const damage = new DamageMap(["bludgeoning", 1 + who.str]);
      await g.damage(damage, { source: this, attacker: who, target });
    }
  }
}
