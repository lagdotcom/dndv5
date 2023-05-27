import { notImplementedFeature } from "../features/common";
import SimpleFeature from "../features/SimpleFeature";
import DamageType from "../types/DamageType";
import PCRace from "../types/PCRace";

const MetallicDragonborn: PCRace = {
  name: "Dragonborn (Metallic)",
  size: "medium",
  movement: new Map([["speed", 30]]),
};

type Ancestry = "Brass" | "Bronze" | "Copper" | "Gold" | "Silver";

function makeAncestry(a: Ancestry, dt: DamageType): PCRace {
  // TODO
  const breathWeapon = notImplementedFeature(
    "Breath Weapon",
    `When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in a 15-foot cone. Each creature in that area must make a Dexterity saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). On a failed save, the creature takes 1d10 damage of the type associated with your Metallic Ancestry. On a successful save, it takes half as much damage. This damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).

  You can use your Breath Weapon a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`
  );

  const draconicResistance = new SimpleFeature(
    "Draconic Resistance",
    `You have resistance to the damage type associated with your Metallic Ancestry.`,
    (g, me) => {
      g.events.on(
        "getDamageResponse",
        ({ detail: { who, damageType, response } }) => {
          if (who === me && damageType === dt)
            response.add("resist", draconicResistance);
        }
      );
    }
  );

  // TODO
  const metallicBreathWeapon = notImplementedFeature(
    "Metallic Breath Weapon",
    `At 5th level, you gain a second breath weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation in a 15-foot cone. The save DC for this breath is 8 + your Constitution modifier + your proficiency bonus. Whenever you use this trait, choose one:

  - Enervating Breath. Each creature in the cone must succeed on a Constitution saving throw or become incapacitated until the start of your next turn.

  - Repulsion Breath. Each creature in the cone must succeed on a Strength saving throw or be pushed 20 feet away from you and be knocked prone.

  Once you use your Metallic Breath Weapon, you can’t do so again until you finish a long rest.`
  );

  return {
    parent: MetallicDragonborn,
    name: `${a} Dragonborn`,
    size: "medium",
    features: new Set([breathWeapon, draconicResistance, metallicBreathWeapon]),
  };
}

export const BronzeDragonborn = makeAncestry("Bronze", "lightning");
