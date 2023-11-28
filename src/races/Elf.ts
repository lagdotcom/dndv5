import CastSpell from "../actions/CastSpell";
import { Darkvision60, nonCombatFeature } from "../features/common";
import ConfiguredFeature from "../features/ConfiguredFeature";
import SimpleFeature from "../features/SimpleFeature";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import Spell from "../types/Spell";
import { ExtraLanguage, FeyAncestry } from "./common";

const KeenSenses = new SimpleFeature(
  "Keen Senses",
  `You have proficiency in the Perception skill.`,
  (g, me) => {
    me.addProficiency("Perception", "proficient");
  },
);

const Trance = nonCombatFeature(
  "Trance",
  `Elves don’t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The Common word for such meditation is “trance.”) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.`,
);

const Elf: PCRace = {
  name: "Elf",
  abilities: new Map([["dex", 2]]),
  size: "medium",
  movement: new Map([["speed", 30]]),
  features: new Set([Darkvision60, KeenSenses, FeyAncestry, Trance]),
  languages: laSet("Common", "Elvish"),
};

const ElfWeaponTraining = new SimpleFeature(
  "Elf Weapon Training",
  ``,
  (g, me) => {
    for (const weapon of [
      "longsword",
      "shortsword",
      "shortbow",
      "longbow",
    ] as const)
      me.addProficiency(weapon, "proficient");
  },
);

const CantripMethod = new InnateSpellcasting("Cantrip", "int", () => undefined);
const Cantrip = new ConfiguredFeature<Spell>(
  "Cantrip",
  `You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.`,
  (g, me, cantrip) => {
    if (cantrip.level !== 0 || cantrip.lists.includes("Wizard"))
      throw new Error(
        `${cantrip.name} is not a valid choice for Cantrip (Elf).`,
      );

    me.knownSpells.add(cantrip);

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me)
        actions.push(new CastSpell(g, me, CantripMethod, cantrip));
    });
  },
);

export const HighElf: PCRace = {
  parent: Elf,
  name: "High Elf",
  abilities: new Map([["int", 1]]),
  size: "medium",
  features: new Set([ElfWeaponTraining, Cantrip, ExtraLanguage]),
};
