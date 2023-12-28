import airUrl from "@img/tok/air-elemental.png";
import earthUrl from "@img/tok/earth-elemental.png";
import fireUrl from "@img/tok/fire-elemental.png";
import waterUrl from "@img/tok/water-elemental.png";

import { OnFire } from "../../effects";
import Engine from "../../Engine";
import { notImplementedFeature } from "../../features/common";
import SimpleFeature from "../../features/SimpleFeature";
import EvaluateLater from "../../interruptions/EvaluateLater";
import Monster from "../../Monster";
import { atSet } from "../../types/AttackTag";
import Combatant from "../../types/Combatant";
import { SpecifiedWithin } from "../../types/EffectArea";
import Priority from "../../types/Priority";
import SizeCategory from "../../types/SizeCategory";
import { _dd } from "../../utils/dice";
import { distance } from "../../utils/units";
import { ExhaustionImmunity, MundaneDamageResistance } from "../common";
import { makeMultiattack } from "../multiattack";
import NaturalWeapon from "../NaturalWeapon";

const DoubleAttack = makeMultiattack(
  `The elemental makes two attacks.`,
  (me) => me.attacksSoFar.length < 2,
);

class Elemental extends Monster {
  constructor(g: Engine, name: string, tokenUrl: string, hpMax: number) {
    super(g, name, 5, "elemental", SizeCategory.Large, tokenUrl, hpMax);

    this.addFeature(MundaneDamageResistance);
    this.damageResponses.set("poison", "immune");
    this.addFeature(ExhaustionImmunity);
    this.conditionImmunities.add("Paralyzed");
    this.conditionImmunities.add("Petrified");
    this.conditionImmunities.add("Poisoned");
    this.conditionImmunities.add("Unconscious");
    this.senses.set("darkvision", 60);
    this.pb = 3;

    this.addFeature(DoubleAttack);
  }
}

// TODO
const AirForm = notImplementedFeature(
  "Air Form",
  `The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.`,
);

// TODO
const Whirlwind = notImplementedFeature(
  "Whirlwind",
  `Whirlwind (Recharge 4–6). Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone.
If the saving throw is successful, the target takes half the bludgeoning damage and isn't flung away or knocked prone.`,
);

export class AirElemental extends Elemental {
  constructor(g: Engine) {
    super(g, "air elemental", airUrl, 90);
    this.movement.set("speed", 0);
    this.movement.set("fly", 90); // TODO hover
    this.setAbilityScores(14, 20, 14, 6, 10, 6);
    this.damageResponses.set("lightning", "resist");
    this.damageResponses.set("thunder", "resist");
    this.conditionImmunities.add("Grappled");
    this.conditionImmunities.add("Prone");
    this.conditionImmunities.add("Restrained");
    this.languages.add("Auran");

    this.addFeature(AirForm);

    this.naturalWeapons.add(
      new NaturalWeapon(g, "Slam", "dex", _dd(2, 8, "bludgeoning")),
    );
    this.addFeature(Whirlwind);
  }
}

// TODO
const EarthGlide = notImplementedFeature(
  "Earth Glide",
  `The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.`,
);

// TODO
const SiegeMonster = notImplementedFeature(
  "Siege Monster",
  `The elemental deals double damage to objects and structures.`,
);

export class EarthElemental extends Elemental {
  constructor(g: Engine) {
    super(g, "earth elemental", earthUrl, 126);
    this.naturalAC = 18;
    this.movement.set("speed", 30);
    this.movement.set("burrow", 30);
    this.setAbilityScores(20, 8, 20, 5, 10, 5);
    this.damageResponses.set("thunder", "vulnerable");
    this.senses.set("tremorsense", 60);
    this.languages.add("Terran");

    this.addFeature(EarthGlide);
    this.addFeature(SiegeMonster);

    this.naturalWeapons.add(
      new NaturalWeapon(g, "Slam", "str", _dd(2, 8, "bludgeoning")),
    );
  }
}

const FireForm = new SimpleFeature(
  "Fire Form",
  `The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns.`,
  (g, me) => {
    // TODO The elemental can move through a space as narrow as 1 inch wide without squeezing.

    const applyFireDamage = async (target: Combatant) => {
      const damage = await g.rollDamage(1, {
        size: 10,
        damageType: "fire",
        attacker: me,
        source: FireForm,
        tags: atSet(),
        target,
      });
      await g.damage(FireForm, "fire", { attacker: me, target }, [
        ["fire", damage],
      ]);
    };

    // TODO A creature that touches the elemental

    // ...or hits it with a melee attack while within 5 feet of it takes 5 (1d10) fire damage.
    g.events.on(
      "Attack",
      ({
        detail: {
          roll: {
            type: { target, tags, who: attacker },
          },
          outcome,
          interrupt,
        },
      }) => {
        if (
          target === me &&
          outcome.hits &&
          tags.has("melee") &&
          distance(attacker, me) <= 5
        )
          interrupt.add(
            new EvaluateLater(me, FireForm, Priority.Late, async () => {
              if (outcome.hits) await applyFireDamage(attacker);
            }),
          );
      },
    );

    // TODO In addition, the elemental can enter a hostile creature's space and stop there.

    // The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns.
    const area: SpecifiedWithin = { type: "within", who: me, radius: 0 };
    const thisTurn = new Set<Combatant>();
    g.events.on("TurnStarted", () => thisTurn.clear());
    g.events.on("CombatantMoved", ({ detail: { who, interrupt } }) => {
      if (who === me)
        for (const target of g
          .getInside(area, [me])
          .filter((other) => !thisTurn.has(other))) {
          thisTurn.add(target);
          interrupt.add(
            new EvaluateLater(me, FireForm, Priority.Normal, async () => {
              await applyFireDamage(target);
              await target.addEffect(OnFire, { duration: Infinity }, me);
            }),
          );
        }
    });
  },
);

// TODO
const Illumination = notImplementedFeature(
  "Illumination",
  `The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 feet.`,
);

// TODO
const WaterSusceptibility = notImplementedFeature(
  "Water Susceptibility",
  `For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.`,
);

export class FireElemental extends Elemental {
  constructor(g: Engine) {
    super(g, "fire elemental", fireUrl, 102);
    this.movement.set("speed", 50);
    this.setAbilityScores(10, 17, 16, 6, 10, 7);
    this.damageResponses.set("fire", "immune");
    this.conditionImmunities.add("Grappled");
    this.conditionImmunities.add("Prone");
    this.conditionImmunities.add("Restrained");
    this.languages.add("Ignan");

    this.addFeature(FireForm);
    this.addFeature(Illumination);
    this.addFeature(WaterSusceptibility);

    this.naturalWeapons.add(
      new NaturalWeapon(g, "Touch", "dex", _dd(2, 6, "fire"), {
        onHit: async (target) => {
          await target.addEffect(OnFire, { duration: Infinity }, this);
        },
      }),
    );
  }
}

// TODO
const Whelm = notImplementedFeature(
  "Whelm",
  `Whelm (Recharge 4–6). Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental's space.
The elemental can grapple one Large creature or up to two Medium or smaller creatures at one time. At the start of each of the elemental's turns, each target grappled by it takes 13 (2d8 + 4) bludgeoning damage. A creature within 5 feet of the elemental can pull a creature or object out of it by taking an action to make a DC 14 Strength check and succeeding.`,
);

export class WaterElemental extends Elemental {
  constructor(g: Engine) {
    super(g, "water elemental", waterUrl, 114);
    this.naturalAC = 12;
    this.movement.set("speed", 30);
    this.movement.set("swim", 90);
    this.setAbilityScores(18, 14, 18, 5, 10, 8);
    this.damageResponses.set("acid", "resist");
    this.conditionImmunities.add("Grappled");
    this.conditionImmunities.add("Prone");
    this.conditionImmunities.add("Restrained");
    this.languages.add("Aquan");

    this.naturalWeapons.add(
      new NaturalWeapon(g, "Slam", "str", _dd(2, 8, "bludgeoning")),
    );
    this.addFeature(Whelm);
  }
}
