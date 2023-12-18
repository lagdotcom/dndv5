import { notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import YesNoChoice from "../interruptions/YesNoChoice";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import Priority from "../types/Priority";
import SizeCategory from "../types/SizeCategory";
import { poisonResistanceFeature } from "./common";

const Lucky = new SimpleFeature(
  "Lucky",
  `When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.`,
  (g, me) => {
    g.events.on("DiceRolled", ({ detail: { type: t, values, interrupt } }) => {
      if (
        (t.type === "attack" || t.type === "check" || t.type === "save") &&
        t.who === me &&
        values.final === 1
      )
        interrupt.add(
          new YesNoChoice(
            me,
            Lucky,
            "Lucky",
            `${me.name} rolled a 1 on a ${t.type} check. Reroll it?`,
            Priority.ChangesOutcome,
            async () => {
              const newRoll = g.dice.roll(t).values.final;
              values.add(newRoll, "higher");
            },
          ),
        );
    });
  },
);

const Brave = new SimpleFeature(
  "Brave",
  `You have advantage on saving throws against being frightened.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, tags, config, diceType } }) => {
      if (
        who === me &&
        (tags.has("frightened") || config?.conditions?.has("Frightened"))
      )
        diceType.add("advantage", Brave);
    });
  },
);

// TODO [SQUEEZING]
const HalflingNimbleness = notImplementedFeature(
  "Halfling Nimbleness",
  `You can move through the space of any creature that is of a size larger than yours.`,
);

const Halfling: PCRace = {
  name: "Halfling",
  abilities: new Map([["dex", 2]]),
  size: SizeCategory.Small,
  movement: new Map([["speed", 25]]),
  features: new Set([Lucky, Brave, HalflingNimbleness]),
  languages: laSet("Common", "Halfling"),
};

// TODO [HIDE]
const NaturallyStealthy = notImplementedFeature(
  "Naturally Stealthy",
  `You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.`,
);

export const LightfootHalfling: PCRace = {
  parent: Halfling,
  name: "Lightfoot Halfling",
  abilities: new Map([["cha", 1]]),
  size: SizeCategory.Small,
  features: new Set([NaturallyStealthy]),
};

const StoutResilience = poisonResistanceFeature(
  "Stout Resilience",
  `You have advantage on saving throws against poison, and you have resistance against poison damage.`,
);

export const StoutHalfling: PCRace = {
  parent: Halfling,
  name: "Stout Halfling",
  abilities: new Map([["con", 1]]),
  size: SizeCategory.Small,
  features: new Set([StoutResilience]),
};
