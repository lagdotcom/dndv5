import Engine from "../Engine";
import { Modifier } from "../flavours";
import EvaluateLater from "../interruptions/EvaluateLater";
import WeaponBase from "../items/WeaponBase";
import AbilityName from "../types/AbilityName";
import Combatant from "../types/Combatant";
import DamageAmount from "../types/DamageAmount";
import Priority from "../types/Priority";

export type NaturalWeaponOnHit = (
  target: Combatant,
  attacker: Combatant,
) => Promise<void>;

export default class NaturalWeapon extends WeaponBase {
  constructor(
    g: Engine,
    name: string,
    toHit: Modifier | AbilityName,
    damage: DamageAmount,
    { onHit }: { onHit?: NaturalWeaponOnHit } = {},
  ) {
    super(g, name, "natural", "melee", damage);

    if (typeof toHit === "string") this.forceAbilityScore = toHit;
    else {
      // TODO
      console.warn(`Natural Weapon "{name}" is modifier-based`);
    }

    if (onHit)
      g.events.on(
        "CombatantDamaged",
        ({ detail: { attack, interrupt, who } }) => {
          if (attack?.roll.type.weapon === this)
            interrupt.add(
              new EvaluateLater(
                attack.roll.type.who,
                this,
                Priority.Normal,
                async () => onHit(who, attack.roll.type.who),
              ),
            );
        },
      );
  }
}
