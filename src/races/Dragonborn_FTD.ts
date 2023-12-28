import breathUrl from "@img/act/breath.svg";
import specialBreathUrl from "@img/act/special-breath.svg";

import AbstractAttackAction from "../actions/AbstractAttackAction";
import { aimCone } from "../aim";
import { DamageColours, makeIcon } from "../colours";
import { HasPoint } from "../configs";
import Effect from "../Effect";
import { Prone } from "../effects";
import Engine from "../Engine";
import SimpleFeature from "../features/SimpleFeature";
import PointResolver from "../resolvers/PointResolver";
import { LongRestResource } from "../resources";
import { atSet } from "../types/AttackTag";
import Combatant from "../types/Combatant";
import { coSet } from "../types/ConditionName";
import DamageType from "../types/DamageType";
import { SpecifiedEffectShape } from "../types/EffectArea";
import ImplementationStatus from "../types/ImplementationStatus";
import { laSet } from "../types/LanguageName";
import PCRace from "../types/PCRace";
import Point from "../types/Point";
import SizeCategory from "../types/SizeCategory";
import { _dd } from "../utils/dice";
import { resistanceFeature } from "./common";

const MetallicDragonborn: PCRace = {
  name: "Dragonborn (Metallic)",
  size: SizeCategory.Medium,
  movement: new Map([["speed", 30]]),
  languages: laSet("Common"),
};

type Ancestry = "Brass" | "Bronze" | "Copper" | "Gold" | "Silver";

const BreathWeaponResource = new LongRestResource("Breath Weapon", 2);
const MetallicBreathWeaponResource = new LongRestResource(
  "Metallic Breath Weapon",
  1,
);

function getBreathArea(me: Combatant, point: Point) {
  const size = me.sizeInUnits;
  return aimCone(me.position, size, point, 15);
}

class BreathWeaponAction extends AbstractAttackAction<HasPoint> {
  constructor(
    g: Engine,
    actor: Combatant,
    public damageType: DamageType,
    public damageDice: number,
  ) {
    super(
      g,
      actor,
      "Breath Weapon",
      "implemented",
      "breath weapon",
      "ranged",
      { point: new PointResolver(g, 15) },
      {
        icon: makeIcon(breathUrl, DamageColours[damageType]),
        damage: [_dd(damageDice, 10, damageType)],
        resources: [[BreathWeaponResource, 1]],
        description: `When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in a 15-foot cone. Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). On a failed save, the creature takes 1d10 damage of the type associated with your Metallic Ancestry. On a successful save, it takes half as much damage. This damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).
        You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
      },
    );
  }

  getAffectedArea({ point }: Partial<HasPoint>) {
    if (point) return [getBreathArea(this.actor, point)];
  }
  getAffected({ point }: HasPoint) {
    return this.g.getInside(getBreathArea(this.actor, point), [this.actor]);
  }
  getTargets() {
    return [];
  }

  async apply({ point }: HasPoint) {
    await super.apply({ point });
    const { actor: attacker, g, damageDice, damageType } = this;

    const damage = await g.rollDamage(damageDice, {
      source: this,
      attacker,
      size: 10,
      damageType,
      tags: atSet("breath weapon"),
    });

    for (const target of g.getInside(getBreathArea(attacker, point))) {
      const { damageResponse } = await g.save({
        source: this,
        type: { type: "ability", ability: "con" },
        attacker,
        who: target,
        ability: "dex",
      });

      await g.damage(
        this,
        damageType,
        { attacker, target },
        [[damageType, damage]],
        damageResponse,
      );
    }
  }
}

function getBreathWeaponDamageDice(level: number) {
  if (level < 5) return 1;
  if (level < 11) return 2;
  if (level < 17) return 3;
  return 4;
}

class MetallicBreathAction extends AbstractAttackAction<HasPoint> {
  constructor(
    g: Engine,
    actor: Combatant,
    name: string,
    status: ImplementationStatus = "missing",
    description: string,
    iconColour?: string,
  ) {
    super(
      g,
      actor,
      name,
      status,
      "metallic breath weapon",
      "ranged",
      { point: new PointResolver(g, 15) },
      {
        resources: [[MetallicBreathWeaponResource, 1]],
        description,
        icon: makeIcon(specialBreathUrl, iconColour),
      },
    );
  }

  getAffectedArea({
    point,
  }: Partial<HasPoint>): SpecifiedEffectShape[] | undefined {
    if (point) return [getBreathArea(this.actor, point)];
  }
  getAffected({ point }: HasPoint) {
    return this.g.getInside(getBreathArea(this.actor, point), [this.actor]);
  }
  getTargets() {
    return [];
  }
}

const EnervatingBreathEffect = new Effect(
  "Enervating Breath",
  "turnStart",
  (g) => {
    g.events.on("GetConditions", ({ detail: { who, conditions } }) => {
      if (who.hasEffect(EnervatingBreathEffect))
        conditions.add("Incapacitated", EnervatingBreathEffect);
    });
  },
);

class EnervatingBreathAction extends MetallicBreathAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Enervating Breath",
      "implemented",
      `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus.
      Each creature in the cone must succeed on a Constitution saving throw or become incapacitated until the start of your next turn.`,
    );
  }

  async apply({ point }: HasPoint) {
    await super.apply({ point });

    const { g, actor } = this;
    const config = { conditions: coSet("Incapacitated"), duration: 2 };

    for (const target of g.getInside(getBreathArea(actor, point))) {
      const { outcome } = await g.save({
        source: this,
        type: { type: "ability", ability: "con" },
        attacker: actor,
        ability: "con",
        who: target,
        effect: EnervatingBreathEffect,
        config,
      });

      if (outcome === "fail")
        await target.addEffect(EnervatingBreathEffect, config, actor);
    }
  }
}

class RepulsionBreathAction extends MetallicBreathAction {
  constructor(g: Engine, actor: Combatant) {
    super(
      g,
      actor,
      "Repulsion Breath",
      "implemented",
      `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus.
      Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.`,
    );
  }

  async apply({ point }: HasPoint) {
    await super.apply({ point });
    const { g, actor } = this;
    for (const target of g.getInside(getBreathArea(actor, point))) {
      const config = { duration: Infinity };
      const { outcome } = await g.save({
        source: this,
        type: { type: "ability", ability: "con" },
        attacker: actor,
        ability: "str",
        who: target,
        effect: Prone,
        config,
      });

      if (outcome === "fail") {
        await g.forcePush(target, actor, 20, this);
        await target.addEffect(Prone, config);
      }
    }
  }
}

function makeAncestry(a: Ancestry, dt: DamageType): PCRace {
  const breathWeapon = new SimpleFeature(
    "Breath Weapon",
    `When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in a 15-foot cone. Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). On a failed save, the creature takes 1d10 damage of the type associated with your Metallic Ancestry. On a successful save, it takes half as much damage. This damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).

  You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
    (g, me) => {
      me.initResource(BreathWeaponResource, me.pb);

      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me)
          actions.push(
            new BreathWeaponAction(
              g,
              me,
              dt,
              getBreathWeaponDamageDice(me.level),
            ),
          );
      });
    },
  );

  const draconicResistance = resistanceFeature(
    "Draconic Resistance",
    `You have resistance to the damage type associated with your Metallic Ancestry.`,
    [dt],
  );

  const metallicBreathWeapon = new SimpleFeature(
    "Metallic Breath Weapon",
    `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus. Whenever you use this trait, choose one:

  - Enervating Breath. Each creature in the cone must succeed on a Constitution saving throw or become incapacitated until the start of your next turn.

  - Repulsion Breath. Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.

  Once you use your Metallic Breath Weapon, you can’t do so again until you finish a long rest.`,
    (g, me) => {
      if (me.level < 5) return;

      me.initResource(MetallicBreathWeaponResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          actions.push(new EnervatingBreathAction(g, me));
          actions.push(new RepulsionBreathAction(g, me));
        }
      });
    },
  );

  return {
    parent: MetallicDragonborn,
    name: `${a} Dragonborn`,
    size: SizeCategory.Medium,
    features: new Set([breathWeapon, draconicResistance, metallicBreathWeapon]),
  };
}

export const BronzeDragonborn = makeAncestry("Bronze", "lightning");
export const GoldDragonborn = makeAncestry("Gold", "fire");
