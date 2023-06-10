import { notImplementedFeature } from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import PCSubclass from "../../../types/PCSubclass";
import { RageEffect } from "../Rage";

// TODO [EXHAUSTION]
const Frenzy = notImplementedFeature(
  "Frenzy",
  `Starting when you choose this path at 3rd level, you can go into a frenzy when you rage. If you do so, for the duration of your rage you can make a single melee weapon attack as a bonus action on each of your turns after this one. When your rage ends, you suffer one level of exhaustion.`
);

const MindlessRage = new SimpleFeature(
  "Mindless Rage",
  `Beginning at 6th level, you can't be charmed or frightened while raging. If you are charmed or frightened when you enter your rage, the effect is suspended for the duration of the rage.`,
  (g, me) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who === me && me.hasEffect(RageEffect)) {
        conditions.ignoreValue("Charmed");
        conditions.ignoreValue("Frightened");
      }
    });

    // TODO [CANCELEFFECT] can't be charmed or frightened while raging
  }
);

// TODO [FRIGHTENED]
const IntimidatingPresence = notImplementedFeature(
  "Intimidating Presence",
  `Beginning at 10th level, you can use your action to frighten someone with your menacing presence. When you do so, choose one creature that you can see within 30 feet of you. If the creature can see or hear you, it must succeed on a Wisdom saving throw (DC equal to 8 + your proficiency bonus + your Charisma modifier) or be frightened of you until the end of your next turn. On subsequent turns, you can use your action to extend the duration of this effect on the frightened creature until the end of your next turn. This effect ends if the creature ends its turn out of line of sight or more than 60 feet away from you.

If the creature succeeds on its saving throw, you can't use this feature on that creature again for 24 hours.`
);

// TODO
const Retaliation = notImplementedFeature(
  "Retaliation",
  `Starting at 14th level, when you take damage from a creature that is within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.`
);

const Berserker: PCSubclass = {
  className: "Barbarian",
  name: "Path of the Berserker",
  features: new Map([
    [3, [Frenzy]],
    [6, [MindlessRage]],
    [10, [IntimidatingPresence]],
    [14, [Retaliation]],
  ]),
};
export default Berserker;
