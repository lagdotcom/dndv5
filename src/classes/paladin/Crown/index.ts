import AbstractAction from "../../../actions/AbstractAction";
import { HasTargets } from "../../../configs";
import Engine from "../../../Engine";
import {
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import { canBeHeardBy, ErrorFilter } from "../../../filters";
import MultiTargetResolver from "../../../resolvers/MultiTargetResolver";
import Combatant from "../../../types/Combatant";
import PCSubclass from "../../../types/PCSubclass";
import { ChannelDivinityResource } from "../../common";
import { PaladinIcon, PaladinSpellcasting } from "../common";

const OathSpells = bonusSpellsFeature(
  "Oath Spells",
  `You gain oath spells at the paladin levels listed.`,
  "Paladin",
  PaladinSpellcasting,
  [
    { level: 3, spell: "command" },
    // TODO { level: 3, spell: "compelled duel" },
    // TODO { level: 5, spell: "warding bond" },
    // { level: 5, spell: "zone of truth" },
    // TODO { level: 9, spell: "aura of vitality" },
    { level: 9, spell: "spirit guardians" },
    // TODO { level: 13, spell: "banishment" },
    // TODO { level: 13, spell: "guardian of faith" },
    // TODO { level: 17, spell: "circle of power" },
    // { level: 17, spell: "geas" },
  ],
  "Paladin",
);

// TODO
const ChampionChallenge = notImplementedFeature(
  "Channel Divinity: Champion Challenge",
  `As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.`,
);

const noMoreThanHalfHitPoints: ErrorFilter<Combatant> = {
  name: "no more than half hit points",
  message: "too healthy",
  check(g, action, value) {
    const ratio = value.hp / value.hpMax;
    return ratio <= 0.5;
  },
};

class TurnTheTideAction extends AbstractAction<HasTargets> {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Channel Divinity: Turn the Tide",
      "implemented",
      {
        targets: new MultiTargetResolver(g, 1, Infinity, 30, [
          canBeHeardBy,
          noMoreThanHalfHitPoints,
        ]),
      },
      {
        heal: [
          { type: "dice", amount: { count: 1, size: 6 } },
          { type: "flat", amount: Math.max(1, actor.cha.modifier) },
        ],
        resources: [[ChannelDivinityResource, 1]],
        subIcon: PaladinIcon,
        tags: ["vocal"],
        time: "bonus action",
        description: `As a bonus action, you can bolster injured creatures with your Channel Divinity. Each creature of your choice that can hear you within 30 feet of you regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half of its hit points.`,
      },
    );
  }

  getTargets({ targets }: Partial<HasTargets>) {
    return targets ?? [];
  }
  getAffected({ targets }: HasTargets) {
    return targets;
  }

  async apply(config: HasTargets) {
    await super.apply(config);
    const { g, actor } = this;

    const heal =
      Math.max(1, actor.cha.modifier) +
      (await g.rollHeal(1, { size: 6, actor, source: this }));

    for (const target of config.targets)
      await g.heal(this, heal, { action: this, actor, target });
  }
}

const TurnTheTide = new SimpleFeature(
  "Channel Divinity: Turn the Tide",
  `As a bonus action, you can bolster injured creatures with your Channel Divinity. Each creature of your choice that can hear you within 30 feet of you regains hit points equal to 1d6 + your Charisma modifier (minimum of 1) if it has no more than half of its hit points.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new TurnTheTideAction(g, me));
    });
  },
);

// TODO
const DivineAllegiance = notImplementedFeature(
  "Divine Allegiance",
  `Starting at 7th level, when a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.`,
);

// TODO
const UnyieldingSpirit = notImplementedFeature(
  "Unyielding Spirit",
  `Starting at 15th level, you have advantage on saving throws to avoid becoming paralyzed or stunned.`,
);

// TODO
const ExaltedChampion = notImplementedFeature(
  "Exalted Champion",
  `At 20th level, your presence on the field of battle is an inspiration to those dedicated to your cause. You can use your action to gain the following benefits for 1 hour:

You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.
Your allies have advantage on death saving throws while within 30 feet of you.
You have advantage on Wisdom saving throws, as do your allies within 30 feet of you.
This effect ends early if you are incapacitated or die. Once you use this feature, you can't use it again until you finish a long rest.`,
);

const Crown: PCSubclass = {
  className: "Paladin",
  name: "Oath of the Crown",
  features: new Map([
    [3, [OathSpells, ChampionChallenge, TurnTheTide]],
    [7, [DivineAllegiance]],
    [15, [UnyieldingSpirit]],
    [20, [ExaltedChampion]],
  ]),
};
export default Crown;
