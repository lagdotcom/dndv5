import AbstractAction from "../actions/AbstractAction";
import { aimCone } from "../aim";
import ErrorCollector from "../collectors/ErrorCollector";
import { HasPoint } from "../configs";
import Effect from "../Effect";
import Engine from "../Engine";
import SimpleFeature from "../features/SimpleFeature";
import PointResolver from "../resolvers/PointResolver";
import { LongRestResource } from "../resources";
import Combatant from "../types/Combatant";
import DamageType from "../types/DamageType";
import { SpecifiedEffectShape } from "../types/EffectArea";
import ImplementationStatus from "../types/ImplementationStatus";
import PCRace from "../types/PCRace";
import Point from "../types/Point";
import { _dd } from "../utils/dice";
import { getSaveDC } from "../utils/dnd";
import { resistanceFeature } from "./common";

const MetallicDragonborn: PCRace = {
  name: "Dragonborn (Metallic)",
  size: "medium",
  movement: new Map([["speed", 30]]),
};

type Ancestry = "Brass" | "Bronze" | "Copper" | "Gold" | "Silver";

const BreathWeaponResource = new LongRestResource("Breath Weapon", 2);
const MetallicBreathWeaponResource = new LongRestResource(
  "Metallic Breath Weapon",
  1
);

class BreathWeaponAction extends AbstractAction<HasPoint> {
  constructor(
    g: Engine,
    actor: Combatant,
    public damageType: DamageType,
    public damageDice: number
  ) {
    super(
      g,
      actor,
      "Breath Weapon",
      "incomplete",
      { point: new PointResolver(g, 15) },
      undefined,
      undefined,
      [_dd(damageDice, 10, damageType)]
    );

    this.isAttack = true;
  }

  private getArea(point: Point) {
    const position = this.g.getState(this.actor).position;
    const size = this.actor.sizeInUnits;
    return aimCone(position, size, point, 15);
  }

  getAffectedArea({
    point,
  }: Partial<HasPoint>): SpecifiedEffectShape[] | undefined {
    if (point) return [this.getArea(point)];
  }

  check(config: never, ec: ErrorCollector) {
    if (!this.actor.hasResource(BreathWeaponResource))
      ec.add("No breath weapons left", this);

    return super.check(config, ec);
  }

  async apply({ point }: HasPoint) {
    const { actor: attacker, g, damageDice, damageType } = this;

    super.apply({ point });
    attacker.spendResource(BreathWeaponResource);
    attacker.attacksSoFar.add(this);

    const damage = await g.rollDamage(damageDice, {
      source: this,
      attacker,
      size: 10,
      damageType,
    });
    const dc = 8 + attacker.con.modifier + attacker.pb;

    for (const target of g.getInside(this.getArea(point))) {
      const save = await g.savingThrow(dc, {
        attacker,
        who: target,
        ability: "dex",
        tags: new Set(),
      });

      await g.damage(
        this,
        damageType,
        { attacker, target },
        [[damageType, damage]],
        save.damageResponse
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

class MetallicBreathAction extends AbstractAction<HasPoint> {
  constructor(
    g: Engine,
    actor: Combatant,
    name: string,
    status: ImplementationStatus = "missing"
  ) {
    super(g, actor, name, status, {
      point: new PointResolver(g, 15),
    });
  }

  getArea(point: Point) {
    const position = this.g.getState(this.actor).position;
    const size = this.actor.sizeInUnits;
    return aimCone(position, size, point, 15);
  }

  getAffectedArea({
    point,
  }: Partial<HasPoint>): SpecifiedEffectShape[] | undefined {
    if (point) return [this.getArea(point)];
  }

  check(config: Partial<HasPoint>, ec: ErrorCollector): ErrorCollector {
    if (!this.actor.hasResource(MetallicBreathWeaponResource))
      ec.add("no metallic breath weapon left", this);

    return super.check(config, ec);
  }

  async apply(config: HasPoint) {
    super.apply(config);
    this.actor.spendResource(MetallicBreathWeaponResource);
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
  }
);

class EnervatingBreathAction extends MetallicBreathAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Enervating Breath", "implemented");
  }

  async apply(config: HasPoint) {
    super.apply(config);
    const { g, actor } = this;
    const dc = getSaveDC(actor, "con");

    for (const target of g.getInside(this.getArea(config.point))) {
      const save = await g.savingThrow(dc, {
        attacker: actor,
        ability: "con",
        who: target,
        tags: new Set(["Incapacitated"]),
      });

      if (!save) target.addEffect(EnervatingBreathEffect, { duration: 2 });
    }
  }
}

class RepulsionBreathAction extends MetallicBreathAction {
  constructor(g: Engine, actor: Combatant) {
    super(g, actor, "Repulsion Breath", "incomplete");
  }

  async apply(config: HasPoint) {
    super.apply(config);
    const { g, actor } = this;
    const dc = getSaveDC(actor, "con");

    for (const target of g.getInside(this.getArea(config.point))) {
      const save = await g.savingThrow(dc, {
        attacker: actor,
        ability: "str",
        who: target,
        tags: new Set(["Prone"]),
      });

      if (!save) {
        // TODO [FORCEMOVE] pushed 20 feet away from you
        // TODO [PRONE] knocked prone
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
              getBreathWeaponDamageDice(me.level)
            )
          );
      });
    }
  );

  const draconicResistance = resistanceFeature(
    "Draconic Resistance",
    `You have resistance to the damage type associated with your Metallic Ancestry.`,
    [dt]
  );

  const metallicBreathWeapon = new SimpleFeature(
    "Metallic Breath Weapon",
    `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus. Whenever you use this trait, choose one:

  - Enervating Breath. Each creature in the cone must succeed on a Constitution saving throw or become incapacitated until the start of your next turn.

  - Repulsion Breath. Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.

  Once you use your Metallic Breath Weapon, you can’t do so again until you finish a long rest.`,
    (g, me) => {
      if (me.level < 5) return;
      console.warn(
        `[Feature Not Complete] Metallic Breath Weapon (on ${me.name})`
      );

      me.initResource(MetallicBreathWeaponResource);
      g.events.on("GetActions", ({ detail: { who, actions } }) => {
        if (who === me) {
          actions.push(new EnervatingBreathAction(g, me));
          actions.push(new RepulsionBreathAction(g, me));
        }
      });
    }
  );

  return {
    parent: MetallicDragonborn,
    name: `${a} Dragonborn`,
    size: "medium",
    features: new Set([breathWeapon, draconicResistance, metallicBreathWeapon]),
  };
}

export const BronzeDragonborn = makeAncestry("Bronze", "lightning");
