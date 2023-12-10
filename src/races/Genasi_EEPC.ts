import CastSpell from "../actions/CastSpell";
import {
  bonusSpellsFeature,
  Darkvision60,
  notImplementedFeature,
} from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { LongRestResource } from "../resources";
import ProduceFlame from "../spells/cantrip/ProduceFlame";
import { spellImplementationWarning } from "../spells/common";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import BurningHands from "../spells/level1/BurningHands";
import Levitate from "../spells/level2/Levitate";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import SizeCategory from "../types/SizeCategory";
import { resistanceFeature } from "./common";

const Genasi: PCRace = {
  name: "Genasi",
  size: SizeCategory.Medium,
  abilities: new Map([["con", 2]]),
  movement: new Map([["speed", 30]]),
  languages: laSet("Common", "Primordial"),
};

// TODO [TERRAIN] [CHOKING]
const UnendingBreath = notImplementedFeature(
  "Unending Breath",
  `You can hold your breath indefinitely while you’re not incapacitated.`,
);

const MingleWithTheWindResource = new LongRestResource(
  "Mingle with the Wind",
  1,
);
const MingleWithTheWindMethod = new InnateSpellcasting(
  "Mingle with the Wind",
  "con",
  () => MingleWithTheWindResource,
);

const MingleWithTheWind = new SimpleFeature(
  "Mingle with the Wind",
  `You can cast the levitate spell once with this trait, requiring no material components, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for this spell.`,
  (g, me) => {
    me.initResource(MingleWithTheWindResource);
    spellImplementationWarning(Levitate, me);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(new CastSpell(g, me, MingleWithTheWindMethod, Levitate));
    });
  },
);

export const AirGenasi: PCRace = {
  parent: Genasi,
  name: "Air Genasi",
  size: SizeCategory.Medium,
  abilities: new Map([["dex", 1]]),
  features: new Set([UnendingBreath, MingleWithTheWind]),
};

const FireResistance = resistanceFeature(
  "Fire Resistance",
  `You have resistance to fire damage.`,
  ["fire"],
);

const ReachToTheBlazeResource = new LongRestResource("Reach to the Blaze", 1);
const ReachToTheBlazeMethod = new InnateSpellcasting(
  "Reach to the Blaze",
  "con",
  (spell) => {
    if (spell === BurningHands) return ReachToTheBlazeResource;
  },
);

const ReachToTheBlaze = bonusSpellsFeature(
  "Reach to the Blaze",
  `You know the produce flame cantrip. Once you reach 3rd level, you can cast the burning hands spell once with this trait as a 1st-level spell, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.`,
  "level",
  ReachToTheBlazeMethod,
  [
    { level: 1, spell: ProduceFlame },
    { level: 3, spell: BurningHands, resource: ReachToTheBlazeResource },
  ],
  undefined,
  (g, me) => {
    me.knownSpells.add(ProduceFlame);
    me.preparedSpells.add(ProduceFlame);
  },
);

export const FireGenasi: PCRace = {
  parent: Genasi,
  name: "Fire Genasi",
  size: SizeCategory.Medium,
  abilities: new Map([["int", 1]]),
  features: new Set([Darkvision60, FireResistance, ReachToTheBlaze]),
};
