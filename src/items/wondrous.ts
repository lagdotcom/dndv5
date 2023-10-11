import Engine from "../Engine";
import { ItemRarity, WondrousItem } from "../types/Item";
import AbstractItem from "./AbstractItem";

export class AbstractWondrous
  extends AbstractItem<"wondrous">
  implements WondrousItem
{
  constructor(g: Engine, name: string, hands = 0, iconUrl?: string) {
    super(g, "wondrous", name, hands, iconUrl);
  }
}

export class BracersOfTheArbalest extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Bracers of the Arbalest");
    this.attunement = true;
    this.rarity = "Uncommon";

    // TODO [GETPROFICIENCY] While wearing these bracers, you have proficiency with all crossbows

    // ... you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.
    g.events.on("GatherDamage", ({ detail: { attacker, weapon, bonus } }) => {
      if (
        attacker.equipment.has(this) &&
        attacker.attunements.has(this) &&
        weapon?.ammunitionTag === "crossbow"
      )
        bonus.add(2, this);
    });
  }
}

export class BootsOfTheWinterlands extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Boots of the Winterlands");
    this.attunement = true;
    this.rarity = "Uncommon";

    g.events.on(
      "GetDamageResponse",
      ({ detail: { who, damageType, response } }) => {
        if (
          who.equipment.has(this) &&
          who.attunements.has(this) &&
          damageType === "cold"
        )
          response.add("resist", this);
      },
    );

    // TODO [TERRAIN] You ignore difficult terrain created by ice or snow.

    // TODO You can tolerate temperatures as low as -50 degrees Fahrenheit without any additional protection. If you wear heavy clothes, you can tolerate temperatures as low as -100 degrees Fahrenheit.
  }
}

export class CloakOfProtection extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Cloak of Protection");
    this.attunement = true;
    this.rarity = "Uncommon";

    g.events.on("GetACMethods", ({ detail: { who, methods } }) => {
      if (who.equipment.has(this) && who.attunements.has(this))
        for (const method of methods) {
          method.ac++;
          method.uses.add(this);
        }
    });

    g.events.on("BeforeSave", ({ detail: { who, bonus } }) => {
      if (who.equipment.has(this) && who.attunements.has(this))
        bonus.add(1, this);
    });
  }
}

const DragonTouchedLevels = [
  "Slumbering",
  "Stirring",
  "Wakened",
  "Ascendant",
] as const;
type DragonTouchedLevel = (typeof DragonTouchedLevels)[number];
export class DragonTouchedFocus extends AbstractWondrous {
  constructor(g: Engine, level: DragonTouchedLevel) {
    super(g, `Dragon-Touched Focus (${level})`, 1);
    this.attunement = true;

    this.rarity = "Uncommon";
    // TODO [FOCUS] While you are holding the focus, it can function as a spellcasting focus for all your spells.
    g.events.on("GetInitiative", ({ detail: { who, diceType } }) => {
      if (who.equipment.has(this) && who.attunements.has(this))
        diceType.add("advantage", this);
    });
  }
}

export const FigurineTypes = [
  "Bronze Griffin",
  "Ebony Fly",
  "Golden Lions",
  "Ivory Goats",
  "Marble Elephant",
  "Obsidian Steed",
  "Onyx Dog",
  "Serpentine Owl",
  "Silver Raven",
] as const;
export type FigurineType = (typeof FigurineTypes)[number];

export const FigurineData: Record<FigurineType, { rarity: ItemRarity }> = {
  "Bronze Griffin": { rarity: "Rare" },
  "Ebony Fly": { rarity: "Rare" },
  "Golden Lions": { rarity: "Rare" },
  "Ivory Goats": { rarity: "Rare" },
  "Marble Elephant": { rarity: "Rare" },
  "Obsidian Steed": { rarity: "Very Rare" },
  "Onyx Dog": { rarity: "Rare" },
  "Serpentine Owl": { rarity: "Rare" },
  "Silver Raven": { rarity: "Uncommon" },
};

export class FigurineOfWondrousPower extends AbstractWondrous {
  constructor(
    g: Engine,
    public type: FigurineType,
  ) {
    super(g, `Figurine of Wondrous Power, ${type}`, 0);
    this.rarity = FigurineData[type].rarity;

    /* TODO [SUMMONING] If you use an action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.

The creature is friendly to you and your companions. It understands your languages and obeys your spoken commands. If you issue no commands, the creature defends itself but takes no other actions.

The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if it drops to 0 hit points or if you use an action to speak the command word again while touching it. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified in the figurine's description. */
  }
}

export class RingOfAwe extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Ring of Awe", 0);
    this.attunement = true;
    this.rarity = "Rare";

    // TODO [GETSCORE] While wearing this ring, your Charisma score increases by 1, to a maximum of 20.

    // TODO [FRIGHTENED] By holding the ring aloft and speaking a command word, you project a field of awe around you. Each creature of your choice in a 15-foot sphere centred on you must succeed on a DC 13 Wisdom save or become frightened for 1 minute. On each affected creature's turn, it may repeat the Wisdom saving throw. On a successful save, the effect ends for that creature. This property cannot be used again until the next dawn.
  }
}

export class SilverShiningAmulet extends AbstractWondrous {
  constructor(g: Engine) {
    super(g, "Silver Shining Amulet", 0);
    this.attunement = true;
    this.rarity = "Rare";

    // TODO [GETSAVEDC] While you wear the holy symbol, you gain a +1 bonus to spell attack rolls and the saving throw DCs of your spells.

    // TODO While you wear this amulet, you can use your Channel Divinity feature without expending one of the feature's uses. Once this property is used, it can't be used again until the next dawn.
  }
}
