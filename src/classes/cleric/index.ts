import { nonCombatFeature, notImplementedFeature } from "../../features/common";
import NormalSpellcasting from "../../spells/NormalSpellcasting";
import { abSet } from "../../types/AbilityName";
import { acSet, wcSet } from "../../types/Item";
import PCClass from "../../types/PCClass";
import { gains } from "../../utils/gain";
import { makeASI } from "../common";
import ChannelDivinity from "./ChannelDivinity";
import HarnessDivinePower from "./HarnessDivinePower";
import TurnUndead from "./TurnUndead";

const ClericSpellcasting = new NormalSpellcasting(
  "Cleric",
  `As a conduit for divine power, you can cast cleric spells.`,
  "wis",
  "full",
  "Cleric",
  "Cleric",
);

const CantripVersatility = nonCombatFeature(
  "Cantrip Versatility",
  `Whenever you reach a level in this class that grants the Ability Score Improvement feature, you can replace one cantrip you learned from this class's Spellcasting feature with another cantrip from the cleric spell list.`,
);

// TODO
const DivineIntervention = notImplementedFeature(
  "Divine Intervention",
  `Beginning at 10th level, you can call on your deity to intervene on your behalf when your need is great.

Imploring your deity's aid requires you to use your action. Describe the assistance you seek, and roll percentile dice. If you roll a number equal to or lower than your cleric level, your deity intervenes. The DM chooses the nature of the intervention; the effect of any cleric spell or cleric domain spell would be appropriate. If your deity intervenes, you can't use this feature again for 7 days. Otherwise, you can use it again after you finish a long rest.

At 20th level, your call for intervention succeeds automatically, no roll required.`,
);

export const ASI4 = makeASI("Cleric", 4);
export const ASI8 = makeASI("Cleric", 8);
export const ASI12 = makeASI("Cleric", 12);
export const ASI16 = makeASI("Cleric", 16);
export const ASI19 = makeASI("Cleric", 19);

const Cleric: PCClass = {
  name: "Cleric",
  hitDieSize: 8,
  armor: acSet("light", "medium", "shield"),
  weaponCategory: wcSet("simple"),
  save: abSet("wis", "cha"),
  skill: gains([], 2, [
    "History",
    "Insight",
    "Medicine",
    "Persuasion",
    "Religion",
  ]),
  multi: {
    requirements: new Map([["wis", 13]]),
    armor: acSet("light", "medium", "shield"),
  },

  features: new Map([
    [1, [ClericSpellcasting.feature]],
    [2, [ChannelDivinity, TurnUndead, HarnessDivinePower]],
    [4, [ASI4, CantripVersatility]],
    [8, [ASI8]],
    [10, [DivineIntervention]],
    [12, [ASI12]],
    [16, [ASI16]],
    [19, [ASI19]],
  ]),
};
export default Cleric;
