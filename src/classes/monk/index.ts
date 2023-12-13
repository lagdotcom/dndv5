import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import Evasion from "../../features/Evasion";
import SimpleFeature from "../../features/SimpleFeature";
import MessageBuilder from "../../MessageBuilder";
import { abSet } from "../../types/AbilityName";
import { wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { wtSet } from "../../types/WeaponType";
import { gains } from "../../utils/gain";
import { makeASI, makeExtraAttack } from "../common";
import Ki, { KiResource } from "./Ki";
import MartialArts from "./MartialArts";
import QuickenedHealing from "./QuickenedHealing";
import UnarmoredMovement from "./UnarmoredMovement";

const MonkUnarmoredDefense = new SimpleFeature(
  "Unarmored Defense",
  `Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.`,
  (g, me) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who === me && !me.armor && !me.shield)
        methods.push({
          name: "Unarmored Defense",
          ac: 10 + me.dex.modifier + me.wis.modifier,
          uses: new Set(),
        });
    });
  },
);

// TODO
const DedicatedWeapon = notImplementedFeature(
  "Dedicated Weapon",
  `You train yourself to use a variety of weapons as monk weapons, not just simple melee weapons and shortswords. Whenever you finish a short or long rest, you can touch one weapon, focus your ki on it, and then count that weapon as a monk weapon until you use this feature again.

The chosen weapon must meet these criteria:
- The weapon must be a simple or martial weapon.
- You must be proficient with it.
- It must lack the heavy and special properties.`,
);

// TODO
const DeflectMissiles = notImplementedFeature(
  "Deflect Missiles",
  `Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level.

If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack (range 20/60 feet) with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack.`,
);

// TODO
const KiFueledAttack = notImplementedFeature(
  "Ki-Fueled Attack",
  `If you spend 1 ki point or more as part of your action on your turn, you can make one attack with an unarmed strike or a monk weapon as a bonus action before the end of the turn.`,
);

// TODO
const SlowFall = notImplementedFeature(
  "Slow Fall",
  `Beginning at 4th level, you can use your reaction when you fall to reduce any falling damage you take by an amount equal to five times your monk level.`,
);

const ExtraAttack = makeExtraAttack(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
);

// TODO
const FocusedAim = notImplementedFeature(
  "Focused Aim",
  `When you miss with an attack roll, you can spend 1 to 3 ki points to increase your attack roll by 2 for each of these ki points you spend, potentially turning the miss into a hit.`,
);

// TODO
const StunningStrike = notImplementedFeature(
  "Stunning Strike",
  `Starting at 5th level, you can interfere with the flow of ki in an opponent's body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be stunned until the end of your next turn.`,
);

const KiEmpoweredStrikes = new SimpleFeature(
  "Ki-Empowered Strikes",
  `Starting at 6th level, your unarmed strikes count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage.`,
  (g, me) => {
    g.events.on("BeforeAttack", ({ detail: { who, weapon, tags } }) => {
      if (who === me && weapon?.weaponType === "unarmed strike")
        tags.add("magical");
    });
  },
);

// TODO
const StillnessOfMind = notImplementedFeature(
  "Stillness of Mind",
  `Starting at 7th level, you can use your action to end one effect on yourself that is causing you to be charmed or frightened.`,
);

// TODO
const PurityOfBody = notImplementedFeature(
  "Purity of Body",
  `At 10th level, your mastery of the ki flowing through you makes you immune to disease and poison.`,
);

// TODO
const TongueOfTheSunAndMoon = notImplementedFeature(
  "Tongue of the Sun and Moon",
  `Starting at 13th level, you learn to touch the ki of other minds so that you understand all spoken languages. Moreover, any creature that can understand a language can understand what you say.`,
);

// TODO
const DiamondSoul = notImplementedFeature(
  "Diamond Soul",
  `Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.

Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.`,
);

const TimelessBody = nonCombatFeature(
  "Timeless Body",
  `At 15th level, your ki sustains you so that you suffer none of the frailty of old age, and you can't be aged magically. You can still die of old age, however. In addition, you no longer need food or water.`,
);

// TODO
const EmptyBody = notImplementedFeature(
  "Empty Body",
  `Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.

Additionally, you can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can't take any other creatures with you.`,
);

const PerfectSelf = new SimpleFeature(
  "Perfect Self",
  `At 20th level, when you roll for initiative and have no ki points remaining, you regain 4 ki points.`,
  (g, me) => {
    g.events.on("GetInitiative", ({ detail: { who } }) => {
      if (who === me && me.getResource(KiResource) < 1) {
        g.text(new MessageBuilder().co(me).text("recovers 4 ki points."));
        me.giveResource(KiResource, 4);
      }
    });
  },
);

export const ASI4 = makeASI("Monk", 4);
export const ASI8 = makeASI("Monk", 8);
export const ASI12 = makeASI("Monk", 12);
export const ASI16 = makeASI("Monk", 16);
export const ASI19 = makeASI("Monk", 19);

const Monk: PCClass = {
  name: "Monk",
  hitDieSize: 8,
  weaponCategory: wcSet("simple"),
  weapon: wtSet("shortsword"),
  save: abSet("str", "dex"),
  skill: gains([], 2, [
    "Acrobatics",
    "Athletics",
    "History",
    "Insight",
    "Religion",
    "Stealth",
  ]),
  multi: {
    requirements: new Map([
      ["dex", 13],
      ["wis", 13],
    ]),
    weaponCategory: wcSet("simple"),
    weapon: wtSet("shortsword"),
  },

  features: new Map([
    [1, [MonkUnarmoredDefense, MartialArts]],
    [2, [Ki, DedicatedWeapon, UnarmoredMovement]],
    [3, [DeflectMissiles, KiFueledAttack]],
    [4, [ASI4, SlowFall, QuickenedHealing]],
    [5, [ExtraAttack, StunningStrike, FocusedAim]],
    [6, [KiEmpoweredStrikes]],
    [7, [Evasion, StillnessOfMind]],
    [8, [ASI8]],
    [10, [PurityOfBody]],
    [12, [ASI12]],
    [13, [TongueOfTheSunAndMoon]],
    [14, [DiamondSoul]],
    [15, [TimelessBody]],
    [16, [ASI16]],
    [18, [EmptyBody]],
    [19, [ASI19]],
    [20, [PerfectSelf]],
  ]),
};
export default Monk;
