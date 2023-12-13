import Engine from "../Engine";
import EvaluateLater from "../interruptions/EvaluateLater";
import { AbstractWeapon } from "../items/weapons";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import DamageAmount from "../types/DamageAmount";

export default class NaturalWeapon extends AbstractWeapon {
  constructor(
    g: Engine,
    name: string,
    toHit: number | AbilityName,
    damage: DamageAmount,
    { onHit }: { onHit?: (target: Combatant) => Promise<void> } = {},
  ) {
    super(g, name, "natural", "melee", damage);

    if (typeof toHit === "string") this.forceAbilityScore = toHit;
    else {
      // TODO
    }

    if (onHit)
      g.events.on(
        "CombatantDamaged",
        ({ detail: { attack, interrupt, who } }) => {
          if (attack?.pre.weapon === this)
            interrupt.add(
              new EvaluateLater(attack.pre.who, this, async () => onHit(who)),
            );
        },
      );
  }
}
