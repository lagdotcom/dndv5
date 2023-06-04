import {
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../../features/common";
import ProtectionFromEvilAndGood from "../../../spells/level1/ProtectionFromEvilAndGood";
import Sanctuary from "../../../spells/level1/Sanctuary";
import PCSubclass from "../../../types/PCSubclass";
import { PaladinSpellcasting } from "../common";

// TODO
const SacredWeapon = notImplementedFeature(
  "Channel Divinity: Sacred Weapon",
  `As an action, you can imbue one weapon that you are holding with positive energy, using your Channel Divinity. For 1 minute, you add your Charisma modifier to attack rolls made with that weapon (with a minimum bonus of +1). The weapon also emits bright light in a 20-foot radius and dim light 20 feet beyond that. If the weapon is not already magical, it becomes magical for the duration.

You can end this effect on your turn as part of any other action. If you are no longer holding or carrying this weapon, or if you fall unconscious, this effect ends.`
);

// TODO
const TurnTheUnholy = notImplementedFeature(
  "Channel Divinity: Turn the Unholy",
  `As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`
);

// TODO
const AuraOfDevotion = notImplementedFeature(
  "Aura of Devotion",
  `Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`
);

// TODO
const PurityOfSpirit = notImplementedFeature(
  "Purity of Spirit",
  `Beginning at 15th level, you are always under the effects of a protection from evil and good spell.`
);

// TODO
const HolyNimbus = notImplementedFeature(
  "Holy Nimbus",
  `At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that.

Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage.

In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead.

Once you use this feature, you can't use it again until you finish a long rest.

`
);

const OathSpells = bonusSpellsFeature(
  "Oath Spells",
  `You gain oath spells at the paladin levels listed.`,
  "Paladin",
  PaladinSpellcasting,
  [
    { level: 3, spell: ProtectionFromEvilAndGood },
    { level: 3, spell: Sanctuary },
    // TODO more Oath Spells
    // { level: 5, spell: LesserRestoration },
    // { level: 5, spell: ZoneOfTruth },
    // { level: 9, spell: BeaconOfHope },
    // { level: 9, spell: DispelMagic },
    // { level: 13, spell: FreedomOfMovement },
    // { level: 13, spell: GuardianOfFaith },
    // { level: 17, spell: Commune },
    // { level: 17, spell: FlameStrike },
  ],
  "Paladin"
);

const Devotion: PCSubclass = {
  className: "Paladin",
  name: "Oath ofDevotion",
  features: new Map([
    [3, [OathSpells, SacredWeapon, TurnTheUnholy]],
    [7, [AuraOfDevotion]],
    [15, [PurityOfSpirit]],
    [20, [HolyNimbus]],
  ]),
};
export default Devotion;
