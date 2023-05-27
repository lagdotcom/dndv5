import CastSpell from "../../actions/CastSpell";
import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import PCClass from "../../types/PCClass";
import { makeASI } from "../common";

// TODO
const ArcaneRecovery = notImplementedFeature(
  "Arcane Recovery",
  `You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.

For example, if you're a 4th-level wizard, you can recover up to two levels worth of spell slots.

You can recover either a 2nd-level spell slot or two 1st-level spell slots.`
);

export const WizardSpellcasting = new NormalSpellcasting(
  "Wizard",
  "int",
  "full"
);
const Spellcasting = new SimpleFeature(
  "Spellcasting",
  `As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power.`,
  (g, me) => {
    WizardSpellcasting.initialise(me, me.classLevels.get("Wizard") ?? 1);

    g.events.on("getActions", ({ detail: { who, actions } }) => {
      if (who === me) {
        // TODO rituals in knownSpells

        for (const spell of me.preparedSpells) {
          if (spell.lists.includes("Wizard"))
            actions.push(new CastSpell(g, me, WizardSpellcasting, spell));
        }
      }
    });
  }
);

const CantripFormulas = nonCombatFeature(
  "Cantrip Formulas",
  `You have scribed a set of arcane formulas in your spellbook that you can use to formulate a cantrip in your mind. Whenever you finish a long rest and consult those formulas in your spellbook, you can replace one wizard cantrip you know with another cantrip from the wizard spell list.`
);

// TODO
const SpellMastery = notImplementedFeature(
  "Spell Mastery",
  `At 18th level, you have achieved such mastery over certain spells that you can cast them at will. Choose a 1st-level wizard spell and a 2nd-level wizard spell that are in your spellbook. You can cast those spells at their lowest level without expending a spell slot when you have them prepared. If you want to cast either spell at a higher level, you must expend a spell slot as normal.

By spending 8 hours in study, you can exchange one or both of the spells you chose for different spells of the same levels.`
);

// TODO
const SignatureSpells = notImplementedFeature(
  "Signature Spells",
  `When you reach 20th level, you gain mastery over two powerful spells and can cast them with little effort. Choose two 3rd-level wizard spells in your spellbook as your signature spells. You always have these spells prepared, they don't count against the number of spells you have prepared, and you can cast each of them once at 3rd level without expending a spell slot. When you do so, you can't do so again until you finish a short or long rest.

If you want to cast either spell at a higher level, you must expend a spell slot as normal.`
);

export const ASI4 = makeASI("Wizard", 4);
export const ASI8 = makeASI("Wizard", 8);
export const ASI12 = makeASI("Wizard", 12);
export const ASI16 = makeASI("Wizard", 16);
export const ASI19 = makeASI("Wizard", 19);

const Wizard: PCClass = {
  name: "Wizard",
  hitDieSize: 6,
  weaponProficiencies: new Set([
    "dagger",
    "dart",
    "sling",
    "quarterstaff",
    "light crossbow",
  ]),
  saveProficiencies: new Set(["int", "wis"]),
  skillChoices: 2,
  skillProficiencies: new Set([
    "Arcana",
    "History",
    "Insight",
    "Investigation",
    "Medicine",
    "Religion",
  ]),
  features: new Map([
    [1, [ArcaneRecovery, Spellcasting]],
    [3, [CantripFormulas]],
    [4, [ASI4]],
    [8, [ASI8]],
    [12, [ASI12]],
    [16, [ASI16]],
    [18, [SpellMastery]],
    [19, [ASI19]],
    [20, [SignatureSpells]],
  ]),
};
export default Wizard;
