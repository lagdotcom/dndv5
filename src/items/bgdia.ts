import AbstractAction from "../actions/AbstractAction";
import Effect from "../Effect";
import Engine from "../Engine";
import EvaluateLater from "../interruptions/EvaluateLater";
import MultiChoiceResolver from "../resolvers/MultiChoiceResolver";
import { DawnResource } from "../resources";
import { atSet } from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { WeaponItem } from "../types/Item";
import Priority from "../types/Priority";
import { isEquipmentAttuned } from "../utils/items";
import WondrousItemBase from "./WondrousItemBase";

interface FlameConfig {
  gauntlet: GauntletsOfFlamingFury;
  weapons: Set<WeaponItem>;
}

const GauntletsOfFlamingFuryEffect = new Effect<FlameConfig>(
  "Gauntlets of Flaming Fury",
  "turnEnd",
  (g) => {
    g.events.on(
      "GatherDamage",
      ({ detail: { attacker, target, weapon, interrupt, map } }) => {
        const config = attacker?.getEffectConfig(GauntletsOfFlamingFuryEffect);
        if (attacker && weapon && config?.weapons.has(weapon))
          interrupt.add(
            new EvaluateLater(
              attacker,
              config.gauntlet,
              Priority.Normal,
              async () => {
                const amount = await g.rollDamage(1, {
                  size: 6,
                  attacker,
                  damageType: "fire",
                  source: config.gauntlet,
                  tags: atSet("magical"),
                  target,
                });
                map.add("fire", amount);
              },
            ),
          );
      },
    );

    // TODO The flames last until you sheath or let go of either weapon.
  },
  { tags: ["magic"] },
);

const GauntletsOfFlamingFuryResource = new DawnResource(
  "Gauntlets of Flaming Fury",
  1,
);

interface ItemsConfig {
  items: WeaponItem[];
}

class GauntletsOfFlamingFuryAction extends AbstractAction<ItemsConfig> {
  constructor(
    g: Engine,
    actor: Combatant,
    private gauntlet: GauntletsOfFlamingFury,
  ) {
    super(
      g,
      actor,
      "Gauntlets of Flaming Fury",
      "implemented",
      {
        items: new MultiChoiceResolver(
          g,
          actor.weapons
            .filter(
              (w) => w.category !== "natural" && w.rangeCategory === "melee",
            )
            .map((value) => ({ label: value.name, value })),
          1,
          2,
        ),
      },
      {
        description: `As a bonus action, you can use the gauntlets to cause magical flames to envelop one or two melee weapons in your grasp. Each flaming weapon deals an extra 1d6 fire damage on a hit. The flames last until you sheath or let go of either weapon. Once used, this property can't be used again until the next dawn.`,
        resources: [[GauntletsOfFlamingFuryResource, 1]],
        time: "bonus action",
      },
    );
  }

  getTargets() {
    return [];
  }
  getAffected() {
    return [this.actor];
  }

  async apply(config: ItemsConfig) {
    await super.apply(config);
    const { gauntlet, actor } = this;

    await actor.addEffect(GauntletsOfFlamingFuryEffect, {
      duration: Infinity,
      gauntlet,
      weapons: new Set(config.items),
    });
  }
}

export class GauntletsOfFlamingFury extends WondrousItemBase {
  constructor(g: Engine) {
    super(g, "gauntlets of flaming fury");
    this.attunement = true;
    this.rarity = "Rare";

    // While you wear both of these steel gauntlets, any non-magical weapon you grasp with either gauntlet is treated as a magic weapon.
    g.events.on("BeforeAttack", ({ detail: { who, weapon, tags } }) => {
      if (isEquipmentAttuned(this, who) && weapon?.category !== "natural")
        tags.add("magical");
    });

    // As a bonus action, you can use the gauntlets to cause magical flames to envelop one or two melee weapons in your grasp. Each flaming weapon deals an extra 1d6 fire damage on a hit. The flames last until you sheath or let go of either weapon. Once used, this property can't be used again until the next dawn.
    g.events.on("CombatantFinalising", ({ detail: { who } }) => {
      if (isEquipmentAttuned(this, who))
        who.initResource(GauntletsOfFlamingFuryResource);
    });

    g.events.on("GetActions", ({ detail: { who, actions } }) => {
      if (isEquipmentAttuned(this, who))
        actions.push(new GauntletsOfFlamingFuryAction(g, who, this));
    });
  }
}
