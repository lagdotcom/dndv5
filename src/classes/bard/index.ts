import { ProficiencyRule } from "../../DndRules";
import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import ConfiguredFeature from "../../features/ConfiguredFeature";
import SimpleFeature from "../../features/SimpleFeature";
import MessageBuilder from "../../MessageBuilder";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import { abSet } from "../../types/AbilityName";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import SkillName, { SkillNames, skSet } from "../../types/SkillName";
import Spell from "../../types/Spell";
import { makeASI } from "../common";
import BardicInspiration, {
  BardicInspirationResource,
} from "./BardicInspiration";

export const BardSpellcasting = new NormalSpellcasting(
  "Bard",
  `You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music. Your spells are part of your vast repertoire, magic that you can tune to different situations.`,
  "cha",
  "full",
  "Bard",
  "Bard",
);

const JackOfAllTrades = new SimpleFeature(
  "Jack of All Trades",
  `Starting at 2nd level, you can add half your proficiency bonus, rounded down, to any ability check you make that doesn't already include your proficiency bonus.`,
  (g, me) => {
    const gain = Math.floor(me.pb / 2);

    g.events.on("BeforeCheck", ({ detail: { who, bonus } }) => {
      if (who === me && !bonus.isInvolved(ProficiencyRule))
        bonus.add(gain, JackOfAllTrades);
    });
  },
);

const SongOfRest = nonCombatFeature(
  "Song of Rest",
  `Beginning at 2nd level, you can use soothing music or oration to help revitalize your wounded allies during a short rest. If you or any friendly creatures who can hear your performance regain hit points by spending Hit Dice at the end of the short rest, each of those creatures regains an extra 1d6 hit points.

The extra hit points increase when you reach certain levels in this class: to 1d8 at 9th level, to 1d10 at 13th level, and to 1d12 at 17th level.`,
);

// TODO
const MagicalInspiration = notImplementedFeature(
  "Magical Inspiration",
  `If a creature has a Bardic Inspiration die from you and casts a spell that restores hit points or deals damage, the creature can roll that die and choose a target affected by the spell. Add the number rolled as a bonus to the hit points regained or the damage dealt. The Bardic Inspiration die is then lost.`,
);

export const Expertise = new ConfiguredFeature<SkillName[]>(
  "Expertise",
  `At 3rd level, choose two of your skill proficiencies. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.

  At 10th level, you can choose another two skill proficiencies to gain this benefit.`,
  (g, me, config) => {
    for (const entry of config) {
      if (me.skills.has(entry)) me.skills.set(entry, 2);
      else console.warn(`Expertise in ${entry} without existing proficiency`);
    }
  },
);

const BardicVersatility = nonCombatFeature(
  "Bardic Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can do one of the following, representing a change in focus as you use your skills and magic:

Replace one of the skills you chose for the Expertise feature with one of your other skill proficiencies that isn't benefiting from Expertise.
Replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the bard spell list.`,
);

const FontOfInspiration = nonCombatFeature(
  "Font of Inspiration",
  `Beginning when you reach 5th level, you regain all of your expended uses of Bardic Inspiration when you finish a short or long rest.`,
);

// TODO
const Countercharm = notImplementedFeature(
  "Countercharm",
  `At 6th level, you gain the ability to use musical notes or words of power to disrupt mind-influencing effects. As an action, you can start a performance that lasts until the end of your next turn. During that time, you and any friendly creatures within 30 feet of you have advantage on saving throws against being frightened or charmed. A creature must be able to hear you to gain this benefit. The performance ends early if you are incapacitated or silenced or if you voluntarily end it (no action required).`,
);

const MagicalSecrets = new ConfiguredFeature<Spell[]>(
  "Magical Secrets",
  `By 10th level, you have plundered magical knowledge from a wide spectrum of disciplines. Choose two spells from any classes, including this one. A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.

The chosen spells count as bard spells for you and are included in the number in the Spells Known column of the Bard table.

You learn two additional spells from any classes at 14th level and again at 18th level.`,
  (g, me, spells) => {
    // TODO A spell you choose must be of a level you can cast, as shown on the Bard table, or a cantrip.

    for (const spell of spells) {
      me.knownSpells.add(spell);
      BardSpellcasting.addCastableSpell(spell, me);
    }
  },
);

const SuperiorInspiration = new SimpleFeature(
  "Superior Inspiration",
  `At 20th level, when you roll initiative and have no uses of Bardic Inspiration left, you regain one use.`,
  (g, me) => {
    g.events.on("GetInitiative", ({ detail }) => {
      if (detail.who === me && me.getResource(BardicInspirationResource) < 1) {
        g.text(
          new MessageBuilder()
            .co(me)
            .text("recovers a use of Bardic Inspiration."),
        );
        me.giveResource(BardicInspirationResource, 1);
      }
    });
  },
);

export const ASI4 = makeASI("Bard", 4);
export const ASI8 = makeASI("Bard", 8);
export const ASI12 = makeASI("Bard", 12);
export const ASI16 = makeASI("Bard", 16);
export const ASI19 = makeASI("Bard", 19);

const Bard: PCClass = {
  name: "Bard",
  hitDieSize: 8,
  armorProficiencies: acSet("light"),
  weaponCategoryProficiencies: wcSet("simple"),
  weaponProficiencies: new Set([
    "hand crossbow",
    "longsword",
    "rapier",
    "shortsword",
  ]),
  // TODO Tools: three musical instruments of your choice,
  saveProficiencies: abSet("dex", "cha"),
  skillChoices: 3,
  skillProficiencies: skSet(...SkillNames),
  features: new Map([
    [1, [BardicInspiration, BardSpellcasting.feature]],
    [2, [JackOfAllTrades, SongOfRest, MagicalInspiration]],
    [3, [Expertise]],
    [4, [ASI4, BardicVersatility]],
    [5, [FontOfInspiration]],
    [6, [Countercharm]],
    [8, [ASI8]],
    [10, [MagicalSecrets]],
    [12, [ASI12]],
    [16, [ASI16]],
    [19, [ASI19]],
    [20, [SuperiorInspiration]],
  ]),
};

export default Bard;
