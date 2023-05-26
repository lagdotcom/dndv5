import WeaponAttack from "../../actions/WeaponAttack";
import Engine from "../../Engine";
import SimpleFeature from "../../features/SimpleFeature";
import { AbstractWeapon } from "../../items/weapons";
import Action from "../../types/Action";
import DamageAmount from "../../types/DamageAmount";
import { WeaponItem } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { dd } from "../../utils/dice";
import { getDiceAverage } from "../../utils/dnd";

const UnarmoredDefense = new SimpleFeature(
  "Unarmored Defense",
  `Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.`,
  (g, me) => {
    g.events.on("getACMethods", ({ detail: { who, methods } }) => {
      if (who === me && !me.armor && !me.shield)
        methods.push({
          name: "Unarmored Defense",
          ac: 10 + me.dex + me.wis,
          uses: new Set(),
        });
    });
  }
);

function getMartialArtsDie(level: number) {
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

class MonkWeaponWrapper extends AbstractWeapon {
  constructor(g: Engine, public weapon: WeaponItem, size: number) {
    super(
      g,
      weapon.name,
      weapon.category,
      weapon.rangeCategory,
      dd(1, size, weapon.damage.damageType),
      [...weapon.properties],
      weapon.shortRange,
      weapon.longRange
    );
  }
}

// TODO no bonus attack yet
const MartialArts = new SimpleFeature(
  "Martial Arts",
  `Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don't have the two-handed or heavy property.

You gain the following benefits while you are unarmed or wielding only monk weapons and you aren't wearing armor or wielding a shield.

- You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
- You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.
- When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven't already taken a bonus action this turn.

Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama).`,
  (g, me) => {
    console.warn(`[Feature Not Complete] Martial Arts (on ${me.name})`);
    const diceSize = getMartialArtsDie(me.classLevels.get("Monk") ?? 0);

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who !== me) return;

      for (const wa of actions.filter(isMonkWeaponAttack)) {
        // TODO should really be a choice
        if (me.dex > me.str) wa.ability = "dex";

        if (canUpgradeDamage(wa.weapon.damage, diceSize))
          wa.weapon = new MonkWeaponWrapper(g, wa.weapon, diceSize);
      }
    });
  }
);

const Monk: PCClass = {
  name: "Monk",
  hitDieSize: 8,
  weaponCategoryProficiencies: new Set(["simple"]),
  weaponProficiencies: new Set(["shortsword"]),
  saveProficiencies: new Set(["str", "dex"]),
  skillChoices: 2,
  skillProficiencies: new Set([
    "Acrobatics",
    "Athletics",
    "History",
    "Insight",
    "Religion",
    "Stealth",
  ]),

  features: new Map([[1, [UnarmoredDefense, MartialArts]]]),
};
export default Monk;
