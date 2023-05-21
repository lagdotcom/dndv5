import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import { HasTarget } from "../configs";
import DamageMap from "../DamageMap";
import Engine from "../Engine";
import BeforeAttackEvent from "../events/BeforeAttackEvent";
import GatherDamageEvent from "../events/GatherDamageEvent";
import TargetResolver from "../resolvers/TargetResolver";
import Ability from "../types/Ability";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import { getWeaponAbility, getWeaponRange } from "../utils/items";

export default class WeaponAttack implements Action<HasTarget> {
  ability: Ability;
  config: ActionConfig<HasTarget>;
  name: string;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public weapon: WeaponItem
  ) {
    const range = getWeaponRange(actor, weapon);
    this.ability = getWeaponAbility(actor, weapon);

    this.config = { target: new TargetResolver(g, range) };
    this.name = weapon.name;
  }

  async apply({ target }: HasTarget) {
    const { ability, weapon, actor: attacker, g } = this;

    const ba = await g.resolve(
      new BeforeAttackEvent({
        target,
        attacker,
        ability,
        weapon,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
      })
    );

    const attack = await g.roll(
      { type: "attack", who: attacker, target, weapon, ability },
      ba.diceType.result
    );

    // TODO ammunition, throwing

    const total = attack.value + ba.bonus.result;
    if (total >= target.ac) {
      const map = new DamageMap();
      const { damage } = weapon;

      if (damage.type === "dice") {
        const { count, size } = damage.amount;

        const amount = await g.rollDamage(count, {
          size,
          damageType: damage.damageType,
          attacker,
          target,
          ability,
          weapon,
        });
        map.add(damage.damageType, amount);
      } else map.add(damage.damageType, damage.amount);

      const gd = await g.resolve(
        new GatherDamageEvent({
          attacker,
          target,
          ability,
          weapon,
          map,
          bonus: new BonusCollector(),
        })
      );
      map.add(damage.damageType, gd.bonus.result);

      await g.damage(map, { source: this, attacker, target });
    }
  }
}
