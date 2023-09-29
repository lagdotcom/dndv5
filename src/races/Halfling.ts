import { notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import YesNoChoice from "../interruptions/YesNoChoice";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import { poisonResistance } from "./common";

const Lucky = new SimpleFeature(
  "Lucky",
  `When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.`,
  (g, me) => {
    g.events.on("DiceRolled", ({ detail }) => {
      const { otherValues, type: t, value, interrupt } = detail;

      if (
        (t.type === "attack" || t.type === "check" || t.type === "save") &&
        t.who === me &&
        value === 1
      )
        interrupt.add(
          new YesNoChoice(
            me,
            Lucky,
            "Lucky",
            `${me.name} rolled a 1 on a ${t.type} check. Reroll it?`,
            async () => {
              const newRoll = g.dice.roll(t).value;
              otherValues.push(value);
              detail.value = newRoll;
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

const HalflingNimbleness = notImplementedFeature(
  "Halfling Nimbleness",
  `You can move through the space of any creature that is of a size larger than yours.`,
);

const Halfling: PCRace = {
  name: "Halfling",
  abilities: new Map([["dex", 2]]),
  size: "small",
  movement: new Map([["speed", 25]]),
  features: new Set([Lucky, Brave, HalflingNimbleness]),
  languages: laSet("Common", "Halfling"),
};

const StoutResilience = poisonResistance(
  "Stout Resilience",
  `You have advantage on saving throws against poison, and you have resistance against poison damage.`,
);

export const StoutHalfling: PCRace = {
  parent: Halfling,
  name: "Stout Halfling",
  abilities: new Map([["con", 1]]),
  size: "small",
  features: new Set([StoutResilience]),
};
