import WeaponAttack from "../../actions/WeaponAttack";
import Effect from "../../Effect";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import WeaponBase from "../../items/WeaponBase";
import Action from "../../types/Action";
import ActionTime from "../../types/ActionTime";
import Combatant from "../../types/Combatant";
import DamageAmount from "../../types/DamageAmount";
import { WeaponItem } from "../../types/Item";
import { _dd } from "../../utils/dice";
import { getDiceAverage } from "../../utils/dnd";

export function getMartialArtsDie(level: number) {
  if (level < 5) return 4;
  if (level < 11) return 6;
  if (level < 17) return 8;
  return 10;
}

function isMonkWeapon(weapon: WeaponItem) {
  if (weapon.weaponType === "unarmed strike") return true;
  if (weapon.weaponType === "shortsword") return true;
  return (
    weapon.category === "simple" &&
    weapon.rangeCategory === "melee" &&
    !weapon.properties.has("two-handed") &&
    !weapon.properties.has("heavy")
  );
}

function isMonkWeaponAttack(action: Action): action is WeaponAttack {
  return action instanceof WeaponAttack && isMonkWeapon(action.weapon);
}

function canUpgradeDamage(damage: DamageAmount, size: number) {
  const avg = getDiceAverage(1, size);

  if (damage.type === "flat") return avg > damage.amount;
  return size > getDiceAverage(damage.amount.count, damage.amount.size);
}

// You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield.
function canUseMartialArts(who: Combatant) {
  if (who.armor || who.shield) return false;

  for (const item of who.equipment) {
    if (item.itemType === "weapon" && !isMonkWeapon(item)) return false;
  }

  return true;
}

class MonkWeaponWrapper extends WeaponBase {
  constructor(
    g: Engine,
    public weapon: WeaponItem,
    size: number,
  ) {
    super(
      g,
      weapon.name,
      weapon.category,
      weapon.rangeCategory,
      _dd(1, size, weapon.damage.damageType),
      weapon.properties,
      undefined,
      weapon.shortRange,
      weapon.longRange,
    );
  }

  get icon() {
    return this.weapon.icon;
  }
}

const HasBonusAttackThisTurn = new Effect(
  "Martial Arts",
  "turnEnd",
  undefined,
  { quiet: true },
);

class MartialArtsBonusAttack extends WeaponAttack {
  constructor(g: Engine, actor: Combatant, weapon: WeaponItem) {
    super(g, actor, weapon);

    this.name = `Martial Arts (${weapon.name})`;
    this.tags.delete("costs attack");
  }

  getTime(): ActionTime {
    return "bonus action";
  }
}

export function getMonkUnarmedWeapon(g: Engine, who: Combatant) {
  const weapon = who.weapons.find((w) => w.weaponType === "unarmed strike");
  if (weapon) {
    const diceSize = getMartialArtsDie(who.classLevels.get("Monk") ?? 0);

    return canUpgradeDamage(weapon.damage, diceSize)
      ? new MonkWeaponWrapper(g, weapon, diceSize)
      : weapon;
  }
}

const MartialArts = new SimpleFeature(
  "Martial Arts",
  `Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don't have the two-handed or heavy property.

You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield.

- You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
- You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.
- When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn.

Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama).`,
  (g, me) => {
    const diceSize = getMartialArtsDie(me.classLevels.get("Monk") ?? 0);

    // You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who !== me || !canUseMartialArts(me)) return;

      for (const wa of actions.filter(isMonkWeaponAttack)) {
        // TODO should really be a choice
        if (me.dex.score > me.str.score) wa.ability = "dex";

        // You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.
        if (canUpgradeDamage(wa.weapon.damage, diceSize))
          wa.weapon = new MonkWeaponWrapper(g, wa.weapon, diceSize);
      }
    });

    // When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn.
    g.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
      if (
        action.actor === me &&
        isMonkWeaponAttack(action) &&
        canUseMartialArts(me)
      )
        interrupt.add(
          new EvaluateLater(action.actor, MartialArts, async () => {
            await action.actor.addEffect(HasBonusAttackThisTurn, {
              duration: 1,
            });
          }),
        );
    });
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who.hasEffect(HasBonusAttackThisTurn) && canUseMartialArts(who)) {
        const weapon = getMonkUnarmedWeapon(g, who);
        if (weapon) actions.push(new MartialArtsBonusAttack(g, who, weapon));
      }
    });
  },
);
export default MartialArts;
