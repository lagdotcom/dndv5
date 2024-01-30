import { notImplementedFeature } from "../../../features/common";
import PCSubclass from "../../../types/PCSubclass";

// TODO
const SpeechOfTheWoods = notImplementedFeature(
  "Speech of the Woods",
  `At 2nd level, you gain the ability to converse with beasts and many fey.

You learn to speak, read, and write Sylvan. In addition, beasts can understand your speech, and you gain the ability to decipher their noises and motions. Most beasts lack the intelligence to convey or understand sophisticated concepts, but a friendly beast could relay what it has seen or heard in the recent past. This ability doesn't grant you friendship with beasts, though you can combine this ability with gifts to curry favor with them as you would with any nonplayer character.`,
);

// TODO
const SpiritTotem = notImplementedFeature(
  "Spirit Totem",
  `Starting at 2nd level, you can call forth nature spirits to influence the world around you. As a bonus action, you can magically summon an incorporeal spirit to a point you can see within 60 feet of you. The spirit creates an aura in a 30-foot radius around that point. It counts as neither a creature nor an object, though it has the spectral appearance of the creature it represents.

As a bonus action, you can move the spirit up to 60 feet to a point you can see.

The spirit persists for 1 minute or until you're incapacitated. Once you use this feature, you can't use it again until you finish a short or long rest.

The effect of the spirit's aura depends on the type of spirit you summon from the options below.

- Bear Spirit. The bear spirit grants you and your allies its might and endurance. Each creature of your choice in the aura when the spirit appears gains temporary hit points equal to 5 + your druid level. In addition, you and your allies gain advantage on Strength checks and Strength saving throws while in the aura.
- Hawk Spirit. The hawk spirit is a consummate hunter, aiding you and your allies with its keen sight. When a creature makes an attack roll against a target in the spirit's aura, you can use your reaction to grant advantage to that attack roll. In addition, you and your allies have advantage on Wisdom (Perception) checks while in the aura.
- Unicorn Spirit. The unicorn spirit lends its protection to those nearby. You and your allies gain advantage on all ability checks made to detect creatures in the spirit's aura. In addition, if you cast a spell using a spell slot that restores hit points to any creature inside or outside the aura, each creature of your choice in the aura also regains hit points equal to your druid level.`,
);

// TODO
const MightySummoner = notImplementedFeature(
  "Mighty Summoner",
  `Starting at 6th level, beasts and fey that you conjure are more resilient than normal. Any beast or fey summoned or created by a spell that you cast gains the following benefits:

The creature appears with more hit points than normal: 2 extra hit points per Hit Die it has.
The damage from its natural weapons is considered magical for the purpose of overcoming immunity and resistance to nonmagical attacks and damage.`,
);

// TODO
const GuardianSpirit = notImplementedFeature(
  "Guardian Spirit",
  `Beginning at 10th level, your Spirit Totem safeguards the beasts and fey that you call forth with your magic. When a beast or fey that you summoned or created with a spell ends its turn in your Spirit Totem aura, that creature regains a number of hit points equal to half your druid level.`,
);

// TODO
const FaithfulSummons = notImplementedFeature(
  "Faithful Summons",
  `Starting at 14th level, the nature spirits you commune with protect you when you are the most defenseless. If you are reduced to 0 hit points or are incapacitated against your will, you can immediately gain the benefits of conjure animals as if it were cast using a 9th-level spell slot. It summons four beasts of your choice that are challenge rating 2 or lower. The conjured beasts appear within 20 feet of you. If they receive no commands from you, they protect you from harm and attack your foes. The spell lasts for 1 hour, requiring no concentration, or until you dismiss it (no action required).

Once you use this feature, you can't use it again until you finish a long rest.`,
);

const Shepherd: PCSubclass = {
  className: "Druid",
  name: "Circle of the Shepherd",
  features: new Map([
    [2, [SpeechOfTheWoods, SpiritTotem]],
    [6, [MightySummoner]],
    [10, [GuardianSpirit]],
    [14, [FaithfulSummons]],
  ]),
};
export default Shepherd;
