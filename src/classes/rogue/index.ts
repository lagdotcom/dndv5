import DashAction from "../../actions/DashAction";
import DisengageAction from "../../actions/DisengageAction";
import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import PCClass from "../../types/PCClass";
import SkillName from "../../types/SkillName";
import { makeASI } from "../common";
import SneakAttack from "./SneakAttack";
import SteadyAim from "./SteadyAim";

type ExpertiseEntry = SkillName | "thieves' tools";

export const Expertise = new ConfiguredFeature<ExpertiseEntry[]>(
  "Expertise",
  `At 1st level, choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves’ tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.

  At 6th level, you can choose two more of your proficiencies (in skills or with thieves’ tools) to gain this benefit.`,
  (g, me, config) => {
    for (const entry of config) {
      if (entry === "thieves' tools") {
        if (me.toolProficiencies.has(entry)) me.toolProficiencies.set(entry, 2);
        else console.warn(`Expertise in ${entry} without existing proficiency`);
      } else {
        if (me.skills.has(entry)) me.skills.set(entry, 2);
        else console.warn(`Expertise in ${entry} without existing proficiency`);
      }
    }
  }
);

const ThievesCant = nonCombatFeature(
  "Thieves' Cant",
  `During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.

In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.`
);

const CunningAction = new SimpleFeature(
  "Cunning Action",
  `Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.`,
  (g, me) => {
    console.warn(`[Feature Not Complete] Cunning Action (on ${me.name})`);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) {
        // TODO [SIGHT] HideAction
        const cunning = [new DashAction(g, who), new DisengageAction(g, who)];
        for (const action of cunning) {
          action.name += " (Cunning Action)";
          action.time = "bonus action";
        }

        actions.push(...cunning);
      }
    });
  }
);

const UncannyDodge = new SimpleFeature(
  "Uncanny Dodge",
  `Starting at 5th level, when an attacker that you can see hits you with an attack, you can use your reaction to halve the attack's damage against you.`,
  (g, me) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { target, attack, interrupt, multiplier } }) => {
        // TODO [SIGHT] ... when an attacker that you can see ...
        if (attack && target === me && me.time.has("reaction"))
          interrupt.add(
            new YesNoChoice(
              me,
              UncannyDodge,
              "Uncanny Dodge",
              `Use Uncanny Dodge to halve the incoming damage on ${me.name}?`,
              async () => {
                me.time.delete("reaction");
                multiplier.add("half", UncannyDodge);
              }
            )
          );
      }
    );
  }
);

const Evasion = new SimpleFeature(
  "Evasion",
  `Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.`,
  (g, me) => {
    g.events.on(
      "BeforeSave",
      ({
        detail: { who, ability, failDamageResponse, saveDamageResponse },
      }) => {
        if (
          who === me &&
          ability === "dex" &&
          saveDamageResponse.fallback === "half"
        ) {
          failDamageResponse.add("half", Evasion);
          saveDamageResponse.add("zero", Evasion);
        }
      }
    );
  }
);

// TODO
const ReliableTalent = notImplementedFeature(
  "Reliable Talent",
  `By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.`
);

// TODO [SIGHT]
const Blindsense = notImplementedFeature(
  "Blindsense",
  `Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.`
);

const SlipperyMind = new SimpleFeature(
  "Slippery Mind",
  `By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.`,
  (g, me) => me.saveProficiencies.add("wis")
);

// TODO
const Elusive = notImplementedFeature(
  "Elusive",
  `Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren't incapacitated.`
);

// TODO
const StrokeOfLuck = notImplementedFeature(
  "Stroke of Luck",
  `At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.

Once you use this feature, you can't use it again until you finish a short or long rest.`
);

export const ASI4 = makeASI("Rogue", 4);
export const ASI8 = makeASI("Rogue", 8);
export const ASI10 = makeASI("Rogue", 10);
export const ASI12 = makeASI("Rogue", 12);
export const ASI16 = makeASI("Rogue", 16);
export const ASI19 = makeASI("Rogue", 19);

const Rogue: PCClass = {
  name: "Rogue",
  hitDieSize: 8,
  armorProficiencies: new Set(["light"]),
  weaponCategoryProficiencies: new Set(["simple"]),
  weaponProficiencies: new Set([
    "hand crossbow",
    "longsword",
    "rapier",
    "shortsword",
  ]),
  toolProficiencies: new Set(["thieves' tools"]),
  saveProficiencies: new Set(["dex", "int"]),
  skillChoices: 4,
  skillProficiencies: new Set([
    "Acrobatics",
    "Athletics",
    "Deception",
    "Insight",
    "Intimidation",
    "Investigation",
    "Perception",
    "Performance",
    "Persuasion",
    "Sleight of Hand",
    "Stealth",
  ]),
  features: new Map([
    [1, [Expertise, SneakAttack, ThievesCant]],
    [2, [CunningAction]],
    [3, [SteadyAim]],
    [4, [ASI4]],
    [5, [UncannyDodge]],
    [7, [Evasion]],
    [8, [ASI8]],
    [10, [ASI10]],
    [11, [ReliableTalent]],
    [12, [ASI12]],
    [14, [Blindsense]],
    [15, [SlipperyMind]],
    [16, [ASI16]],
    [18, [Elusive]],
    [19, [ASI19]],
    [20, [StrokeOfLuck]],
  ]),
};
export default Rogue;
