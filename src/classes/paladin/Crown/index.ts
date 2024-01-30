import {
  AbstractMultiTargetAction,
  AbstractSingleTargetAction,
} from "../../../actions/AbstractAction";
import { HasTargets } from "../../../configs";
import Effect from "../../../Effect";
import Engine from "../../../Engine";
import { Listener } from "../../../events/Dispatcher";
import { GatherDamageDetail } from "../../../events/GatherDamageEvent";
import {
  BonusSpellEntry,
  bonusSpellsFeature,
  notImplementedFeature,
} from "../../../features/common";
import SimpleFeature from "../../../features/SimpleFeature";
import { canBeHeardBy, canSee, ErrorFilter, notSelf } from "../../../filters";
import { PCClassLevel } from "../../../flavours";
import EvaluateLater from "../../../interruptions/EvaluateLater";
import YesNoChoice from "../../../interruptions/YesNoChoice";
import MultiTargetResolver from "../../../resolvers/MultiTargetResolver";
import TargetResolver from "../../../resolvers/TargetResolver";
import Combatant from "../../../types/Combatant";
import { coSet } from "../../../types/ConditionName";
import { EffectConfig } from "../../../types/EffectType";
import PCSubclass from "../../../types/PCSubclass";
import Priority from "../../../types/Priority";
import { checkConfig } from "../../../utils/config";
import { getTotalDamage } from "../../../utils/dnd";
import { intersects } from "../../../utils/set";
import { compareDistances, distance } from "../../../utils/units";
import { ChannelDivinityResource } from "../../common";
import { PaladinIcon, PaladinSpellcasting } from "../common";

const CrownOathSpellsList: BonusSpellEntry<PCClassLevel>[] = [
  { level: 3, spell: "command" },
  { level: 3, spell: "compelled duel" },
  { level: 5, spell: "warding bond" },
  { level: 5, spell: "zone of truth" },
  { level: 9, spell: "aura of vitality" },
  { level: 9, spell: "spirit guardians" },
  { level: 13, spell: "banishment" },
  { level: 13, spell: "guardian of faith" },
  { level: 17, spell: "circle of power" },
  { level: 17, spell: "geas" },
];

const CrownOathSpells = bonusSpellsFeature(
  "Oath Spells",
  `You gain oath spells at the paladin levels listed.`,
  "Paladin",
  PaladinSpellcasting,
  CrownOathSpellsList,
  "Paladin",
);

interface ChallengeConfig {
  inflictor: Combatant;
}

const ChampionChallengeEffect = new Effect<ChallengeConfig>(
  "Champion Challenge",
  "turnStart",
  (g) => {
    // On a failed save, creature can't willingly move more than 30 feet away from you
    g.events.on("BeforeMove", ({ detail: { who, from, to, error } }) => {
      const efConfig = who.getEffectConfig(ChampionChallengeEffect);
      if (!efConfig) return;

      const { oldDistance, newDistance } = compareDistances(
        efConfig.inflictor,
        efConfig.inflictor.position,
        who,
        from,
        to,
      );
      if (oldDistance <= 30 && newDistance > 30)
        error.add(
          `must stay near ${efConfig.inflictor.name}`,
          ChampionChallengeEffect,
        );
    });

    // This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.
    const cleanup: Listener<"AfterAction" | "CombatantMoved"> = ({
      detail: { interrupt },
    }) => {
      for (const who of g.combatants) {
        const efConfig = who.getEffectConfig(ChampionChallengeEffect);
        if (!efConfig) continue;

        if (
          efConfig.inflictor.conditions.has("Incapacitated") ||
          distance(efConfig.inflictor, who) > 30
        )
          interrupt.add(
            new EvaluateLater(
              who,
              ChampionChallengeEffect,
              Priority.Normal,
              () => who.removeEffect(ChampionChallengeEffect),
            ),
          );
      }
    };
    g.events.on("AfterAction", cleanup);
    g.events.on("CombatantMoved", cleanup);
  },
);

class ChampionChallengeAction extends AbstractMultiTargetAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Channel Divinity: Champion Challenge",
      "implemented",
      { targets: new MultiTargetResolver(g, 1, Infinity, 30, [canSee]) },
      {
        description: `As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.`,
        resources: [[ChannelDivinityResource, 1]],
        subIcon: PaladinIcon,
        time: "bonus action",
      },
    );
  }

  async applyEffect(actionConfig: never) {
    const { g, actor } = this;

    for (const who of this.getAffected(actionConfig)) {
      const effect = ChampionChallengeEffect;
      const config: EffectConfig<ChallengeConfig> = {
        inflictor: actor,
        duration: Infinity,
      };

      const result = await g.save({
        source: this,
        type: PaladinSpellcasting.getSaveType(),
        attacker: actor,
        who,
        ability: "wis",
        effect,
        config,
        tags: ["charm"],
      });
      if (result.outcome === "fail") await who.addEffect(effect, config, actor);
    }
  }
}

const ChampionChallenge = new SimpleFeature(
  "Channel Divinity: Champion Challenge",
  `As a bonus action, you issue a challenge that compels other creatures to do battle with you. Each creature of your choice that you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature can't willingly move more than 30 feet away from you. This effect ends on the creature if you are incapacitated or die or if the creature is more than 30 feet away from you.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new ChampionChallengeAction(g, me));
    });
  },
);

const noMoreThanHalfHitPoints: ErrorFilter<Combatant> = {
  name: "no more than half hit points",
  message: "too healthy",
  check(g, action, value) {
    const ratio = value.hp / value.hpMax;
    return ratio <= 0.5;
  },
};

class TurnTheTideAction extends AbstractMultiTargetAction {
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

  async applyEffect({ targets }: HasTargets) {
    const { g, actor } = this;

    const heal =
      Math.max(1, actor.cha.modifier) +
      (await g.rollHeal(1, { size: 6, actor, source: this }));

    for (const target of targets)
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

class DivineAllegianceAction extends AbstractSingleTargetAction {
  constructor(
    g: Engine,
    actor: Combatant,
    private gather?: GatherDamageDetail,
  ) {
    super(
      g,
      actor,
      "Divine Allegiance",
      "implemented",
      { target: new TargetResolver(g, 5, [canSee, notSelf]) },
      {
        description: `When a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.`,
        time: "reaction",
      },
    );
  }

  async applyEffect() {
    const { g, actor, gather } = this;
    if (!gather)
      throw new Error(`DivineAllegiance.apply() without GatherDamage`);

    const total = getTotalDamage(gather);
    if (total > 0) {
      gather.multiplier.add("zero", this);
      await g.damage(this, "unpreventable", { target: actor }, [
        ["unpreventable", total],
      ]);
    }
  }
}

const DivineAllegiance = new SimpleFeature(
  "Divine Allegiance",
  `Starting at 7th level, when a creature within 5 feet of you takes damage, you can use your reaction to magically substitute your own health for that of the target creature, causing that creature not to take the damage. Instead, you take the damage. This damage to you can't be reduced or prevented in any way.`,
  (g, me) => {
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new DivineAllegianceAction(g, who));
    });
    g.events.on("GatherDamage", ({ detail }) => {
      const action = new DivineAllegianceAction(g, me, detail);
      const config = { target: detail.target };

      if (checkConfig(g, action, config))
        detail.interrupt.add(
          new YesNoChoice(
            me,
            DivineAllegiance,
            "Divine Allegiance",
            "...",
            Priority.Late,
            () => g.act(action, config),
            undefined,
            () => getTotalDamage(detail) > 0,
          ).setDynamicText(
            () =>
              `${detail.target.name} is about to take ${getTotalDamage(detail)} damage. Should ${action.actor.name} use their reaction to take it for them?`,
          ),
        );
    });
  },
);

const unyieldingSpiritConditions = coSet("Paralyzed", "Stunned");
const UnyieldingSpirit = new SimpleFeature(
  "Unyielding Spirit",
  `Starting at 15th level, you have advantage on saving throws to avoid becoming paralyzed or stunned.`,
  (g, me) => {
    g.events.on("BeforeSave", ({ detail: { who, config, diceType } }) => {
      if (
        who === me &&
        config?.conditions &&
        intersects(config.conditions, unyieldingSpiritConditions)
      )
        diceType.add("advantage", UnyieldingSpirit);
    });
  },
);

// TODO
const ExaltedChampion = notImplementedFeature(
  "Exalted Champion",
  `At 20th level, your presence on the field of battle is an inspiration to those dedicated to your cause. You can use your action to gain the following benefits for 1 hour:
- You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.
- Your allies have advantage on death saving throws while within 30 feet of you.
- You have advantage on Wisdom saving throws, as do your allies within 30 feet of you.

This effect ends early if you are incapacitated or die. Once you use this feature, you can't use it again until you finish a long rest.`,
);

const Crown: PCSubclass = {
  className: "Paladin",
  name: "Oath of the Crown",
  features: new Map([
    [3, [CrownOathSpells, ChampionChallenge, TurnTheTide]],
    [7, [DivineAllegiance]],
    [15, [UnyieldingSpirit]],
    [20, [ExaltedChampion]],
  ]),
};
export default Crown;
