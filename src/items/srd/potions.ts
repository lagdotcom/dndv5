import Engine from "../../Engine";
import { DiceCount, Modifier } from "../../flavours";
import Action from "../../types/Action";
import Combatant from "../../types/Combatant";
import { ItemRarity } from "../../types/Item";
import AbstractPotion from "../AbstractPotion";
import { GiantStats, GiantType } from "./common";

export class PotionOfGiantStrength extends AbstractPotion {
  constructor(
    g: Engine,
    public type: GiantType,
  ) {
    super(
      g,
      `Potion of ${type} Giant Strength`,
      GiantStats[type].potionRarity,
      "missing",
      `When you drink this potion, your Strength score changes to ${GiantStats[type].str} for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.`,
    );
  }

  async apply() {
    // TODO [GETSCORE] When you drink this potion, your Strength score changes to {number} for 1 hour. The potion has no effect on you if your Strength is equal to or greater than that score.
  }
}

const HealingPotionStrengths = [
  "standard",
  "greater",
  "superior",
  "supreme",
] as const;
type HealingPotionStrength = (typeof HealingPotionStrengths)[number];

const HealingPotionData: Record<
  HealingPotionStrength,
  { name: string; rarity: ItemRarity; dice: DiceCount; bonus: Modifier }
> = {
  standard: { name: "Potion of Healing", rarity: "Common", dice: 2, bonus: 2 },
  greater: {
    name: "Potion of Greater Healing",
    rarity: "Uncommon",
    dice: 4,
    bonus: 4,
  },
  superior: {
    name: "Potion of Superior Healing",
    rarity: "Rare",
    dice: 8,
    bonus: 8,
  },
  supreme: {
    name: "Potion of Supreme Healing",
    rarity: "Very Rare",
    dice: 10,
    bonus: 20,
  },
};

export class PotionOfHealing extends AbstractPotion {
  constructor(
    g: Engine,
    public type: HealingPotionStrength,
  ) {
    super(
      g,
      HealingPotionData[type].name,
      HealingPotionData[type].rarity,
      "implemented",
    );

    const { dice, bonus } = HealingPotionData[type];
    this.description = `You regain ${dice}d4 + ${bonus} hit points when you drink this potion. The potion's red liquid glimmers when agitated.`;
  }

  async apply(actor: Combatant, action: Action) {
    const { dice, bonus } = HealingPotionData[this.type];

    const rolled = await this.g.rollHeal(dice, {
      size: 4,
      source: this,
      actor,
      target: actor,
    });
    await this.g.heal(this, rolled + bonus, {
      action,
      actor,
      target: actor,
    });
  }

  getDrinkAction(actor: Combatant) {
    const action = super.getDrinkAction(actor);
    action.time = "bonus action";
    return action;
  }
}
