import {
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import EvaluateLater from "../../../interruptions/EvaluateLater";
import BurningHands from "../../../spells/level1/BurningHands";
import Command from "../../../spells/level1/Command";
import Fireball from "../../../spells/level3/Fireball";
import WallOfFire from "../../../spells/level4/WallOfFire";
import PCSubclass from "../../../types/PCSubclass";
import Priority from "../../../types/Priority";
import { WarlockPactMagic } from "..";

const ExpandedSpellList = bonusSpellsFeature(
  "Expanded Spell List",
  `The Fiend lets you choose from an expanded list of spells when you learn a warlock spell. The following spells are added to the warlock spell list for you.`,
  "Warlock",
  WarlockPactMagic,
  [
    { level: 1, spell: BurningHands },
    { level: 1, spell: Command },
    // { level: 2, spell: BlindnessDeafness },
    // { level: 2, spell: ScorchingRay },
    { level: 3, spell: Fireball },
    // { level: 3, spell: StinkingCloud },
    // { level: 4, spell: FireShield },
    { level: 4, spell: WallOfFire },
    // { level: 5, spell: FlameStrike },
    // { level: 5, spell: Hallow },
  ],
  "Warlock",
);

const DarkOnesBlessing = new SimpleFeature(
  "Dark One's Blessing",
  `Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).`,
  (g, me) => {
    g.events.on(
      "CombatantDamaged",
      ({ detail: { attacker, who, interrupt } }) => {
        if (attacker === me && who.side !== me.side && who.hp < 1)
          interrupt.add(
            new EvaluateLater(me, DarkOnesBlessing, Priority.Late, async () => {
              if (who.hp < 1) {
                const amount = Math.max(
                  1,
                  me.cha.modifier + me.getClassLevel("Warlock", 1),
                );
                await g.giveTemporaryHP(me, amount, DarkOnesBlessing);
              }
            }),
          );
      },
    );
  },
);

// TODO
const DarkOnesOwnLuck = notImplementedFeature(
  "Dark One's Own Luck",
  `Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur.

Once you use this feature, you can't use it again until you finish a short or long rest.`,
);

// TODO
const FiendishResilience = notImplementedFeature(
  "Fiendish Resilience",
  `Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.`,
);

// TODO
const HurlThroughHell = notImplementedFeature(
  "Hurl Through Hell",
  `Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape.

At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience.

Once you use this feature, you can't use it again until you finish a long rest.`,
);

const Fiend: PCSubclass = {
  name: "The Fiend",
  className: "Warlock",
  features: new Map([
    [1, [ExpandedSpellList, DarkOnesBlessing]],
    [6, [DarkOnesOwnLuck]],
    [10, [FiendishResilience]],
    [14, [HurlThroughHell]],
  ]),
};
export default Fiend;
