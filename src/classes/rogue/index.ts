import { notImplementedFeature } from "../../features/common";
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
  (g, me, config) => {
    for (const entry of config) {
      if (entry === "thieves' tools") {
        // TODO
      } else {
        if (me.skills.has(entry)) me.skills.set(entry, 2);
        else console.warn(`Expertise in ${entry} without existing proficiency`);
      }
    }
  }
);

/* TODO During your rogue training you learned thieves' cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.

In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves' guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run. */
const ThievesCant = notImplementedFeature("Thieves' Cant");

// TODO Starting at 2nd level, your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.
const CunningAction = notImplementedFeature("Cunning Action");

const UncannyDodge = new SimpleFeature("Uncanny Dodge", (g, me) => {
  g.events.on(
    "gatherDamage",
    ({ detail: { target, attack, interrupt, multiplier } }) => {
      // TODO [...] when an attacker that you can see [...]
      if (attack && target === me && me.time.has("reaction"))
        interrupt.add(
          new YesNoChoice(
            me,
            UncannyDodge,
            "Uncanny Dodge",
            `Use Uncanny Dodge to halve the incoming damage on ${me.name}?`,
            async () => {
              me.time.delete("reaction");
              multiplier.add(0.5, UncannyDodge);
            }
          )
        );
    }
  );
});

// TODO Beginning at 7th level, you can nimbly dodge out of the way of certain area effects, such as a red dragon's fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.
const Evasion = notImplementedFeature("Evasion");

// TODO By 11th level, you have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.
const ReliableTalent = notImplementedFeature("Reliable Talent");

// TODO Starting at 14th level, if you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.
const Blindsense = notImplementedFeature("Blindsense");

// TODO By 15th level, you have acquired greater mental strength. You gain proficiency in Wisdom saving throws.
const SlipperyMind = notImplementedFeature("Slippery Mind");

// TODO Beginning at 18th level, you are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren't incapacitated.
const Elusive = notImplementedFeature("Elusive");

/* TODO At 20th level, you have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20.

Once you use this feature, you can't use it again until you finish a short or long rest. */
const StrokeOfLuck = notImplementedFeature("Stroke of Luck");

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
