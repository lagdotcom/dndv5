import {
  AbstractSelfAction,
  AbstractSingleTargetAction,
} from "../actions/AbstractAction";
import { HasTarget } from "../configs";
import Effect from "../Effect";
import Engine from "../Engine";
import {
  bonusSpellsFeature,
  Darkvision60,
  notImplementedFeature,
} from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import { Modifier } from "../flavours";
import YesNoChoice from "../interruptions/YesNoChoice";
import OncePerTurnController from "../OncePerTurnController";
import TargetResolver from "../resolvers/TargetResolver";
import { LongRestResource } from "../resources";
import InnateSpellcasting from "../spells/InnateSpellcasting";
import Combatant from "../types/Combatant";
import PCRace from "../types/PCRace";
import Priority from "../types/Priority";
import SizeCategory from "../types/SizeCategory";
import { minutes } from "../utils/time";
import { resistanceFeature } from "./common";

const CelestialResistance = resistanceFeature(
  "Celestial Resistance",
  `You have resistance to necrotic damage and radiant damage.`,
  ["necrotic", "radiant"],
);

const HealingHandsResource = new LongRestResource("Healing Hands", 1);

class HealingHandsAction extends AbstractSingleTargetAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Healing Hands",
      "implemented",
      { target: new TargetResolver(g, actor.reach, []) },
      {
        heal: [{ type: "flat", amount: actor.level as Modifier }],
        resources: [[HealingHandsResource, 1]],
        time: "action",
        description: `As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest.`,
      },
    );
  }

  async applyEffect({ target }: HasTarget) {
    const { g, actor } = this;
    await g.heal(HealingHands, actor.level, { action: this, actor, target });
  }
}

const HealingHands = new SimpleFeature(
  "Healing Hands",
  `As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can't use it again until you finish a long rest.`,
  (g, me) => {
    me.initResource(HealingHandsResource);
    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (who === me) actions.push(new HealingHandsAction(g, me));
    });
  },
);

const LightBearerMethod = new InnateSpellcasting("Light Bearer", "cha");
const LightBearer = bonusSpellsFeature(
  "Light Bearer",
  `You know the light cantrip. Charisma is your spellcasting ability for it.`,
  "level",
  LightBearerMethod,
  [
    // TODO { level: 1, spell: "light" }
  ],
);

const Aasimar: PCRace = {
  name: "Aasimar",
  abilities: new Map([["cha", 2]]),
  size: SizeCategory.Medium,
  movement: new Map([["speed", 30]]),
  features: new Set([
    Darkvision60,
    CelestialResistance,
    HealingHands,
    LightBearer,
  ]),
  languages: new Set(["Common", "Celestial"]),
};

const AasimarTransformationResource = new LongRestResource(
  "Aasimar Transformation",
  1,
);

// TODO
const NecroticShroud = notImplementedFeature(
  "Necrotic Shroud",
  `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn.
Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level.

Once you use this trait, you can't use it again until you finish a long rest.`,
);

export const FallenAasimar: PCRace = {
  parent: Aasimar,
  name: "Fallen Aasimar",
  size: SizeCategory.Medium,
  abilities: new Map([["str", 1]]),
  features: new Set([NecroticShroud]),
};

class EndRadiantSoulAction extends AbstractSelfAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "End Transformation",
      "implemented",
      {},
      {
        time: "bonus action",
        description: `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.
      Your transformation lasts for 1 minute or until you end it as a bonus action.`,
      },
    );
  }

  async applyEffect() {
    await this.actor.removeEffect(RadiantSoulEffect);
  }
}

const RadiantSoulEffect = new Effect("Radiant Soul", "turnStart", (g) => {
  g.events.on("GetActions", ({ detail: { who, actions } }) => {
    if (who.hasEffect(RadiantSoulEffect))
      actions.push(new EndRadiantSoulAction(g, who));
  });

  // TODO During it, you have a flying speed of 30 feet[...]

  // [...]and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.
  const opt = new OncePerTurnController(g);
  g.events.on(
    "GatherDamage",
    ({ detail: { attacker, attack, spell, interrupt, map } }) => {
      if (
        attacker?.hasEffect(RadiantSoulEffect) &&
        (attack || spell) &&
        opt.canBeAffected(attacker)
      ) {
        const amount = attacker.level;
        interrupt.add(
          new YesNoChoice(
            attacker,
            RadiantSoul,
            "Radiant Soul",
            `Add ${amount} bonus radiant damage to this attack or spell?`,
            Priority.Normal,
            async () => {
              opt.affect(attacker);
              map.add("radiant", amount);
            },
          ),
        );
      }
    },
  );
});

class RadiantSoulAction extends AbstractSelfAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Radiant Soul",
      "implemented",
      {},
      {
        resources: [[AasimarTransformationResource, 1]],
        time: "action",
        description: `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.
        Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.
        
        Once you use this trait, you can't use it again until you finish a long rest.`,
      },
    );
  }

  async applyEffect() {
    await this.actor.addEffect(RadiantSoulEffect, { duration: minutes(1) });
  }
}

const RadiantSoul = new SimpleFeature(
  "Radiant Soul",
  `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.
Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.

Once you use this trait, you can't use it again until you finish a long rest.`,
  (g, me) => {
    if (me.level >= 3) {
      me.initResource(AasimarTransformationResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) actions.push(new RadiantSoulAction(g, me));
      });
    }
  },
);

export const ProtectorAasimar: PCRace = {
  parent: Aasimar,
  name: "Protector Aasimar",
  size: SizeCategory.Medium,
  abilities: new Map([["wis", 1]]),
  features: new Set([RadiantSoul]),
};

// TODO
const RadiantConsumption = notImplementedFeature(
  "Radiant Consumption",
  `Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you.
Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.

Once you use this trait, you can't use it again until you finish a long rest.`,
);

export const ScourgeAasimar: PCRace = {
  parent: Aasimar,
  name: "Scourge Aasimar",
  size: SizeCategory.Medium,
  abilities: new Map([["con", 1]]),
  features: new Set([RadiantConsumption]),
};
