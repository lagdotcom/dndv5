import { notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import { MapSquareSize } from "../../MapSquare";
import { BoundedMove } from "../../movement";
import { abSet } from "../../types/AbilityName";
import { coSet } from "../../types/ConditionName";
import Item, { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import SkillName from "../../types/SkillName";
import { gains } from "../../utils/gain";
import { round } from "../../utils/numbers";
import { intersects } from "../../utils/set";
import { makeASI, makeExtraAttack } from "../common";
import Rage, { RageAction } from "./Rage";
import { RecklessAttack } from "./RecklessAttack";

const BarbarianUnarmoredDefense = new SimpleFeature(
  "Unarmored Defense",
  `While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.`,
  (g, me) => {
    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who === me && !me.armor) {
        const uses = new Set<Item>();
        let ac = 10 + me.dex.modifier + me.con.modifier;

        if (me.shield) {
          ac += me.shield.ac;
          uses.add(me.shield);
        }

        methods.push({ name: "Unarmored Defense", ac, uses });
      }
    });
  },
);

const dangerSenseConditions = coSet("Blinded", "Deafened", "Incapacitated");
const DangerSense = new SimpleFeature(
  "Danger Sense",
  `At 2nd level, you gain an uncanny sense of when things nearby aren't as they should be, giving you an edge when you dodge away from danger. You have advantage on Dexterity saving throws against effects that you can see, such as traps and spells. To gain this benefit, you can't be blinded, deafened, or incapacitated.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, ability, diceType } }) => {
      // TODO [SIGHT] against effects that you can see
      if (
        who === me &&
        ability === "dex" &&
        !intersects(me.conditions, dangerSenseConditions)
      )
        diceType.add("advantage", DangerSense);
    });
  },
);

export const PrimalKnowledge = new ConfiguredFeature<SkillName[]>(
  "Primal Knowledge",
  `When you reach 3rd level and again at 10th level, you gain proficiency in one skill of your choice from the list of skills available to barbarians at 1st level.`,
  (g, me, skills) => {
    for (const skill of skills) me.addProficiency(skill, "proficient");
  },
);

const ExtraAttack = makeExtraAttack(
  "Extra Attack",
  `Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.`,
);

const FastMovement = new SimpleFeature(
  "Fast Movement",
  `Starting at 5th level, your speed increases by 10 feet while you aren't wearing heavy armor.`,
  (g, me) => {
    g.events.on("GetSpeed", ({ detail: { who, bonus } }) => {
      if (who === me && me.armor?.category !== "heavy")
        bonus.add(10, FastMovement);
    });
  },
);

const FeralInstinct = new SimpleFeature(
  "Feral Instinct",
  `By 7th level, your instincts are so honed that you have advantage on initiative rolls.

Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.`,
  (g, me) => {
    g.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
      if (who === me) diceType.add("advantage", FeralInstinct);
    });

    // TODO [SURPRISE] Additionally, if you are surprised at the beginning of combat and aren't incapacitated, you can act normally on your first turn, but only if you enter your rage before doing anything else on that turn.
  },
);

const InstinctivePounce = new SimpleFeature(
  "Instinctive Pounce",
  `As part of the bonus action you take to enter your rage, you can move up to half your speed.`,
  (g, me) => {
    g.events.on("AfterAction", ({ detail: { action, interrupt } }) => {
      if (action instanceof RageAction && action.actor === me)
        interrupt.add(
          new EvaluateLater(me, InstinctivePounce, async () =>
            g.applyBoundedMove(
              me,
              new BoundedMove(
                InstinctivePounce,
                round(me.speed / 2, MapSquareSize),
              ),
            ),
          ),
        );
    });
  },
);

const getBrutalDice = (level: number) => {
  if (level < 13) return 1;
  if (level < 17) return 2;
  return 3;
};

const BrutalCritical = new SimpleFeature(
  "Brutal Critical",
  `Beginning at 9th level, you can roll one additional weapon damage die when determining the extra damage for a critical hit with a melee attack.

This increases to two additional dice at 13th level and three additional dice at 17th level.`,
  (g, me) => {
    const count = getBrutalDice(me.classLevels.get("Barbarian") ?? 9);

    g.events.on(
      "GatherDamage",
      ({
        detail: {
          attacker,
          attack,
          critical,
          interrupt,
          weapon,
          target,
          bonus,
        },
      }) => {
        if (attacker === me && attack?.pre.tags.has("melee") && critical) {
          const base = weapon?.damage;

          if (base?.type === "dice") {
            interrupt.add(
              new EvaluateLater(me, BrutalCritical, async () => {
                const damage = await g.rollDamage(
                  count,
                  {
                    source: BrutalCritical,
                    attacker: me,
                    damageType: base.damageType,
                    size: base.amount.size,
                    target,
                    weapon,
                  },
                  false,
                );

                bonus.add(damage, BrutalCritical);
              }),
            );
          }
        }
      },
    );
  },
);

// TODO [DAMAGEINTERRUPT]
const RelentlessRage = notImplementedFeature(
  "Relentless Rage",
  `Starting at 11th level, your rage can keep you fighting despite grievous wounds. If you drop to 0 hit points while you're raging and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, you drop to 1 hit point instead.

Each time you use this feature after the first, the DC increases by 5. When you finish a short or long rest, the DC resets to 10.`,
);

// TODO [CONDITIONREACTION]
const PersistentRage = notImplementedFeature(
  "Persistent Rage",
  `Beginning at 15th level, your rage is so fierce that it ends early only if you fall unconscious or if you choose to end it.`,
);

// TODO
const IndomitableMight = notImplementedFeature(
  "Indomitable Might",
  `Beginning at 18th level, if your total for a Strength check is less than your Strength score, you can use that score in place of the total.`,
);

const PrimalChampion = new SimpleFeature(
  "Primal Champion",
  `At 20th level, you embody the power of the wilds. Your Strength and Constitution scores increase by 4. Your maximum for those scores is now 24.`,
  (g, me) => {
    me.str.maximum = 24;
    me.con.maximum = 24;
    me.str.score += 4;
    me.con.score += 4;
  },
);

export const ASI4 = makeASI("Barbarian", 4);
export const ASI8 = makeASI("Barbarian", 8);
export const ASI12 = makeASI("Barbarian", 12);
export const ASI16 = makeASI("Barbarian", 16);
export const ASI19 = makeASI("Barbarian", 19);

const Barbarian: PCClass = {
  name: "Barbarian",
  hitDieSize: 12,
  armor: acSet("light", "medium", "shield"),
  weaponCategory: wcSet("simple", "martial"),
  save: abSet("str", "con"),
  skill: gains([], 2, [
    "Animal Handling",
    "Athletics",
    "Intimidation",
    "Nature",
    "Perception",
    "Survival",
  ]),
  multi: {
    requirements: new Map([["str", 13]]),
    armor: acSet("shield"),
    weaponCategory: wcSet("simple", "martial"),
  },

  features: new Map([
    [1, [Rage, BarbarianUnarmoredDefense]],
    [2, [DangerSense, RecklessAttack]],
    [3, [PrimalKnowledge]],
    [4, [ASI4]],
    [5, [ExtraAttack, FastMovement]],
    [7, [FeralInstinct, InstinctivePounce]],
    [8, [ASI8]],
    [9, [BrutalCritical]],
    [11, [RelentlessRage]],
    [12, [ASI12]],
    [15, [PersistentRage]],
    [16, [ASI16]],
    [18, [IndomitableMight]],
    [19, [ASI19]],
    [20, [PrimalChampion]],
  ]),
};
export default Barbarian;
