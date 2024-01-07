import Engine from "../../../Engine";
import {
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import ProtectionFromEvilAndGood from "../../../spells/level1/ProtectionFromEvilAndGood";
import Sanctuary from "../../../spells/level1/Sanctuary";
import LesserRestoration from "../../../spells/level2/LesserRestoration";
import Combatant from "../../../types/Combatant";
import PCSubclass from "../../../types/PCSubclass";
import { TurnUndeadAction } from "../../cleric/TurnUndead";
import { getAuraOfProtection } from "../AuraOfProtection";
import { PaladinIcon, PaladinSpellcasting } from "../common";
import SacredWeapon from "./SacredWeapon";

class TurnTheUnholyAction extends TurnUndeadAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, ["fiend", "undead"], PaladinSpellcasting);
    this.name = "Turn the Unholy";
    this.subIcon = PaladinIcon;
    this.description = `As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.

    A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`;
  }
}

const TurnTheUnholy = new SimpleFeature(
  "Channel Divinity: Turn the Unholy",
  `As an action, you present your holy symbol and speak a prayer censuring fiends and undead, using your Channel Divinity. Each fiend or undead that can see or hear you within 30 feet of you must make a Wisdom saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes damage.

A turned creature must spend its turns trying to move as far away from you as it can, and it can't willingly move to a space within 30 feet of you. It also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new TurnTheUnholyAction(g, me));
    });
  },
);

const AuraOfDevotion = new SimpleFeature(
  "Aura of Devotion",
  `Starting at 7th level, you and friendly creatures within 10 feet of you can't be charmed while you are conscious.

At 18th level, the range of this aura increases to 30 feet.`,
  (g, me) => {
    const aura = getAuraOfProtection(me);
    if (!aura) return;

    g.events.on("BeforeEffect", ({ detail: { who, config, success } }) => {
      if (
        who.side === me.side &&
        config?.conditions?.has("Charmed") &&
        aura.isAffecting(who)
      )
        success.add("fail", AuraOfDevotion);
    });
  },
);

// TODO
const PurityOfSpirit = notImplementedFeature(
  "Purity of Spirit",
  `Beginning at 15th level, you are always under the effects of a protection from evil and good spell.`,
);

// TODO
const HolyNimbus = notImplementedFeature(
  "Holy Nimbus",
  `At 20th level, as an action, you can emanate an aura of sunlight. For 1 minute, bright light shines from you in a 30-foot radius, and dim light shines 30 feet beyond that.

Whenever an enemy creature starts its turn in the bright light, the creature takes 10 radiant damage.

In addition, for the duration, you have advantage on saving throws against spells cast by fiends or undead.

Once you use this feature, you can't use it again until you finish a long rest.`,
);

const OathSpells = bonusSpellsFeature(
  "Oath Spells",
  `You gain oath spells at the paladin levels listed.`,
  "Paladin",
  PaladinSpellcasting,
  [
    { level: 3, spell: ProtectionFromEvilAndGood },
    { level: 3, spell: Sanctuary },
    { level: 5, spell: LesserRestoration },
    // TODO { level: 5, spell: ZoneOfTruth },
    // TODO { level: 9, spell: BeaconOfHope },
    // TODO { level: 9, spell: DispelMagic },
    // TODO { level: 13, spell: FreedomOfMovement },
    // TODO { level: 13, spell: GuardianOfFaith },
    // TODO { level: 17, spell: Commune },
    // TODO { level: 17, spell: FlameStrike },
  ],
  "Paladin",
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
