import BonusCollector from "../collectors/BonusCollector";
import DiceTypeCollector from "../collectors/DiceTypeCollector";
import ErrorCollector from "../collectors/ErrorCollector";
import { HasTarget } from "../configs";
import DamageMap from "../DamageMap";
import Engine from "../Engine";
import AttackEvent from "../events/AttackEvent";
import BeforeAttackEvent from "../events/BeforeAttackEvent";
import GatherDamageEvent from "../events/GatherDamageEvent";
import TargetResolver from "../resolvers/TargetResolver";
import Ability from "../types/Ability";
import Action, { ActionConfig } from "../types/Action";
import Combatant from "../types/Combatant";
import { AmmoItem, WeaponItem } from "../types/Item";
import { getWeaponAbility, getWeaponRange } from "../utils/items";

export default class WeaponAttack implements Action<HasTarget> {
  ability: Ability;
  config: ActionConfig<HasTarget>;
  name: string;

  constructor(
    public g: Engine,
    public actor: Combatant,
    public weapon: WeaponItem,
    public ammo?: AmmoItem
  ) {
    const range = getWeaponRange(actor, weapon);
    this.ability = getWeaponAbility(actor, weapon);

    this.config = { target: new TargetResolver(g, range) };
    this.name = ammo ? `${weapon.name} (${ammo.name})` : weapon.name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAffectedArea(_config: Partial<HasTarget>) {
    // TODO exploding ammo???
    return undefined;
  }

  check(config: Partial<HasTarget>, ec = new ErrorCollector()): ErrorCollector {
    // TODO check action economy

    return ec;
  }

  async apply({ target }: HasTarget) {
    const { ability, ammo, weapon, actor: attacker, g } = this;

    // TODO spend action/attack

    const pre = g.fire(
      new BeforeAttackEvent({
        target,
        attacker,
        ability,
        weapon,
        ammo,
        diceType: new DiceTypeCollector(),
        bonus: new BonusCollector(),
      })
    );

    // TODO show this somehow
    if (pre.defaultPrevented) return;

    const roll = await g.roll(
      { type: "attack", who: attacker, target, weapon, ability },
      pre.detail.diceType.result
    );

    // TODO throwing

    if (ammo) ammo.quantity--;

    const total = roll.value + pre.detail.bonus.result;
    const outcome =
      roll.value === 1
        ? "miss"
        : roll.value === 20
        ? "critical"
        : total >= target.ac
        ? "hit"
        : "miss";

    const attack = g.fire(
      new AttackEvent({ pre: pre.detail, roll, total, outcome })
    );
    const critical = attack.detail.outcome === "critical";

    if (attack.detail.outcome !== "miss") {
      const map = new DamageMap();
      const { damage } = weapon;

      if (damage.type === "dice") {
        const { count, size } = damage.amount;
        const amount = await g.rollDamage(
          count,
          {
            size,
            damageType: damage.damageType,
            attacker,
            target,
            ability,
            weapon,
          },
          critical
        );
        map.add(damage.damageType, amount);
      } else map.add(damage.damageType, damage.amount);

      const gd = g.fire(
        new GatherDamageEvent({
          attacker,
          target,
          ability,
          weapon,
          map,
          bonus: new BonusCollector(),
          critical,
        })
      );
      map.add(damage.damageType, gd.detail.bonus.result);

      await g.damage(map, { source: this, attacker, target });
    }
  }
}
