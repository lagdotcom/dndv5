import { bonusSpellsFeature } from "../../../features/common";
import ProtectionFromEvilAndGood from "../../../spells/level1/ProtectionFromEvilAndGood";
import Sanctuary from "../../../spells/level1/Sanctuary";
import PCSubclass from "../../../types/PCSubclass";
import { PaladinSpellcasting } from "../common";

// TODO Sacred Weapon, Turn the Unholy, Aura of Devotion, Purity of Spirit, Holy Nimbus

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
  features: new Map([[3, [OathSpells]]]),
};
export default Devotion;
