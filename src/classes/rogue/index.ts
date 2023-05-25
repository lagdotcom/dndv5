import { notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import YesNoChoice from "../../interruptions/YesNoChoice";
import PCClass from "../../types/PCClass";
import SkillName from "../../types/SkillName";
import { makeASI } from "../common";
import SneakAttack from "./SneakAttack";

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

// TODO As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.
const SteadyAim = notImplementedFeature("Steady Aim");

export const ASI4 = makeASI("Rogue", 4);

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

export const ASI8 = makeASI("Rogue", 8);

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
  ]),
};
export default Rogue;
