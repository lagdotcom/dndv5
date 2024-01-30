import CastSpell from "../actions/CastSpell";
import {
  Amphibious,
  BonusSpellEntry,
  bonusSpellResourceFinder,
  bonusSpellsFeature,
  Darkvision60,
  notImplementedFeature,
} from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { PCLevel } from "../flavours";
import { LongRestResource } from "../resources";
import ProduceFlame from "../spells/cantrip/ProduceFlame";
import { spellImplementationWarning } from "../spells/common";
import InnateSpellcasting from "../spells/InnateSpellcasting";
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

const ReachToTheBlazeSpells: BonusSpellEntry<PCLevel>[] = [
  { level: 1, spell: "produce flame" },
  { level: 3, spell: "burning hands", resource: ReachToTheBlazeResource },
];

const ReachToTheBlazeMethod = new InnateSpellcasting(
  "Reach to the Blaze",
  "con",
  bonusSpellResourceFinder(ReachToTheBlazeSpells),
);

const ReachToTheBlaze = bonusSpellsFeature(
  "Reach to the Blaze",
  `You know the produce flame cantrip. Once you reach 3rd level, you can cast the burning hands spell once with this trait as a 1st-level spell, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.`,
  "level",
  ReachToTheBlazeMethod,
  ReachToTheBlazeSpells,
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

const AcidResistance = resistanceFeature(
  "Acid Resistance",
  `You have resistance to acid damage.`,
  ["acid"],
);

const CallToTheWaveResource = new LongRestResource("Call to the Wave", 1);

const CallToTheWaveSpells: BonusSpellEntry<PCLevel>[] = [
  { level: 1, spell: "shape water" },
  {
    level: 3,
    spell: "create or destroy water",
    resource: CallToTheWaveResource,
  },
];

const CallToTheWaveMethod = new InnateSpellcasting(
  "Call to the Wave",
  "con",
  bonusSpellResourceFinder(CallToTheWaveSpells),
);

const CallToTheWave = bonusSpellsFeature(
  "Call to the Wave",
  `You know the shape water cantrip. When you reach 3rd level, you can cast the create or destroy water spell as a 2nd-level spell once with this trait, and you regain the ability to cast it this way when you finish a long rest. Constitution is your spellcasting ability for these spells.`,
  "level",
  CallToTheWaveMethod,
  CallToTheWaveSpells,
  undefined,
  () => {
    // me.knownSpells.add(ShapeWater);
    // me.preparedSpells.add(ShapeWater);
  },
);

const Swim = new SimpleFeature(
  "Swim",
  `You have a swimming speed of 30 feet.`,
  (g, me) => {
    const swimSpeed = Math.max(me.movement.get("swim") ?? 0, 30);
    me.movement.set("swim", swimSpeed);
  },
);

export const WaterGenasi: PCRace = {
  parent: Genasi,
  name: "Water Genasi",
  size: SizeCategory.Medium,
  abilities: new Map([["wis", 1]]),
  features: new Set([AcidResistance, Amphibious, Swim, CallToTheWave]),
};
