import Engine from "../../../Engine";
import { ItemRarity } from "../../../types/Item";
import AbstractWondrous from "../../AbstractWondrous";

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

export default class FigurineOfWondrousPower extends AbstractWondrous {
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
